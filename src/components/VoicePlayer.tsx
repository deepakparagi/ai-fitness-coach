"use client";
import { useState, useEffect } from "react";
import { Volume2, StopCircle, VolumeX } from "lucide-react";

interface Props {
  text: string;
  label: string;
}

export default function VoicePlayer({ text, label }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Check if Web Speech API is supported
    setIsSupported("speechSynthesis" in window);
  }, []);

  const handlePlay = () => {
    if (!isSupported) {
      alert("Text-to-speech is not supported in your browser.");
      return;
    }

    if (isPlaying) {
      // Stop speaking
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    // Start speaking
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1;
    utterance.volume = 1;

    // Try to use a good English voice
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(
      (voice) => voice.lang.startsWith("en") && voice.name.includes("Google")
    ) || voices.find((voice) => voice.lang.startsWith("en"));
    
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  // Load voices (needed for some browsers)
  useEffect(() => {
    if (isSupported) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, [isSupported]);

  if (!isSupported) {
    return (
      <button
        disabled
        className="flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400 font-medium cursor-not-allowed text-xs sm:text-sm"
      >
        <VolumeX className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="hidden xs:inline">Not Supported</span>
      </button>
    );
  }

  return (
    <button
      onClick={handlePlay}
      className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition text-xs sm:text-sm ${
        isPlaying
          ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
          : "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 hover:bg-violet-200 dark:hover:bg-violet-900/50"
      }`}
    >
      {isPlaying ? (
        <>
          <StopCircle className="w-3 h-3 sm:w-4 sm:h-4" />
          Stop
        </>
      ) : (
        <>
          <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden xs:inline">🔊</span> {label}
        </>
      )}
    </button>
  );
}
