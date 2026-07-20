import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ScanLine, Shirt, Sparkles, Wand2, X } from "lucide-react";

interface VirtualTryOnLoaderProps {
  open: boolean;
  productImage: string;
  userImage?: string | null;
  productName?: string;
  onCancel?: () => void;
}

const cn = (...classes: Array<string | false | null | undefined>) => {
  return classes.filter(Boolean).join(" ");
};

const PHASES = [
  { key: "upload", label: "Preparing your photo", icon: ScanLine, from: 0, to: 15 },
  { key: "detect", label: "Detecting body silhouette", icon: Sparkles, from: 15, to: 35 },
  { key: "fit", label: "Mapping the garment to your form", icon: Shirt, from: 35, to: 65 },
  { key: "render", label: "Rendering fabric, folds & light", icon: Wand2, from: 65, to: 92 },
  { key: "finalize", label: "Adding the finishing touches", icon: Check, from: 92, to: 100 },
] as const;

const TIPS = [
  "Every stitch is placed by hand - the AI is mirroring that craft.",
  "Our couturiers spend 40+ hours on a single piece. This takes seconds.",
  "Fabric drape is being simulated in real time for a true-to-life fit.",
  "Tip: soft, front-facing daylight gives the most accurate preview.",
  "The silhouette is calibrated to your posture and proportions.",
  "Colour, texture and sheen are matched to the original bolt of cloth.",
];

export const VirtualTryOnLoader = ({
  open,
  productImage,
  userImage,
  productName,
  onCancel,
}: VirtualTryOnLoaderProps) => {
  const [progress, setProgress] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    if (!open) {
      setProgress(0);
      setTipIndex(0);
      return;
    }

    const start = Date.now();
    const id = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      const target = 95 * (1 - Math.exp(-elapsed / 30));
      setProgress((current) => (target > current ? target : current));
    }, 200);

    return () => clearInterval(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const id = setInterval(() => {
      setTipIndex((current) => (current + 1) % TIPS.length);
    }, 4500);

    return () => clearInterval(id);
  }, [open]);

  const currentPhase = useMemo(() => {
    return PHASES.find((phase) => progress >= phase.from && progress < phase.to) ?? PHASES[PHASES.length - 1];
  }, [progress]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="try-on-loader"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-7xl overflow-hidden rounded-[2rem] border border-border bg-background shadow-sm"
        role="region"
        aria-label="Virtual try-on in progress"
        aria-busy="true"
      >
        {onCancel && (
          <button
            onClick={onCancel}
            className="absolute top-6 right-6 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/70 text-muted-foreground backdrop-blur-sm transition-colors hover:border-foreground/40 hover:text-foreground"
            aria-label="Cancel virtual try-on"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        )}

        <div className="grid min-h-[68vh] grid-cols-1 lg:min-h-[72vh] lg:grid-cols-2">
          <div className="relative overflow-hidden bg-gradient-to-br from-blush-light via-background to-cream">
            <motion.div
              className="absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full bg-blush/40 blur-3xl"
              animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-0 -right-24 h-[360px] w-[360px] rounded-full bg-sage/25 blur-3xl"
              animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative z-10 flex h-full min-h-[50vh] items-center justify-center p-6 sm:p-8 lg:min-h-0">
              <div className="relative aspect-[3/4] w-full max-w-md">
                {userImage ? (
                  <motion.img
                    src={userImage}
                    alt="Your photo"
                    className="absolute inset-0 h-full w-full rounded-sm object-cover shadow-2xl"
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                  />
                ) : (
                  <div className="absolute inset-0 rounded-sm bg-gradient-to-b from-cream to-blush-light shadow-2xl" />
                )}

                <motion.img
                  src={productImage}
                  alt={productName ?? "Garment"}
                  className="absolute inset-0 h-full w-full rounded-sm object-cover mix-blend-multiply"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.35 + (progress / 100) * 0.5 }}
                  transition={{ duration: 0.6 }}
                />

                {[
                  "top-0 left-0 border-t border-l",
                  "top-0 right-0 border-t border-r",
                  "bottom-0 left-0 border-b border-l",
                  "bottom-0 right-0 border-b border-r",
                ].map((position, index) => (
                  <span key={index} className={cn("absolute h-8 w-8 border-sage/80", position)} />
                ))}

                <motion.div
                  className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-sage to-transparent shadow-[0_0_20px_hsl(var(--sage))]"
                  initial={{ top: "0%" }}
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                />

                {[...Array(6)].map((_, index) => (
                  <motion.span
                    key={index}
                    className="absolute h-1.5 w-1.5 rounded-full bg-sage-light"
                    style={{
                      left: `${15 + ((index * 37) % 70)}%`,
                      top: `${20 + ((index * 53) % 60)}%`,
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0.4, 1.2, 0.4],
                    }}
                    transition={{
                      duration: 2 + (index % 3) * 0.5,
                      repeat: Infinity,
                      delay: index * 0.4,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center px-6 py-6 text-center sm:px-8 lg:px-10 lg:py-8">
            <div className="w-full max-w-md">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 text-xs uppercase tracking-[0.3em] text-sage"
              >
                Virtual Atelier
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-4 font-serif text-4xl leading-tight md:text-5xl"
              >
                Draping <span className="italic text-sage">{productName ?? "your piece"}</span> onto you.
              </motion.h2>

              <p className="mb-6 leading-relaxed text-muted-foreground sm:mb-8">
                Sit back - our virtual couturier is tailoring a preview just for you. This usually takes under a minute.
              </p>

              <div className="mb-3 flex items-baseline justify-between">
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Progress
                </span>
                <span className="font-serif text-2xl tabular-nums text-foreground">
                  {Math.floor(progress)}
                  <span className="text-base text-muted-foreground">%</span>
                </span>
              </div>

              <div className="relative h-[3px] overflow-hidden rounded-full bg-border">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-sage-dark via-sage to-sage-light"
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut", duration: 0.4 }}
                />
                <motion.div
                  className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                  animate={{ x: ["-100%", "600%"] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
                />
              </div>

              <ul className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
                {PHASES.map((phase) => {
                  const done = progress >= phase.to;
                  const active = currentPhase.key === phase.key && !done;
                  const Icon = phase.icon;

                  return (
                    <li
                      key={phase.key}
                      className={cn(
                        "flex items-center gap-4 transition-colors",
                        done ? "text-foreground" : active ? "text-foreground" : "text-muted-foreground/50"
                      )}
                    >
                      <span
                        className={cn(
                          "relative flex h-8 w-8 items-center justify-center rounded-full border transition-all",
                          done
                            ? "border-sage bg-sage text-primary-foreground"
                            : active
                              ? "border-sage text-sage"
                              : "border-border"
                        )}
                      >
                        {done ? (
                          <Check className="h-3.5 w-3.5" strokeWidth={2} />
                        ) : (
                          <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
                        )}

                        {active && (
                          <motion.span
                            className="absolute inset-0 rounded-full border border-sage"
                            animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                            transition={{ duration: 1.6, repeat: Infinity }}
                          />
                        )}
                      </span>
                      <span className="text-sm tracking-wide">{phase.label}</span>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-6 min-h-[64px] border-t border-border pt-6 sm:mt-8 sm:pt-8">
                <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-sage">
                  Did you know
                </p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={tipIndex}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.5 }}
                    className="font-serif text-lg leading-snug italic text-foreground/90"
                  >
                    "{TIPS[tipIndex]}"
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VirtualTryOnLoader;
