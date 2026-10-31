import React, { useState, useEffect } from "react";
import { Siren, Shield, AlertTriangle, Phone, CheckCircle, Volume2, VolumeX } from "lucide-react";
export default function EmergencyAlert({ onAddXP, patientProfile }) {
    const defaultProfile = {
        fullName: "John Doe",
        bloodGroup: "O+",
        phone: "+1 (555) 019-2834",
        emergencyContactName: "Jane Doe",
        emergencyContactPhone: "+1 (555) 019-5867",
        address: "123 Wellness Way, Suite 400, New York, NY 10001"
    };
    const profile = patientProfile || defaultProfile;
    const [emergencyType, setEmergencyType] = useState("cardiac");
    const [countdown, setCountdown] = useState(null);
    const [isTriggered, setIsTriggered] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const emergencyCategories = [
        { id: "cardiac", label: "Cardiac Distress / Chest Pain", icon: "❤️", priority: "Critical (Airway-Breathing-Circulation)" },
        { id: "unconscious", label: "Unconscious / Fainting", icon: "🧠", priority: "Critical (Recovery Position)" },
        { id: "stroke", label: "Stroke / Numbness (F.A.S.T)", icon: "⚡", priority: "Accredited Neurological ICU" },
        { id: "trauma", label: "Severe Injury / Open Bleeding", icon: "🩹", priority: "Direct Compression" },
        { id: "asthma", label: "Severe Asthma / Choking", icon: "🫁", priority: "Bronchial Dilation" },
        { id: "allergy", label: "Anaphylaxis / Severe Allergy", icon: "🐝", priority: "Immediate Epipen" },
    ];
    const firstAidChecklists = {
        cardiac: [
            "Keep the patient seated in a comfortable relaxed position (semi-recumbent).",
            "Loosen any restrictive clothing around neck or waist.",
            "Ask if they use Nitroglycerin or Aspirin; assist them if recommended.",
            "Be prepared to start Cardiopulmonary Resuscitation (CPR) if the person loses responsiveness.",
            "Ask bystanders to deploy an Automated External Defibrillator (AED) immediately."
        ],
        unconscious: [
            "Check responsiveness: shout and gently shake their shoulders.",
            "Ensure the airway is wide open. Clear mouth of fluids.",
            "Check breathing for 10 seconds. If breathing normally, roll them into the Recovery Position.",
            "Do NOT pour water or try to give any liquids to avoid airway choking."
        ],
        stroke: [
            "Check F.A.S.T symptoms: Face drooping, Arm weakness, Speech slurred, Time to trigger SOS.",
            "Note the exact clock time when symptoms first started to help paramedics.",
            "Keep patient lying on their side to prevent choking if vomiting occurs."
        ],
        trauma: [
            "Apply direct firm pressure on the wound using a clean dressing or cloth.",
            "Elevate the injured limb above heart level if no fractures are suspected.",
            "Keep the patient warm and dry to combat critical blood loss shock."
        ],
        asthma: [
            "Help the person sit upright. Encourage them to take slow, steady breaths.",
            "Assist with using their quick-relief rescue inhaler (Albuterol) immediately.",
            "Do not let them lie down; keeping the posture straight enhances airflow."
        ],
        allergy: [
            "Ask if they have an Epinephrine Autoinjector (EpiPen) and assist in administering in outer thigh.",
            "Keep patient lying flat with feet raised to maintain blood pressure.",
            "Remove the allergen source (stinger, food particle) if safe."
        ]
    };
    // Geo Location trigger
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setLatitude(pos.coords.latitude);
                setLongitude(pos.coords.longitude);
            }, (err) => console.log("Geolocation error :", err));
        }
    }, []);
    // SOS Countdown handler
    useEffect(() => {
        let timer;
        if (countdown !== null && countdown > 0) {
            timer = setTimeout(() => {
                setCountdown(countdown - 1);
                playSirensTone();
            }, 1000);
        }
        else if (countdown === 0) {
            setCountdown(null);
            setIsTriggered(true);
            setActiveStep(1);
            // Give Wellness Coins + XP for acting
            if (onAddXP) {
                onAddXP(50, 40); // 50 XP, 40 Coins
            }
        }
        return () => clearTimeout(timer);
    }, [countdown]);
    // Dynamic dispatch progression
    useEffect(() => {
        let interval;
        if (isTriggered && activeStep > 0 && activeStep < 4) {
            interval = setInterval(() => {
                setActiveStep((prev) => {
                    if (prev >= 4)
                        return 4;
                    return prev + 1;
                });
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [isTriggered, activeStep]);
    // Audio synthesizer tone for siren warning feedback
    const playSirensTone = () => {
        if (!soundEnabled)
            return;
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx)
                return;
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.4);
            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.5);
        }
        catch (e) {
            console.log(e);
        }
    };
    const handleStartSOS = () => {
        setCountdown(3);
    };
    const handleCancelSOS = () => {
        setCountdown(null);
        setIsTriggered(false);
        setActiveStep(0);
    };
    // WhatsApp Alert Formatter
    const getWhatsAppAlertText = () => {
        const rawText = `🚨 EMERGENCY ALERT FROM ELITECARE PORTAL! 🚨
I have triggered a critical health dispatch alert!
Patient: ${profile.fullName}
Type: ${emergencyCategories.find((c) => c.id === emergencyType)?.label || emergencyType}
Contact: ${profile.phone}
Address: ${profile.address}
Coordinate Mapping: ${latitude && longitude ? `https://www.google.com/maps?q=${latitude},${longitude}` : "No GPS lock"}`;
        return `https://wa.me/${profile.emergencyContactPhone.replace(/[\s\+\-\(\)]/g, "")}?text=${encodeURIComponent(rawText)}`;
    };
    return (<div id="emergency-alert-page" className="max-w-7xl mx-auto space-y-8 px-4 py-8 font-sans">
      
      {/* Banner disclaimer */}
      <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4 flex items-start gap-3.5 text-left">
        <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={20}/>
        <div>
          <h4 className="text-xs font-black text-red-900 uppercase">Interactive Tactical Emergency Dispatch Simulation</h4>
          <p className="text-[11px] text-red-700 leading-normal font-medium mt-0.5 font-sans">
            This module provides immediate clinical action instructions, real-time dispatch GPS simulator locks, and automatic notifications alerts to contacts. If we need field paramedics, please dial your state/city's national line immediately!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left col: Action console */}
        <div className="lg:col-span-7 bg-white border border-gray-200 shadow-xl rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1 text-left">
              <span className="text-[10px] bg-red-100 text-red-700 border border-red-200 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                Elite GPS-Lock Rescue Console
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Siren className="text-red-600 animate-bounce" size={24}/>
                Real-Time Rescue Centre
              </h2>
            </div>

            {/* Siren speaker toggle */}
            <button onClick={() => setSoundEnabled(!soundEnabled)} className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition ${soundEnabled ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`} title="Sirens sound effects">
              {soundEnabled ? <Volume2 size={15}/> : <VolumeX size={15}/>}
              <span className="text-[10px] font-bold">{soundEnabled ? "Siren ON" : "Muted"}</span>
            </button>
          </div>

          {/* Core Emergency Type Selector */}
          {!isTriggered && countdown === null && (<div className="space-y-3.5 text-left animate-in fade-in duration-200">
              <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 block">
                Step 1: Identify Health Disaster Category
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {emergencyCategories.map((cat) => (<button key={cat.id} onClick={() => {
                    setEmergencyType(cat.id);
                    playSirensTone();
                }} className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition ${emergencyType === cat.id
                    ? "bg-red-50/50 border-red-550 shadow-md ring-2 ring-red-500"
                    : "bg-white border-gray-150 hover:bg-slate-50"}`}>
                    <span className="text-2xl mt-0.5">{cat.icon}</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{cat.label}</h4>
                      <p className="text-[10px] text-gray-400 font-sans mt-0.5">Priority: {cat.priority}</p>
                    </div>
                  </button>))}
              </div>

              {/* Patient Passport Readout */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60 text-xs space-y-2">
                <h4 className="font-extrabold text-[#0B2E1E] text-[10px] uppercase tracking-wider block">
                  Automatic Emergency Passport Transmission
                </h4>
                <div className="grid grid-cols-2 gap-y-1.5 text-[11px] text-slate-700">
                  <p>👤 <strong>FullName:</strong> {profile.fullName}</p>
                  <p>🩸 <strong>Blood Type:</strong> <span className="bg-red-100 text-red-700 px-1 rounded font-bold">{profile.bloodGroup}</span></p>
                  <p>📞 <strong>Phone:</strong> {profile.phone}</p>
                  <p>🏡 <strong>Residential Address:</strong> {profile.address}</p>
                </div>
              </div>

              {/* Large triggering button activation */}
              <div className="pt-4">
                <button onClick={handleStartSOS} className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl text-base shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2.5 cursor-pointer relative overflow-hidden group">
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <Siren className="animate-spin" size={20}/>
                  <span>LAUNCH CRITICAL MEDICAL SOS</span>
                </button>
              </div>
            </div>)}

          {/* Countdown active box */}
          {countdown !== null && (<div className="bg-red-650 text-white p-8 rounded-3xl text-center space-y-4 animate-pulse">
              <span className="text-7xl font-sans font-black tracking-widest">{countdown}</span>
              <h3 className="text-lg font-extrabold">Emergency SOS Broadcast Launching...</h3>
              <p className="text-xs text-red-100 font-sans max-w-md mx-auto">
                EliteCare is gathering GPS coordinate parameters, preparing first-aid manuals, and scheduling auto-parameclic dispatch loops. Click below to abort instantly if safe.
              </p>
              <button onClick={handleCancelSOS} className="bg-white text-red-700 border border-gray-100 hover:bg-gray-150 text-xs font-bold px-6 py-2.5 mt-2 rounded-xl transition cursor-pointer">
                Abort SOS Immediately
              </button>
            </div>)}

          {/* SOS Activated state: Dispatch tracking logs */}
          {isTriggered && (<div className="space-y-6 text-left animate-in zoom-in-95 duration-200">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="size-10 rounded-full bg-green-105 border border-green-205 flex items-center justify-center text-green-700">
                    <CheckCircle size={20}/>
                  </span>
                  <div>
                    <h4 className="text-xs font-black text-green-900">Elite SOS Active Map Signal Engaged!</h4>
                    <p className="text-[10px] text-green-700 font-sans mt-0.5">Paramedics alert broadcast locked (+40 Wellness Coins rewarded!)</p>
                  </div>
                </div>
                <button onClick={handleCancelSOS} className="text-xs text-red-600 hover:text-red-700 font-extrabold underline transition">
                  Terminate SOS
                </button>
              </div>

              {/* Dynamic Step progression progress tracker */}
              <div className="space-y-4">
                <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 block">
                  Simulated Ambulance Dispatch Track
                </label>
                <div className="relative">
                  <div className="absolute left-6 top-1.5 bottom-1.5 w-0.5 bg-slate-200"></div>

                  {[
                { id: 1, title: "SOS Issued", desc: `Locked and transmitted for ${emergencyCategories.find((c) => c.id === emergencyType)?.label}` },
                { id: 2, title: "Location Confirmed", desc: `Secured mapping coordinate: ${latitude ? `${latitude.toFixed(4)}, ${longitude?.toFixed(4)}` : "123 Wellness Way"}` },
                { id: 3, title: "Ambulance Dispatched", desc: "Elite Ambulance Unit #401 left Elitecare Metro Hospital" },
                { id: 4, title: "In-Route / Near You", desc: "Dispatch unit arriving shortly. ETA 3 minutes" }
            ].map((step) => {
                const isCompleted = activeStep >= step.id;
                const isActive = activeStep === step.id;
                return (<div key={step.id} className="relative flex gap-5 pl-12 pb-5">
                        <span className={`absolute left-4 top-1 size-5 rounded-full border-2 flex items-center justify-center transition-colors z-10 ${isCompleted
                        ? "bg-green-600 border-green-600 text-white"
                        : isActive
                            ? "bg-red-500 border-red-500 text-white animate-pulse"
                            : "bg-white border-slate-300 text-transparent"}`}>
                          {step.id}
                        </span>
                        <div>
                          <h4 className={`text-xs font-bold leading-none ${isCompleted ? "text-green-900" : isActive ? "text-red-600 font-extrabold" : "text-gray-400"}`}>
                            {step.title}
                          </h4>
                          <p className={`text-[11px] font-sans mt-1 ${isCompleted ? "text-slate-600" : isActive ? "text-slate-800 font-semibold" : "text-gray-300"}`}>
                            {step.desc}
                          </p>
                        </div>
                      </div>);
            })}
                </div>
              </div>

              {/* Help Emergency Contacts */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs space-y-3">
                <h4 className="font-extrabold text-amber-800 text-[10px] uppercase tracking-wider block">
                  Support Circle Emergency Coordination
                </h4>
                <p className="text-[11px] text-amber-900 leading-normal font-sans">
                  Notify your registered primary guardian, <strong>{profile.emergencyContactName} ({profile.emergencyContactPhone})</strong>, about this status via WhatsApp.
                </p>
                <a href={getWhatsAppAlertText()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#128C7E] text-white font-extrabold px-4 py-2 rounded-xl text-[10px] transition">
                  <svg className="size-3.5 text-white fill-white" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.438 2.5 1.17 3.473L6.5 21.03l5.807-1.523c.915.5 1.946.786 3.037.787 3.18 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.766-5.768-5.76s3.43 8.163c-.14.39-.7.76-1.07 1.01-.31.21-.7.37-1.16.4-.64.04-1.42-.13-2.31-.49-1.29-.53-2.5-1.75-3.15-2.61-.41-.54-.69-1.15-.69-1.79 0-.96.48-1.47.78-1.76.11-.11.23-.17.34-.17h.26c.09 0 .19.01.27.21.1.25.35.85.38.92.03.07.05.15 0 .25-.05.1-.11.17-.18.26-.07.08-.15.18-.21.26-.08.09-.17.19-.07.36.19.32.42.64.69.91.35.35.7.63 1.09.81.18.08.28.07.38-.05.1-.12.44-.51.56-.68.12-.17.24-.14.4-.08.17.06 1.07.5 1.25.59.18.09.3.13.34.21.05.08.05.47-.1.82z"/>
                  </svg>
                  <span>Transmit Alert to {profile.emergencyContactName}</span>
                </a>
              </div>
            </div>)}

        </div>

        {/* Right col: First aid checklist manual */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0B2E1E] text-white rounded-3xl p-6 md:p-8 space-y-5 text-left shadow-lg">
            <span className="size-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
              <Siren className="text-emerald-450" size={24}/>
            </span>
            <div className="space-y-1">
              <h3 className="text-lg font-black tracking-tight">Immediate Medical Protocol</h3>
              <p className="text-[11px] text-emerald-200">
                While team rescue responders are in route, perform these actions of critical emergency protocol.
              </p>
            </div>

            {/* Dynamic First Aid Manual items */}
            <div className="pt-2 border-t border-emerald-800 space-y-3.5">
              <span className="text-[11px] bg-emerald-900 border border-emerald-850 px-2.5 py-1 rounded text-emerald-300 font-extrabold font-mono">
                Active Topic: {emergencyCategories.find((c) => c.id === emergencyType)?.label}
              </span>

              <div className="space-y-2.5">
                {(firstAidChecklists[emergencyType] || firstAidChecklists["cardiac"]).map((tip, index) => (<div key={index} className="flex gap-2.5 bg-white/5 p-2 rounded-xl border border-white/5">
                    <span className="text-amber-400 font-black shrink-0 text-xs mt-0.5">⚠️</span>
                    <p className="text-[11px] text-emerald-100 font-sans leading-relaxed">
                      {tip}
                    </p>
                  </div>))}
              </div>
            </div>

            <div className="bg-emerald-950 p-3 rounded-xl border border-emerald-900 text-[10px] text-emerald-300 flex items-center justify-center gap-1 font-semibold">
              <Shield size={12}/>
              <span>Ensure your own safety first before rendering rescue assistance!</span>
            </div>
          </div>

          {/* Quick assistance phones card */}
          <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-6 text-left space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-gray-150 pb-2">
              National Dispatch Dial Directory
            </h4>
            <div className="space-y-3 text-xs leading-relaxed font-sans text-slate-700">
              <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100">
                <span className="font-semibold">Police Dispatch Support</span>
                <a href="tel:112" className="flex items-center gap-1 text-red-600 font-bold hover:underline">
                  <Phone size={12}/> 112
                </a>
              </div>
              <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100">
                <span className="font-semibold">Medical Ambulance Core</span>
                <a href="tel:102" className="flex items-center gap-1 text-red-600 font-bold hover:underline">
                  <Phone size={12}/> 102
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>);
}
