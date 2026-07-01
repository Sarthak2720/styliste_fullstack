import cv2
import numpy as np
import sys
import os
import torch
import torch.nn.functional as F
from ultralytics import YOLO

sys.path.append("c:/Users/sarth/Desktop/mes_poc")

from app import (
    MockLandmark,
    COCO_TO_MEDIAPIPE,
    calculate_scale_factor,
    extract_silhouette_profile,
    sanitize_silhouette_profile
)
from sota_mesh import SOTABodyModel

# Load subjects
targets = {
    "anisha": {
        "height_cm": 150.0,
        "body_type": "average",
        "gender": "female",
        "front": "c:/Users/sarth/Desktop/mes_poc/mes_data/anisha_front.jpeg",
        "side": "c:/Users/sarth/Desktop/mes_poc/mes_data/anisha_side.jpeg",
        "actual": {
            "arm_length": 20.0,
            "chest_circumference": 33.0,
            "hip": 34.0,
            "neck": 12.0,
            "shirt_length": 17.0,
            "shoulder_width": 14.0,
            "thigh_circumference": 19.5,
            "trouser_length": 36.0,
            "waist": 27.0
        }
    },
    "nandini": {
        "height_cm": 149.0,
        "body_type": "heavy",
        "gender": "female",
        "front": "c:/Users/sarth/Desktop/mes_poc/mes_data/nandini_front.jpeg",
        "side": "c:/Users/sarth/Desktop/mes_poc/mes_data/nandini_side.jpeg",
        "actual": {
            "arm_length": 20.0,
            "chest_circumference": 36.0,
            "hip": 40.0,
            "neck": 14.0,
            "shirt_length": 20.0,
            "shoulder_width": 16.0,
            "thigh_circumference": 20.0,
            "trouser_length": 34.0,
            "waist": 34.0
        }
    },
    "ashwini": {
        "height_cm": 162.0,
        "body_type": "average",
        "gender": "female",
        "front": "c:/Users/sarth/Desktop/mes_poc/mes_data/ashwini_front.jpeg",
        "side": "c:/Users/sarth/Desktop/mes_poc/mes_data/ashwini_side.jpeg",
        "actual": {
            "arm_length": 22.0,
            "chest_circumference": 36.0,
            "hip": 41.0,
            "neck": 14.0,
            "shirt_length": 20.0,
            "shoulder_width": 16.0,
            "thigh_circumference": 22.5,
            "trouser_length": 37.0,
            "waist": 32.0
        }
    }
}

pose_model = YOLO("yolov8m-pose.pt")
seg_model = YOLO("yolov8m-seg.pt")

