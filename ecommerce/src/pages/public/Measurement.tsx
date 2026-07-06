import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Camera,
  CheckCircle2,
  ClipboardList,
  Dumbbell,
  Heart,
  PlayCircle,
  Ruler,
  ScanLine,
  Scissors,
  Shirt,
  ShoppingBag,
  Sparkles,
  Target,
  Upload,
  User,
} from "lucide-react";
import { toast } from "sonner";
import heroMeasurement from "../../assets/hero-measurement.png";
import storyWardrobe from "../../assets/story-1-wardrobe.mp4";
import storyPickSaree from "../../assets/story-2-pick-saree.mp4";
import storySearch from "../../assets/story-3-search.mp4";
import storyAiMeasurement from "../../assets/story-ai-measurement.mp4";
import storyStitching from "../../assets/story-4-stitching.mp4";
import storyFinishedDress from "../../assets/story-5-finished-dress.mp4";
import storyWearingDress from "../../assets/story-6-wearing-dress.mp4";
import {
  measurementApi,
  type MeasurementActivityLevel,
  type MeasurementBodyType,
  type MeasurementFatDistribution,
  type MeasurementFitPreference,
  type MeasurementGender,
  type MeasurementGoal,
  type MeasurementHeightUnit,
  type MeasurementMuscleLevel,
  type MeasurementPoseValidationDetails,
  type ProcessMeasurementRequest,
  type MeasurementShoulderType,
  type MeasurementWeightUnit,
  type ProcessMeasurementData,
} from "../../api/measurementApi";
import { useMeasurementJob } from "../../context/MeasurementJobContext";

const TOTAL_STEPS = 5;
const MAX_IMAGE_SIZE_BYTES = 16 * 1024 * 1024;
const ACCEPTED_IMAGE_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/jpg"]);

const stepInfo = [
  { icon: ClipboardList, title: "Basic Information" },
  { icon: User, title: "Body Context" },
  { icon: Dumbbell, title: "Activity & Muscle" },
  { icon: Ruler, title: "Body Structure" },
  { icon: Camera, title: "Upload Images" },
];

const processingPhases = [
  {
    icon: ScanLine,
    label: "Scanning your body profile...",
    tip: "Our AI analyzes over 40 body points for precision tailoring.",
  },
  {
    icon: Ruler,
    label: "Calculating proportions...",
    tip: "We compare your data with 10,000+ body profiles for accuracy.",
  },
  {
    icon: Sparkles,
    label: "Analyzing body structure...",
    tip: "Every body is unique - that's why bespoke fits so perfectly.",
  },
  {
    icon: Shirt,
    label: "Mapping garment dimensions...",
    tip: "The perfect outfit starts with the perfect measurement.",
  },
  {
    icon: Scissors,
    label: "Finalizing your measurements...",
    tip: "Our expert tailors will review these for a flawless fit.",
  },
  {
    icon: Heart,
    label: "Preparing your style profile...",
    tip: "You're one step closer to your dream outfit!",
  },
];

const funFacts = [
  "Perfect fit improves comfort & confidence ✨",
  "Tailored clothing enhances posture 👗",
  "Accurate measurements reduce alterations 📏",
  "Every body shape deserves perfect fit 💫",
];

const processingFacts = [
  "Did you know? A well-fitted garment can make you look 5 years younger!",
  "Fun fact: The art of bespoke tailoring dates back to the 17th century!",
  "Tip: Body measurements can change seasonally - we recommend updating every 6 months.",
  "Style secret: The right fit matters more than the fabric or brand.",
  "Pro tip: Comfort and elegance go hand in hand with precise measurements.",
];

const loaderVideos = [
  {
    src: storyWardrobe,
    title: "She Opens Her Wardrobe of Dreams",
    tag: "Chapter 1 - The Vision",
  },
  {
    src: storyPickSaree,
    title: "A Saree That Speaks to Her Soul",
    tag: "Chapter 2 - The Choice",
  },
  {
    src: storySearch,
    title: "Searching for the Perfect Couturier",
    tag: "Chapter 3 - The Quest",
  },
  {
    src: storyAiMeasurement,
    title: "AI Captures Her Perfect Measurements",
    tag: "Chapter 4 - The Scan",
  },
  {
    src: storyStitching,
    title: "Master Hands Bring It to Life",
    tag: "Chapter 5 - The Craft",
  },
  {
    src: storyFinishedDress,
    title: "A Bespoke Masterpiece Revealed",
    tag: "Chapter 6 - The Reveal",
  },
  {
    src: storyWearingDress,
    title: "She Wears Her Story With Grace",
    tag: "Chapter 7 - The Moment",
  },
];

const fashionArticles = [
  {
    category: "TREND ALERT",
    title: "The Revival of Handloom Sarees in Modern Fashion",
    content:
      "Handloom sarees are making a massive comeback in 2025. Designers are blending traditional weaving techniques with contemporary silhouettes. From Banarasi to Chanderi, these timeless fabrics are being reimagined into cocktail dresses, blazers, and even jumpsuits. The key trend? Mixing heritage textiles with modern cuts for a look that's both rooted and revolutionary.",
    image: "🧵",
    readTime: "3 min read",
  },
  {
    category: "STYLE GUIDE",
    title: "How to Choose the Perfect Blouse Design for Your Body Type",
    content:
      "Your blouse design can make or break your entire outfit. For broader shoulders, opt for V-necks and raglan sleeves. Petite frames look stunning in puff sleeves and boat necks. If you love drama, try a backless design with intricate dori work. The secret is understanding your proportions - which is exactly what our AI is calculating right now!",
    image: "👗",
    readTime: "4 min read",
  },
  {
    category: "BEHIND THE SCENES",
    title: "From Thread to Masterpiece: The Journey of Bespoke Tailoring",
    content:
      "Every bespoke garment goes through 47 precise steps. It starts with selecting the right fabric - the drape, weight, and texture must align with the design. Then comes pattern drafting, where your unique measurements transform into a blueprint. Expert cutters work with surgical precision, and skilled tailors bring it all to life stitch by stitch. That's why your measurements matter so much!",
    image: "✂️",
    readTime: "5 min read",
  },
  {
    category: "FASHION FORECAST",
    title: "Colors That Will Dominate Wedding Season Styling",
    content:
      "Move over traditional reds! This wedding season, expect to see dusty rose, sage green, midnight blue, and champagne gold taking center stage. Pastel lehengas are trending for day ceremonies, while jewel tones remain the go-to for evening celebrations. The biggest surprise? Black is becoming increasingly popular for reception outfits, styled with gold zari and mirror work.",
    image: "💎",
    readTime: "3 min read",
  },
  {
    category: "PRO TIPS",
    title: "5 Fabric Secrets Every Fashion-Forward Woman Should Know",
    content:
      "1. Silk chiffon drapes best for flowing silhouettes. 2. Raw silk adds structure - perfect for tailored jackets. 3. Organza layering creates depth without bulk. 4. Crepe is your best friend for wrinkle-free travel outfits. 5. Velvet is making a huge comeback - but choose stretch velvet for comfort. Understanding fabric is the first step to building a wardrobe that truly works for you.",
    image: "🎨",
    readTime: "4 min read",
  },
  {
    category: "DID YOU KNOW",
    title: "The Science Behind Why Custom-Fit Clothes Make You Look Better",
    content:
      "Studies show that well-fitted clothing can make you appear up to 5 years younger and 3 inches taller! It's all about proportions - when seams align with your natural body lines, it creates a visual harmony that ready-made clothes simply can't achieve. Custom tailoring accounts for 23 unique body measurements, compared to just 3-4 in standard sizing. That's the Styliste difference.",
    image: "✨",
    readTime: "3 min read",
  },
];

