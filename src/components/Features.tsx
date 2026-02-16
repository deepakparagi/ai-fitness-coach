"use client";
import { motion } from "framer-motion";
import { Brain, Dumbbell, Utensils, Volume2, Image, FileText, Zap, Heart } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Plans",
    description: "Advanced AI analyzes your profile to create perfectly tailored workout and diet plans.",
    color: "from-violet-500 to-purple-500",
  },
  {
    icon: Dumbbell,
    title: "Custom Workouts",
    description: "7-day workout routines with exercises, sets, reps, and rest times for your fitness level.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Utensils,
    title: "Personalized Nutrition",
    description: "Meal plans matching your dietary preferences - veg, non-veg, vegan, or keto.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Volume2,
    title: "Voice Guidance",
    description: "Listen to your plans with AI-powered text-to-speech for hands-free workouts.",
    color: "from-orange-500 to-amber-500",
  },
  {
    icon: Image,
    title: "Visual Exercises",
    description: "AI-generated images for each exercise and meal to guide you perfectly.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: FileText,
    title: "PDF Export",
    description: "Download your complete fitness plan as a beautifully formatted PDF.",
    color: "from-indigo-500 to-blue-500",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "Get your personalized plan in seconds, not hours or days.",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Heart,
    title: "Health Aware",
    description: "Plans consider your medical history and stress levels for safe training.",
    color: "from-red-500 to-pink-500",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }}
          className="text-center mb-10 sm:mb-16 px-2"
        >
          <span className="text-violet-600 dark:text-violet-400 font-semibold text-xs sm:text-sm uppercase tracking-wider">Features</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-3 sm:mt-4 mb-4 sm:mb-6">
            Everything You Need to <span className="gradient-text">Succeed</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Our AI fitness coach comes packed with powerful features to help you achieve your fitness goals faster.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.05, duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative glass-card-hover rounded-xl sm:rounded-2xl p-4 sm:p-6 overflow-hidden"
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

              {/* Icon with animated background */}
              <motion.div
                className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3 sm:mb-4 shadow-lg`}
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                {/* Glow effect */}
                <div className={`absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-br ${feature.color} blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-300`} />
              </motion.div>

              <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 group-hover:gradient-text transition-all duration-300">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm leading-relaxed">{feature.description}</p>

              {/* Bottom accent line */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
