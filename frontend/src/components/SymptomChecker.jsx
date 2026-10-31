import React, { useState } from "react";
import { Cpu, Send, RefreshCw, AlertCircle, Sparkles, Stethoscope, ChevronRight } from "lucide-react";
import { DOCTORS } from "../mockData";
import { checkSymptoms } from "../services/aiService";
export default function SymptomChecker({ onBookDirect, onNavigateToDoctors }) {
    const [symptomInput, setSymptomInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const sampleSymptoms = [
        "Sudden chest pain and shortness of breath",
        "Dry cough, slight fever and running nose",
        "Red itchy round rash on skin",
        "Chronic lower back pain after workout",
        "Dizziness, headaches and occasional blurry vision",
    ];
    const handleSymptomSubmit = async (text) => {
        if (!text.trim())
            return;
        setIsLoading(true);
        setError(null);
        setSymptomInput(text);
        try {
            // Shared axios instance: applies VITE_API_URL base + the JWT header.
            // Backend responds with { reply, department, urgency }, which is the
            // exact shape this component already renders.
            const data = await checkSymptoms(text);
            setResult(data);
        }
        catch (err) {
            console.error(err);
            // Keep the original user-facing wording for failed requests; only
            // network/other errors fall back to the generic message.
            const message = err?.response
                ? "Failed to consult EliteCare Symptom intelligence. Please retry."
                : err?.message || "An unexpected network error occurred.";
            setError(message);
        }
        finally {
            setIsLoading(false);
        }
    };
    // Find a matching doctor in our system for the analyzed department
    const getMatchingDoctor = () => {
        if (!result || !result.department)
            return undefined;
        return DOCTORS.find((doc) => doc.specialization.toLowerCase() === result.department.toLowerCase());
    };
    const matchingDoctor = getMatchingDoctor();
    return (<div className="w-full max-w-4xl mx-auto rounded-2xl border border-gray-100 bg-white shadow-xl overflow-hidden" id="symptom-checker-component">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-r from-green-600 to-emerald-700 p-8 text-white">
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <Cpu size={120}/>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <span className="inline-flex size-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <Cpu className="text-white" size={22}/>
          </span>
          <span className="rounded-full bg-emerald-500/30 px-3 py-1 font-semibold text-xs tracking-wide uppercase">
            SaaS Diagnostic Engine v2.5
          </span>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight">AI Clinical Symptom Checker</h2>
        <p className="mt-2 text-emerald-50 max-w-2xl text-sm leading-relaxed">
          Powered by Gemini model intelligence tailored with specialized EliteCare medical protocols. Write how you feel, and receive real-time, clinically structured evaluation.
        </p>
      </div>

      <div className="p-8">
        {/* Left/Right Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Controls Section */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <label htmlFor="symptom-details" className="block text-sm font-semibold text-gray-700 mb-2">
                What symptoms are you experiencing?
              </label>
              <div className="relative">
                <textarea id="symptom-details" name="symptoms" className="w-full h-36 rounded-xl border border-gray-200 p-4 pr-12 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm resize-none shadow-inner" placeholder="Describe your symptoms in detail (e.g. 'I have been experiencing mild dull headache behind my eyes and some tension in my neck for the last 3 days')..." value={symptomInput} onChange={(e) => setSymptomInput(e.target.value)} disabled={isLoading}/>
                <button onClick={() => handleSymptomSubmit(symptomInput)} disabled={isLoading || !symptomInput.trim()} className="absolute bottom-4 right-4 inline-flex size-10 items-center justify-center rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-green-600/20" title="Analyze Symptoms">
                  {isLoading ? (<RefreshCw className="animate-spin" size={18}/>) : (<Send size={18}/>)}
                </button>
              </div>
            </div>

            {/* Quick Actions / Sample Symptoms */}
            <div>
              <span className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Or click a sample symptom scenario to test
              </span>
              <div className="flex flex-wrap gap-2">
                {sampleSymptoms.map((symptom, idx) => (<button key={idx} disabled={isLoading} onClick={() => handleSymptomSubmit(symptom)} className="text-left text-xs bg-gray-50 border border-gray-200 hover:border-green-200 hover:bg-green-50/50 rounded-lg px-4 py-2.5 text-gray-700 transition duration-150 ease-in-out cursor-pointer">
                    {symptom}
                  </button>))}
              </div>
            </div>

            {/* Important Notice */}
            <div className="flex gap-3 bg-amber-50/50 border border-amber-200 rounded-xl p-4 text-amber-800 text-xs leading-relaxed">
              <AlertCircle className="shrink-0 text-amber-600" size={18}/>
              <div>
                <strong className="font-semibold block mb-0.5">Emergency Warning:</strong>
                If you are experiencing chest pain, severe shortness of breath, sudden numbness, high fever or intense abdominal agony, please dial your local emergency services (e.g., 911) or proceed immediately to the nearest physical emergency room.
              </div>
            </div>
          </div>

          {/* Results Side */}
          <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-gray-100 lg:pl-8 pt-6 lg:pt-0">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
              AI Diagnostic Insights
            </h3>

            {isLoading && (<div className="h-64 flex flex-col items-center justify-center text-center space-y-4">
                <div className="relative">
                  <div className="size-16 rounded-full border-4 border-green-100 border-t-green-600 animate-spin"></div>
                  <Cpu className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-green-600 animate-pulse" size={24}/>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 text-sm">Deploying Expert System...</h4>
                  <p className="text-xs text-gray-400 mt-1 max-w-[240px]">Analyzing conditions, recommended medical departments and care guidelines.</p>
                </div>
              </div>)}

            {!isLoading && !result && !error && (<div className="h-64 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                <Stethoscope className="text-gray-300 mb-3" size={36}/>
                <p className="text-sm font-medium text-gray-500">No Assessment Loaded</p>
                <p className="text-xs text-gray-400 mt-1">Submit your symptoms on the left to receive an artificial intelligence consultation.</p>
              </div>)}

            {error && (<div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 space-y-2">
                <div className="flex gap-2">
                  <AlertCircle className="text-red-600 shrink-0" size={18}/>
                  <span className="text-xs font-semibold">Diagnostic Failure</span>
                </div>
                <p className="text-xs">{error}</p>
                <button onClick={() => handleSymptomSubmit(symptomInput)} className="text-xs text-red-600 hover:text-red-800 font-medium underline flex items-center gap-1">
                  Retry request <ChevronRight size={12}/>
                </button>
              </div>)}

            {!isLoading && result && (<div className="space-y-6">
                {/* Urgency Badge */}
                <div className="flex justify-between items-center bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <span className="text-xs font-medium text-gray-500">Urgency Assessment:</span>
                  <span className={`px-3 py-1 text-xs font-bold rounded-lg ${result.urgency === "High"
                ? "bg-red-50 border border-red-200 text-red-700"
                : result.urgency === "Medium"
                    ? "bg-amber-50 border border-amber-200 text-amber-700"
                    : "bg-emerald-50 border border-emerald-200 text-emerald-700"}`}>
                    {result.urgency} Priority
                  </span>
                </div>

                {/* Response Text Box */}
                <div className="bg-emerald-50/20 border border-emerald-100 rounded-xl p-5 space-y-3 shadow-sm max-h-72 overflow-y-auto">
                  <div className="flex items-center gap-2 text-emerald-800 border-b border-emerald-100/60 pb-2 mb-2">
                    <Sparkles size={16}/>
                    <span className="text-xs font-bold tracking-wide uppercase">EliteCare Diagnostic Log</span>
                  </div>
                  <div className="text-xs text-gray-700 leading-relaxed font-sans space-y-2 prose">
                    {result.reply.split("\n").map((line, i) => {
                if (line.startsWith("###")) {
                    return <h4 key={i} className="font-bold text-gray-900 mt-3 pt-1 text-xs border-b border-gray-100 pb-0.5">{line.replace("###", "")}</h4>;
                }
                if (line.startsWith("**") || line.startsWith("*")) {
                    return <p key={i} className="font-medium text-gray-800 my-1">{line.replace(/\*+/g, "")}</p>;
                }
                return <p key={i}>{line}</p>;
            })}
                  </div>
                </div>

                {/* Matched Specialist recommendation */}
                {result.department && (<div className="bg-white border border-gray-100 shadow-md rounded-xl p-4">
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Key Suggested Department
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                        <Stethoscope size={20}/>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800">{result.department}</h4>
                        <p className="text-xs text-gray-400">Perfect match spec for your query</p>
                      </div>
                    </div>

                    {matchingDoctor ? (<div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={matchingDoctor.image} alt={matchingDoctor.name} className="size-10 rounded-full object-cover"/>
                          <div>
                            <span className="block text-xs font-semibold text-gray-800">
                              {matchingDoctor.name}
                            </span>
                            <span className="block text-[10px] text-gray-400">
                              {matchingDoctor.experience} · Rat: {matchingDoctor.rating} ★
                            </span>
                          </div>
                        </div>
                        <button onClick={() => onBookDirect(matchingDoctor)} className="text-xs bg-green-600 text-white font-medium hover:bg-green-700 rounded-lg px-2.5 py-1.5 transition cursor-pointer">
                          Book Now
                        </button>
                      </div>) : (<div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-xs text-gray-400">Book general consultation:</span>
                        <button onClick={onNavigateToDoctors} className="text-xs text-green-600 hover:text-green-700 font-semibold flex items-center gap-1">
                          Select Doctor <ChevronRight size={14}/>
                        </button>
                      </div>)}
                  </div>)}
              </div>)}
          </div>
        </div>
      </div>
    </div>);
}
