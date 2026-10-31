import React, { useEffect, useState } from "react";
import { FileText, Stethoscope, AlertCircle, RefreshCw } from "lucide-react";
import { getMedicalHistory } from "../services/patientService";

export default function MedicalHistoryPanel() {
    const [records, setRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const load = () => {
        setIsLoading(true);
        setError("");
        getMedicalHistory()
            .then((data) => setRecords(data))
            .catch((err) => {
                setError(err?.response?.data?.error || "Could not load medical history. Is the backend server running?");
            })
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        load();
    }, []);

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-5">
                <div>
                    <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                        <Stethoscope size={16} className="text-emerald-600" />
                        Medical History
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">Diagnoses, consultation notes, and lab reports on file with EliteCare.</p>
                </div>
                <button onClick={load} className="size-8 rounded-lg bg-gray-50 hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 flex items-center justify-center border border-gray-200 transition cursor-pointer" title="Refresh">
                    <RefreshCw size={14} />
                </button>
            </div>

            {isLoading && (
                <div className="text-center py-10 text-xs text-gray-400">Loading medical history...</div>
            )}

            {!isLoading && error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <AlertCircle size={14} /> {error}
                </div>
            )}

            {!isLoading && !error && records.length === 0 && (
                <div className="text-center py-10 bg-gray-50/40 rounded-xl border border-dashed border-gray-200">
                    <FileText className="mx-auto text-gray-300 mb-3" size={28} />
                    <h4 className="font-bold text-slate-700 text-sm">No medical history yet</h4>
                    <p className="text-xs text-gray-400 mt-1">Records added by your doctors will appear here.</p>
                </div>
            )}

            {!isLoading && !error && records.length > 0 && (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                    {records.map((rec) => (
                        <div key={rec.id} className="p-3.5 border border-gray-150 rounded-xl hover:bg-gray-50/50 transition">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <span className="text-[9px] text-gray-400 font-bold uppercase">{rec.record_date}</span>
                                    <h4 className="text-xs font-semibold text-slate-800 mt-0.5">{rec.record_type}</h4>
                                    {rec.diagnosis && (
                                        <p className="text-xs text-emerald-700 font-medium mt-1">Diagnosis: {rec.diagnosis}</p>
                                    )}
                                    {rec.notes && <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{rec.notes}</p>}
                                </div>
                                {rec.doctor_name && (
                                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-1 rounded-full whitespace-nowrap shrink-0">
                                        {rec.doctor_name}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
