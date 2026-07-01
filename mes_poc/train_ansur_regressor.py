"""
train_ansur_regressor.py
========================
Trains a GradientBoosting regressor on the ANSUR II anthropometric dataset
(6,068 subjects, 93 measurements).  Outputs a joblib-saved model that predicts
body circumferences from height + weight + gender.

This replaces ALL hardcoded ratio constants in sanitize_silhouette_profile().

Run:  .\\venv\\Scripts\\python.exe train_ansur_regressor.py
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.multioutput import MultiOutputRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
import joblib
import os
import sys

MALE_CSV   = "mes_data/ansur/ANSUR II MALE Public.csv"
FEMALE_CSV = "mes_data/ansur/ANSUR II FEMALE Public.csv"

# ---------------------------------------------------------------------------
# 1. Load data
# ---------------------------------------------------------------------------
print("Loading ANSUR II datasets...")
male   = pd.read_csv(MALE_CSV,   encoding='latin-1')
female = pd.read_csv(FEMALE_CSV, encoding='latin-1')

# Normalise column names (some versions use different capitalisation)
male.columns   = [c.strip().lower() for c in male.columns]
female.columns = [c.strip().lower() for c in female.columns]

print(f"  Male   subjects: {len(male)}")
print(f"  Female subjects: {len(female)}")

# Print relevant columns for debugging
all_cols = set(male.columns.tolist())
print("\nAvailable measurement columns (sample):")
for c in sorted(all_cols):
    if any(k in c for k in ['chest','waist','hip','neck','thigh','shoulder',
                              'stature','weight','gender','bicep','biacrom']):
        print(f"  {c}")

# ---------------------------------------------------------------------------
# 2. Identify correct column names (handle dataset variants)
# ---------------------------------------------------------------------------
def find_col(df, candidates):
    """Return the first candidate column name that exists in df.columns."""
    for c in candidates:
        if c in df.columns:
            return c
    raise KeyError(f"None of {candidates} found in columns: {list(df.columns)[:20]}")

# Height / weight
col_stature = find_col(male, ['stature'])            # mm
col_weight  = find_col(male, ['weightkg', 'weight']) # kg or 0.1kg — check below

# Circumferences (all in mm in ANSUR II)
col_chest   = find_col(male, ['chestcircumference', 'chest circumference'])
col_waist   = find_col(male, ['waistcircumference', 'waist circumference'])
col_hip     = find_col(male, ['buttockcircumference', 'hipcircumference',
                               'hip circumference', 'hipbreadth', 'hip breadth'])
col_neck    = find_col(male, ['neckcircumference', 'neckcircumferencebase',
                               'neckbasecirc', 'neck base circ',
                               'neckcircumference'])
col_thigh   = find_col(male, ['thighcircumference', 'thigh circumference'])
col_shoulder= find_col(male, ['biacromialbreadth', 'biacromialbre', 'biacromial breadth',
                               'shoulderwidth', 'shoulder width'])

print(f"\nUsing columns:")
print(f"  stature  => {col_stature}")
print(f"  weight   => {col_weight}")
print(f"  chest    => {col_chest}")
print(f"  waist    => {col_waist}")
print(f"  hip      => {col_hip}")
print(f"  neck     => {col_neck}")
print(f"  thigh    => {col_thigh}")
print(f"  shoulder => {col_shoulder}")

# ---------------------------------------------------------------------------
# 3. Build combined dataframe
# ---------------------------------------------------------------------------
TARGET_COLS = {
    'chest':    col_chest,
    'waist':    col_waist,
    'hip':      col_hip,
    'neck':     col_neck,
    'thigh':    col_thigh,
    'shoulder': col_shoulder,
}

male['gender_code']   = 0
female['gender_code'] = 1

KEEP = [col_stature, col_weight, 'gender_code'] + list(TARGET_COLS.values())
df = pd.concat([male[KEEP], female[KEEP]], ignore_index=True).dropna()

# Detect weight unit: ANSUR weightkg should already be in kg (float ~50-120)
sample_weight = df[col_weight].median()
if sample_weight > 500:            # stored as grams or hectograms → convert
    df[col_weight] = df[col_weight] / 10.0
    print(f"  Weight converted from decagrams to kg (median was {sample_weight:.0f})")

print(f"\nCombined dataset: {len(df)} subjects after dropping NaN rows")

# Convert mm → cm for all targets
X = df[[col_stature, col_weight, 'gender_code']].values.astype(float)
# stature is in mm → convert to cm
X[:, 0] = X[:, 0] / 10.0
Y = df[list(TARGET_COLS.values())].values.astype(float) / 10.0  # mm → cm

# biacromialbreadth is the FULL distance between acromions — no doubling needed.
# For shoulder we keep the value as-is (a full width, not half-width).

print(f"\nSample prediction target (female 150cm, 50kg):")
mask_f = (df['gender_code'] == 1) & (X[:, 0].astype(float) > 148) & (X[:, 0].astype(float) < 153)
sample = Y[mask_f].mean(axis=0) if mask_f.sum() > 0 else Y.mean(axis=0)
for name, val in zip(TARGET_COLS.keys(), sample):
    print(f"  {name:10s}: {val:.1f} cm")

# ---------------------------------------------------------------------------
# 4. Train model
# ---------------------------------------------------------------------------
print("\nTraining GradientBoosting regressor...")
X_tr, X_te, Y_tr, Y_te = train_test_split(X, Y, test_size=0.15, random_state=42)

pipe = Pipeline([
    ('scaler', StandardScaler()),
    ('reg', MultiOutputRegressor(
        GradientBoostingRegressor(
            n_estimators=300,
            max_depth=4,
            learning_rate=0.05,
            subsample=0.8,
            min_samples_leaf=5,
        ),
        n_jobs=-1
    ))
])
pipe.fit(X_tr, Y_tr)

r2 = pipe.score(X_te, Y_te)
pred_te = pipe.predict(X_te)
rmse_per_target = np.sqrt(np.mean((pred_te - Y_te)**2, axis=0))

print(f"\nHold-out R²:  {r2:.4f}")
print("Per-target RMSE (cm):")
for name, rmse in zip(TARGET_COLS.keys(), rmse_per_target):
    print(f"  {name:10s}: ±{rmse:.2f} cm")

# ---------------------------------------------------------------------------
# 5. Save
# ---------------------------------------------------------------------------
os.makedirs("mes_data/models", exist_ok=True)
joblib.dump(pipe,                     "mes_data/models/ansur_regressor.pkl")
joblib.dump(list(TARGET_COLS.keys()), "mes_data/models/ansur_target_names.pkl")

# Also save feature column order for the loader
meta = {
    'feature_names':  ['height_cm', 'weight_kg', 'gender_code'],
    'target_names':   list(TARGET_COLS.keys()),
    'ansur_col_map':  {k: v for k, v in TARGET_COLS.items()},
    'r2_holdout':     float(r2),
    'rmse_per_target': {k: float(v) for k, v in zip(TARGET_COLS.keys(), rmse_per_target)},
}
joblib.dump(meta, "mes_data/models/ansur_meta.pkl")

print(f"\n✅ Saved to mes_data/models/ansur_regressor.pkl")
print(f"   R² = {r2:.4f}  |  Training complete.")
