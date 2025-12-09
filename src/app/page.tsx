"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import UserForm from "@/components/UserForm";
import PlanDisplay from "@/components/PlanDisplay";
import Footer from "@/components/Footer";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { UserProfile, FitnessPlan } from "@/lib/types";

// Zoom match cut transition variants
const zoomMatchCut = {
  initial: { scale: 0.9, opacity: 0, filter: "blur(10px)" },
  animate: { scale: 1, opacity: 1, filter: "blur(0px)" },
  exit: { scale: 1.1, opacity: 0, filter: "blur(10px)" },
};

// Shape morph transition
const shapeMorph = {
  initial: { clipPath: "circle(0% at 50% 50%)", opacity: 0 },
  animate: { clipPath: "circle(100% at 50% 50%)", opacity: 1 },
  exit: { clipPath: "circle(0% at 50% 50%)", opacity: 0 },
};

// Swipe transition
const swipeUp = {
  initial: { y: 100, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -100, opacity: 0 },
};

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [savedPlan, setSavedPlan, isLoaded] = useLocalStorage<FitnessPlan | null>("fitnessPlan", null);
  const [savedProfile, setSavedProfile] = useLocalStorage<UserProfile | null>("userProfile", null);
  const [plan, setPlan] = useState<FitnessPlan | null>(null);

  useEffect(() => {
    if (isLoaded && savedPlan) {
      setPlan(savedPlan);
      setShowForm(true);
    }
  }, [isLoaded, savedPlan]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const generatePlan = async (profile: UserProfile) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPlan(data);
      setSavedPlan(data);
      setSavedProfile(profile);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to generate plan. Please check your API key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (savedProfile) generatePlan(savedProfile);
  };

  const handleBack = () => {
    setPlan(null);
    setSavedPlan(null);
  };

  const handleGetStarted = () => {
    setShowForm(true);
    setTimeout(() => {
      document.getElementById("get-started")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <main className="min-h-screen overflow-hidden">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} onGetStarted={handleGetStarted} />

      <AnimatePresence mode="wait">
        {plan ? (
          <motion.div
            key="plan"
            variants={shapeMorph}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <PlanDisplay plan={plan} onRegenerate={handleRegenerate} onBack={handleBack} />
          </motion.div>
        ) : (
          <motion.div
            key="home"
            variants={zoomMatchCut}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <Hero onGetStarted={handleGetStarted} />
            <Features />
            <HowItWorks />
            <AnimatePresence>
              {showForm && (
                <motion.div
                  variants={swipeUp}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                >
                  <UserForm onSubmit={generatePlan} isLoading={isLoading} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
