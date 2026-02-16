"use client";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg" | "xl";
    variant?: "spinner" | "dots" | "pulse";
    text?: string;
    fullScreen?: boolean;
}

const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
};

export default function LoadingSpinner({
    size = "md",
    variant = "spinner",
    text,
    fullScreen = false,
}: LoadingSpinnerProps) {
    const content = (
        <div className="flex flex-col items-center justify-center gap-3">
            {variant === "spinner" && (
                <Loader2 className={`${sizeClasses[size]} animate-spin text-violet-500`} />
            )}

            {variant === "dots" && (
                <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-3 h-3 bg-violet-500 rounded-full"
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2,
                            }}
                        />
                    ))}
                </div>
            )}

            {variant === "pulse" && (
                <motion.div
                    className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-violet-500 to-purple-500`}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                    }}
                />
            )}

            {text && (
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-xs">
                    {text}
                </p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
                {content}
            </div>
        );
    }

    return content;
}

// Skeleton loader component
export function SkeletonLoader({ className = "" }: { className?: string }) {
    return (
        <div
            className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg ${className}`}
        />
    );
}

// Progress bar component
interface ProgressBarProps {
    progress: number; // 0-100
    text?: string;
    showPercentage?: boolean;
}

export function ProgressBar({ progress, text, showPercentage = true }: ProgressBarProps) {
    return (
        <div className="w-full space-y-2">
            {(text || showPercentage) && (
                <div className="flex justify-between items-center text-sm">
                    {text && <span className="text-gray-600 dark:text-gray-400">{text}</span>}
                    {showPercentage && (
                        <span className="font-semibold text-violet-600 dark:text-violet-400">
                            {Math.round(progress)}%
                        </span>
                    )}
                </div>
            )}
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>
        </div>
    );
}
