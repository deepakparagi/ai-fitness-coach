import jsPDF from "jspdf";
import { FitnessPlan, UserProfile } from "@/lib/types";

export const generatePDF = (plan: FitnessPlan, profile: UserProfile | null) => {
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
        doc.setFillColor(color[0], color[1] as number, color[2] as number);
        doc.roundedRect(margin, y, 5, 35, 1, 1, "F");

        doc.setFillColor(249, 250, 251);
        doc.roundedRect(margin + 5, y, contentWidth - 5, 35, 0, 2, "F");

        doc.setTextColor(color[0], color[1] as number, color[2] as number);
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

    // ===== PAGE 4: Tips & Grocery =====
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

    // Grocery List (New)
    if (plan.groceryList && plan.groceryList.length > 0) {
        y += 10;
        if (y > pageHeight - 60) {
            doc.addPage();
            y = 30;
        }

        doc.setFillColor(249, 115, 22); // Orange for grocery
        doc.roundedRect(margin, y, contentWidth, 10, 2, 2, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("🛒 Grocery List", margin + 5, y + 7);
        y += 15;

        doc.setTextColor(55, 65, 81);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");

        plan.groceryList.forEach((item) => {
            if (y > pageHeight - 20) {
                doc.addPage();
                y = 20;
            }
            doc.text(`• ${item}`, margin + 5, y);
            y += 6;
        });
    }

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
