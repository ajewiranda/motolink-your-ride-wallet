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
            <MotoLinkLogo size="xl" variant="white" />

            <p className="text-white/80 text-sm mt-4">Sewa Motor Mudah & Cepat</p>

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
