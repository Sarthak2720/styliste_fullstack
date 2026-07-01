import cv2
import numpy as np
import torch
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import torch.nn.functional as F
from sota_mesh import SOTABodyModel
from ultralytics import YOLO

# MediaPipe compatibility definitions to avoid heavy mediapipe imports and C++ runtime warnings
class MockPoseLandmark:
    NOSE = 0
    LEFT_EYE_INNER = 1
    LEFT_EYE = 2
    LEFT_EYE_OUTER = 3
    RIGHT_EYE_INNER = 4
    RIGHT_EYE = 5
    RIGHT_EYE_OUTER = 6
    LEFT_EAR = 7
    RIGHT_EAR = 8
    MOUTH_LEFT = 9
    MOUTH_RIGHT = 10
    LEFT_SHOULDER = 11
    RIGHT_SHOULDER = 12
    LEFT_ELBOW = 13
    RIGHT_ELBOW = 14
    LEFT_WRIST = 15
    RIGHT_WRIST = 16
    LEFT_PINKY = 17
    RIGHT_PINKY = 18
    LEFT_INDEX = 19
    RIGHT_INDEX = 20
    LEFT_THUMB = 21
    RIGHT_THUMB = 22
    LEFT_HIP = 23
    RIGHT_HIP = 24
    LEFT_KNEE = 25
    RIGHT_KNEE = 26
    LEFT_ANKLE = 27
    RIGHT_ANKLE = 28
    LEFT_HEEL = 29
    RIGHT_HEEL = 30
    LEFT_FOOT_INDEX = 31
    RIGHT_FOOT_INDEX = 32

class MockPoseLandmarkValue:
    def __init__(self, val, name=""):
        self.value = val
        self.name = name

class MockPoseLandmarkContainer:
    def __init__(self):
        for name in dir(MockPoseLandmark):
            if not name.startswith('_'):
                val = getattr(MockPoseLandmark, name)
                setattr(self, name, MockPoseLandmarkValue(val, name))

class MockSolutionsPose:
    PoseLandmark = MockPoseLandmarkContainer()

class MockSolutionsHolistic:
    PoseLandmark = MockPoseLandmarkContainer()

class MockSolutions:
    pose = MockSolutionsPose
    holistic = MockSolutionsHolistic

class MockMP:
    solutions = MockSolutions

mp = MockMP()
mp_pose = mp.solutions.pose
mp_holistic = mp.solutions.holistic

class MockLandmark:
    def __init__(self, x, y, z=0.0, visibility=1.0):
        self.x = x
        self.y = y
        self.z = z
        self.visibility = visibility

COCO_TO_MEDIAPIPE = {
    0: 0,   # Nose -> Nose
    1: 2,   # Left Eye -> Left Eye
    2: 5,   # Right Eye -> Right Eye
    3: 7,   # Left Ear -> Left Ear
    4: 8,   # Right Ear -> Right Ear
    5: 11,  # Left Shoulder -> Left Shoulder
    6: 12,  # Right Shoulder -> Right Shoulder
    7: 13,  # Left Elbow -> Left Elbow
    8: 14,  # Right Elbow -> Right Elbow
    9: 15,  # Left Wrist -> Left Wrist
    10: 16, # Right Wrist -> Right Wrist
    11: 23, # Left Hip -> Left Hip
    12: 24, # Right Hip -> Right Hip
    13: 25, # Left Knee -> Left Knee
    14: 26, # Right Knee -> Right Knee
    15: 27, # Left Ankle -> Left Ankle
    16: 28, # Right Ankle -> Right Ankle
}

# Load YOLOv8 models globally on startup
pose_model = YOLO("yolov8m-pose.pt")
seg_model = YOLO("yolov8m-seg.pt")

app = Flask(__name__)
CORS(app)

# Constants
KNOWN_OBJECT_WIDTH_CM = 21.0  # A4 paper width in cm
FOCAL_LENGTH = 600  # Default focal length
DEFAULT_HEIGHT_CM = 152.0  # Default height if not provided

# Load depth estimation model (MiDaS small is kept as an auxiliary/fallback asset) - Commented out to save memory as it is unused
# def load_depth_model():
#     model = torch.hub.load("intel-isl/MiDaS", "MiDaS_small")
#     model.eval()
#     return model
# 
# depth_model = load_depth_model()

# Helper: Ramanujan's Ellipse Circumference Formula
def calculate_ellipse_circ(w_cm, d_cm):
    a = w_cm / 2
    b = d_cm / 2
    return np.pi * (3 * (a + b) - np.sqrt((3 * a + b) * (a + 3 * b)))

# Helper: Scan body width at a specific height in a binary mask
def get_width_from_mask(mask, height_py, center_px):
    h_dim = mask.shape[0]
    w_dim = mask.shape[1]
    height_py = int(height_py)
    
    # Boundary check
    if height_py >= h_dim:
        height_py = h_dim - 1
    if height_py < 0:
        height_py = 0
        
    line = mask[height_py, :]
    cx = int(center_px)
    if cx >= w_dim:
        cx = w_dim - 1
    if cx < 0:
        cx = 0
        
    # Scan left to find background edge (0)
    left_edge = cx
    for i in range(cx, 0, -1):
        if line[i] == 0:
            left_edge = i
            break
            
    # Scan right to find background edge (0)
    right_edge = cx
    for i in range(cx, len(line)):
        if line[i] == 0:
            right_edge = i
            break
            
    return right_edge - left_edge


def get_width_from_mask_robust(mask, height_py, center_px, band=5):
    """
    Robust silhouette width estimation.

    Scans ±band pixel rows around height_py and returns the MEDIAN of all valid
    measurements.  A single bad row (clothing texture edge, shadow, YOLO mask
    bleed) cannot skew the reading.  The median naturally sits between clothing
    puff and under-estimated readings.

    Args:
        mask      : binary mask (H × W uint8, values 0 or 255)
        height_py : target row (float or int, in pixels)
        center_px : horizontal centre of the body (float or int, in pixels)
        band      : half-width of the vertical scan band (default 5 px = ±5 rows)

    Returns:
        Median width in pixels (int).  Returns 0 if no valid rows found.
    """
    widths = []
    for dy in range(-band, band + 1):
        y = int(round(height_py)) + dy
        if 0 <= y < mask.shape[0]:
            w = get_width_from_mask(mask, y, center_px)
            if w > 0:
                widths.append(w)
    return int(np.median(widths)) if widths else 0


