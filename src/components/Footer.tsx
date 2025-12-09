"use client";
import { Dumbbell, Github, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="p-2 gradient-bg rounded-xl">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">FitAI Coach</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <a href="#features" className="hover:text-violet-400 transition">Features</a>
            <a href="#how-it-works" className="hover:text-violet-400 transition">How It Works</a>
            <a href="#get-started" className="hover:text-violet-400 transition">Get Started</a>
          </div>

          {/* Social */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-violet-600 flex items-center justify-center transition"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p className="flex items-center justify-center gap-1">
            Built with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> using Next.js & AI
          </p>
          <p className="mt-2 text-gray-500">© 2025 FitAI Coach. A demo project.</p>
        </div>
      </div>
    </footer>
  );
}
