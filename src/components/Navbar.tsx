"use client";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Dumbbell, Moon, Sun, Menu, X, Sparkles } from "lucide-react";
import { useState } from "react";

interface Props {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  onGetStarted?: () => void;
}

export default function Navbar({ darkMode, setDarkMode, onGetStarted }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Get Started", href: "#get-started" },
  ];

  const scrollToSection = (href: string) => {
    setMobileMenuOpen(false);
    if (href === "#home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const element = document.querySelector(href);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - offset, behavior: "smooth" });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "glass border-b border-gray-200/20 dark:border-gray-700/30 shadow-lg" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onClick={() => scrollToSection("#home")}
          >
            <div className="p-2.5 gradient-bg rounded-xl shadow-lg shadow-violet-500/25">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold gradient-text">FitAI Coach</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 -mt-0.5">AI-Powered Fitness</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <motion.button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition font-medium rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/20"
              >
                {link.name}
              </motion.button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </motion.button>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (onGetStarted) onGetStarted();
                else scrollToSection("#get-started");
              }}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 gradient-bg text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-xl transition"
            >
              <Sparkles className="w-4 h-4" />
              Start Free
            </motion.button>

            {/* Mobile menu button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="md:hidden p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile menu */}
        <motion.div
          initial={false}
          animate={mobileMenuOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-2 border-t border-gray-200/20">
            {navLinks.map((link) => (
              <motion.button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                whileTap={{ scale: 0.98 }}
                className="block w-full text-left px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-xl transition font-medium"
              >
                {link.name}
              </motion.button>
            ))}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setMobileMenuOpen(false);
                if (onGetStarted) onGetStarted();
                else scrollToSection("#get-started");
              }}
              className="w-full mt-2 flex items-center justify-center gap-2 px-5 py-3 gradient-bg text-white font-semibold rounded-xl shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              Start Free
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}
