"use client";
import { motion, AnimatePresence } from "framer-motion";
import { FitnessPlan, UserProfile } from "@/lib/types";
import { X, Calendar, Target, Activity, Trash2 } from "lucide-react";

export interface HistoryItem {
    id: string;
    date: string;
    plan: FitnessPlan;
    profile: UserProfile;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    history: HistoryItem[];
    onSelect: (item: HistoryItem) => void;
    onDelete: (id: string) => void;
}

export default function PlanHistory({ isOpen, onClose, history, onSelect, onDelete }: Props) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <Activity className="w-6 h-6 text-orange-500" />
                                    Plan History
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {history.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <p>No saved plans yet.</p>
                                    <p className="text-sm mt-2">Generate a plan to see it here!</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {history.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            layoutId={item.id}
                                            className="p-4 rounded-xl border-2 border-gray-100 dark:border-gray-800 hover:border-orange-200 dark:hover:border-orange-900/50 transition group bg-white dark:bg-gray-800"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <p className="font-bold text-lg">{item.profile.name}</p>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(item.date).toLocaleDateString()} at {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDelete(item.id);
                                                    }}
                                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 mt-3 mb-4">
                                                <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg text-center">
                                                    <p className="text-xs text-gray-500">Goal</p>
                                                    <p className="font-medium text-sm capitalize">{item.profile.fitnessGoal.replace("_", " ")}</p>
                                                </div>
                                                <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg text-center">
                                                    <p className="text-xs text-gray-500">Current Weight</p>
                                                    <p className="font-medium text-sm">{item.profile.weight} kg</p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => onSelect(item)}
                                                className="w-full py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 font-medium rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition text-sm flex items-center justify-center gap-2"
                                            >
                                                View Plan <Target className="w-4 h-4" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