def compute_silhouette_calibration(landmarks, mask, scale_factor, img_h, img_w):
    """
    Per-image arm-overlap correction using ONLY the shoulder keypoints.

    Why shoulder-only?
    ------------------
    YOLO `left_hip` / `right_hip` keypoints mark the HIP JOINT (pelvis bone),
    which is always much narrower than the actual silhouette at that height
    (the trochanteric breadth is 30–40 % wider than the inter-joint distance).
    Using hip keypoints as a calibration anchor always hits the lower clamp and
    forces the whole lower-body silhouette down by 18 %+, destroying accuracy.

    The shoulder anchor IS reliable:
    - Shoulder joints ≈ acromion tips
    - joint-to-joint × 1.19 ≈ shoulder width including deltoid
    - Any excess in the silhouette at shoulder height = arm overlap + clothing

    Where is the correction applied?
    ---------------------------------
    Only to slices 70-100 (shoulder, neck, head region) where arms overlap
    with the torso silhouette.  Below slice 70 (chest, waist, hip) the raw
    silhouette is preserved — ANSUR prior caps handle those regions.

    This prevents the double-reduction bug (self-calibration pushing down AND
    ANSUR cap pushing down simultaneously).

    Returns
    -------
    calib_factors : np.ndarray shape [100]
    calib_debug   : dict
    """
    mp_pose = mp.solutions.pose

    ls = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value]
    rs = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
    lh = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value]
    rh = landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value]

    hip_cx = (lh.x + rh.x) / 2 * img_w  # body centre X (pixels)

    # --- Shoulder anchor ---
    sh_kpt_w_px  = abs(ls.x - rs.x) * img_w
    sh_y_px      = (ls.y + rs.y) / 2 * img_h
    sh_sil_w_px  = get_width_from_mask_robust(mask, sh_y_px, hip_cx, band=5)
    # 1.19× converts joint-to-joint to shoulder width including deltoid
    sh_target_px = sh_kpt_w_px * 1.19
    calib_sh     = float(np.clip(sh_target_px / max(sh_sil_w_px, 1.0), 0.88, 1.18))

    # --- Build calibration vector ---
    # Slices 78-99: full shoulder correction (arms always overlap here)
    # Slices 70-77: taper from correction → 1.0 (arms fade out below shoulder line)
    # Slices  0-69: NO correction — ANSUR prior handles chest/waist/hip caps
    calib_factors = np.ones(100, dtype=np.float32)
    for i in range(78, 100):
        calib_factors[i] = calib_sh
    for i in range(70, 78):
        t = (i - 70) / (78 - 70)         # 0→1  as i goes 70→78
        calib_factors[i] = 1.0 + t * (calib_sh - 1.0)

    calib_debug = {
        "calib_shoulder": round(calib_sh, 4),
        "sh_kpt_w_cm":    round(sh_kpt_w_px * scale_factor, 2),
        "sh_sil_w_cm":    round(sh_sil_w_px * scale_factor, 2),
        "applied_to":     "slices 70-99 only (shoulder+neck+head)",
    }
    return calib_factors, calib_debug

# Helper: Calculate pixel-to-cm scale factor using the segmentation mask
def calculate_scale_factor(landmarks, mask, image_height, user_height_cm):
    mp_pose = mp.solutions.pose
    nose_y = landmarks[mp_pose.PoseLandmark.NOSE.value].y * image_height
    left_ankle_y = landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y * image_height
    right_ankle_y = landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].y * image_height
    ankle_y = max(left_ankle_y, right_ankle_y)
    
    # Find absolute top and bottom in the segmentation mask
    y_indices, _ = np.nonzero(mask)
    if len(y_indices) > 0:
        mask_top_y = np.min(y_indices)
        mask_bottom_y = np.max(y_indices)
    else:
        mask_top_y = nose_y
        mask_bottom_y = ankle_y
        
    # Restrict mask top to avoid hair/ceiling light anomalies (head top is roughly 8% of height above nose)
    if mask_top_y > nose_y or (nose_y - mask_top_y) > 0.15 * image_height:
        mask_top_y = nose_y - (ankle_y - nose_y) * 0.08
        
    height_px = mask_bottom_y - mask_top_y
    scale_factor = user_height_cm / height_px
    return scale_factor, height_px

def extract_silhouette_profile(landmarks, mask, image_height, scale_factor, user_height_cm, num_slices=100, is_side=False):
    mp_pose = mp.solutions.pose
    nose_y = landmarks[mp_pose.PoseLandmark.NOSE.value].y * image_height
    left_ankle_y = landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y * image_height
    right_ankle_y = landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].y * image_height
    ankle_y = max(left_ankle_y, right_ankle_y)
    
    y_indices, _ = np.nonzero(mask)
    if len(y_indices) > 0:
        mask_top_y = np.min(y_indices)
        mask_bottom_y = np.max(y_indices)
    else:
        mask_top_y = nose_y
        mask_bottom_y = ankle_y
        
    if mask_top_y > nose_y or (nose_y - mask_top_y) > 0.15 * image_height:
        mask_top_y = nose_y - (ankle_y - nose_y) * 0.08
        
    # Get joint points to calculate arm angles
    left_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value]
    right_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
    left_elbow = landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value]
    right_elbow = landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value]
    left_hip = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value]
    right_hip = landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value]
    
    # Midbody X center
    hip_x = (left_hip.x + right_hip.x) / 2 * mask.shape[1]
    
    # Calculate arm angles
    def get_angle(p1, p2, p3):
        v1 = np.array([p1.x - p2.x, p1.y - p2.y])
        v2 = np.array([p3.x - p2.x, p3.y - p2.y])
        dot = np.dot(v1, v2)
        len1 = np.linalg.norm(v1)
        len2 = np.linalg.norm(v2)
        if len1 == 0 or len2 == 0:
            return 0.0
        cos_ang = dot / (len1 * len2)
        return np.degrees(np.arccos(np.clip(cos_ang, -1.0, 1.0)))
        
    left_arm_angle = get_angle(left_hip, left_shoulder, left_elbow)
    right_arm_angle = get_angle(right_hip, right_shoulder, right_elbow)
    
    # Arm radius estimation (typically ~2.5% of height, e.g. 4.0 cm for 160 cm height)
    arm_radius_cm = user_height_cm * 0.025
    
    # Generate 100 vertical steps from feet/bottom to head/top
    y_coords = np.linspace(mask_bottom_y, mask_top_y, num_slices)
    
    silhouette = []
    for idx, y_val in enumerate(y_coords):
        # Use robust (band-median) scan instead of single-row to eliminate
        # per-row noise from clothing texture, mask blur, and lighting edges.
        w_px = get_width_from_mask_robust(mask, y_val, hip_x, band=5)
        w_cm = w_px * scale_factor
        rad_cm = w_cm / 2.0
        
        y_ratio = idx / num_slices
        
        if not is_side:
            # Front arm subtraction (overlap region 0.40 to 0.74, shoulders at 0.78 excluded)
            if 0.40 <= y_ratio <= 0.74:
                if left_arm_angle < 35.0:
                    rad_cm -= arm_radius_cm
                if right_arm_angle < 35.0:
                    rad_cm -= arm_radius_cm
        else:
            # Side arm subtraction/addition profile
            if left_arm_angle < 35.0 or right_arm_angle < 35.0:
                if idx >= 75:
                    mult = 0.0
                elif 70 <= idx < 75:
                    # Scale chest side depth slightly up by 1.1x to account for occlusion/camera angle
                    rad_cm *= 1.1
                    mult = 0.0
                elif 58 <= idx < 70:
                    # Interpolate between 1.1x scaling at chest and 0.60x arm subtraction at waist
                    chest_val = rad_cm * 1.1
                    waist_val = rad_cm - 0.60 * arm_radius_cm
                    rad_cm = waist_val + (chest_val - waist_val) * (idx - 58) / 12.0
                    mult = 0.0
                elif 46 <= idx < 58:
                    # Interpolate between 0.60x arm subtraction at waist and 0.45x arm subtraction at hip
                    waist_val = rad_cm - 0.60 * arm_radius_cm
                    hip_val = rad_cm - 0.45 * arm_radius_cm
                    rad_cm = waist_val + (hip_val - waist_val) * (58 - idx) / 12.0
                    mult = 0.0
                elif 38 <= idx < 46:
                    mult = 0.45 * (idx - 38) / 8.0
                    rad_cm -= mult * arm_radius_cm
                else:
                    mult = 0.0
                
        silhouette.append(max(2.0, rad_cm))
        
    return np.array(silhouette)

