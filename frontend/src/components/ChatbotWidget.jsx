import React, { useState, useEffect, useRef } from "react";
import { X, Send, Mic, MicOff, Volume2, VolumeX, Bot, Shield, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import api from "../services/api";
import { getLanguage } from "../i18n";
export default function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: "model",
            text: "Hello! I am your EliteCare Resident AI Assistant. Ask me anything about doctors, booking consultations, medications, health scores, or emergency plans!"
        }
    ]);
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen]);
    // Setup Web Speech Recognition API
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const rec = new SpeechRecognition();
            rec.continuous = false;
            rec.interimResults = false;
            rec.lang = "en-US";
            rec.onstart = () => {
                setIsListening(true);
            };
            rec.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                if (transcript) {
                    setInputText(transcript);
                }
            };
            rec.onerror = (err) => {
                console.error("Speech Recognition Error:", err);
                setIsListening(false);
            };
            rec.onend = () => {
                setIsListening(false);
            };
            recognitionRef.current = rec;
        }
    }, []);
    const handleVoiceInput = () => {
        if (!recognitionRef.current) {
            alert("Voice speech recognition is not supported in this browser environment.");
            return;
        }
        if (isListening) {
            recognitionRef.current.stop();
        }
        else {
            recognitionRef.current.start();
        }
    };
    // Speaks model reply aloud via Speech Synthesis API
    const speakText = (text) => {
        if (isMuted)
            return;
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel(); // cancel current speech
            // Strip markdown code headers for cleaner speaking experience
            const cleanText = text.replace(/[*_#`\-]/g, "").substring(0, 200);
            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            window.speechSynthesis.speak(utterance);
        }
    };
    const handleSendMessage = async (e) => {
        if (e)
            e.preventDefault();
        if (!inputText.trim() || isLoading)
            return;
        const userQuery = inputText.trim();
        const updatedMessages = [...messages, { role: "user", text: userQuery }];
        setMessages(updatedMessages);
        setInputText("");
        setIsLoading(true);
        try {
            const { data } = await api.post("/ai/chat", {
                message: userQuery,
                chatHistory: updatedMessages,
                // Phase 2B: reply in the header language (en | hi | mr).
                language: getLanguage(),
            });
            const replyText = data.reply;
            setMessages((prev) => [...prev, { role: "model", text: replyText }]);
            speakText(replyText);
        }
        catch (err) {
            console.error(err);
            setMessages((prev) => [
                ...prev,
                {
                    role: "model",
                    text: "I experienced a temporary connection hiccup. Please verify server connectivity or try again in a few moments!"
                }
            ]);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (<div id="elitecare-chatbot" className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Floating launcher window */}
      <AnimatePresence>
        {isOpen && (<motion.div initial={{ opacity: 0, scale: 0.85, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.85, y: 50 }} className="w-80 md:w-96 h-[480px] bg-white border border-slate-200/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col mb-4 bg-radial from-slate-50 to-white">
            {/* Header console panel */}
            <div className="bg-[#0B2E1E] text-white p-4 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2.5">
                <span className="size-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                  <Bot size={18} className="text-emerald-400 rotate-0 animate-pulse"/>
                </span>
                <div className="text-left font-sans">
                  <h4 className="text-xs font-black tracking-wide flex items-center gap-1.5">
                    EliteCare Resident AI
                    <span className="size-2 rounded-full bg-emerald-400 inline-block animate-ping"></span>
                  </h4>
                  <span className="text-[9px] text-emerald-200 block leading-none font-medium">Auto-pilot voice assistant enabled</span>
                </div>
              </div>

              {/* Toggles items */}
              <div className="flex items-center gap-1">
                <button onClick={() => {
                setIsMuted(!isMuted);
                if (!isMuted)
                    window.speechSynthesis.cancel();
            }} className="p-1.5 hover:bg-emerald-800 rounded-lg transition" title={isMuted ? "Unmute Voice Reading" : "Mute Voice Reading"}>
                  {isMuted ? <VolumeX size={15}/> : <Volume2 size={15}/>}
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-emerald-800 rounded-lg transition">
                  <X size={15}/>
                </button>
              </div>
            </div>

            {/* Chat Body messages list */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs scrollbar-thin">
              {messages.map((m, idx) => (<div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl p-3 shadow-xs leading-relaxed transition-all ${m.role === "user"
                    ? "bg-slate-900 text-white rounded-br-none"
                    : "bg-slate-100 border border-slate-200/65 text-slate-800 rounded-bl-none text-left"}`}>
                    <span className="whitespace-pre-line leading-relaxed font-sans">{m.text}</span>
                  </div>
                </div>))}

              {isLoading && (<div className="flex justify-start">
                  <div className="bg-slate-100 border border-slate-200/60 rounded-2xl rounded-bl-none p-3 flex items-center gap-2 text-slate-500">
                    <Loader2 size={12} className="animate-spin"/>
                    <span>Analyzing clinical vitals...</span>
                  </div>
                </div>)}

              <div ref={messagesEndRef}/>
            </div>

            {/* Input keyboard/speech console */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 flex items-center gap-2 bg-slate-50">
              <button type="button" onClick={handleVoiceInput} className={`p-2.5 rounded-xl border flex items-center justify-center transition-colors shadow-2xs ${isListening
                ? "bg-red-50 text-red-600 border-red-250 animate-pulse"
                : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"}`} title="Talk to text (Voice Assistant)">
                {isListening ? <MicOff size={16}/> : <Mic size={16}/>}
              </button>

              <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder={isListening ? "Listening closely..." : "Ask EliteCare Assistant..."} disabled={isListening} className="flex-1 text-xs border border-slate-200 focus:ring-2 focus:ring-green-500 rounded-xl px-3 py-2.5 outline-none bg-white font-sans text-slate-800"/>

              <button type="submit" disabled={!inputText.trim()} className="p-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-850 transition disabled:opacity-35">
                <Send size={15}/>
              </button>
            </form>

            <div className="bg-slate-100 p-2 text-center text-[9px] text-slate-400 border-t border-slate-150 flex items-center justify-center gap-1">
              <Shield size={10}/>
              <span>General guidelines only. In emergency, tap Emergency Alert immediately.</span>
            </div>
          </motion.div>)}
      </AnimatePresence>

      {/* Floating trigger FAB bubble with smooth loop animations and interactive hover effects */}
      <motion.button onClick={() => setIsOpen(!isOpen)} className="size-14 text-white bg-gradient-to-tr from-slate-900 via-slate-850 to-emerald-950 flex items-center justify-center rounded-full shadow-2xl relative border-2 border-emerald-500/20 group cursor-pointer focus:outline-none" title="Open EliteCare Support Assistant" animate={isOpen ? {
            scale: [1, 1.05, 1],
            boxShadow: [
                "0 10px 25px -5px rgba(0,0, 0, 0.3), 0 0 0 0px rgba(16, 185, 129, 0)",
                "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 0 0 6px rgba(16, 185, 129, 0.2)",
                "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 0 0 0px rgba(16, 185, 129, 0)"
            ]
        } : {
            y: [0, -4, 0],
            boxShadow: [
                "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 0 0 0px rgba(16, 185, 129, 0)",
                "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 0 0 8px rgba(16, 185, 129, 0.35)",
                "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 0 0 0px rgba(16, 185, 129, 0.71)"
            ]
        }} transition={isOpen ? {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
        } : {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
        }} whileHover={{ scale: 1.12, rotate: isOpen ? 90 : [0, -4, 4, 0] }} whileTap={{ scale: 0.93 }}>
        <AnimatePresence mode="wait">
          {isOpen ? (<motion.div key="close-icon" initial={{ rotate: -90, opacity: 0, scale: 0.8 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: 90, opacity: 0, scale: 0.8 }} transition={{ duration: 0.2 }}>
              <X size={22} className="text-emerald-300"/>
            </motion.div>) : (<motion.div key="message-icon" initial={{ rotate: 90, opacity: 0, scale: 0.8 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: -90, opacity: 0, scale: 0.8 }} transition={{ duration: 0.2 }} className="relative flex items-center justify-center">
              <motion.div animate={{
                scale: [1, 1.15, 1]
            }} transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }}>
                <Bot size={24} className="text-emerald-400 group-hover:text-emerald-300"/>
              </motion.div>
            </motion.div>)}
        </AnimatePresence>

        {!isOpen && (<span className="absolute -top-1 -right-1 flex h-4.5 w-4.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4.5 w-4.5 bg-emerald-505 border border-white text-[9px] font-black items-center justify-center text-white font-mono bg-emerald-500">1</span>
          </span>)}
      </motion.button>
    </div>);
}