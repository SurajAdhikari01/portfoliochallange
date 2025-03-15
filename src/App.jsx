"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  AnimatePresence,
} from "framer-motion";
import {
  Book,
  Cat,
  Film,
  Instagram,
  Linkedin,
  Palette,
  Twitter,
  Star,
  Music,
  Heart,
  Sparkles,
  Github,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import HobbyStory from "@/components/HobbyStory";
import LucyTheCat from "@/components/LucyTheCat";
import { useIntersectionObserver } from "@/lib/useIntersectionObserver";
import { useImagePreloader } from "@/lib/useImagePreloader";

// Preload images for smoother experience
const imageList = [
  "/profile.jpg",
  "/about.jpg",
  "/lucy.jpg",
  "/placeholder-reading.jpg",
  "/placeholder-watching.jpg",
  "/placeholder-painting.jpg",
  "/placeholder-lucy.jpg",
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [cursorHovering, setCursorHovering] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { isDarkMode } = useTheme();

  // Refs for sections
  const heroRef = useRef < HTMLDivElement > null;
  const aboutRef = useRef < HTMLDivElement > null;
  const hobbiesRef = useRef < HTMLDivElement > null;
  const contactRef = useRef < HTMLDivElement > null;
  const containerRef = useRef < HTMLDivElement > null;

  // Intersection observers for sections
  const [heroInViewRef, heroInView] = useIntersectionObserver({
    threshold: 0.3,
  });
  const [aboutInViewRef, aboutInView] = useIntersectionObserver({
    threshold: 0.3,
  });
  const [hobbiesInViewRef, hobbiesInView] = useIntersectionObserver({
    threshold: 0.3,
  });
  const [contactInViewRef, contactInView] = useIntersectionObserver({
    threshold: 0.3,
  });

  // Check if images are preloaded
  const imagesPreloaded = useImagePreloader(imageList);

  // Parallax effect refs
  const parallaxLayers = [useRef(null), useRef(null), useRef(null)];

  // Scroll progress for various effects
  const { scrollYProgress } = useScroll();
  const smoothScrollProgress = useSpring(scrollYProgress, {
    damping: 15,
    stiffness: 300,
  });

  // Update scroll progress for animation timing
  useEffect(() => {
    return smoothScrollProgress.onChange((v) => setScrollProgress(v));
  }, [smoothScrollProgress]);

  // Parallax transformations
  const heroImageY = useTransform(smoothScrollProgress, [0, 1], [0, -150]);
  const heroContentY = useTransform(smoothScrollProgress, [0, 0.5], [0, 100]);
  const backgroundY = useTransform(smoothScrollProgress, [0, 1], [0, -50]);
  const parallaxLayer0Y = useTransform(smoothScrollProgress, [0, 1], [0, -100]);
  const parallaxLayer2Y = useTransform(smoothScrollProgress, [0, 1], [0, -150]);

  // Custom cursor
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const smoothCursorX = useSpring(cursorX, { damping: 25, stiffness: 250 });
  const smoothCursorY = useSpring(cursorY, { damping: 25, stiffness: 250 });
  const cursorScale = useSpring(1, { damping: 25, stiffness: 250 });

  // Current section based on scroll position
  const currentSection = useMemo(() => {
    if (heroInView) return "home";
    if (aboutInView) return "about";
    if (hobbiesInView) return "hobbies";
    if (contactInView) return "contact";
    return "";
  }, [heroInView, aboutInView, hobbiesInView, contactInView]);

  // Performance optimization: throttle cursor updates
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (!timeoutId) {
        timeoutId = setTimeout(() => {
          setCursorPosition({ x: e.clientX, y: e.clientY });
          cursorX.set(e.clientX);
          cursorY.set(e.clientY);
          timeoutId = null;
        }, 10); // 10ms throttle
      }
    };

    const handleMouseOver = () => {
      setCursorHovering(true);
      cursorScale.set(1.5);
    };

    const handleMouseOut = () => {
      setCursorHovering(false);
      cursorScale.set(1);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const interactiveElements = document.querySelectorAll(
      'a, button, [role="button"]'
    );
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseover", handleMouseOver);
      el.addEventListener("mouseout", handleMouseOut);
    });

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener("mousemove", handleMouseMove);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseover", handleMouseOver);
        el.removeEventListener("mouseout", handleMouseOut);
      });
    };
  }, [cursorX, cursorY, cursorScale]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isMobileMenuOpen && e.target instanceof Element) {
        const menuContainer = document.querySelector(".mobile-menu-container");
        if (menuContainer && !menuContainer.contains(e.target)) {
          setIsMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobileMenuOpen]);

  // Handle escape key for accessibility
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Monitor performance
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === "longtask" && entry.duration > 100) {
          console.warn(`Long task detected: ${entry.duration}ms`);
        }
      });
    });

    observer.observe({ entryTypes: ["longtask"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // For SSR compatibility
  if (!mounted) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-pulse-glow rounded-full h-16 w-16 bg-primary/10" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-x-hidden">
      {/* Custom Cursor */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[1000] mix-blend-difference"
        style={{
          x: smoothCursorX,
          y: smoothCursorY,
          backgroundColor: cursorHovering ? "rgb(var(--primary))" : "white",
          scale: cursorScale,
        }}
      />

      {/* Background Gradient with Parallax */}
      <motion.div
        className="fixed inset-0 bg-gradient-to-b from-pink-50/80 to-white dark:from-pink-950/20 dark:to-gray-950 z-[-1]"
        style={{ y: backgroundY }}
      />

      <header className="fixed top-0 left-0 right-0 z-50 glassmorphism border-b border-pink-100/30 dark:border-pink-900/30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold text-primary relative group font-heading"
          >
            <span className="relative z-10">Bliss</span>
            <motion.span
              className="absolute inset-0 bg-primary-light/20 rounded-lg -z-10"
              initial={{ scale: 0 }}
              whileHover={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </Link>

          <nav className="hidden md:flex space-x-8">
            <NavLink href="#about" isActive={currentSection === "about"}>
              About
            </NavLink>
            <NavLink href="#hobbies" isActive={currentSection === "hobbies"}>
              Hobbies
            </NavLink>
            <NavLink href="#contact" isActive={currentSection === "contact"}>
              Contact
            </NavLink>
          </nav>

          <div className="flex items-center space-x-4">
            <ThemeSwitcher />
            <MobileMenu
              isOpen={isMobileMenuOpen}
              setIsOpen={setIsMobileMenuOpen}
              currentSection={currentSection}
            />
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section with Parallax */}
        <section
          ref={heroRef}
          id="home"
          className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
        >
          <div ref={heroInViewRef} className="absolute inset-0" />

          {/* Parallax Background Elements */}
          <motion.div
            ref={parallaxLayers[0]}
            style={{ y: parallaxLayer0Y }}
            className="absolute inset-0 z-0"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(253,242,248,0)_0%,rgba(253,242,248,0.8)_100%)] dark:bg-[radial-gradient(circle_at_center,rgba(40,30,50,0)_0%,rgba(40,30,50,0.8)_100%)]" />
            <Particles className="absolute inset-0" isDark={isDarkMode} />
          </motion.div>

          <motion.div
            ref={parallaxLayers[1]}
            style={{ y: heroImageY }}
            className="absolute top-1/4 -right-20 w-96 h-96 rounded-full bg-primary/10 blur-3xl z-0"
          />

          <motion.div
            ref={parallaxLayers[2]}
            style={{ y: parallaxLayer2Y }}
            className="absolute bottom-1/4 -left-20 w-72 h-72 rounded-full bg-primary-light/20 blur-3xl z-0"
          />

          <motion.div
            style={{ y: heroContentY }}
            className="container relative z-10 mx-auto px-4 py-32 flex flex-col items-center text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6 relative"
            >
              <div className="relative w-48 h-48 md:w-56 md:h-56">
                <Image
                  src={
                    imagesPreloaded
                      ? "/profile.jpg"
                      : "/placeholder.svg?height=200&width=200"
                  }
                  width={200}
                  height={200}
                  alt="Bliss"
                  className="rounded-full border-4 border-pink-300/50 shadow-lg relative z-10 object-cover"
                  priority
                />
                <motion.div
                  className="absolute -inset-4 rounded-full bg-gradient-to-r from-pink-200 to-pink-300 z-0 blur-md"
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.5, 0.7, 0.5],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 3,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold text-primary mb-4 font-heading"
            >
              Hello, I'm <HoverFlipText text="Bliss" />
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-2xl mb-8"
            >
              <ColorChangeText text="Welcome to my personal space where creativity meets passion" />
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary-dark text-white rounded-full px-8 relative overflow-hidden group"
              >
                <a href="#about">
                  <span className="relative z-10">Get to know me</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
                  <motion.span
                    className="absolute inset-0 bg-primary-light/30"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 1 }}
                  />
                </a>
              </Button>
            </motion.div>

            <motion.div
              className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
            >
              <a
                href="#about"
                className="flex flex-col items-center text-primary"
              >
                <span className="text-sm mb-2">Scroll Down</span>
                <div className="w-6 h-10 border-2 border-primary-light rounded-full flex justify-center p-1">
                  <motion.div
                    animate={{ y: [0, 12, 0] }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 1.5,
                    }}
                    className="w-2 h-2 bg-primary rounded-full"
                  />
                </div>
              </a>
            </motion.div>
          </motion.div>
        </section>

        {/* About Section with 3D Card Effect */}
        <section id="about" ref={aboutRef} className="py-24 relative">
          <div ref={aboutInViewRef} className="absolute inset-0" />
          <div className="absolute inset-0 bg-white dark:bg-gray-900 z-[-1]" />
          <div className="container mx-auto px-4">
            <SectionHeader title="About Me" inView={aboutInView} />

            <div className="grid md:grid-cols-2 gap-12 items-center mt-16">
              <Tilt>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <FloatingElements />
                  <div className="absolute -top-4 -left-4 w-24 h-24 bg-pink-200 dark:bg-pink-800/30 rounded-full opacity-50" />
                  <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-pink-300 dark:bg-pink-700/30 rounded-full opacity-50" />
                  <div className="relative z-10 overflow-hidden rounded-lg shadow-xl">
                    <Image
                      src={
                        imagesPreloaded
                          ? "/about.jpg"
                          : "/placeholder.svg?height=600&width=500"
                      }
                      width={500}
                      height={600}
                      alt="Bliss portrait"
                      className="w-full h-auto object-cover"
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    />
                  </div>
                </motion.div>
              </Tilt>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h3 className="text-3xl font-bold text-primary mb-6 font-heading">
                  <ColorChangeText text="A creative soul with a passion for life" />
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                  Hello! I'm Bliss, a multifaceted individual with a love for
                  creativity and expression. My journey has been shaped by my
                  diverse interests and the joy I find in exploring new
                  experiences.
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                  When I'm not immersed in my hobbies, you can find me spending
                  quality time with my adorable cat, Lucy. She's been my
                  faithful companion and a constant source of joy and
                  inspiration.
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  I believe in living authentically and finding beauty in the
                  everyday moments. Through this website, I hope to share a
                  glimpse of my world with you.
                </p>

                <motion.div
                  className="mt-8 flex flex-wrap gap-3"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {[
                    "Creative",
                    "Passionate",
                    "Authentic",
                    "Inspired",
                    "Curious",
                  ].map((trait, index) => (
                    <motion.span
                      key={trait}
                      className="px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 rounded-full text-sm"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: "rgb(var(--primary-light))",
                        color: "white",
                      }}
                    >
                      {trait}
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Hobbies Section with Interactive Stories */}
        <section id="hobbies" ref={hobbiesRef} className="py-24 relative">
          <div ref={hobbiesInViewRef} className="absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-b from-pink-50 to-pink-100/50 dark:from-pink-950/20 dark:to-gray-900/50 z-[-1]" />
          <div className="container mx-auto px-4">
            <SectionHeader title="My Hobbies" inView={hobbiesInView} />

            {/* Enhanced interactive hobby stories */}
            <HobbyStory />

            <div className="mt-20">
              <Tilt scale={1.02} perspective={1000}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden frost-panel"
                >
                  <div className="grid md:grid-cols-2 items-center">
                    <div className="p-8 md:p-12">
                      <h3 className="text-2xl font-bold text-primary mb-4 font-heading">
                        Meet Lucy
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-6">
                        Lucy is more than just a pet; she's my furry companion
                        who brings joy and laughter to my everyday life. This
                        adorable feline has a personality as unique as her
                        adorable whiskers.
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        From our morning routines to evening cuddles, Lucy has a
                        special way of making every moment memorable. Her
                        curious nature and affectionate purrs are constant
                        reminders of the simple joys in life.
                      </p>

                      <motion.div
                        className="mt-6 flex items-center gap-2"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        viewport={{ once: true }}
                      >
                        {[1, 2, 3, 4, 5].map((star) => (
                          <motion.div
                            key={star}
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            transition={{ delay: 0.1 * star }}
                            whileHover={{ scale: 1.2, rotate: 20 }}
                            viewport={{ once: true }}
                          >
                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          </motion.div>
                        ))}
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                          Lucy's Cuteness Rating
                        </span>
                      </motion.div>
                    </div>
                    <div className="relative h-80 md:h-full">
                      <Image
                        src={
                          imagesPreloaded
                            ? "/lucy.jpg"
                            : "/placeholder.svg?height=600&width=500"
                        }
                        fill
                        alt="Lucy the cat"
                        className="object-cover"
                      />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </div>
                </motion.div>
              </Tilt>
            </div>
          </div>
        </section>

        {/* Contact & Social Section with Animated Cards */}
        <section id="contact" ref={contactRef} className="py-24 relative">
          <div ref={contactInViewRef} className="absolute inset-0" />
          <div className="absolute inset-0 bg-white dark:bg-gray-900 z-[-1]" />
          <div className="container mx-auto px-4">
            <SectionHeader title="Connect With Me" inView={contactInView} />

            <div className="max-w-3xl mx-auto mt-16 text-center">
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-12">
                I'd love to connect with you! Feel free to reach out through any
                of my social platforms or drop me a message.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                <SocialLink
                  icon={<Instagram className="w-6 h-6" />}
                  platform="Instagram"
                  username="@bliss"
                  href="https://instagram.com/bliss"
                  color="#E1306C"
                />

                <SocialLink
                  icon={<Twitter className="w-6 h-6" />}
                  platform="Twitter"
                  username="@bliss"
                  href="https://twitter.com/bliss"
                  color="#1DA1F2"
                />

                <SocialLink
                  icon={<Linkedin className="w-6 h-6" />}
                  platform="LinkedIn"
                  username="Bliss"
                  href="https://linkedin.com/in/bliss"
                  color="#0077B5"
                />

                <SocialLink
                  icon={<Github className="w-6 h-6" />}
                  platform="GitHub"
                  username="bliss"
                  href="https://github.com/bliss"
                  color="#333"
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary-dark text-white rounded-full px-8 relative overflow-hidden group"
                >
                  <a href="mailto:hello@bliss.com">
                    <span className="relative z-10">Say Hello</span>
                    <motion.span
                      className="absolute inset-0 bg-primary-light/30"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 1 }}
                    />
                  </a>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Enhanced footer with animated background */}
      <footer className="bg-gradient-to-r from-primary to-accent text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
              <defs>
                <radialGradient
                  id="Gradient1"
                  cx="50%"
                  cy="50%"
                  fx="0.441602%"
                  fy="50%"
                  r=".5"
                >
                  <animate
                    attributeName="fx"
                    dur="34s"
                    values="0%;3%;0%"
                    repeatCount="indefinite"
                  ></animate>
                  <stop offset="0%" stopColor="rgba(255, 255, 255, 1)"></stop>
                  <stop offset="100%" stopColor="rgba(255, 255, 255, 0)"></stop>
                </radialGradient>
                <radialGradient
                  id="Gradient2"
                  cx="50%"
                  cy="50%"
                  fx="2.68147%"
                  fy="50%"
                  r=".5"
                >
                  <animate
                    attributeName="fx"
                    dur="23.5s"
                    values="0%;3%;0%"
                    repeatCount="indefinite"
                  ></animate>
                  <stop offset="0%" stopColor="rgba(255, 255, 255, 1)"></stop>
                  <stop offset="100%" stopColor="rgba(255, 255, 255, 0)"></stop>
                </radialGradient>
                <radialGradient
                  id="Gradient3"
                  cx="50%"
                  cy="50%"
                  fx="0.836536%"
                  fy="50%"
                  r=".5"
                >
                  <animate
                    attributeName="fx"
                    dur="21.5s"
                    values="0%;3%;0%"
                    repeatCount="indefinite"
                  ></animate>
                  <stop offset="0%" stopColor="rgba(255, 255, 255, 1)"></stop>
                  <stop offset="100%" stopColor="rgba(255, 255, 255, 0)"></stop>
                </radialGradient>
              </defs>
              <rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                fill="url(#Gradient1)"
              >
                <animate
                  attributeName="x"
                  dur="20s"
                  values="25%;0%;25%"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="y"
                  dur="21s"
                  values="0%;25%;0%"
                  repeatCount="indefinite"
                />
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 50 50"
                  to="360 50 50"
                  dur="17s"
                  repeatCount="indefinite"
                />
              </rect>
              <rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                fill="url(#Gradient2)"
              >
                <animate
                  attributeName="x"
                  dur="23s"
                  values="0%;-25%;0%"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="y"
                  dur="24s"
                  values="25%;-25%;25%"
                  repeatCount="indefinite"
                />
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 50 50"
                  to="360 50 50"
                  dur="18s"
                  repeatCount="indefinite"
                />
              </rect>
              <rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                fill="url(#Gradient3)"
              >
                <animate
                  attributeName="x"
                  dur="25s"
                  values="-25%;0%;-25%"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="y"
                  dur="26s"
                  values="0%;-25%;0%"
                  repeatCount="indefinite"
                />
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 50 50"
                  to="360 50 50"
                  dur="19s"
                  repeatCount="indefinite"
                />
              </rect>
            </svg>
          </div>
        </div>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-4">
            <p className="text-lg">
              Made with <Heart className="w-6 h-6 text-red-500" /> by Bliss
            </p>
            <p className="text-lg">© 2022 All rights reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
