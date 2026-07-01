import axiosInstance from "./axios";
import type { ProcessMeasurementData } from "./measurementApi";

export interface SaveMeasurementRequest {
  gender: "male" | "female";
  age: number;
  height: number;
  heightUnit: "cm" | "m";
  weight: number;
  weightUnit: "kg" | "lbs";
  measurements: ProcessMeasurementData;
}

export interface MeasurementSummary {
  id: number;
  gender: "male" | "female";
  age: number;
  heightCm: number;
  weightKg: number;
  recommendedSize: string;
  bmi: number;
  bmiCategory: string;
  bodyType: string;
  measurements: null | ProcessMeasurementData;
  createdAt: string;
  userId?: number;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  userAddress?: string;
}

export interface MeasurementDetail extends MeasurementSummary {
  measurements: ProcessMeasurementData;
  user?: {
    id: number;
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
}

export const measurementStoreApi = {
  save: async (payload: SaveMeasurementRequest): Promise<MeasurementDetail> => {
    const response = await axiosInstance.post<MeasurementDetail>("/measurements", payload, {
      timeout: 60_000,
    });
    return response.data;
  },

  listMine: async (): Promise<MeasurementSummary[]> => {
    const response = await axiosInstance.get<MeasurementSummary[]>("/measurements");
    return response.data;
  },

  getById: async (id: number): Promise<MeasurementDetail> => {
    const response = await axiosInstance.get<MeasurementDetail>(`/measurements/${id}`);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/measurements/${id}`);
  },

  adminListAll: async (): Promise<MeasurementSummary[]> => {
    const response = await axiosInstance.get<MeasurementSummary[]>("/measurements/admin/all");
    return response.data;
  },
};

export default measurementStoreApi;
