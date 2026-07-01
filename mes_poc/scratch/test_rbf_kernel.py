import numpy as np

def generate_profile(divisor, gender="female"):
    y_ratios = np.linspace(0.0, 1.0, 100)
    w0 = np.zeros(100)
    d0 = np.zeros(100)
    
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
    
    for j in range(100):
        y = y_ratios[j]
        w_val = 0
        d_val = 0
        denom = 0
        for cy, cw, cd in control_points_female:
            dist = (y - cy) ** 2
            weight = np.exp(-dist / divisor)
            w_val += weight * cw
            d_val += weight * cd
            denom += weight
        w0[j] = w_val / denom
        d0[j] = d_val / denom
        
    return w0, d0

if __name__ == "__main__":
    height_cm = 150.0
    for div in [0.005, 0.002, 0.001, 0.0006]:
        w0, d0 = generate_profile(div)
        neck_w = w0[82] * height_cm * 2
        sh_w = w0[78] * height_cm * 2
        print(f"Divisor: {div:.4f} | Template Neck: {neck_w:.2f} cm | Template Shoulder: {sh_w:.2f} cm | Ratio: {neck_w/sh_w:.1%}")
