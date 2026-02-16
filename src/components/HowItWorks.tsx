"use client";
import { motion } from "framer-motion";
import { UserCircle, Sparkles, Target, Trophy } from "lucide-react";

const steps = [
  {
    icon: UserCircle,
    title: "Tell Us About You",
    description: "Share your age, weight, fitness level, goals, and dietary preferences.",
  },
  {
    icon: Sparkles,
    title: "AI Creates Your Plan",
    description: "Our advanced AI analyzes your data and generates a personalized plan.",
  },
  {
    icon: Target,
    title: "Follow Your Routine",
    description: "Get daily workouts and meals tailored specifically for your goals.",
  },
  {
    icon: Trophy,
    title: "Achieve Your Goals",
    description: "Track progress and regenerate plans as you advance in your journey.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }}
          className="text-center mb-10 sm:mb-16 px-2"
        >
          <span className="text-violet-600 dark:text-violet-400 font-semibold text-xs sm:text-sm uppercase tracking-wider">How It Works</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-3 sm:mt-4 mb-4 sm:mb-6">
            Your Fitness Journey in <span className="gradient-text">4 Steps</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 -translate-y-1/2" />

          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                className="relative"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-center shadow-xl relative z-10">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 gradient-bg rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                    <step.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-6 h-6 sm:w-8 sm:h-8 gradient-bg rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg">
                    {i + 1}
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm md:text-base">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
