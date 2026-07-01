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

class TaperedBodyModel(SOTABodyModel):
    def generate_mesh(self, betas_w, betas_d, height_cm, target_neck_w=None):
        w_cm, d_cm = self.reconstruct_profile(betas_w, betas_d, height_cm)
        
        # Clone to avoid modifying in-place if tracking gradients (though we detach anyway)
        w_cm = w_cm.clone()
        d_cm = d_cm.clone()
        
        if target_neck_w is not None:
            target_neck_half_w = target_neck_w / 2.0
            
            # Slices 79 to 82: taper from shoulder (78) to target neck width
            for i in range(79, 83):
                t = (i - 78) / 4.0
                w_cm[i] = w_cm[78] + t * (target_neck_half_w - w_cm[78])
                d_cm[i] = d_cm[78] + t * (target_neck_half_w - d_cm[78])
                
            # Slices 83 to 99: set to target neck width
            for i in range(83, 100):
                w_cm[i] = target_neck_half_w
                d_cm[i] = target_neck_half_w
                
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

# Test on Anisha
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

for idx in range(38):
    front_sil[idx] *= 0.60
    
clean_front, _ = sanitize_silhouette_profile(front_sil, None, 150.0, "average")

# Ear-based neck
left_ear_x = front_lm[7].x * fw
right_ear_x = front_lm[8].x * fw
ear_dist_cm = abs(left_ear_x - right_ear_x) * scale_front
neck_w_cm = ear_dist_cm * 0.54
neck_circ_base = np.pi * neck_w_cm
neck_circ_override = neck_circ_base * 1.162 * 1.0
target_neck_w = neck_circ_override / np.pi

# Fit shape (original code, restricted to index 78 to avoid neck noise)
class RestrictedBodyModel(SOTABodyModel):
    def fit_shape(self, front_silhouette, side_silhouette, height_cm, epochs=250):
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
            diff_w = w_cm[:79] - front_t[:79]
            loss_w = diff_w ** 2
            diff_d = d_cm[:79] - side_t[:79]
            loss_d = diff_d ** 2
            E_fit = torch.mean(loss_w) + torch.mean(loss_d)
            E_prior = 0.002 * (torch.sum(betas_w ** 2) + torch.sum(betas_d ** 2))
            smooth_w = torch.mean((w_cm[2:] - 2 * w_cm[1:-1] + w_cm[:-2]) ** 2)
            smooth_d = torch.mean((d_cm[2:] - 2 * d_cm[1:-1] + d_cm[:-2]) ** 2)
            E_smooth = 1.0 * (smooth_w + smooth_d)
            total_loss = E_fit + E_prior + E_smooth
            total_loss.backward()
            return total_loss
        optimizer.step(closure)
        return betas_w.detach(), betas_d.detach()

model = RestrictedBodyModel(gender="female")
betas_w, betas_d = model.fit_shape(clean_front, None, 150.0)

# Evaluate original vs tapered mesh
tapered_model = TaperedBodyModel(gender="female")
v_orig, w_orig, d_orig = tapered_model.generate_mesh(betas_w, betas_d, 150.0)
v_tap, w_tap, d_tap = tapered_model.generate_mesh(betas_w, betas_d, 150.0, target_neck_w=target_neck_w)

print("Original mesh widths:")
print(f"  Neck (82): {w_orig[82].item()*2:.2f} cm")
print(f"  Shoulder (78): {w_orig[78].item()*2:.2f} cm")
print("Tapered mesh widths:")
print(f"  Neck (82): {w_tap[82].item()*2:.2f} cm (Target: {target_neck_w:.2f} cm)")
print(f"  Shoulder (78): {w_tap[78].item()*2:.2f} cm")
print(f"  Neck-to-Shoulder Ratio: {w_tap[82].item()*2 / (w_tap[78].item()*2):.1%}")

# Assert shoulder is unchanged
assert abs(w_orig[78].item() - w_tap[78].item()) < 1e-5
print("Shoulder width remains perfectly unaffected by neck tapering!")
