"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FitnessPlan, UserProfile } from "@/lib/types";
import { Download, RefreshCw, Dumbbell, Utensils, Lightbulb, Sparkles, ChevronDown, ChevronUp, Clock, Flame } from "lucide-react";
import VoicePlayer from "./VoicePlayer";
import ImageModal from "./ImageModal";
import jsPDF from "jspdf";

interface Props {
  plan: FitnessPlan;
  profile: UserProfile | null;
  onRegenerate: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export default function PlanDisplay({ plan, profile, onRegenerate, onBack, isLoading = false }: Props) {
  const [activeTab, setActiveTab] = useState<"workout" | "diet">("workout");
  const [expandedDay, setExpandedDay] = useState<number | null>(0);

  const workoutText = plan.workoutPlan
    .map((day) => `${day.day}: ${day.focus}. ${day.exercises.map((e) => `${e.name}, ${e.sets} sets of ${e.reps}`).join(". ")}`)
    .join(". ");

  const dietText = `Breakfast: ${plan.dietPlan.breakfast.name}. Lunch: ${plan.dietPlan.lunch.name}. Dinner: ${plan.dietPlan.dinner.name}. Snacks: ${plan.dietPlan.snacks.map((s) => s.name).join(", ")}.`;

  // BMI calculations
  const calculateBMI = (weight: number, height: number) => {
    return weight / Math.pow(height / 100, 2);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: "Underweight", color: [59, 130, 246] };
    if (bmi < 25) return { label: "Normal", color: [34, 197, 94] };
    if (bmi < 30) return { label: "Overweight", color: [234, 179, 8] };
    return { label: "Obese", color: [239, 68, 68] };
  };

