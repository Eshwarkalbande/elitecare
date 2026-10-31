import React, { useState } from "react";
import { Activity, Plus, Calendar, Heart, Sparkles, Loader2, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import api from "../services/api";
export default function QuickSymptomLog({ onAddXP, onNavigateToDoctors }) {
    const [symptomsInput, setSymptomsInput] = useState("");
    const [painLevel, setPainLevel] = useState(4);
    const [heartRate, setHeartRate] = useState(72);
    const [temperature, setTemperature] = useState(98.6);
    const [spo2, setSpo2] = useState(98);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // AI triage state — filled in by the real /api/ai/symptoms call
    const [aiTriage, setAiTriage] = useState(null); // { reply, department, urgency }
    const [aiError, setAiError] = useState(null);

    // Default seed log history to make the page populated and elite
    const [logHistory, setLogHistory] = useState([
        {
            id: "log-1",
            date: "2026-06-14",
            time: "08:15 AM",
            symptoms: "Mild lower back stiffness after exercise workout.",
            painLevel: 3,
            heartRate: 68,
            temperature: 98.4,
            spo2: 99
        },
        {
            id: "log-2",
            date: "2026-06-12",
            time: "09:40 PM",
            symptoms: "Slight nasal irritation and dry springtime throat congestion.",
            painLevel: 2,
            heartRate: 75,
            temperature: 99.1,
            spo2: 98
        }
    ]);

    const handleSubmitLog = async (e) => {
        e.preventDefault();
        if (isLoading)
            return;
        setIsLoading(true);
        setAiError(null);

        const now = new Date();
        const formattedDate = now.toISOString().split("T")[0];
        const formattedTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        // Build a single natural-language message for the AI symptom checker,
        // combining the free-text symptoms with the logged vitals.
        const message = `Symptoms: ${symptomsInput || "General check-in, no specific symptoms noted."}
Pain level: ${painLevel}/10
Heart rate: ${heartRate} bpm
Body temperature: ${temperature} F
Blood oxygen (SpO2): ${spo2}%`;

        try {
            const { data } = await api.post("/ai/symptoms", { message });
            setAiTriage({
                reply: data.reply,
                department: data.department,
                urgency: data.urgency,
            });
        } catch (error) {
            console.error(error);
            setAiError("Could not reach the AI symptom checker. Please try again.");
        }

        const newLog = {
            id: "log-" + Date.now(),
            date: formattedDate,
            time: formattedTime,
            symptoms: symptomsInput || "General check-in with standard baseline vitals.",
            painLevel: painLevel,
            heartRate: heartRate,
            temperature: temperature,
            spo2: spo2
        };
        setLogHistory([newLog, ...logHistory]);
        setSymptomsInput("");
        setPainLevel(4);
        setHeartRate(72);
        setTemperature(98.6);
        setSpo2(98);
        setIsLoading(false);
        setIsSuccess(true);

        // Reward patient with XP and extra Wellness Coins
        if (onAddXP) {
            onAddXP(30, 15); // +30 XP, +15 Coins
        }
        setTimeout(() => {
            setIsSuccess(false);
        }, 3000);
    };

    // Map the AI's urgency string to a color scheme for the triage box
    const getUrgencyColor = (urgency) => {
        if (urgency === "High") return "text-red-700 bg-red-50 border-red-200";
        if (urgency === "Low") return "text-green-700 bg-green-50 border-green-200";
        return "text-amber-700 bg-amber-50 border-amber-200"; // Medium / default
    };

    return (<div id="quick-symptom-log-page" className="max-w-7xl mx-auto space-y-8 px-4 py-8 text-left font-sans animate-in fade-in duration-200">
      
      {/* Dynamic Header */}
      <div className="space-y-1">
        <span className="text-[10px] bg-green-50 text-green-700 border border-green-100 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
          Patient Vitals Logging & Scoring Logs
        </span>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Activity className="text-green-600 animate-pulse" size={24}/>
          Quick Symptom & Vitals Log
        </h2>
        <p className="text-xs text-gray-500 font-sans">
          Log active physical symptoms, body temperature, blood oxygen levels, and pain points to trigger clinical advice summaries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Logging Form */}
        <form onSubmit={handleSubmitLog} className="lg:col-span-7 bg-white border border-gray-200 shadow-xl rounded-3xl p-6 md:p-8 space-y-6">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider border-b border-gray-100 pb-2">
            1. New Diagnostics Baseline Input
          </h3>

          <div className="space-y-4">
            
            {/* Symptoms textbox */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-700 block uppercase tracking-wide">
                Active Symptom Description
              </label>
              <textarea value={symptomsInput} onChange={(e) => setSymptomsInput(e.target.value)} placeholder="e.g. Mild headache behind temples, slight dry morning cough..." rows={3} className="w-full text-xs p-3 bg-slate-50 border border-gray-200 focus:bg-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 transition text-slate-800 font-sans"/>
            </div>

            {/* Vital slider modules */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Pain scale slider */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs flex flex-col justify-between">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block uppercase tracking-wide mb-1">
                    Pain Comfort Discomfort scale (1-10)
                  </label>
                  <span className="text-slate-400 text-[10px] font-sans">
                    1 = baseline perfect care, 10 = extreme immediate distress.
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <input type="range" min="1" max="10" value={painLevel} onChange={(e) => setPainLevel(parseInt(e.target.value, 10))} className="flex-1 accent-green-600"/>
                  <span className="size-8 rounded-full bg-slate-900 text-white font-black flex items-center justify-center font-mono">
                    {painLevel}
                  </span>
                </div>
              </div>

              {/* Heart rate bpm input */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs space-y-1.5 justify-between flex flex-col">
                <label className="text-[10px] font-bold text-slate-600 block uppercase tracking-wide">
                  Active Heart Rate (BPM)
                </label>
                <div className="flex items-center gap-3">
                  <Heart className="text-red-500 fill-red-100 shrink-0" size={20}/>
                  <input type="number" min="40" max="180" required value={heartRate} onChange={(e) => setHeartRate(parseInt(e.target.value, 10))} className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-center font-bold font-mono"/>
                </div>
              </div>

              {/* Temperature °F input */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs space-y-1.5 justify-between flex flex-col">
                <label className="text-[10px] font-bold text-slate-600 block uppercase tracking-wide">
                  Body Temperature (°F)
                </label>
                <input type="number" step="0.1" min="94" max="108" required value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))} className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-center font-bold font-mono"/>
              </div>

              {/* Blood oxygen spO2 */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs space-y-1.5 justify-between flex flex-col">
                <label className="text-[10px] font-bold text-slate-600 block uppercase tracking-wide">
                  Blood Oxygen Level (SpO2 %)
                </label>
                <input type="number" min="70" max="100" required value={spo2} onChange={(e) => setSpo2(parseInt(e.target.value, 10))} className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-center font-bold font-mono"/>
              </div>

            </div>

          </div>

          {/* Alert check-ins success message */}
          <AnimatePresence>
            {isSuccess && (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center justify-between text-xs">
                <span className="text-green-800 font-bold flex items-center gap-1.5">
                  <Sparkles size={14} className="text-green-600"/>
                  Successfully registered metrics! +15 Wellness Coins added to HUD.
                </span>
              </motion.div>)}
          </AnimatePresence>

          {/* Submit Action */}
          <div className="pt-2">
            <button type="submit" disabled={isLoading} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 transition">
              {isLoading ? (<>
                  <Loader2 size={16} className="animate-spin"/>
                  <span>Analyzing with AI & Logging metrics...</span>
                </>) : (<>
                  <Plus size={16}/>
                  <span>Log Metrics & Reward Wallet (+15 coins)</span>
                </>)}
            </button>
          </div>
        </form>

        {/* Right Column: advice and history log tracking */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Real-time clinical triage box — now powered by the AI symptom checker */}
          {aiError && (<div className="p-5 rounded-3xl border border-red-200 bg-red-50 text-red-800 flex items-start gap-2.5 text-xs">
              <AlertTriangle className="shrink-0 mt-0.5" size={16}/>
              <span>{aiError}</span>
            </div>)}

          {!aiError && aiTriage && (<div className={`p-5 rounded-3xl border border-gray-250 text-left space-y-3 shadow-lg ${getUrgencyColor(aiTriage.urgency)}`}>
              <div className="flex items-center gap-2">
                <Sparkles size={14}/>
                <span className="text-[9px] uppercase tracking-widest font-extrabold px-2.5 py-0.5 rounded bg-white border inline-block">
                  AI Triage: {aiTriage.department} — Urgency: {aiTriage.urgency}
                </span>
              </div>
              <p className="text-xs font-sans leading-relaxed text-slate-800 font-medium whitespace-pre-line">
                {aiTriage.reply}
              </p>

              <button onClick={onNavigateToDoctors} className="text-[10px] text-slate-900 font-extrabold flex items-center gap-1 hover:underline">
                <span>Consult an available staff specialist</span>
                <span className="font-sans">→</span>
              </button>
            </div>)}

          {!aiError && !aiTriage && (<div className="p-5 rounded-3xl border border-dashed border-gray-200 bg-gray-50 text-left space-y-2">
              <span className="text-[9px] uppercase tracking-widest font-extrabold px-2.5 py-0.5 rounded bg-white border inline-block text-gray-500">
                Triage Diagnostics: Awaiting Input
              </span>
              <p className="text-xs font-sans leading-relaxed text-slate-500">
                Log your symptoms and vitals to get a real-time AI clinical triage summary here.
              </p>
            </div>)}

          {/* Visual logs history */}
          <div className="bg-slate-50 border border-slate-200/50 rounded-3xl p-6 text-left space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-gray-150 pb-2">
              Log History Journal
            </h4>

            <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
              {logHistory.map((log) => (<div key={log.id} className="bg-white border border-slate-200/50 rounded-2xl p-4 space-y-2.5 shadow-2xs font-sans">
                  <div className="flex justify-between items-center text-[10px] text-gray-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <Calendar size={10}/>
                      {log.date} at {log.time}
                    </span>
                    <span className="text-[10px] text-red-650 bg-red-50 px-1.5 py-0.5 rounded-md font-bold">
                      Pain: {log.painLevel}/10
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-normal">
                    {log.symptoms}
                  </p>

                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] pt-2 border-t border-gray-50 text-slate-500">
                    <div className="bg-slate-50 p-1 rounded-lg">
                      <span className="block text-[8px] text-gray-400 font-bold uppercase leading-none">Heart Rate</span>
                      <strong className="text-slate-800 font-mono mt-0.5 inline-block">{log.heartRate} bpm</strong>
                    </div>
                    <div className="bg-slate-50 p-1 rounded-lg">
                      <span className="block text-[8px] text-gray-400 font-bold uppercase leading-none">Temp</span>
                      <strong className="text-slate-800 font-mono mt-0.5 inline-block">{log.temperature}°F</strong>
                    </div>
                    <div className="bg-slate-50 p-1 rounded-lg">
                      <span className="block text-[8px] text-gray-400 font-bold uppercase leading-none">SpO2</span>
                      <strong className="text-slate-800 font-mono mt-0.5 inline-block">{log.spo2}%</strong>
                    </div>
                  </div>
                </div>))}
            </div>

          </div>

        </div>

      </div>

    </div>);
}