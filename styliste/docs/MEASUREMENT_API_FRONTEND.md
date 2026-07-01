# Measurement Processing API – Frontend Integration Guide

## Overview

The measurement flow has changed from **synchronous** (frontend → Python server directly) to **asynchronous** (frontend → backend → Python server in background).

- **Before**: Frontend called `http://213.210.21.155:5000/process` directly and waited for the response (~90s).
- **After**: Frontend calls `POST /api/measurements/process` on the backend. The backend returns immediately with a `jobId`. Processing runs in the background. The frontend polls `GET /api/measurements/process/{jobId}` until status is `COMPLETED` or `FAILED`, then shows a popup notification.

---

## Base URL

Use your backend base URL (e.g. `http://localhost:8090` or your deployed API URL). All endpoints are under `/api/measurements`.

---

## Authentication

All endpoints require a valid JWT in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

---

## Endpoint 1: Submit Measurement (Async)

**POST** `/api/measurements/process`

**Content-Type:** `multipart/form-data`

### Request Fields

| Field            | Type   | Required | Values / Notes                                                                 |
|------------------|--------|----------|---------------------------------------------------------------------------------|
| gender           | string | yes      | `"male"` or `"female"`                                                         |
| age              | number | yes      | 13–100                                                                         |
| height           | number | yes      | e.g. 170                                                                       |
| height_unit      | string | yes      | `"cm"` or `"m"` (default: `"cm"`)                                              |
| weight           | number | yes      | e.g. 65                                                                        |
| weight_unit      | string | yes      | `"kg"` or `"lbs"` (default: `"kg"`)                                            |
| age_group        | string | no       | `"teen"` \| `"adult"` \| `"middle_age"` \| `"senior"`                           |
| fat_distribution | string | no       | `"upper"` \| `"middle"` \| `"lower"` \| `"even"`                               |
| body_type        | string | no       | Male: `"slim"` \| `"avg"` \| `"athletic"` \| `"heavy"`. Female: `"slim"` \| `"avg"` \| `"curvy"` \| `"heavy"` |
| activity_level   | string | no       | `"sedentary"` \| `"light"` \| `"moderate"` \| `"active"` \| `"very_active"`    |
| muscle_level     | string | no       | `"low"` \| `"moderate"` \| `"high"` \| `"very_high"`                           |
| shoulder_type    | string | no       | `"narrow"` \| `"average"` \| `"broad"` \| `"very_broad"`                       |
| measurement_goal | string | no       | `"clothing"` \| `"fitness"` \| `"health"` \| `"general"`                      |
| fit_preference   | string | no       | `"tight"` \| `"regular"` \| `"loose"` \| `"oversized"`                         |
| front_image      | File   | yes      | PNG, JPG, or JPEG (max 16 MB)                                                   |
| side_image       | File   | yes      | PNG, JPG, or JPEG (max 16 MB)                                                   |

### Response – Success (202 Accepted)

```json
{
  "jobId": 123,
  "message": "Measurement processing started. Your results will be ready shortly. Poll the status endpoint or you will be notified when complete.",
  "pollUrl": "/api/measurements/process/123"
}
```

### Response – Error (4xx)

```json
{
  "message": "Front image is required"
}
```

---

## Endpoint 2: Poll Job Status

**GET** `/api/measurements/process/{jobId}`

### Response – Pending / Processing

```json
{
  "jobId": 123,
  "status": "PROCESSING",
  "measurementId": null,
  "error": null,
  "validationDetails": null,
  "measurements": null
}
```

### Response – Completed

```json
{
  "jobId": 123,
  "status": "COMPLETED",
  "measurementId": 456,
  "error": null,
  "validationDetails": null,
  "measurements": {
    "metadata": {
      "bmi": 22.5,
      "bmi_category": "normal",
      "body_type": "rectangle",
      "body_type_input": "avg",
      "recommended_size": "M",
      "height": { "cm": 170, "inches": 66.93 },
      "weight": { "kg": 65, "lbs": 143.3 }
    },
    "neck": { "circumference": { "cm": 37.5, "inches": 14.76 } },
    "chest": { "circumference": { "cm": 96.2, "inches": 37.87 } },
    "waist": { "circumference": { "cm": 82.1, "inches": 32.32 } },
    "hip": { "circumference": { "cm": 98.5, "inches": 38.78 } },
    "shoulder": { "width": { "cm": 45.2, "inches": 17.8 } },
    "arm": {
      "hand_to_elbow": { "cm": 25.3, "inches": 9.96 },
      "shoulder_to_elbow": { "cm": 35.1, "inches": 13.82 },
      "total_length": { "cm": 65, "inches": 25 }
    },
    "armhole": { "circumference": { "cm": 40.4, "inches": 15.91 } },
    "upper_thigh": { "circumference": { "cm": 54.2, "inches": 21.34 } },
    "knee": { "circumference": { "cm": 39.0, "inches": 15.35 } },
    "body_length": { "length": { "cm": 47.6, "inches": 18.74 } },
    "upper_chest": { "circumference": { "cm": 88.5, "inches": 34.84 } },
    "lower_chest": { "circumference": { "cm": 78.9, "inches": 31.06 } }
  }
}
```

`upper_chest` and `lower_chest` are only present when `gender` is `"female"`.

### Response – Failed (with pose validation)

```json
{
  "jobId": 123,
  "status": "FAILED",
  "measurementId": null,
  "error": "Both front and side images are required",
  "validationDetails": {
    "front_accepted": false,
    "front_angle": 155.2,
    "front_message": "Person appears to be bending.",
    "side_accepted": true,
    "side_angle": 172.5,
    "side_message": "OK",
    "errors": []
  },
  "measurements": null
}
```

