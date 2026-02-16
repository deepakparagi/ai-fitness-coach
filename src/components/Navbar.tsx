"use client";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Dumbbell, Moon, Sun, Menu, X, Sparkles, History } from "lucide-react";
import { useState } from "react";

interface Props {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  onGetStarted?: () => void;
  onOpenHistory?: () => void;
}

export default function Navbar({ darkMode, setDarkMode, onGetStarted, onOpenHistory }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);

    // Detect active section based on scroll position
    const sections = ["home", "features", "how-it-works", "get-started"];
    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          setActiveSection(section);
          break;
        }
      }
    }
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/30 dark:border-gray-700/30 shadow-lg shadow-gray-200/20 dark:shadow-black/20"
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
            <motion.div
              className="p-2.5 gradient-bg rounded-xl shadow-lg shadow-orange-500/20 dark:shadow-orange-500/30"
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Dumbbell className="w-6 h-6 text-white" />
            </motion.div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">FitAI Coach</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 -mt-0.5">AI-Powered Fitness</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full p-1.5">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <motion.button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 font-medium rounded-full transition-all duration-300 ${isActive
                    ? "text-white bg-gradient-to-r from-orange-500 to-red-600 shadow-lg"
                    : "text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-white dark:hover:bg-gray-700 hover:shadow-md"
                    }`}
                >
                  {link.name}
                </motion.button>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
            >
              {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </motion.button>

            {onOpenHistory && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onOpenHistory}
                className="p-2.5 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
                title="View History"
              >
                <History className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </motion.button>
            )}

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (onGetStarted) onGetStarted();
                else scrollToSection("#get-started");
              }}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300"
            >
              <Sparkles className="w-4 h-4" />
              Start Free
            </motion.button>

            {/* Mobile menu button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="md:hidden p-2.5 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
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
                className="block w-full text-left px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-xl transition font-medium"
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
              className="w-full mt-2 flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-xl shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              Start Free
            </motion.button>

            {onOpenHistory && (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenHistory();
                }}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl"
              >
                <History className="w-4 h-4" />
                View History
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}
