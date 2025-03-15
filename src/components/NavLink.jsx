"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function NavLink({ href, children, isActive, className }) {
  return (
    <a
      href={href}
      className={cn(
        "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors font-medium relative group",
        isActive && "text-primary dark:text-primary font-semibold",
        className
      )}
    >
      <span className="relative z-10">{children}</span>
      <motion.span
        className={cn(
          "absolute bottom-0 left-0 w-full h-0.5 bg-primary origin-left",
          isActive ? "scale-x-100" : "scale-x-0"
        )}
        initial={{ scaleX: isActive ? 1 : 0 }}
        animate={{ scaleX: isActive ? 1 : 0 }}
        exit={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />
    </a>
  );
}
