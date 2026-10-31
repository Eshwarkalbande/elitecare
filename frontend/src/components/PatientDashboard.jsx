import React, { useState, useEffect } from "react";
import { Activity, Calendar, Download, Trash2, CheckCircle2, Circle, Smartphone, Shield, Plus, TrendingUp, Trophy, Award, Moon, Footprints, Zap, Droplet, Settings, HeartPulse, ArrowRight } from "lucide-react";
import { DOCTORS } from "../mockData";
import { motion, AnimatePresence } from "motion/react";
import MedicalHistoryPanel from "./MedicalHistoryPanel";
import PrescriptionHistoryPanel from "./PrescriptionHistoryPanel";
import { FEATURES } from "../config/features";
export default function PatientDashboard({ appointments, records, onCancelAppointment, onNavigateToSymptom, onNavigateToDoctors, onAddXP, onNavigateToDoctorDashboard, onNavigateToHealthHub, }) {
    // Hydration tracker state
    const [waterGlasses, setWaterGlasses] = useState(() => {
        const saved = localStorage.getItem("goal_water");
        return saved ? parseInt(saved, 10) : 3;
    });
    // Sleep duration tracker state
    const [sleepHours, setSleepHours] = useState(() => {
        const saved = localStorage.getItem("goal_sleep");
        return saved ? parseFloat(saved) : 6.5;
    });
    const [sleepLogged, setSleepLogged] = useState(() => {
        const saved = localStorage.getItem("goal_sleep_logged") === "true";
        return saved;
    });
    const [sleepQuality, setSleepQuality] = useState("Restful");
    // Settings control states (User request: setting button option in patient panel after John Doe ID)
    const [showSettings, setShowSettings] = useState(false);
    const [patientName, setPatientName] = useState(() => {
        return localStorage.getItem("setting_patient_name") || "John Doe";
    });
    const [bloodType, setBloodType] = useState(() => {
        return localStorage.getItem("setting_blood_type") || "O Positive (O+)";
    });
    const [patientAge, setPatientAge] = useState(() => {
        const saved = localStorage.getItem("setting_patient_age");
        return saved ? parseInt(saved, 10) : 29;
    });
    const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
        const saved = localStorage.getItem("setting_notifications_enabled");
        return saved !== "false"; // default to true
    });
    const [emergencyAlerts, setEmergencyAlerts] = useState(() => {
        const saved = localStorage.getItem("setting_emergency_alerts");
        return saved === "true"; // default to false
    });
    // Keep saved state persisted in localStorage
    useEffect(() => {
        localStorage.setItem("setting_patient_name", patientName);
    }, [patientName]);
    useEffect(() => {
        localStorage.setItem("setting_blood_type", bloodType);
    }, [bloodType]);
    useEffect(() => {
        localStorage.setItem("setting_patient_age", patientAge.toString());
    }, [patientAge]);
    useEffect(() => {
        localStorage.setItem("setting_notifications_enabled", notificationsEnabled.toString());
    }, [notificationsEnabled]);
    useEffect(() => {
        localStorage.setItem("setting_emergency_alerts", emergencyAlerts.toString());
    }, [emergencyAlerts]);
    // Physical activity step counter state
    const [stepCount, setStepCount] = useState(() => {
        const saved = localStorage.getItem("goal_steps");
        return saved ? parseInt(saved, 10) : 4500;
    });
    const [isSimulatingWalk, setIsSimulatingWalk] = useState(false);
    const [walkProgress, setWalkProgress] = useState(0);
    // Badge unlock tracks (persisted)
    const [badgesAcquired, setBadgesAcquired] = useState(() => {
        const saved = localStorage.getItem("elitecare_badges");
        return saved ? JSON.parse(saved) : [];
    });
    const [lastUnlockedBadge, setLastUnlockedBadge] = useState(null);
    const unlockABadge = (badgeId, badgeName, coinPrize) => {
        if (badgesAcquired.includes(badgeId))
            return;
        const nextBadges = [...badgesAcquired, badgeId];
        // Check if all three core badges are now unlocked to award the grand prize
        const hasCore3 = ["aqua-champion", "sleep-master", "stamina-sovereign"].every(b => nextBadges.includes(b) || b === badgeId);
        let finalPayloadList = nextBadges;
        let extraXP = 50;
        let extraCoins = coinPrize;
        if (hasCore3 && !badgesAcquired.includes("health-sovereign")) {
            finalPayloadList.push("health-sovereign");
            extraXP += 100;
            extraCoins += 100;
            setLastUnlockedBadge("👑 Health Sovereign (Grand Champion Badge +100 Coins!)");
        }
        else {
            setLastUnlockedBadge(badgeName);
        }
        setBadgesAcquired(finalPayloadList);
        localStorage.setItem("elitecare_badges", JSON.stringify(finalPayloadList));
        if (onAddXP) {
            onAddXP(extraXP, extraCoins);
        }
    };
    const handleDrinkWaterTracker = () => {
        if (waterGlasses < 8) {
            const nextG = waterGlasses + 1;
            setWaterGlasses(nextG);
            localStorage.setItem("goal_water", nextG.toString());
            if (onAddXP)
                onAddXP(10, 5); // Micro reward for logging
            if (nextG === 8 && !badgesAcquired.includes("aqua-champion")) {
                unlockABadge("aqua-champion", "💧 Aqua Champion", 30);
            }
        }
    };
    const handleLogSleepTracker = () => {
        if (sleepLogged)
            return;
        setSleepLogged(true);
        localStorage.setItem("goal_sleep_logged", "true");
        if (onAddXP)
            onAddXP(20, 10);
        if (sleepHours >= 7 && !badgesAcquired.includes("sleep-master")) {
            unlockABadge("sleep-master", "🌙 Zen Sleep Master", 40);
        }
    };
    const handleAddSteps = (amt) => {
        const nextSteps = Math.min(stepCount + amt, 15000);
        setStepCount(nextSteps);
        localStorage.setItem("goal_steps", nextSteps.toString());
        if (onAddXP)
            onAddXP(15, 5);
        if (nextSteps >= 10000 && !badgesAcquired.includes("stamina-sovereign")) {
            unlockABadge("stamina-sovereign", "🏃‍♂️ Stamina Sovereign", 50);
        }
    };
    const handleSimulateWalk = () => {
        if (isSimulatingWalk)
            return;
        setIsSimulatingWalk(true);
        setWalkProgress(0);
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += 10;
            setWalkProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 10;
            });
        }, 150);
        setTimeout(() => {
            setIsSimulatingWalk(false);
            handleAddSteps(3500); // Increments steps drastically inside the log
            if (onAddXP)
                onAddXP(30, 15);
        }, 1600);
    };
    const resetDailyProgress = () => {
        setWaterGlasses(0);
        setSleepHours(7.0);
        setSleepLogged(false);
        setStepCount(0);
        setBadgesAcquired([]);
        setLastUnlockedBadge(null);
        localStorage.removeItem("goal_water");
        localStorage.removeItem("goal_sleep");
        localStorage.removeItem("goal_sleep_logged");
        localStorage.removeItem("goal_steps");
        localStorage.removeItem("elitecare_badges");
    };
    // Goal track state
    const [goals, setGoals] = useState([
        { id: 1, text: "Drink 3 Liters of Water", done: true },
        { id: 2, text: "10,000 Step Afternoon Walk", done: false },
        { id: 3, text: "Take Multi-Vitamins with Meal", done: true },
        { id: 4, text: "30 Min Breathing & Heart Meditations", done: false },
    ]);
    const [newGoalText, setNewGoalText] = useState("");
    const handleToggleGoal = (id) => {
        setGoals(goals.map((g) => (g.id === id ? { ...g, done: !g.done } : g)));
    };
    const handleCreateGoal = (e) => {
        e.preventDefault();
        if (!newGoalText.trim())
            return;
        setGoals([...goals, { id: Date.now(), text: newGoalText.trim(), done: false }]);
        setNewGoalText("");
    };
    const completedGoalsCount = goals.filter((g) => g.done).length;
    const goalPercent = Math.round((completedGoalsCount / goals.length) * 100) || 0;
    return (<div className="w-full max-w-7xl mx-auto space-y-8 p-3" id="patient-dashboard-ui">
      {/* Upper Grid: Welcome Card & Vital Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Profile Card */}
        <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[16rem] h-auto pb-4">
          <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl"></div>
          
          {/* Settings Overlay Drawer */}
          <AnimatePresence>
            {showSettings && (<motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 15 }} transition={{ duration: 0.2 }} className="absolute inset-0 bg-slate-950/98 backdrop-blur-md p-5 text-white flex flex-col justify-between z-20 rounded-2xl">
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                      <Settings size={15} className="text-emerald-400"/>
                      <h3 className="text-xs font-black uppercase tracking-wider text-emerald-400">General Settings</h3>
                    </div>
                    <button onClick={() => setShowSettings(false)} className="text-[9px] font-bold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-1 rounded transition cursor-pointer">
                      Close
                    </button>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    {/* Patient Name Setting */}
                    <div className="space-y-1">
                      <label className="text-[8.5px] font-extrabold uppercase tracking-widest text-slate-400 block">Edit Patient Name</label>
                      <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50" placeholder="John Doe"/>
                    </div>

                    {/* Blood Type Setting */}
                    <div className="space-y-1">
                      <label className="text-[8.5px] font-extrabold uppercase tracking-widest text-slate-400 block">Blood Group</label>
                      <select value={bloodType} onChange={(e) => setBloodType(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 select-none cursor-pointer">
                        <option value="O Positive (O+)">O Positive (O+)</option>
                        <option value="A Positive (A+)">A Positive (A+)</option>
                        <option value="B Positive (B+)">B Positive (B+)</option>
                        <option value="AB Positive (AB+)">AB Positive (AB+)</option>
                        <option value="O Negative (O-)">O Negative (O-)</option>
                        <option value="A Negative (A-)">A Negative (A-)</option>
                      </select>
                    </div>

                    {/* Age Setting */}
                    <div className="space-y-1">
                      <label className="text-[8.5px] font-extrabold uppercase tracking-widest text-slate-400 block">Age (Years)</label>
                      <input type="number" min="1" max="120" value={patientAge} onChange={(e) => setPatientAge(parseInt(e.target.value) || 29)} className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500/50"/>
                    </div>

                    {/* Checkboxes Settings */}
                    <div className="pt-2 space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={notificationsEnabled} onChange={(e) => setNotificationsEnabled(e.target.checked)} className="rounded text-emerald-600 bg-white/5 border-white/15 focus:ring-0 cursor-pointer size-3.5 accent-emerald-500"/>
                        <span className="text-[10px] text-gray-300 font-semibold">Enable SMS Reminders</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={emergencyAlerts} onChange={(e) => setEmergencyAlerts(e.target.checked)} className="rounded text-emerald-600 bg-white/5 border-white/15 focus:ring-0 cursor-pointer size-3.5 accent-emerald-500"/>
                        <span className="text-[10px] text-gray-300 font-semibold">Emergency Dispatch Mode</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-3 flex justify-end">
                  <button onClick={() => setShowSettings(false)} className="w-full py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-black text-xs rounded-xl transition duration-150 shadow-md cursor-pointer">
                    Apply Configurations
                  </button>
                </div>
              </motion.div>)}
          </AnimatePresence>

          <div>
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" alt="Patient Profile" className="size-12 rounded-full border-2 border-green-500 object-cover"/>
              <div>
                <h2 className="text-lg font-bold">{patientName}</h2>
                <span className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase bg-emerald-500/20 px-2 py-0.5 rounded">
                  Premium Member
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>Patient ID:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-gray-200">#EC-2026-9041</span>
                  {/* Settings gear option right after patient ID */}
                  <button onClick={() => setShowSettings(true)} className="p-1 hover:bg-white/10 text-emerald-400 hover:text-emerald-300 rounded transition cursor-pointer flex items-center justify-center hover:scale-110 active:scale-95 duration-150" title="Open Panel Settings" id="btn-trigger-patient-settings">
                    <Settings size={13} className="hover:rotate-45 transition-transform duration-300"/>
                  </button>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Blood Type:</span>
                <span className="text-gray-200 font-semibold">{bloodType}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Age / Sex:</span>
                <span className="text-gray-200">{patientAge} Years / Male</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
            <div className="flex justify-between items-center text-xs text-gray-300">
              <div className="flex items-center gap-1.5">
                <Shield size={14} className="text-green-500"/>
                <span>{emergencyAlerts ? "EMS Connected" : "Full Health Lock"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Smartphone size={14} className="text-green-500"/>
                <span>{notificationsEnabled ? "SMS Alerts ON" : "2FA Linked"}</span>
              </div>
            </div>

            {onNavigateToDoctorDashboard && (<button onClick={onNavigateToDoctorDashboard} className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 active:scale-[98%] transition-all text-white font-extrabold text-xs text-center shadow-lg shadow-emerald-950/40 cursor-pointer flex items-center justify-center gap-2 border border-emerald-400/20" id="btn-goto-doctor-dashboard">
                <span>🚀 Access Doctor Dashboard</span>
                <span>→</span>
              </button>)}
          </div>
        </div>

        {/* Vitals Cards */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* BP Vital Block */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-64">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Blood Pressure</span>
              <span className="size-8 rounded-lg bg-pink-50 text-pink-500 flex items-center justify-center">
                <Activity size={16}/>
              </span>
            </div>
            <div className="my-3">
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">118/76</div>
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mt-1 inline-block">
                Optimal Zone (SYSTOLIC)
              </span>
            </div>
            {/* Custom SVG sparkline */}
            <div className="h-10 w-full mt-2">
              <svg viewBox="0 0 100 20" className="w-full h-full text-pink-500 stroke-current stroke-2 fill-none">
                <path d="M0,10 L10,10 L15,2 L20,18 L25,10 L45,10 L50,0 L55,20 L60,10 L80,10 L85,4 L90,16 L95,10 L100,10"/>
              </svg>
            </div>
          </div>

          {/* HR Vital Block */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-64">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Heart Rhythm</span>
              <span className="size-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp size={16}/>
              </span>
            </div>
            <div className="my-3">
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">72 bpm</div>
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mt-1 inline-block font-mono">
                Steady Sinus
              </span>
            </div>
            {/* Custom SVG sparkline */}
            <div className="h-10 w-full mt-2">
              <svg viewBox="0 0 100 20" className="w-full h-full text-emerald-500 stroke-current stroke-2 fill-none">
                <path d="M0,12 L12,12 L16,6 L20,18 L24,12 L40,12 L44,4 L48,20 L52,12 L70,12 L74,7 L78,17 L82,12 L100,12"/>
              </svg>
            </div>
          </div>

          {/* Active Progress Goal Meter */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-64">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Daily Goal Scale</span>
              <span className="text-xs font-bold text-green-600">{completedGoalsCount}/{goals.length} Done</span>
            </div>
            <div className="my-2">
              <div className="text-3xl font-black text-slate-900 tracking-tight">{goalPercent}%</div>
              <span className="text-[10px] text-gray-400 mt-1 block">Progress towards active habit checkups</span>
            </div>
            {/* Custom bar */}
            <div className="space-y-2 mt-4">
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-green-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${goalPercent}%` }}></div>
              </div>
              <p className="text-[10px] text-gray-400 italic">Complete habits below to advance meter!</p>
            </div>
          </div>
        </div>

      </div>

      {/* SECTION: DAILY HEALTH GOALS GAMIFIED HUB */}
      <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-6 shadow-xs space-y-6" id="gamified-daily-goals-hub">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-100 text-amber-600 rounded-lg">
                <Trophy size={18}/>
              </span>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Daily Health Goals & Achievements Hub</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Complete your daily physical, restorative, and somatic hydration criteria. Form cellular habits to earn locked medals and boost your level and wellness coin balance!
            </p>
          </div>
          <button onClick={resetDailyProgress} className="text-[10px] uppercase font-black tracking-wider text-slate-400 hover:text-red-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg transition shrink-0 cursor-pointer" title="Reset active goal metrics for sandbox preview">
            Reset Metrics Sandbox
          </button>
        </div>

        {/* Live unlocked badge banner success notification */}
        <AnimatePresence>
          {lastUnlockedBadge && (<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 flex items-center justify-between gap-3 text-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-2xl animate-bounce">🎉</span>
                <div>
                  <h4 className="text-xs font-black text-amber-800 uppercase tracking-widest">Achievement Unlocked!</h4>
                  <p className="text-xs text-slate-700 font-medium">You have been awarded the <span className="font-bold text-slate-900">{lastUnlockedBadge}</span> badge and loaded bonus wellness coins into your wallet!</p>
                </div>
              </div>
              <button onClick={() => setLastUnlockedBadge(null)} className="text-xs font-black text-amber-850 hover:bg-amber-100 px-2.5 py-1 rounded cursor-pointer">
                Dismiss
              </button>
            </motion.div>)}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Trackers Container (Col span 7) */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* TRACKER 1: HYDRATION */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:scale-[1.01] transition-transform duration-300">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="p-2 bg-blue-50 text-blue-500 rounded-xl">
                    <Droplet size={18} className={waterGlasses >= 8 ? "animate-pulse" : ""}/>
                  </span>
                  <span className="text-[10px] font-black tracking-wider uppercase text-blue-500">Hydration</span>
                </div>
                <h4 className="text-sm font-bold text-slate-800">Hydration Intake</h4>
                <p className="text-[10px] text-slate-450 mt-1">Target: 8 glasses (2.0L) for cardiorespiratory homeostasis.</p>
                
                <div className="mt-4 flex flex-wrap gap-1.5 justify-center py-2 bg-slate-50/50 rounded-xl my-4">
                  {Array.from({ length: 8 }).map((_, idx) => (<span key={idx} className={`text-lg transition-transform duration-300 ${idx < waterGlasses ? "text-blue-500 scale-110 drop-shadow-xs" : "text-slate-200"}`} title={`${idx + 1} glass`}>
                      💧
                    </span>))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Progress:</span>
                  <span className="font-bold text-emerald-600">{waterGlasses}/8 Glasses</span>
                </div>
                {waterGlasses >= 8 ? (<div className="w-full bg-emerald-50 text-emerald-700 text-[11px] font-bold text-center py-2 rounded-xl border border-emerald-100">
                    🏆 Goal Achieved! (+30 Coins)
                  </div>) : (<button onClick={handleDrinkWaterTracker} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-xl transition cursor-pointer">
                    + Log 250ml Glass
                  </button>)}
              </div>
            </div>

            {/* TRACKER 2: SLEEP REST */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:scale-[1.01] transition-transform duration-300">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="p-2 bg-emerald-50 text-emerald-500 rounded-xl">
                    <Moon size={18}/>
                  </span>
                  <span className="text-[10px] font-black tracking-wider uppercase text-emerald-500">Restoration</span>
                </div>
                <h4 className="text-sm font-bold text-slate-800">Sleep Duration</h4>
                <p className="text-[10px] text-slate-450 mt-1">Target: &gt;7 hours of deep, structured rest.</p>

                <div className="mt-4 space-y-3">
                  {/* Hours manual slider */}
                  {!sleepLogged ? (<div className="space-y-2">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                        <span>Sleep Hours:</span>
                        <span className="text-emerald-600 font-bold">{sleepHours.toFixed(1)} hrs</span>
                      </div>
                      <input id="sleep-hours" name="sleepHours" type="range" min="4" max="12" step="0.5" aria-label="Sleep hours per night" value={sleepHours} onChange={(e) => setSleepHours(parseFloat(e.target.value))} className="w-full accent-emerald-600 h-1.5 bg-slate-100 rounded-lg cursor-ew-resize"/>
                      
                      <div className="flex items-center justify-between gap-1 mt-1">
                        <span className="text-[9px] text-slate-450">Quality:</span>
                        <div className="flex gap-1">
                          {["Restful", "Medium", "Restless"].map((q) => (<button key={q} onClick={() => setSleepQuality(q)} className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold transition-colors ${sleepQuality === q ? "bg-emerald-600 text-white" : "bg-slate-150 text-slate-600 hover:bg-slate-200"}`}>
                              {q}
                            </button>))}
                        </div>
                      </div>
                    </div>) : (<div className="text-center py-4 bg-emerald-50/40 border border-dashed border-emerald-150 rounded-xl my-4">
                      <div className="text-xl font-bold text-emerald-700">{sleepHours.toFixed(1)} Hours</div>
                      <span className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider">{sleepQuality} Rest State</span>
                    </div>)}
                </div>
              </div>

              <div className="space-y-3 mt-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Status:</span>
                  <span className="font-bold text-emerald-600">{sleepLogged ? "Logged Today" : "Not Logged"}</span>
                </div>
                {sleepLogged ? (<div className={`w-full text-[11px] font-bold text-center py-2 rounded-xl border ${sleepHours >= 7 ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-55 text-slate-500 border-slate-200"}`}>
                    {sleepHours >= 7 ? "🏆 Medal Awarded! (+40 Coins)" : "Quality Logged"}
                  </div>) : (<button onClick={handleLogSleepTracker} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-xl transition cursor-pointer">
                    Log Rest Session
                  </button>)}
              </div>
            </div>

            {/* TRACKER 3: PHYSICAL STEPS */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:scale-[1.01] transition-transform duration-300">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="p-2 bg-emerald-50 text-emerald-500 rounded-xl">
                    <Footprints size={18}/>
                  </span>
                  <span className="text-[10px] font-black tracking-wider uppercase text-emerald-500">Stamina</span>
                </div>
                <h4 className="text-sm font-bold text-slate-800">Physical Walking</h4>
                <p className="text-[10px] text-slate-450 mt-1">Target: 10,000 steps to trigger active cardiovascular burn.</p>

                <div className="mt-4 space-y-2">
                  <div className="bg-slate-50 px-3 py-2 rounded-xl text-center">
                    <div className="text-xl font-extrabold text-slate-850">{stepCount.toLocaleString()}</div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-450">Active Steps Today</span>
                  </div>

                  {isSimulatingWalk ? (<div className="space-y-1">
                      <div className="flex justify-between text-[8px] font-black text-emerald-600 uppercase">
                        <span>Cardio Run Progress...</span>
                        <span>{walkProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full transition-all duration-300" style={{ width: `${walkProgress}%` }}/>
                      </div>
                    </div>) : (<div className="flex gap-1.5">
                      <button onClick={() => handleAddSteps(1500)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg text-[9px] py-1.5 transition cursor-pointer">
                        +1,500 Steps
                      </button>
                      <button onClick={handleSimulateWalk} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-[9px] py-1.5 transition flex items-center justify-center gap-1 cursor-pointer" title="Simulate active walking steps">
                        <Zap size={8}/> Run Cardio
                      </button>
                    </div>)}
                </div>
              </div>

              <div className="space-y-3 mt-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Requirement:</span>
                  <span className="font-bold text-emerald-600">{Math.round((stepCount / 10000) * 100)}% Reached</span>
                </div>
                {stepCount >= 10000 ? (<div className="w-full bg-emerald-50 text-emerald-700 text-[11px] font-bold text-center py-2 rounded-xl border border-emerald-100">
                    🏆 Goal Achieved! (+50 Coins)
                  </div>) : (<div className="w-full bg-slate-100 text-slate-500 text-[10px] font-semibold text-center py-1.5 rounded-xl border border-slate-150">
                    Walk to Earn Badge
                  </div>)}
              </div>
            </div>

          </div>

          {/* Badges Cabinet Column (Col span 5) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-1.5">
                  <Award size={16} className="text-amber-500 animate-pulse"/>
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider">Achievements Gallery</span>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded">
                  {badgesAcquired.length}/4 Earned
                </span>
              </div>

              {/* Medals grid container */}
              <div className="grid grid-cols-2 gap-3">
                {/* Badge 1: Hydration */}
                <div className={`p-3 rounded-2xl border text-center transition-all duration-300 ${badgesAcquired.includes("aqua-champion") ? "bg-gradient-to-br from-emerald-50/40 to-green-50/20 border-emerald-205 shadow-xs" : "bg-slate-50/50 border-slate-100 grayscale opacity-60"}`}>
                  <div className="relative mx-auto size-11 mb-2 bg-gradient-to-tr from-emerald-500 to-green-400 text-white rounded-full flex items-center justify-center shadow-md">
                    <Droplet size={20}/>
                    {badgesAcquired.includes("aqua-champion") && (<span className="absolute -top-1 -right-1 bg-yellow-400 text-slate-900 text-[8px] font-black p-0.5 rounded-full border border-white">⭐</span>)}
                  </div>
                  <h5 className="text-[11px] font-bold text-slate-800">Aqua Champion</h5>
                  <p className="text-[9px] text-slate-450 leading-tight mt-0.5">Logged 8 daily glasses of water.</p>
                  <span className="text-[9px] font-extrabold text-emerald-600 block mt-1">+30 Coins</span>
                </div>

                {/* Badge 2: Sleep Master */}
                <div className={`p-3 rounded-2xl border text-center transition-all duration-300 ${badgesAcquired.includes("sleep-master") ? "bg-gradient-to-br from-green-50/40 to-emerald-50/20 border-green-205 shadow-xs" : "bg-slate-50/50 border-slate-100 grayscale opacity-60"}`}>
                  <div className="relative mx-auto size-11 mb-2 bg-gradient-to-tr from-green-600 to-teal-500 text-white rounded-full flex items-center justify-center shadow-md">
                    <Moon size={20}/>
                    {badgesAcquired.includes("sleep-master") && (<span className="absolute -top-1 -right-1 bg-yellow-400 text-slate-900 text-[8px] font-black p-0.5 rounded-full border border-white">⭐</span>)}
                  </div>
                  <h5 className="text-[11px] font-bold text-slate-800">Zen Sleep Master</h5>
                  <p className="text-[9px] text-slate-450 leading-tight mt-0.5">Restored &gt;7 hrs body recovery.</p>
                  <span className="text-[9px] font-extrabold text-green-600 block mt-1">+40 Coins</span>
                </div>

                {/* Badge 3: Stamina Sovereign */}
                <div className={`p-3 rounded-2xl border text-center transition-all duration-300 ${badgesAcquired.includes("stamina-sovereign") ? "bg-gradient-to-br from-emerald-50/50 to-teal-50/30 border-emerald-200 shadow-xs" : "bg-slate-50/50 border-slate-100 grayscale opacity-60"}`}>
                  <div className="relative mx-auto size-11 mb-2 bg-gradient-to-tr from-emerald-500 to-teal-400 text-white rounded-full flex items-center justify-center shadow-md">
                    <Footprints size={20}/>
                    {badgesAcquired.includes("stamina-sovereign") && (<span className="absolute -top-1 -right-1 bg-yellow-400 text-slate-900 text-[8px] font-black p-0.5 rounded-full border border-white">⭐</span>)}
                  </div>
                  <h5 className="text-[11px] font-bold text-slate-800">Stamina Sovereign</h5>
                  <p className="text-[9px] text-slate-450 leading-tight mt-0.5">Crossed 10,000 active walk steps.</p>
                  <span className="text-[9px] font-extrabold text-emerald-600 block mt-1">+50 Coins</span>
                </div>

                {/* Badge 4: Health Sovereign Grand Medal */}
                <div className={`p-3 rounded-2xl border text-center transition-all duration-300 ${badgesAcquired.includes("health-sovereign") ? "bg-gradient-to-br from-amber-50 to-yellow-50 border-yellow-200 shadow-md ring-2 ring-yellow-400/20" : "bg-slate-50/50 border-slate-100 grayscale opacity-60"}`}>
                  <div className="relative mx-auto size-11 mb-2 bg-gradient-to-tr from-yellow-500 to-amber-500 text-white rounded-full flex items-center justify-center shadow-md">
                    <Trophy size={20} className={badgesAcquired.includes("health-sovereign") ? "animate-bounce" : ""}/>
                  </div>
                  <h5 className="text-[11px] font-bold text-slate-800">Health Sovereign</h5>
                  <p className="text-[9px] text-slate-450 leading-tight mt-0.5">Tri-goal completion master badge!</p>
                  <span className="text-[9px] font-black text-amber-700 block mt-1">+100 Extra Coins!</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="flex justify-between items-center bg-amber-50 border border-amber-100 px-3 py-2 rounded-xl">
                <div className="text-left">
                  <h6 className="text-[10px] font-black text-amber-800 uppercase leading-none">Grand Bonus Active</h6>
                  <p className="text-[9px] text-amber-900 mt-0.5">Log all 3 daily targets to claim the Master Badge!</p>
                </div>
                <Trophy size={14} className="text-amber-500 shrink-0"/>
              </div>
            </div>
          </div>
        </div>

        {/* Health Hub — single entry point to the grouped patient sections.
            Renders only when the feature switch in src/config/features.js is on. */}
        {FEATURES.healthHub && (<div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-emerald-300 transition" id="card-health-hub">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                <HeartPulse size={18}/>
              </span>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Health Hub</h4>
                <p className="text-[10px] text-slate-450 mt-0.5 max-w-2xl">
                  Lab reports in plain language, medicine reminders, health tracker, family profiles, emergency card and more — grouped in one place.
                </p>
              </div>
            </div>
            <button onClick={onNavigateToHealthHub} className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-4 rounded-xl transition shrink-0 cursor-pointer flex items-center justify-center gap-1.5" id="btn-open-health-hub">
              Open Health Hub
              <ArrowRight size={13}/>
            </button>
          </div>)}

      </div>

      {/* Lower Grid: Appointments, Records, Habits Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Habit checklist & Medical Records (Cols 4) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* SMART HABIT CHECKLIST */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Vital Habits Tracker</h3>
              <span className="text-[10px] bg-green-50 text-green-600 font-bold px-2 py-0.5 rounded">
                Active Habits
              </span>
            </div>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 mb-4">
              {goals.map((g) => (<button key={g.id} onClick={() => handleToggleGoal(g.id)} className="w-full flex items-center justify-between text-left p-2.5 rounded-lg border border-gray-50 hover:bg-gray-50 transition text-xs cursor-pointer">
                  <span className={`font-medium ${g.done ? "line-through text-gray-400" : "text-gray-700"}`}>
                    {g.text}
                  </span>
                  {g.done ? (<CheckCircle2 className="text-green-600" size={16}/>) : (<Circle className="text-gray-300 hover:text-green-500" size={16}/>)}
                </button>))}
            </div>

            {/* Quick add habit */}
            <form onSubmit={handleCreateGoal} className="flex gap-2">
              <input id="new-health-target" name="newGoalText" type="text" aria-label="New daily health target" placeholder="New daily health target..." className="flex-1 bg-gray-50 border border-gray-100 px-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 focus:bg-white text-gray-700" value={newGoalText} onChange={(e) => setNewGoalText(e.target.value)}/>
              <button type="submit" className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition cursor-pointer" title="Add goal">
                <Plus size={14}/>
              </button>
            </form>
          </div>

          {/* MEDICAL RECORDS DOWNLOAD */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm mb-4">Secured Health Dossier</h3>
            <div className="space-y-3">
              {records.map((rec) => {
            const doc = DOCTORS.find((d) => d.name === rec.doctor);
            const imgSrc = doc?.image || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100";
            return (<div key={rec.id} className="p-3 border border-gray-150 rounded-xl flex items-center justify-between hover:bg-gray-50/50 transition">
                    <div className="flex items-center gap-3">
                      <img src={imgSrc} alt={rec.doctor} className="size-8 rounded-full object-cover border border-gray-150 shrink-0"/>
                      <div>
                        <span className="text-[9px] text-gray-400 font-bold uppercase">{rec.date}</span>
                        <h4 className="text-xs font-semibold text-slate-800">{rec.type}</h4>
                        <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">{rec.doctor}</span>
                      </div>
                    </div>
                    <button onClick={() => alert(`Initiating secure SSL-encrypted download for medical record: ${rec.attachmentName}`)} className="size-8 rounded-lg bg-gray-50 hover:bg-green-50 text-gray-400 hover:text-green-600 flex items-center justify-center border border-gray-200 transition cursor-pointer" title="Download Dossier PDF">
                      <Download size={14}/>
                    </button>
                  </div>);
        })}
            </div>
          </div>

        </div>

        {/* Right Side: Active Appointments Management (Cols 8) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Your Active Consultations</h3>
                <p className="text-xs text-gray-400 mt-0.5">Edit, track, or cancel scheduled virtual and in-person consultations.</p>
              </div>
              <button onClick={onNavigateToDoctors} className="text-xs bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg px-4 py-2 transition shadow-sm cursor-pointer">
                Book New Appointment
              </button>
            </div>

            {appointments.length === 0 ? (<div className="text-center py-12 bg-gray-55/40 rounded-xl border border-dashed border-gray-200">
                <Calendar className="mx-auto text-gray-300 mb-3" size={32}/>
                <h4 className="font-bold text-slate-700 text-sm">No Active Bookings</h4>
                <p className="text-xs text-gray-400 mt-1 mb-4">You have no active doctor consultations scheduled.</p>
                <button onClick={onNavigateToDoctors} className="text-xs text-green-600 hover:text-green-700 font-bold underline">
                  Consult Specialists Catalog
                </button>
              </div>) : (<div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 pb-2">
                      <th className="py-2.5 text-xs font-bold text-gray-400 uppercase">Consultant Specialist</th>
                      <th className="py-2.5 text-xs font-bold text-gray-400 uppercase">Date & Hours</th>
                      <th className="py-2.5 text-xs font-bold text-gray-400 uppercase">Registered Name</th>
                      <th className="py-2.5 text-xs font-bold text-gray-400 uppercase">Consult Invoices</th>
                      <th className="py-2.5 text-xs font-bold text-gray-400 uppercase">Status</th>
                      <th className="py-2.5 text-xs font-bold text-gray-400 uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((apt) => (<tr key={apt.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                        <td className="py-3.5 pr-2">
                          <div className="flex items-center gap-2.5">
                            {(() => {
                    const doc = DOCTORS.find((d) => d.name === apt.doctorName);
                    const imgSrc = doc?.image || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100";
                    return (<img src={imgSrc} alt={apt.doctorName} className="size-9 rounded-full object-cover border border-gray-150 shrink-0"/>);
                })()}
                            <div>
                              <div className="text-xs font-bold text-slate-800">{apt.doctorName}</div>
                              <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium mt-0.5 inline-block">
                                {apt.specialization}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 pr-2">
                          <div className="text-xs text-slate-700 font-semibold">{apt.date}</div>
                          <span className="text-[10px] text-gray-400 block">{apt.time}</span>
                        </td>
                        <td className="py-3.5 pr-2 text-xs text-slate-600">{apt.patientName}</td>
                        <td className="py-3.5 pr-2 text-xs font-mono font-bold text-slate-800">{apt.fee}</td>
                        <td className="py-3.5 pr-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${apt.status === "Scheduled"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    : apt.status === "Completed"
                        ? "bg-green-100 text-green-850 border border-green-200/80"
                        : "bg-red-50 text-red-700 border border-red-100"}`}>
                            {apt.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          {apt.status === "Scheduled" ? (<button onClick={() => {
                        if (confirm(`Are you sure you want to cancel appointment with ${apt.doctorName}?`)) {
                            onCancelAppointment(apt.id);
                        }
                    }} className="size-8 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-600 border border-gray-200 hover:border-red-100 inline-flex items-center justify-center transition cursor-pointer" title="Cancel Scheduled Intake">
                              <Trash2 size={13}/>
                            </button>) : (<span className="text-xs text-gray-400 font-medium">Archived</span>)}
                        </td>
                      </tr>))}
                  </tbody>
                </table>
              </div>)}
          </div>

          {/* Quick Consultation Promo row */}
          <div className="bg-emerald-55/20 border border-emerald-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[9px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded tracking-wide uppercase">
                Free Smart Screen
              </span>
              <h4 className="text-sm font-bold text-slate-800">Unsure who to consult? Run Symptom scan first.</h4>
              <p className="text-xs text-gray-500">
                Our clinical algorithms map bio-symptoms directly to matching cardiologists, neurologists or general doctors.
              </p>
            </div>
            <button onClick={onNavigateToSymptom} className="text-xs bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2.5 rounded-xl transition shrink-0 cursor-pointer">
              Analyze Symptoms with AI
            </button>
          </div>
        </div>

      </div>

      {/* MEDICAL HISTORY & PRESCRIPTION HISTORY — live data from the backend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <MedicalHistoryPanel />
        <PrescriptionHistoryPanel />
      </div>
    </div>);
}
