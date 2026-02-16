"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, ImageIcon, RefreshCw, AlertCircle } from "lucide-react";
import { useImageCache } from "@/hooks/useImageCache";
import { SkeletonLoader } from "./LoadingSpinner";

interface Props {
  itemName: string;
  type: "exercise" | "meal";
}

export default function ImageModal({ itemName, type }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const { getCachedImage, setCachedImage } = useImageCache();
  const cacheKey = `${type}-${itemName.toLowerCase().replace(/\s+/g, "-")}`;

  // Try to load from cache when modal opens
  useEffect(() => {
    if (isOpen && !imageUrl && !isLoading) {
      const cached = getCachedImage(cacheKey);
      if (cached) {
        setImageUrl(cached);
        setImageLoaded(false); // Will be set to true when image loads
      } else {
        generateImage();
      }
    }
  }, [isOpen]);

  const generateImage = async (isRetry: boolean = false) => {
    if (!isRetry) {
      setRetryCount(0);
    }

    setIsLoading(true);
    setImageLoaded(false);
    setError(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout (reduced)

      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: itemName, type }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Failed to generate image: ${res.status}`);
      }

      const data = await res.json();

      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
        setCachedImage(cacheKey, data.imageUrl);

        // Cache fallback URL separately if provided
        if (data.fallbackUrl && data.imageUrl !== data.fallbackUrl) {
          setCachedImage(`${cacheKey}_fallback`, data.fallbackUrl);
        }

        setError(null);
      } else {
        throw new Error(data.error || "No image URL returned");
      }
    } catch (err: any) {
      console.error("Image generation error:", err);

      // Try using cached fallback URL if available
      const fallbackUrl = getCachedImage(`${cacheKey}_fallback`);
      if (fallbackUrl && !isRetry) {
        console.log("Using cached fallback URL after error");
        setImageUrl(fallbackUrl);
        setError(null);
        setIsLoading(false);
        return;
      }

      // Set appropriate error messages
      if (err.name === "AbortError") {
        setError("Image generation timed out. Click retry.");
      } else if (err.message.includes("Failed to fetch")) {
        setError("Network error. Please check connection and retry.");
      } else {
        setError(err.message || "Failed to generate image. Please retry.");
      }

    } finally {
      setIsLoading(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    // Reset states when closing
    setTimeout(() => {
      if (!isOpen) {
        setImageLoaded(false);
        setError(null);
      }
    }, 300);
  };

  const regenerate = () => {
    setImageUrl(null);
    setImageLoaded(false);
    setError(null);
    setRetryCount(0);
    generateImage();
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleOpen}
        className="p-1.5 sm:p-2 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg transition flex-shrink-0"
        title="View AI generated image"
        aria-label={`View AI generated image of ${itemName}`}
      >
        <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotateX: 15, y: 50 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotateX: -15, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-w-2xl w-full shadow-2xl"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg md:text-xl font-bold truncate pr-2">
                  {itemName}
                </h3>
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={regenerate}
                    disabled={isLoading}
                    className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg sm:rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Regenerate image"
                    aria-label="Regenerate image"
                  >
                    <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${isLoading ? "animate-spin" : ""}`} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleClose}
                    className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg sm:rounded-xl transition"
                    aria-label="Close modal"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Image Container */}
              <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-700 rounded-xl sm:rounded-2xl flex items-center justify-center overflow-hidden relative">
                {/* Loading State */}
                {isLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gray-100 dark:bg-gray-700 p-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-orange-500" />
                    </motion.div>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center font-medium">
                      Loading visual guide...
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
                      Fetching the best reference for you
                    </p>
                  </div>
                )}

                {/* Show skeleton while image is loading */}
                {imageUrl && !imageLoaded && !error && (
                  <SkeletonLoader className="absolute inset-0" />
                )}

                {/* Error State */}
                {error && !isLoading && (
                  <div className="flex flex-col items-center gap-3 sm:gap-4 p-4 sm:p-6">
                    <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <div className="text-center">
                      <p className="text-gray-700 dark:text-gray-300 font-semibold mb-2">
                        Failed to generate image
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {error}
                      </p>
                    </div>
                    <button
                      onClick={regenerate}
                      className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition font-medium"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Try Again
                    </button>
                  </div>
                )}

                {/* Image */}
                {imageUrl && !error && (
                  <img
                    src={imageUrl}
                    alt={itemName}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"
                      }`}
                    onLoad={() => {
                      setImageLoaded(true);
                      setIsLoading(false);
                    }}
                    onError={() => {
                      // Try fallback URL if available
                      const fallbackUrl = getCachedImage(`${cacheKey}_fallback`);
                      if (fallbackUrl && imageUrl !== fallbackUrl) {
                        console.log("Primary image failed, trying fallback");
                        setImageUrl(fallbackUrl);
                        setImageLoaded(false);
                      } else {
                        setError("Image failed to load. Click retry.");
                        setIsLoading(false);
                      }
                    }}
                  />
                )}
              </div>

              {/* Footer */}
              <p className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Visual guide for &quot;{itemName}&quot;
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
