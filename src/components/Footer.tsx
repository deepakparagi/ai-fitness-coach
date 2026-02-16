"use client";
import { Dumbbell, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 sm:gap-6 md:flex-row md:justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-orange-600 via-red-600 to-orange-700 rounded-lg sm:rounded-xl">
              <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-base sm:text-lg font-bold text-white">FitAI Coach</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm">
            <a href="#features" className="hover:text-orange-400 transition">Features</a>
            <a href="#how-it-works" className="hover:text-orange-400 transition">How It Works</a>
            <a href="#get-started" className="hover:text-orange-400 transition">Get Started</a>
          </div>

          {/* Social */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gray-800 hover:bg-orange-600 flex items-center justify-center transition"
          >
            <Github className="w-4 h-4 sm:w-5 sm:h-5" />
          </a>
        </div>

        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm">
          <p className="text-gray-500">
            Designed & Engineered by{" "}
            <a
              href="https://github.com/deepakparagi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 hover:text-orange-300 font-semibold transition"
            >
              Deepak Paragi
            </a>
          </p>
          <p className="mt-2 text-gray-500">© 2026 FitAI Coach. All rights reserved. | Powered by Next.js & OpenRouter AI</p>
        </div>
      </div>
    </footer>
  );
}
