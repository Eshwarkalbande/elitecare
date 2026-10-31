import React, { useState } from "react";
import { HeartHandshake, Wind, SmilePlus, Play, Plus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
export default function EmotionMind({ onAddXP, patientName }) {
    const [selectedFeeling, setSelectedFeeling] = useState("stressed");
    const [isBreathing, setIsBreathing] = useState(false);
    const [breathPhase, setBreathPhase] = useState("Quiet");
    const [breathCount, setBreathCount] = useState(3); // 3 round loop
    const [completedBreathingSession, setCompletedBreathingSession] = useState(false);
    const [pinnedAffirmation, setPinnedAffirmation] = useState("My mind is clear, my heartbeat is steady, and I choose serenity today.");
    const [customAffirmText, setCustomAffirmText] = useState("");
    const feelings = [
        {
            id: "stressed",
            label: "Overwhelmed / Stressed",
            emoji: "🤯",
            bgClass: "from-amber-500/10 to-amber-700/5 border-amber-200 text-amber-700",
            tips: "Cortisol levels spike when multi-tasking. Try our Guided Deep Breathing module to trigger immediately the parasympathetic nervous system.",
            color: "amber"
        },
        {
            id: "anxious",
            label: "Anxious / Restless",
            emoji: "🥺",
            bgClass: "from-rose-500/10 to-rose-700/5 border-rose-200 text-rose-700",
            tips: "Ground yourself using the 5-4-3-2-1 acoustic tactile method. Press your feet against the floor and take slow 4-7-8 deep structural breaths.",
            color: "rose"
        },
        {
            id: "exhausted",
            label: "Fatigued / Drained",
            emoji: "🥱",
            bgClass: "from-indigo-500/10 to-indigo-700/5 border-indigo-200 text-indigo-700",
            tips: "Adenosine compound buildup requires immediate visual rest. Try closing your eyes for 5 mins, drink 250ml electrolyte water.",
            color: "indigo"
        },
        {
            id: "healthy",
            label: "Steady / Focused",
            emoji: "🧘‍♂️",
            bgClass: "from-green-500/10 to-green-700/5 border-green-200 text-green-700",
            tips: "Superb! Highly aligned mental wave. Lock this focus by setting 1 active health quest target on your dashboard right now.",
            color: "green"
        },
        {
            id: "radiant",
            label: "Joyful / Vibrant",
            emoji: "✨",
            bgClass: "from-emerald-500/10 to-emerald-700/5 border-emerald-200 text-emerald-700",
            tips: "Amplify metabolic endorphins by sharing positive affirmations with your family or completing a light cardiac workout today!",
            color: "emerald"
        }
    ];
    const affirmationsList = [
        "I trust the natural wisdom of my body to restore perfect hormonal harmony daily.",
        "I am not my anxious thoughts; I am the tranquil awareness witnessing them.",
        "Perfect health belongs to me, and I claim it with every single full breath.",
        "I release resistance and welcome ease, vitality, and clinical clarity into my body."
    ];
    // Guided breathing simulated sequencer
    const startBreathingJourney = () => {
        setIsBreathing(true);
        setCompletedBreathingSession(false);
        setBreathCount(3);
        executeBreathingCycles(3);
    };
    const executeBreathingCycles = (remainingRounds) => {
        if (remainingRounds <= 0) {
            setIsBreathing(false);
            setBreathPhase("Quiet");
            setCompletedBreathingSession(true);
            onAddXP(35, 10); // Reward completing breathing session
            return;
        }
        // Phase 1: Inhale (4s)
        setBreathPhase("Inhale");
        setTimeout(() => {
            // Phase 2: Hold (4s)
            setBreathPhase("Hold");
            setTimeout(() => {
                // Phase 3: Exhale (4s)
                setBreathPhase("Exhale");
                setTimeout(() => {
                    setBreathCount(remainingRounds - 1);
                    executeBreathingCycles(remainingRounds - 1);
                }, 4000);
            }, 4000);
        }, 4000);
    };
    const handleSelectEmotion = (id) => {
        setSelectedFeeling(id);
        onAddXP(10, 2); // Small instant mental points boost
    };
    const handleCustomAffirmSubmit = (e) => {
        e.preventDefault();
        if (!customAffirmText.trim())
            return;
        setPinnedAffirmation(customAffirmText.trim());
        setCustomAffirmText("");
        onAddXP(15, 5); // Redeem points for cognitive framing
    };
    return (<div className="space-y-8 animate-fade-in w-full max-w-7xl mx-auto p-4" id="emotional-wellbeing-applet">
      
      {/* Dynamic Header */}
      <div className="bg-gradient-to-r from-teal-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden text-left">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <HeartHandshake size={150}/>
        </div>
        <div className="max-w-2xl space-y-3 z-10 relative">
          <span className="text-[10px] bg-teal-500/30 text-teal-200 border border-teal-400/30 px-3 py-1 rounded-full uppercase tracking-wider font-extrabold">
            ☯ Mental Health & Emotion Sovereignty
          </span>
          <h2 className="text-xl md:text-3xl font-black tracking-tight leading-tight">
            Stress Mitigation & Deep Breathing Sanctuary
          </h2>
          <p className="text-xs md:text-sm text-teal-100 font-sans leading-relaxed">
            Emotional stability regulates core cardiorespiratory vitals. Identify your mood telemetry and practice breathing loops to claim Mind Achievements.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Emotion Selection & Affirmations (Cols 7) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* MOOD TELEMETRY ASSESSMENT */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs text-left">
            <h3 className="font-extrabold text-slate-900 text-sm mb-1.5 flex items-center gap-1.5">
              <SmilePlus className="text-teal-600" size={18}/>
              How is your mind feeling at this moment, {patientName}?
            </h3>
            <p className="text-xs text-slate-400 font-sans mb-4">Select an emotion selector node below to view clinical coping targets (+10 XP).</p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
              {feelings.map((feeling) => (<button key={feeling.id} onClick={() => handleSelectEmotion(feeling.id)} className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${selectedFeeling === feeling.id
                ? "bg-teal-50/50 border-teal-500 shadow-md ring-1 ring-teal-500/10 scale-105"
                : "bg-slate-50/50 border-slate-100 hover:bg-slate-50"}`}>
                  <span className="text-2xl">{feeling.emoji}</span>
                  <span className="text-[10.5px] font-extrabold tracking-tight leading-tight">
                    {feeling.label.split(" / ")[0]}
                  </span>
                </button>))}
            </div>

            {/* Assessment coping advice view */}
            {(() => {
            const current = feelings.find(f => f.id === selectedFeeling) || feelings[0];
            return (<div className="bg-slate-50 border border-slate-100 p-5 rounded-xl text-left space-y-3">
                  <div className="flex gap-2 items-center">
                    <span className="text-xl">{current.emoji}</span>
                    <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                      Coping Recommendation
                    </h4>
                  </div>
                  <p className="text-[11.5px] text-slate-600 font-sans leading-relaxed">
                    {current.tips}
                  </p>
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200/50">
                    <span className="size-1.5 rounded-full bg-teal-500"/>
                    <span className="text-[9.5px] font-mono text-slate-450 font-bold uppercase uppercase text-teal-700">
                      Primary safety recommendation: clinical deep breath guide
                    </span>
                  </div>
                </div>);
        })()}
          </div>

          {/* POSITIVE AFFIRMATIONS CABINET */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs text-left">
            <h3 className="font-extrabold text-slate-900 text-sm mb-1.5">Tranquility Affirmation Cabinet</h3>
            <p className="text-xs text-slate-450 font-sans mb-4">Pin a clinical wellness affirmation to your mindset core or build your own.</p>

            {/* Pinned Affirmation Display Box */}
            <div className="bg-gradient-to-tr from-teal-900 to-slate-900 text-teal-100 p-4 rounded-xl border border-teal-800 text-center relative py-5 mb-5 select-none">
              <span className="text-3xl text-teal-500/20 absolute top-2 left-3 font-serif">“</span>
              <p className="text-[12.5px] font-semibold leading-relaxed tracking-wide italic font-sans px-4">
                {pinnedAffirmation}
              </p>
              <span className="text-3xl text-teal-500/20 absolute bottom-0 right-3 font-serif">”</span>
            </div>

            {/* Option select cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              {affirmationsList.map((aff, index) => (<button key={index} onClick={() => {
                setPinnedAffirmation(aff);
                onAddXP(10, 2);
            }} className="p-3 text-left bg-slate-5/50 hover:bg-slate-50 border border-slate-100 rounded-xl text-[10.5px] text-slate-600 transition font-sans hover:border-teal-300">
                  {aff}
                </button>))}
            </div>

            {/* Custom affirmation form */}
            <form onSubmit={handleCustomAffirmSubmit} className="flex gap-2">
              <input type="text" required placeholder="Draft custom cognitive wellness affirmation..." value={customAffirmText} onChange={(e) => setCustomAffirmText(e.target.value)} className="flex-1 bg-slate-50 border border-slate-150 rounded-xl py-2 px-3 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-700 font-sans"/>
              <button type="submit" className="bg-slate-950 hover:bg-teal-700 text-white font-extrabold px-4 rounded-xl text-xs flex items-center gap-1 transition cursor-pointer">
                <Plus size={14}/> Pin (+15 XP)
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Deep Breathing Synthesizer (Cols 5) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* DEEP BREATHING SYNTH_RING */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white p-6 rounded-2xl text-center border border-slate-800 relative overflow-hidden flex flex-col justify-between h-[490px]">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Wind size={80}/>
            </div>

            <div className="border-b border-white/5 pb-3">
              <span className="text-[9px] bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded uppercase font-mono tracking-widest block w-fit mx-auto">
                COGNITIVE RESPIRATORY SYNCHRONIZER
              </span>
              <h3 className="font-extrabold text-sm text-white mt-1.5 uppercase">Controlled Lung-Chamber Expansion</h3>
            </div>

            {/* Geometric breathing animation ring visual */}
            <div className="my-8 flex flex-col items-center justify-center relative flex-1">
              
              {/* Outer pulsing shadow circle */}
              <div className={`absolute rounded-full transition-all duration-[4000ms] ${isBreathing && breathPhase === "Inhale"
            ? "size-60 bg-teal-500/10 blur-xl scale-120"
            : isBreathing && breathPhase === "Hold"
                ? "size-56 bg-teal-500/20 blur-xl scale-125"
                : "size-40 bg-transparent blur-md scale-100"}`}/>

              {/* Central ring */}
              <div className={`rounded-full border-4 border-teal-500/40 flex flex-col items-center justify-center transition-all duration-[4000ms] relative z-10 ${isBreathing && breathPhase === "Inhale"
            ? "size-48 bg-teal-900/45 border-teal-300 scale-125"
            : isBreathing && breathPhase === "Hold"
                ? "size-48 bg-teal-900/80 border-emerald-400 scale-125"
                : isBreathing && breathPhase === "Exhale"
                    ? "size-32 bg-slate-900/30 border-teal-600 scale-95"
                    : "size-32 bg-slate-950/80 border-teal-500 scale-100"}`}>
                {isBreathing ? (<div className="space-y-1">
                    <span className="text-[10px] text-teal-300 font-extrabold uppercase font-mono tracking-wider">
                      {breathPhase}
                    </span>
                    <div className="text-xs text-white italic font-bold">
                      {breathPhase === "Inhale" && "Lungs expanding"}
                      {breathPhase === "Hold" && "Deep stillness"}
                      {breathPhase === "Exhale" && "Release toxicity"}
                    </div>
                  </div>) : (<Wind size={32} className="text-teal-400 animate-pulse-slow"/>)}
              </div>

              {/* Wave ripples */}
              {isBreathing && breathPhase === "Hold" && (<span className="absolute inset-x-0 mx-auto rounded-full size-64 border border-emerald-400/20 animate-ping z-0 pointer-events-none"/>)}
            </div>

            <div className="space-y-4 border-t border-white/5 pt-4">
              {isBreathing ? (<div className="flex justify-between items-center px-4">
                  <span className="text-[11px] font-mono font-bold text-[#4ADE80] animate-pulse">● System Engaged</span>
                  <span className="text-xs text-zinc-300 font-black font-mono">Loop: {breathCount} remaining</span>
                </div>) : (<div className="space-y-3">
                  <p className="text-[10.5px] text-zinc-300 leading-normal font-sans">
                    Align your heart rhythm with the expansion loop. Completing 3 modules triggers optimal oxygenation.
                  </p>
                  <button onClick={startBreathingJourney} className="w-full bg-[#14B8A6] hover:bg-[#0D9488] text-white font-extrabold py-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-teal-500/20">
                    <Play size={13} className="fill-white"/> ENGAGE BREATHING SYSTEM (+35 XP / +10 COINS)
                  </button>
                </div>)}

              {/* Complete splash reward drawer */}
              <AnimatePresence>
                {completedBreathingSession && (<motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="p-3.5 bg-teal-950/80 border border-teal-500/40 rounded-xl text-center space-y-1">
                    <h4 className="text-[11px] font-black tracking-widest text-[#4ADE80] uppercase">Quest Accomplished !</h4>
                    <p className="text-[10px] text-teal-200">
                      Excellent cardiac-respiratory mastery! Vitals are refreshed; +35 Mental XP credited to your profile.
                    </p>
                  </motion.div>)}
              </AnimatePresence>
            </div>

          </div>

        </div>

      </div>

    </div>);
}