# Helper: Extract 2D pixel coordinates and width/depth features from a single view
def extract_body_features(landmarks, mask, scale_factor, h, w, is_side=False):
    mp_pose = mp.solutions.pose
    features = {}
    
    # Key landmark coordinates in pixels
    nose_y = landmarks[mp_pose.PoseLandmark.NOSE.value].y * h
    nose_x = landmarks[mp_pose.PoseLandmark.NOSE.value].x * w
    
    left_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value]
    right_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
    shoulder_y = (left_shoulder.y + right_shoulder.y) / 2 * h
    shoulder_x = (left_shoulder.x + right_shoulder.x) / 2 * w
    
    left_hip = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value]
    right_hip = landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value]
    hip_y = (left_hip.y + right_hip.y) / 2 * h
    hip_x = (left_hip.x + right_hip.x) / 2 * w
    
    left_knee = landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value]
    knee_y = left_knee.y * h
    
    left_ankle = landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value]
    right_ankle = landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value]
    ankle_y = max(left_ankle.y, right_ankle.y) * h
    
    # 1. Waist Level (35% down from shoulder to hip)
    waist_y = shoulder_y + (hip_y - shoulder_y) * 0.35
    waist_x = hip_x
    waist_w_px = get_width_from_mask(mask, waist_y, waist_x)
    features["waist_width_px"] = waist_w_px
    features["waist_y"] = waist_y
    
    # 2. Chest Level (15% down from shoulder to hip)
    chest_y = shoulder_y + (hip_y - shoulder_y) * 0.15
    chest_x = shoulder_x
    chest_w_px = get_width_from_mask(mask, chest_y, chest_x)
    features["chest_width_px"] = chest_w_px
    
    # 3. Dynamic Hip Level: Scan waist-to-mid-thigh range for maximum width
    hip_scan_end_y = hip_y + (knee_y - hip_y) * 0.30
    max_hip_w_px = 0
    for y_coord in range(int(waist_y), int(hip_scan_end_y)):
        w_px = get_width_from_mask(mask, y_coord, hip_x)
        if w_px > max_hip_w_px:
            max_hip_w_px = w_px
    features["hip_width_px"] = max_hip_w_px
    
    # 4. Thigh Level (20% down from hip to knee)
    thigh_y_ratio = 0.20
    thigh_y = hip_y + (knee_y - hip_y) * thigh_y_ratio
    
    if not is_side:
        # Front Thigh Width: Scan left thigh using body midline as the inner boundary (handles touching legs)
        mid_body_x = hip_x
        # Interpolated left leg center
        thigh_cx = (left_hip.x + (left_knee.x - left_hip.x) * thigh_y_ratio) * w
        
        # Scan outward (to the right in the image from left leg center)
        line = mask[int(thigh_y), :]
        outer_edge = int(thigh_cx)
        for i in range(int(thigh_cx), len(line)):
            if line[i] == 0:
                outer_edge = i
                break
        thigh_w_px = abs(outer_edge - mid_body_x)
        features["thigh_width_px"] = thigh_w_px
    else:
        # Side Thigh Depth profile width
        thigh_cx = (left_hip.x + (left_knee.x - left_hip.x) * thigh_y_ratio) * w
        thigh_d_px = get_width_from_mask(mask, thigh_y, thigh_cx)
        features["thigh_depth_px"] = thigh_d_px

    # Features only needed from the front view
    if not is_side:
        # Shoulder Width: based on landmarks with tailoring offset multiplier
        landmark_sh_w_px = abs(left_shoulder.x - right_shoulder.x) * w
        shoulder_width_px = landmark_sh_w_px * 1.19
        features["shoulder_width_px"] = shoulder_width_px
        
        # Neck Width: biologically correlated to 31% of shoulder width
        features["neck_width_px"] = shoulder_width_px * 0.31
        
        # Trouser Length: waist line to ankle line (tailoring standard)
        features["trouser_length_px"] = abs(waist_y - ankle_y)
        
        # Arm Length: shoulder to wrist
        left_wrist = landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value]
        features["arm_length_px"] = abs(shoulder_y - left_wrist.y * h)
        
        # Shirt Length: shoulder to hip * 1.2
        features["shirt_length_px"] = abs(shoulder_y - hip_y) * 1.2
        
    return features

