"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type ColorChangeTextProps = {
  text: string,
};

export function ColorChangeText({ text }: ColorChangeTextProps) {
  return (
    <span className="inline-block">
      {text.split("").map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          className="inline-block"
          whileHover={{
            color: [
              "rgb(var(--primary-dark))",
              "rgb(var(--primary))",
              "rgb(var(--primary-light))",
              "rgb(var(--accent-light))",
              "rgb(var(--primary))",
              "rgb(var(--primary-dark))",
            ],
            y: -5,
            transition: { duration: 0.3 },
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

export function HoverFlipText({ text }: ColorChangeTextProps) {
  return (
    <span className="inline-flex">
      {text.split("").map((letter, index) => (
        <motion.span
          key={`${letter}-${index}`}
          className="inline-block px-[1px] text-primary"
          whileHover={{
            color: "rgb(var(--primary-light))",
            y: -5,
            transition: { duration: 0.2 },
          }}
        >
          <motion.span
            className="inline-block"
            whileHover={{
              rotateX: 360,
              transition: { duration: 0.5 },
            }}
          >
            {letter}
          </motion.span>
        </motion.span>
      ))}
    </span>
  );
}

export function GlitchText({ text }: ColorChangeTextProps) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <span className="relative inline-block">{text}</span>

      {isHovering && (
        <>
          <motion.span
            className="absolute inset-0 text-primary-light"
            animate={{ x: [-1, 1, 0], opacity: [1, 0, 1] }}
            transition={{
              repeat: Infinity,
              duration: 0.3,
              repeatType: "reverse",
            }}
            aria-hidden="true"
          >
            {text}
          </motion.span>
          <motion.span
            className="absolute inset-0 text-accent"
            animate={{ x: [1, -1, 0], opacity: [1, 0, 1] }}
            transition={{
              repeat: Infinity,
              duration: 0.3,
              repeatType: "reverse",
              delay: 0.1,
            }}
            aria-hidden="true"
          >
            {text}
          </motion.span>
        </>
      )}
    </span>
  );
}
