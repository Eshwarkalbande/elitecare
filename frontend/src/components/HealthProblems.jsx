import React, { useState } from "react";
import { Stethoscope, ShieldCheck, AlertCircle, Sparkles, ChevronRight, CheckSquare, Search, Award, Loader2, Brain, ArrowLeft } from "lucide-react";
import api from "../services/api";
import { getLanguage } from "../i18n";
export default function HealthProblems({ onAddXP, patientProfile }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDisease, setSelectedDisease] = useState("diabetes");
    const [completedTasks, setCompletedTasks] = useState({});

    // Tracks a custom (not in the hardcoded list) condition the user typed in search,
    // e.g. "ulcer". When set, the right panel switches to a lightweight AI-only view.
    const [customDiseaseName, setCustomDiseaseName] = useState(null);

    // AI personalized advice state
    const [aiAdvice, setAiAdvice] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState(null);

    const diseasesList = [
        {
            id: "diabetes",
            name: "Diabetes Mellitus",
            icon: "🩸",
            category: "Metabolic/Endocrine",
            symptoms: ["Polydipsia (Increased thirst)", "Polyuria (Frequent urination)", "Unexplained weight loss", "Fatigue"],
            guidelines: [
                { title: "Glucose Tracking", desc: "Check fasting blood sugar levels. Aim for 70-130 mg/dL." },
                { title: "Fiber Intake Carb Limits", desc: "Keep carbohydrate consumption structured. Choose complex whole grains." },
                { title: "Foot Assessment", desc: "Daily checkups of feet bottom skin to avoid unnoticed neuropathic ulcers." }
            ],
            xpReward: 25,
            coinsReward: 15,
            tasks: [
                "Logged blood sugar level today",
                "Kept carbohydrates within doctor's specified limit",
                "Walked at least 30 minutes post meal"
            ]
        },
        {
            id: "hypertension",
            name: "Hypertension (High Blood Pressure)",
            icon: "🫀",
            category: "Cardiovascular",
            symptoms: ["Severe headaches", "Shortness of breath", "Nosebleeds", "Chest throbbing discomfort"],
            guidelines: [
                { title: "Sodium/Salt Cap", desc: "Limit sodium intake strictly to below 1,500mg daily (DASH dietary standard)." },
                { title: "Stress Relief Loops", desc: "Practice deep breathing or mindfulness checks twice daily." },
                { title: "Potassium Buffering", desc: "Include natural foods rich in potassium like spinach and bananas." }
            ],
            xpReward: 30,
            coinsReward: 15,
            tasks: [
                "Avoided table salt and processed sodium today",
                "Checked BP reading (target < 130/80 mmHg)",
                "Completed 10-minute mindfulness breathing exercise"
            ]
        },
        {
            id: "asthma",
            name: "Bronchial Asthma & Allergens",
            icon: "🫁",
            category: "Respiratory",
            symptoms: ["Expiratory wheezing", "Chronic coughing fit", "Chest tightness", "Dyspnea (Shortness of breath)"],
            guidelines: [
                { title: "Dust Trigger Dampening", desc: "Avoid dust mites, mold spores, pollen, and sudden high humidity changes." },
                { title: "Emergency Inhaler", desc: "Keep Albuterol reliever rescue inhaler nearby at all times." },
                { title: "Peak Flow Mapping", desc: "Monitor lung airflow capacity using a pocket peak flow meter." }
            ],
            xpReward: 25,
            coinsReward: 15,
            tasks: [
                "Inhaler checklist verified and in cargo bag",
                "Avoided smoky or highly dust-congestent areas",
                "Performed morning peak expiratory flow check"
            ]
        },
        {
            id: "thyroid",
            name: "Thyroid Dysregulation",
            icon: "🦋",
            category: "Metabolic/Endocrine",
            symptoms: ["Heat/Cold hyper-sensitivity", "Unexpetcted thyroid swellings", "Mood swing instabilities", "Hair fall-outs"],
            guidelines: [
                { title: "Morning Pills Rhythm", desc: "Take Levothyroxine on an empty stomach at least 45 minutes before tea or breakfast." },
                { title: "Iodine Control", desc: "Limit heavy processed seafoods unless explicitly recommended by thyroid consultants." },
                { title: "Daily Heart Telemetry", desc: "Hyperspeed heart rates could indicate excess medication dosages." }
            ],
            xpReward: 20,
            coinsReward: 10,
            tasks: [
                "Took empty-stomach thyroid prescription medication",
                "Tracked body temperature and resting pulse today",
                "Kept dietary iodine intake within healthy targets"
            ]
        },
        {
            id: "cholesterol",
            name: "Hypercholesterolemia (High Cholesterol)",
            icon: "🧪",
            category: "Vascular/Metabolic",
            symptoms: ["Usually asymptomatic (the 'silent' hazard)", "Yellow skin lipid deposits (xanthomas)"],
            guidelines: [
                { title: "Avoid Saturated Fats", desc: "Cut deep fries, animal butter fat, and trans fats from pastry snacks." },
                { title: "Soluble Fiber Push", desc: "Oats, chia seed pudding, kidney beans, and apples actively capture arterial fat." },
                { title: "Daily Cardio Interval", desc: "Keep blood circulating to raise HDL ('good') vascular cleansing lipids." }
            ],
            xpReward: 35,
            coinsReward: 20,
            tasks: [
                "Substituted saturated fat cooking with cold-pressed olive oil",
                "Consumed 30g+ of gut soluble healthy fiber",
                "Completed 25-minute metabolic fat burning exercise"
            ]
        }
    ];
    // Filters diseases list based on user search query
    const filteredDiseases = diseasesList.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.category.toLowerCase().includes(searchTerm.toLowerCase()));
    const activeDisease = diseasesList.find(d => d.id === selectedDisease) || diseasesList[0];

    const handleToggleTask = (taskName) => {
        const isNowChecked = !completedTasks[taskName];
        setCompletedTasks(prev => ({
            ...prev,
            [taskName]: isNowChecked
        }));
        if (isNowChecked && onAddXP) {
            // Reward patient with XP and extra wellness coins for completing therapeutic checks!
            onAddXP(activeDisease.xpReward, activeDisease.coinsReward);
        }
    };

    // Calls the real AI backend to get advice tailored to this disease + the logged-in patient's profile.
    // Works for both a disease picked from the list AND a custom condition typed in search.
    const handleGetAiAdvice = async () => {
        const targetDiseaseName = customDiseaseName || activeDisease.name;
        const targetSymptoms = customDiseaseName ? [] : activeDisease.symptoms;

        setAiLoading(true);
        setAiError(null);
        setAiAdvice(null);
        try {
            const { data } = await api.post("/ai/health-advice", {
                diseaseName: targetDiseaseName,
                symptoms: targetSymptoms,
                patientProfile: patientProfile || null,
                // Phase 2B: answer in the header language (en | hi | mr).
                language: getLanguage(),
            });
            setAiAdvice(data.advice);
        } catch (error) {
            console.error(error);
            setAiError("Could not reach the AI health coach. Please try again.");
        } finally {
            setAiLoading(false);
        }
    };

    // Reset the AI advice panel whenever the user switches to a different disease from the
    // preset list, so old advice for a different condition isn't shown by mistake.
    const handleSelectDisease = (id) => {
        setSelectedDisease(id);
        setCustomDiseaseName(null);
        setAiAdvice(null);
        setAiError(null);
    };

    // Called when the user searches for a condition that isn't in the hardcoded list
    // (e.g. "ulcer") and wants AI guidance for it directly.
    const handleAskAiAboutCustom = () => {
        setCustomDiseaseName(searchTerm.trim());
        setAiAdvice(null);
        setAiError(null);
    };

    const handleBackToLibrary = () => {
        setCustomDiseaseName(null);
        setSearchTerm("");
        setAiAdvice(null);
        setAiError(null);
    };

    return (<div id="health-problems-encyclopedia" className="max-w-7xl mx-auto space-y-8 px-4 py-8 text-left font-sans">
      
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            Chronic Care Encyclopedia & Habit Trackers
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Stethoscope className="text-green-600" size={24}/>
            Therapeutic Health Problems Center
          </h2>
          <p className="text-xs text-gray-500 font-sans">
            Consult specialized medical guidelines, verify warning signals, and complete health goals to earn therapeutic wellness coins.
          </p>
        </div>

        {/* Unified Search tool */}
        <div className="relative w-full md:max-w-xs shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14}/>
          <input type="text" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); }} placeholder="Search diseases or symptoms..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-green-500 outline-none bg-slate-50 focus:bg-white"/>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column - Disease items list */}
        <div className="lg:col-span-4 space-y-3.5">
          <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 block">
            Select Condition Directory
          </label>
          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {filteredDiseases.map((dis) => (<button key={dis.id} onClick={() => handleSelectDisease(dis.id)} className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all duration-200 ${selectedDisease === dis.id && !customDiseaseName
                ? "bg-emerald-50/50 border-emerald-500 ring-1 ring-emerald-500 shadow-md"
                : "bg-white border-slate-150 hover:bg-slate-50"}`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl bg-slate-50 border rounded-xl p-1 shadow-2xs">{dis.icon}</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{dis.name}</h4>
                    <span className="text-[10px] text-gray-400 font-sans block mt-0.5">{dis.category}</span>
                  </div>
                </div>
                <ChevronRight size={14} className="text-slate-400"/>
              </button>))}

            {filteredDiseases.length === 0 && (<div className="p-5 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 space-y-3 text-center">
                <p className="text-gray-500 text-[11px] font-sans">
                  "{searchTerm}" isn't in our preset library, but our AI Health Coach can still help.
                </p>
                <button onClick={handleAskAiAboutCustom} className="w-full inline-flex items-center justify-center gap-1.5 text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg transition">
                  <Brain size={12}/>
                  <span>Get AI Advice for "{searchTerm}"</span>
                </button>
              </div>)}
          </div>

          {/* Clinical safety passport */}
          <div className="bg-amber-50/60 border border-amber-200 p-4 rounded-2xl text-xs space-y-2">
            <span className="text-[10px] uppercase font-black text-amber-800 tracking-wider">⚠️ Critical Disclaimer</span>
            <p className="text-[11px] text-amber-900 leading-relaxed font-sans font-medium">
              Daily habit trackers do not substitute for professional pathology evaluations. Ensure your doctor approves your daily calorie targets, salt levels, and exercise durations.
            </p>
          </div>
        </div>

        {/* Right Column */}
        {customDiseaseName ? (
          // Lightweight AI-only panel for a custom (non-preset) condition
          <div className="lg:col-span-8 bg-white border border-slate-250 shadow-xl rounded-3xl p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <button onClick={handleBackToLibrary} className="text-[10px] text-slate-500 hover:text-slate-800 font-bold flex items-center gap-1 mb-2">
                  <ArrowLeft size={12}/>
                  <span>Back to condition library</span>
                </button>
                <h3 className="text-lg font-black text-slate-900 capitalize">{customDiseaseName}</h3>
                <span className="text-[10px] text-gray-400 block font-sans">Custom condition — AI-generated guidance</span>
              </div>
              <button onClick={handleGetAiAdvice} disabled={aiLoading} className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg transition disabled:opacity-50 shrink-0">
                {aiLoading ? (<>
                    <Loader2 size={12} className="animate-spin"/>
                    <span>Generating...</span>
                  </>) : (<>
                    <Brain size={12}/>
                    <span>{aiAdvice ? "Regenerate" : "Get AI Advice"}</span>
                  </>)}
              </button>
            </div>

            {aiError && (<div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3 text-[11px] flex items-start gap-2">
                <AlertCircle size={14} className="shrink-0 mt-0.5"/>
                <span>{aiError}</span>
              </div>)}

            {aiAdvice && (<div className="bg-slate-50 border border-slate-150 rounded-xl p-4 text-[11px] text-slate-700 leading-relaxed whitespace-pre-line font-sans">
                {aiAdvice}
              </div>)}

            {!aiAdvice && !aiError && !aiLoading && (<div className="bg-slate-50/60 border border-dashed border-slate-200 rounded-xl p-4 text-[11px] text-slate-400 font-sans">
                Click "Get AI Advice" above to receive AI-generated guidance for "{customDiseaseName}".
              </div>)}
          </div>
        ) : (
          // Standard panel for a disease picked from the preset library
          <div className="lg:col-span-8 bg-white border border-slate-250 shadow-xl rounded-3xl p-6 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 gap-4">
              <div className="flex items-center gap-3 text-left">
                <span className="text-4xl">{activeDisease.icon}</span>
                <div>
                  <h3 className="text-lg font-black text-slate-900">{activeDisease.name}</h3>
                  <span className="text-[10px] text-gray-400 block font-sans">Condition Area: {activeDisease.category}</span>
                </div>
              </div>

              {/* Quick Reward badge */}
              <div className="bg-amber-50 border border-amber-250 rounded-xl px-3 py-1.5 flex items-center gap-2 select-none self-end sm:self-auto">
                <Award className="text-amber-600 shrink-0" size={16}/>
                <div className="text-left font-mono">
                  <span className="text-[9px] text-gray-400 block font-black leading-none uppercase">Task Reward</span>
                  <span className="text-xs font-black text-amber-700">+{activeDisease.coinsReward} Coins / check</span>
                </div>
              </div>
            </div>

            {/* Symptom alerts panel */}
            <div className="space-y-3.5 text-left">
              <h4 className="text-[10px] uppercase font-black tracking-widest text-[#0B2E1E]">
                1. Early Warning Indicators & Biomarkers
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeDisease.symptoms.map((sym, idx) => (<span key={idx} className="bg-red-50 border border-red-200 text-red-700 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                    <AlertCircle size={10}/>
                    <span>{sym}</span>
                  </span>))}
              </div>
            </div>

            {/* Care Guidelines cards */}
            <div className="space-y-3.5 text-left">
              <h4 className="text-[10px] uppercase font-black tracking-widest text-[#0B2E1E]">
                2. Clinical Management Protocols & Guidelines
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activeDisease.guidelines.map((guide, idx) => (<div key={idx} className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-1">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <ShieldCheck className="text-blue-500" size={14}/>
                      {guide.title}
                    </h4>
                    <p className="text-[10px] text-gray-400 leading-normal font-sans">
                      {guide.desc}
                    </p>
                  </div>))}
              </div>
            </div>

            {/* AI Personalized Advice section — calls /api/ai/health-advice */}
            <div className="space-y-3.5 text-left">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] uppercase font-black tracking-widest text-[#0B2E1E]">
                  3. AI Personalized Guidance
                </h4>
                <button onClick={handleGetAiAdvice} disabled={aiLoading} className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg transition disabled:opacity-50">
                  {aiLoading ? (<>
                      <Loader2 size={12} className="animate-spin"/>
                      <span>Generating...</span>
                    </>) : (<>
                      <Brain size={12}/>
                      <span>Get Personalized AI Advice</span>
                    </>)}
                </button>
              </div>

              {aiError && (<div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3 text-[11px] flex items-start gap-2">
                  <AlertCircle size={14} className="shrink-0 mt-0.5"/>
                  <span>{aiError}</span>
                </div>)}

              {aiAdvice && (<div className="bg-slate-50 border border-slate-150 rounded-xl p-4 text-[11px] text-slate-700 leading-relaxed whitespace-pre-line font-sans">
                  {aiAdvice}
                </div>)}

              {!aiAdvice && !aiError && !aiLoading && (<div className="bg-slate-50/60 border border-dashed border-slate-200 rounded-xl p-4 text-[11px] text-slate-400 font-sans">
                  Click "Get Personalized AI Advice" to receive guidance tailored to this condition and your patient profile.
                </div>)}
            </div>

            {/* Gamified Habit Trackers checklist */}
            <div className="bg-emerald-50/40 border border-emerald-200 rounded-2xl p-5 space-y-4 text-left">
              <div className="flex items-center gap-2">
                <Sparkles className="text-emerald-600 animate-spin-slow" size={16}/>
                <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wide">
                  Gamified Habit Check-in Quest
                </h4>
              </div>
              <p className="text-[11px] text-emerald-800 leading-normal font-sans font-medium">
                Complete the following daily active care habits to assist therapeutic alignment. Each completed checkbox instantly rewards you with <strong>+{activeDisease.xpReward} XP</strong> and <strong>+{activeDisease.coinsReward} Wellness Coins</strong>!
              </p>

              <div className="space-y-3.5 pt-2">
                {activeDisease.tasks.map((task, idx) => {
              const isChecked = !!completedTasks[task];
              return (<button key={idx} type="button" onClick={() => handleToggleTask(task)} className={`w-full p-3.5 rounded-xl border flex items-center justify-between text-left transition ${isChecked
                      ? "bg-white border-green-500 shadow-xs text-green-900 font-semibold"
                      : "bg-white/80 border-slate-200 hover:bg-white text-slate-700"}`}>
                      <div className="flex items-center gap-3">
                        <CheckSquare size={18} className={`transition ${isChecked ? "text-green-600 fill-green-100" : "text-gray-300"}`}/>
                        <span className="text-xs font-medium font-sans">{task}</span>
                      </div>

                      <span className="text-[9px] bg-slate-100 px-2 py-0.5 rounded font-bold font-mono tracking-wider">
                        {isChecked ? "STREAK OK! 🎉" : "Pending Action"}
                      </span>
                    </button>);
          })}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>);
}