# Helper: Sanitize silhouette profiles using data-driven ANSUR II priors (with
# hardcoded-ratio fallback if the regressor model has not been trained yet).
def sanitize_silhouette_profile(front_sil, side_sil, height_cm,
                                 gender="female", beta_mass=1.0, weight_kg=None):
    clean_front = front_sil.copy()
    clean_side  = side_sil.copy() if side_sil is not None else None

    # Backward-compatible gender/beta_mass handling
    if isinstance(gender, (float, int)):
        beta_mass = float(gender)
        gender = "female"
    elif isinstance(gender, str) and gender.lower() in ["slim", "heavy", "average"]:
        body_type = gender.lower()
        gender = "female"
        if body_type == "slim":
            beta_mass = 0.78
        elif body_type == "heavy":
            beta_mass = 1.35
        else:
            beta_mass = 1.00

    gender_str = gender.lower() if isinstance(gender, str) else "female"

    # -----------------------------------------------------------------------
    # Derive width caps
    # Priority 1: ANSUR II data-driven regressor  (no hardcoding)
    # Priority 2: Legacy shoulder-ratio approach   (fallback)
    # -----------------------------------------------------------------------
    from sota_mesh import BodyPrior
    prior   = BodyPrior.get()
    sh_w_cm = front_sil[78] * 2   # silhouette shoulder width (half → full)

    if prior is not None and weight_kg is not None:
        # --- Data-driven caps from ANSUR II ---
        p = prior.predict(height_cm, weight_kg, gender_str)
        # Body cross-section is an ellipse with typical depth/width ratio ~0.65.
        # For such an ellipse: circ ~= pi * 1.65 * a  (where a = semi-major axis = half-width)
        # So: half_width = circ / (pi * 1.65)
        ELLIPSE_F = np.pi * 1.65   # = ~5.18
        target_chest_w = p.get('chest', sh_w_cm * 0.84) / ELLIPSE_F
        target_waist_w = p.get('waist', sh_w_cm * 0.74) / ELLIPSE_F
        target_hip_w   = p.get('hip',   sh_w_cm * 0.96) / ELLIPSE_F
        target_shoulder_w = p.get('shoulder', sh_w_cm * 1.19) * 1.045 / 2.0
        print(f"[ANSUR] Prior half-widths  chest={target_chest_w:.1f}cm "
              f"waist={target_waist_w:.1f}cm hip={target_hip_w:.1f}cm shoulder={target_shoulder_w:.1f}cm")
    else:
        # --- Legacy hardcoded ratios (fallback) ---
        if gender_str == "male":
            chest_ratio = (0.82 + 0.09 * (beta_mass - 1.0)) * 1.07
            waist_ratio = (0.76 + 0.18 * (beta_mass - 1.0)) * 1.05
            hip_ratio   = (0.85 + 0.20 * (beta_mass - 1.0)) * 0.95
        else:
            chest_ratio = (0.78 + 0.09 * (beta_mass - 1.0)) * 1.07
            waist_ratio = (0.70 + 0.18 * (beta_mass - 1.0)) * 1.05
            hip_ratio   = (0.92 + 0.23 * (beta_mass - 1.0)) * 0.95
        target_chest_w = chest_ratio * sh_w_cm / 2.0
        target_waist_w = waist_ratio * sh_w_cm / 2.0
        target_hip_w   = hip_ratio   * sh_w_cm / 2.0
        target_shoulder_w = sh_w_cm / 2.0

    # Apply caps (only reduce, never inflate — silhouette is the upper bound)
    clean_front[70] = min(clean_front[70], target_chest_w)
    clean_front[58] = min(clean_front[58], target_waist_w)
    clean_front[46] = min(clean_front[46], target_hip_w)
    # Set the target shoulder width (override, to guide fitting)
    clean_front[78] = target_shoulder_w

    # Smooth between anchor points so the profile has no sharp kinks
    for i in range(71, 78):
        t = (i - 70) / 8.0
        clean_front[i] = clean_front[70] + t * (clean_front[78] - clean_front[70])
    for i in range(59, 70):
        t = (i - 58) / 12.0
        clean_front[i] = clean_front[58] + t * (clean_front[70] - clean_front[58])
    for i in range(47, 58):
        t = (i - 46) / 12.0
        clean_front[i] = clean_front[46] + t * (clean_front[58] - clean_front[46])

    # -----------------------------------------------------------------------
    # Side-view depth caps
    # -----------------------------------------------------------------------
    if clean_side is not None:
        if prior is not None and weight_kg is not None:
            # Use ANSUR circumferences to derive expected body DEPTH.
            # For an ellipse: circ ~= pi * (a + b)  (simple approx)
            # We know a (half-width from clean_front), solve for b (half-depth):
            #   b = circ/pi - a
            # Clamp to at least 45% of width (avoid degenerate flat ellipses).
            ELLIPSE_F = np.pi * 1.65
            chest_a = float(clean_front[70])   # half-width already capped
            waist_a = float(clean_front[58])
            hip_a   = float(clean_front[46])
            chest_circ = p.get('chest', chest_a * np.pi * 2)
            waist_circ = p.get('waist', waist_a * np.pi * 2)
            hip_circ   = p.get('hip',   hip_a   * np.pi * 2)
            # b = circ/pi - a  (from the linear approximation circ ~= pi*(a+b))
            target_chest_d = max(chest_circ / np.pi - chest_a, chest_a * 0.45)
            target_waist_d = max(waist_circ / np.pi - waist_a, waist_a * 0.45)
            target_hip_d   = max(hip_circ   / np.pi - hip_a,   hip_a   * 0.45)
        else:
            # Legacy depth ratios
            if gender_str == "male":
                chest_depth_ratio = 0.62 + 0.23 * (beta_mass - 1.0)
                waist_depth_ratio = 0.68 + 0.23 * (beta_mass - 1.0)
                hip_depth_ratio   = 0.68 + 0.17 * (beta_mass - 1.0)
            else:
                chest_depth_ratio = 0.64 + 0.23 * (beta_mass - 1.0)
                waist_depth_ratio = 0.70 + 0.23 * (beta_mass - 1.0)
                hip_depth_ratio   = 0.70 + 0.17 * (beta_mass - 1.0)
            target_chest_d = clean_front[70] * 2 * chest_depth_ratio / 2.0
            target_waist_d = clean_front[58] * 2 * waist_depth_ratio / 2.0
            target_hip_d   = clean_front[46] * 2 * hip_depth_ratio   / 2.0

        clean_side[70] = min(clean_side[70], target_chest_d)
        clean_side[58] = min(clean_side[58], target_waist_d)
        clean_side[46] = min(clean_side[46], target_hip_d)

        for i in range(71, 78):
            t = (i - 70) / 8.0
            clean_side[i] = clean_side[70] + t * (clean_side[78] - clean_side[70])
        for i in range(59, 70):
            t = (i - 58) / 12.0
            clean_side[i] = clean_side[58] + t * (clean_side[70] - clean_side[58])
        for i in range(47, 58):
            t = (i - 46) / 12.0
            clean_side[i] = clean_side[46] + t * (clean_side[58] - clean_side[46])

    return clean_front, clean_side

# Validate front pose image
def validate_front_image(image_np):
    try:
        results = pose_model(image_np, verbose=False)
        if not results or len(results[0].boxes) == 0:
            return False, "No person detected. Please make sure you are fully visible in the frame."

        # Find the person with the largest bounding box area
        xyxy = results[0].boxes.xyxy.cpu().numpy()
        areas = (xyxy[:, 2] - xyxy[:, 0]) * (xyxy[:, 3] - xyxy[:, 1])
        best_pose_idx = np.argmax(areas)
        
        # Get keypoints for the best detection
        kpts_xyn = results[0].keypoints.xyn[best_pose_idx].cpu().numpy()
        conf = results[0].keypoints.conf[best_pose_idx].cpu().numpy()
        
        MINIMUM_COCO_JOINTS = {
            0: "nose",
            5: "left shoulder",
            6: "right shoulder",
            7: "left elbow",
            8: "right elbow",
            13: "left knee",
            14: "right knee"
        }
        
        missing_upper = []
        for joint_idx, joint_name in MINIMUM_COCO_JOINTS.items():
            cx = kpts_xyn[joint_idx][0]
            cy = kpts_xyn[joint_idx][1]
            c_conf = conf[joint_idx]
            
            # Check visibility / confidence and bounds
            if c_conf < 0.5 or cx < 0.0 or cx > 1.0 or cy < 0.0 or cy > 1.0:
                missing_upper.append(joint_name)
                
        if missing_upper:
            return False, "Couldn't detect full body. Please step back to show your entire body."

        return True, "Validation passed"
        
    except Exception as e:
        print(f"Error validating body image: {e}")
        return False, "Image formatting issue. Please provide valid photos."

