import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
import os

# ---------------------------------------------------------------------------
# BodyPrior: data-driven anthropometric prior from ANSUR II (6,068 subjects)
# ---------------------------------------------------------------------------
class BodyPrior:
    """
    Loads a scikit-learn regressor trained on the ANSUR II anthropometric
    dataset.  Given height (cm), weight (kg), and gender, returns predicted
    body circumferences as a dict {measurement_name: cm}.

    These predictions serve as SOFT CONSTRAINTS in the body-shape sanitiser,
    replacing every hardcoded ratio constant (chest_ratio, waist_ratio, …)
    with values derived from real human body scans.

    The model file is created by running:
        .\\venv\\Scripts\\python.exe train_ansur_regressor.py

    If the file is absent the class returns None (graceful fallback to
    the old hardcoded ratios so nothing breaks during development).
    """
    _instance = None

    MODEL_PATH = os.path.join("mes_data", "models", "ansur_regressor.pkl")
    NAMES_PATH = os.path.join("mes_data", "models", "ansur_target_names.pkl")

    @classmethod
    def get(cls):
        """Return singleton instance, or None if model file not yet trained."""
        if cls._instance is not None:
            return cls._instance
        if not os.path.exists(cls.MODEL_PATH):
            return None
        try:
            import joblib
            reg   = joblib.load(cls.MODEL_PATH)
            names = joblib.load(cls.NAMES_PATH)
            cls._instance = cls(reg, names)
            print(f"[BodyPrior] ANSUR II regressor loaded ({len(names)} targets).")
        except Exception as e:
            print(f"[BodyPrior] Failed to load regressor: {e}")
            return None
        return cls._instance

    def __init__(self, reg, names):
        self.reg   = reg
        self.names = names

    def predict(self, height_cm: float, weight_kg: float, gender: str) -> dict:
        """
        Predict body measurements.

        Returns
        -------
        dict  {name: value_in_cm}  for chest, waist, hip, neck, thigh, shoulder.
        """
        g = 1 if str(gender).lower() == "female" else 0
        X = [[height_cm, weight_kg, g]]
        try:
            y = self.reg.predict(X)[0]
        except Exception:
            return {}
        return dict(zip(self.names, y))



