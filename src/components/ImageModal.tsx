"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, ImageIcon, RefreshCw } from "lucide-react";

interface Props {
  itemName: string;
  type: "exercise" | "meal";
}

export default function ImageModal({ itemName, type }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState(false);

  const generateImage = async () => {
    setIsOpen(true);
    setIsLoading(true);
    setImageLoaded(false);
    setError(false);

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: itemName, type }),
      });
      const data = await res.json();
      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Image generation error:", err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const regenerate = () => {
    setImageUrl(null);
    setImageLoaded(false);
    generateImage();
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={generateImage}
        className="p-2 hover:bg-violet-100 dark:hover:bg-violet-900/30 rounded-lg transition"
        title="View AI generated image"
      >
        <ImageIcon className="w-5 h-5 text-violet-500" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotateX: 15, y: 50 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotateX: -15, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-w-2xl w-full shadow-2xl mx-2"
            >
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg md:text-xl font-bold truncate pr-2">{itemName}</h3>
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={regenerate}
                    className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg sm:rounded-xl transition"
                    title="Regenerate image"
                  >
                    <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg sm:rounded-xl transition"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                </div>
              </div>

              <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-700 rounded-xl sm:rounded-2xl flex items-center justify-center overflow-hidden relative">
                {(isLoading || !imageLoaded) && !error && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 sm:gap-3 bg-gray-100 dark:bg-gray-700 p-4">
                    <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-violet-500" />
                    <p className="text-xs sm:text-sm text-gray-500 text-center">Generating AI image...</p>
                    <p className="text-xs text-gray-400 text-center">This may take a few seconds</p>
                  </div>
                )}

                {error ? (
                  <div className="flex flex-col items-center gap-3">
                    <p className="text-gray-500">Failed to generate image</p>
                    <button
                      onClick={regenerate}
                      className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition"
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  imageUrl && (
                    <img
                      src={imageUrl}
                      alt={itemName}
                      className={`w-full h-full object-cover transition-opacity duration-300 ${
                        imageLoaded ? "opacity-100" : "opacity-0"
                      }`}
                      onLoad={() => setImageLoaded(true)}
                      onError={() => setError(true)}
                    />
                  )
                )}
              </div>

              <p className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-gray-500">
                🤖 AI-generated image for &quot;{itemName}&quot;
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
