import React, { useState, useEffect, useRef } from "react";
import { Video, Mic, MicOff, VideoOff, PhoneOff, Tv, MessageSquare, ClipboardList, ShieldAlert, Signal, CheckCircle, Sparkles, FileText, Send, Loader2, Volume2, Camera, Activity, Heart, Info, Download } from "lucide-react";
import { DOCTORS } from "../mockData";
import { checkSymptoms } from "../services/aiService";
export default function VideoConsultation({ appointments, patientName = "John Doe", onNavigateToAppointments }) {
    // Navigation internal state: "pre-call" | "in-call" | "post-call"
    const [sessionStage, setSessionStage] = useState("pre-call");
    // Selected doctor for the video visit
    const [selectedDoctor, setSelectedDoctor] = useState(DOCTORS[0]);
    // Device Check States
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isSharingScreen, setIsSharingScreen] = useState(false);
    const [localStream, setLocalStream] = useState(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    // Speed pre-check metrics
    const [networkLatency, setNetworkLatency] = useState(14);
    const [selectedCamera, setSelectedCamera] = useState("Built-in FaceTime HD Camera (05ac:8514)");
    const [selectedMic, setSelectedMic] = useState("Default Internal Microphone Array");
    const [selectedSpeaker, setSelectedSpeaker] = useState("Built-in MacBook Stereo Speakers");
    const [isTestingAudio, setIsTestingAudio] = useState(false);
    // Symptom details for call summary
    const [chiefComplaint, setChiefComplaint] = useState("");
    const [patientAttachments, setPatientAttachments] = useState([
        "latest_blood_report_Q2.pdf"
    ]);
    const [newAttachment, setNewAttachment] = useState("");
    // In-Call state variables
    const [callTimeLeft, setCallTimeLeft] = useState(900); // 15 mins
    const [vitalHeartRate, setVitalHeartRate] = useState(74);
    const [vitalSpO2, setVitalSpO2] = useState(99);
    const [activeSidebarTab, setActiveSidebarTab] = useState("chat");
    const [isRecording, setIsRecording] = useState(false);
    // Live Chat state variables
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState("");
    const [isDoctorTyping, setIsDoctorTyping] = useState(false);
    // Post-Call state variables
    const [transcriptionLogs, setTranscriptionLogs] = useState([]);
    const [doctorEHRSummary, setDoctorEHRSummary] = useState("Unspecified upper urinary tract consultation or high fatigue clinical review.");
    const [prescribedMeds, setPrescribedMeds] = useState([]);
    const [followUpRequired, setFollowUpRequired] = useState("7 Days — Family Medicine Clinic");
    // Web camera handle
    useEffect(() => {
        if (sessionStage === "pre-call" || sessionStage === "in-call") {
            if (isCameraOn) {
                navigator.mediaDevices?.getUserMedia({ video: true, audio: isMicOn })
                    .then((stream) => {
                    setLocalStream(stream);
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = stream;
                    }
                })
                    .catch((err) => {
                    console.warn("Camera hardware access rejected or disabled. Rendering professional simulated viewport.", err);
                });
            }
            else {
                if (localStream) {
                    localStream.getTracks().forEach(track => track.stop());
                    setLocalStream(null);
                }
            }
        }
        return () => {
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [isCameraOn, sessionStage]);
    // Update Call clock countdown
    useEffect(() => {
        let timer;
        if (sessionStage === "in-call") {
            timer = setInterval(() => {
                setCallTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        completeConsultation();
                        return 0;
                    }
                    return prev - 1;
                });
                // Randomly fluctuate vitals slightly for extreme realism
                setVitalHeartRate(prev => {
                    const change = Math.floor(Math.random() * 3) - 1;
                    const target = prev + change;
                    return target > 110 || target < 55 ? prev : target;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [sessionStage]);
    // Network ping fluctuation simulation
    useEffect(() => {
        const latInterval = setInterval(() => {
            setNetworkLatency(prev => {
                const dev = Math.floor(Math.random() * 5) - 2;
                const result = prev + dev;
                return result < 5 ? 8 : result > 30 ? 12 : result;
            });
        }, 4000);
        return () => clearInterval(latInterval);
    }, []);
    const formatTime = (secs) => {
        const min = Math.floor(secs / 60);
        const sec = secs % 60;
        return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
    };
    const addAttachment = () => {
        if (newAttachment.trim()) {
            setPatientAttachments([...patientAttachments, newAttachment.trim()]);
            setNewAttachment("");
        }
    };
    const removeAttachment = (index) => {
        setPatientAttachments(patientAttachments.filter((_, i) => i !== index));
    };
    // Launch Video Consultation
    const startConsultation = () => {
        setSessionStage("in-call");
        setCallTimeLeft(900); // 15 mins
        // Set initial custom chat greetings
        const greetings = [
            { sender: "system", text: `Secure virtual consultation initiated with ${selectedDoctor.name}.`, time: "Just now" },
            { sender: "system", text: `HIPAA End-to-End Cryptography: Active.`, time: "Just now" },
            { sender: "doctor", text: `Hello ${patientName || "John"}, I am ${selectedDoctor.name}. I have reviewed your personal health coordinates and register files. How are you feeling today?`, time: "1 min ago" }
        ];
        setChatMessages(greetings);
        setTranscriptionLogs([
            "00:01 - Secured video consultation stream established.",
            "00:02 - Patient local camera and device checking approved."
        ]);
    };
    // Terminate Consultation & Generate summary
    const completeConsultation = () => {
        // Generate simulated prescription drugs based on chat or pre-selected parameters
        setPrescribedMeds([
            { name: "Symptomatic Care (Amoxicillin)", dosage: "500 mg", instructions: "1 tablet three times daily for 5 days after food." },
            { name: "Prophylactic Hydration Solution", dosage: "1 pack oral salt", instructions: "Dissolve 1 pack in 1 liter clean water, sip continually." }
        ]);
        setDoctorEHRSummary(`Patient evaluated via interactive video consult. Main complaint: ${chiefComplaint || "Mild fatigue and diagnostic assessment"}. Recommended immediate home rest, high hydration levels, and routine clinical vitals check. Blood Pressure monitoring advised due to existing hypertension matrix.`);
        setSessionStage("post-call");
    };
    // Send message to Doctor / Gemini endpoint
    const handleSendMessage = async (e) => {
        if (e)
            e.preventDefault();
        if (!chatInput.trim())
            return;
        const userMsg = chatInput.trim();
        setChatMessages((prev) => [...prev, { sender: "patient", text: userMsg, time: "Just now" }]);
        setChatInput("");
        setIsDoctorTyping(true);
        setTranscriptionLogs((prev) => [
            ...prev,
            `00:${Math.floor(Math.random() * 50) + 10} - Patient: ${userMsg}`
        ]);
        try {
            // Shared axios instance: applies VITE_API_URL base + the JWT header.
            const data = await checkSymptoms(
                `Respond as ${selectedDoctor.name} (${selectedDoctor.specialization}). The patient is John Doe, who is in a live video consultation with you. They said: "${userMsg}". Provide a concise, highly professional, empathetic, and expert doctor reply. Max 2-3 sentences. Suggest what they should do.`
            );
            // Post doctor response
            setChatMessages((prev) => [
                ...prev,
                {
                    sender: "doctor",
                    text: data.reply || `I understand your concern regarding those symptoms. Let us monitor your metrics closely.`,
                    time: "Just now"
                }
            ]);
            setTranscriptionLogs((prev) => [
                ...prev,
                `01:${Math.floor(Math.random() * 50) + 10} - ${selectedDoctor.name}: ${data.reply?.slice(0, 50)}...`
            ]);
        }
        catch (err) {
            // Fluent local failover script simulation
            setTimeout(() => {
                let doctorText = `I hear you loud and clear. Based on your symptom description, I highly advise taking complete bed rest today. Ensure you continuously monitor your parameters.`;
                if (userMsg.toLowerCase().includes("headache") || userMsg.toLowerCase().includes("pain")) {
                    doctorText = `A persistent migraine can be debilitating. Please avoid looking at direct bright light screens, lay in a comfortable dark room, and drink plenty of warm water.`;
                }
                else if (userMsg.toLowerCase().includes("cough") || userMsg.toLowerCase().includes("throat")) {
                    doctorText = `Understood. Please perform warm saline gargles three times daily and let us monitor your breathing rate closely.`;
                }
                else if (userMsg.toLowerCase().includes("chest") || userMsg.toLowerCase().includes("heart")) {
                    doctorText = `Chest discomfort is something we must observe delicately. Please stay sitting upright, try breathing very slowly, and if any sharp radiating pain starts, we will prompt immediate clinical emergency triage.`;
                }
                setChatMessages((prev) => [
                    ...prev,
                    { sender: "doctor", text: doctorText, time: "Just now" }
                ]);
            }, 1200);
        }
        finally {
            setTimeout(() => {
                setIsDoctorTyping(false);
            }, 1400);
        }
    };
    const runAudioFeedbackTest = () => {
        setIsTestingAudio(true);
        setTimeout(() => {
            setIsTestingAudio(false);
        }, 2000);
    };
    return (<div className="w-full max-w-7xl mx-auto space-y-8 pb-12" id="video-consultation-applet">
      
      {/* HEADER HERO AREA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 text-white p-6 md:p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/45 to-green-900/25 opacity-40 pointer-events-none"></div>
        <div className="space-y-2 z-10 text-left">
          <div className="inline-flex items-center gap-1.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/35 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
            <Video size={12} className="animate-pulse"/>
            <span>Smart Clinic Direct Live Telehealth</span>
          </div>
          <h1 className="text-2xl md:text-3.5xl font-black tracking-tight">
            Advanced Live Consultation Cabin
          </h1>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Direct high-definition video feeds paired with real-time biometric tracking, clinical whiteboard, and instant expert diagnostic logs.
          </p>
        </div>
        
        {sessionStage === "in-call" && (<div className="bg-red-500/15 border border-red-500/30 text-red-400 font-extrabold px-5 py-3 rounded-2xl flex items-center gap-3 z-10 shrink-0 text-xs animate-pulse">
            <span className="size-2 rounded-full bg-red-600"></span>
            <span>CONSULTATION ACTIVE: {formatTime(callTimeLeft)}</span>
          </div>)}
      </div>

      {/* STAGE A: PRE-CALL SELECTION & METRICS DEVICE CHECKING */}
      {sessionStage === "pre-call" && (<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-300 text-left">
          
          {/* LEFT SECTION: DEVICE MOCK CHECK & LATENCY SELECTION */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* DEVICE TUNING PANEL */}
            <div className="bg-white border border-slate-150 p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="p-1.5 bg-green-50 text-green-700 rounded-lg"><Camera size={18}/></span>
                1. Hardware & Latency Calibration
              </h2>
              
              {/* Webcam Live feed / Mock container */}
              <div className="relative aspect-video rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-inner flex items-center justify-center">
                
                {isCameraOn ? (<video ref={localVideoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"/>) : (<div className="text-slate-500 text-center space-y-2 z-10">
                    <div className="size-14 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                      <VideoOff size={24}/>
                    </div>
                    <p className="text-xs font-bold">Patient Camera Streaming Disabled</p>
                    <p className="text-[10px] text-slate-600">Toggle camera switch below to activate feed</p>
                  </div>)}

                {/* Status HUD overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-slate-950/80 backdrop-blur-sm border border-slate-800 p-3 rounded-xl flex justify-between items-center z-20 text-[11px] text-slate-300 font-mono">
                  <div className="flex items-center gap-2">
                    <Signal size={12} className={networkLatency < 20 ? "text-emerald-500" : "text-amber-500"}/>
                    <span>Ping latency: <strong className="text-white">{networkLatency} ms</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#16A34A]/25 border border-[#16A34A]/40 text-emerald-400 px-2.5 py-0.5 rounded text-[9px] font-black uppercase">
                    <span>Active HUD</span>
                  </div>
                </div>

                <div className="absolute top-4 right-4 bg-slate-950/70 text-slate-300 text-[10px] uppercase font-bold py-1 px-2 rounded-lg backdrop-blur-sm tracking-wider">
                  Patient Self Mirror
                </div>
              </div>

              {/* Toggles bar */}
              <div className="flex justify-center gap-4 py-1.5">
                <button type="button" onClick={() => setIsCameraOn(!isCameraOn)} className={`flex items-center gap-2 px-5 py-3 rounded-xl border font-bold text-xs shadow-xs transition duration-150 cursor-pointer ${isCameraOn
                ? "bg-emerald-50 border-emerald-100 text-[#16A34A] hover:bg-emerald-100/50"
                : "bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200/50"}`}>
                  {isCameraOn ? <Video size={15}/> : <VideoOff size={15}/>}
                  <span>{isCameraOn ? "Camera: Stream Active" : "Camera: Off"}</span>
                </button>

                <button type="button" onClick={() => setIsMicOn(!isMicOn)} className={`flex items-center gap-2 px-5 py-3 rounded-xl border font-bold text-xs shadow-xs transition duration-150 cursor-pointer ${isMicOn
                ? "bg-emerald-50 border-emerald-101 text-[#16A34A] hover:bg-emerald-100/50"
                : "bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200/50"}`}>
                  {isMicOn ? <Mic size={15}/> : <MicOff size={15}/>}
                  <span>{isMicOn ? "Microphone: Live" : "Mic: Muted"}</span>
                </button>
              </div>

              {/* Advanced select menus */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Camera Source</label>
                  <select value={selectedCamera} onChange={(e) => setSelectedCamera(e.target.value)} className="w-full text-[11px] p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500">
                    <option value="Built-in FaceTime HD Camera (05ac:8514)">FaceTime HD Camera (05ac)</option>
                    <option value="USB HD Webcam Pro v4">USB HD Webcam Pro v4</option>
                    <option value="Obscura Virtual Camera Overlay">Obscura Virtual Screen</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Microphone Input</label>
                  <select value={selectedMic} onChange={(e) => setSelectedMic(e.target.value)} className="w-full text-[11px] p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500">
                    <option value="Default Internal Microphone Array">Default Mac Microphone</option>
                    <option value="External USB Condenser (Blue Yeti)">USB Condenser Mic (Blue Yeti)</option>
                    <option value="AirPods Pro Active Input">AirPods Pro MIC</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Audio Speakers</label>
                  <div className="flex gap-1.5">
                    <select value={selectedSpeaker} onChange={(e) => setSelectedSpeaker(e.target.value)} className="w-full text-[11px] p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500">
                      <option value="Built-in MacBook Stereo Speakers">MacBook Stereo Speakers</option>
                      <option value="AirPods Pro Stereo Mode">AirPods Pro Wireless</option>
                      <option value="External Headphone Jack Audio">External Headphones</option>
                    </select>
                    <button type="button" onClick={runAudioFeedbackTest} disabled={isTestingAudio} className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition cursor-pointer flex items-center justify-center shrink-0 text-xs" title="Test Audio Output">
                      {isTestingAudio ? (<Loader2 size={13} className="animate-spin text-green-400"/>) : (<Volume2 size={13}/>)}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* PRE-CLINICAL TRIAGE QUESTIONNAIRE */}
            <div className="bg-white border border-slate-150 p-6 md:p-8 rounded-3xl shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="p-1.5 bg-green-50 text-green-700 rounded-lg"><ClipboardList size={18}/></span>
                2. Clinical Reason & Diagnostics Uploader
              </h2>
              
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-700 block">
                  Please briefly detail the core health ailments you wish to review during today's call:
                </label>
                <textarea value={chiefComplaint} onChange={(e) => setChiefComplaint(e.target.value)} rows={3} className="w-full text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 font-sans resize-none placeholder:text-gray-400" placeholder="Enter specific issues here (e.g., severe localized headaches, muscle throbbing, cough for last 4 days, medication adjustment review...)"/>
              </div>

              {/* Attachment file system helper */}
              <div className="space-y-3 pt-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Synchronize Diagnostics & Medical Reports
                </span>
                
                <div className="flex gap-2">
                  <input type="text" value={newAttachment} onChange={(e) => setNewAttachment(e.target.value)} className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500" placeholder="e.g. lab_results_urine_Q1.pdf, chest_xray_scan.png"/>
                  <button type="button" onClick={addAttachment} className="px-4 py-2 bg-slate-950 text-white font-bold rounded-lg text-xs hover:bg-slate-800 transition cursor-pointer">
                    Attach File
                  </button>
                </div>

                {patientAttachments.length > 0 && (<div className="flex flex-wrap gap-2 pt-1">
                    {patientAttachments.map((f, idx) => (<span key={idx} className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-medium px-2.5 py-1 rounded-lg">
                        <FileText size={11} className="text-slate-500"/>
                        <span>{f}</span>
                        <button type="button" onClick={() => removeAttachment(idx)} className="hover:text-red-600 font-black cursor-pointer ml-1 text-slate-400">
                          ×
                        </button>
                      </span>))}
                  </div>)}
              </div>
            </div>

          </div>

          {/* RIGHT SECTION: DOCTOR SELECTION & CLINIC DIRECTORY */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* MATCHED SPECIALIST ROUTER */}
            <div className="bg-white border border-slate-150 p-6 md:p-8 rounded-3xl shadow-sm space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] bg-cyan-50 text-cyan-700 border border-cyan-100 px-2 py-0.5 rounded font-black tracking-wider uppercase">
                  EHR Integration Module
                </span>
                <h2 className="text-lg font-bold text-slate-900">3. Select Medical Provider</h2>
                <p className="text-xs text-gray-400">
                  Select your preferred medical expert for this video call session.
                </p>
              </div>

              {/* LIST OF DOCTORS */}
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {DOCTORS.slice(0, 4).map((doc) => {
                const isSelected = selectedDoctor.id === doc.id;
                return (<div key={doc.id} onClick={() => setSelectedDoctor(doc)} className={`border p-3.5 rounded-2xl flex gap-3.5 cursor-pointer transition ${isSelected
                        ? "border-[#16A34A] bg-green-50/45 shadow-xs"
                        : "border-slate-100 bg-white hover:bg-slate-50"}`}>
                      <img src={doc.image} alt={doc.name} className="size-14 rounded-xl object-cover border border-slate-200 shrink-0"/>
                      <div className="space-y-1.5 text-left min-w-0">
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="font-extrabold text-xs text-slate-900 truncate">{doc.name}</h4>
                          <span className="inline-flex items-center gap-0.5 text-amber-500 text-[10px] font-extrabold shrink-0">
                            ★ {doc.rating}
                          </span>
                        </div>
                        <p className="text-[10px] text-green-700 font-extrabold uppercase tracking-wide">{doc.specialization}</p>
                        <p className="text-[10.5px] text-gray-400 font-sans italic line-clamp-1">"{doc.bio}"</p>
                        
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[9px] text-gray-400 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-md font-semibold font-mono">
                            {doc.experience}
                          </span>
                          
                          <span className="flex items-center gap-1 text-[9px] text-emerald-600 font-bold uppercase tracking-wider">
                            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>Online</span>
                          </span>
                        </div>
                      </div>
                    </div>);
            })}
              </div>

              {/* LAUNCH CORE CTAs */}
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                <button type="button" onClick={startConsultation} className="w-full bg-[#16A34A] hover:bg-[#15803d] text-white font-extrabold rounded-xl py-4 flex items-center justify-center gap-2 transition duration-150 cursor-pointer text-xs shadow-md shadow-green-600/10">
                  <Video size={16}/>
                  <span>Start Instant Video Consultation Now</span>
                </button>
                
                <div className="flex items-center justify-center gap-2 text-[10.5px] text-gray-400 font-semibold font-sans">
                  <ShieldAlert size={12} className="text-slate-400"/>
                  <span>Encrypted HIPAA medical chamber guidelines apply here.</span>
                </div>
              </div>
            </div>

            {/* LIVE ASSISTANCE HELP DESK */}
            <div className="bg-gradient-to-br from-green-950 to-slate-900 text-white p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#16A34A] flex items-center gap-1.5">
                <Sparkles size={13}/>
                <span>Smart Virtual Waiting Queue</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                You can instantly talk to our specialized **24/7 AI Clinical Assistant** if you'd like a preliminary diagnostic briefing before your doctor enters the consultation cabin.
              </p>
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 pt-1 border-t border-slate-800">
                <span>Estimated physical wait:</span>
                <span className="text-[#16A34A] font-extrabold font-mono text-xs">~ 1 minute</span>
              </div>
            </div>

          </div>

        </div>)}

      {/* STAGE B: ACTIVE IMMERSIVE VIDEO CONSULTATION THEATRE */}
      {sessionStage === "in-call" && (<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-300 text-left">
          
          {/* LEFT: LIVE MULTIPLEX STREAM & FLOATING GLASS CONTROLS */}
          <div className="lg:col-span-8 space-y-4">
            
            <div className="relative aspect-video rounded-3xl border-2 border-slate-800 bg-slate-950 overflow-hidden shadow-2xl flex items-center justify-center">
              
              {/* Doctor remote live stream simulated with interactive elements */}
              <div className="absolute inset-0">
                <img src={selectedDoctor.image} alt={selectedDoctor.name} className="w-full h-full object-cover brightness-90 animate-pulse duration-[6000ms]"/>
                
                {/* Visual medical monitor scan grid */}
                <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/35 pointer-events-none"></div>

                {/* HEART OSCILLATION WAVEFORM CARD OVERLAY (Real clinical overlay) */}
                <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md border border-slate-800 py-2.5 px-4 rounded-2xl flex items-center gap-3 z-20">
                  <div className="size-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                    <Heart size={16} className="animate-bounce"/>
                  </div>
                  <div className="text-left font-mono">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Biometrics HR</span>
                    <span className="text-base text-red-400 font-extrabold">{vitalHeartRate} <span className="text-[10px]">bpm</span></span>
                  </div>
                </div>

                <div className="absolute top-4 left-44 bg-slate-950/80 backdrop-blur-md border border-slate-800 py-2.5 px-4 rounded-2xl flex items-center gap-3 z-20">
                  <div className="size-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                    <Activity size={16} className="animate-pulse"/>
                  </div>
                  <div className="text-left font-mono">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Pulse SpO2</span>
                    <span className="text-base text-cyan-400 font-extrabold">{vitalSpO2}%</span>
                  </div>
                </div>

                {/* Doctor indicator tag */}
                <div className="absolute bottom-20 left-4 bg-slate-950/75 text-white py-1 px-3 rounded-lg border border-slate-800 text-xs font-extrabold backdrop-blur-xs flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>{selectedDoctor.name} ({selectedDoctor.specialization}) — Provider Stream</span>
                </div>

                {/* PATIENT MINI VIEW FINDER (Embedded webcam or beautiful mock feed) */}
                <div className="absolute top-4 right-4 w-32 md:w-44 aspect-video rounded-xl bg-slate-900 border-2 border-slate-800 overflow-hidden shadow-2xl z-20 flex items-center justify-center">
                  {isCameraOn ? (<video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]"/>) : (<div className="text-[9px] text-slate-500 font-bold uppercase text-center p-2">
                      Cam muted
                    </div>)}
                  <div className="absolute bottom-1 right-1.5 bg-slate-950/80 px-1.5 py-0.5 rounded text-[8px] text-white font-mono uppercase">
                    You
                  </div>
                </div>

              </div>

              {/* FLOATING HUD CONTROLS BLOCK */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-950/90 backdrop-blur-md border border-slate-800/80 px-4 md:px-6 py-3 rounded-2xl flex items-center gap-3 md:gap-5 z-35 animate-bounce-once">
                
                <button onClick={() => setIsMicOn(!isMicOn)} className={`size-10 rounded-xl flex items-center justify-center transition cursor-pointer text-xs ${isMicOn
                ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                : "bg-red-500 text-white hover:bg-red-600"}`} title={isMicOn ? "Mute Microphone" : "Unmute Mic"}>
                  {isMicOn ? <Mic size={16}/> : <MicOff size={16}/>}
                </button>

                <button onClick={() => setIsCameraOn(!isCameraOn)} className={`size-10 rounded-xl flex items-center justify-center transition cursor-pointer text-xs ${isCameraOn
                ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                : "bg-red-500 text-white hover:bg-red-600"}`} title={isCameraOn ? "Stop Video Camera" : "Start Video"}>
                  {isCameraOn ? <Video size={16}/> : <VideoOff size={16}/>}
                </button>

                <button onClick={() => setIsSharingScreen(!isSharingScreen)} className={`size-10 rounded-xl flex items-center justify-center transition cursor-pointer text-xs ${isSharingScreen
                ? "bg-[#16A34A] text-white hover:bg-green-700"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`} title={isSharingScreen ? "Stop Sharing Screen" : "Share Clinical Screen"}>
                  <Tv size={16}/>
                </button>

                <button onClick={() => setIsRecording(!isRecording)} className={`size-10 rounded-xl flex items-center justify-center transition cursor-pointer text-xs ${isRecording
                ? "bg-yellow-500 text-slate-950 animate-pulse font-extrabold"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`} title={isRecording ? "Stop Recording Consult" : "Record Consultation"}>
                  <span className={`size-2.5 rounded-full bg-red-600 ${isRecording ? "animate-ping" : ""}`}/>
                </button>

                <div className="w-px h-6 bg-slate-800"></div>

                <button onClick={completeConsultation} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-black text-xs transition duration-150 flex items-center gap-2 cursor-pointer shadow-md shadow-red-900/40 shrink-0">
                  <PhoneOff size={14}/>
                  <span>End Consult</span>
                </button>

              </div>

            </div>

            {/* DISCLOSURE NOTES */}
            <div className="bg-white border border-slate-150 p-4 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 text-xs text-slate-700 text-left">
                <Info size={16} className="text-cyan-600 shrink-0"/>
                <p className="font-sans leading-relaxed">
                  Your biometric tracking values are fed via your active connected telehealth wearable interface logs.
                </p>
              </div>
              
              <div className="flex gap-2 shrink-0">
                <div className="text-[10px] bg-slate-50 border border-slate-150 py-1 px-3 rounded-lg font-mono text-slate-400">
                  Res: 1080p FHD
                </div>
                <div className="text-[10px] bg-slate-50 border border-slate-150 py-1 px-3 rounded-lg font-mono text-slate-400">
                  Latency: {networkLatency}ms
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT: INTERACTIVE SIDEBAR CLINIC CHAT & EHR RECORD (Connected with Gemini back-end/mock diagnostics!) */}
          <div className="lg:col-span-4 bg-white border border-slate-150 rounded-3xl shadow-xl overflow-hidden flex flex-col h-[520px] max-h-[520px]">
            
            {/* TAB SELECTORS */}
            <div className="grid grid-cols-2 border-b border-slate-100 bg-slate-50">
              <button type="button" onClick={() => setActiveSidebarTab("chat")} className={`py-3.5 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition cursor-pointer ${activeSidebarTab === "chat"
                ? "border-[#16A34A] text-slate-900 bg-white"
                : "border-transparent text-slate-400 hover:text-slate-600"}`}>
                <MessageSquare size={14}/>
                <span>Medical Chat</span>
              </button>

              <button type="button" onClick={() => setActiveSidebarTab("ehr")} className={`py-3.5 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition cursor-pointer ${activeSidebarTab === "ehr"
                ? "border-[#16A34A] text-slate-900 bg-white"
                : "border-transparent text-slate-400 hover:text-slate-600"}`}>
                <ClipboardList size={14}/>
                <span>EHR Transcripts</span>
              </button>
            </div>

            {/* TAB CONTENT: CHAT */}
            {activeSidebarTab === "chat" && (<div className="flex-1 flex flex-col min-h-0 bg-slate-50/30">
                <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                  {chatMessages.map((msg, i) => {
                    if (msg.sender === "system") {
                        return (<div key={i} className="text-center">
                          <span className="inline-block bg-slate-200/60 border border-slate-300/40 text-[9px] font-mono text-slate-500 rounded px-2.5 py-0.5 tracking-tight">
                            {msg.text}
                          </span>
                        </div>);
                    }
                    const isDoctor = msg.sender === "doctor";
                    return (<div key={i} className={`flex gap-2 max-w-[85%] ${isDoctor ? "self-start" : "self-end ml-auto flex-row-reverse"}`}>
                        {isDoctor && (<img src={selectedDoctor.image} alt="" className="size-7 rounded-lg object-cover border border-slate-200 shrink-0"/>)}
                        <div className="space-y-0.5">
                          <div className={`p-3 rounded-2xl text-xs tracking-wide leading-relaxed shadow-xs text-left ${isDoctor
                            ? "bg-white border border-slate-100 text-slate-900 rounded-tl-none"
                            : "bg-[#16A34A] text-white rounded-tr-none"}`}>
                            {msg.text}
                          </div>
                          <span className={`text-[9px] text-gray-400 block px-1 ${isDoctor ? "text-left" : "text-right"}`}>
                            {msg.time}
                          </span>
                        </div>
                      </div>);
                })}

                  {isDoctorTyping && (<div className="flex gap-2 self-start max-w-[85%]">
                      <img src={selectedDoctor.image} alt="" className="size-7 rounded-lg object-cover border border-slate-200 shrink-0"/>
                      <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none flex items-center justify-center gap-1.5 shadow-xs">
                        <span className="size-1.5 rounded-full bg-slate-300 animate-bounce"></span>
                        <span className="size-1.5 rounded-full bg-slate-300 animate-bounce [animation-delay:0.2s]"></span>
                        <span className="size-1.5 rounded-full bg-slate-300 animate-bounce [animation-delay:0.4s]"></span>
                      </div>
                    </div>)}
                </div>

                {/* BOTTOM CHAT INPUT FIELD */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 bg-white flex gap-1.5">
                  <input type="text" required value={chatInput} onChange={(e) => setChatInput(e.target.value)} className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 font-sans" placeholder="Type message or medical query..."/>
                  <button type="submit" className="p-3 bg-[#16A34A] hover:bg-[#15803d] text-white rounded-xl transition cursor-pointer shrink-0">
                    <Send size={15}/>
                  </button>
                </form>
              </div>)}

            {/* TAB CONTENT: TRANSCRIPT LOG SYSTEM */}
            {activeSidebarTab === "ehr" && (<div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/20 text-left">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block border-b border-slate-100 pb-1.5">
                  Clinical Transcription Log (AI-Transcribed)
                </span>
                
                <div className="space-y-3 font-mono text-[10.5px] text-slate-600 leading-relaxed">
                  {transcriptionLogs.map((log, idx) => (<div key={idx} className="bg-white border border-slate-100 p-2.5 rounded-xl">
                      {log}
                    </div>))}
                </div>

                <div className="p-3 bg-cyan-50/50 border border-cyan-150 rounded-xl text-[10px] text-cyan-800 space-y-1">
                  <div className="font-extrabold flex items-center gap-1">
                    <Sparkles size={11} className="text-cyan-600 animate-pulse"/>
                    <span>Real-time Gemini Audio Transcription</span>
                  </div>
                  <p className="font-sans leading-tight">
                    Voice metrics are translated into structured Clinical EHR logs dynamically for post-consult review.
                  </p>
                </div>
              </div>)}

          </div>

        </div>)}

      {/* STAGE C: POST-CALL DOCUMENT SUMMARY & PRESCRIPTIONS FILE */}
      {sessionStage === "post-call" && (<div className="bg-white border border-slate-150 p-6 md:p-10 rounded-3xl shadow-lg space-y-8 animate-in fade-in zoom-in-95 duration-300 text-left">
          
          {/* Top visual check row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="size-14 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center">
                <CheckCircle size={32}/>
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-slate-900">Consultation Session Concluded</h3>
                <p className="text-xs text-gray-400">
                  Session record filed successfully on <strong className="text-slate-800">2026-06-15</strong>. HIPAA Vault secured.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button type="button" onClick={() => setSessionStage("pre-call")} className="px-5 py-3 border border-slate-200 hover:bg-slate-50 font-bold rounded-xl text-xs transition cursor-pointer">
                Back to Pre-Call Lab
              </button>
              
              <button type="button" onClick={() => window.print()} className="px-5 py-3 bg-slate-950 hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm">
                <Download size={13}/>
                <span>Export / Print Prescriptions</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Core EHR summary block */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-[#16A34A] border-b border-slate-100 pb-1">
                  Clinical Session Narrative Summary
                </h4>
                <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl text-xs text-slate-800 space-y-3 leading-relaxed font-sans">
                  <p className="font-medium">"{doctorEHRSummary}"</p>
                  
                  <div className="pt-3 border-t border-slate-200/50 flex flex-wrap gap-x-6 gap-y-2 text-slate-500 font-mono text-[10px]">
                    <p>Consultant: <strong className="text-slate-800">{selectedDoctor.name}</strong></p>
                    <p>Department: <strong className="text-slate-800">{selectedDoctor.specialization}</strong></p>
                    <p>Duration of Call: <strong className="text-slate-800">15m 00s</strong></p>
                  </div>
                </div>
              </div>

              {/* Patient files diagnostic report */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Associated Diagnostics Files Registered (HIPAA)
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {patientAttachments.map((f, idx) => (<div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2 text-xs">
                      <FileText size={14} className="text-[#16A34A]"/>
                      <span className="font-semibold text-slate-800 truncate">{f}</span>
                    </div>))}
                  {patientAttachments.length === 0 && (<div className="sm:col-span-2 text-xs italic text-gray-400">
                      No files uploaded for this session.
                    </div>)}
                </div>
              </div>

            </div>

            {/* Prescribed Medications and Follow-up */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-white border-2 border-dashed border-slate-200 p-6 rounded-3xl relative overflow-hidden space-y-5">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <FileText size={180}/>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] bg-red-50 text-red-600 border border-red-100 font-extrabold px-2.5 py-0.5 rounded-lg uppercase tracking-wide">
                      Clinical Rx
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">ID: HC-TX2859</span>
                  </div>
                  <h3 className="font-black text-slate-900 text-sm">Professional Digital Prescription</h3>
                  <p className="text-[10.5px] text-gray-400">Generate barcoded files for home delivery or pharmacy pickup</p>
                </div>

                {/* List of drugs */}
                <div className="space-y-3 pt-2">
                  {prescribedMeds.map((med, i) => (<div key={i} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0 text-xs">
                      <div className="flex justify-between items-start font-bold text-slate-900 gap-2">
                        <span>{med.name}</span>
                        <span className="bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded text-[10px] font-mono shrink-0">
                          {med.dosage}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-gray-400 leading-relaxed font-sans mt-1">
                        {med.instructions}
                      </p>
                    </div>))}
                </div>

                {/* Doctor signature overlay */}
                <div className="pt-4 border-t border-slate-100/80 flex justify-between items-end gap-4 text-xs font-sans">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono">Digital Signature Authorized</span>
                    <strong className="text-[#16A34A] block mt-0.5">{selectedDoctor.name}, MD</strong>
                    <span className="text-[9px] text-gray-400 block mt-0.5 font-mono">{selectedDoctor.specialization} Cert No: #851-A2</span>
                  </div>
                  
                  {/* barcode placeholder mockup */}
                  <div className="w-16 h-10 bg-slate-100 border border-slate-200 rounded flex flex-col justify-end p-0.5 overflow-hidden gap-0.5" title="Pharmacy barcode log">
                    <div className="flex justify-between h-full w-full opacity-65">
                      <div className="w-1 bg-black h-full"></div>
                      <div className="w-0.5 bg-black h-full"></div>
                      <div className="w-1 bg-black h-full"></div>
                      <div className="w-2 bg-black h-full"></div>
                      <div className="w-0.5 bg-black h-full"></div>
                      <div className="w-1 bg-black h-full"></div>
                      <div className="w-1.5 bg-black h-full"></div>
                      <div className="w-0.5 bg-black h-full"></div>
                    </div>
                    <span className="text-[7px] text-center text-slate-400 block font-mono leading-none tracking-tight">Rx-CODE</span>
                  </div>
                </div>

              </div>

              {/* Follow-up card */}
              <div className="bg-slate-50 border border-slate-150 p-5 rounded-2xl flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest block">Follow-up Recommendation</span>
                  <p className="text-xs font-black text-slate-900">{followUpRequired}</p>
                </div>
                <button type="button" onClick={() => {
                // Start pre-call again
                setSessionStage("pre-call");
            }} className="px-4 py-2 border border-[#16A34A] text-[#16A34A] bg-white hover:bg-green-50/50 rounded-lg text-[11px] font-black uppercase transition cursor-pointer">
                  Book Slot
                </button>
              </div>

            </div>

          </div>

        </div>)}

    </div>);
}