def recommend_clothing_size(gender, chest_cm, waist_cm, hip_cm=None):
    gender_str = str(gender).lower()
    chest_in = chest_cm / 2.54
    waist_in = waist_cm / 2.54
    hip_in = (hip_cm / 2.54) if hip_cm is not None else None

    # Size tables mapping max limit to size labels based on standard RTW sizing charts
    if gender_str == "female":
        upper_sizes = [
            (32.0, "XS"),
            (34.0, "S"),
            (36.0, "M"),
            (38.0, "L"),
            (40.0, "XL"),
            (42.0, "XXL"),
            (44.0, "3XL"),
            (46.0, "4XL"),
            (48.0, "5XL")
        ]
        lower_sizes = [
            (26.0, "XS"),
            (28.0, "S"),
            (30.0, "M"),
            (32.0, "L"),
            (35.0, "XL"),
            (38.0, "XXL"),
            (41.0, "3XL"),
            (44.0, "4XL"),
            (47.0, "5XL")
        ]
        
        upper_size = "5XL+"
        for max_bust, label in upper_sizes:
            if chest_in <= max_bust:
                upper_size = label
                break
                
        lower_size = "5XL+"
        for max_waist, label in lower_sizes:
            if waist_in <= max_waist:
                lower_size = label
                break

        # Check secondary constraint: if waist is too wide for upper body size, bump it up
        waist_limits_female = {
            "XS": 26.0,
            "S": 28.0,
            "M": 30.0,
            "L": 32.0,
            "XL": 35.0,
            "XXL": 38.0,
            "3XL": 41.0,
            "4XL": 44.0,
            "5XL": 47.0
        }
        if upper_size in waist_limits_female:
            max_w = waist_limits_female[upper_size]
            if waist_in > max_w:
                for max_bust, label in upper_sizes:
                    if waist_in <= waist_limits_female.get(label, 999.0):
                        upper_size = label
                        break
                else:
                    upper_size = "5XL+"

        # Fit Profile / Torso Drop
        drop = chest_in - waist_in
        if drop >= 8.0:
            fit_category = "Slim / Athletic Fit"
        elif 5.0 <= drop < 8.0:
            fit_category = "Regular Fit"
        else:
            fit_category = "Relaxed / Comfort Fit"

    else:
        upper_sizes = [
            (34.0, "XS"),
            (36.0, "S"),
            (38.0, "M"),
            (40.0, "L"),
            (42.0, "XL"),
            (44.0, "XXL"),
            (46.0, "3XL"),
            (48.0, "4XL"),
            (50.0, "5XL")
        ]
        lower_sizes = [
            (28.0, "XS"),
            (30.0, "S"),
            (32.0, "M"),
            (34.0, "L"),
            (36.0, "XL"),
            (38.0, "XXL"),
            (40.0, "3XL"),
            (42.0, "4XL"),
            (44.0, "5XL")
        ]

        upper_size = "5XL+"
        for max_chest, label in upper_sizes:
            if chest_in <= max_chest:
                upper_size = label
                break
                
        lower_size = "5XL+"
        for max_waist, label in lower_sizes:
            if waist_in <= max_waist:
                lower_size = label
                break

        waist_limits_male = {
            "XS": 28.0,
            "S": 30.0,
            "M": 32.0,
            "L": 34.0,
            "XL": 36.0,
            "XXL": 38.0,
            "3XL": 40.0,
            "4XL": 42.0,
            "5XL": 44.0
        }
        if upper_size in waist_limits_male:
            max_w = waist_limits_male[upper_size]
            if waist_in > max_w:
                for max_chest, label in upper_sizes:
                    if waist_in <= waist_limits_male.get(label, 999.0):
                        upper_size = label
                        break
                else:
                    upper_size = "5XL+"

        # Fit Profile / Torso Drop
        drop = chest_in - waist_in
        if drop >= 7.0:
            fit_category = "Slim / Athletic Fit"
        elif 4.0 <= drop < 7.0:
            fit_category = "Regular Fit"
        else:
            fit_category = "Relaxed / Comfort Fit"

    return {
        "upper_size": upper_size,
        "lower_size": lower_size,
        "fit_category": fit_category
    }

@app.route("/")
def index():
    return send_file("index.html")

def respond_error(is_java, error_msg, code="INVALID_POSE", is_front=True):
    if is_java:
        validation_details = {
            "front_accepted": not is_front,
            "front_angle": 0.0,
            "front_message": "Accepted" if not is_front else error_msg,
            "side_accepted": is_front,
            "side_angle": 0.0,
            "side_message": "Accepted" if is_front else error_msg,
            "errors": [error_msg]
        }
        return jsonify({
            "success": False,
            "error": error_msg,
            "validation_details": validation_details
        }), 200
    else:
        return jsonify({
            "error": error_msg,
            "pose": "front" if is_front else "side",
            "code": code
        }), 400

