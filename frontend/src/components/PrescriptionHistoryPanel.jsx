import React, { useEffect, useState } from "react";
import { Pill, AlertCircle, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { getPrescriptions } from "../services/patientService";

const statusStyles = {
    Active: "bg-emerald-50 text-emerald-700",
    Completed: "bg-slate-100 text-slate-600",
    Expired: "bg-red-50 text-red-600",
};

export default function PrescriptionHistoryPanel() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [expandedId, setExpandedId] = useState(null);

    const load = () => {
        setIsLoading(true);
        setError("");
        getPrescriptions()
            .then((data) => setPrescriptions(data))
            .catch((err) => {
                setError(err?.response?.data?.error || "Could not load prescriptions. Is the backend server running?");
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
                        <Pill size={16} className="text-emerald-600" />
                        Prescription History
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">Medicines prescribed by your doctors, with dosage and instructions.</p>
                </div>
                <button onClick={load} className="size-8 rounded-lg bg-gray-50 hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 flex items-center justify-center border border-gray-200 transition cursor-pointer" title="Refresh">
                    <RefreshCw size={14} />
                </button>
            </div>

            {isLoading && (
                <div className="text-center py-10 text-xs text-gray-400">Loading prescriptions...</div>
            )}

            {!isLoading && error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <AlertCircle size={14} /> {error}
                </div>
            )}

            {!isLoading && !error && prescriptions.length === 0 && (
                <div className="text-center py-10 bg-gray-50/40 rounded-xl border border-dashed border-gray-200">
                    <Pill className="mx-auto text-gray-300 mb-3" size={28} />
                    <h4 className="font-bold text-slate-700 text-sm">No prescriptions yet</h4>
                    <p className="text-xs text-gray-400 mt-1">Prescriptions written by your doctors will appear here.</p>
                </div>
            )}

            {!isLoading && !error && prescriptions.length > 0 && (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                    {prescriptions.map((p) => {
                        const isOpen = expandedId === p.id;
                        return (
                            <div key={p.id} className="border border-gray-150 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setExpandedId(isOpen ? null : p.id)}
                                    className="w-full p-3.5 flex items-center justify-between gap-3 hover:bg-gray-50/50 transition cursor-pointer text-left"
                                >
                                    <div>
                                        <span className="text-[9px] text-gray-400 font-bold uppercase">{p.prescription_date}</span>
                                        <h4 className="text-xs font-semibold text-slate-800 mt-0.5">{p.diagnosis || "General Prescription"}</h4>
                                        <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                                            {p.doctor_name} · {p.specialization}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${statusStyles[p.status] || "bg-gray-100 text-gray-600"}`}>
                                            {p.status}
                                        </span>
                                        {isOpen ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                                    </div>
                                </button>

                                {isOpen && (
                                    <div className="px-3.5 pb-3.5 pt-1 border-t border-gray-100 bg-gray-50/40">
                                        {p.notes && <p className="text-[11px] text-gray-500 mb-2 mt-2">{p.notes}</p>}
                                        <div className="space-y-2">
                                            {(p.medicines || []).map((m) => (
                                                <div key={m.id} className="bg-white border border-gray-150 rounded-lg p-2.5">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs font-bold text-slate-800">{m.medicine_name}</span>
                                                        {m.dosage && <span className="text-[10px] text-gray-400 font-semibold">{m.dosage}</span>}
                                                    </div>
                                                    <div className="text-[10px] text-gray-500 mt-1 flex flex-wrap gap-x-3">
                                                        {m.frequency && <span>Frequency: {m.frequency}</span>}
                                                        {m.duration && <span>Duration: {m.duration}</span>}
                                                    </div>
                                                    {m.instructions && (
                                                        <p className="text-[10px] text-gray-400 mt-1 italic">{m.instructions}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
