"use client";

import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function Tilt({ children, perspective = 1000, scale = 1.05 }) {
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const springConfig = { damping: 20, stiffness: 300 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);
  const springScale = useSpring(isHovering ? scale : 1, springConfig);

  useEffect(() => {
    // Check if it's a touch device
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(hover: none)").matches);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  function onMouseMove(e) {
    if (isMobile) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate distance from center (between -100 and 100)
    x.set(((mouseX - centerX) / centerX) * 100);
    y.set(((mouseY - centerY) / centerY) * 100);
  }

  function onMouseEnter() {
    if (isMobile) return;
    setIsHovering(true);
  }

  function onMouseLeave() {
    if (isMobile) return;
    setIsHovering(false);
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      style={{
        perspective,
        scale: springScale,
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}
