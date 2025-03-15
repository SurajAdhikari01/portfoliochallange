"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Laptop, Palette } from "lucide-react";

import { useTheme } from "./ThemeProvider";
import { Button } from "./ui/button";

export default function ThemeSwitcher() {
  const { theme, setTheme, colorScheme, setColorScheme, isDarkMode } =
    useTheme();
  const [showColorOptions, setShowColorOptions] = useState(false);

  const colorSchemes = [
    { name: "pink", color: "#F472B6" },
    { name: "purple", color: "#A78BFA" },
    { name: "blue", color: "#60A5FA" },
    { name: "mint", color: "#34D399" },
  ];

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            const modes = ["light", "dark", "system"];
            const currentIndex = modes.indexOf(theme);
            const nextIndex = (currentIndex + 1) % modes.length;
            setTheme(modes[nextIndex]);
          }}
          aria-label="Toggle theme"
        >
          <AnimatePresence mode="wait" initial={false}>
            {theme === "light" && (
              <motion.div
                key="light"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <Sun className="h-5 w-5" />
              </motion.div>
            )}

            {theme === "dark" && (
              <motion.div
                key="dark"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <Moon className="h-5 w-5" />
              </motion.div>
            )}

            {theme === "system" && (
              <motion.div
                key="system"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <Laptop className="h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowColorOptions(!showColorOptions)}
          aria-label="Change color scheme"
        >
          <Palette
            className="h-5 w-5"
            style={{
              color: colorSchemes.find((s) => s.name === colorScheme)?.color,
            }}
          />
        </Button>
      </div>

      <AnimatePresence>
        {showColorOptions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <div className="grid grid-cols-2 gap-2">
              {colorSchemes.map((scheme) => (
                <button
                  key={scheme.name}
                  onClick={() => {
                    setColorScheme(scheme.name);
                    setShowColorOptions(false);
                  }}
                  className={`w-8 h-8 rounded-full transition-all ${
                    colorScheme === scheme.name
                      ? "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800"
                      : "hover:scale-110"
                  }`}
                  style={{
                    backgroundColor: scheme.color,
                    boxShadow:
                      colorScheme === scheme.name
                        ? "0 0 0 2px rgba(0,0,0,0.1)"
                        : "none",
                  }}
                  aria-label={`Set color theme to ${scheme.name}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
