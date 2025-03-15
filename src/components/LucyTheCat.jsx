"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, animate } from "framer-motion";
import Image from "next/image";
import { Cat, Heart } from "lucide-react";

// Removing TypeScript types, converting to plain JSX
// CatBehavior: 'idle' | 'walking' | 'playing' | 'sleeping' | 'curious'
// CatDirection: 'left' | 'right'
// CatMood: 'happy' | 'playful' | 'tired' | 'curious'

export default function LucyTheCat() {
  const [behavior, setBehavior] = useState("idle");
  const [direction, setDirection] = useState("right");
  const [mood, setMood] = useState("happy");
  const [visible, setVisible] = useState(true);
  const [thinking, setThinking] = useState(null);
  const [playWithCat, setPlayWithCat] = useState(false);

  // Position state with physics-based animation
  const x = useMotionValue(window.innerWidth / 2);
  const y = useMotionValue(300);
  const smoothX = useSpring(x, { damping: 40, stiffness: 300 });
  const smoothY = useSpring(y, { damping: 40, stiffness: 300 });

  // Target positions for autonomous movement
  const targetX = useRef(window.innerWidth / 2);
  const targetY = useRef(300);
  const isMoving = useRef(false);
  const lastInteractionTime = useRef(Date.now());
  const lastMoodChangeTime = useRef(Date.now());
  const touchTimer = useRef(null);

  // Playfulness score increases with interaction
  const playfulnessRef = useRef(0);

  // Cat thoughts based on behavior
  const catThoughts = {
    idle: ["Just chillin'", "This spot is nice", "What's that over there?"],
    walking: ["Exploring time!", "I wonder what's ahead", "So much to see"],
    playing: ["This is fun!", "Wheee!", "Chase me!"],
    sleeping: ["Zzz...", "Purrrr...", "*dreaming of fish*"],
    curious: ["Hmm, what's that?", "Interesting...", "Should I touch it?"],
  };

  // Initialize cat position
  useEffect(() => {
    x.set(window.innerWidth / 2);
    y.set(300);

    // Set up interval for autonomous decision making
    const autonomyInterval = setInterval(() => {
      makeDecision();
    }, 3000);

    return () => clearInterval(autonomyInterval);
  }, []);

  // AI decision making for the cat
  const makeDecision = () => {
    const timeSinceInteraction = Date.now() - lastInteractionTime.current;
    const timeSinceMoodChange = Date.now() - lastMoodChangeTime.current;

    // Cat gets tired after periods of no interaction
    if (timeSinceInteraction > 30000 && Math.random() > 0.7) {
      setBehavior("sleeping");
      return;
    }

    // Cat mood changes over time
    if (timeSinceMoodChange > 15000 && Math.random() > 0.6) {
      const moods = ["happy", "playful", "tired", "curious"];
      const newMood = moods[Math.floor(Math.random() * moods.length)];
      setMood(newMood);
      lastMoodChangeTime.current = Date.now();
    }

    // Cat might share a thought
    if (Math.random() > 0.7) {
      const thoughts = catThoughts[behavior];
      const randomThought =
        thoughts[Math.floor(Math.random() * thoughts.length)];
      setThinking(randomThought);
      setTimeout(() => setThinking(null), 3000);
    }

    // Decide next behavior
    const rand = Math.random();

    if (behavior === "sleeping" && rand > 0.8) {
      // Cat wakes up occasionally
      setBehavior("idle");
    } else if (behavior !== "sleeping") {
      if (rand < 0.3) {
        moveToRandomPosition();
      } else if (rand < 0.5) {
        setBehavior("idle");
      } else if (rand < 0.7) {
        setBehavior("curious");
        lookAround();
      } else if (rand < 0.9 && playfulnessRef.current > 5) {
        setBehavior("playing");
        playAround();
      }
    }
  };

  // Random movement function
  const moveToRandomPosition = () => {
    if (isMoving.current) return;

    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const scrollPosition = window.scrollY;

    // Keep cat within current viewport
    targetX.current = Math.max(
      50,
      Math.min(viewportWidth - 50, Math.random() * viewportWidth)
    );
    targetY.current = Math.max(
      scrollPosition + 50,
      Math.min(
        scrollPosition + viewportHeight - 50,
        scrollPosition + Math.random() * viewportHeight
      )
    );

    // Set direction based on movement
    setDirection(targetX.current > x.get() ? "right" : "left");
    setBehavior("walking");
    isMoving.current = true;

    // Move towards target position with spring physics
    animate(x, targetX.current, {
      type: "spring",
      damping: 20,
      stiffness: 100,
      onComplete: () => {
        isMoving.current = false;
        setBehavior("idle");
      },
    });

    animate(y, targetY.current, {
      type: "spring",
      damping: 20,
      stiffness: 100,
    });
  };

  // Look around behavior
  const lookAround = () => {
    const sequence = [
      ["right", 1000],
      ["left", 1500],
      ["right", 800],
    ];

    sequence.reduce(
      (p, [dir, duration]) =>
        p.then(
          () =>
            new Promise((resolve) => {
              setDirection(dir);
              setTimeout(resolve, duration);
            })
        ),
      Promise.resolve()
    );
  };

  // Play around animation
  const playAround = () => {
    const startY = y.get();

    // Playful jumping motion
    animate(y, [startY, startY - 40, startY], {
      duration: 0.8,
      times: [0, 0.5, 1],
      repeat: 2,
      onComplete: () => {
        setBehavior("idle");
      },
    });

    // Change direction quickly
    setTimeout(() => setDirection("left"), 400);
    setTimeout(() => setDirection("right"), 800);
  };

  // Track cursor for interactive following
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Cat notices cursor and follows it sometimes
      if (behavior !== "sleeping" && Math.random() < 0.05) {
        const distanceToMouse = Math.hypot(
          e.clientX - x.get(),
          e.clientY + window.scrollY - y.get()
        );

        // Cat will be curious about cursor if nearby
        if (distanceToMouse < 300) {
          targetX.current = e.clientX;
          targetY.current = e.clientY + window.scrollY;
          setBehavior("curious");
          setDirection(e.clientX > x.get() ? "right" : "left");

          // Move with careful approach
          animate(x, e.clientX, {
            type: "spring",
            damping: 30,
            stiffness: 200,
          });

          animate(y, e.clientY + window.scrollY, {
            type: "spring",
            damping: 30,
            stiffness: 200,
            onComplete: () => {
              setBehavior("idle");
            },
          });
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [behavior]);

  // Handle scrolling to keep cat visible
  useEffect(() => {
    const visibilityCheck = () => {
      const catPosY = y.get();
      const scrollPos = window.scrollY;
      const windowHeight = window.innerHeight;

      // If cat is far off-screen, move it back into view
      if (
        catPosY < scrollPos - 300 ||
        catPosY > scrollPos + windowHeight + 300
      ) {
        y.set(scrollPos + windowHeight / 2);
        setVisible(true);
      } else {
        setVisible(true);
      }
    };

    const scrollHandler = () => {
      requestAnimationFrame(visibilityCheck);
    };

    window.addEventListener("scroll", scrollHandler);
    const visibilityInterval = setInterval(visibilityCheck, 2000);

    return () => {
      window.removeEventListener("scroll", scrollHandler);
      clearInterval(visibilityInterval);
    };
  }, []);

  // Interactive playing with cat when clicked
  const handleCatInteraction = () => {
    lastInteractionTime.current = Date.now();
    playfulnessRef.current += 1;

    if (behavior === "sleeping") {
      // Cat wakes up when touched
      setBehavior("idle");
      setThinking("Oh! I'm awake!");
    } else {
      // Cat becomes playful
      setBehavior("playing");
      setPlayWithCat(true);

      // Happy response
      animate(y, y.get() - 30, {
        type: "spring",
        damping: 10,
        stiffness: 300,
      });

      // Happy thought
      const happyThoughts = [
        "Pet me more!",
        "Purrrr!",
        "That's the spot!",
        "I like you!",
      ];
      setThinking(
        happyThoughts[Math.floor(Math.random() * happyThoughts.length)]
      );

      // Reset play state after a moment
      setTimeout(() => {
        setPlayWithCat(false);
      }, 2000);

      if (touchTimer.current) clearTimeout(touchTimer.current);
      touchTimer.current = setTimeout(() => {
        setBehavior("idle");
        setThinking(null);
      }, 3000);
    }
  };

  if (!visible) return null;

  return (
    <motion.div
      style={{
        position: "fixed",
        x: smoothX,
        y: smoothY,
        zIndex: 1000,
      }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", duration: 0.5 }}
    >
      <div
        className="relative cursor-pointer"
        onClick={handleCatInteraction}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleCatInteraction();
        }}
        role="button"
        tabIndex={0}
        aria-label="Interact with Lucy the cat"
      >
        {/* Speech bubble / thought */}
        {thinking && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: -30 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute -top-16 left-0 bg-white px-3 py-2 rounded-xl shadow-md text-xs max-w-[120px] text-center"
          >
            <div className="absolute -bottom-2 left-5 w-3 h-3 bg-white transform rotate-45" />
            {thinking}
          </motion.div>
        )}

        {/* Hearts when being petted */}
        {playWithCat && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, y: 0, x: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0.5],
                  y: [0, -30 - i * 10],
                  x: [0, (i % 2 === 0 ? 15 : -15) * (i + 1)],
                }}
                transition={{
                  duration: 1,
                  delay: i * 0.1,
                  ease: "easeOut",
                }}
                className="absolute top-0 left-10"
              >
                <Heart size={16} className="text-pink-500 fill-pink-500" />
              </motion.div>
            ))}
          </>
        )}

        {/* Cat Animation - More detailed SVG */}
        <motion.div
          animate={{
            scale: behavior === "sleeping" ? 1.2 : 1,
            rotate: behavior === "idle" ? [0, 2, 0, -2, 0] : 0,
          }}
          transition={{
            rotate: { repeat: Infinity, duration: 4, ease: "easeInOut" },
            scale: { duration: 0.5 },
          }}
        >
          <svg
            width="100"
            height="75"
            viewBox="0 0 80 60"
            style={{
              filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))",
              transform: direction === "left" ? "scaleX(-1)" : "none",
            }}
          >
            {/* Cat body */}
            <ellipse cx="40" cy="40" rx="25" ry="18" fill="#FF9F43" />

            {/* Cat head */}
            <circle cx="65" cy="30" r="15" fill="#FF9F43" />

            {/* Cat ears */}
            <polygon points="60,20 55,5 65,15" fill="#FF9F43" />
            <polygon points="70,20 75,5 65,15" fill="#FF9F43" />
            <polygon points="60,20 55,8 60,15" fill="#FFBEA9" opacity="0.6" />
            <polygon points="70,20 75,8 70,15" fill="#FFBEA9" opacity="0.6" />

            {/* Cat face details */}
            <motion.ellipse
              cx="60"
              cy="28"
              rx="2"
              ry={behavior === "sleeping" ? 0.5 : 4}
              fill="#000"
              animate={{
                ry:
                  behavior === "sleeping"
                    ? 0.5
                    : behavior === "curious"
                    ? [4, 5, 4]
                    : 4,
              }}
              transition={{
                repeat: behavior === "curious" ? Infinity : 0,
                duration: 1.5,
                repeatDelay: 1,
              }}
            />
            <motion.ellipse
              cx="70"
              cy="28"
              rx="2"
              ry={behavior === "sleeping" ? 0.5 : 4}
              fill="#000"
              animate={{
                ry:
                  behavior === "sleeping"
                    ? 0.5
                    : behavior === "curious"
                    ? [4, 5, 4]
                    : 4,
              }}
              transition={{
                repeat: behavior === "curious" ? Infinity : 0,
                duration: 1.5,
                repeatDelay: 1,
              }}
            />

            {/* Cat detail - whiskers */}
            <line
              x1="55"
              y1="33"
              x2="45"
              y2="30"
              stroke="#FFF"
              strokeWidth="0.7"
            />
            <line
              x1="55"
              y1="34"
              x2="45"
              y2="34"
              stroke="#FFF"
              strokeWidth="0.7"
            />
            <line
              x1="55"
              y1="35"
              x2="45"
              y2="38"
              stroke="#FFF"
              strokeWidth="0.7"
            />

            <line
              x1="75"
              y1="33"
              x2="85"
              y2="30"
              stroke="#FFF"
              strokeWidth="0.7"
            />
            <line
              x1="75"
              y1="34"
              x2="85"
              y2="34"
              stroke="#FFF"
              strokeWidth="0.7"
            />
            <line
              x1="75"
              y1="35"
              x2="85"
              y2="38"
              stroke="#FFF"
              strokeWidth="0.7"
            />

            {/* Cat nose */}
            <circle cx="65" cy="33" r="1.5" fill="#FF6B6B" />

            {/* Cat mouth */}
            <motion.path
              d={
                behavior === "sleeping"
                  ? "M62 35 Q65 34 68 35"
                  : "M62 36 Q65 38 68 36"
              }
              stroke="#000"
              strokeWidth="1"
              fill="none"
              animate={{
                d:
                  behavior === "playing"
                    ? ["M62 36 Q65 39 68 36", "M62 36 Q65 37 68 36"]
                    : behavior === "sleeping"
                    ? "M62 35 Q65 34 68 35"
                    : "M62 36 Q65 38 68 36",
              }}
              transition={{
                repeat: behavior === "playing" ? Infinity : 0,
                duration: 0.5,
              }}
            />

            {/* Cat tail */}
            <motion.path
              d="M15 40 Q5 20 15 10"
              stroke="#FF9F43"
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
              animate={{
                d:
                  behavior === "idle"
                    ? [
                        "M15 40 Q5 20 15 10",
                        "M15 40 Q5 30 15 10",
                        "M15 40 Q5 20 15 10",
                      ]
                    : behavior === "walking"
                    ? [
                        "M15 40 Q5 20 15 10",
                        "M15 40 Q0 30 10 15",
                        "M15 40 Q5 20 15 10",
                      ]
                    : behavior === "playing"
                    ? [
                        "M15 40 Q0 10 20 5",
                        "M15 40 Q20 15 5 10",
                        "M15 40 Q0 10 20 5",
                      ]
                    : behavior === "sleeping"
                    ? "M15 40 Q20 35 25 40"
                    : "M15 40 Q10 25 25 25",
              }}
              transition={{
                repeat: Infinity,
                duration: behavior === "playing" ? 0.8 : 2,
              }}
            />

            {/* Cat legs - visible based on behavior */}
            {behavior !== "sleeping" && (
              <>
                <motion.line
                  x1="30"
                  y1="55"
                  x2="30"
                  y2="65"
                  stroke="#FF9F43"
                  strokeWidth="4"
                  strokeLinecap="round"
                  animate={
                    behavior === "walking"
                      ? { x2: [30, 35, 30], y2: [65, 60, 65] }
                      : {}
                  }
                  transition={{ repeat: Infinity, duration: 0.5 }}
                />
                <motion.line
                  x1="50"
                  y1="55"
                  x2="50"
                  y2="65"
                  stroke="#FF9F43"
                  strokeWidth="4"
                  strokeLinecap="round"
                  animate={
                    behavior === "walking"
                      ? { x2: [50, 45, 50], y2: [65, 60, 65] }
                      : {}
                  }
                  transition={{ repeat: Infinity, duration: 0.5, delay: 0.25 }}
                />
              </>
            )}

            {/* Z's for sleeping */}
            {behavior === "sleeping" && (
              <>
                <motion.text
                  x="75"
                  y="15"
                  fontSize="8"
                  fontWeight="bold"
                  fill="#555"
                  animate={{ opacity: [0, 1, 0], y: [15, 10, 5] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  Z
                </motion.text>
                <motion.text
                  x="80"
                  y="22"
                  fontSize="6"
                  fontWeight="bold"
                  fill="#555"
                  animate={{ opacity: [0, 1, 0], y: [22, 17, 12] }}
                  transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
                >
                  z
                </motion.text>
                <motion.text
                  x="85"
                  y="28"
                  fontSize="4"
                  fontWeight="bold"
                  fill="#555"
                  animate={{ opacity: [0, 1, 0], y: [28, 23, 18] }}
                  transition={{ repeat: Infinity, duration: 3, delay: 1 }}
                >
                  z
                </motion.text>
              </>
            )}
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
}
