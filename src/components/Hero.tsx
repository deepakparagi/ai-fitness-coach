"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, ArrowRight, Zap, Trophy, Target } from "lucide-react";

interface Props {
  onGetStarted: () => void;
}

export default function Hero({ onGetStarted }: Props) {
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);
  const backgroundScale = useTransform(scrollY, [0, 500], [1, 1.2]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const titleText = "Transform Your Body with AI Precision";
  const words = titleText.split(" ");

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Premium gradient background with parallax */}
      <motion.div
        style={{ y: backgroundY, scale: backgroundScale }}
        className="absolute inset-0 -z-10 bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-900 dark:to-orange-950"
      />

      {/* Optional: Add animated mesh gradient for more depth */}
      <div className="absolute inset-0 -z-10 opacity-30 dark:opacity-20">
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-orange-300 dark:bg-orange-600 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-red-300 dark:bg-red-800 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 text-sm font-medium mb-8 border border-orange-200 dark:border-orange-700"
          >
            <Sparkles className="w-4 h-4" />
            AI-Powered Fitness Revolution
          </motion.div>

          {/* Main heading with split-text animation */}
          <motion.h1
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 px-2 tracking-tight leading-[1.1]"
          >
            {words.map((word, i) => (
              <span key={i} className="inline-block overflow-hidden mr-[0.2em] last:mr-0">
                <motion.span
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.2 + i * 0.1,
                    ease: [0.32, 0.72, 0, 1]
                  }}
                  className={`inline-block ${word === "AI" || word === "Precision" ? "bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent" : ""}`}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
            className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8 sm:mb-10 px-4 leading-relaxed"
          >
            Get personalized workout routines and diet plans crafted by advanced AI,
            tailored to your unique goals, fitness level, and lifestyle.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(249, 115, 22, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              onClick={onGetStarted}
              className="group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300 flex items-center gap-2 text-sm sm:text-base"
            >
              Get Your Free Plan
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, borderColor: "rgba(249, 115, 22, 0.5)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl sm:rounded-2xl border-2 border-gray-300 dark:border-gray-700 transition-all duration-300 flex items-center gap-2 text-sm sm:text-base backdrop-blur-sm"
            >
              Learn More
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 sm:mt-16 flex flex-wrap items-center justify-center gap-6 sm:gap-10"
          >
            {[
              { icon: Zap, label: "Instant Plans", value: "< 30s" },
              { icon: Target, label: "Personalized", value: "100%" },
              { icon: Trophy, label: "Success Rate", value: "95%" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1, duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 shadow-sm"
              >
                <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-lg sm:text-xl font-bold gradient-text">{stat.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 rounded-full border-2 border-orange-400/50 dark:border-orange-600/50 flex items-start justify-center p-2 backdrop-blur-sm"
        >
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-1.5 h-3 bg-orange-500 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
