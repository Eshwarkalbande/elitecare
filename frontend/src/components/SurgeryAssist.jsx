import React, { useState } from "react";
import { ShieldCheck, Activity, Clock, CheckCircle2, Info, BellRing } from "lucide-react";
export default function SurgeryAssist({ onAddXP, patientName }) {
    const [selectedPhase, setSelectedPhase] = useState("pre-op");
    // Tasks bucket
    const [preOpTasks, setPreOpTasks] = useState([
        { id: "pre-1", text: "Complete mandatory pre-anesthesia laboratory screenings (NABL Accredited)", done: true },
        { id: "pre-2", text: "Consolidated list of active drugs/prescriptions uploaded to clinician dashboard", done: true },
        { id: "pre-3", text: "8-Hour absolute fasting interval observed safely prior to hospital intake time", done: false },
        { id: "pre-4", text: "Assigned discharge companion nominated with emergency billing procedures configured", done: false },
        { id: "pre-5", text: "Receive final cardiovascular stability clearance from consulting doctor", done: false }
    ]);
    const [postOpTasks, setPostOpTasks] = useState([
        { id: "post-1", text: "Check dress sterilization margins for signs of elevated inflammatory states daily", done: false },
        { id: "post-2", text: "Log pain and systemic temperature logs twice daily onto local report tracker", done: false },
        { id: "post-3", text: "Follow customized safe mobility regimen (no weighted strain above 5kg)", done: false },
        { id: "post-4", text: "Hydration quota unlocked - drink 2.5L anti-inflammatory fluids", done: true },
        { id: "post-5", text: "Secure clinical review schedule slot with primary surgeon", done: false }
    ]);
    // Alarms simulation state
    const [alarms, setAlarms] = useState([
        { id: "a1", type: "Dressing Swap", time: "10:30 AM", enabled: true, freq: "Every 24 Hrs" },
        { id: "a2", type: "Rehab Flexion Walk", time: "05:00 PM", enabled: true, freq: "Twice daily" },
        { id: "a3", type: "Wound Temperature Log", time: "09:00 PM", enabled: false, freq: "Every 12 Hrs" }
    ]);
    const handleTogglePre = (id) => {
        setPreOpTasks(preOpTasks.map(t => {
            if (t.id === id) {
                const nextDone = !t.done;
                if (nextDone)
                    onAddXP(20, 5); // XP on task completion
                return { ...t, done: nextDone };
            }
            return t;
        }));
    };
    const handleTogglePost = (id) => {
        setPostOpTasks(postOpTasks.map(t => {
            if (t.id === id) {
                const nextDone = !t.done;
                if (nextDone)
                    onAddXP(20, 5); // XP on task completion
                return { ...t, done: nextDone };
            }
            return t;
        }));
    };
    const handleToggleAlarm = (id) => {
        setAlarms(alarms.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
        onAddXP(10, 2); // Micro boost for modifying care alarms
    };
    const preDoneCount = preOpTasks.filter(t => t.done).length;
    const prePercent = Math.round((preDoneCount / preOpTasks.length) * 100);
    const postDoneCount = postOpTasks.filter(t => t.done).length;
    const postPercent = Math.round((postDoneCount / postOpTasks.length) * 100);
    return (<div className="space-y-8 animate-fade-in w-full max-w-7xl mx-auto p-4" id="surgery-assistance-system">
      
      {/* Top Header */}
      <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-slate-100 p-6 md:p-8 rounded-3xl shadow-lg relative overflow-hidden text-left border border-slate-850">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <ShieldCheck size={160}/>
        </div>
        <div className="max-w-2xl space-y-3 z-10 relative">
          <span className="text-[10px] bg-indigo-500/25 text-indigo-300 border border-indigo-400/30 px-3 py-1 rounded-full uppercase tracking-wider font-extrabold">
            🛡 Surgery Readiness & Post-Op Recovery
          </span>
          <h2 className="text-xl md:text-3xl font-black text-white tracking-tight leading-tight">
            Surgery Assistance & Rehabilitation Roadmap
          </h2>
          <p className="text-xs md:text-sm text-slate-400 font-sans leading-relaxed">
            Safety parameters are paramount. Ensure clinical checklists are perfectly populated before check-in or track post-op therapeutic exercises to minimize risk indexes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Milestones Track & Interactive Lists (Cols 7) */}
        <div className="lg:col-span-7 space-y-8 text-left">
          
          {/* PHASE SELECTOR BUTTONS */}
          <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xs flex gap-2">
            <button onClick={() => setSelectedPhase("pre-op")} className={`flex-1 py-3 text-xs font-extrabold rounded-xl transition cursor-pointer text-center ${selectedPhase === "pre-op"
            ? "bg-slate-900 text-white shadow-md"
            : "bg-slate-50 hover:bg-slate-100 text-slate-600"}`}>
              Phase 1: Pre-Op Preparation
            </button>
            <button onClick={() => setSelectedPhase("post-op")} className={`flex-1 py-3 text-xs font-extrabold rounded-xl transition cursor-pointer text-center ${selectedPhase === "post-op"
            ? "bg-[#16A34A] text-white shadow-md"
            : "bg-slate-50 hover:bg-slate-100 text-slate-600"}`}>
              Phase 2: Post-Op Care & Rehab
            </button>
          </div>

          {/* ACTIVE ROADMAP CORE CHASSIS */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-6">
            
            {/* Header info */}
            <div>
              <div className="flex justify-between items-start">
                <h3 className="font-extrabold text-slate-900 text-sm">
                  {selectedPhase === "pre-op" ? "Intake Readiness Audit Checklist" : "Discharge Wound Care & Regimen Target"}
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${selectedPhase === "pre-op" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>
                  {selectedPhase === "pre-op" ? `${prePercent}% Readiness` : `${postPercent}% Recovery Score`}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                {selectedPhase === "pre-op"
            ? "Completing all pre-anesthetic guidelines protects cardiac stability during surgical operations."
            : "Checking clinical exercises targets active blood circulation, inhibiting clot metrics."}
              </p>
            </div>

            {/* Simulated readiness percentage progress bar */}
            <div className="space-y-1.5">
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${selectedPhase === "pre-op" ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${selectedPhase === "pre-op" ? prePercent : postPercent}%` }}/>
              </div>
              <span className="text-[9.5px] italic text-slate-400 font-sans flex items-center gap-1">
                <Info size={11}/> Completing tasks reduces wound incident probabilities by up to 45%.
              </span>
            </div>

            {/* Checkup tasks items container */}
            <div className="space-y-3">
              {selectedPhase === "pre-op" ? (preOpTasks.map((t) => (<button key={t.id} onClick={() => handleTogglePre(t.id)} className="w-full flex items-start gap-3 p-3.5 rounded-xl border border-slate-50/10 hover:bg-slate-50 transition text-left text-xs cursor-pointer bg-slate-50/50">
                    <span className="shrink-0 mt-0.5">
                      {t.done ? (<CheckCircle2 className="text-amber-500 fill-amber-50" size={18}/>) : (<div className="size-[18px] rounded-full border-2 border-slate-300 hover:border-amber-400"/>)}
                    </span>
                    <span className={`font-semibold tracking-tight ${t.done ? "line-through text-slate-400" : "text-slate-800"}`}>
                      {t.text}
                    </span>
                  </button>))) : (postOpTasks.map((t) => (<button key={t.id} onClick={() => handleTogglePost(t.id)} className="w-full flex items-start gap-3 p-3.5 rounded-xl border border-slate-50/10 hover:bg-slate-50 transition text-left text-xs cursor-pointer bg-slate-50/50">
                    <span className="shrink-0 mt-0.5">
                      {t.done ? (<CheckCircle2 className="text-emerald-500 fill-emerald-50" size={18}/>) : (<div className="size-[18px] rounded-full border-2 border-slate-300 hover:border-emerald-400"/>)}
                    </span>
                    <span className={`font-semibold tracking-tight ${t.done ? "line-through text-slate-400" : "text-slate-850"}`}>
                      {t.text}
                    </span>
                  </button>)))}
            </div>

            {/* Milestone achievement cabinet */}
            {((selectedPhase === "pre-op" && prePercent === 100) || (selectedPhase === "post-op" && postPercent === 100)) && (<div className="p-4 bg-emerald-50 border border-emerald-150 rounded-xl text-center space-y-2 animate-bounce-short">
                <span className="text-2xl">🏆</span>
                <h4 className="font-extrabold text-[12.5px] text-emerald-950 uppercase tracking-tight">Milestone Goal Reached!</h4>
                <p className="text-[11px] text-emerald-800 leading-relaxed font-sans">
                  Excellent clinical discipline. Your complete logs have been synchronised with the consulting surgeon. +100 Surgery Shield XP added to Level Chest.
                </p>
              </div>)}

          </div>

        </div>

        {/* Right Side: Care Alarms, Consult Guide (Cols 5) */}
        <div className="lg:col-span-5 space-y-8 text-left">
          
          {/* CARE ALARM TIMER CONSOLE */}
          <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-150 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg">
                  <BellRing size={16}/>
                </span>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 uppercase">Care Reminder Alarm</h3>
                  <p className="text-[10px] text-slate-400">Post-Op medication & dress logs</p>
                </div>
              </div>
              <span className="text-[10px] bg-indigo-55/20 text-indigo-700 font-bold border border-indigo-100 px-2 py-0.5 rounded font-mono">
                Active
              </span>
            </div>

            <div className="space-y-2.5">
              {alarms.map((al) => (<div key={al.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center text-xs">
                  <div className="space-y-0.5 text-left">
                    <h4 className="font-extrabold text-slate-800 text-[11px] leading-snug">{al.type}</h4>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-sans">
                      <Clock size={10}/>
                      <span>{al.time} • {al.freq}</span>
                    </div>
                  </div>

                  <button onClick={() => handleToggleAlarm(al.id)} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition cursor-pointer ${al.enabled
                ? "bg-indigo-600 text-white border-transparent"
                : "bg-white text-slate-400 border-slate-200"}`}>
                    {al.enabled ? "Trigger On" : "Trigger Off"}
                  </button>
                </div>))}
            </div>

            <p className="text-[9.5px] font-sans text-slate-400 text-center">
              *Reminders sync directly to local cellular mobile push systems once active.
            </p>
          </div>

          {/* CLINICAL TELEMETRY HEALTH TIP */}
          <div className="bg-gradient-to-tr from-[#0F172A] to-[#111827] text-white p-5 rounded-2xl space-y-4 border border-slate-850 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-5">
              <Activity size={70} strokeWidth={1}/>
            </div>
            
            <div className="flex gap-2.5 items-start">
              <span className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/10">
                <Info size={16}/>
              </span>
              <div className="space-y-1">
                <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">Clinical Telemetry Info</h4>
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  EliteCare Diagnostics syncs real-time with emergency response divisions in all local hospitals. In the event of surgical drain failures or telemetry spikes, automatic paramedic warnings are broadcast.
                </p>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-[10px]">
              <span className="text-emerald-400 font-bold uppercase font-mono">Status: Secure Line</span>
              <span className="text-zinc-400">HIPAA Compliant</span>
            </div>
          </div>

        </div>

      </div>

    </div>);
}