const measurementReadouts = [
  { label: "Shoulder Width", value: "38.2", unit: "cm" },
  { label: "Bust", value: "86.5", unit: "cm" },
  { label: "Waist", value: "68.3", unit: "cm" },
  { label: "Hip", value: "94.1", unit: "cm" },
  { label: "Arm Length", value: "55.7", unit: "cm" },
  { label: "Torso Length", value: "42.8", unit: "cm" },
  { label: "Inseam", value: "76.4", unit: "cm" },
  { label: "Neck", value: "34.6", unit: "cm" },
];

const loaderParticles = Array.from({ length: 20 }, (_, index) => ({
  id: index,
  left: (index * 17 + 9) % 100,
  top: (index * 29 + 13) % 100,
  duration: 3 + (index % 5),
  delay: (index % 6) * 0.45,
}));

const MEASUREMENT_PROGRESS_KEY = "measurementProcessingProgress";

interface StoredProcessingProgress {
  jobId: number;
  progress: number;
  phase: number;
  fact: number;
}

function readStoredProgress(): StoredProcessingProgress | null {
  try {
    const raw = localStorage.getItem(MEASUREMENT_PROGRESS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredProcessingProgress;
    if (typeof parsed?.jobId !== "number" || typeof parsed?.progress !== "number") return null;
    return {
      jobId: parsed.jobId,
      progress: Math.min(95, Math.max(0, parsed.progress)),
      phase: typeof parsed.phase === "number" ? Math.max(0, parsed.phase) % processingPhases.length : 0,
      fact:
        typeof parsed.fact === "number"
          ? Math.max(0, parsed.fact) % processingFacts.length
          : 0,
    };
  } catch {
    return null;
  }
}

function writeStoredProgress(data: StoredProcessingProgress): void {
  try {
    localStorage.setItem(MEASUREMENT_PROGRESS_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

function clearStoredProgress(): void {
  try {
    localStorage.removeItem(MEASUREMENT_PROGRESS_KEY);
  } catch {
    // ignore
  }
}

type OptionalSelect<T extends string> = T | "";
type HeightInputUnit = MeasurementHeightUnit | "ft";

const HEIGHT_UNIT_TO_CM: Record<HeightInputUnit, number> = {
  cm: 1,
  m: 100,
  ft: 30.48,
};

const roundHeight = (value: number, decimals = 2) => {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
};

const convertHeightToCm = (value: number, unit: HeightInputUnit): number =>
  value * HEIGHT_UNIT_TO_CM[unit];

const convertHeightFromCm = (valueCm: number, unit: HeightInputUnit): number =>
  valueCm / HEIGHT_UNIT_TO_CM[unit];

const convertHeightValue = (
  value: number,
  fromUnit: HeightInputUnit,
  toUnit: HeightInputUnit
): number => {
  if (fromUnit === toUnit) return value;
  return convertHeightFromCm(convertHeightToCm(value, fromUnit), toUnit);
};

const formatHeightFieldValue = (value: number, unit: HeightInputUnit): string => {
  const decimals = unit === "cm" ? 2 : 3;
  return Number(roundHeight(value, decimals).toFixed(decimals)).toString();
};

const getHeightInCm = (height: string, unit: HeightInputUnit): number | null => {
  const numericHeight = Number(height);
  if (!Number.isFinite(numericHeight) || numericHeight <= 0) return null;
  return roundHeight(convertHeightToCm(numericHeight, unit), 2);
};

interface MeasurementFormData {
  gender: MeasurementGender | "";
  age: string;
  height: string;
  heightUnit: HeightInputUnit;
  weight: string;
  weightUnit: MeasurementWeightUnit;
  fatDistribution: OptionalSelect<MeasurementFatDistribution>;
  bodyType: OptionalSelect<MeasurementBodyType>;
  activityLevel: OptionalSelect<MeasurementActivityLevel>;
  muscleLevel: OptionalSelect<MeasurementMuscleLevel>;
  measurementGoal: OptionalSelect<MeasurementGoal>;
  fitPreference: OptionalSelect<MeasurementFitPreference>;
  shoulderType: OptionalSelect<MeasurementShoulderType>;
  frontImage: File | null;
  sideImage: File | null;
}

const INITIAL_FORM_DATA: MeasurementFormData = {
  gender: "",
  age: "",
  height: "",
  heightUnit: "cm",
  weight: "",
  weightUnit: "kg",
  fatDistribution: "",
  bodyType: "",
  activityLevel: "",
  muscleLevel: "",
  measurementGoal: "clothing",
  fitPreference: "regular",
  shoulderType: "",
  frontImage: null,
  sideImage: null,
};


const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const parsePoseValidationDetails = (
  value: unknown
): MeasurementPoseValidationDetails | null => {
  if (!isRecord(value)) return null;

  const frontAccepted = value["front_accepted"];
  const frontAngle = value["front_angle"];
  const frontMessage = value["front_message"];
  const sideAccepted = value["side_accepted"];
  const sideAngle = value["side_angle"];
  const sideMessage = value["side_message"];
  const errorsValue = value["errors"];

  const allTypesValid =
    typeof frontAccepted === "boolean" &&
    typeof frontAngle === "number" &&
    Number.isFinite(frontAngle) &&
    typeof frontMessage === "string" &&
    typeof sideAccepted === "boolean" &&
    typeof sideAngle === "number" &&
    Number.isFinite(sideAngle) &&
    typeof sideMessage === "string" &&
    Array.isArray(errorsValue);

  if (!allTypesValid) return null;

  const errors = errorsValue.filter((item): item is string => typeof item === "string");
  if (errors.length !== errorsValue.length) return null;

  return {
    front_accepted: frontAccepted,
    front_angle: frontAngle,
    front_message: frontMessage,
    side_accepted: sideAccepted,
    side_angle: sideAngle,
    side_message: sideMessage,
    errors,
  };
};

const getMeasurementErrorDetails = (
  error: unknown
): { message: string; validationDetails: MeasurementPoseValidationDetails | null } => {
  const fallbackMessage = "Failed to process measurements. Please try again.";

  if (!isRecord(error)) {
    return { message: fallbackMessage, validationDetails: null };
  }

  const validationDetails = parsePoseValidationDetails(error["validation_details"]);
  const apiErrorMessage = error["error"];
  if (typeof apiErrorMessage === "string" && apiErrorMessage.trim()) {
    return { message: apiErrorMessage, validationDetails };
  }

  const genericMessage = error["message"];
  if (typeof genericMessage === "string" && genericMessage.trim()) {
    return { message: genericMessage, validationDetails };
  }

  return { message: fallbackMessage, validationDetails };
};

const isSupportedImage = (file: File): boolean => {
  const mimeType = file.type.toLowerCase();
  if (ACCEPTED_IMAGE_MIME_TYPES.has(mimeType)) return true;
  return /\.(png|jpe?g)$/i.test(file.name);
};

const formatSize = (value?: { cm?: number; inches?: number }) => {
  if (!value || value.cm === undefined || value.inches === undefined) return null;
  return `${value.cm.toFixed(1)} cm / ${value.inches.toFixed(2)} in`;
};

const buildMeasurementRows = (m: ProcessMeasurementData) =>
  [
    // { label: "Neck circumference", value: formatSize(m.neck?.circumference) },
    { label: "Chest circumference", value: formatSize(m.chest?.circumference) },
    { label: "Upper chest circumference", value: formatSize(m.upper_chest?.circumference) },
    { label: "Lower chest circumference", value: formatSize(m.lower_chest?.circumference) },
    { label: "Waist circumference", value: formatSize(m.waist?.circumference) },
    { label: "Hip circumference", value: formatSize(m.hip?.circumference) },
    { label: "Shoulder width", value: formatSize(m.shoulder?.width) },
    { label: "Armhole circumference", value: formatSize(m.armhole?.circumference) },
    { label: "Upper thigh circumference", value: formatSize(m.upper_thigh?.circumference) },
    { label: "Knee circumference", value: formatSize(m.knee?.circumference) },
    { label: "Body length", value: formatSize(m.body_length?.length) },
    // { label: "Arm hand to elbow", value: formatSize(m.arm?.hand_to_elbow) },
    // { label: "Arm shoulder to elbow", value: formatSize(m.arm?.shoulder_to_elbow) },
    // { label: "Arm total length", value: formatSize(m.arm?.total_length) },
  ].filter((row) => !!row.value);

const Measurement = () => {
  const job = useMeasurementJob();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<MeasurementFormData>(INITIAL_FORM_DATA);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [sidePreview, setSidePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingPhase, setProcessingPhase] = useState(0);
  const [currentFact, setCurrentFact] = useState(0);
  const [currentArticle, setCurrentArticle] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [poseValidationDetails, setPoseValidationDetails] =
    useState<MeasurementPoseValidationDetails | null>(null);

  const genderSelectRef = useRef<HTMLSelectElement>(null);
  const ageInputRef = useRef<HTMLInputElement>(null);
  const heightInputRef = useRef<HTMLInputElement>(null);
  const weightInputRef = useRef<HTMLInputElement>(null);
  const frontUploadRef = useRef<HTMLLabelElement>(null);
  const sideUploadRef = useRef<HTMLLabelElement>(null);

  useEffect(() => {
    return () => {
      if (frontPreview) URL.revokeObjectURL(frontPreview);
      if (sidePreview) URL.revokeObjectURL(sidePreview);
    };
  }, [frontPreview, sidePreview]);

  // Animate processing phases and fun facts when a job is in progress; restore from localStorage on reload
  useEffect(() => {
    if (job.jobId == null) {
      clearStoredProgress();
      return;
    }
    const stored = readStoredProgress();
    if (stored && stored.jobId === job.jobId) {
      setProcessingProgress(stored.progress);
      setProcessingPhase(stored.phase);
      setCurrentFact(stored.fact);
    } else {
      setProcessingProgress(0);
      setProcessingPhase(0);
      setCurrentFact(0);
    }
    setCurrentArticle(0);
    setCurrentVideo(0);
    const PROCESSING_DURATION_MS = 150000;
    const TICK_MS = 250;
    const progressInterval = setInterval(() => {
      setProcessingProgress((prev) =>
        prev >= 95 ? prev : Math.min(95, prev + (95 / PROCESSING_DURATION_MS) * TICK_MS)
      );
    }, TICK_MS);
    const phaseInterval = setInterval(() => {
      setProcessingPhase((prev) => (prev + 1) % processingPhases.length);
    }, 25000);
    const factInterval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % processingFacts.length);
    }, 12000);
    const articleInterval = setInterval(() => {
      setCurrentArticle((prev) => (prev + 1) % fashionArticles.length);
    }, 20000);
    const videoInterval = setInterval(() => {
      setCurrentVideo((prev) => (prev + 1) % loaderVideos.length);
    }, 11000);
    return () => {
      clearInterval(progressInterval);
      clearInterval(phaseInterval);
      clearInterval(factInterval);
      clearInterval(articleInterval);
      clearInterval(videoInterval);
    };
  }, [job.jobId]);

  // Persist progress to localStorage so it survives reload
  useEffect(() => {
    if (job.jobId == null) return;
    writeStoredProgress({
      jobId: job.jobId,
      progress: processingProgress,
      phase: processingPhase,
      fact: currentFact,
    });
  }, [job.jobId, processingProgress, processingPhase, currentFact]);

  const progress = (currentStep / TOTAL_STEPS) * 100;

  const heightInCm = getHeightInCm(formData.height, formData.heightUnit);

  const updateField = <K extends keyof MeasurementFormData>(
    field: K,
    value: MeasurementFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleHeightUnitChange = (nextUnit: HeightInputUnit) => {
    setFormData((prev) => {
      if (prev.heightUnit === nextUnit) return prev;

      const numericHeight = Number(prev.height);
      if (!prev.height || !Number.isFinite(numericHeight) || numericHeight <= 0) {
        return { ...prev, heightUnit: nextUnit };
      }

      return {
        ...prev,
        heightUnit: nextUnit,
        height: formatHeightFieldValue(
          convertHeightValue(numericHeight, prev.heightUnit, nextUnit),
          nextUnit
        ),
      };
    });
  };

  const handleImageUpload = (type: "front" | "side", e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isSupportedImage(file)) {
      toast.error("Only PNG, JPG, and JPEG images are allowed");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      toast.error("Image size must be 16MB or less");
      e.target.value = "";
      return;
    }

    const url = URL.createObjectURL(file);
    setPoseValidationDetails(null);

    if (type === "front") {
      setFormData((prev) => ({ ...prev, frontImage: file }));
      setFrontPreview((previousUrl) => {
        if (previousUrl) URL.revokeObjectURL(previousUrl);
        return url;
      });
      return;
    }

    setFormData((prev) => ({ ...prev, sideImage: file }));
    setSidePreview((previousUrl) => {
      if (previousUrl) URL.revokeObjectURL(previousUrl);
      return url;
    });
  };

  const canNext = () => {
    switch (currentStep) {
      case 1:
        return Boolean(formData.gender && formData.age && formData.height && formData.weight);
      case 2:
      case 3:
      case 4:
        return true;
      case 5:
        return Boolean(formData.frontImage && formData.sideImage);
      default:
        return false;
    }
  };

  const scrollToField = (field: HTMLElement | null) => {
    if (!field) return;

    const targetTop = field.getBoundingClientRect().top + window.scrollY - 110;
    window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });

    window.setTimeout(() => {
      if (
        field instanceof HTMLInputElement ||
        field instanceof HTMLSelectElement ||
        field instanceof HTMLTextAreaElement ||
        field instanceof HTMLButtonElement
      ) {
        field.focus({ preventScroll: true });
        return;
      }

      if (field.tabIndex >= -1) {
        field.focus({ preventScroll: true });
      }
    }, 250);
  };

  const getFirstIncompleteField = (): HTMLElement | null => {
    switch (currentStep) {
      case 1:
        if (!formData.gender) return genderSelectRef.current;
        if (!formData.age) return ageInputRef.current;
        if (!formData.height) return heightInputRef.current;
        if (!formData.weight) return weightInputRef.current;
        return null;
      case 5:
        if (!formData.frontImage) return frontUploadRef.current;
        if (!formData.sideImage) return sideUploadRef.current;
        return null;
      default:
        return null;
    }
  };

  const failValidation = (message: string, field: HTMLElement | null) => {
    toast.error(message);
    window.requestAnimationFrame(() => {
      scrollToField(field);
    });
    return false;
  };

  const validateStepOneValues = () => {
    if (!formData.gender) {
      return failValidation("Please select gender", genderSelectRef.current);
    }

    const age = Number(formData.age);
    if (!Number.isFinite(age) || age < 13 || age > 100) {
      return failValidation("Age must be between 13 and 100", ageInputRef.current);
    }

    if (getHeightInCm(formData.height, formData.heightUnit) == null) {
      return failValidation("Please enter a valid height", heightInputRef.current);
    }

    const weight = Number(formData.weight);
    if (!Number.isFinite(weight) || weight <= 0) {
      return failValidation("Please enter a valid weight", weightInputRef.current);
    }

    return true;
  };

  const handleNext = () => {
    if (!canNext()) {
      toast.error("Please fill in all required fields");
      window.requestAnimationFrame(() => {
        scrollToField(getFirstIncompleteField());
      });
      return;
    }

    if (currentStep === 1 && !validateStepOneValues()) {
      return;
    }

    if (currentStep < TOTAL_STEPS) setCurrentStep((step) => step + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep((step) => step - 1);
  };

  const handleSubmit = async () => {
    if (!canNext()) {
      toast.error("Please upload both front and side view images");
      window.requestAnimationFrame(() => {
        scrollToField(getFirstIncompleteField());
      });
      return;
    }

    if (!validateStepOneValues()) {
      setCurrentStep(1);
      return;
    }

    if (!formData.gender || !formData.frontImage || !formData.sideImage || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setPoseValidationDetails(null);

    const normalizedHeightCm = getHeightInCm(formData.height, formData.heightUnit);
    if (normalizedHeightCm == null) {
      setIsSubmitting(false);
      setCurrentStep(1);
      failValidation("Please enter a valid height", heightInputRef.current);
      return;
    }

    const payload: ProcessMeasurementRequest = {
      gender: formData.gender,
      age: Number(formData.age),
      height: normalizedHeightCm,
      heightUnit: "cm",
      weight: Number(formData.weight),
      weightUnit: formData.weightUnit,
      fatDistribution: formData.fatDistribution || undefined,
      bodyType: formData.bodyType || undefined,
      activityLevel: formData.activityLevel || undefined,
      muscleLevel: formData.muscleLevel || undefined,
      shoulderType: formData.shoulderType || undefined,
      measurementGoal: "clothing",
      fitPreference: "regular",
      frontImage: formData.frontImage,
      sideImage: formData.sideImage,
    };

    try {
      const { jobId } = await measurementApi.submitProcess(payload);
      job.startJob(jobId);
      // Loading/processing page will show; polling runs in context. No toast here.
    } catch (error) {
      const { message, validationDetails } = getMeasurementErrorDetails(error);
      setPoseValidationDetails(validationDetails);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    if (frontPreview) URL.revokeObjectURL(frontPreview);
    if (sidePreview) URL.revokeObjectURL(sidePreview);
    setFrontPreview(null);
    setSidePreview(null);
    setCurrentStep(1);
    setPoseValidationDetails(null);
    setFormData(INITIAL_FORM_DATA);
    job.clearResult();
  };

  const changeArticle = (direction: number) => {
    setCurrentArticle(
      (prev) => (prev + direction + fashionArticles.length) % fashionArticles.length
    );
  };

  // Show processing page when a job is in progress (or when user returns while still processing)
  if (job.jobId != null) {
    const PhaseIcon = processingPhases[processingPhase].icon;
    const activeArticle = fashionArticles[currentArticle];
    const activeVideo = loaderVideos[currentVideo];
    const visibleReadouts = measurementReadouts.slice(
      0,
      Math.min(Math.floor(processingProgress / 12) + 1, measurementReadouts.length)
    );
    return (
      <>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ backgroundColor: "rgba(40, 55, 45, 0.9)" }}
            className="hidden"
          >
            <div className="flex flex-col items-center text-center px-6 max-w-md">
              <div className="relative w-32 h-32 mb-8">
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-sage-300/30"
                  style={{ borderColor: "rgba(156, 186, 145, 0.3)" }}
                  animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-4 rounded-full flex items-center justify-center shadow-lg"
                  style={{
                    background: "linear-gradient(to bottom right, #9abf8c, #5f7d5c)",
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                >
                  <PhaseIcon className="w-14 h-14 text-white" />
                </motion.div>
              </div>

              <h3 className="text-3xl font-serif mb-2 text-white drop-shadow-lg">
                {processingPhases[processingPhase].label}
              </h3>

              <p className="mb-6 text-lg" style={{ color: "#e2f0da" }}>
                {processingPhases[processingPhase].tip}
              </p>

              <div className="w-72 bg-white/20 rounded-full h-3 mb-3 backdrop-blur-sm">
                <div
                  className="h-3 rounded-full transition-all shadow-lg"
                  style={{
                    width: `${processingProgress}%`,
                    background: "linear-gradient(to right, #b8d9ad, #6b8f67)",
                  }}
                />
              </div>

              <p className="text-sm mb-8 font-medium" style={{ color: "#d0e8c5" }}>
                {processingProgress}% complete
              </p>

              <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-xl border border-white/20 shadow-xl mb-6">
                <p className="text-base italic text-white">
                  🌿 {funFacts[currentFact]}
                </p>
              </div>

              <p className="text-xs text-amber-300 mb-6 font-semibold tracking-wide">
                ⚡ Please don&apos;t refresh or go back ⚡
              </p>

              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition text-white border-2 border-white/40 hover:bg-white/10"
              >
                <ShoppingBag className="w-5 h-5" />
                Browse products while you wait
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        <section className="relative h-[56vh] min-h-[420px] max-h-[620px] overflow-hidden bg-primary text-primary-foreground">
          <Navbar />
          <div className="absolute inset-0">
            <img
              src={heroMeasurement}
              alt="AI Body Measurement System"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/70 to-primary/60" />
          </div>
          <div className="absolute inset-0 z-10 flex items-center justify-center px-6 pt-20 text-center">
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 inline-flex items-center justify-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm"
              >
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                <p className="text-xs font-sans uppercase tracking-[0.3em] text-primary-foreground/90">
                  Measurement In Progress
                </p>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8 font-serif text-5xl leading-[1.1] text-primary-foreground md:text-5xl"
              >
                We are tailoring your
                <br />
                measurement profile
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mx-auto max-w-2xl text-base leading-7 text-primary-foreground/80 md:text-lg"
              >
                Your photos are being processed now. The loading experience feels richer,
                while still staying inside the existing Styliste theme.
              </motion.p>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-gradient-to-br from-[#fdfbf7] via-[#f6f1ea] to-[#eef2e6]">
          <div className="absolute inset-0 pointer-events-none">
            {loaderParticles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute h-1 w-1 rounded-full bg-primary/30"
                style={{ left: `${particle.left}%`, top: `${particle.top}%` }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.2, 0.65, 0.2],
                }}
                transition={{
                  duration: particle.duration,
                  repeat: Infinity,
                  delay: particle.delay,
                }}
              />
            ))}
          </div>

          <div className="sticky top-0 z-30">
            <div className="h-1 bg-foreground/10">
              <motion.div
                className="h-full rounded-r-full bg-gradient-to-r from-primary via-sage to-primary"
                style={{ width: `${processingProgress}%` }}
              />
            </div>
            <div className="flex items-center justify-between border-b border-foreground/5 bg-white/80 px-4 py-3 backdrop-blur-md sm:px-6">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-4 w-4 text-primary" />
                </motion.div>
                <span className="text-xs font-medium uppercase tracking-wider text-primary">
                  AI Body Analysis
                </span>
                <motion.div
                  className="h-1.5 w-1.5 rounded-full bg-primary"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </div>
              <div className="flex items-center gap-4">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={processingPhase}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="hidden text-xs text-foreground/50 sm:block"
                  >
                    {processingPhases[processingPhase].label}
                  </motion.span>
                </AnimatePresence>
                <span className="font-mono text-sm font-bold text-foreground">
                  {Math.round(processingProgress)}%
                </span>
              </div>
            </div>
          </div>

          <div className="container mx-auto flex items-center px-4 py-12">
            <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, type: "spring", damping: 20 }}
                className="space-y-4"
              >
                <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-white shadow-2xl shadow-primary/10">
                  <div className="relative aspect-video bg-muted">
                    <AnimatePresence mode="wait">
                      <motion.video
                        key={activeVideo.src}
                        src={activeVideo.src}
                        className="absolute inset-0 h-full w-full object-cover"
                        initial={{ opacity: 0.35, scale: 1.02 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0.35, scale: 0.98 }}
                        transition={{ duration: 0.8 }}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                      />
                    </AnimatePresence>

                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent" />

                    <motion.div
                      className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-foreground/10 bg-white/85 px-3 py-1.5 backdrop-blur-sm"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <PlayCircle className="h-3 w-3 text-primary" />
                      <span className="text-[10px] font-medium uppercase tracking-wider text-foreground/80">
                        {activeVideo.tag}
                      </span>
                    </motion.div>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`title-${currentVideo}`}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="absolute bottom-4 left-4 right-4"
                      >
                        <p className="font-serif text-sm italic text-white/90 drop-shadow-lg">
                          {activeVideo.title}
                        </p>
                      </motion.div>
                    </AnimatePresence>

                    <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full border border-foreground/10 bg-white/70 px-2.5 py-1.5 backdrop-blur-sm">
                      {loaderVideos.map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setCurrentVideo(index)}
                          className={`h-1 rounded-full transition-all ${
                            index === currentVideo ? "w-4 bg-primary" : "w-1 bg-foreground/30"
                          }`}
                          aria-label={`Play video ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-1.5 text-xs text-foreground/50">
                    <Scissors className="h-3.5 w-3.5 text-primary/70" />
                    <span>
                      Clip {currentVideo + 1} of {loaderVideos.length} - Curated for you
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-foreground/40">
                    <motion.div
                      className="h-1.5 w-1.5 rounded-full bg-destructive"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <span>Playing</span>
                  </div>
                </div>

                <div className="rounded-xl border border-primary/15 bg-white/70 p-4 shadow-sm backdrop-blur-sm">
                  <div className="mb-3 flex items-center gap-3">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={processingPhase}
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 90 }}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10"
                      >
                        <PhaseIcon className="h-5 w-5 text-primary" />
                      </motion.div>
                    </AnimatePresence>

                    <div className="min-w-0 flex-1">
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={processingPhase}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="truncate text-sm font-medium text-foreground/85"
                        >
                          {processingPhases[processingPhase].label}
                        </motion.p>
                      </AnimatePresence>
                      <p className="text-xs text-foreground/40">
                        Phase {processingPhase + 1} of {processingPhases.length}
                      </p>
                    </div>

                    <div className="relative h-12 w-12 shrink-0">
                      <svg className="h-full w-full -rotate-90" viewBox="0 0 48 48">
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          stroke="hsl(var(--foreground) / 0.1)"
                          strokeWidth="2.5"
                          fill="none"
                        />
                        <motion.circle
                          cx="24"
                          cy="24"
                          r="20"
                          stroke="hsl(var(--primary))"
                          strokeWidth="2.5"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 20}`}
                          strokeDashoffset={2 * Math.PI * 20 * (1 - processingProgress / 100)}
                          style={{ filter: "drop-shadow(0 0 4px hsl(var(--primary) / 0.4))" }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-mono text-[10px] font-bold text-foreground">
                          {Math.round(processingProgress)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 overflow-hidden">
                    <AnimatePresence>
                      {visibleReadouts.slice(-4).map((measurement) => (
                        <motion.div
                          key={measurement.label}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-primary/5 px-2.5 py-1.5"
                        >
                          <span className="text-[10px] text-foreground/50">
                            {measurement.label}
                          </span>
                          <span className="font-mono text-[10px] font-semibold text-primary">
                            {measurement.value}
                            {measurement.unit}
                          </span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, type: "spring", damping: 20 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-medium tracking-wide text-foreground/80">
                      While you wait, explore fashion
                    </h3>
                  </div>
                  <div className="flex gap-1">
                    {fashionArticles.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setCurrentArticle(index)}
                        className={`h-1.5 w-1.5 rounded-full transition-all ${
                          index === currentArticle ? "w-4 bg-primary" : "bg-foreground/20"
                        }`}
                        aria-label={`Show article ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.article
                    key={currentArticle}
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                    transition={{ type: "spring", damping: 25 }}
                    className="flex min-h-[280px] flex-col rounded-2xl border border-foreground/10 bg-white/80 p-6 shadow-md backdrop-blur-sm"
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <span className="text-3xl">{activeArticle.image}</span>
                      <div>
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="mb-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-primary"
                        >
                          {activeArticle.category}
                        </motion.span>
                        <span className="text-[10px] text-foreground/40">
                          {activeArticle.readTime}
                        </span>
                      </div>
                    </div>

                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="mb-4 font-serif text-xl leading-tight text-foreground md:text-2xl"
                    >
                      {activeArticle.title}
                    </motion.h3>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="flex-1 text-sm leading-relaxed text-foreground/65"
                    >
                      {activeArticle.content}
                    </motion.p>

                    <div className="mt-5 flex items-center justify-between border-t border-foreground/10 pt-4">
                      <button
                        type="button"
                        onClick={() => changeArticle(-1)}
                        className="flex items-center gap-1 text-xs text-foreground/50 transition-colors hover:text-foreground"
                      >
                        <ArrowLeft className="h-3 w-3" />
                        Previous
                      </button>
                      <span className="text-xs text-foreground/40">
                        {currentArticle + 1} / {fashionArticles.length}
                      </span>
                      <button
                        type="button"
                        onClick={() => changeArticle(1)}
                        className="flex items-center gap-1 text-xs text-foreground/50 transition-colors hover:text-foreground"
                      >
                        Next
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </motion.article>
                </AnimatePresence>

                <div className="grid grid-cols-2 gap-3">
                  <motion.div
                    className="rounded-xl border border-primary/15 bg-white/70 p-4 shadow-sm"
                    whileHover={{ scale: 1.02 }}
                  >
                    <Shirt className="mb-2 h-5 w-5 text-primary" />
                    <p className="mb-1 text-xs font-medium text-foreground/80">Style Tip</p>
                    <p className="text-[11px] leading-relaxed text-foreground/55">
                      Custom-fit clothes make you look 5 years younger - science says so!
                    </p>
                  </motion.div>

                  <motion.div
                    className="rounded-xl border border-primary/15 bg-white/70 p-4 shadow-sm"
                    whileHover={{ scale: 1.02 }}
                  >
                    <Target className="mb-2 h-5 w-5 text-primary" />
                    <p className="mb-1 text-xs font-medium text-foreground/80">Precision</p>
                    <p className="text-[11px] leading-relaxed text-foreground/55">
                      Our AI analyzes 40+ body points for the most accurate measurements.
                    </p>
                  </motion.div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentFact}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/10 px-4 py-3"
                  >
                    <span className="text-lg">💡</span>
                    <p className="flex-1 text-xs italic text-foreground/70">
                      {processingFacts[currentFact]}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
            className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-amber-300/40 bg-amber-50 px-5 py-2.5 shadow-md backdrop-blur-sm"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-600" />
            </motion.div>
            <p className="text-[11px] font-medium text-amber-700">
              Don&apos;t refresh - AI is processing your measurements
            </p>
          </motion.div>
        </section>
        <Footer />
      </>
    );
  }

  // Show success view when job completed with result
  if (job.status === "completed" && job.result) {
    const submissionResult = job.result;
    const metadata = submissionResult?.metadata;
    return (
      <>
        <section className="relative h-[56vh] min-h-[420px] max-h-[620px] overflow-hidden bg-primary text-primary-foreground">
          <Navbar />
          <div className="absolute inset-0">
            <img
              src={heroMeasurement}
              alt="AI Body Measurement System"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/70 to-primary/60" />
          </div>
          <div className="absolute inset-0 z-10 flex items-center justify-center px-6 pt-20 text-center">
            <div className="container mx-auto">
              <div className="max-w-3xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-4 mb-6"
                >
                  <div className="w-8 h-px bg-primary-foreground/60" />
                  <p className="text-primary-foreground/80 font-sans tracking-[0.3em] text-xs uppercase">
                    Measurement
                  </p>
                  <div className="w-8 h-px bg-primary-foreground/60" />
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="font-serif text-5xl md:text-7xl leading-[1.1] mb-8 text-primary-foreground"
                >
                  Submission
                  <br />
                  <span className="italic text-accent">Successful</span>
                </motion.h1>
              </div>
            </div>
          </div>
        </section>
        <section className="py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto px-6"
          >
            <CheckCircle2 className="w-20 h-20 text-primary mx-auto mb-6" />
            <div className="flex items-center gap-3 mb-4">
              <span className="text-primary text-lg font-bold">-</span>
              <h2 className="font-serif text-3xl text-foreground">Thank You!</h2>
            </div>
            <p className="text-muted-foreground mb-8">
              Your body measurement details have been submitted successfully. Our expert tailors will review your information and contact you with your personalized measurements.
            </p>
            {metadata && (
              <div className="mb-8 rounded-xl border border-primary/20 bg-primary/5 p-5">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Measurement Summary
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-white p-3 border border-primary/10">
                    <p className="text-muted-foreground">Recommended Size</p>
                    <p className="text-foreground font-semibold">{metadata.recommended_size}</p>
                  </div>
                  <div className="rounded-lg bg-white p-3 border border-primary/10">
                    <p className="text-muted-foreground">BMI</p>
                    <p className="text-foreground font-semibold">
                      {metadata.bmi.toFixed(1)} ({metadata.bmi_category})
                    </p>
                  </div>
                </div>
              </div>
            )}
            {submissionResult && (
              <div className="mb-8 rounded-xl border border-primary/15 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-3">All Measurements</h3>
                {buildMeasurementRows(submissionResult).length === 0 ? (
                  <p className="text-sm text-muted-foreground">No measurements available.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                    {buildMeasurementRows(submissionResult).map((row) => (
                      <div
                        key={row.label}
                        className="rounded-lg border border-border/70 bg-muted/10 px-3 py-2"
                      >
                        <p className="text-foreground font-medium">{row.label}</p>
                        <p>{row.value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            <button
              onClick={resetForm}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
            >
              Submit Another Measurement
            </button>
            <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
              <p>You can view your saved measurements in your account.</p>
            </div>
          </motion.div>
        </section>
        <Footer />
      </>
    );
  }

  // Show failed view when job failed
  if (job.status === "failed") {
    const details = job.validationDetails;
    return (
      <>
        <section className="relative h-[40vh] min-h-[280px] overflow-hidden bg-primary text-primary-foreground">
          <Navbar />
          <div className="absolute inset-0">
            <img
              src={heroMeasurement}
              alt="AI Body Measurement System"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/70 to-primary/60" />
          </div>
          <div className="absolute inset-0 z-10 flex items-center justify-center px-6 pt-20 text-center">
            <div className="max-w-2xl mx-auto">
              <h1 className="font-serif text-3xl md:text-4xl leading-[1.1] mb-4 text-primary-foreground">
                Measurement processing failed
              </h1>
            </div>
          </div>
        </section>
        <section className="py-16 bg-muted/30">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto px-6"
          >
            <p className="text-destructive font-medium mb-4">{job.error}</p>
            {details && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 mb-6">
                <p className="font-semibold mb-2">Pose validation</p>
                <p>Front: {details.front_message} ({details.front_angle.toFixed(1)}°)</p>
                <p>Side: {details.side_message} ({details.side_angle.toFixed(1)}°)</p>
                {details.errors.length > 0 && (
                  <p className="mt-1">{details.errors.join(" ")}</p>
                )}
              </div>
            )}
            <button
              onClick={resetForm}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
            >
              Try again
            </button>
          </motion.div>
        </section>
        <Footer />
      </>
    );
  }

  const { title: stepTitle } = stepInfo[currentStep - 1];

  return (
    <>
      <section className="relative h-[56vh] min-h-[420px] max-h-[620px] overflow-hidden bg-primary text-primary-foreground">
        <Navbar />
        <div className="absolute inset-0">
          <img
            src={heroMeasurement}
            alt="AI Body Measurement System"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/75 to-primary/70" />
        </div>
        <div className="absolute inset-0 z-10 flex items-center justify-center px-6 pt-20 text-center">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-4 mb-6"
            >
              <div className="w-8 h-px bg-primary-foreground/60" />
              <p className="text-primary-foreground/80 font-sans tracking-[0.3em] text-xs uppercase">
                Measurement
              </p>
              <div className="w-8 h-px bg-primary-foreground/60" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-serif text-5xl md:text-5xl leading-[1.1] mb-8 text-primary-foreground"
            >
              AI Body Measurement System
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-primary-foreground/85 text-lg leading-relaxed"
            >
              Enter your details for accurate, bespoke tailoring measurements
            </motion.p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto bg-card rounded-2xl shadow-lg p-8 md:p-12"
          >
            {/* Progress */}
            <div className="mb-8">
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Step {currentStep} of {TOTAL_STEPS}
              </p>
            </div>

            {/* Step Header */}
            <div className="mb-8 border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <span className="text-primary text-lg font-bold">-</span>
                <h2 className="text-2xl md:text-3xl font-serif flex items-center gap-3 text-foreground">
                  <span className="text-2xl">{stepTitle}</span>
                </h2>
              </div>
              {currentStep > 1 && currentStep < TOTAL_STEPS && (
                <p className="text-xs text-muted-foreground mt-2">
                  These fields are optional and help improve estimate accuracy.
                </p>
              )}
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {currentStep === 1 && (
                  <>
                    <div>
                      <label className="text-foreground font-medium">Gender *</label>
                      <select
                        ref={genderSelectRef}
                        value={formData.gender}
                        onChange={(e) => {
                          const gender = e.target.value as MeasurementFormData["gender"];
                          setFormData((prev) => ({ ...prev, gender, bodyType: "" }));
                        }}
                        className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-foreground font-medium">Age *</label>
                      <input
                        ref={ageInputRef}
                        type="number"
                        placeholder="Enter your age"
                        value={formData.age}
                        onChange={(e) => updateField("age", e.target.value)}
                        className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        min={13}
                        max={100}
                      />
                    </div>
                    <div>
                      <label className="text-foreground font-medium">Your Height *</label>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        <input
                          ref={heightInputRef}
                          type="number"
                          step="any"
                          min="0"
                          placeholder="Height"
                          value={formData.height}
                          onChange={(e) => updateField("height", e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <select
                          value={formData.heightUnit}
                          onChange={(e) => handleHeightUnitChange(e.target.value as HeightInputUnit)}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="cm">Centimeters (cm)</option>
                          <option value="m">Meters (m)</option>
                          <option value="ft">Feet (ft)</option>
                        </select>
                      </div>
                      {formData.heightUnit === "ft" && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          Use decimal feet, for example 5.75.
                        </p>
                      )}
                      {heightInCm !== null && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          This will be submitted as {formatHeightFieldValue(heightInCm, "cm")} cm.
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-foreground font-medium">Your Weight *</label>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        <input
                          ref={weightInputRef}
                          type="number"
                          step="any"
                          min="0"
                          placeholder="Weight"
                          value={formData.weight}
                          onChange={(e) => updateField("weight", e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <select
                          value={formData.weightUnit}
                          onChange={(e) =>
                            updateField("weightUnit", e.target.value as MeasurementWeightUnit)
                          }
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="kg">Kilograms (kg)</option>
                          <option value="lbs">Pounds (lbs)</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <div>
                      <label className="text-foreground font-medium">Fat Distribution</label>
                      <select
                        value={formData.fatDistribution}
                        onChange={(e) =>
                          updateField(
                            "fatDistribution",
                            e.target.value as MeasurementFormData["fatDistribution"]
                          )
                        }
                        className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Prefer not to say</option>
                        <option value="upper">Upper</option>
                        <option value="middle">Middle</option>
                        <option value="lower">Lower</option>
                        <option value="even">Even</option>
                      </select>
                    </div>

                  </>
                )}

                {currentStep === 3 && (
                  <>
                    <div>
                      <label className="text-foreground font-medium">Activity Level</label>
                      <select
                        value={formData.activityLevel}
                        onChange={(e) =>
                          updateField(
                            "activityLevel",
                            e.target.value as MeasurementFormData["activityLevel"]
                          )
                        }
                        className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Prefer not to say</option>
                        <option value="sedentary">Sedentary</option>
                        <option value="light">Light</option>
                        <option value="moderate">Moderate</option>
                        <option value="active">Active</option>
                        <option value="very_active">Very Active</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-foreground font-medium">Muscle Level</label>
                      <select
                        value={formData.muscleLevel}
                        onChange={(e) =>
                          updateField(
                            "muscleLevel",
                            e.target.value as MeasurementFormData["muscleLevel"]
                          )
                        }
                        className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Prefer not to say</option>
                        <option value="low">Low</option>
                        <option value="moderate">Moderate</option>
                        <option value="high">High</option>
                        <option value="very_high">Very High</option>
                      </select>
                    </div>
                  </>
                )}

                {currentStep === 4 && (
                  <>
                    <div>
                      <label className="text-foreground font-medium">Shoulder Type</label>
                      <select
                        value={formData.shoulderType}
                        onChange={(e) =>
                          updateField(
                            "shoulderType",
                            e.target.value as MeasurementFormData["shoulderType"]
                          )
                        }
                        className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Prefer not to say</option>
                        <option value="narrow">Narrow</option>
                        <option value="average">Average</option>
                        <option value="broad">Broad</option>
                        <option value="very_broad">Very Broad</option>
                      </select>
                    </div>
                  </>
                )}

                {currentStep === 5 && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <label ref={frontUploadRef} tabIndex={-1} className="cursor-pointer group">
                        <input
                          type="file"
                          accept="image/png,image/jpeg,.jpg,.jpeg"
                          className="hidden"
                          onChange={(e) => handleImageUpload("front", e)}
                        />
                        <div className="border-2 border-dashed border-primary/40 rounded-xl p-6 text-center hover:border-primary hover:bg-primary/5 transition-all min-h-[200px] flex flex-col items-center justify-center gap-3">
                          {frontPreview ? (
                            <img
                              src={frontPreview}
                              alt="Front view"
                              className="max-h-40 rounded-lg object-cover mx-auto"
                            />
                          ) : (
                            <Upload className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors" />
                          )}
                          <p className="font-medium text-foreground text-sm">Front View *</p>
                          <p className="text-xs text-muted-foreground">PNG/JPG/JPEG, max 16MB</p>
                          {formData.frontImage && (
                            <p className="text-xs text-primary truncate max-w-full">
                              {formData.frontImage.name}
                            </p>
                          )}
                        </div>
                      </label>

                      <label ref={sideUploadRef} tabIndex={-1} className="cursor-pointer group">
                        <input
                          type="file"
                          accept="image/png,image/jpeg,.jpg,.jpeg"
                          className="hidden"
                          onChange={(e) => handleImageUpload("side", e)}
                        />
                        <div className="border-2 border-dashed border-primary/40 rounded-xl p-6 text-center hover:border-primary hover:bg-primary/5 transition-all min-h-[200px] flex flex-col items-center justify-center gap-3">
                          {sidePreview ? (
                            <img
                              src={sidePreview}
                              alt="Side view"
                              className="max-h-40 rounded-lg object-cover mx-auto"
                            />
                          ) : (
                            <Upload className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors" />
                          )}
                          <p className="font-medium text-foreground text-sm">Side View *</p>
                          <p className="text-xs text-muted-foreground">PNG/JPG/JPEG, max 16MB</p>
                          {formData.sideImage && (
                            <p className="text-xs text-primary truncate max-w-full">
                              {formData.sideImage.name}
                            </p>
                          )}
                        </div>
                      </label>
                    </div>

                    {poseValidationDetails && (
                      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        <p className="font-semibold mb-2">
                          Pose validation failed. Please retake your photos.
                        </p>
                        <p>
                          Front: {poseValidationDetails.front_message} (
                          {poseValidationDetails.front_angle.toFixed(1)}
                          deg)
                        </p>
                        <p>
                          Side: {poseValidationDetails.side_message} (
                          {poseValidationDetails.side_angle.toFixed(1)}
                          deg)
                        </p>
                        {poseValidationDetails.errors.length > 0 && (
                          <p className="mt-1">{poseValidationDetails.errors.join(" ")}</p>
                        )}
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
              {currentStep > 1 ? (
                <button
                  onClick={handlePrevious}
                  disabled={isSubmitting}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-4 h-4" /> Previous
                </button>
              ) : (
                <div />
              )}

              {currentStep < TOTAL_STEPS ? (
                <button
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Calculating..." : "Calculate Measurements"}{" "}
                  <ArrowRight className="w-4 h-4" />
                </button>               
              )}
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Measurement;