`validationDetails` is only present on pose validation failures.

---

## Status Values

| Status      | Description                                      |
|-------------|--------------------------------------------------|
| `PENDING`   | Job created, not yet started                     |
| `PROCESSING`| Backend is calling Python API                    |
| `COMPLETED` | Success; measurement saved; `measurements` set   |
| `FAILED`    | Error; `error` and optionally `validationDetails`|

---

## Frontend Flow (Recommended)

1. User fills form and uploads front/side images.
2. Call `POST /api/measurements/process` with `FormData` (same fields as before, but to backend URL).
3. On 202 response, read `jobId`.
4. Show loading overlay: “Calculating measurements…”
5. Start polling `GET /api/measurements/process/{jobId}` every 2–3 seconds.
6. When `status === "COMPLETED"`:
   - Stop polling.
   - Hide loading overlay.
   - Show success popup: “Your measurement is ready!”
   - Use `measurements` from the response (or optionally fetch full detail via `GET /api/measurements/{measurementId}`).
   - Navigate to success view / show results.
7. When `status === "FAILED"`:
   - Stop polling.
   - Hide loading overlay.
   - Show error toast with `error`.
   - If `validationDetails` exists, show pose validation details (front/side messages, angles).
8. Optional: stop polling after a timeout (e.g. 3 minutes) and show “Processing is taking longer than expected.”

---

## Code Changes Summary

### 1. Update `measurementApi.ts`

- Remove direct call to `VITE_MEASUREMENT_PROCESS_URL` / `http://213.210.21.155:5000/process`.
- Add two functions:
  - `submitProcess(payload)` → `POST /api/measurements/process` (using `axiosInstance` with auth).
  - `getProcessStatus(jobId)` → `GET /api/measurements/process/{jobId}`.

### 2. Update `Measurement.tsx` (or equivalent)

- Replace `measurementApi.processMeasurements()` with `measurementApi.submitProcess()`.
- On 202 response, start polling `measurementApi.getProcessStatus(jobId)`.
- When `COMPLETED`: show popup, use `measurements`, optionally call `measurementStoreApi.save()` (or skip if backend already saved).
- When `FAILED`: show error and `validationDetails` if present.
- Remove the long blocking wait; keep the loading overlay during polling.

### 3. Note on Saving

The backend **automatically saves** the measurement when processing completes successfully. The frontend does **not** need to call `measurementStoreApi.save()` after a successful process. The `measurementId` in the response can be used to fetch full details via `GET /api/measurements/{measurementId}` if needed.

---

## Example: `measurementApi.ts` Changes

```typescript
// Replace processMeasurements with:

export const measurementApi = {
  submitProcess: async (payload: ProcessMeasurementRequest): Promise<ProcessMeasurementSubmitResponse> => {
    const formData = new FormData();
    formData.append("gender", payload.gender);
    formData.append("age", String(payload.age));
    formData.append("height", String(payload.height));
    formData.append("height_unit", payload.heightUnit);
    formData.append("weight", String(payload.weight));
    formData.append("weight_unit", payload.weightUnit);
    appendOptional(formData, "age_group", payload.ageGroup);
    appendOptional(formData, "fat_distribution", payload.fatDistribution);
    appendOptional(formData, "body_type", payload.bodyType);
    appendOptional(formData, "activity_level", payload.activityLevel);
    appendOptional(formData, "muscle_level", payload.muscleLevel);
    appendOptional(formData, "shoulder_type", payload.shoulderType);
    appendOptional(formData, "measurement_goal", payload.measurementGoal);
    appendOptional(formData, "fit_preference", payload.fitPreference);
    formData.append("front_image", payload.frontImage);
    formData.append("side_image", payload.sideImage);

    const response = await axiosInstance.post<ProcessMeasurementSubmitResponse>(
      "/measurements/process",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 30_000,
      }
    );
    return response.data;
  },

  getProcessStatus: async (jobId: number): Promise<ProcessMeasurementJobResponse> => {
    const response = await axiosInstance.get<ProcessMeasurementJobResponse>(
      `/measurements/process/${jobId}`,
      { timeout: 10_000 }
    );
    return response.data;
  },
};

export interface ProcessMeasurementSubmitResponse {
  jobId: number;
  message: string;
  pollUrl: string;
}

export interface ProcessMeasurementJobResponse {
  jobId: number;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  measurementId: number | null;
  error: string | null;
  validationDetails: MeasurementPoseValidationDetails | null;
  measurements: ProcessMeasurementData | null;
}
```

---

## Example: Polling Logic in Component

```typescript
const pollInterval = 2500; // 2.5 seconds
const maxAttempts = 72;   // ~3 minutes

const pollForResult = async (jobId: number) => {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await measurementApi.getProcessStatus(jobId);
    if (res.status === "COMPLETED") {
      toast.success("Your measurement is ready!");
      setSubmissionResult(res.measurements);
      setSubmitted(true);
      return;
    }
    if (res.status === "FAILED") {
      setPoseValidationDetails(res.validationDetails ?? null);
      toast.error(res.error || "Failed to process measurements");
      return;
    }
    await new Promise((r) => setTimeout(r, pollInterval));
  }
  toast.error("Processing is taking longer than expected. Please check your measurements later.");
};

// In handleSubmit:
const { jobId } = await measurementApi.submitProcess(payload);
setIsCalculating(true);
pollForResult(jobId).finally(() => setIsCalculating(false));
```

---

## CORS

Ensure your backend allows the frontend origin. The backend typically has CORS configured for `http://localhost:3000` and `http://localhost:5173`.
