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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-violet-600 dark:text-violet-400 font-semibold text-sm uppercase tracking-wider">How It Works</span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-6">
            Your Fitness Journey in <span className="gradient-text">4 Steps</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative"
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-xl relative z-10">
                  <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 gradient-bg rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {i + 1}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
