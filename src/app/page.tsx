"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import UserForm from "@/components/UserForm";
import PlanDisplay from "@/components/PlanDisplay";
import PlanHistory, { HistoryItem } from "@/components/PlanHistory";
import Footer from "@/components/Footer";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { UserProfile, FitnessPlan } from "@/lib/types";

// Zoom match cut transition variants
const zoomMatchCut = {
  initial: { scale: 0.9, opacity: 0, filter: "blur(20px)" },
  animate: { scale: 1, opacity: 1, filter: "blur(0px)" },
  exit: { scale: 1.1, opacity: 0, filter: "blur(20px)" },
};

// Shape morph transition
const shapeMorph = {
  initial: { clipPath: "circle(0% at 50% 50%)", opacity: 0 },
  animate: { clipPath: "circle(100% at 50% 50%)", opacity: 1 },
  exit: { clipPath: "circle(0% at 50% 50%)", opacity: 0 },
};

// Swipe transition
const swipeUp = {
  initial: { y: 60, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -60, opacity: 0 },
};

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [planHistory, setPlanHistory, isHistoryLoaded] = useLocalStorage<HistoryItem[]>("fitnessPlanHistory", []);
  const [savedProfile, setSavedProfile, isProfileLoaded] = useLocalStorage<UserProfile | null>("userProfile", null);
  const [plan, setPlan] = useState<FitnessPlan | null>(null);
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (isHistoryLoaded && planHistory.length > 0 && !plan) {
      // Optional: Load most recent plan or just stay on home
      // setPlan(planHistory[0].plan);
      // setShowForm(true);
    }
  }, [isHistoryLoaded, planHistory, plan]);

  useEffect(() => {
    if (isProfileLoaded && savedProfile) {
      setCurrentProfile(savedProfile);
    }
  }, [isProfileLoaded, savedProfile]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const generatePlan = async (profile: UserProfile) => {
    setIsLoading(true);
    setCurrentProfile(profile);
    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPlan(data);

      const newHistoryItem: HistoryItem = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        plan: data,
        profile: profile
      };

      setPlanHistory([newHistoryItem, ...planHistory]);
      setSavedProfile(profile);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to generate plan. Please check your API key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    const profile = currentProfile || savedProfile;
    if (profile) {
      generatePlan(profile);
    } else {
      alert("No profile found. Please create a new plan.");
    }
  };

  const handleBack = () => {
    setPlan(null);
  };

  const handleGetStarted = () => {
    setShowForm(true);
    setTimeout(() => {
      document.getElementById("get-started")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <main className="min-h-screen overflow-hidden">
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onGetStarted={handleGetStarted}
        onOpenHistory={() => setShowHistory(true)}
      />

      <PlanHistory
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        history={planHistory}
        onSelect={(item) => {
          setPlan(item.plan);
          setCurrentProfile(item.profile);
          setShowHistory(false);
        }}
        onDelete={(id) => {
          setPlanHistory(planHistory.filter(item => item.id !== id));
          if (plan?.workoutPlan === planHistory.find(i => i.id === id)?.plan.workoutPlan) {
            setPlan(null);
          }
        }}
      />

      <AnimatePresence mode="wait">
        {plan ? (
          <motion.div
            key="plan"
            variants={shapeMorph}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          >
            <PlanDisplay plan={plan} profile={currentProfile || savedProfile} onRegenerate={handleRegenerate} onBack={handleBack} isLoading={isLoading} />
          </motion.div>
        ) : (
          <motion.div
            key="home"
            variants={zoomMatchCut}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
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
                  transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
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
