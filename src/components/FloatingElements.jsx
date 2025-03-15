"use client";

import { motion } from "framer-motion";
import { Heart, Star, Music, Sparkles } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function FloatingElements() {
  const { isDarkMode } = useTheme();

  const elements = [
    {
      icon: <Heart className="w-4 h-4 text-pink-400" />,
      positionClass: "absolute top-10 left-10",
      animationProps: {
        y: [0, -50],
        x: [0, 20],
        opacity: [0, 1, 0],
        rotate: [0, 20],
      },
      transitionProps: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 4,
        repeatDelay: 2,
      },
    },
    {
      icon: <Star className="w-4 h-4 text-yellow-400" />,
      positionClass: "absolute bottom-20 right-10",
      animationProps: {
        y: [0, -40],
        x: [0, -15],
        opacity: [0, 1, 0],
        rotate: [0, -15],
      },
      transitionProps: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 3.5,
        delay: 1,
        repeatDelay: 3,
      },
    },
    {
      icon: <Sparkles className="w-4 h-4 text-primary" />,
      positionClass: "absolute top-1/3 right-1/4",
      animationProps: {
        y: [0, -30],
        x: [0, 10],
        opacity: [0, 1, 0],
        scale: [0.8, 1.2, 0.8],
      },
      transitionProps: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 2.5,
        delay: 0.5,
        repeatDelay: 4,
      },
    },
    {
      icon: <Music className="w-4 h-4 text-accent" />,
      positionClass: "absolute bottom-1/4 left-1/3",
      animationProps: {
        y: [0, -25],
        x: [0, -10],
        opacity: [0, 1, 0],
        scale: [0.9, 1.1, 0.9],
      },
      transitionProps: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 3,
        delay: 1.5,
        repeatDelay: 3.5,
      },
    },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {elements.map((element, index) => (
        <motion.div
          key={index}
          className={element.positionClass}
          animate={element.animationProps}
          transition={element.transitionProps}
        >
          {element.icon}
        </motion.div>
      ))}
    </div>
  );
}
