"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);

  // Check if this is first visit
  useEffect(() => {
    // Only show intro animation once per session
    const hasSeenIntro = sessionStorage.getItem("seen-intro");
    if (hasSeenIntro) {
      setShowIntro(false);
      setLoading(false);
    } else {
      // Start with intro animation
      const timer = setTimeout(() => {
        setShowIntro(false);
        setTimeout(() => setLoading(false), 1000);
        sessionStorage.setItem("seen-intro", "true");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  if (loading) {
    return (
      <AnimatePresence>
        {showIntro && (
          <motion.div
            className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <svg
                width="120"
                height="120"
                viewBox="0 0 120 120"
                className="mb-8"
              >
                <motion.circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#F472B6"
                  strokeWidth="8"
                  strokeDasharray="314"
                  strokeDashoffset="314"
                  strokeLinecap="round"
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
              </svg>
            </motion.div>

            <motion.h1
              className="text-5xl font-bold text-pink-500 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Bliss
            </motion.h1>

            <motion.p
              className="text-lg text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              Welcome to my world
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
