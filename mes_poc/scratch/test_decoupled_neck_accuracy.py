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

class ConstrainedBodyModel:
    def __init__(self, rbf_divisor=0.001, neck_spread=0.015, gender="female"):
        self.num_slices = 100
        self.num_vertices = 32
        self.gender = gender.lower()
        self.y_ratios = np.linspace(0.0, 1.0, 100)
        self.landmarks = {
            "neck": 82,
            "shoulder": 78,
            "chest": 70,
            "waist": 58,
            "hip": 46,
            "thigh": 35,
            "knee": 22,
            "ankle": 5
        }
        self.w0 = np.zeros(100)
        self.d0 = np.zeros(100)
        
        control_points_female = [
            (1.0,  0.06,  0.06),  # Head top
            (0.88, 0.07,  0.07),  # Forehead
            (0.82, 0.05,  0.05),  # Neck
            (0.78, 0.12,  0.07),  # Shoulder
            (0.70, 0.11,  0.08),  # Chest
            (0.58, 0.092, 0.075), # Waist
            (0.46, 0.115, 0.086), # Hip
            (0.35, 0.075, 0.075), # Thigh
            (0.22, 0.055, 0.055), # Knee
            (0.05, 0.038, 0.038), # Ankle
            (0.0,  0.045, 0.05)   # Feet
        ]
        control_points_male = [
            (1.0,  0.06,  0.06),  # Head top
            (0.88, 0.07,  0.07),  # Forehead
            (0.82, 0.058, 0.058), # Neck
            (0.78, 0.135, 0.075), # Shoulder
            (0.70, 0.122, 0.085), # Chest
            (0.58, 0.100, 0.080), # Waist
            (0.46, 0.108, 0.082), # Hip
            (0.35, 0.078, 0.078), # Thigh
            (0.22, 0.058, 0.058), # Knee
            (0.05, 0.040, 0.040), # Ankle
            (0.0,  0.046, 0.052)  # Feet
        ]
        control_points = control_points_male if self.gender == "male" else control_points_female
        
        for j in range(100):
            y = self.y_ratios[j]
            w_val = 0
            d_val = 0
            denom = 0
            for cy, cw, cd in control_points:
                dist = (y - cy) ** 2
                weight = np.exp(-dist / rbf_divisor)
                w_val += weight * cw
                d_val += weight * cd
                denom += weight
            self.w0[j] = w_val / denom
            self.d0[j] = d_val / denom
            
        self.w0_t = torch.tensor(self.w0, dtype=torch.float32)
        self.d0_t = torch.tensor(self.d0, dtype=torch.float32)
        self.y_ratios_t = torch.tensor(self.y_ratios, dtype=torch.float32)
        
        self.blendshapes = []
        self.landmark_keys = ["neck", "shoulder", "chest", "waist", "hip", "thigh"]
        self.landmark_centers = [self.y_ratios[self.landmarks[k]] for k in self.landmark_keys]
        self.landmark_spreads = [neck_spread, 0.04, 0.06, 0.07, 0.07, 0.08]
        
        for center, spread in zip(self.landmark_centers, self.landmark_spreads):
            dist = (self.y_ratios - center) ** 2
            kernel = np.exp(-dist / (2 * (spread ** 2)))
            self.blendshapes.append(torch.tensor(kernel, dtype=torch.float32))
        self.blendshapes = torch.stack(self.blendshapes)

    def reconstruct_profile(self, betas_w, betas_d, height_cm):
        offset_w = torch.sum(betas_w.unsqueeze(1) * self.blendshapes, dim=0)
        offset_d = torch.sum(betas_d.unsqueeze(1) * self.blendshapes, dim=0)
        w_cm = height_cm * self.w0_t * (1.0 + offset_w)
        d_cm = height_cm * self.d0_t * (1.0 + offset_d)
        return w_cm, d_cm

    def fit_shape(self, front_silhouette, side_silhouette, height_cm, target_neck_w=None, epochs=250):
        front_t = torch.tensor(front_silhouette, dtype=torch.float32)
        if side_silhouette is not None:
            side_t = torch.tensor(side_silhouette, dtype=torch.float32)
        else:
            side_t = front_t * 0.82
            
        betas_w = torch.zeros(6, dtype=torch.float32, requires_grad=True)
        betas_d = torch.zeros(6, dtype=torch.float32, requires_grad=True)
        
        optimizer = torch.optim.LBFGS([betas_w, betas_d], lr=0.15, max_iter=epochs)
        
        def closure():
            optimizer.zero_grad()
            w_cm, d_cm = self.reconstruct_profile(betas_w, betas_d, height_cm)
            
            # Fitting loss up to shoulders (idx 78)
            diff_w = w_cm[:79] - front_t[:79]
            loss_w = diff_w ** 2
            diff_d = d_cm[:79] - side_t[:79]
            loss_d = diff_d ** 2
            E_fit = torch.mean(loss_w) + torch.mean(loss_d)
            
            # Targeted neck width loss for slices 80 to 85 (neck region)
            E_neck = 0.0
            if target_neck_w is not None:
                # Both width and depth are constrained to target neck width
                neck_target_w = torch.full((6,), target_neck_w / 2.0, dtype=torch.float32)
                neck_target_d = torch.full((6,), target_neck_w / 2.0, dtype=torch.float32)
                E_neck = 2.0 * (torch.mean((w_cm[80:86] - neck_target_w) ** 2) + torch.mean((d_cm[80:86] - neck_target_d) ** 2))
                
            E_prior = 0.002 * (torch.sum(betas_w ** 2) + torch.sum(betas_d ** 2))
            
            smooth_w = torch.mean((w_cm[2:] - 2 * w_cm[1:-1] + w_cm[:-2]) ** 2)
            smooth_d = torch.mean((d_cm[2:] - 2 * d_cm[1:-1] + d_cm[:-2]) ** 2)
            E_smooth = 1.0 * (smooth_w + smooth_d)
            
            total_loss = E_fit + E_prior + E_smooth + E_neck
            total_loss.backward()
            return total_loss
            
        optimizer.step(closure)
        return betas_w.detach(), betas_d.detach()

    def get_geodesic_circumference(self, vertices, slice_idx):
        slice_verts = vertices[slice_idx]
        v_next = torch.roll(slice_verts, shifts=-1, dims=0)
        dist = torch.sqrt(torch.sum((v_next - slice_verts) ** 2, dim=1))
        return torch.sum(dist).item()

    def generate_mesh(self, betas_w, betas_d, height_cm):
        w_cm, d_cm = self.reconstruct_profile(betas_w, betas_d, height_cm)
        y_cm = self.y_ratios_t * height_cm
        vertices = []
        angles = torch.linspace(0, 2 * np.pi, self.num_vertices, dtype=torch.float32)
        cos_a = torch.cos(angles)
        sin_a = torch.sin(angles)
        for j in range(100):
            w = w_cm[j]
            d = d_cm[j]
            y = y_cm[j]
            xs = w * cos_a
            ys = torch.full_like(angles, y)
            zs = d * sin_a
            vertices.append(torch.stack([xs, ys, zs], dim=1))
        return torch.stack(vertices), w_cm, d_cm

    def calculate_measurements(self, betas_w, betas_d, height_cm, neck_circ_override=None, arm_length_override=None):
        vertices, w_cm, d_cm = self.generate_mesh(betas_w, betas_d, height_cm)
        measurements = {}
        if neck_circ_override is not None:
            measurements["neck_circumference"] = round(neck_circ_override, 2)
        else:
            measurements["neck_circumference"] = round(self.get_geodesic_circumference(vertices, self.landmarks["neck"]), 2)
        
        sh_slice = vertices[self.landmarks["shoulder"]]
        left_shoulder_pt = sh_slice[0]
        right_shoulder_pt = sh_slice[self.num_vertices // 2]
        measurements["shoulder_width"] = round(torch.sqrt(torch.sum((left_shoulder_pt - right_shoulder_pt) ** 2)).item(), 2)
        measurements["chest_circumference"] = round(self.get_geodesic_circumference(vertices, self.landmarks["chest"]), 2)
        measurements["waist_circumference"] = round(self.get_geodesic_circumference(vertices, self.landmarks["waist"]), 2)
        
        max_hip_circ = 0.0
        for idx in range(40, 53):
            circ = self.get_geodesic_circumference(vertices, idx)
            if circ > max_hip_circ:
                max_hip_circ = circ
        measurements["hip_circumference"] = round(max_hip_circ, 2)
        measurements["thigh_circumference"] = round(measurements["hip_circumference"] * 0.54, 2)
        
        y_coords = self.y_ratios * height_cm
        waist_y = y_coords[self.landmarks["waist"]]
        ankle_y = y_coords[self.landmarks["ankle"]]
        shoulder_y = y_coords[self.landmarks["shoulder"]]
        hip_y = y_coords[self.landmarks["hip"]]
        
        measurements["trouser_length"] = round((waist_y - ankle_y) * 1.10, 2)
        if arm_length_override is not None:
            measurements["arm_length"] = round(arm_length_override, 2)
        else:
            measurements["arm_length"] = round((shoulder_y - hip_y) * 0.86, 2)
        measurements["shirt_length"] = round((shoulder_y - hip_y) * 0.95, 2)
        
        return measurements

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

def evaluate_accuracy(rbf_div, neck_sp):
    print(f"\nEvaluating Config: RBF Divisor={rbf_div}, Neck Spread={neck_sp}")
    all_diffs = []
    
    for name, info in targets.items():
        # Load and process front
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
        target_neck_w = neck_circ_override / np.pi
        
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
        
        # Fit
        model = ConstrainedBodyModel(rbf_divisor=rbf_div, neck_spread=neck_sp, gender=info["gender"])
        betas_w, betas_d = model.fit_shape(clean_front, clean_side, info["height_cm"], target_neck_w=target_neck_w)
        
        measurements = model.calculate_measurements(
            betas_w, betas_d, info["height_cm"],
            neck_circ_override=neck_circ_override,
            arm_length_override=arm_length_override
        )
        
        vertices, w_cm, d_cm = model.generate_mesh(betas_w, betas_d, info["height_cm"])
        fit_neck_w = w_cm[82].item() * 2
        fit_sh_w = w_cm[78].item() * 2
        
        print(f"Subject: {name.upper()}")
        print(f"  Fitted Neck Width: {fit_neck_w:.2f} cm | Fitted Shoulder Width: {fit_sh_w:.2f} cm")
        print(f"  Neck-to-Shoulder Ratio: {fit_neck_w/fit_sh_w:.1%}")
        
        for key, act_val in info["actual"].items():
            app_key = "neck_circumference" if key == "neck" else ("waist_circumference" if key == "waist" else ("hip_circumference" if key == "hip" else key))
            pred_cm = measurements[app_key]
            pred_in = pred_cm / 2.54
            diff_in = pred_in - act_val
            all_diffs.append(diff_in)
            
    rmse = np.sqrt(np.mean(np.array(all_diffs) ** 2))
    print(f"Overall RMSE (inches): {rmse:.4f}")
    return rmse

if __name__ == "__main__":
    # Test combinations
    evaluate_accuracy(rbf_div=0.001, neck_sp=0.015)
    evaluate_accuracy(rbf_div=0.0006, neck_sp=0.015)