def evaluate_neck_sanitization():
    print("\nEvaluating Shape Fitting with Neck Sanitization inside Silhouette Profiles:")
    all_diffs = []
    
    for name, info in targets.items():
        decoded_front = cv2.imread(info["front"])
        decoded_side = cv2.imread(info["side"])
        fh, fw, _ = decoded_front.shape
        sh, sw, _ = decoded_side.shape
        
        # Front YOLO
        res_f = pose_model(decoded_front, verbose=False)
        best_pose_f = np.argmax((res_f[0].boxes.xyxy.cpu().numpy()[:, 2] - res_f[0].boxes.xyxy.cpu().numpy()[:, 0]) * (res_f[0].boxes.xyxy.cpu().numpy()[:, 3] - res_f[0].boxes.xyxy.cpu().numpy()[:, 1]))
        kpts_f = res_f[0].keypoints.xyn[best_pose_f].cpu().numpy()
        conf_f = res_f[0].keypoints.conf[best_pose_f].cpu().numpy()
        
        seg_res_f = seg_model(decoded_front, verbose=False)
        best_seg_f = np.where(seg_res_f[0].boxes.cls.cpu().numpy() == 0)[0][0]
        mask_t_f = seg_res_f[0].masks.data[best_seg_f].unsqueeze(0).unsqueeze(0).float()
        fmask = (F.interpolate(mask_t_f, size=(fh, fw), mode='bilinear', align_corners=False).squeeze() > 0.5).cpu().numpy().astype(np.uint8) * 255
        
        front_lm = [MockLandmark(0,0) for _ in range(33)]
        for coco, mp_idx in COCO_TO_MEDIAPIPE.items():
            front_lm[mp_idx] = MockLandmark(float(kpts_f[coco][0]), float(kpts_f[coco][1]), visibility=float(conf_f[coco]))
            
        scale_front, _ = calculate_scale_factor(front_lm, fmask, fh, info["height_cm"])
        front_sil = extract_silhouette_profile(front_lm, fmask, fh, scale_front, info["height_cm"], num_slices=100, is_side=False) * 1.07
        
        # Side YOLO
        res_s = pose_model(decoded_side, verbose=False)
        best_pose_s = np.argmax((res_s[0].boxes.xyxy.cpu().numpy()[:, 2] - res_s[0].boxes.xyxy.cpu().numpy()[:, 0]) * (res_s[0].boxes.xyxy.cpu().numpy()[:, 3] - res_s[0].boxes.xyxy.cpu().numpy()[:, 1]))
        kpts_s = res_s[0].keypoints.xyn[best_pose_s].cpu().numpy()
        
        seg_res_s = seg_model(decoded_side, verbose=False)
        best_seg_s = np.where(seg_res_s[0].boxes.cls.cpu().numpy() == 0)[0][0]
        mask_t_s = seg_res_s[0].masks.data[best_seg_s].unsqueeze(0).unsqueeze(0).float()
        smask = (F.interpolate(mask_t_s, size=(sh, sw), mode='bilinear', align_corners=False).squeeze() > 0.5).cpu().numpy().astype(np.uint8) * 255
        
        side_lm = [MockLandmark(0,0) for _ in range(33)]
        for coco, mp_idx in COCO_TO_MEDIAPIPE.items():
            side_lm[mp_idx] = MockLandmark(float(kpts_s[coco][0]), float(kpts_s[coco][1]))
            
        scale_side, _ = calculate_scale_factor(side_lm, smask, sh, info["height_cm"])
        side_sil = extract_silhouette_profile(side_lm, smask, sh, scale_side, info["height_cm"], num_slices=100, is_side=True) * 1.07
        
        for idx in range(38):
            front_sil[idx] *= 0.60
            side_sil[idx] *= 0.85
            
        clean_front, clean_side = sanitize_silhouette_profile(front_sil, side_sil, info["height_cm"], info["body_type"])
        
        # Ear-based neck
        left_ear_x = front_lm[7].x * fw
        right_ear_x = front_lm[8].x * fw
        ear_dist_cm = abs(left_ear_x - right_ear_x) * scale_front
        neck_w_cm = ear_dist_cm * 0.54
        
        if info["body_type"] == "slim":
            beta_mass = 0.78
        elif info["body_type"] == "heavy":
            beta_mass = 1.35
        else:
            beta_mass = 1.00
            
        neck_circ_base = np.pi * neck_w_cm
        neck_circ_override = neck_circ_base * 1.162 * (0.85 + 0.15 * beta_mass)
        target_neck_w = neck_circ_override / np.pi # circular neck width
        target_neck_half_w = target_neck_w / 2.0
        
        # Overwrite neck slices in clean_front and clean_side
        for i in range(79, 86):
            if i <= 82:
                t = (i - 78) / 4.0
                clean_front[i] = clean_front[78] + t * (target_neck_half_w - clean_front[78])
                if clean_side is not None:
                    clean_side[i] = clean_side[78] + t * (target_neck_half_w - clean_side[78])
            else:
                clean_front[i] = target_neck_half_w
                if clean_side is not None:
                    clean_side[i] = target_neck_half_w
                    
        # Overwrite head slices (86 to 99) to keep them clean
        for i in range(86, 100):
            clean_front[i] = target_neck_half_w
            if clean_side is not None:
                clean_side[i] = target_neck_half_w
        
        # Arm length override
        def get_arm_segment_length_2d(shoulder_idx, elbow_idx, wrist_idx):
            p_sh = front_lm[shoulder_idx]
            p_el = front_lm[elbow_idx]
            p_wr = front_lm[wrist_idx]
            v1 = np.array([(p_sh.x - p_el.x) * fw, (p_sh.y - p_el.y) * fh])
            v2 = np.array([(p_el.x - p_wr.x) * fw, (p_el.y - p_wr.y) * fh])
            return (np.linalg.norm(v1) + np.linalg.norm(v2)) * scale_front

        arm_2d_cm = get_arm_segment_length_2d(11, 13, 15)
        arm_length_override = arm_2d_cm + 6.6
        
        # Fit using original SOTABodyModel (with unmodified loss, i.e., fits all slices 0-99)
        model = SOTABodyModel(num_slices=100, gender=info["gender"])
        betas_w, betas_d = model.fit_shape(clean_front, clean_side, info["height_cm"])
        
        measurements = model.calculate_measurements(
            betas_w, betas_d, info["height_cm"],
            neck_circ_override=neck_circ_override,
            arm_length_override=arm_length_override
        )
        
        vertices, w_cm, d_cm = model.generate_mesh(betas_w, betas_d, info["height_cm"])
        fit_neck_w = w_cm[82].item() * 2
        fit_sh_w = w_cm[78].item() * 2
        
        print(f"\nSubject: {name.upper()}")
        print(f"  Fitted Neck Width (slice 82): {fit_neck_w:.2f} cm (Target: {target_neck_w:.2f} cm)")
        print(f"  Fitted Shoulder Width (slice 78): {fit_sh_w:.2f} cm (Silhouette Target: {clean_front[78]*2:.2f} cm)")
        print(f"  Neck-to-Shoulder Ratio: {fit_neck_w/fit_sh_w:.1%}")
        
        for key, act_val in info["actual"].items():
            app_key = "neck_circumference" if key == "neck" else ("waist_circumference" if key == "waist" else ("hip_circumference" if key == "hip" else key))
            pred_cm = measurements[app_key]
            pred_in = pred_cm / 2.54
            diff_in = pred_in - act_val
            all_diffs.append(diff_in)
            print(f"    {key:15}: Pred = {pred_in:5.1f} in | Actual = {act_val:5.1f} in | Diff = {diff_in:+5.1f} in")
            
    rmse = np.sqrt(np.mean(np.array(all_diffs) ** 2))
    print(f"\nOverall RMSE (inches): {rmse:.4f}")

if __name__ == "__main__":
    evaluate_neck_sanitization()
