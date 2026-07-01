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
    extract_silhouette_profile
)

# SOTABodyModel but with different fitting constraints
class ConstrainedBodyModel:
    def __init__(self, constraint_mode="none", gender="female"):
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
        control_points = control_points_female
        for j in range(100):
            y = self.y_ratios[j]
            w_val = 0
            d_val = 0
            denom = 0
            for cy, cw, cd in control_points:
                dist = (y - cy) ** 2
                weight = np.exp(-dist / 0.005)
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
        
        # Sigmas
        self.landmark_spreads = [0.05, 0.04, 0.06, 0.07, 0.07, 0.08]
        
        for center, spread in zip(self.landmark_centers, self.landmark_spreads):
            dist = (self.y_ratios - center) ** 2
            kernel = np.exp(-dist / (2 * (spread ** 2)))
            self.blendshapes.append(torch.tensor(kernel, dtype=torch.float32))
        self.blendshapes = torch.stack(self.blendshapes)
        self.constraint_mode = constraint_mode

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
            
        # Optimization variables (betas initialized to 0)
        betas_w = torch.zeros(6, dtype=torch.float32, requires_grad=True)
        betas_d = torch.zeros(6, dtype=torch.float32, requires_grad=True)
        
        # Configure variables to optimize based on constraint mode
        if self.constraint_mode == "zero_neck_beta":
            # We only optimize indices 1 to 5 of betas, index 0 (neck) is kept at 0
            opt_vars = []
        else:
            opt_vars = [betas_w, betas_d]
            
        optimizer = torch.optim.LBFGS([betas_w, betas_d], lr=0.15, max_iter=epochs)
        
        def closure():
            optimizer.zero_grad()
            
            # If zero_neck_beta, we zero out the neck beta gradients/values
            if self.constraint_mode == "zero_neck_beta":
                with torch.no_grad():
                    betas_w[0].copy_(0.0)
                    betas_d[0].copy_(0.0)
                    
            w_cm, d_cm = self.reconstruct_profile(betas_w, betas_d, height_cm)
            
            # Loss up to index 78 (shoulders)
            diff_w = w_cm[:79] - front_t[:79]
            loss_w = diff_w ** 2
            diff_d = d_cm[:79] - side_t[:79]
            loss_d = diff_d ** 2
            
            E_fit = torch.mean(loss_w) + torch.mean(loss_d)
            
            # Neck specific loss if target_neck_w is provided
            E_neck = 0.0
            if target_neck_w is not None and self.constraint_mode == "neck_target_loss":
                # Slices 80 to 85 target the neck width
                neck_target_t = torch.full((6,), target_neck_w / 2.0, dtype=torch.float32)
                E_neck = 2.0 * torch.mean((w_cm[80:86] - neck_target_t) ** 2)
            
            E_prior = 0.002 * (torch.sum(betas_w ** 2) + torch.sum(betas_d ** 2))
            
            if self.constraint_mode == "strong_neck_prior":
                # Heavily penalize deviation of neck betas
                E_prior += 5.0 * (betas_w[0]**2 + betas_d[0]**2)
                
            smooth_w = torch.mean((w_cm[2:] - 2 * w_cm[1:-1] + w_cm[:-2]) ** 2)
            smooth_d = torch.mean((d_cm[2:] - 2 * d_cm[1:-1] + d_cm[:-2]) ** 2)
            E_smooth = 1.0 * (smooth_w + smooth_d)
            
            total_loss = E_fit + E_prior + E_smooth + E_neck
            total_loss.backward()
            return total_loss
            
        optimizer.step(closure)
        
        # Enforce zero neck beta one last time if mode is active
        if self.constraint_mode == "zero_neck_beta":
            with torch.no_grad():
                betas_w[0].copy_(0.0)
                betas_d[0].copy_(0.0)
                
        return betas_w.detach(), betas_d.detach()

# Let's test on Anisha's actual silhouettes
decoded_front = cv2.imread("c:/Users/sarth/Desktop/mes_poc/mes_data/anisha_front.jpeg")
fh, fw, _ = decoded_front.shape
pose_model = YOLO("yolov8m-pose.pt")
seg_model = YOLO("yolov8m-seg.pt")

res_f = pose_model(decoded_front, verbose=False)
best_pose_f = np.argmax((res_f[0].boxes.xyxy.cpu().numpy()[:, 2] - res_f[0].boxes.xyxy.cpu().numpy()[:, 0]) * (res_f[0].boxes.xyxy.cpu().numpy()[:, 3] - res_f[0].boxes.xyxy.cpu().numpy()[:, 1]))
kpts_f = res_f[0].keypoints.xyn[best_pose_f].cpu().numpy()

seg_res_f = seg_model(decoded_front, verbose=False)
best_seg_f = np.where(seg_res_f[0].boxes.cls.cpu().numpy() == 0)[0][0]
mask_t_f = seg_res_f[0].masks.data[best_seg_f].unsqueeze(0).unsqueeze(0).float()
yolo_fmask = (F.interpolate(mask_t_f, size=(fh, fw), mode='bilinear', align_corners=False).squeeze() > 0.5).cpu().numpy().astype(np.uint8) * 255

front_lm = [MockLandmark(0,0) for _ in range(33)]
for coco, mp_idx in COCO_TO_MEDIAPIPE.items():
    front_lm[mp_idx] = MockLandmark(float(kpts_f[coco][0]), float(kpts_f[coco][1]))
    
scale_front, _ = calculate_scale_factor(front_lm, yolo_fmask, fh, 150.0)
front_sil = extract_silhouette_profile(front_lm, yolo_fmask, fh, scale_front, 150.0, num_slices=100, is_side=False) * 1.07

# Calculate target neck width
left_ear_x = front_lm[7].x * fw
right_ear_x = front_lm[8].x * fw
ear_dist_cm = abs(left_ear_x - right_ear_x) * scale_front
neck_w_cm = ear_dist_cm * 0.54 # 9.16 cm
neck_circ_base = np.pi * neck_w_cm
neck_circ_override = neck_circ_base * 1.162 * 1.0
target_neck_w = neck_circ_override / np.pi # 10.64 cm (half-width 5.32 cm)

print(f"Target Neck Width: {target_neck_w:.2f} cm (Half-width: {target_neck_w/2.0:.2f} cm)")
print(f"Target Shoulder Width (from silhouette): {front_sil[78]*2:.2f} cm (Half-width: {front_sil[78]:.2f} cm)")

modes = ["none", "zero_neck_beta", "strong_neck_prior", "neck_target_loss"]
for mode in modes:
    print(f"\nEvaluating mode: {mode}")
    model = ConstrainedBodyModel(constraint_mode=mode, gender="female")
    betas_w, betas_d = model.fit_shape(front_sil, None, 150.0, target_neck_w=target_neck_w)
    w_cm, d_cm = model.reconstruct_profile(betas_w, betas_d, 150.0)
    
    fit_neck = w_cm[82].item() * 2
    fit_sh = w_cm[78].item() * 2
    print(f"  betas_w: {betas_w.numpy()}")
    print(f"  Fitted Neck Width: {fit_neck:.2f} cm")
    print(f"  Fitted Shoulder Width: {fit_sh:.2f} cm")
