  import React, { useState, useEffect, useRef } from "react";
  import { Mic, MicOff, Volume2, VolumeX, Sparkles, AlertCircle, RefreshCw, HelpCircle, ArrowRight, Languages } from "lucide-react";
import { checkSymptoms, sendChatMessage } from "../services/aiService";
import {
  SPEECH_LOCALE,
  matchVoiceCommand,
  SAMPLE_VOICE_TRIGGERS,
  VOICE_COMMAND_CHIPS,
} from "../services/voiceService";
import { LANGUAGES, getLanguage } from "../i18n";
import { FEATURES } from "../config/features";
// Sample clinical trigger prompts for easy testing in sandboxed iframes.
// Phase 2B: the list is per language, so the quick buttons speak the language
// the user picked instead of always English.
export default function VoiceAssistance({ onAddXP, onNavigate }) {
      const [isListening, setIsListening] = useState(false);
      const [soundWaveActive, setSoundWaveActive] = useState(false);
      const [spokenText, setSpokenText] = useState("");
      const [aiResponse, setAiResponse] = useState(null);
      const [isFetchingResponse, setIsFetchingResponse] = useState(false);
      const [isSpeaking, setIsSpeaking] = useState(false);
      const [muteSpeak, setMuteSpeak] = useState(false);
      const [errorMessage, setErrorMessage] = useState(null);
      // Phase 2B — the language the microphone listens in. Defaults to whatever
      // the user picked in the header, so English behaviour is unchanged.
      const [voiceLang, setVoiceLang] = useState(() => getLanguage());
      // Recognition ref
      const recognitionRef = useRef(null);
      // Speech synthesis utterance ref
      const utteranceRef = useRef(null);
      useEffect(() => {
          // Initialise Web Speech active instances
          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
          if (SpeechRecognition) {
              const rec = new SpeechRecognition();
              rec.continuous = false;
              rec.interimResults = false;
              rec.lang = "en-US";
              rec.onstart = () => {
                  setIsListening(true);
                  setSoundWaveActive(true);
                  setErrorMessage(null);
              };
              rec.onerror = (e) => {
                  console.error("Speech Recognition Error:", e);
                  setErrorMessage(e.error === "not-allowed"
                      ? "Microphone access denied. If running in an iframe, click the trigger button in the suggestions below for full simulator capability!"
                      : `Voice capture issue: ${e.error}. Try our quick-click simulation prompts below!`);
                  setIsListening(false);
                  setSoundWaveActive(false);
              };
              rec.onend = () => {
                  setIsListening(false);
                  setSoundWaveActive(false);
              };
              rec.onresult = (e) => {
                  const transcript = e.results[0][0].transcript;
                  if (transcript) {
                      setSpokenText(transcript);
                      handleProcessVoiceQuery(transcript);
                  }
              };
              recognitionRef.current = rec;
          }
          return () => {
              // Clean up synthesis on unmount
              if (window.speechSynthesis) {
                  window.speechSynthesis.cancel();
              }
          };
      }, []);
      // Phase 2B: switching the language retunes the live recognition instance
      // rather than rebuilding it, so a session in progress is not dropped.
      useEffect(() => {
          if (recognitionRef.current) {
              recognitionRef.current.lang = SPEECH_LOCALE[voiceLang] || "en-IN";
          }
      }, [voiceLang]);
      // Handle triggering voice Recognition
      const toggleListening = () => {
          // Stop synthesis before listening
          if (window.speechSynthesis) {
              window.speechSynthesis.cancel();
              setIsSpeaking(false);
          }
          if (isListening) {
              recognitionRef.current?.stop();
          }
          else {
              if (!recognitionRef.current) {
                  setErrorMessage("Web Speech Recognition API is unsupported on this browser. Please use our instant touch-to-simulate buttons below!");
                  return;
              }
              try {
                  recognitionRef.current.start();
              }
              catch (err) {
                  console.warn("Retrying start voice control", err);
              }
          }
      };
      // Process voice query via server API
      const handleProcessVoiceQuery = async (queryText) => {
          if (!queryText.trim())
              return;
          // Phase 2B: a navigation phrase goes straight to the screen it names.
          // No AI call, no coins — it is not a health query.
          const command = matchVoiceCommand(queryText, voiceLang);
          if (command && onNavigate) {
              onNavigate(command.tab);
              return;
          }
          setIsFetchingResponse(true);
          setAiResponse(null);
          setErrorMessage(null);
          // Cancel active TTS speak
          if (window.speechSynthesis) {
              window.speechSynthesis.cancel();
              setIsSpeaking(false);
          }
          try {
              // Determine endpoint based on content types
              const isSymptom = queryText.toLowerCase().includes("pain") || queryText.toLowerCase().includes("breath") || queryText.toLowerCase().includes("swelling");
              // Shared axios instance: applies VITE_API_URL base + the JWT header.
              const data = isSymptom
                  ? await checkSymptoms(queryText)
                  : await sendChatMessage(queryText, []);
              const reply = data.reply || data.analysis || "I could not resolve wellness details for that query.";
              setAiResponse(reply);
              // Award user bonus achievements
              onAddXP(30, 15);
              // Speak result out loud
              if (!muteSpeak) {
                  speakResponseText(reply);
              }
          }
          catch (err) {
              console.error("Voice assist error", err);
              // Fallback response for offline or server hiccups
              const fallback = `I have received your voice query: "${queryText}". Based on general wellness guidelines, we suggest logging this directly in your secure health tracking log or booking an immediate consulting slot with our General Practitioner.`;
              setAiResponse(fallback);
              if (!muteSpeak) {
                  speakResponseText(fallback);
              }
          }
          finally {
              setIsFetchingResponse(false);
          }
      };
      // Convert answer back to Voice Speech (TTS)
      const speakResponseText = (text) => {
          if (!window.speechSynthesis)
              return;
          // Remove markdown formatting / HTML for clean synthesis
          const cleanText = text
              .replace(/<[^>]*>/g, "")
              .replace(/[*#_`~]/g, "")
              .trim();
          // Cancel current
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(cleanText);
          // Phase 2B: read the answer in the language the user is listening in.
          // If the platform has no voice for it the browser falls back on its
          // own — same graceful behaviour as before.
          utterance.lang = SPEECH_LOCALE[voiceLang] || "en-US";
          utterance.rate = 1.0;
          utterance.onstart = () => setIsSpeaking(true);
          utterance.onend = () => setIsSpeaking(false);
          utterance.onerror = () => setIsSpeaking(false);
          utteranceRef.current = utterance;
          window.speechSynthesis.speak(utterance);
      };
      // Toggle Speech Playback manually
      const toggleSpeechPlayback = () => {
          if (!window.speechSynthesis)
              return;
          if (isSpeaking) {
              window.speechSynthesis.cancel();
              setIsSpeaking(false);
          }
          else if (aiResponse) {
              speakResponseText(aiResponse);
          }
      };
      return (<div className="w-full max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-300 text-left">
        
        {/* INTRO HERO */}
        <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl text-white relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-green-500/25 text-green-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/20">
              <Volume2 size={12}/>
              <span>Interactive Voice Assist</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2">
              AI Clinical Voice Assistant
            </h1>
            <p className="text-xs text-slate-400 max-w-xl">
              Experience hands-free healthcare queries. Simply speak your acute symptoms or medication doubts, and our Gemini-powered engine will formulate pathways and speak solutions back to you!
            </p>
          </div>

          {/* MUTE CONTROLLER */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
              {/* Phase 2B — which language the mic listens in. */}
              {FEATURES.voiceMultiLanguage && (<label className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300">
                  <Languages size={14} className="text-green-400 shrink-0"/>
                  <span className="sr-only">Voice language</span>
                  <select
                      value={voiceLang}
                      onChange={(e) => setVoiceLang(e.target.value)}
                      aria-label="Voice language"
                      className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer">
                      {LANGUAGES.map((lang) => (<option key={lang.code} value={lang.code} className="bg-slate-900">
                          {lang.nativeLabel}
                      </option>))}
                  </select>
                </label>)}
              <button onClick={() => {
                  setMuteSpeak(!muteSpeak);
                  if (!muteSpeak && window.speechSynthesis) {
                      window.speechSynthesis.cancel();
                      setIsSpeaking(false);
                  }
              }} className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 shrink-0 cursor-pointer ${muteSpeak
                  ? "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-250 animate-pulse"
                  : "bg-green-600 text-white border-green-500 hover:bg-green-750"}`}>
                {muteSpeak ? <VolumeX size={15}/> : <Volume2 size={15}/>}
                <span>{muteSpeak ? "Text-only Mode" : "Voice-speak Active"}</span>
              </button>
          </div>
        </div>

        {/* Phase 2B — the three navigation phrases, as one-tap chips. */}
        {FEATURES.voiceMultiLanguage && (<div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Say or tap:</span>
            {(VOICE_COMMAND_CHIPS[voiceLang] || VOICE_COMMAND_CHIPS.en).map((chip) => (<button
                key={chip.id || chip.text}
                type="button"
                onClick={() => {
                    setSpokenText(chip.text);
                    handleProcessVoiceQuery(chip.text);
                }}
                disabled={!onNavigate}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-green-300 text-[10px] font-bold hover:border-green-500 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
                {chip.label}
              </button>))}
        </div>)}

        {/* ERROR HUD */}
        {errorMessage && (<div className="p-4 bg-amber-50/90 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-900 shadow-sm animate-in fade-in">
            <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5"/>
            <div className="space-y-1">
              <span className="font-extrabold">Mic Permission / API Note</span>
              <p className="leading-relaxed text-amber-800/90">{errorMessage}</p>
            </div>
          </div>)}

        {/* CENTRAL VOICE WAVE & MIC TARGET */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          
          {/* MIC FEEDBACK BOX */}
          <div className="md:col-span-4 bg-white border border-slate-150 p-6 rounded-3xl shadow-xs flex flex-col justify-between items-center text-center space-y-6">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#16A34A] bg-green-50/50 px-3 py-1 rounded-full border border-green-200/50">
              {isListening ? "🎙️ LISTENING ACTIVE..." : "🔇 TOUCH MIC TO TALK"}
            </span>

            {/* PULSING WAVE VISUALISER */}
            <div className="relative size-32 flex items-center justify-center">
              {/* Animated outer ring waves when listening */}
              {soundWaveActive && (<>
                  <div className="absolute inset-0 rounded-full bg-green-500/10 border border-green-500/20 animate-ping duration-1000"></div>
                  <div className="absolute inset-4 rounded-full bg-green-400/20 border border-green-400/30 animate-pulse duration-700"></div>
                </>)}

              {/* Main Clickable Core Button */}
              <button onClick={toggleListening} className={`size-20 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 active:scale-95 cursor-pointer z-10 ${isListening
              ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
              : "bg-[#16A34A] hover:bg-[#15803d] text-white"}`}>
                {isListening ? <MicOff size={32}/> : <Mic size={32}/>}
              </button>
            </div>

            <p className="text-[11px] text-gray-400 leading-normal max-w-56 font-medium">
              {isListening
              ? "Speak clearly into your microphone now. To finish, just stop speaking or press red button."
              : "Tap the green mic to start speech capture session. Remember to grant browser mic permissions!"}
            </p>
          </div>

          {/* INPUT SPEECH & OUTPUT TRANSCRIPT VIEW */}
          <div className="md:col-span-8 bg-white border border-slate-150 p-6 rounded-3xl shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4 text-left">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block border-b border-gray-100 pb-1">
                Active Dialogue Stream
              </span>

              {/* Generated / Transcribed Text Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase block">Spoken Input Transcript:</label>
                <div className="min-h-16 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-mono text-slate-800 flex items-center">
                  {spokenText ? (<p className="font-medium text-slate-900">"{spokenText}"</p>) : (<span className="text-gray-400 italic">"Voice transcript empty. Ask a sample query below to simulate!"</span>)}
                </div>
              </div>

              {/* AI Diagnosis Response output block */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase block">AI Clinical Assistant Advice:</label>
                <div className="min-h-36 p-4 bg-emerald-50/30 rounded-2xl border border-emerald-100/50 flex flex-col justify-between relative">
                  
                  {isFetchingResponse ? (<div className="py-8 flex flex-col items-center justify-center text-center space-y-2 text-slate-500 text-xs font-semibold">
                      <RefreshCw className="animate-spin text-[#16A34A]" size={24}/>
                      <span>Gemini is resolving clinical pathways & formulating speech...</span>
                    </div>) : aiResponse ? (<div className="space-y-4">
                      <div className="text-xs text-slate-800 leading-relaxed font-sans prose prose-slate">
                        {aiResponse.split("\n\n").map((para, k) => (<p key={k} className="mb-2 font-medium" dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}/>))}
                      </div>

                      {/* Speech Player buttons */}
                      <div className="pt-3 border-t border-emerald-100/50 flex items-center justify-between">
                        <span className="text-[10px] text-green-700 font-extrabold flex items-center gap-1">
                          ✨ Clinical advice matched +15 coins granted!
                        </span>
                        <button onClick={toggleSpeechPlayback} className={`px-3 py-1.5 rounded-lg text-[10px] font-black border tracking-wider transition cursor-pointer flex items-center gap-1.5 ${isSpeaking
                  ? "bg-amber-500 text-white border-amber-400 animate-pulse"
                  : "bg-slate-900 hover:bg-slate-800 text-white border-slate-950"}`}>
                          <Volume2 size={12}/>
                          <span>{isSpeaking ? "⏹️ STOP SPEAKING" : "▶️ SPEAK OUT LOUD"}</span>
                        </button>
                      </div>
                    </div>) : (<div className="py-12 flex flex-col items-center justify-center text-center space-y-1 text-gray-300 italic text-xs">
                      <Sparkles size={24} className="text-gray-200"/>
                      <span>Solutions formulated by Resident AI will print and play here.</span>
                    </div>)}

                </div>
              </div>
            </div>
          </div>

        </div>

        {/* SAMPLE QUICK TRIGGERS PANEL */}
        <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl text-left space-y-4">
          <h4 className="font-extrabold text-xs text-slate-700 flex items-center gap-1.5">
            <HelpCircle size={15} className="text-[#16A34A]"/>
            <span>Interactive Simulating Triggers (Click to Ask without microphone)</span>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {(SAMPLE_VOICE_TRIGGERS[voiceLang] || SAMPLE_VOICE_TRIGGERS.en).map((trig, idx) => (<button key={idx} onClick={() => {
                  setSpokenText(trig);
                  handleProcessVoiceQuery(trig);
              }} className="p-3 bg-white hover:bg-green-50/50 border border-gray-150 hover:border-emerald-400 rounded-xl text-left text-[11px] font-medium text-slate-800 hover:text-green-700 transition flex justify-between items-center group cursor-pointer">
                <span className="max-w-[85%]">{trig}</span>
                <ArrowRight size={12} className="text-gray-300 group-hover:text-green-500 transform group-hover:translate-x-1 transition-transform"/>
              </button>))}
          </div>
        </div>

      </div>);
  }
