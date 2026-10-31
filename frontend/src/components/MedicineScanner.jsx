  import React, { useState } from "react";
  import { Camera, FileText, Search, ShieldCheck, Sparkles, AlertTriangle, RefreshCw, Clipboard, Check } from "lucide-react";
  import { POPULAR_MEDICINES } from "../mockData";
  import api from "../services/api";
  import { getLanguage } from "../i18n";
  export default function MedicineScanner() {
      const [selectedMed, setSelectedMed] = useState(POPULAR_MEDICINES[0]);
      const [searchQuery, setSearchQuery] = useState("");
      const [customMedName, setCustomMedName] = useState("");
      const [userNotes, setUserNotes] = useState("");
      const [isScanning, setIsScanning] = useState(false);
      const [report, setReport] = useState(null);
      const [isLoading, setIsLoading] = useState(false);
      const [copied, setCopied] = useState(false);
      // List of filtered medicines based on query
      const filteredMeds = POPULAR_MEDICINES.filter((m) => m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.category.toLowerCase().includes(searchQuery.toLowerCase()));
      const triggerScan = async (medName) => {
          setIsScanning(true);
          setReport(null);
          // Simulate scanning camera focus & sweep for 1.8 seconds
          await new Promise((resolve) => setTimeout(resolve, 1800));
          setIsScanning(false);
          setIsLoading(true);
          try {
              const { data } = await api.post("/ai/scan-med", {
                  medicineName: medName,
                  notes: userNotes,
                  // Phase 2B: answer in the header language (en | hi | mr).
                  language: getLanguage(),
              });
              setReport(data.analysis);
          }
          catch (error) {
              console.error(error);
              setReport(`### **Alternative Report for ${medName}**\n\n* **Status**: Simulated Profile\n* **Usage**: Generates a standard pharmacological advice sheet because the server connection timed out.\n* **General warning**: Keep all prescription medications sealed, out of children's reach, and take strictly as directed under qualified medical supervision.`);
          }
          finally {
              setIsLoading(false);
          }
      };
      const handleCopyReport = () => {
          if (!report)
              return;
          navigator.clipboard.writeText(report);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
      };
      return (<div className="w-full max-w-5xl mx-auto bg-white border border-gray-100 rounded-3xl shadow-xl overflow-hidden" id="medicine-scanner-component">
        {/* Banner */}
        <div className="bg-gradient-to-r from-green-700 to-emerald-600 p-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Camera className="text-white" size={20}/>
            </span>
            <span className="rounded-full bg-emerald-500/30 px-3 py-1 font-semibold text-xs tracking-wide uppercase">
              Computer Vision FDA Module v4
            </span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">Smart Medicine Scanner</h2>
          <p className="mt-2 text-emerald-50 max-w-2xl text-sm leading-relaxed">
            Select or custom-name any pharmaceutical product. Our intelligence reads chemical classifications, dosage guides, potential interactions, and flags warnings.
          </p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left panel - catalog and customize */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-3">
                  1. Select Common Medication
                </h3>
                <div className="relative mb-3">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                  <input id="medicine-search" name="searchQuery" type="text" aria-label="Search the medication catalog" placeholder="Search medication catalog..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-xs shadow-inner" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
                </div>

                <div className="max-h-48 overflow-y-auto border border-gray-100 rounded-xl p-1 bg-gray-50/50 space-y-1">
                  {filteredMeds.map((med, idx) => (<button key={idx} type="button" onClick={() => {
                  setSelectedMed(med);
                  setCustomMedName("");
              }} className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex justify-between items-center cursor-pointer ${selectedMed?.name === med.name && !customMedName
                  ? "bg-green-600 text-white font-medium"
                  : "hover:bg-gray-100 text-gray-700"}`}>
                      <div>
                        <div className="font-semibold">{med.name}</div>
                        <div className={`text-[10px] ${selectedMed?.name === med.name && !customMedName ? "text-green-200" : "text-gray-400"}`}>
                          {med.category}
                        </div>
                      </div>
                      {selectedMed?.name === med.name && !customMedName && (<span className="size-2 rounded-full bg-white animate-ping"></span>)}
                    </button>))}
                </div>
              </div>

              {/* Custom Medicine Option */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                  Or Type Custom Medicine Name:
                </h3>
                <input id="medicine-custom-name" name="customMedName" type="text" aria-label="Custom medicine name" placeholder="Ex. Paracetamol, Lipitor, Losartan, etc." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-green-500 mb-3" value={customMedName} onChange={(e) => {
              setCustomMedName(e.target.value);
              setSelectedMed(null);
          }}/>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Ask specific questions to the Pharmacist (Optional):
                </label>
                <textarea id="medicine-notes" name="userNotes" aria-label="Optional questions for the pharmacist" placeholder="Ex. 'Is it safe to consume during late pregnancy?' or 'Are there serious risks with coffee?'" className="w-full h-16 p-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" value={userNotes} onChange={(e) => setUserNotes(e.target.value)}/>
              </div>

              {/* Scan Initiation Button */}
              <button onClick={() => {
              const targetName = customMedName || selectedMed?.name || "Asprin";
              triggerScan(targetName);
          }} disabled={isScanning || isLoading || (!selectedMed && !customMedName)} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl py-3 px-4 shadow-md shadow-green-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
                {isScanning ? (<>
                    <RefreshCw className="animate-spin text-white" size={18}/>
                    <span>Scanning Package Details...</span>
                  </>) : isLoading ? (<>
                    <RefreshCw className="animate-spin text-white" size={18}/>
                    <span>Compiling FDA Analysis...</span>
                  </>) : (<>
                    <Camera size={18}/>
                    <span>Simulate Computer Vision Scan</span>
                  </>)}
              </button>
            </div>

            {/* Right panel - Simulated camera UI or report display */}
            <div className="lg:col-span-7 border-t lg:border-t-0 lg:border-l border-gray-100 lg:pl-8 pt-6 lg:pt-0">
              {/* If scanning, show camera loader */}
              {isScanning && (<div className="relative h-96 rounded-2xl bg-slate-900 overflow-hidden flex flex-col items-center justify-center text-white border-4 border-slate-800 shadow-inner">
                  {/* Simulated scan bounds */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-2/3 border-2 border-dashed border-green-500 rounded-xl flex items-center justify-center">
                    <div className="text-center animate-pulse">
                      <Camera className="mx-auto text-green-500 mb-2" size={32}/>
                      <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                        Align Packaging
                      </span>
                    </div>
                  </div>

                  {/* Laser line effect */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-green-400 shadow-md shadow-green-400 animate-[bounce_2s_infinite]"></div>

                  {/* Packaging graphic card */}
                  <div className="absolute bottom-6 bg-slate-800/80 backdrop-blur-md rounded-lg p-3 text-left w-3/4 border border-slate-700">
                    <div className="text-xs font-bold text-green-400">Target identified:</div>
                    <div className="text-sm font-semibold">{customMedName || selectedMed?.name}</div>
                    <div className="text-[10px] text-gray-400 mt-1">Acquiring chemical spectroscopic data...</div>
                  </div>
                </div>)}

              {/* If loading FDA result */}
              {isLoading && !isScanning && (<div className="h-96 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="relative">
                    <div className="size-16 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin"></div>
                    <FileText className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-600 animate-pulse" size={24}/>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Processing Drug Taxonomy</h4>
                    <p className="text-xs text-gray-400 mt-1 max-w-[280px]">Consolidating dosage patterns, drug ingredients, FDA warnings, and reminders.</p>
                  </div>
                </div>)}

              {/* Initial standby state */}
              {!isScanning && !isLoading && !report && (<div className="h-96 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50 flex flex-col items-center justify-center text-center p-8">
                  <Camera className="text-gray-300 mb-3" size={48}/>
                  <h4 className="font-semibold text-gray-700 text-sm">Computer Vision Ready</h4>
                  <p className="text-xs text-gray-400 mt-1.5 max-w-sm">
                    Select a medicine like <span className="font-semibold text-emerald-600">Amoxicillin</span> or enter a therapeutic drug. Click the scanning trigger to generate an active clinical safety overview.
                  </p>

                  {/* Mini helper container */}
                  {selectedMed && (<div className="mt-6 bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-left max-w-sm">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                        Quick Facts: {selectedMed.category}
                      </span>
                      <h5 className="font-semibold text-xs text-gray-800">{selectedMed.name}</h5>
                      <p className="text-[11px] text-gray-500 mt-1 italic">{selectedMed.tagline}</p>
                      <p className="text-[11px] text-gray-400 mt-1">{selectedMed.notes}</p>
                    </div>)}
                </div>)}

              {/* Report fully loaded */}
              {!isScanning && !isLoading && report && (<div className="space-y-4 h-[410px] flex flex-col">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="text-emerald-600 animate-pulse" size={18}/>
                      <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Pharmacology Advisory Sheet
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={handleCopyReport} className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-green-600 transition-colors bg-gray-50 hover:bg-green-50 px-2.5 py-1.5 border border-gray-200 rounded-md cursor-pointer">
                        {copied ? (<>
                            <Check size={14} className="text-green-600"/>
                            <span className="text-green-600 font-semibold text-[10px]">Copied</span>
                          </>) : (<>
                            <Clipboard size={14}/>
                            <span className="text-[10px] font-medium">Copy</span>
                          </>)}
                      </button>
                      <button onClick={() => {
                  const targetName = customMedName || selectedMed?.name || "Asprin";
                  triggerScan(targetName);
              }} className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-green-600 transition-colors bg-gray-50 hover:bg-green-50 px-2.5 py-1.5 border border-gray-200 rounded-md cursor-pointer">
                        <RefreshCw size={14}/>
                        <span className="text-[10px] font-medium">Re-Scan</span>
                      </button>
                    </div>
                  </div>

                  {/* Markdown Container */}
                  <div className="flex-1 overflow-y-auto bg-slate-50 rounded-2xl border border-slate-100 p-6 space-y-4 shadow-inner">
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-lg p-3 text-xs">
                      <Sparkles size={14}/>
                      <span>Analyzed using server-side Gemini 3.5 AI clinical parameters.</span>
                    </div>

                    <div className="text-xs text-gray-700 space-y-3 prose leading-relaxed font-sans">
                      {report.split("\n").map((line, idx) => {
                  if (line.startsWith("###")) {
                      return <h3 key={idx} className="font-bold text-xs text-gray-900 border-b border-slate-200 pb-1 mt-4">{line.replace("###", "")}</h3>;
                  }
                  if (line.startsWith("##")) {
                      return <h4 key={idx} className="font-semibold text-xs text-green-700 mt-3">{line.replace("##", "")}</h4>;
                  }
                  if (line.startsWith("**") || line.startsWith("*")) {
                      const cleanLine = line.replace(/\*+/g, "").trim();
                      // Highlight classifications or headings
                      if (cleanLine.includes(":")) {
                          const [heading, desc] = cleanLine.split(":");
                          return (<p key={idx} className="my-1">
                                <strong className="font-semibold text-gray-900">{heading}:</strong>{desc}
                              </p>);
                      }
                      return <p key={idx} className="font-medium text-gray-800 bg-white border border-gray-100 p-2 rounded-lg my-1">{cleanLine}</p>;
                  }
                  if (line.trim() === "")
                      return <div key={idx} className="h-1"/>;
                  return <p key={idx}>{line}</p>;
              })}
                    </div>
                  </div>

                  {/* Extra Disclaimer */}
                  <div className="bg-red-50/50 border border-red-200 text-red-800 rounded-xl p-3 flex gap-2.5 text-[10px] leading-normal">
                    <AlertTriangle className="shrink-0 text-red-600 mt-0.5" size={14}/>
                    <span>
                      <strong>Disclaimer:</strong> This scanner report is compiled via Artificial Intelligence to assist understanding, and does NOT replace the direct face-to-face diagnosis of a qualified practitioner. Never adjust medical dosage without direct consultant consent.
                    </span>
                  </div>
                </div>)}
            </div>
          </div>
        </div>
      </div>);
  }