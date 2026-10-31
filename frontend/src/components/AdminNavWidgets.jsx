import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Plus } from "lucide-react";
import { listUsers } from "../services/adminService";

// Strips the trailing "/api" so "/api/health" can be appended for a raw probe.
const API_ROOT = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");

/**
 * Admin-only right-hand navbar widgets. All polling state lives inside this
 * component so the 60s tick never re-renders the whole App.
 */
export default function AdminNavWidgets({ onOpenSection }) {
    const [isOnline, setIsOnline] = useState(null); // null = not yet known
    const [pendingCount, setPendingCount] = useState(null);
    const [isQuickOpen, setIsQuickOpen] = useState(false);
    const quickRef = useRef(null);
    const prefersReducedMotion = useReducedMotion();

    // System health: green when GET /api/health answers, red when it does not.
    useEffect(() => {
        let cancelled = false;
        const probe = async () => {
            try {
                const res = await fetch(`${API_ROOT}/api/health`, { method: "GET" });
                if (!cancelled) setIsOnline(res.ok);
            } catch {
                if (!cancelled) setIsOnline(false);
            }
        };
        probe();
        const id = setInterval(probe, 60000);
        return () => { cancelled = true; clearInterval(id); };
    }, []);

    // Pending actions: users the API reports as non-active (suspended/blocked).
    // This is real data from /admin/users; the badge hides itself when zero.
    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                const users = await listUsers();
                if (cancelled) return;
                const pending = Array.isArray(users)
                    ? users.filter((u) => u.status && u.status !== "active").length
                    : null;
                setPendingCount(pending);
            } catch {
                if (!cancelled) setPendingCount(null); // fail silently
            }
        };
        load();
        const id = setInterval(load, 60000);
        return () => { cancelled = true; clearInterval(id); };
    }, []);

    // Quick actions dropdown: close on Escape or an outside click.
    useEffect(() => {
        if (!isQuickOpen) return;
        const onKey = (e) => { if (e.key === "Escape") setIsQuickOpen(false); };
        const onDown = (e) => {
            if (quickRef.current && !quickRef.current.contains(e.target)) setIsQuickOpen(false);
        };
        window.addEventListener("keydown", onKey);
        document.addEventListener("mousedown", onDown);
        return () => {
            window.removeEventListener("keydown", onKey);
            document.removeEventListener("mousedown", onDown);
        };
    }, [isQuickOpen]);

    const run = (section) => { setIsQuickOpen(false); onOpenSection(section); };

    return (
        <>
            {/* System status pill */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-100/60 border border-slate-200/50 px-2.5 py-1.5 rounded-full shrink-0 select-none" title="Backend system status">
                <span className={`size-1.5 rounded-full ${isOnline === null ? "bg-slate-300" : isOnline ? "bg-green-600" : "bg-red-600"}`}></span>
                <span className="text-[10px] font-black text-slate-700">System</span>
            </div>

            {/* Pending actions badge — hidden entirely when there is nothing to show */}
            {pendingCount > 0 && (
                <button onClick={() => run("users")} className="hidden md:flex items-center gap-1.5 bg-amber-50/90 border border-amber-200 px-2.5 py-1.5 rounded-full hover:bg-amber-100 transition cursor-pointer shrink-0" title={`${pendingCount} pending user action(s)`}>
                    <span className="text-[10px] font-black text-amber-700">Pending</span>
                    <span className="text-[10px] font-black font-mono text-amber-700 bg-white/70 border border-amber-200 rounded-full px-1.5">{pendingCount}</span>
                </button>
            )}

            {/* Quick actions (+) */}
            <div className="relative" ref={quickRef}>
                <button
                    onClick={() => setIsQuickOpen(!isQuickOpen)}
                    aria-haspopup="menu"
                    aria-expanded={isQuickOpen}
                    aria-label="Quick actions"
                    className="size-8 rounded-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center transition cursor-pointer shadow-sm shadow-green-600/10 shrink-0"
                >
                    <Plus size={15} />
                </button>
                <AnimatePresence>
                    {isQuickOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.97, y: -4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.97, y: -4 }}
                            transition={{ duration: prefersReducedMotion ? 0 : 0.15 }}
                            className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 shadow-2xl rounded-2xl p-2 z-50 text-xs"
                            role="menu"
                        >
                            <button onClick={() => run("users")} role="menuitem" className="w-full text-left px-3 py-2.5 rounded-xl text-slate-800 hover:bg-slate-50 transition font-medium cursor-pointer">Add User</button>
                            <button onClick={() => run("hospitals")} role="menuitem" className="w-full text-left px-3 py-2.5 rounded-xl text-slate-800 hover:bg-slate-50 transition font-medium cursor-pointer">Add Hospital</button>
                            <button onClick={() => run("reports")} role="menuitem" className="w-full text-left px-3 py-2.5 rounded-xl text-slate-800 hover:bg-slate-50 transition font-medium cursor-pointer">Export Report</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
