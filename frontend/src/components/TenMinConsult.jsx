import React, { useState, useEffect, useRef } from "react";
import { Clock, Send, HelpCircle, Check } from "lucide-react";
import { DOCTORS } from "../mockData";
import { motion, AnimatePresence } from "motion/react";

export default function TenMinConsult({ onAddXP, patientName }) {
    const [queueState, setQueueState] = useState("not-started");
    const [timerCount, setTimerCount] = useState(8); // Match seconds
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    // Chat list
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    // Interactive goals inside chat
    const [chatTargets, setChatTargets] = useState([
        { id: "ct1", text: "Communicate onset symptom times", done: false },
        { id: "ct2", text: "Report resting pulse / temperature logs", done: false }
    ]);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isTyping]);

    // Queue finder simulation
    const startQueueFinder = () => {
        setQueueState("searching");
        setTimerCount(8);
        onAddXP(15, 5); // XP on connecting query
    };

    useEffect(() => {
        let interval;
        if (queueState === "searching") {
            interval = setInterval(() => {
                setTimerCount((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);

                        // FIX: case-insensitive / trimmed match against specialization,
                        // with a safe fallback if DOCTORS is empty or has no GP entry.
                        const gpDoc =
                            DOCTORS.find(
                                (d) =>
                                    typeof d.specialization === "string" &&
                                    d.specialization.trim().toLowerCase() === "general practitioner"
                            ) || DOCTORS[0] || null;

                        setSelectedDoctor(gpDoc);
                        setQueueState("connected");

                        if (gpDoc) {
                            // Push Welcome messages
                            setMessages([
                                {
                                    id: "m1",
                                    sender: "doctor",
                                    text: `Hello ${patientName || "Guest"}, I am ${gpDoc.name}. I've just loaded your secure EliteCare clinical dossier file. How can I assist you with your health symptoms today?`,
                                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                }
                            ]);
                            onAddXP(30, 10); // Reward connection
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [queueState]);

    // Custom responder doctor messages
    const handleSendMessage = (e) => {
        e.preventDefault();

        // FIX: guard against double-submit (double click / double Enter) while
        // there's no text, or while the doctor "typing" response is already in flight.
        if (!inputText.trim() || isTyping) return;

        const userMsg = {
            id: "u-" + Date.now(),
            sender: "patient",
            text: inputText.trim(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, userMsg]);
        setInputText("");

        // Set target triggers
        const txtLower = userMsg.text.toLowerCase();
        let targetsUpdated = [...chatTargets];
        if (txtLower.includes("day") || txtLower.includes("week") || txtLower.includes("hours") || txtLower.includes("since")) {
            targetsUpdated = targetsUpdated.map(t => t.id === "ct1" ? { ...t, done: true } : t);
        }
        if (txtLower.includes("pulse") || txtLower.includes("temp") || txtLower.includes("degree") || txtLower.includes("rate") || txtLower.includes("bpm")) {
            targetsUpdated = targetsUpdated.map(t => t.id === "ct2" ? { ...t, done: true } : t);
        }
        setChatTargets(targetsUpdated);

        // Doctor is typing simulation
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            let responseText = "Understood. Our clinical rules imply mapping this configuration under careful observation. Do you experience associated headaches or fever spikes?";
            if (txtLower.includes("head") || txtLower.includes("pain") || txtLower.includes("ache")) {
                responseText = "I see. Structural cephalalgia can arise from vascular fluctuations. I recommend tracking resting blood pressure immediately. If pressure checks optimal, stay hydrated and rest under comfortable lighting.";
            }
            else if (txtLower.includes("cough") || txtLower.includes("throat") || txtLower.includes("cold")) {
                responseText = "Understood. Respiratory inflammation is common. Inhale steam once daily, stay hydrated, and observe temperature intervals. I will queue a mild saline gargle recipe in your clinical inbox file.";
            }
            else if (txtLower.includes("allerg") || txtLower.includes("rash") || txtLower.includes("itch")) {
                responseText = "Dermatological hypersensitivity can map to external environmental allergens. Keep the surface clean, dry, and apply a soothing lotion. I suggest booking an advanced dermatological evaluation if it persists.";
            }
            const docMsg = {
                id: "d-" + Date.now(),
                sender: "doctor",
                text: responseText,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages((prev) => [...prev, docMsg]);
            onAddXP(15, 5); // Small interaction reward points
        }, 1500);
    };

    // Quick symptom taps
    const handleQuickSymptomTap = (sym) => {
        setInputText(`Hello doctor, I am currently experiencing ${sym}.`);
        onAddXP(10, 2);
    };

    const completedTargets = chatTargets.filter(t => t.done).length;
    const showBonusAward = completedTargets === chatTargets.length && chatTargets.length > 0;

    return (<div className="space-y-8 animate-fade-in w-full max-w-7xl mx-auto p-4" id="ten-min-consult-applet">
      
      {/* Top Banner layout */}
      <div className="bg-gradient-to-r from-red-900 to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-lg relative overflow-hidden text-left">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Clock size={150}/>
        </div>
        <div className="max-w-2xl space-y-3 z-10 relative">
          <span className="text-[10px] bg-red-500/30 text-red-200 border border-red-400/30 px-3 py-1 rounded-full uppercase tracking-wider font-extrabold flex items-center gap-1 w-fit">
            ❤️ Live Emergency Clinic Access
          </span>
          <h2 className="text-xl md:text-3xl font-black tracking-tight leading-tight">
            10-Minute Rapid Consultation Portal
          </h2>
          <p className="text-xs md:text-sm text-red-100 font-sans leading-relaxed">
            Skip the lobby queue entirely. Connect with active, on-duty clinical practitioners in under 10 seconds. Log answers to secure +50 Health Coins.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Matchmaker or Active Chat (Cols 7) */}
        <div className="lg:col-span-8 flex flex-col h-[520px]">
          
          {/* STATE A: NOT STARTED */}
          {queueState === "not-started" && (<div className="bg-white border border-slate-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center flex-1 space-y-5">
              <div className="size-20 rounded-full bg-red-50 text-red-600 flex items-center justify-center animate-pulse-slow">
                <Clock size={36}/>
              </div>
              <div className="space-y-1.5 max-w-md">
                <h3 className="font-extrabold text-slate-900 text-lg">Instant Medical Matchmaking</h3>
                <p className="text-xs text-slate-500 font-sans leading-relaxed">
                  Our system monitors live on-duty general practitioners who can consult on symptoms immediately. Secure, HIPAA-compliant messaging is established upon connection.
                </p>
              </div>

              <button onClick={startQueueFinder} className="bg-red-650 hover:bg-red-700 text-white font-extrabold px-6 py-3.5 rounded-2xl text-xs transition cursor-pointer shadow-md shadow-red-500/20">
                FIND AVAILABLE ON-DUTY CLINICIAN (+15 XP)
              </button>
            </div>)}

          {/* STATE B: SEARCHING QUEUE ANIMATION */}
          {queueState === "searching" && (<div className="bg-white border border-slate-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center flex-1 space-y-6">
              
              {/* Radar pulse radar */}
              <div className="relative size-24 flex items-center justify-center">
                <span className="absolute inset-0 rounded-full border-2 border-red-500/20 animate-ping"/>
                <span className="absolute inset-4 rounded-full border-2 border-red-500/40 animate-ping"/>
                <div className="size-14 rounded-full bg-red-500 text-white flex items-center justify-center font-mono font-bold text-xs ring-4 ring-red-100">
                  {timerCount}s
                </div>
              </div>

              <div className="space-y-1.5">
                <h3 className="font-extrabold text-slate-900 text-base">Pairing Tele-Video Channels...</h3>
                <p className="text-xs text-slate-455 font-sans">
                  Analyzing current active consulting doctor bandwidth in our primary clinical network.
                </p>
              </div>

              <p className="text-[10px] text-slate-400 italic">
                *Establish secure peer-to-peer telemetry sockets to guard patient clinical privacy.
              </p>
            </div>)}

          {/* STATE C: CONNECTED CHAT WINDOW */}
          {queueState === "connected" && selectedDoctor && (<div className="bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col flex-1 overflow-hidden h-full">
              
              {/* Header Box */}
              <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-950">
                <div className="flex items-center gap-3 text-left">
                  <div className="relative">
                    <img src={selectedDoctor.image} alt={selectedDoctor.name} className="size-10 rounded-full object-cover border border-slate-800"/>
                    <span className="absolute bottom-0 right-0 size-3 rounded-full bg-emerald-500 border-2 border-slate-900"/>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-white">{selectedDoctor.name}</h4>
                    <span className="text-[9.5px] text-[#4ADE80] font-bold block">{selectedDoctor.specialization} • On-Duty Duty</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[9px] bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded font-mono font-bold animate-pulse">
                     SECURE REALTIME CHAT
                  </span>
                </div>
              </div>

              {/* Chat Log container */}
              <div className="flex-1 bg-slate-50/50 p-4 overflow-y-auto space-y-4">
                {messages.map((m) => (<div key={m.id} className={`flex items-start gap-2 max-w-md ${m.sender === "patient" ? "ml-auto justify-end text-right" : "text-left"}`}>
                    {m.sender !== "patient" && (<span className="size-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 border border-slate-200">
                        👨‍⚕️
                      </span>)}
                    <div className="space-y-0.5">
                      <div className={`p-3 rounded-2xl text-xs font-sans leading-relaxed ${m.sender === "patient"
                    ? "bg-red-650 text-white rounded-tr-none"
                    : "bg-white border border-slate-150 text-slate-800 rounded-tl-none shadow-2xs"}`}>
                        {m.text}
                      </div>
                      <span className="text-[8.5px] text-slate-400 block font-mono px-1">{m.time}</span>
                    </div>
                  </div>))}

                {isTyping && (<div className="flex items-start gap-2 max-w-xs text-left">
                    <span className="size-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                      👨‍⚕️
                    </span>
                    <div className="p-3 bg-white border border-slate-150 rounded-2xl rounded-tl-none flex gap-1 items-center">
                      <span className="size-1.5 bg-slate-400 rounded-full animate-bounce"/>
                      <span className="size-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"/>
                      <span className="size-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"/>
                    </div>
                  </div>)}
                <div ref={messagesEndRef}/>
              </div>

              {/* Chat action footer with input */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 flex gap-2 items-center bg-white">
                <input
                  type="text"
                  required
                  placeholder="Ask any health symptom or clinical question..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={isTyping}
                  className="flex-1 bg-slate-50 border border-slate-150 rounded-xl py-2.5 px-4 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500 text-xs text-slate-700 font-sans disabled:opacity-60"
                />
                
                <button
                  type="submit"
                  disabled={isTyping || !inputText.trim()}
                  className="size-10 bg-red-650 hover:bg-red-700 text-white rounded-xl flex items-center justify-center shrink-0 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={15}/>
                </button>
              </form>

            </div>)}

        </div>

        {/* Right Side: Chat Targets & Quick Symptoms (Cols 4) */}
        <div className="lg:col-span-4 space-y-6 text-left">
          
          {/* CONSULT OBJECTIVE TARGETS BOX */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs space-y-3.5">
            <div>
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Consultation Objectives</h4>
              <p className="text-[10.5px] text-slate-400 font-sans mt-0.5">Communicate these elements to unlock safety bonus.</p>
            </div>

            <div className="space-y-2">
              {chatTargets.map(t => (<div key={t.id} className="flex gap-2.5 items-start text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="shrink-0 mt-0.5">
                    {t.done ? (<Check className="text-green-600 bg-green-50 size-4 rounded-full border border-green-200" strokeWidth={3}/>) : (<HelpCircle className="text-slate-300 size-4"/>)}
                  </span>
                  <span className={`font-semibold text-[11px] ${t.done ? "line-through text-slate-400" : "text-slate-750"}`}>
                    {t.text}
                  </span>
                </div>))}
            </div>

            {/* Simulated achievement payout */}
            <AnimatePresence>
              {showBonusAward && (<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center space-y-1.5">
                  <h5 className="font-black text-[10.5px] text-amber-900 uppercase">🏆 objective achieved !</h5>
                  <p className="text-[10px] text-amber-800 leading-relaxed font-sans">
                    Fabulous communications metrics! +50 Wellness Coins has been paid out automatically.
                  </p>
                  <button onClick={() => {
                onAddXP(50, 50); // Claim points
                setChatTargets([]); // Erase trigger
            }} className="w-full bg-amber-600 hover:bg-amber-700 text-white font-extrabold py-1 rounded text-[9.5px] cursor-pointer">
                    REDEEM COINS NOW
                  </button>
                </motion.div>)}
            </AnimatePresence>
          </div>

          {/* QUICK SYMPTOM LOG TRIGGERS */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs space-y-3">
            <div>
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Quick Symptom Log</h4>
              <p className="text-[10.5px] text-slate-450">Tap to instantly load into the messenger input bar.</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
            "Mild Migraine / Headache",
            "Spiked Blood Pressure Vitals",
            "Severe Throat tickle / Dry cough",
            "Stomach layout / indigestion",
            "Seasonal pollen hypersensitivity"
        ].map((sym, index) => (<button key={index} onClick={() => handleQuickSymptomTap(sym)} className="text-[10px] bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-700 border border-slate-150 rounded-xl px-2.5 py-1.5 font-medium transition cursor-pointer font-sans">
                  {sym}
                </button>))}
            </div>
          </div>

        </div>

      </div>

    </div>);
}