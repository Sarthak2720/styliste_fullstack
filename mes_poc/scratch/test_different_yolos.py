import cv2
import numpy as np
import torch
import torch.nn.functional as F
from ultralytics import YOLO
import sys
import os

sys.path.append("c:/Users/sarth/Desktop/mes_poc")

from app import (
    MockLandmark,
    COCO_TO_MEDIAPIPE,
    calculate_scale_factor,
    extract_silhouette_profile
)
from sota_mesh import SOTABodyModel

def test_yolo_model(model_name, gender="female"):
    print(f"\n--- Testing with YOLO model: {model_name} ---")
    pose_model = YOLO(f"{model_name}-pose.pt")
    seg_model = YOLO(f"{model_name}-seg.pt")
    
    decoded_front = cv2.imread("c:/Users/sarth/Desktop/mes_poc/mes_data/anisha_front.jpeg")
    decoded_side = cv2.imread("c:/Users/sarth/Desktop/mes_poc/mes_data/anisha_side.jpeg")
    fh, fw, _ = decoded_front.shape
    sh, sw, _ = decoded_side.shape
    
    # Front
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
    print(f"Scale factor: {scale_front:.5f}")
    
    # Let's print ear, shoulder and neck measurements from yolo landmarks
    left_ear_x = front_lm[7].x * fw
    right_ear_x = front_lm[8].x * fw
    ear_dist_cm = abs(left_ear_x - right_ear_x) * scale_front
    left_sh_x = front_lm[11].x * fw
    right_sh_x = front_lm[12].x * fw
    sh_dist_cm = abs(left_sh_x - right_sh_x) * scale_front
    
    print(f"Ear distance: {ear_dist_cm:.2f} cm")
    print(f"Shoulder joint distance: {sh_dist_cm:.2f} cm")
    
    # Silhouette profile
    front_sil = extract_silhouette_profile(front_lm, yolo_fmask, fh, scale_front, 150.0, num_slices=100, is_side=False) * 1.07
    print(f"Raw Silhouette neck (82): {front_sil[82]:.2f} cm, shoulder (78): {front_sil[78]:.2f} cm")
    
    return front_sil, scale_front

if __name__ == "__main__":
    # Test YOLOv8m
    sil_m, scale_m = test_yolo_model("yolov8m")
    # Test YOLOv8l
    try:
        sil_l, scale_l = test_yolo_model("yolov8l")
    except Exception as e:
        print("Failed to run YOLOv8l:", e)
    # Test YOLOv8x
    try:
        sil_x, scale_x = test_yolo_model("yolov8x")
    except Exception as e:
        print("Failed to run YOLOv8x:", e)
