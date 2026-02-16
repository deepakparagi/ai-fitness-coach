"use client";
import React, { Component, ReactNode } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);

        // You could send this to an error reporting service
        // e.g., Sentry.captureException(error, { extra: errorInfo });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    handleGoHome = () => {
        window.location.href = "/";
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                            className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center"
                        >
                            <AlertTriangle className="w-10 h-10 text-red-500" />
                        </motion.div>

                        <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                            Oops! Something went wrong
                        </h2>

                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            We encountered an unexpected error. Don't worry, your data is safe.
                        </p>

                        {process.env.NODE_ENV === "development" && this.state.error && (
                            <details className="mb-6 text-left">
                                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-2">
                                    Error Details (Development Only)
                                </summary>
                                <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-auto max-h-40 text-red-600 dark:text-red-400">
                                    {this.state.error.toString()}
                                    {"\n\n"}
                                    {this.state.error.stack}
                                </pre>
                            </details>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={this.handleReset}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Try Again
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={this.handleGoHome}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition"
                            >
                                <Home className="w-4 h-4" />
                                Go Home
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            );
        }

        return this.props.children;
    }
}
