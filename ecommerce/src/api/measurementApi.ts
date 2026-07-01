import axiosInstance from "./axios";

// Use the shared axios instance so the request interceptor adds:
//   Authorization: Bearer <jwt from localStorage.authToken>
// The /measurements/process endpoint requires authentication (CUSTOMER role).

export type MeasurementGender = "male" | "female";
export type MeasurementHeightUnit = "cm" | "m";
export type MeasurementWeightUnit = "kg" | "lbs";
export type MeasurementAgeGroup = "teen" | "adult" | "middle_age" | "senior";
export type MeasurementFatDistribution = "upper" | "middle" | "lower" | "even";
export type MeasurementMaleBodyType = "slim" | "avg" | "athletic" | "heavy";
export type MeasurementFemaleBodyType = "slim" | "avg" | "curvy" | "heavy";
export type MeasurementBodyType =
  | MeasurementMaleBodyType
  | MeasurementFemaleBodyType;
export type MeasurementActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";
export type MeasurementMuscleLevel = "low" | "moderate" | "high" | "very_high";
export type MeasurementShoulderType =
  | "narrow"
  | "average"
  | "broad"
  | "very_broad";
export type MeasurementGoal = "clothing" | "fitness" | "health" | "general";
export type MeasurementFitPreference =
  | "tight"
  | "regular"
  | "loose"
  | "oversized";

export interface ProcessMeasurementRequest {
  gender: MeasurementGender;
  age: number;
  height: number;
  heightUnit: MeasurementHeightUnit;
  weight: number;
  weightUnit: MeasurementWeightUnit;
  ageGroup?: MeasurementAgeGroup;
  fatDistribution?: MeasurementFatDistribution;
  bodyType?: MeasurementBodyType;
  activityLevel?: MeasurementActivityLevel;
  muscleLevel?: MeasurementMuscleLevel;
  shoulderType?: MeasurementShoulderType;
  measurementGoal?: MeasurementGoal;
  fitPreference?: MeasurementFitPreference;
  frontImage: File;
  sideImage: File;
}

export interface MeasurementSizeValue {
  cm: number;
  inches: number;
}

export interface MeasurementWeightValue {
  kg: number;
  lbs: number;
}

export interface MeasurementMetadata {
  bmi: number;
  bmi_category: string;
  body_type: string;
  body_type_input?: string;
  recommended_size: string;
  height: MeasurementSizeValue;
  weight: MeasurementWeightValue;
}

export interface ProcessMeasurementData {
  metadata: MeasurementMetadata;
  neck?: { circumference: MeasurementSizeValue };
  chest?: { circumference: MeasurementSizeValue };
  waist?: { circumference: MeasurementSizeValue };
  hip?: { circumference: MeasurementSizeValue };
  shoulder?: { width: MeasurementSizeValue };
  arm?: {
    hand_to_elbow: MeasurementSizeValue;
    shoulder_to_elbow: MeasurementSizeValue;
    total_length: MeasurementSizeValue;
  };
  armhole?: { circumference: MeasurementSizeValue };
  upper_thigh?: { circumference: MeasurementSizeValue };
  knee?: { circumference: MeasurementSizeValue };
  body_length?: { length: MeasurementSizeValue };
  upper_chest?: { circumference: MeasurementSizeValue };
  lower_chest?: { circumference: MeasurementSizeValue };
}

export interface MeasurementPoseValidationDetails {
  front_accepted: boolean;
  front_angle: number;
  front_message: string;
  side_accepted: boolean;
  side_angle: number;
  side_message: string;
  errors: string[];
}

/** Response from POST /api/measurements/process (202 Accepted) */
export interface ProcessMeasurementSubmitResponse {
  jobId: number;
  message: string;
  pollUrl: string;
}

/** Response from GET /api/measurements/process/{jobId} */
export interface ProcessMeasurementJobResponse {
  jobId: number;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  measurementId: number | null;
  error: string | null;
  validationDetails: MeasurementPoseValidationDetails | null;
  measurements: ProcessMeasurementData | null;
}

export interface ProcessMeasurementSuccessResponse {
  success: true;
  measurements: ProcessMeasurementData;
}

export interface ProcessMeasurementErrorResponse {
  success: false;
  error: string;
  validation_details?: MeasurementPoseValidationDetails;
}

export type ProcessMeasurementResponse =
  | ProcessMeasurementSuccessResponse
  | ProcessMeasurementErrorResponse;

const appendOptional = (formData: FormData, key: string, value?: string) => {
  if (value) {
    formData.append(key, value);
  }
};

export const measurementApi = {
  /**
   * Submit measurement for async processing. Returns jobId; poll getProcessStatus(jobId) for result.
   * Backend returns 202 Accepted and processes in background. Measurement is saved automatically on success.
   */
  submitProcess: async (
    payload: ProcessMeasurementRequest
  ): Promise<ProcessMeasurementSubmitResponse> => {
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
        // Backend must return 202 quickly and process in background. If it blocks on Python,
        // use a longer timeout so we get a real response (202 or 5xx) instead of "cancelled".
        timeout: 120_000,
      }
    );
    return response.data;
  },

  /**
   * Poll job status. Use after submitProcess; when status is COMPLETED, measurements are in response.
   */
  getProcessStatus: async (
    jobId: number
  ): Promise<ProcessMeasurementJobResponse> => {
    const response = await axiosInstance.get<ProcessMeasurementJobResponse>(
      `/measurements/process/${jobId}`,
      { timeout: 10_000 }
    );
    return response.data;
  },
};

export default measurementApi;
