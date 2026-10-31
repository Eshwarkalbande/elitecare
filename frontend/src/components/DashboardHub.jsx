import React, { useState, useEffect, useMemo } from "react";
import { Terminal, Clock, Stethoscope, Users, CalendarDays, ShieldAlert, Search, Plus, Server, TrendingUp, Heart } from "lucide-react";
export default function DashboardHub({ doctors, appointments }) {
    // Static state data with defaults, dynamically updated
    const [logs, setLogs] = useState([
        { id: "log-1", timestamp: "11:45:10", message: "Emergency SOS triggered: Patient Priya Sharma requesting urgent trauma squad dispatch.", level: "EMERGENCY", tag: "SLA-Triage" },
        { id: "log-2", timestamp: "11:43:24", message: "Cardiology consultant Dr. Sanjay Roy allocated to Appointment #APT892.", level: "SUCCESS", tag: "Scheduler" },
        { id: "log-3", timestamp: "11:38:50", message: "ICU bed inventory updated: EliteCare General Hospital reports 2 beds vacated.", level: "INFO", tag: "Inventory" },
        { id: "log-4", timestamp: "11:35:12", message: "API Gateway latency flagged: 182ms threshold exceeded on Patient portal route.", level: "WARNING", tag: "System" },
        { id: "log-5", timestamp: "11:30:00", message: "SMTP server broadcast complete: May 2026 telehealth wellness letters issued to 450 users.", level: "SUCCESS", tag: "Notifications" },
        { id: "log-6", timestamp: "11:15:45", message: "Telemetry signal established dynamically with wearable watch API.", level: "INFO", tag: "Device" },
        { id: "log-7", timestamp: "11:02:18", message: "De-registration request verified: User ID #usr-76 Removed successfully.", level: "SUCCESS", tag: "Security" },
        { id: "log-8", timestamp: "10:50:22", message: "System Security Audit: Admin User verified successfully via biometric key provider.", level: "INFO", tag: "Audit" }
    ]);
    const [logFilter, setLogFilter] = useState("");
    const [logLevelFilter, setLogLevelFilter] = useState("ALL");
    const [isLiveSimulating, setIsLiveSimulating] = useState(true);
    // Stats Counters
    const [activeNurses, setActiveNurses] = useState(48);
    const [onDutyTechs, setOnDutyTechs] = useState(14);
    const [activeAdmissionsToday, setActiveAdmissionsToday] = useState(9);
    // Simulation timer for new logs
    useEffect(() => {
        if (!isLiveSimulating)
            return;
        const sampleEmergency = [
            "Trauma team dispatched to Mumbai Suburban sector. Est transit 4.5 mins.",
            "High vital flag received: Patient Arjun Singh reported heart rate > 140 BPM.",
            "Emergency backup ambulance allocated to Central Cabin."
        ];
        const sampleWarnings = [
            "ICU Bed inventory falling low (under 8% availability in Western Node).",
            "Minor packet loss detected on active video conferencing server #VID-04.",
            "SMTP API credits approaching lower safety boundary."
        ];
        const sampleInfos = [
            "Routine telemetry packet synced from user wear-device #FIT-304.",
            "Duty roster rotation: Dr. Anjali Gupta checked out of active registry shift.",
            "Database read telemetry report indexed dynamically in 14ms."
        ];
        const sampleSuccess = [
            "Telehealth session #SESS-443 completed. Consultation invoice emitted.",
            "Patient profile added: Sneha Patel registered successfully.",
            "Medical prescription checkout ledger secured in local repository."
        ];
        const interval = setInterval(() => {
            // Pick random severity
            const rand = Math.random();
            let alert;
            const now = new Date();
            const timeStr = now.toTimeString().split(" ")[0];
            if (rand < 0.12) {
                alert = {
                    id: `sim-${Date.now()}`,
                    timestamp: timeStr,
                    message: sampleEmergency[Math.floor(Math.random() * sampleEmergency.length)],
                    level: "EMERGENCY",
                    tag: "SLA-Triage"
                };
            }
            else if (rand < 0.3) {
                alert = {
                    id: `sim-${Date.now()}`,
                    timestamp: timeStr,
                    message: sampleWarnings[Math.floor(Math.random() * sampleWarnings.length)],
                    level: "WARNING",
                    tag: "System"
                };
            }
            else if (rand < 0.65) {
                alert = {
                    id: `sim-${Date.now()}`,
                    timestamp: timeStr,
                    message: sampleSuccess[Math.floor(Math.random() * sampleSuccess.length)],
                    level: "SUCCESS",
                    tag: "Billing"
                };
            }
            else {
                alert = {
                    id: `sim-${Date.now()}`,
                    timestamp: timeStr,
                    message: sampleInfos[Math.floor(Math.random() * sampleInfos.length)],
                    level: "INFO",
                    tag: "Network"
                };
            }
            setLogs(prev => [alert, ...prev.slice(0, 19)]);
            // Keep real-time counts slightly shifting dynamically for high-fidelity feeling
            if (Math.random() > 0.65) {
                setActiveNurses(n => Math.max(40, Math.min(55, n + (Math.random() > 0.5 ? 1 : -1))));
            }
            if (Math.random() > 0.8) {
                setOnDutyTechs(t => Math.max(10, Math.min(18, t + (Math.random() > 0.5 ? 1 : -1))));
            }
        }, 4500);
        return () => clearInterval(interval);
    }, [isLiveSimulating]);
    // Handle triggering manual event log
    const handleManualEventTrigger = () => {
        const timeStr = new Date().toTimeString().split(" ")[0];
        const triggerLog = {
            id: `man-${Date.now()}`,
            timestamp: timeStr,
            message: "MANUAL TRIGGER: Real-time clinical system diagnostics triggered by administrator account.",
            level: "SUCCESS",
            tag: "Audit-Auth"
        };
        setLogs(prev => [triggerLog, ...prev]);
    };
    // Calculated Real-Time Specialty Tracker Density Data
    const specializationDensity = useMemo(() => {
        // Initial core density points for doctors & bookings
        const map = {
            "General Practitioner": { count: 32, bookings: 145, color: "#10b981", hoverColor: "#059669" },
            "Cardiologist": { count: 18, bookings: 98, color: "#3b82f6", hoverColor: "#2563eb" },
            "Neurologist": { count: 14, bookings: 62, color: "#8b5cf6", hoverColor: "#7c3aed" },
            "Dermatologist": { count: 12, bookings: 88, color: "#ec4899", hoverColor: "#db2777" },
            "Pediatrician": { count: 21, bookings: 112, color: "#f59e0b", hoverColor: "#d97706" },
            "Orthopedic": { count: 15, bookings: 75, color: "#14b8a6", hoverColor: "#0d9488" }
        };
        // Blend live onloaded doctor count
        doctors.forEach(doc => {
            const spec = doc.specialization;
            if (map[spec]) {
                map[spec].count += 1;
            }
            else {
                // Fallback for specializations not in the core tracker list keys
                map["General Practitioner"].count += 1;
            }
        });
        // Blend live appointments count
        appointments.forEach(app => {
            const spec = app.specialization;
            if (map[spec]) {
                map[spec].bookings += 1;
            }
            else {
                map["General Practitioner"].bookings += 1;
            }
        });
        return Object.entries(map).map(([name, data]) => ({
            name,
            ...data,
            totalWeight: data.count * 1.5 + data.bookings
        }));
    }, [doctors, appointments]);
    const maxDensityWeight = useMemo(() => {
        return Math.max(...specializationDensity.map(d => d.totalWeight), 1);
    }, [specializationDensity]);
    // Filter logs
    const filteredLogs = useMemo(() => {
        return logs.filter(log => {
            const matchesSearch = log.message.toLowerCase().includes(logFilter.toLowerCase()) ||
                log.tag.toLowerCase().includes(logFilter.toLowerCase());
            const matchesLevel = logLevelFilter === "ALL" || log.level === logLevelFilter;
            return matchesSearch && matchesLevel;
        });
    }, [logs, logFilter, logLevelFilter]);
    // Summary counts for bookings
    const scheduledCount = appointments.filter(a => a.status === "Scheduled").length;
    const completedCount = appointments.filter(a => a.status === "Completed").length;
    return (<div className="space-y-6" id="dashboard-hub-root">
      
      {/* Dynamic Sub-header Badge Context */}
      <div className="flex justify-between items-center bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="size-2 bg-emerald-500 rounded-full animate-ping"/>
          <span className="text-xs font-semibold text-emerald-800">
            Live Stream Diagnostics Node: <strong className="font-mono">ONLINE</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsLiveSimulating(!isLiveSimulating)} className={`px-3 py-1 text-[10px] font-bold rounded-lg border transition ${isLiveSimulating
            ? "bg-emerald-100 border-emerald-200 text-emerald-800"
            : "bg-slate-50 border-slate-200 text-slate-500"}`}>
            {isLiveSimulating ? "Live Streaming: active" : "Live Streaming: paused"}
          </button>
        </div>
      </div>

      {/* SECTION 1: REAL-TIME COUNTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="staff-booking-counts">
        
        {/* Count Card 1: On-duty Clinical Staff */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Clinical Duty Staff</span>
            <div className="bg-sky-50 text-sky-600 p-2 rounded-lg">
              <Stethoscope size={15}/>
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <p className="text-2xl font-black text-slate-800 font-mono">
                {doctors.length + 18}
              </p>
              <span className="text-[10px] text-slate-500 font-medium">Physicians</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Active shifts synchronized: <strong className="text-slate-600">6 centers</strong>
            </p>
          </div>
          <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
            <div className="h-full bg-sky-500" style={{ width: "82%" }}/>
          </div>
        </div>

        {/* Count Card 2: Interactive Nurse / Technician headcount */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Nurses</span>
            <div className="bg-[#047857]/5 text-[#047857] p-2 rounded-lg">
              <Users size={15}/>
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5 font-mono">
              <p className="text-2xl font-black text-slate-800">
                {activeNurses}
              </p>
              <span className="text-[10px] text-slate-500 font-sans font-medium">Duty Desk</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Nursing pool availability: <strong className="text-[#047857]">{100 - activeNurses} on call</strong>
            </p>
          </div>
          <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
            <div className="h-full bg-[#047857]" style={{ width: `${(activeNurses / 70) * 100}%` }}/>
          </div>
        </div>

        {/* Count Card 3: Booking queue live */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Today Scheduled Bookings</span>
            <div className="bg-indigo-50 text-indigo-600 p-2 rounded-lg">
              <CalendarDays size={15}/>
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5 font-mono">
              <p className="text-2xl font-black text-slate-800">
                {scheduledCount + 8}
              </p>
              <span className="text-[10px] text-green-600 font-sans font-extrabold flex items-center gap-0.5">
                • {completedCount} Done
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Active consultations pending: <strong className="text-indigo-600">{scheduledCount} users</strong>
            </p>
          </div>
          <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500" style={{ width: `${(scheduledCount / 15) * 100}%` }}/>
          </div>
        </div>

        {/* Count Card 4: Trauma & SLA Emergency SOS queues */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Critical SOS Triage</span>
            <div className="bg-rose-50 text-rose-600 p-2 rounded-lg animate-pulse">
              <ShieldAlert size={15}/>
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <p className="text-2xl font-black text-rose-600 font-mono">
                {activeAdmissionsToday}
              </p>
              <span className="text-[10px] text-rose-500 font-black tracking-widest uppercase font-mono animate-pulse">ACTIVE</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              SLA Emergency Response: <strong className="text-rose-500">{"< 150s"}</strong>
            </p>
          </div>
          <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
            <div className="h-full bg-rose-500" style={{ width: "95%" }}/>
          </div>
        </div>

      </div>

      {/* SECTION 2: SPECIALTY DENSITY TRACKER & TRIAGE HEALTH SLA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="trackers-row">
        
        {/* Specialty Density Tracker (8 columns wide for maximum details) */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-left">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <TrendingUp size={16} className="text-[#047857]"/>
                <span>Specialization Density Tracker</span>
              </h3>
              <p className="text-[10px] text-slate-400 font-mono uppercase mt-0.5">Weighted metric (Physicians x 1.5 + Bookings)</p>
            </div>
            <div className="text-right text-[10px] font-bold text-slate-400">
              <span className="border border-slate-200 bg-slate-50 px-2 py-1 rounded">Clinical Segments</span>
            </div>
          </div>

          {/* Specialty SVG density bars with high craftsmanship and hover highlights */}
          <div className="space-y-4 pt-2">
            {specializationDensity.map((docSpec) => {
            const weightPercent = (docSpec.totalWeight / maxDensityWeight) * 100;
            return (<div key={docSpec.name} className="group space-y-1">
                  <div className="flex justify-between items-end text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full" style={{ backgroundColor: docSpec.color }}/>
                      <span className="font-extrabold text-slate-800">{docSpec.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ({docSpec.count} Dr. • {docSpec.bookings} Rec)
                      </span>
                    </div>
                    <span className="font-bold text-slate-600 font-mono">
                      {Math.round(weightPercent)}% Density index
                    </span>
                  </div>
                  
                  {/* Dynamic Progress indicator */}
                  <div className="w-full bg-slate-100 h-3.5 rounded-lg overflow-hidden flex relative items-center">
                    <div className="h-full rounded-r-sm transition-all duration-500 ease-out flex items-center" style={{
                    width: `${weightPercent}%`,
                    backgroundColor: docSpec.color,
                    boxShadow: `0 1px 3px ${docSpec.color}15`
                }}/>
                    
                    {/* Tiny stats overlay visible inside the bar container limit */}
                    <span className="absolute left-2.5 text-[8.5px] font-black text-white font-mono drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                      {docSpec.count} Doctors Shifted
                    </span>
                  </div>
                </div>);
        })}
          </div>

          {/* Extra visualization summary */}
          <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-slate-100 text-center text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150/50">
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wide">Primary Pillar</span>
              <strong className="text-sm text-[#047857] block font-mono">General Practice</strong>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150/50">
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wide">Critical Sector</span>
              <strong className="text-sm text-blue-600 block font-mono">Cardiology</strong>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150/50">
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wide">Active Density sum</span>
              <strong className="text-sm text-slate-850 block font-mono">112 Operations</strong>
            </div>
          </div>
        </div>

        {/* Triage Health SLA (4 columns wide) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-left flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                <Heart size={14} className="text-rose-500 animate-pulse"/>
                <span>Triage SLA Health</span>
              </h3>
              <span className="size-2 bg-emerald-500 rounded-full animate-ping"/>
            </div>

            <div className="space-y-4 pt-3 text-xs">
              
              {/* Triage KPI 1 */}
              <div className="space-y-1">
                <div className="flex justify-between items-baseline text-[11px]">
                  <span className="font-semibold text-slate-600">Average SOS dispatch response</span>
                  <span className="font-mono font-bold text-slate-800">1.4 Mins</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: "95%" }}/>
                </div>
              </div>

              {/* Triage KPI 2 */}
              <div className="space-y-1">
                <div className="flex justify-between items-baseline text-[11px]">
                  <span className="font-semibold text-slate-600">Ambulance Routing index</span>
                  <span className="font-mono font-bold text-slate-800">99.2% (Perfect)</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: "99.2%" }}/>
                </div>
              </div>

              {/* Triage KPI 3 */}
              <div className="space-y-1">
                <div className="flex justify-between items-baseline text-[11px]">
                  <span className="font-semibold text-slate-600">Patient routing triage errors</span>
                  <span className="font-mono font-bold text-rose-500">0.05% SLA</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500" style={{ width: "5%" }}/>
                </div>
              </div>

              {/* Triage KPI 4 */}
              <div className="space-y-1">
                <div className="flex justify-between items-baseline text-[11px]">
                  <span className="font-semibold text-slate-600">API/Node telemetry availability</span>
                  <span className="font-mono font-bold text-[#047857]">99.98% / 40ms</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#047857]" style={{ width: "99.9%" }}/>
                </div>
              </div>

            </div>
          </div>

          <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl mt-4 text-[10px] space-y-1.5 leading-tight text-slate-600">
            <div className="flex items-center gap-1.5 text-slate-700 font-extrabold font-mono uppercase">
              <Server size={11} className="text-slate-500"/>
              <span>SLA Node: Triage-Central</span>
            </div>
            <p>Active routing is compliant with global tele-medicine safety certifications. Load level: <span className="font-mono font-black text-emerald-600">LOW</span></p>
          </div>
        </div>

      </div>

      {/* SECTION 3: OPERATIONAL ACTIVITY LOGS (Trace telemetry list with filter & custom simulation tools) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4" id="operational-logs">
        
        {/* Logs title & controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-100 text-left">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Terminal size={15} className="text-slate-800"/>
              <span>System Operational Logs</span>
            </h3>
            <p className="text-[10px] text-slate-400 font-mono uppercase mt-0.5">Real-time signal tracking and administrator auditable platform events</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Search within log */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono" size={11}/>
              <input type="text" placeholder="Query logs (e.g. SOS)..." value={logFilter} onChange={(e) => setLogFilter(e.target.value)} className="text-[10.5px] pl-7 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none w-[170px]"/>
            </div>

            {/* Severity level filter */}
            <select value={logLevelFilter} onChange={(e) => setLogLevelFilter(e.target.value)} className="text-[10.5px] p-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 font-bold focus:outline-none">
              <option value="ALL">ALL SEVERITIES</option>
              <option value="EMERGENCY">EMERGENCY</option>
              <option value="WARNING">WARNING</option>
              <option value="INFO">INFO</option>
              <option value="SUCCESS">SUCCESS</option>
            </select>

            {/* Simulated event trigger */}
            <button onClick={handleManualEventTrigger} className="px-2.5 py-1.5 bg-slate-900 text-white hover:bg-slate-800 transition rounded-lg text-[10.5px] font-bold flex items-center gap-1 cursor-pointer">
              <Plus size={11}/>
              <span>Simulate Event</span>
            </button>

            {/* Clear logs history */}
            <button onClick={() => {
            setLogs([]);
            setLogFilter("");
        }} className="text-[10px] text-rose-500 font-bold border border-rose-100 bg-rose-50 px-2 py-1.5 rounded-lg hover:bg-rose-100 transition cursor-pointer">
              Clear Logs
            </button>

          </div>
        </div>

        {/* Logs list content scrolling panel */}
        <div className="space-y-1.5 max-h-[350px] overflow-y-auto pr-1">
          {filteredLogs.length === 0 ? (<div className="p-8 text-center text-slate-405 text-slate-400 text-xs">
              No matching diagnostic log events trace recorded in the buffer.
            </div>) : (filteredLogs.map((log) => {
            const levelStyles = log.level === "EMERGENCY" ? "bg-rose-100 text-rose-800 border-rose-220 text-rose-800" :
                log.level === "WARNING" ? "bg-amber-100 text-amber-800 border-amber-250 text-amber-805" :
                    log.level === "SUCCESS" ? "bg-emerald-100 text-emerald-800 border-emerald-250 text-emerald-805" :
                        "bg-sky-100 text-sky-800 border-sky-220 text-sky-850";
            return (<div key={log.id} className="p-2.5 border border-slate-100 hover:bg-slate-50/50 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs leading-normal animate-in fade-in slide-in-from-top-1 text-left">
                  <div className="flex items-start md:items-center gap-2.5 flex-1 min-w-0">
                    <span className="text-[9px] text-slate-400 font-mono font-bold flex items-center gap-1 shrink-0 mt-0.5 md:mt-0">
                      <Clock size={11} className="text-slate-300"/>
                      {log.timestamp}
                    </span>
                    
                    {/* Badge */}
                    <span className={`text-[8px] font-bold border rounded px-1.5 py-0.5 shrink-0 font-mono tracking-widest ${levelStyles}`}>
                      {log.level}
                    </span>

                    {/* Tag badge */}
                    <span className="text-[8.5px] bg-slate-100 text-slate-500 rounded px-1.5 font-mono">
                      {log.tag}
                    </span>

                    {/* Log text content */}
                    <p className="text-slate-700 font-medium truncate flex-1 block">
                      {log.message}
                    </p>
                  </div>
                </div>);
        }))}
        </div>

        {/* Buffer stats footer info */}
        <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-slate-100">
          <span>Active telemetry buffer: <strong className="font-mono text-slate-500">{logs.length} / 50</strong> items retained</span>
          <span>SLA Latency average: <strong className="font-mono text-slate-500">42ms</strong></span>
        </div>

      </div>

    </div>);
}
