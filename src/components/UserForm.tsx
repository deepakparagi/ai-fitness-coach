"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserProfile } from "@/lib/types";
import { Loader2, User, Ruler, Scale, Target, Activity, MapPin, Utensils, Heart, Brain, ArrowRight, ArrowLeft } from "lucide-react";

interface Props {
  onSubmit: (profile: UserProfile) => void;
  isLoading: boolean;
}

export default function UserForm({ onSubmit, isLoading }: Props) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    age: 0,
    gender: "male",
    height: 0,
    weight: 0,
    fitnessGoal: "weight_loss",
    fitnessLevel: "beginner",
    workoutLocation: "home",
    dietaryPreference: "non_veg",
    medicalHistory: "",
    stressLevel: "medium",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(profile);
  };

  const nextStep = (e: React.MouseEvent) => {
    e.preventDefault();
    setStep((s) => Math.min(s + 1, 3));
  };
  const prevStep = (e: React.MouseEvent) => {
    e.preventDefault();
    setStep((s) => Math.max(s - 1, 1));
  };

  // Calculate BMI
  const heightInMeters = profile.height / 100;
  const bmiValue = (profile.height > 0 && profile.weight > 0)
    ? profile.weight / (heightInMeters * heightInMeters)
    : 0;
  const bmi = bmiValue > 0 ? bmiValue.toFixed(1) : "0";

  // Calculate Ideal Weight Range (Healthy BMI: 18.5 - 24.9)
  const idealMin = (18.5 * heightInMeters * heightInMeters).toFixed(1);
  const idealMax = (24.9 * heightInMeters * heightInMeters).toFixed(1);

  const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return { label: "Underweight", color: "text-blue-500", diffPrefix: "Gain at least", diffValue: (parseFloat(idealMin) - profile.weight).toFixed(1) };
    if (bmi < 25) return { label: "Normal", color: "text-green-500", diffPrefix: "You're in the healthy range!", diffValue: null };
    if (bmi < 30) return { label: "Overweight", color: "text-yellow-500", diffPrefix: "Lose about", diffValue: (profile.weight - parseFloat(idealMax)).toFixed(1) };
    return { label: "Obese", color: "text-red-500", diffPrefix: "Lose about", diffValue: (profile.weight - parseFloat(idealMax)).toFixed(1) };
  };
  const bmiCategory = getBmiCategory(parseFloat(bmi));

  const inputClass = "w-full p-3 sm:p-4 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-violet-500 dark:focus:border-violet-500 outline-none transition text-base sm:text-lg";
  const labelClass = "block text-xs sm:text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300";
  const selectClass = "w-full p-3 sm:p-4 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-violet-500 outline-none transition text-base sm:text-lg cursor-pointer";

  const SelectCard = ({
    value,
    current,
    onChange,
    icon: Icon,
    label,
    description
  }: {
    value: string;
    current: string;
    onChange: (v: string) => void;
    icon: any;
    label: string;
    description?: string;
  }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onChange(value)}
      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${current === value
        ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
        : "border-gray-200 dark:border-gray-700 hover:border-violet-300"
        }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${current === value ? "bg-orange-500 text-white" : "bg-gray-100 dark:bg-gray-800"
          }`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="font-semibold">{label}</p>
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
      </div>
    </motion.div>
  );

  return (
    <section id="get-started" className="py-24">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12 px-2"
        >
          <span className="text-orange-600 dark:text-orange-400 font-semibold text-xs sm:text-sm uppercase tracking-wider">Get Started</span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mt-3 sm:mt-4 mb-4 sm:mb-6">
            Create Your <span className="gradient-text">Perfect Plan</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400">
            Tell us about yourself and let AI craft your personalized fitness journey.
          </p>
        </motion.div>

        {/* Progress bar */}
        <div className="flex items-center justify-center gap-1 sm:gap-2 mb-6 sm:mb-8 px-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base transition ${step >= s ? "gradient-bg text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                }`}>
                {s}
              </div>
              {s < 3 && <div className={`w-8 sm:w-16 h-1 mx-1 sm:mx-2 rounded ${step > s ? "gradient-bg" : "bg-gray-200 dark:bg-gray-700"}`} />}
            </div>
          ))}
        </div>

        <motion.form
          onSubmit={handleSubmit}
          className="glass-card rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-10"
        >
          {/* Step 1: Basic Info */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.95 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="space-y-6">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <User className="w-6 h-6 text-orange-500" />
                  Basic Information
                </h3>
                <div>
                  <label className={labelClass}>Your Name</label>
                  <input type="text" required className={inputClass} value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="Enter your name" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Age</label>
                    <input type="number" required min={10} max={100} className={inputClass} value={profile.age}
                      onChange={(e) => setProfile({ ...profile, age: +e.target.value })} />
                  </div>
                  <div>
                    <label className={labelClass}>Gender</label>
                    <select className={selectClass} value={profile.gender}
                      onChange={(e) => setProfile({ ...profile, gender: e.target.value as UserProfile["gender"] })}>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}><Ruler className="w-4 h-4 inline mr-1" />Height (cm)</label>
                    <input type="number" required min={100} max={250} className={inputClass} value={profile.height}
                      onChange={(e) => setProfile({ ...profile, height: +e.target.value })} />
                  </div>
                  <div>
                    <label className={labelClass}><Scale className="w-4 h-4 inline mr-1" />Weight (kg)</label>
                    <input type="number" required min={30} max={300} className={inputClass} value={profile.weight}
                      onChange={(e) => setProfile({ ...profile, weight: +e.target.value })} />
                  </div>
                </div>

                {/* BMI Display */}
                {profile.height > 0 && profile.weight > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border border-orange-200 dark:border-orange-800"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Your BMI</p>
                        <p className="text-3xl font-bold gradient-text">{bmi}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                        <p className={`text-xl font-semibold transition-colors duration-500 ${bmiCategory.color}`}>{bmiCategory.label}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(parseFloat(bmi) / 40 * 100, 100)}%` }}
                        transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }}
                        className="h-full bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-red-500"
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1 uppercase tracking-tighter">
                      <span>Under</span>
                      <span>Normal</span>
                      <span>Over</span>
                      <span>Obese</span>
                    </div>

                    {/* Ideal Weight Recommendation Enhancement */}
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ delay: 0.3 }}
                      className="mt-4 pt-4 border-t border-orange-200/50 dark:border-orange-800/50"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-widest">Healthy Weight Range</p>
                          <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                            {idealMin}kg <span className="text-gray-400 font-normal">to</span> {idealMax}kg
                          </p>
                        </div>
                        <div className="py-2 px-3 bg-white/50 dark:bg-black/20 rounded-lg border border-orange-200/30 dark:border-orange-700/30">
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold whitespace-nowrap">Recommendation</p>
                          <p className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                            {bmiCategory.diffValue ? (
                              <>{bmiCategory.diffPrefix} <span className="text-lg font-bold underline decoration-2">{bmiCategory.diffValue}kg</span></>
                            ) : (
                              bmiCategory.diffPrefix
                            )}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Step 2: Fitness Goals */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.95 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="space-y-6">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Target className="w-6 h-6 text-orange-500" />
                  Fitness Goals
                </h3>
                <div>
                  <label className={labelClass}>What&apos;s your primary goal?</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    <SelectCard value="weight_loss" current={profile.fitnessGoal} icon={Scale} label="Weight Loss" description="Burn fat & slim down"
                      onChange={(v: string) => setProfile({ ...profile, fitnessGoal: v as UserProfile["fitnessGoal"] })} />
                    <SelectCard value="muscle_gain" current={profile.fitnessGoal} icon={Activity} label="Muscle Gain" description="Build strength & size"
                      onChange={(v: string) => setProfile({ ...profile, fitnessGoal: v as UserProfile["fitnessGoal"] })} />
                    <SelectCard value="maintenance" current={profile.fitnessGoal} icon={Heart} label="Maintenance" description="Stay fit & healthy"
                      onChange={(v: string) => setProfile({ ...profile, fitnessGoal: v as UserProfile["fitnessGoal"] })} />
                    <SelectCard value="endurance" current={profile.fitnessGoal} icon={Activity} label="Endurance" description="Boost stamina"
                      onChange={(v: string) => setProfile({ ...profile, fitnessGoal: v as UserProfile["fitnessGoal"] })} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Your fitness level</label>
                  <div className="grid grid-cols-1 xs:grid-cols-3 gap-3 mt-2">
                    {["beginner", "intermediate", "advanced"].map((level) => (
                      <motion.div key={level} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => setProfile({ ...profile, fitnessLevel: level as UserProfile["fitnessLevel"] })}
                        className={`p-3 sm:p-4 rounded-xl border-2 cursor-pointer text-center capitalize transition-all text-sm sm:text-base ${profile.fitnessLevel === level ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20 font-semibold" : "border-gray-200 dark:border-gray-700"
                          }`}>{level}</motion.div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={labelClass}><MapPin className="w-4 h-4 inline mr-1" />Where will you workout?</label>
                  <div className="grid grid-cols-1 xs:grid-cols-3 gap-3 mt-2">
                    {["home", "gym", "outdoor"].map((loc) => (
                      <motion.div key={loc} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => setProfile({ ...profile, workoutLocation: loc as UserProfile["workoutLocation"] })}
                        className={`p-3 sm:p-4 rounded-xl border-2 cursor-pointer text-center capitalize transition-all text-sm sm:text-base ${profile.workoutLocation === loc ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20 font-semibold" : "border-gray-200 dark:border-gray-700"
                          }`}>{loc}</motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Diet & Health */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.95 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="space-y-6">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Utensils className="w-6 h-6 text-orange-500" />
                  Diet & Health
                </h3>
                <div>
                  <label className={labelClass}>Dietary Preference</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    {[
                      { value: "non_veg", label: "Non-Vegetarian", desc: "Includes meat & fish" },
                      { value: "veg", label: "Vegetarian", desc: "No meat or fish" },
                      { value: "vegan", label: "Vegan", desc: "Plant-based only" },
                      { value: "keto", label: "Keto", desc: "Low carb, high fat" },
                    ].map((diet) => (
                      <motion.div key={diet.value} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => setProfile({ ...profile, dietaryPreference: diet.value as UserProfile["dietaryPreference"] })}
                        className={`p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all ${profile.dietaryPreference === diet.value ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20" : "border-gray-200 dark:border-gray-700"
                          }`}>
                        <p className="font-semibold text-sm sm:text-base">{diet.label}</p>
                        <p className="text-xs sm:text-sm text-gray-500">{diet.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={labelClass}><Brain className="w-4 h-4 inline mr-1" />Stress Level</label>
                  <div className="grid grid-cols-1 xs:grid-cols-3 gap-3 mt-2">
                    {["low", "medium", "high"].map((level) => (
                      <motion.div key={level} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => setProfile({ ...profile, stressLevel: level as UserProfile["stressLevel"] })}
                        className={`p-3 sm:p-4 rounded-xl border-2 cursor-pointer text-center capitalize transition-all text-sm sm:text-base ${profile.stressLevel === level ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20 font-semibold" : "border-gray-200 dark:border-gray-700"
                          }`}>{level}</motion.div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={labelClass}><Heart className="w-4 h-4 inline mr-1" />Medical History (Optional)</label>
                  <textarea className={inputClass} rows={3} value={profile.medicalHistory}
                    onChange={(e) => setProfile({ ...profile, medicalHistory: e.target.value })}
                    placeholder="Any injuries, conditions, or limitations we should know about..." />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
            {step > 1 ? (
              <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={(e) => prevStep(e)} className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gray-100 dark:bg-gray-800 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition text-sm sm:text-base w-full sm:w-auto justify-center">
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /> Back
              </motion.button>
            ) : <div className="hidden sm:block" />}

            {step < 3 ? (
              <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={(e) => nextStep(e)} className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl gradient-bg text-white font-semibold shadow-lg hover:shadow-xl transition text-sm sm:text-base w-full sm:w-auto justify-center">
                Next <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
            ) : (
              <motion.button type="submit" disabled={isLoading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl gradient-bg text-white font-semibold shadow-lg hover:shadow-xl transition disabled:opacity-50 text-sm sm:text-base w-full sm:w-auto justify-center">
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> <span className="hidden xs:inline">Generating Your Plan...</span><span className="xs:hidden">Generating...</span></>
                ) : (
                  <>Generate My Plan <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" /></>
                )}
              </motion.button>
            )}
          </div>
        </motion.form>
      </div>
    </section>
  );
}
