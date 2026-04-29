import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";

type BlurTextProps = {
  text: string;
  className?: string;
  by?: "word" | "letter";
  delay?: number;
  direction?: "bottom" | "top";
};

export function BlurText({
  text,
  className,
  by = "word",
  delay = 200,
  direction = "bottom",
}: BlurTextProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const parts = useMemo(
    () => (by === "word" ? text.split(" ") : text.split("")),
    [by, text],
  );

  return (
    <div ref={ref} className={className}>
      {parts.map((part, index) => (
        <motion.span
          key={`${part}-${index}`}
          className="inline-block will-change-transform"
          initial={
            direction === "bottom"
              ? { filter: "blur(10px)", opacity: 0, y: 50 }
              : { filter: "blur(10px)", opacity: 0, y: -50 }
          }
          animate={
            inView
              ? {
                  filter: ["blur(10px)", "blur(5px)", "blur(0px)"],
                  opacity: [0, 0.5, 1],
                  y: direction === "bottom" ? [50, -5, 0] : [-50, 5, 0],
                }
              : undefined
          }
          transition={{
            delay: (index * delay) / 1000,
            duration: 1.05,
            times: [0, 0.5, 1],
            ease: "easeOut",
          }}
        >
          {part === " " ? "\u00A0" : part}
          {by === "word" && index < parts.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </div>
  );
}