  const getIdealWeightRange = (height: number) => {
    const heightM = height / 100;
    const minWeight = Math.round(18.5 * heightM * heightM);
    const maxWeight = Math.round(24.9 * heightM * heightM);
    return { min: minWeight, max: maxWeight };
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    
    // Helper functions
    const drawLine = (y: number, color = [200, 200, 200]) => {
      doc.setDrawColor(color[0], color[1], color[2]);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
    };

    const drawSectionHeader = (title: string, y: number) => {
      doc.setFillColor(139, 92, 246);
      doc.roundedRect(margin, y, contentWidth, 10, 2, 2, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(title, margin + 5, y + 7);
      return y + 15;
    };

    // ===== PAGE 1: Cover & Profile =====
    // Header gradient effect (simulated with rectangles)
    doc.setFillColor(139, 92, 246);
    doc.rect(0, 0, pageWidth, 50, "F");
    doc.setFillColor(99, 102, 241);
    doc.rect(0, 50, pageWidth, 10, "F");
    
    // Logo/Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("FitAI Coach", pageWidth / 2, 30, { align: "center" });
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Your Personalized Fitness Plan", pageWidth / 2, 42, { align: "center" });

    let y = 75;

    // User Profile Section
    if (profile) {
      y = drawSectionHeader("Your Profile", y);
      
      const bmi = calculateBMI(profile.weight, profile.height);
      const bmiCategory = getBMICategory(bmi);
      const idealWeight = getIdealWeightRange(profile.height);

      // Profile info in two columns
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      
      const col1X = margin + 5;
      const col2X = pageWidth / 2 + 10;
      
      const profileData = [
        [`Name: ${profile.name}`, `Age: ${profile.age} years`],
        [`Height: ${profile.height} cm`, `Weight: ${profile.weight} kg`],
        [`Goal: ${profile.fitnessGoal.replace("_", " ").toUpperCase()}`, `Level: ${profile.fitnessLevel.toUpperCase()}`],
        [`Location: ${profile.workoutLocation.toUpperCase()}`, `Diet: ${profile.dietaryPreference.replace("_", " ").toUpperCase()}`],
      ];

      profileData.forEach((row) => {
        doc.text(row[0], col1X, y);
        doc.text(row[1], col2X, y);
        y += 7;
      });

      y += 10;

      // BMI Section with visual chart
      y = drawSectionHeader("BMI Analysis", y);
      
      // BMI Value display
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(bmiCategory.color[0], bmiCategory.color[1], bmiCategory.color[2]);
      doc.text(`Your BMI: ${bmi.toFixed(1)} (${bmiCategory.label})`, margin + 5, y + 5);
      y += 15;

      // BMI Chart
      const chartX = margin + 5;
      const chartWidth = contentWidth - 10;
      const chartHeight = 15;
      
      // Background segments
      const segments = [
        { width: 0.185, color: [59, 130, 246], label: "Underweight" },
        { width: 0.315, color: [34, 197, 94], label: "Normal" },
        { width: 0.25, color: [234, 179, 8], label: "Overweight" },
        { width: 0.25, color: [239, 68, 68], label: "Obese" },
      ];

      let segX = chartX;
      segments.forEach((seg) => {
        const segWidth = chartWidth * seg.width;
        doc.setFillColor(seg.color[0], seg.color[1], seg.color[2]);
        doc.roundedRect(segX, y, segWidth, chartHeight, 2, 2, "F");
        segX += segWidth;
      });

      // BMI marker
      const bmiPosition = Math.min(Math.max((bmi - 15) / 25, 0), 1);
      const markerX = chartX + chartWidth * bmiPosition;
      doc.setFillColor(0, 0, 0);
      doc.triangle(markerX, y - 3, markerX - 4, y - 8, markerX + 4, y - 8, "F");
      
      // Labels under chart
      y += chartHeight + 5;
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text("< 18.5", chartX, y);
      doc.text("18.5 - 24.9", chartX + chartWidth * 0.25, y);
      doc.text("25 - 29.9", chartX + chartWidth * 0.55, y);
      doc.text("30+", chartX + chartWidth * 0.85, y);

      y += 15;

      // Ideal Weight Recommendation
      doc.setFillColor(240, 253, 244);
      doc.roundedRect(margin, y, contentWidth, 25, 3, 3, "F");
      doc.setDrawColor(34, 197, 94);
      doc.setLineWidth(1);
      doc.roundedRect(margin, y, contentWidth, 25, 3, 3, "S");
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(22, 163, 74);
      doc.text("Recommended Weight Range", margin + 5, y + 8);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      doc.text(`For your height (${profile.height} cm), your ideal weight is ${idealWeight.min} - ${idealWeight.max} kg`, margin + 5, y + 18);
      
      y += 35;

      // Weight difference info
      const weightDiff = profile.weight - idealWeight.max;
      if (weightDiff > 0) {
        doc.setFillColor(254, 243, 199);
        doc.roundedRect(margin, y, contentWidth, 15, 3, 3, "F");
        doc.setTextColor(161, 98, 7);
        doc.setFontSize(10);
        doc.text(`💡 To reach normal BMI, consider losing approximately ${weightDiff.toFixed(1)} kg`, margin + 5, y + 10);
        y += 20;
      } else if (profile.weight < idealWeight.min) {
        const gainNeeded = idealWeight.min - profile.weight;
        doc.setFillColor(219, 234, 254);
        doc.roundedRect(margin, y, contentWidth, 15, 3, 3, "F");
        doc.setTextColor(30, 64, 175);
        doc.setFontSize(10);
        doc.text(`💡 To reach normal BMI, consider gaining approximately ${gainNeeded.toFixed(1)} kg`, margin + 5, y + 10);
        y += 20;
      }
    }

    // Motivation Quote
    y += 5;
    doc.setFillColor(245, 243, 255);
    doc.roundedRect(margin, y, contentWidth, 20, 3, 3, "F");
    doc.setTextColor(109, 40, 217);
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    const motivationLines = doc.splitTextToSize(`"${plan.motivation}"`, contentWidth - 10);
    doc.text(motivationLines, margin + 5, y + 8);

    // ===== PAGE 2: Workout Plan =====
    doc.addPage();
    
    // Header
    doc.setFillColor(139, 92, 246);
    doc.rect(0, 0, pageWidth, 25, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("7-Day Workout Plan", pageWidth / 2, 16, { align: "center" });

    y = 35;

    plan.workoutPlan.forEach((day, dayIndex) => {
      if (y > pageHeight - 50) {
        doc.addPage();
        doc.setFillColor(139, 92, 246);
        doc.rect(0, 0, pageWidth, 25, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("7-Day Workout Plan (continued)", pageWidth / 2, 16, { align: "center" });
        y = 35;
      }

      // Day header
      doc.setFillColor(249, 250, 251);
      doc.roundedRect(margin, y, contentWidth, 12, 2, 2, "F");
      doc.setTextColor(139, 92, 246);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(`${day.day}`, margin + 5, y + 8);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");
      doc.text(`- ${day.focus}`, margin + 35, y + 8);
      y += 16;

      // Exercises table header
      doc.setFillColor(243, 244, 246);
      doc.rect(margin, y, contentWidth, 8, "F");
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(75, 85, 99);
      doc.text("Exercise", margin + 3, y + 5.5);
      doc.text("Sets", margin + 85, y + 5.5);
      doc.text("Reps", margin + 105, y + 5.5);
      doc.text("Rest", margin + 130, y + 5.5);
      y += 10;

      // Exercises
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      day.exercises.forEach((ex, i) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        
        const bgColor = i % 2 === 0 ? [255, 255, 255] : [249, 250, 251];
        doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
        doc.rect(margin, y - 3, contentWidth, 8, "F");
        
        doc.setTextColor(55, 65, 81);
        const exName = ex.name.length > 35 ? ex.name.substring(0, 32) + "..." : ex.name;
        doc.text(exName, margin + 3, y + 2);
        doc.text(String(ex.sets), margin + 85, y + 2);
        doc.text(ex.reps, margin + 105, y + 2);
        doc.text(ex.restTime, margin + 130, y + 2);
        y += 8;
      });

      y += 8;
    });

    // ===== PAGE 3: Diet Plan =====
    doc.addPage();
    
    // Header
    doc.setFillColor(34, 197, 94);
    doc.rect(0, 0, pageWidth, 25, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Daily Nutrition Plan", pageWidth / 2, 16, { align: "center" });

    y = 40;

    const meals = [
      { label: "🌅 Breakfast", meal: plan.dietPlan.breakfast, color: [251, 146, 60] },
      { label: "☀️ Lunch", meal: plan.dietPlan.lunch, color: [34, 197, 94] },
      { label: "🌙 Dinner", meal: plan.dietPlan.dinner, color: [99, 102, 241] },
    ];

    meals.forEach(({ label, meal, color }) => {
      // Meal card
      doc.setFillColor(color[0], color[1], color[2]);
      doc.roundedRect(margin, y, 5, 35, 1, 1, "F");
      
      doc.setFillColor(249, 250, 251);
      doc.roundedRect(margin + 5, y, contentWidth - 5, 35, 0, 2, "F");
      
      doc.setTextColor(color[0], color[1], color[2]);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(label, margin + 10, y + 10);
      
      doc.setTextColor(31, 41, 55);
      doc.setFontSize(11);
      doc.text(meal.name, margin + 10, y + 20);
      
      doc.setTextColor(107, 114, 128);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      const descLines = doc.splitTextToSize(meal.description, contentWidth - 70);
      doc.text(descLines[0] || "", margin + 10, y + 28);
      
      if (meal.calories) {
        doc.setTextColor(139, 92, 246);
        doc.setFont("helvetica", "bold");
        doc.text(`${meal.calories} cal`, pageWidth - margin - 25, y + 20);
      }
      
      y += 45;
    });

    // Snacks section
    y += 5;
    doc.setFillColor(254, 243, 199);
    doc.roundedRect(margin, y, contentWidth, 30, 3, 3, "F");
    doc.setTextColor(161, 98, 7);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("🍎 Healthy Snacks", margin + 5, y + 10);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(75, 85, 99);
    const snackText = plan.dietPlan.snacks.map(s => `${s.name}${s.calories ? ` (${s.calories} cal)` : ""}`).join(" • ");
    const snackLines = doc.splitTextToSize(snackText, contentWidth - 10);
    doc.text(snackLines, margin + 5, y + 20);

    // ===== PAGE 4: Tips =====
    y += 50;
    if (y > pageHeight - 80) {
      doc.addPage();
      y = 30;
    }

    doc.setFillColor(234, 179, 8);
    doc.roundedRect(margin, y, contentWidth, 10, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("💡 Pro Tips for Success", margin + 5, y + 7);
    y += 15;

    plan.tips.forEach((tip, i) => {
      if (y > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }
      
      doc.setFillColor(139, 92, 246);
      doc.circle(margin + 5, y + 2, 3, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.text(String(i + 1), margin + 3.5, y + 4);
      
      doc.setTextColor(55, 65, 81);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const tipLines = doc.splitTextToSize(tip, contentWidth - 20);
      doc.text(tipLines, margin + 15, y + 4);
      y += tipLines.length * 5 + 8;
    });

    // Footer on last page
    y = pageHeight - 15;
    drawLine(y - 5, [139, 92, 246]);
    doc.setTextColor(139, 92, 246);
    doc.setFontSize(8);
    doc.text("Generated by FitAI Coach • Your AI-Powered Fitness Partner", pageWidth / 2, y, { align: "center" });
    doc.setTextColor(150, 150, 150);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, y + 5, { align: "center" });

    doc.save(`FitAI-Plan-${profile?.name || "User"}.pdf`);
  };

  return (
    <section className="py-24 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8 sm:mb-12 px-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 gradient-bg rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-2xl"
          >
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
          </motion.div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            🎉 Your Plan is Ready!
          </h1>
          <div className="max-w-2xl mx-auto mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 rounded-xl sm:rounded-2xl border border-violet-200 dark:border-violet-800">
            <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 italic">
              &quot;{plan.motivation}&quot;
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onBack}
              className="px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-gray-100 dark:bg-gray-800 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition text-sm sm:text-base">
              ← New Plan
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }} 
              onClick={onRegenerate}
              disabled={isLoading}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-gray-100 dark:bg-gray-800 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed">
              <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${isLoading ? 'animate-spin' : ''}`} /> 
              <span className="hidden xs:inline">{isLoading ? 'Regenerating...' : 'Regenerate'}</span>
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={exportPDF}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl gradient-bg text-white font-medium shadow-lg transition text-sm sm:text-base">
              <Download className="w-3 h-3 sm:w-4 sm:h-4" /> <span className="hidden xs:inline">Export</span> PDF
            </motion.button>
            <VoicePlayer text={workoutText} label="Workout" />
            <VoicePlayer text={dietText} label="Diet" />
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-6 sm:mb-8 px-2">
          <div className="inline-flex p-1 sm:p-1.5 rounded-xl sm:rounded-2xl bg-gray-100 dark:bg-gray-800 w-full sm:w-auto">
            {[
              { id: "workout", label: "Workout", fullLabel: "Workout Plan", icon: Dumbbell },
              { id: "diet", label: "Diet", fullLabel: "Diet Plan", icon: Utensils },
            ].map((tab) => (
              <motion.button key={tab.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id as "workout" | "diet")}
                className={`flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition flex-1 sm:flex-none text-sm sm:text-base ${
                  activeTab === tab.id ? "gradient-bg text-white shadow-lg" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}>
                <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="sm:hidden">{tab.label}</span>
                <span className="hidden sm:inline">{tab.fullLabel}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content with swipe transitions */}
        <AnimatePresence mode="wait">
          {activeTab === "workout" && (
            <motion.div 
              key="workout" 
              initial={{ x: -100, opacity: 0, scale: 0.95 }} 
              animate={{ x: 0, opacity: 1, scale: 1 }} 
              exit={{ x: 100, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="space-y-4">
              {plan.workoutPlan.map((day, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="glass-card rounded-xl sm:rounded-2xl overflow-hidden">
                  <button onClick={() => setExpandedDay(expandedDay === i ? null : i)}
                    className="w-full p-3 sm:p-4 md:p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 gradient-bg rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <span className="text-white font-bold text-xs sm:text-sm md:text-base">{day.day.slice(0, 3)}</span>
                      </div>
                      <div className="text-left">
                        <h3 className="text-base sm:text-lg md:text-xl font-bold">{day.day}</h3>
                        <p className="text-violet-600 dark:text-violet-400 font-medium text-xs sm:text-sm md:text-base">{day.focus}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                      <span className="text-xs sm:text-sm text-gray-500 hidden sm:block">{day.exercises.length} exercises</span>
                      {expandedDay === i ? <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" /> : <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </div>
                  </button>
                  <AnimatePresence>
                    {expandedDay === i && (
                      <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                        <div className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6 space-y-2 sm:space-y-3">
                          {day.exercises.map((ex, j) => (
                            <div key={j} className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg sm:rounded-xl">
                              <div className="flex items-start justify-between gap-2 sm:gap-4">
                                <div className="flex items-start gap-2 sm:gap-4 flex-1 min-w-0">
                                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                    <span className="text-white font-bold text-sm sm:text-base md:text-lg">{j + 1}</span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm sm:text-base md:text-lg truncate">{ex.name}</p>
                                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 md:gap-3 mt-1">
                                      <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full text-xs sm:text-sm font-medium">
                                        <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3" />{ex.sets}×{ex.reps}
                                      </span>
                                      <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs sm:text-sm font-medium">
                                        <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />{ex.restTime}
                                      </span>
                                    </div>
                                    {ex.notes && (
                                      <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
                                        💡 {ex.notes}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <ImageModal itemName={ex.name} type="exercise" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === "diet" && (
            <motion.div 
              key="diet" 
              initial={{ x: 100, opacity: 0, scale: 0.95 }} 
              animate={{ x: 0, opacity: 1, scale: 1 }} 
              exit={{ x: -100, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="space-y-4 sm:space-y-6">
              {/* Main meals */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                {[
                  { label: "Breakfast", meal: plan.dietPlan.breakfast, emoji: "🌅", color: "from-orange-500 to-amber-500" },
                  { label: "Lunch", meal: plan.dietPlan.lunch, emoji: "☀️", color: "from-green-500 to-emerald-500" },
                  { label: "Dinner", meal: plan.dietPlan.dinner, emoji: "🌙", color: "from-indigo-500 to-purple-500" },
                ].map(({ label, meal, emoji, color }, i) => (
                  <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-xl transition">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-xl sm:text-2xl mb-3 sm:mb-4 shadow-lg`}>
                      {emoji}
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold mt-1 mb-2">{meal.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{meal.description}</p>
                    <div className="flex items-center justify-between">
                      {meal.calories && (
                        <span className="text-xs sm:text-sm font-semibold text-violet-600 dark:text-violet-400">
                          <Flame className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />{meal.calories} cal
                        </span>
                      )}
                      <ImageModal itemName={meal.name} type="meal" />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Snacks */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">🍎</span> Healthy Snacks
                </h3>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {plan.dietPlan.snacks.map((snack, i) => (
                    <div key={i} className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                      <span className="font-medium text-xs sm:text-sm">{snack.name}</span>
                      {snack.calories && <span className="text-xs text-gray-500 hidden xs:inline">({snack.calories} cal)</span>}
                      <ImageModal itemName={snack.name} type="meal" />
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tips section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="mt-8 sm:mt-12 glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg sm:rounded-xl flex items-center justify-center">
              <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
            </div>
            Pro Tips for Success
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {plan.tips.map((tip, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + i * 0.1 }}
                className="p-3 sm:p-4 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 rounded-lg sm:rounded-xl">
                <div className="flex items-start gap-2 sm:gap-3">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 gradient-bg rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm md:text-base">{tip}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
