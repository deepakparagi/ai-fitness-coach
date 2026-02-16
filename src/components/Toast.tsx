"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastContextType {
    showToast: (type: ToastType, message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within ToastProvider");
    }
    return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback(
        (type: ToastType, message: string, duration: number = 3000) => {
            const id = Math.random().toString(36).substring(7);
            const newToast: Toast = { id, type, message, duration };

            setToasts((prev) => [...prev, newToast]);

            if (duration > 0) {
                setTimeout(() => {
                    setToasts((prev) => prev.filter((t) => t.id !== id));
                }, duration);
            }
        },
        []
    );

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full px-4">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
    const config = {
        success: {
            icon: CheckCircle,
            bgClass: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
            iconClass: "text-green-500",
            textClass: "text-green-800 dark:text-green-200",
        },
        error: {
            icon: XCircle,
            bgClass: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
            iconClass: "text-red-500",
            textClass: "text-red-800 dark:text-red-200",
        },
        warning: {
            icon: AlertCircle,
            bgClass: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
            iconClass: "text-yellow-500",
            textClass: "text-yellow-800 dark:text-yellow-200",
        },
        info: {
            icon: Info,
            bgClass: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
            iconClass: "text-blue-500",
            textClass: "text-blue-800 dark:text-blue-200",
        },
    };

    const { icon: Icon, bgClass, iconClass, textClass } = config[toast.type];

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`${bgClass} border-2 rounded-xl p-4 shadow-lg backdrop-blur-sm flex items-start gap-3`}
        >
            <Icon className={`${iconClass} w-5 h-5 flex-shrink-0 mt-0.5`} />
            <p className={`${textClass} text-sm font-medium flex-1`}>{toast.message}</p>
            <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
}
