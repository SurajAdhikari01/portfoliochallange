"use client";

import { motion } from "framer-motion";
import { ColorChangeText } from "./TextAnimations";

export default function SectionHeader({ title, inView = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <h2 className="text-4xl font-bold text-primary inline-block relative font-heading">
        <ColorChangeText text={title} />
        <motion.div
          className="absolute -bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-primary-light to-primary rounded-full"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        />
      </h2>
    </motion.div>
  );
}
