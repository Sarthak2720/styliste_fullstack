import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { measurementApi } from "../api/measurementApi";
import type {
  MeasurementPoseValidationDetails,
  ProcessMeasurementData,
} from "../api/measurementApi";

const STORAGE_KEY_JOB_ID = "measurementJobId";
const POLL_INTERVAL_MS = 2500;
const POLL_MAX_ATTEMPTS = 72; // ~3 minutes

export type MeasurementJobStatus =
  | "idle"
  | "pending"
  | "processing"
  | "completed"
  | "failed";

interface MeasurementJobState {
  jobId: number | null;
  status: MeasurementJobStatus;
  result: ProcessMeasurementData | null;
  error: string | null;
  validationDetails: MeasurementPoseValidationDetails | null;
}

interface MeasurementJobContextValue extends MeasurementJobState {
  startJob: (jobId: number) => void;
  clearResult: () => void;
  isPolling: boolean;
}

const initialState: MeasurementJobState = {
  jobId: null,
  status: "idle",
  result: null,
  error: null,
  validationDetails: null,
};

const MeasurementJobContext = createContext<MeasurementJobContextValue | null>(
  null
);

function readStoredJobId(): number | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_JOB_ID);
    if (raw == null) return null;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

function clearStoredJobId(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_JOB_ID);
  } catch {
    // ignore
  }
}

function storeJobId(jobId: number): void {
  try {
    localStorage.setItem(STORAGE_KEY_JOB_ID, String(jobId));
  } catch {
    // ignore
  }
}

export function MeasurementJobProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const pathRef = useRef(location.pathname);
  pathRef.current = location.pathname;

  const [state, setState] = useState<MeasurementJobState>(() => {
    const stored = readStoredJobId();
    if (stored != null) {
      return {
        jobId: stored,
        status: "processing",
        result: null,
        error: null,
        validationDetails: null,
      };
    }
    return initialState;
  });

  const clearResult = useCallback(() => {
    setState(initialState);
    clearStoredJobId();
  }, []);

  const startJob = useCallback((jobId: number) => {
    setState({
      jobId,
      status: "processing",
      result: null,
      error: null,
      validationDetails: null,
    });
    storeJobId(jobId);
  }, []);

  // Background polling when jobId is set
  useEffect(() => {
    const jobId = state.jobId;
    if (jobId == null) return;

    let cancelled = false;

    const poll = async () => {
      for (let i = 0; i < POLL_MAX_ATTEMPTS && !cancelled; i++) {
        try {
          const res = await measurementApi.getProcessStatus(jobId);
          if (cancelled) return;

          const notOnMeasurementPage = pathRef.current !== "/measurements";

          if (res.status === "COMPLETED") {
            setState({
              jobId: null,
              status: "completed",
              result: res.measurements ?? null,
              error: null,
              validationDetails: null,
            });
            clearStoredJobId();
            if (notOnMeasurementPage) {
              toast.success("Your measurement is ready! View it on the measurement page.");
            }
            return;
          }

          if (res.status === "FAILED") {
            setState({
              jobId: null,
              status: "failed",
              result: null,
              error: res.error ?? "Failed to process measurements",
              validationDetails: res.validationDetails ?? null,
            });
            clearStoredJobId();
            if (notOnMeasurementPage) {
              toast.error(res.error ?? "Measurement processing failed.");
            }
            return;
          }
        } catch (err) {
          if (cancelled) return;
          const notOnMeasurementPage = pathRef.current !== "/measurements";
          setState({
            jobId: null,
            status: "failed",
            result: null,
            error: "Failed to check status. Please try again.",
            validationDetails: null,
          });
          clearStoredJobId();
          if (notOnMeasurementPage) {
            toast.error("Measurement status check failed.");
          }
          return;
        }

        await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
      }

      if (!cancelled) {
        const notOnMeasurementPage = pathRef.current !== "/measurements";
        setState({
          jobId: null,
          status: "failed",
          result: null,
          error: "Processing is taking longer than expected. Please check your measurements later.",
          validationDetails: null,
        });
        clearStoredJobId();
        if (notOnMeasurementPage) {
          toast.error("Measurement processing is taking longer than expected.");
        }
      }
    };

    poll();
    return () => {
      cancelled = true;
    };
  }, [state.jobId]);

  const value = useMemo<MeasurementJobContextValue>(
    () => ({
      ...state,
      startJob,
      clearResult,
      isPolling: state.jobId != null && (state.status === "pending" || state.status === "processing"),
    }),
    [state, startJob, clearResult]
  );

  return (
    <MeasurementJobContext.Provider value={value}>
      {children}
    </MeasurementJobContext.Provider>
  );
}

export function useMeasurementJob(): MeasurementJobContextValue {
  const ctx = useContext(MeasurementJobContext);
  if (ctx == null) {
    throw new Error("useMeasurementJob must be used within MeasurementJobProvider");
  }
  return ctx;
}