class SOTABodyModel:
    def __init__(self, num_slices=100, num_vertices_per_slice=32, gender="female"):
        self.num_slices = num_slices
        self.num_vertices = num_vertices_per_slice
        self.gender = gender.lower()
        
        # 1. Nominal body profile templates (normalized width/depth relative to height)
        # Ratios from 0 (ankles/feet) to 1.0 (head top)
        self.y_ratios = np.linspace(0.0, 1.0, num_slices)
        
        # Landmark indices (0-indexed slices)
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
        
        # Set up template width (w0) and depth (d0) profile curve
        self.w0 = np.zeros(num_slices)
        self.d0 = np.zeros(num_slices)
        
        # Construct template profile using Gaussian interpolation of key landmarks
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
            (0.82, 0.058, 0.058), # Neck (wider)
            (0.78, 0.135, 0.075), # Shoulder (wider)
            (0.70, 0.122, 0.085), # Chest (wider)
            (0.58, 0.100, 0.080), # Waist (broader)
            (0.46, 0.108, 0.082), # Hip (narrower than female)
            (0.35, 0.078, 0.078), # Thigh
            (0.22, 0.058, 0.058), # Knee
            (0.05, 0.040, 0.040), # Ankle
            (0.0,  0.046, 0.052)  # Feet
        ]

        control_points = control_points_male if self.gender == "male" else control_points_female
        
        # RBF interpolation for template profile
        for j in range(num_slices):
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
            
        # Convert templates to torch tensors
        self.w0_t = torch.tensor(self.w0, dtype=torch.float32)
        self.d0_t = torch.tensor(self.d0, dtype=torch.float32)
        self.y_ratios_t = torch.tensor(self.y_ratios, dtype=torch.float32)
        
        # 2. Shape Blendshapes influence mappings (Gaussian kernels centered at landmarks)
        self.blendshapes = []
        self.landmark_keys = ["neck", "shoulder", "chest", "waist", "hip", "thigh"]
        self.landmark_centers = [self.y_ratios[self.landmarks[k]] for k in self.landmark_keys]
        self.landmark_spreads = [0.05, 0.04, 0.06, 0.07, 0.07, 0.08] # Sigmas
        
        for center, spread in zip(self.landmark_centers, self.landmark_spreads):
            dist = (self.y_ratios - center) ** 2
            kernel = np.exp(-dist / (2 * (spread ** 2)))
            self.blendshapes.append(torch.tensor(kernel, dtype=torch.float32))
            
        self.blendshapes = torch.stack(self.blendshapes) # Shape: [6, num_slices]

    def reconstruct_profile(self, betas_w, betas_d, height_cm):
        """
        Reconstructs body width/depth profiles from shape parameters (betas).
        betas_w: shape [6] width modifiers
        betas_d: shape [6] depth modifiers
        """
        # Blendshapes offset
        offset_w = torch.sum(betas_w.unsqueeze(1) * self.blendshapes, dim=0)
        offset_d = torch.sum(betas_d.unsqueeze(1) * self.blendshapes, dim=0)
        
        # Final width and depth profiles in cm
        # The template is normalized by height, so scale by height_cm
        w_cm = height_cm * self.w0_t * (1.0 + offset_w)
        d_cm = height_cm * self.d0_t * (1.0 + offset_d)
        
        return w_cm, d_cm

    def generate_mesh(self, betas_w, betas_d, height_cm, target_neck_w=None):
        """
        Generates dense 3D vertices of the human body shape.
        target_neck_w: If provided (in cm, full-width), overrides neck mesh slices
                       (79-99) to smoothly taper from the shoulder down to the
                       ear-based neck width. This eliminates hair/chin silhouette
                       noise in the visual avatar without affecting measurements.
        """
        w_cm, d_cm = self.reconstruct_profile(betas_w, betas_d, height_cm)

        # --- Neck tapering post-process ---
        # The torso mesh is rendered only up to slice 72 (endSlice in HTML).
        # We taper slices 68-72 smoothly (cosine ease-in) so the torso top ring
        # already narrows toward shoulder-cap width.  This gives a natural funnel
        # instead of a flat boxy top that creates a visual ledge.
        if target_neck_w is not None:
            w_cm = w_cm.clone()
            d_cm = d_cm.clone()
            target_half      = target_neck_w / 2.0        # true neck half-width
            shoulder_cap_half = target_half * 1.5          # matches neckBaseRadius in HTML

            # Reference point: fitted width just below the taper zone (slice 71)
            ref_half_w = w_cm[71].item()
            ref_half_d = d_cm[71].item()

            # Slices 72-75: cosine ease-in from fitted width → shoulder-cap width
            taper_start, taper_end = 72, 75
            n_steps = taper_end - taper_start  # 3 steps
            for i in range(taper_start, taper_end + 1):
                t = (i - taper_start) / n_steps            # 0.0 → 1.0
                t_smooth = (1.0 - np.cos(t * np.pi)) / 2  # ease-in-out
                w_cm[i] = ref_half_w + t_smooth * (shoulder_cap_half - ref_half_w)
                d_cm[i] = ref_half_d + t_smooth * (shoulder_cap_half - ref_half_d)

            # Slices 76-82: continue narrowing from shoulder-cap width → true neck width
            for i in range(76, 83):
                t = (i - 75) / 7.0
                t_smooth = (1.0 - np.cos(t * np.pi)) / 2
                w_cm[i] = shoulder_cap_half + t_smooth * (target_half - shoulder_cap_half)
                d_cm[i] = shoulder_cap_half + t_smooth * (target_half - shoulder_cap_half)

            # Slices 83-99: hold at true neck width
            for i in range(83, 100):
                w_cm[i] = target_half
                d_cm[i] = target_half
        # --- End neck tapering ---


        y_cm = self.y_ratios_t * height_cm
        
        vertices = []
        angles = torch.linspace(0, 2 * np.pi, self.num_vertices, dtype=torch.float32)
        cos_a = torch.cos(angles)
        sin_a = torch.sin(angles)
        
        # Loop through each slice to build 3D vertices ring
        for j in range(self.num_slices):
            w = w_cm[j]
            d = d_cm[j]
            y = y_cm[j]
            
            # 3D points: X (width), Y (height), Z (depth)
            xs = w * cos_a
            ys = torch.full_like(angles, y)
            zs = d * sin_a
            
            slice_verts = torch.stack([xs, ys, zs], dim=1)
            vertices.append(slice_verts)
            
        return torch.stack(vertices), w_cm, d_cm

    def fit_shape(self, front_silhouette, side_silhouette, height_cm, epochs=250):
        """
        Fits the parametric 3D body model to front and side view silhouettes.
        front_silhouette: array of shape [100] containing width in cm at each slice
        side_silhouette: array of shape [100] containing depth in cm at each slice (or None)
        """
        # Convert silhouettes to torch tensors
        front_t = torch.tensor(front_silhouette, dtype=torch.float32)
        if side_silhouette is not None:
            side_t = torch.tensor(side_silhouette, dtype=torch.float32)
        else:
            # Fall back to template ratio profile (82% of width)
            side_t = front_t * 0.82
            
        # Optimization variables (betas initialized to 0)
        betas_w = torch.zeros(6, dtype=torch.float32, requires_grad=True)
        betas_d = torch.zeros(6, dtype=torch.float32, requires_grad=True)
        
        optimizer = optim.LBFGS([betas_w, betas_d], lr=0.15, max_iter=epochs)
        
        def closure():
            optimizer.zero_grad()
            w_cm, d_cm = self.reconstruct_profile(betas_w, betas_d, height_cm)
            
            # Symmetric L2 loss fits the front and side silhouettes extremely closely
            diff_w = w_cm - front_t
            loss_w = diff_w ** 2
            
            diff_d = d_cm - side_t
            loss_d = diff_d ** 2
            
            E_fit = torch.mean(loss_w) + torch.mean(loss_d)
            
            # Relaxed L2 regularization prior to allow close matching
            E_prior = 0.002 * (torch.sum(betas_w ** 2) + torch.sum(betas_d ** 2))
            
            # Relaxed smoothness prior keeps body shape natural but permits precise local fits
            smooth_w = torch.mean((w_cm[2:] - 2 * w_cm[1:-1] + w_cm[:-2]) ** 2)
            smooth_d = torch.mean((d_cm[2:] - 2 * d_cm[1:-1] + d_cm[:-2]) ** 2)
            E_smooth = 1.0 * (smooth_w + smooth_d)
            
            total_loss = E_fit + E_prior + E_smooth
            total_loss.backward()
            return total_loss
            
        optimizer.step(closure)
        
        # Return optimized variables detached
        return betas_w.detach(), betas_d.detach()

    def get_geodesic_circumference(self, vertices, slice_idx):
        """
        Computes the perimeter/geodesic tape measurement around the 3D mesh surface slice.
        """
        slice_verts = vertices[slice_idx] # Shape: [M, 3]
        
        # Distance between consecutive vertices around the ring
        v_next = torch.roll(slice_verts, shifts=-1, dims=0)
        dist = torch.sqrt(torch.sum((v_next - slice_verts) ** 2, dim=1))
        
        circumference = torch.sum(dist)
        return circumference.item()

    def calculate_measurements(self, betas_w, betas_d, height_cm, neck_circ_override=None, arm_length_override=None, weight_kg=None):
        """
        Slices the optimized 3D mesh to calculate virtual tape measurements.
        Returns all standard measurements needed for Indian garment tailoring
        (kurti, salwar kameez, blouse, trouser, etc.).
        """
        vertices, w_cm, d_cm = self.generate_mesh(betas_w, betas_d, height_cm)

        measurements = {}

        # Helper: geodesic circ at a specific slice index
        def circ(idx):
            return round(self.get_geodesic_circumference(vertices, idx), 2)

        # Helper: max circ in a slice range (for hip scan)
        def max_circ(lo, hi):
            return round(max(self.get_geodesic_circumference(vertices, i) for i in range(lo, hi + 1)), 2)

        # Fetch prior predictions if available
        prior = BodyPrior.get()
        p = {}
        if prior is not None and weight_kg is not None:
            p = prior.predict(height_cm, weight_kg, self.gender)

        # Helper for Bayesian/Prior blending
        def blend(key, mesh_val, weight_prior=0.75):
            if key in p:
                return round(weight_prior * p[key] + (1.0 - weight_prior) * mesh_val, 2)
            return round(mesh_val, 2)

        # Calculate dynamic BMI to adapt corrections to the user's body size
        height_m = height_cm / 100.0
        bmi = (weight_kg / (height_m ** 2)) if (weight_kg is not None and height_m > 0) else 22.0

        # ── CIRCUMFERENCES ────────────────────────────────────────────────────
        # 1. Neck Circumference
        neck_mesh = neck_circ_override if neck_circ_override is not None else circ(self.landmarks["neck"])
        measurements["neck_circumference"] = blend("neck", neck_mesh, weight_prior=0.75)

        # 2. Shoulder Width (flat 3D distance between left/right endpoints)
        sh_slice = vertices[self.landmarks["shoulder"]]
        left_pt  = sh_slice[0]
        right_pt = sh_slice[self.num_vertices // 2]
        mesh_shoulder = torch.sqrt(torch.sum((left_pt - right_pt) ** 2)).item()
        # Biacromial breadth is bone-to-bone; we multiply by 1.045 for tailoring shoulder width
        tailoring_prior_shoulder = p.get("shoulder", mesh_shoulder / 1.045) * 1.045
        # Dynamic shoulder offset based on BMI (more deltoid flesh depth for larger builds)
        shoulder_offset = 2.0 + max(0.0, bmi - 17.0) * 0.3
        measurements["shoulder_width"] = round(0.75 * tailoring_prior_shoulder + 0.25 * mesh_shoulder + shoulder_offset, 2)

        # 3. Chest Circumference (fullest point, ~slice 70)
        # Reduced prior weight to 0.55 to allow more actual silhouette capture, and added 2.0 cm tailoring tape ease
        measurements["chest_circumference"] = round(blend("chest", circ(self.landmarks["chest"]), weight_prior=0.55) + 2.0, 2)

        # 4. Upper Chest (calculate proportionally to avoid arm-pit merging bulge)
        if self.gender == "female":
            measurements["upper_chest_circumference"] = round(measurements["chest_circumference"] * 0.92, 2)
        else:
            measurements["upper_chest_circumference"] = round(measurements["chest_circumference"] * 0.97, 2)

        # 5. Lower Chest / Under-bust (calculate proportionally to avoid Gaussian bulging)
        if self.gender == "female":
            measurements["lower_chest_circumference"] = round(measurements["chest_circumference"] * 0.90, 2)
        else:
            measurements["lower_chest_circumference"] = round(measurements["chest_circumference"] * 0.95, 2)

        # 6. Waist Circumference
        # Dynamic waist offset compensates for abdominal depth estimation errors on heavier builds
        waist_offset = 1.0 + max(0.0, bmi - 17.0) * 0.5
        measurements["waist_circumference"] = round(blend("waist", circ(self.landmarks["waist"]), weight_prior=0.55) + waist_offset, 2)

        # 7. Hip Circumference (dynamic scan slices 40–52, find widest point)
        # Dynamic hip offset handles leg blending on slim builds (negative offset) and boundary cropping on heavier builds (positive offset)
        hip_offset = (bmi - 23.0) * 1.2
        measurements["hip_circumference"] = round(blend("hip", max_circ(40, 52), weight_prior=0.40) + hip_offset, 2)

        # 8. Upper Thigh Circumference (garment upper thigh with ease)
        # Silhouettes at slice 35 merge both legs together, so the raw mesh circumference is corrupted.
        # Instead, we rely 100% on the highly accurate single-leg ANSUR prior value + dynamic BMI-based tailoring ease.
        thigh_prior_val = p.get("thigh", circ(self.landmarks["thigh"]))
        thigh_ease = 1.0 + max(0.0, bmi - 17.0) * 0.1
        measurements["thigh_circumference"] = round(thigh_prior_val + thigh_ease, 2)

        # 9. Knee Circumference (Ghutna — slice 22 + ease)
        measurements["knee_circumference"] = round(circ(self.landmarks["knee"]) + 3.0, 2)

        # 10. Ankle / Bottom Round (garment trouser opening, proportional to Hip)
        measurements["ankle_circumference"] = round(measurements["hip_circumference"] * 0.30, 2)

        # 11. Bicep / Arm Round (upper arm; slice 35 is thigh-level on leg but for arm
        #     we estimate from chest circumference — bicep ≈ 33 % of chest for females,
        #     36 % for males.  This matches industry charts.)
        ratio = 0.36 if self.gender == "male" else 0.33
        measurements["bicep_circumference"] = round(measurements["chest_circumference"] * ratio, 2)

        # 12. Sleeve Bottom Round (wrist)
        #     For females (3/4 sleeve): 77% of bicep. For males: 60% of bicep (cuff).
        wrist_ratio = 0.60 if self.gender == "male" else 0.77
        measurements["wrist_circumference"] = round(measurements["bicep_circumference"] * wrist_ratio, 2)

        # 13. Armhole (arm-hole circumference of the garment).
        #     = π × arm-hole-diameter, where arm-hole-diameter ≈ 0.39 × chest_width.
        #     chest_width = 2 × w_cm[chest_slice]
        #     Since we shifted tapering, we can use the mesh w_cm[70] safely
        chest_hw  = float(w_cm[self.landmarks["chest"]].item())  # half-width
        armhole_d = chest_hw * 2 * 0.39                          # full chest width × 0.39
        measurements["armhole_circumference"] = round(np.pi * armhole_d, 2)

        # ── LENGTHS (derived from landmark Y elevations) ────────────────────
        y_coords   = self.y_ratios * height_cm
        shoulder_y = y_coords[self.landmarks["shoulder"]]
        chest_y    = y_coords[self.landmarks["chest"]]
        waist_y    = y_coords[self.landmarks["waist"]]
        hip_y      = y_coords[self.landmarks["hip"]]
        ankle_y    = y_coords[self.landmarks["ankle"]]
        neck_y     = y_coords[self.landmarks["neck"]]

        # 14. Trouser Length (outseam: waist to ankle × 1.13)
        measurements["trouser_length"] = round((waist_y - ankle_y) * 1.13, 2)

        # 15. Arm Length / Sleeve Length
        full_arm = arm_length_override if arm_length_override is not None else (shoulder_y - hip_y) * 0.86
        if self.gender == "female":
            # For females: 3/4 sleeve length (75% of full arm length)
            measurements["arm_length"] = round(full_arm * 0.75, 2)
        else:
            measurements["arm_length"] = round(full_arm, 2)

        # 16. Shirt / Kurti Length
        if self.gender == "female":
            # For females: Kurti length from shoulder down to calf (ratio ~0.08)
            # ankle_y is ratio 0.05, so (shoulder_y - ankle_y) * 0.96 is ~calf
            measurements["shirt_length"] = round((shoulder_y - ankle_y) * 0.96, 2)
        else:
            # For males: hip line shirt length
            measurements["shirt_length"] = round((shoulder_y - hip_y) * 1.40, 2)

        # 17. Body Length / Back Length (neck base to waist — used in salwar kameez)
        measurements["body_length"] = round(neck_y - waist_y, 2)

        # 18. Tucks Point (shoulder tip to bust/chest point — used for dart placement)
        #     Bust / 4 + 3.0 cm (~1.2 in ease)
        measurements["tucks_point"] = round(measurements["chest_circumference"] / 4.0 + 3.0, 2)

        # 19. Full Height (from user input — useful to display alongside garment lengths)
        measurements["full_height"] = round(height_cm, 2)

        return measurements
