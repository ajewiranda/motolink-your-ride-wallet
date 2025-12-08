import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MotoLinkLogo } from "@/components/icons/MotoLinkLogo";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center motolink-gradient"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="flex flex-col items-center"
          >
            {/* Logo */}
            <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 shadow-2xl">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-14 h-14"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="5.5" cy="17.5" r="3.5" className="fill-white/20" />
                <circle cx="18.5" cy="17.5" r="3.5" className="fill-white/20" />
                <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" className="fill-white" />
                <path d="m12 17 2-8h3l.5 2" />
                <path d="M9 17L7 9h3l2 4 2-4" />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-white mb-2">MotoLink</h1>
            <p className="text-white/80 text-sm">Sewa Motor Mudah & Cepat</p>

            {/* Loading dots */}
            <div className="flex gap-1.5 mt-8">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-white"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Bottom decoration */}
          <div className="absolute bottom-8 text-white/60 text-xs">
            © 2024 MotoLink
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