@app.route("/upload_images", methods=["POST"])
@app.route("/process", methods=["POST"])
def upload_images():
    # Detect if request is from the Java backend or local testing
    is_java = "front_image" in request.files or "height" in request.form
    
    front_key = "front_image" if is_java else "front"
    if front_key not in request.files:
        return jsonify({"error": f"Missing front image file (expected '{front_key}')."}), 400
        
    front_file = request.files[front_key]
    front_image_np = np.frombuffer(front_file.read(), np.uint8)
    front_file.seek(0)
    
    decoded_front = cv2.imdecode(front_image_np, cv2.IMREAD_COLOR)
    is_valid, error_msg = validate_front_image(decoded_front)
    if not is_valid:
        return respond_error(is_java, error_msg, is_front=True)

    # Gender extraction
    gender = request.form.get('gender', 'female').lower()
    if gender not in ['male', 'female']:
        gender = 'female'

    # User height calibration
    if is_java:
        height_str = request.form.get('height')
        height_unit = request.form.get('height_unit', 'cm').lower()
        try:
            height_val = float(height_str) if height_str else DEFAULT_HEIGHT_CM
            if height_unit == 'm':
                user_height_cm = height_val * 100.0
            else:
                user_height_cm = height_val
        except ValueError:
            user_height_cm = DEFAULT_HEIGHT_CM
    else:
        height_str = request.form.get('height_cm')
        try:
            user_height_cm = float(height_str) if height_str else DEFAULT_HEIGHT_CM
        except ValueError:
            user_height_cm = DEFAULT_HEIGHT_CM
        
    height_m = user_height_cm / 100.0
    
    # Weight calibration
    if is_java:
        weight_str = request.form.get('weight')
        weight_unit = request.form.get('weight_unit', 'kg').lower()
        try:
            weight_val = float(weight_str) if weight_str else None
            if weight_val:
                if weight_unit == 'lbs':
                    weight_kg = weight_val * 0.453592
                else:
                    weight_kg = weight_val
            else:
                weight_kg = 21.7 * (height_m ** 2)
        except ValueError:
            weight_kg = 21.7 * (height_m ** 2)
    else:
        weight_str = request.form.get('weight_kg')
        try:
            weight_kg = float(weight_str) if weight_str else 21.7 * (height_m ** 2)
        except ValueError:
            weight_kg = 21.7 * (height_m ** 2)

    bmi = weight_kg / (height_m ** 2)
    beta_mass = (bmi / 21.7) ** 0.8
    beta_mass = float(np.clip(beta_mass, 0.70, 1.50))
        
    # Process Front Image
    fh, fw, _ = decoded_front.shape
    
    # Run YOLOv8 Pose
    pose_res_front = pose_model(decoded_front, verbose=False)
    pose_boxes_front = pose_res_front[0].boxes
    if pose_boxes_front is None or len(pose_boxes_front) == 0:
        return respond_error(is_java, "Failed to detect pose in front image.", is_front=True)
        
    xyxy_front = pose_boxes_front.xyxy.cpu().numpy()
    areas_front = (xyxy_front[:, 2] - xyxy_front[:, 0]) * (xyxy_front[:, 3] - xyxy_front[:, 1])
    best_pose_idx_front = np.argmax(areas_front)
    
    kpts_xyn_front = pose_res_front[0].keypoints.xyn[best_pose_idx_front].cpu().numpy()
    conf_front = pose_res_front[0].keypoints.conf[best_pose_idx_front].cpu().numpy()
    
    # Run YOLOv8 Seg
    seg_res_front = seg_model(decoded_front, verbose=False)
    seg_boxes_front = seg_res_front[0].boxes
    seg_masks_front = seg_res_front[0].masks
    if seg_boxes_front is None or len(seg_boxes_front) == 0 or seg_masks_front is None:
        return respond_error(is_java, "Failed to segment front image.", is_front=True)
        
    classes_front = seg_boxes_front.cls.cpu().numpy()
    person_idx_front = np.where(classes_front == 0)[0]
    if len(person_idx_front) == 0:
        return respond_error(is_java, "Failed to segment person in front image.", is_front=True)
        
    xyxy_seg_front = seg_boxes_front.xyxy.cpu().numpy()
    areas_seg_front = (xyxy_seg_front[person_idx_front, 2] - xyxy_seg_front[person_idx_front, 0]) * (xyxy_seg_front[person_idx_front, 3] - xyxy_seg_front[person_idx_front, 1])
    best_seg_idx_front = person_idx_front[np.argmax(areas_seg_front)]
    
    # Get mask and resize it
    mask_tensor_front = seg_masks_front.data[best_seg_idx_front].unsqueeze(0).unsqueeze(0).float()
    resized_mask_front = F.interpolate(mask_tensor_front, size=(fh, fw), mode='bilinear', align_corners=False)
    fmask = (resized_mask_front.squeeze() > 0.5).cpu().numpy().astype(np.uint8) * 255
    
    # Construct mock landmarks list of 33 MockLandmark objects
    front_landmarks = [MockLandmark(x=0.0, y=0.0, z=0.0, visibility=0.0) for _ in range(33)]
    for coco_idx, mp_idx in COCO_TO_MEDIAPIPE.items():
        front_landmarks[mp_idx] = MockLandmark(
            x=float(kpts_xyn_front[coco_idx][0]),
            y=float(kpts_xyn_front[coco_idx][1]),
            z=0.0,
            visibility=float(conf_front[coco_idx])
        )
        
    scale_front, height_px_front = calculate_scale_factor(
        front_landmarks, fmask, fh, user_height_cm
    )
    
    raw_front_silhouette = extract_silhouette_profile(
        front_landmarks, fmask, fh, scale_front, user_height_cm, num_slices=100, is_side=False
    )

    # Per-image self-calibration: replaces the old global 1.07× fudge factor.
    # Uses shoulder and hip YOLO keypoints as reference widths (more reliable than
    # the raw silhouette because keypoints track bone geometry, not clothing).
    hip_x_px = (front_landmarks[mp_holistic.PoseLandmark.LEFT_HIP.value].x +
                front_landmarks[mp_holistic.PoseLandmark.RIGHT_HIP.value].x) / 2 * fw
    calib_factors_front, calib_debug = compute_silhouette_calibration(
        front_landmarks, fmask, scale_front, fh, fw
    )
    front_silhouette = raw_front_silhouette * calib_factors_front
    print(f"[CALIB] Per-image calibration: {calib_debug}")
    
    # Process Optional Side Image
    side_key = "side_image" if is_java else ("left_side" if "left_side" in request.files else "side")
    has_side = side_key in request.files
    side_silhouette = None
    scale_side = scale_front
    
    if has_side:
        side_file = request.files[side_key]
        side_image_np = np.frombuffer(side_file.read(), np.uint8)
        decoded_side = cv2.imdecode(side_image_np, cv2.IMREAD_COLOR)
        
        if decoded_side is not None:
            sh, sw, _ = decoded_side.shape
            
            # Run YOLOv8 pose model on side image
            pose_res_side = pose_model(decoded_side, verbose=False)
            pose_boxes_side = pose_res_side[0].boxes
            if pose_boxes_side is not None and len(pose_boxes_side) > 0:
                xyxy_side = pose_boxes_side.xyxy.cpu().numpy()
                areas_side = (xyxy_side[:, 2] - xyxy_side[:, 0]) * (xyxy_side[:, 3] - xyxy_side[:, 1])
                best_pose_idx_side = np.argmax(areas_side)
                
                kpts_xyn_side = pose_res_side[0].keypoints.xyn[best_pose_idx_side].cpu().numpy()
                conf_side = pose_res_side[0].keypoints.conf[best_pose_idx_side].cpu().numpy()
                
                # Run YOLOv8 seg model on side image
                seg_res_side = seg_model(decoded_side, verbose=False)
                seg_boxes_side = seg_res_side[0].boxes
                seg_masks_side = seg_res_side[0].masks
                
                if seg_boxes_side is not None and len(seg_boxes_side) > 0 and seg_masks_side is not None:
                    classes_side = seg_boxes_side.cls.cpu().numpy()
                    person_idx_side = np.where(classes_side == 0)[0]
                    if len(person_idx_side) > 0:
                        xyxy_seg_side = seg_boxes_side.xyxy.cpu().numpy()
                        areas_seg_side = (xyxy_seg_side[person_idx_side, 2] - xyxy_seg_side[person_idx_side, 0]) * (xyxy_seg_side[person_idx_side, 3] - xyxy_seg_side[person_idx_side, 1])
                        best_seg_idx_side = person_idx_side[np.argmax(areas_seg_side)]
                        
                        # Get mask and resize it
                        mask_tensor_side = seg_masks_side.data[best_seg_idx_side].unsqueeze(0).unsqueeze(0).float()
                        resized_mask_side = F.interpolate(mask_tensor_side, size=(sh, sw), mode='bilinear', align_corners=False)
                        smask = (resized_mask_side.squeeze() > 0.5).cpu().numpy().astype(np.uint8) * 255
                        
                        # Construct mock landmarks list for side image
                        side_landmarks = [MockLandmark(x=0.0, y=0.0, z=0.0, visibility=0.0) for _ in range(33)]
                        for coco_idx, mp_idx in COCO_TO_MEDIAPIPE.items():
                            side_landmarks[mp_idx] = MockLandmark(
                                x=float(kpts_xyn_side[coco_idx][0]),
                                y=float(kpts_xyn_side[coco_idx][1]),
                                z=0.0,
                                visibility=float(conf_side[coco_idx])
                            )
                            
                        scale_side, _ = calculate_scale_factor(
                            side_landmarks, smask, sh, user_height_cm
                        )
                        raw_side_silhouette = extract_silhouette_profile(
                            side_landmarks, smask, sh, scale_side, user_height_cm, num_slices=100, is_side=True
                        )
                        # Apply same shoulder-calibrated factor to the side profile.
                        calib_factors_side, _ = compute_silhouette_calibration(
                            side_landmarks, smask, scale_side, sh, sw
                        )
                        side_silhouette = raw_side_silhouette * calib_factors_side
                    else:
                        return respond_error(is_java, "Failed to segment person in side image.", is_front=False)
                else:
                    return respond_error(is_java, "Failed to segment side image.", is_front=False)
            else:
                return respond_error(is_java, "Failed to detect pose in side image.", is_front=False)
        else:
            return respond_error(is_java, "Failed to decode side image.", is_front=False)

    # Adjust front and side silhouettes below the hips (idx < 38) to represent a single leg width
    for idx in range(38):
        front_silhouette[idx] = front_silhouette[idx] * 0.60
        if side_silhouette is not None:
            side_silhouette[idx] = front_silhouette[idx] * 0.85
 
    # 2. Sanitize silhouettes using continuous caps to eliminate clothing/arm corruption
    clean_front, clean_side = sanitize_silhouette_profile(front_silhouette, side_silhouette, user_height_cm, gender, beta_mass, weight_kg=weight_kg)
 
    # 3. Calculate ear-based neck circumference with body type scaling
    flm = front_landmarks
    left_ear_x = flm[mp_holistic.PoseLandmark.LEFT_EAR.value].x * fw
    right_ear_x = flm[mp_holistic.PoseLandmark.RIGHT_EAR.value].x * fw
    ear_dist_px = abs(left_ear_x - right_ear_x)
    neck_w_px = ear_dist_px * 0.54
    neck_w_cm = neck_w_px * scale_front
    a = neck_w_cm / 2
    b = neck_w_cm / 2
    neck_circ_base = np.pi * (3 * (a + b) - np.sqrt((3 * a + b) * (a + 3 * b)))
    neck_circ_override = neck_circ_base * 1.162 * (0.85 + 0.15 * beta_mass)
 
    # 4. Calculate physical arm length along 2D segments (Shoulder -> Elbow -> Wrist) in cm + tailoring ease offset (6.6 cm / 2.6 in)
    def get_arm_segment_length_2d(shoulder_idx, elbow_idx, wrist_idx):
        p_sh = flm[shoulder_idx]
        p_el = flm[elbow_idx]
        p_wr = flm[wrist_idx]
        v1 = np.array([(p_sh.x - p_el.x) * fw, (p_sh.y - p_el.y) * fh])
        v2 = np.array([(p_el.x - p_wr.x) * fw, (p_el.y - p_wr.y) * fh])
        return (np.linalg.norm(v1) + np.linalg.norm(v2)) * scale_front
 
    arm_2d_cm = get_arm_segment_length_2d(
        mp_holistic.PoseLandmark.LEFT_SHOULDER.value,
        mp_holistic.PoseLandmark.LEFT_ELBOW.value,
        mp_holistic.PoseLandmark.LEFT_WRIST.value
    )
    arm_length_override = arm_2d_cm + 6.6
 
    # 5. 3D Mesh Parametric Fitting using sanitized profiles and gender-specific template
    model = SOTABodyModel(num_slices=100, gender=gender)
    betas_w, betas_d = model.fit_shape(clean_front, clean_side, user_height_cm)
    
    # Calculate virtual tape measurements
    raw_measurements = model.calculate_measurements(
        betas_w, betas_d, user_height_cm, 
        neck_circ_override=neck_circ_override, 
        arm_length_override=arm_length_override,
        weight_kg=weight_kg
    )

    # Compute target neck full-width (cm) from the ear-based circumference override.
    # This is used to post-process mesh vertices 79-99 so the avatar neck tapers
    # cleanly from the shoulder down to the true anatomical neck width, eliminating
    # the silhouette/hair noise bulge that the optimizer would otherwise produce.
    target_neck_w_for_mesh = neck_circ_override / np.pi  # circ = pi * d => d = circ/pi

    # Get width profiles for UI diagnostics (with neck tapering applied to mesh)
    vertices, w_cm, d_cm = model.generate_mesh(betas_w, betas_d, user_height_cm,
                                                target_neck_w=target_neck_w_for_mesh)
    
    # Extract skeletal shoulder and hip joint widths in cm
    sh_w_px = abs(flm[mp_holistic.PoseLandmark.LEFT_SHOULDER.value].x - flm[mp_holistic.PoseLandmark.RIGHT_SHOULDER.value].x) * fw
    sh_w_cm = sh_w_px * scale_front
    hip_w_px = abs(flm[mp_holistic.PoseLandmark.LEFT_HIP.value].x - flm[mp_holistic.PoseLandmark.RIGHT_HIP.value].x) * fw
    hip_w_cm = hip_w_px * scale_front
    
    # Get width and depth measurements of the optimized 3D model at key landmarks
    chest_sil_width = float(w_cm[model.landmarks["chest"]].item() * 2)
    waist_sil_width = float(w_cm[model.landmarks["waist"]].item() * 2)
    hip_sil_width = float(w_cm[model.landmarks["hip"]].item() * 2)
    
    chest_sil_depth = float(d_cm[model.landmarks["chest"]].item() * 2)
    waist_sil_depth = float(d_cm[model.landmarks["waist"]].item() * 2)
    hip_sil_depth = float(d_cm[model.landmarks["hip"]].item() * 2)
    
    measurements = {
        # ── Circumferences ────────────────────────────────────────────
        "shoulder_width":           raw_measurements["shoulder_width"],
        "neck":                     raw_measurements["neck_circumference"],
        "neck_width":               round(float(w_cm[model.landmarks["neck"]].item() * 2), 2),
        "upper_chest":              raw_measurements["upper_chest_circumference"],
        "chest_circumference":      raw_measurements["chest_circumference"],
        "chest_width":              round(chest_sil_width, 2),
        "lower_chest":              raw_measurements["lower_chest_circumference"],
        "waist":                    raw_measurements["waist_circumference"],
        "waist_width":              round(waist_sil_width, 2),
        "hip":                      raw_measurements["hip_circumference"],
        "hip_width":                round(hip_sil_width, 2),
        "thigh_circumference":      raw_measurements["thigh_circumference"],
        "thigh":                    round(float(w_cm[model.landmarks["thigh"]].item() * 2), 2),
        "knee_circumference":       raw_measurements["knee_circumference"],
        "ankle_circumference":      raw_measurements["ankle_circumference"],
        "bicep_circumference":      raw_measurements["bicep_circumference"],
        "wrist_circumference":      raw_measurements["wrist_circumference"],
        "armhole_circumference":    raw_measurements["armhole_circumference"],
        # ── Lengths ───────────────────────────────────────────────────
        "arm_length":               raw_measurements["arm_length"],
        "shirt_length":             raw_measurements["shirt_length"],
        "body_length":              raw_measurements["body_length"],
        "tucks_point":              raw_measurements["tucks_point"],
        "trouser_length":           raw_measurements["trouser_length"],
        "full_height":              raw_measurements["full_height"],
    }
    
    # 6. Extract 3D skeletal joint centers in real-world centimeters (origin at ankles midpoint, Y is up, X is right, Z is depth)
    joints_of_interest = {
        "nose": mp_pose.PoseLandmark.NOSE.value,
        "left_shoulder": mp_pose.PoseLandmark.LEFT_SHOULDER.value,
        "right_shoulder": mp_pose.PoseLandmark.RIGHT_SHOULDER.value,
        "left_elbow": mp_pose.PoseLandmark.LEFT_ELBOW.value,
        "right_elbow": mp_pose.PoseLandmark.RIGHT_ELBOW.value,
        "left_wrist": mp_pose.PoseLandmark.LEFT_WRIST.value,
        "right_wrist": mp_pose.PoseLandmark.RIGHT_WRIST.value,
        "left_hip": mp_pose.PoseLandmark.LEFT_HIP.value,
        "right_hip": mp_pose.PoseLandmark.RIGHT_HIP.value,
        "left_knee": mp_pose.PoseLandmark.LEFT_KNEE.value,
        "right_knee": mp_pose.PoseLandmark.RIGHT_KNEE.value,
        "left_ankle": mp_pose.PoseLandmark.LEFT_ANKLE.value,
        "right_ankle": mp_pose.PoseLandmark.RIGHT_ANKLE.value,
        "left_ear": mp_pose.PoseLandmark.LEFT_EAR.value,
        "right_ear": mp_pose.PoseLandmark.RIGHT_EAR.value
    }
    
    # Calculate references for coordinate alignment (X center at hips, Y center at ankles)
    left_hip_lm = flm[mp_pose.PoseLandmark.LEFT_HIP.value]
    right_hip_lm = flm[mp_pose.PoseLandmark.RIGHT_HIP.value]
    hip_x_px = (left_hip_lm.x + right_hip_lm.x) / 2 * fw
    
    left_ankle_lm = flm[mp_pose.PoseLandmark.LEFT_ANKLE.value]
    right_ankle_lm = flm[mp_pose.PoseLandmark.RIGHT_ANKLE.value]
    ankle_y_px = max(left_ankle_lm.y, right_ankle_lm.y) * fh
    
    skeleton_joints = {}
    for name, idx in joints_of_interest.items():
        lm = flm[idx]
        # X in cm (flip X to align with 3D space: right is positive)
        x_cm = -(lm.x * fw - hip_x_px) * scale_front
        # Y in cm (0 is ankle, pointing up)
        y_cm = (ankle_y_px - lm.y * fh) * scale_front
        z_cm = 0.0
        
        skeleton_joints[name] = [float(x_cm), float(y_cm), float(z_cm)]
        
    debug_info = {
        "scale_factor": float(scale_front),
        "scale_factor_side": float(scale_side) if has_side else None,
        "user_height_cm": float(user_height_cm),
        "gender": gender,
        "weight_kg": weight_kg,
        "bmi": bmi,
        "beta_mass": beta_mass,
        "calibration": calib_debug
    }
    
    # Flatten 3D mesh vertices tensor to a simple float list for frontend rendering
    mesh_vertices = vertices.detach().cpu().numpy().astype(float).flatten().tolist()
    
    # Calculate recommended clothing size
    rec_sizes = recommend_clothing_size(gender, measurements["chest_circumference"], measurements["waist"], measurements["hip"])

    if is_java:
        # Build nested measurements dictionary for backend integration
        if bmi < 18.5:
            bmi_category = "Underweight"
        elif bmi < 25:
            bmi_category = "Normal"
        elif bmi < 30:
            bmi_category = "Overweight"
        else:
            bmi_category = "Obese"
            
        body_type_input = request.form.get('body_type', 'average')
        
        nested_measurements = {
            "metadata": {
                "bmi": float(round(bmi, 2)),
                "bmi_category": bmi_category,
                "body_type": body_type_input,
                "recommended_size": rec_sizes.get("upper_size", "M"),
                "height": {
                    "cm": float(round(user_height_cm, 2)),
                    "inches": float(round(user_height_cm / 2.54, 2))
                },
                "weight": {
                    "kg": float(round(weight_kg, 2)),
                    "lbs": float(round(weight_kg * 2.20462, 2))
                }
            },
            "neck": {
                "circumference": {
                    "cm": float(round(measurements["neck"], 2)),
                    "inches": float(round(measurements["neck"] / 2.54, 2))
                }
            },
            "chest": {
                "circumference": {
                    "cm": float(round(measurements["chest_circumference"], 2)),
                    "inches": float(round(measurements["chest_circumference"] / 2.54, 2))
                }
            },
            "upper_chest": {
                "circumference": {
                    "cm": float(round(measurements["upper_chest"], 2)),
                    "inches": float(round(measurements["upper_chest"] / 2.54, 2))
                }
            },
            "lower_chest": {
                "circumference": {
                    "cm": float(round(measurements["lower_chest"], 2)),
                    "inches": float(round(measurements["lower_chest"] / 2.54, 2))
                }
            },
            "waist": {
                "circumference": {
                    "cm": float(round(measurements["waist"], 2)),
                    "inches": float(round(measurements["waist"] / 2.54, 2))
                }
            },
            "hip": {
                "circumference": {
                    "cm": float(round(measurements["hip"], 2)),
                    "inches": float(round(measurements["hip"] / 2.54, 2))
                }
            },
            "shoulder": {
                "width": {
                    "cm": float(round(measurements["shoulder_width"], 2)),
                    "inches": float(round(measurements["shoulder_width"] / 2.54, 2))
                }
            },
            "arm": {
                "total_length": {
                    "cm": float(round(measurements["arm_length"], 2)),
                    "inches": float(round(measurements["arm_length"] / 2.54, 2))
                },
                "shoulder_to_elbow": {
                    "cm": float(round(measurements["arm_length"] * 0.5, 2)),
                    "inches": float(round((measurements["arm_length"] * 0.5) / 2.54, 2))
                },
                "hand_to_elbow": {
                    "cm": float(round(measurements["arm_length"] * 0.5, 2)),
                    "inches": float(round((measurements["arm_length"] * 0.5) / 2.54, 2))
                }
            },
            "armhole": {
                "circumference": {
                    "cm": float(round(measurements["armhole_circumference"], 2)),
                    "inches": float(round(measurements["armhole_circumference"] / 2.54, 2))
                }
            },
            "upper_thigh": {
                "circumference": {
                    "cm": float(round(measurements["thigh_circumference"], 2)),
                    "inches": float(round(measurements["thigh_circumference"] / 2.54, 2))
                }
            },
            "knee": {
                "circumference": {
                    "cm": float(round(measurements["knee_circumference"], 2)),
                    "inches": float(round(measurements["knee_circumference"] / 2.54, 2))
                }
            },
            "body_length": {
                "length": {
                    "cm": float(round(measurements["body_length"], 2)),
                    "inches": float(round(measurements["body_length"] / 2.54, 2))
                }
            }
        }

        return jsonify({
            "success": True,
            "measurements": nested_measurements,
            "clothing_sizes": rec_sizes,
            "debug_info": debug_info,
            "mesh_vertices": mesh_vertices,
            "skeleton_joints": skeleton_joints
        })
    else:
        # Flat structure for standalone POC testing UI
        return jsonify({
            "measurements": measurements,
            "clothing_sizes": rec_sizes,
            "debug_info": debug_info,
            "mesh_vertices": mesh_vertices,
            "skeleton_joints": skeleton_joints
        })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8001)