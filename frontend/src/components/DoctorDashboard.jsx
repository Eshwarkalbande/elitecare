import React, { useState, useEffect } from "react";
import { Users, Stethoscope, Building, CalendarDays, Video, MessageSquare, Bell, TrendingUp, Activity, Settings, ShieldCheck, Clock, Search, Download, Plus, FileText, CheckCircle2, Star, Award } from "lucide-react";
import DashboardHub from "./DashboardHub";
import UsersPanel from "./UsersPanel";
import AppointmentsPanel from "./AppointmentsPanel";
import HospitalsPanel from "./HospitalsPanel";
import ConsultationsPanel from "./ConsultationsPanel";
import ReviewsRatingsPanel from "./ReviewsRatingsPanel";
import ReportsPanel from "./ReportsPanel";
import AnalyticsPanel from "./AnalyticsPanel";
import NotificationsPanel from "./NotificationsPanel";
import MessagesPanel from "./MessagesPanel";
import SettingsPanel from "./SettingsPanel";
import RolesPanel from "./RolesPanel";
import AuditPanel from "./AuditPanel";
import PreConsultSummary from "./hub/PreConsultSummary";
import { FEATURES } from "../config/features";
import { getMyAppointments as getDoctorAppointments } from "../services/doctorService";
export default function DoctorDashboard({ doctors, setDoctors, appointments, setAppointments }) {
    // Navigation tabs (Dashboard is active in the image)
    const [activeSidebarTab, setActiveSidebarTab] = useState("Dashboard");
    // Controls opening separate interactive full drawers/modals for specific sidebar functions
    const [activeModalTab, setActiveModalTab] = useState(null);

    // Phase 1C — the doctor's OWN appointments, used to open a pre-consult
    // brief. The backend only ever returns appointments that belong to this
    // doctor, so there is nothing here that a doctor could browse into.
    const [localAppointments, setLocalAppointments] = useState([]);
    const [briefFor, setBriefFor] = useState(null);
    useEffect(() => {
        if (!FEATURES.preConsultSummary) return undefined;
        let alive = true;
        getDoctorAppointments()
            .then((rows) => alive && setLocalAppointments(Array.isArray(rows) ? rows : []))
            .catch(() => alive && setLocalAppointments([]));
        return () => {
            alive = false;
        };
    }, []);
    // App wide local states for our interactive "Extra Features inside Another"
    const [localUsers, setLocalUsers] = useState([
        {
            id: "PAT-2024-001",
            name: "Ramesh Kumar",
            userType: "Patient",
            email: "ramesh.kumar@gmail.com",
            phone: "+91 98765 43210",
            status: "Active",
            joinedDate: "22 May 2024",
            joinedTime: "10:30 AM",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"
        },
        {
            id: "PAT-2024-002",
            name: "Priya Sharma",
            userType: "Patient",
            email: "priya.sharma@gmail.com",
            phone: "+91 91234 56789",
            status: "Active",
            joinedDate: "18 May 2024",
            joinedTime: "02:15 PM",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
        },
        {
            id: "PAT-2024-003",
            name: "Arun Varma",
            userType: "Patient",
            email: "arun.varma@hotmail.com",
            phone: "+91 99988 77766",
            status: "Pending Checkup",
            joinedDate: "15 May 2024",
            joinedTime: "11:45 AM",
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"
        }
    ]);
    // Toast notifier
    const [toastMessage, setToastMessage] = useState(null);
    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => {
            setToastMessage(null);
        }, 3000);
    };
    // Clinical check-off lists / Ideas
    const [localIdeas, setLocalIdeas] = useState([
        { id: "idea-1", title: "Verify HBA1c progression curves for Type II diabetics", suggestedBy: "Dr. Sarah", date: "Today", tag: "Critical", color: "purple" },
        { id: "idea-2", title: "Assess cardiovascular telemetry reports from ward 4C", suggestedBy: "Dr. Sarah", date: "Today", tag: "Review Needed", color: "blue" },
        { id: "idea-3", title: "Complete e-prescription audits for remote telehealth sessions", suggestedBy: "Cardio-Dept", date: "Yesterday", tag: "Completed", color: "emerald" }
    ]);
    const [newIdeaText, setNewIdeaText] = useState("");
    const [newIdeaTag, setNewIdeaTag] = useState("Critical");
    const [searchQuery, setSearchQuery] = useState("");
    // Temp interactive states for adding doctor inline
    const [newDocName, setNewDocName] = useState("");
    const [newDocSpec, setNewDocSpec] = useState("Cardiologist");
    const [newDocExp, setNewDocExp] = useState(10);
    const [newDocRating, setNewDocRating] = useState(4.8);
    const [newDocFees, setNewDocFees] = useState("₹800");
    const handleAddDoctor = (e) => {
        e.preventDefault();
        if (!newDocName.trim())
            return;
        const newDoc = {
            id: String(doctors.length + 1),
            name: newDocName,
            specialization: newDocSpec,
            experience: `${newDocExp} Years`,
            rating: newDocRating,
            availability: ["Mon", "Wed", "Fri"],
            location: "Main Clinic, Block A",
            bio: "Highly qualified clinical specialist.",
            image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150"
        };
        setDoctors([...doctors, newDoc]);
        setNewDocName("");
        showToast(`Dr. ${newDoc.name} onboarded successfully! Registered into active clinic directories.`);
    };
    // User details & forms inline
    const [newUserName, setNewUserName] = useState("");
    const [newUserEmail, setNewUserEmail] = useState("");
    const [newUserPhone, setNewUserPhone] = useState("");
    const [newUserType, setNewUserType] = useState("Patient");
    const [newUserStatus, setNewUserStatus] = useState("Active");
    const handleAddUser = (e) => {
        e.preventDefault();
        if (!newUserName.trim() || !newUserEmail.trim())
            return;
        const customUser = {
            id: "PAT-2024-" + (localUsers.length + 101),
            name: newUserName,
            userType: newUserType,
            email: newUserEmail,
            phone: newUserPhone || "+91 91000 12000",
            status: newUserStatus,
            joinedDate: "Today",
            joinedTime: "Just now",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
        };
        setLocalUsers([...localUsers, customUser]);
        setNewUserName("");
        setNewUserEmail("");
        setNewUserPhone("");
        showToast(`Patient profile for ${customUser.name} registered into hospital database.`);
    };
    const handleRemoveUser = (id) => {
        setLocalUsers(localUsers.filter(u => u.id !== id));
        showToast(`Patient medical file #${id} archived securely.`);
    };
    const handleCreateIdea = (e) => {
        e.preventDefault();
        if (!newIdeaText.trim())
            return;
        const tagColor = newIdeaTag === "Critical" ? "purple" : newIdeaTag === "Review Needed" ? "blue" : "emerald";
        const ideaObj = {
            id: "clinical-" + Date.now(),
            title: newIdeaText,
            suggestedBy: "Dr. Sarah",
            date: "Just now",
            tag: newIdeaTag,
            color: tagColor
        };
        setLocalIdeas([ideaObj, ...localIdeas]);
        setNewIdeaText("");
        showToast("Clinical check-off item added to your checklist.");
    };
    const SidebarItem = ({ label, icon: Icon, badge, modalTarget }) => {
        const isTabSelected = activeSidebarTab === (modalTarget || label);
        return (<button onClick={() => {
                if (modalTarget) {
                    setActiveSidebarTab(modalTarget);
                }
                else {
                    setActiveSidebarTab(label);
                }
            }} className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition duration-150 cursor-pointer group ${isTabSelected
                ? "bg-[#047857] text-white shadow-md shadow-[#047857]/15"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
        <div className="flex items-center gap-3">
          <Icon size={15} className={isTabSelected ? "text-white" : "text-slate-400 group-hover:text-slate-600"}/>
          <span>{label}</span>
        </div>
        {badge && (<span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${isTabSelected ? "bg-white text-[#047857]" : "bg-green-100 text-[#047857]"}`}>
            {badge}
          </span>)}
      </button>);
    };
    return (<div className="min-h-screen bg-slate-50/50 flex flex-col xl:flex-row gap-6 p-4 max-w-7xl mx-auto align-top text-left font-sans" id="doctor-dashboard-viewport">
      
      {/* SIDEBAR NAVIGATION CONTROL PANEL */}
      <aside className="w-full xl:w-64 bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between shrink-0 shadow-sm" id="doctor-sidebar">
        <div className="space-y-6">
          
          {/* Dashboard Header Brand logo */}
          <div className="flex items-center gap-2 px-1 py-1 border-b border-slate-100 pb-4">
            <div className="size-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-green-600 flex items-center justify-center text-white font-black text-sm shadow-xs">
              🩺
            </div>
            <div>
              <p className="text-sm font-black text-slate-900 tracking-tight leading-none">Doctor Portal</p>
              <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-1 block">EliteCare Clinical</span>
            </div>
          </div>

          {/* Menu segment 1: core overview */}
          <div className="space-y-1.5">
            <h4 className="px-3.5 text-[9px] font-bold text-slate-400 tracking-widest uppercase">Clinical Command</h4>
            <div className="space-y-0.5">
              <SidebarItem label="Dashboard" icon={Activity}/>
              <SidebarItem label="Patients Registry" icon={Users} modalTarget="users"/>
              <SidebarItem label="Registered Hospitals" icon={Building} modalTarget="hospitals"/>
              <SidebarItem label="Physical Booking Logs" icon={CalendarDays} modalTarget="appointments"/>
              <SidebarItem label="Active Teleconsultations" icon={Video} modalTarget="consultations"/>
              <SidebarItem label="Reviews & Patient Feedback" icon={Star} modalTarget="feedback"/>
            </div>
          </div>

          {/* Menu segment 2: interactive elements */}
          <div className="space-y-1.5">
            <h4 className="px-3.5 text-[9px] font-bold text-slate-400 tracking-widest uppercase">Communication</h4>
            <div className="space-y-0.5">
              <SidebarItem label="Announcements & Alerts" icon={Bell} modalTarget="notifications"/>
              <SidebarItem label="Physician Chat Room" icon={MessageSquare} modalTarget="messages"/>
            </div>
          </div>

          {/* Menu segment 3: system sensors and audits */}
          <div className="space-y-1.5">
            <h4 className="px-3.5 text-[9px] font-bold text-slate-400 tracking-widest uppercase">Clinical Sensors</h4>
            <div className="space-y-0.5">
              <SidebarItem label="Electronic Health Records" icon={FileText} modalTarget="reports"/>
              <SidebarItem label="Clinical Analytics Panel" icon={TrendingUp} modalTarget="analytics"/>
            </div>
          </div>

          {/* Menu segment 4: settings and logs */}
          <div className="space-y-1.5">
            <h4 className="px-3.5 text-[9px] font-bold text-slate-400 tracking-widest uppercase">Security & Rules</h4>
            <div className="space-y-0.5">
              <SidebarItem label="Practice settings" icon={Settings} modalTarget="settings"/>
              <SidebarItem label="Roles & On-Call Privileges" icon={ShieldCheck} modalTarget="roles"/>
              <SidebarItem label="Action Log Audits" icon={Clock} modalTarget="audits"/>
            </div>
          </div>

        </div>

        {/* Doctor credentials footer */}
        <div className="border-t border-slate-100 pt-4 mt-6 flex items-center gap-2.5">
          <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150" alt="Doctor Profile" className="size-8.5 rounded-full object-cover border border-slate-200" referrerPolicy="no-referrer"/>
          <div className="text-left leading-none">
            <p className="text-xs font-bold text-slate-800">Dr. Sarah Johnson</p>
            <p className="text-[9.5px] text-slate-400 font-semibold mt-0.5 font-mono">Chief Cardiologist</p>
          </div>
        </div>

      </aside>

      {/* MAIN SYSTEM WORKSPACE CONTENT */}
      <main className="flex-1 space-y-6" id="doctor-workspace">
        
        {/* TOP STATUS BAR CONTAINER */}
        {activeSidebarTab !== "Dashboard Hub" && (<div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm" id="doctor-header-status">
            
            <div className="text-left">
              <p className="text-[10px] font-bold text-[#047857] uppercase tracking-wider">
                Physician Dashboard console
              </p>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {activeSidebarTab === "Dashboard" ? "Doctor Dashboard Portal" : `${activeSidebarTab.charAt(0).toUpperCase() + activeSidebarTab.slice(1)} Console`}
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {activeSidebarTab === "Dashboard"
                ? "Daily patient records, physical vitals buffer, and telemetry audits"
                : `Clinical parameter data panel in specialized view`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Date picker */}
              <div className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-700 font-bold flex items-center gap-2 shadow-sm cursor-pointer hover:bg-slate-50 transition">
                <CalendarDays size={14} className="text-slate-400"/>
                <span>22 Apr 2024 - 22 May 2024</span>
              </div>

              {/* Download records bundle */}
              <button onClick={() => showToast("Exporting physician telemetry records bundle as SSL PDF...")} className="bg-white border border-slate-200 hover:bg-slate-50 transition rounded-xl px-4 py-2 text-xs text-slate-705 font-bold flex items-center gap-2 shadow-sm cursor-pointer">
                <Download size={14} className="text-slate-400"/>
                <span>Export Diagnostics</span>
              </button>

              {/* Alerts bell */}
              <button onClick={() => setActiveSidebarTab("notifications")} className="size-9 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 flex items-center justify-center relative transition cursor-pointer shadow-sm">
                <Bell size={15} className="text-slate-700"/>
                <span className="absolute -top-1.5 -right-1.5 size-5 bg-rose-500 border-2 border-white text-white text-[9px] font-bold rounded-full flex items-center justify-center shrink-0">
                  4
                </span>
              </button>

              {/* Physician profile badge */}
              <div className="flex items-center gap-2 px-2.5 border-l border-slate-200">
                <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150" alt="Doctor avatar" className="size-9 rounded-full object-cover border border-slate-200 shadow-sm" referrerPolicy="no-referrer"/>
                <div className="text-left leading-none hidden sm:block">
                  <p className="text-xs font-black text-slate-800">Dr. S. Johnson</p>
                  <p className="text-[10px] text-emerald-600 font-bold mt-0.5">MD, FACC</p>
                </div>
              </div>

            </div>

          </div>)}

        {/* TOAST SYSTEM POPUP */}
        {toastMessage && (<div className="fixed bottom-6 right-6 z-55 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl border border-slate-800 text-xs shadow-2xl animate-in slide-in-from-bottom-2 duration-150">
            <CheckCircle2 size={13} className="text-emerald-400 shrink-0"/>
            <span className="font-medium">{toastMessage}</span>
          </div>)}

        {/* RENDER DYNAMIC SYSTEM WORKSPACE PANELS */}
        {activeSidebarTab === "Dashboard" ? (<>
            {/* TOP METRICS ROWS */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              
              <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:shadow transition duration-150">
                <div className="space-y-1">
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Total Patients Managed</p>
                  <p className="text-2xl font-black text-slate-800 font-mono">1,840</p>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                    <span>↑ 12.4%</span> <span className="text-slate-400 font-medium">vs last month</span>
                  </span>
                </div>
                <div className="bg-sky-50 text-sky-600 p-3 rounded-xl">
                  <Users size={16}/>
                </div>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:shadow transition duration-150">
                <div className="space-y-1">
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Clinical Partners</p>
                  <p className="text-2xl font-black text-slate-800 font-mono">{doctors.length}</p>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                    <span>↑ 2.5%</span> <span className="text-slate-400 font-medium">onboarded</span>
                  </span>
                </div>
                <div className="bg-emerald-50 text-[#047857] p-3 rounded-xl">
                  <Stethoscope size={16}/>
                </div>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:shadow transition duration-150">
                <div className="space-y-1">
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">My Appointments</p>
                  <p className="text-2xl font-black text-slate-800 font-mono">{appointments.length}</p>
                  <span className="text-[10px] text-amber-600 font-bold flex items-center gap-0.5">
                    <span>Pending</span> <span className="text-slate-400 font-medium">scheduled slots</span>
                  </span>
                </div>
                <div className="bg-violet-50 text-violet-605 p-3 rounded-xl text-violet-600">
                  <CalendarDays size={16}/>
                </div>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:shadow transition duration-150">
                <div className="space-y-1">
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Patient Ratings</p>
                  <p className="text-2xl font-black text-slate-800 font-mono">4.95</p>
                  <span className="text-[10px] text-[#047857] font-bold flex items-center gap-0.5">
                    <span>★ 5.0</span> <span className="text-slate-400 font-medium">overall rating</span>
                  </span>
                </div>
                <div className="bg-amber-50 text-amber-505 p-3 rounded-xl text-amber-500">
                  <Star size={16}/>
                </div>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:shadow transition duration-150">
                <div className="space-y-1">
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Rewards Paid</p>
                  <p className="text-2xl font-black text-slate-800 font-mono">92.4k</p>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                    <span>🪙 Coin rewards</span> <span className="text-slate-400 font-medium">earned</span>
                  </span>
                </div>
                <div className="bg-rose-50 text-rose-600 p-3 rounded-xl">
                  <Award size={16}/>
                </div>
              </div>

            </section>

            {/* LOWER CONTENT ROW (Checklists and dynamic clinical queues) */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Teleconsultation Active Buffer Queue */}
              <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 shadow-sm">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Active Consultation Buffer</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Pre-registered intake queue currently active in EliteCare</p>
                  </div>
                  <button onClick={() => setActiveSidebarTab("appointments")} className="text-[10.5px] font-bold text-[#047857] hover:underline cursor-pointer">
                    View All Logs &gt;
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-bold text-[10px] uppercase">
                        <th className="py-2.5 font-bold">Patient Name</th>
                        <th className="py-2.5 font-bold">In-Person/Video</th>
                        <th className="py-2.5 font-bold">Age/Blood</th>
                        <th className="py-2.5 font-bold">Registered Doctor</th>
                        <th className="py-2.5 font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/50">
                      {appointments.slice(0, 5).map((apt) => (<tr key={apt.id} className="hover:bg-slate-50/40 transition">
                          <td className="py-3 font-semibold text-slate-800 shrink-0">
                            <div className="flex items-center gap-2">
                              <div className="size-6 bg-[#047857]/10 flex items-center justify-center rounded-lg text-emerald-800 text-[9px] font-black shrink-0">
                                EC
                              </div>
                              <div>
                                <p className="font-extrabold text-slate-850 leading-none">{apt.patientName}</p>
                                <p className="text-[9px] text-[#047857] font-semibold mt-0.5">{apt.date}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 text-slate-600 font-mono text-[10.5px]">Video Appointment</td>
                          <td className="py-3 text-slate-500 font-medium">O+ Blood</td>
                          <td className="py-3 text-slate-500 font-semibold">{apt.doctorName}</td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 bg-emerald-50 text-[#047857] border border-emerald-100 rounded text-[9.5px] font-bold">
                              {apt.status}
                            </span>
                          </td>
                        </tr>))}
                    </tbody>
                  </table>
                </div>

                {/* Phase 1C — pre-consult brief. Additive: the table above is
                    untouched, this is an opt-in row underneath it. */}
                {FEATURES.preConsultSummary && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                    <div>
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Pre-Consult Briefs</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        A short, factual summary of what is already on file. It never replaces your own
                        clinical judgement, and it says whether the patient consented to AI.
                      </p>
                    </div>

                    {localAppointments.length === 0 ? (
                      <p className="text-[11px] font-sans text-slate-400">No upcoming appointments to brief.</p>
                    ) : (
                      <div className="space-y-2">
                        {localAppointments.slice(0, 5).map((apt) => (
                          <div key={`brief-${apt.id}`} className="space-y-2">
                            <button
                              type="button"
                              onClick={() => setBriefFor(briefFor === apt.id ? null : apt.id)}
                              className="w-full text-left flex items-center justify-between gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition cursor-pointer"
                            >
                              <span className="text-[11px] font-bold text-slate-700">
                                {apt.patientName || "Patient"} — {apt.appointment_date || apt.date}
                              </span>
                              <span className="text-[10px] font-black text-[#047857] uppercase tracking-wide">
                                {briefFor === apt.id ? "Hide" : "Open brief"}
                              </span>
                            </button>
                            {briefFor === apt.id && <PreConsultSummary appointmentId={apt.id} />}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Physician Task list / Custom clinical tasks */}
              <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 shadow-sm text-left">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">On-Call Task Manager</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Manage daily custom medical tasks and rounds checklist</p>
                </div>

                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {localIdeas.map((idea) => (<div key={idea.id} className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-1 relative group hover:bg-slate-100/60 transition">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 text-[8px] font-black rounded font-mono ${idea.tag === "Critical"
                    ? "bg-red-50 text-red-700 border border-red-100"
                    : idea.tag === "Review Needed"
                        ? "bg-blue-50 text-blue-700 border border-blue-100"
                        : "bg-emerald-50 text-[#047857] border border-emerald-100"}`}>
                          {idea.tag}
                        </span>
                        <button onClick={() => {
                    setLocalIdeas(localIdeas.filter(i => i.id !== idea.id));
                    showToast("Task completed and checked off.");
                }} className="text-slate-300 hover:text-green-600 cursor-pointer transition" title="Complete and Clear Task">
                          <CheckCircle2 size={13} className="hover:scale-110"/>
                        </button>
                      </div>
                      <p className="font-extrabold text-slate-800 mt-1.5 text-[11px] leading-tight-short">{idea.title}</p>
                      <p className="text-[9px] text-slate-400 mt-1 font-sans">Assigned to <span className="font-semibold text-slate-500">{idea.suggestedBy}</span> • {idea.date}</p>
                    </div>))}
                </div>

                {/* Task Generator Form */}
                <form onSubmit={handleCreateIdea} className="pt-2 border-t border-slate-100/80 space-y-2 text-xs">
                  <input id="doc-task-text" name="newIdeaText" type="text" required aria-label="New on-call checklist task" placeholder="New on-call checklist task..." value={newIdeaText} onChange={(e) => setNewIdeaText(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#047857] text-slate-800"/>
                  <div className="flex justify-between gap-2">
                    <select id="doc-task-tag" name="newIdeaTag" aria-label="Task tag" value={newIdeaTag} onChange={(e) => setNewIdeaTag(e.target.value)} className="p-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 font-semibold cursor-pointer">
                      <option value="Critical">🔴 Critical</option>
                      <option value="Review Needed">🔵 Review</option>
                      <option value="Completed">🟢 Completed</option>
                    </select>
                    <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg px-4.5 py-1.5 cursor-pointer text-[10.5px] transition flex items-center gap-1 shrink-0">
                      <Plus size={11}/>
                      <span>Log Task</span>
                    </button>
                  </div>
                </form>
              </div>

            </section>
          </>) : activeSidebarTab === "Dashboard Hub" ? (<DashboardHub doctors={doctors} appointments={appointments}/>) : activeSidebarTab === "users" ? (<UsersPanel localUsers={localUsers} setLocalUsers={setLocalUsers} handleAddUser={handleAddUser} newUserName={newUserName} setNewUserName={setNewUserName} newUserEmail={newUserEmail} setNewUserEmail={setNewUserEmail} newUserPhone={newUserPhone} setNewUserPhone={setNewUserPhone} newUserType={newUserType} setNewUserType={setNewUserType} newUserStatus={newUserStatus} setNewUserStatus={setNewUserStatus} showToast={showToast} handleRemoveUser={handleRemoveUser}/>) : activeSidebarTab === "appointments" ? (<AppointmentsPanel appointments={appointments} doctors={doctors} showToast={showToast}/>) : activeSidebarTab === "hospitals" ? (<HospitalsPanel showToast={showToast}/>) : activeSidebarTab === "consultations" ? (<ConsultationsPanel showToast={showToast}/>) : activeSidebarTab === "feedback" ? (<ReviewsRatingsPanel showToast={showToast}/>) : activeSidebarTab === "reports" ? (<ReportsPanel showToast={showToast}/>) : activeSidebarTab === "analytics" ? (<AnalyticsPanel showToast={showToast}/>) : activeSidebarTab === "notifications" ? (<NotificationsPanel showToast={showToast}/>) : activeSidebarTab === "messages" ? (<MessagesPanel showToast={showToast}/>) : activeSidebarTab === "settings" ? (<SettingsPanel showToast={showToast}/>) : activeSidebarTab === "roles" ? (<RolesPanel showToast={showToast}/>) : activeSidebarTab === "audits" ? (<AuditPanel showToast={showToast}/>) : (<div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6" id="doctor-specific-page-container">
            
            {/* Page Header */}
            <div className="flex justify-between items-center border-b border-slate-150 pb-4">
              <div className="flex items-center gap-2">
                <div className="bg-emerald-55 bg-emerald-55 bg-emerald-50 text-[#047857] p-2 rounded-xl">
                  <ShieldCheck size={20}/>
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">{activeSidebarTab} Workspace Panel</h2>
                  <p className="text-[10px] text-slate-400 font-mono uppercase">Clinical secure data-layer view</p>
                </div>
              </div>
            </div>

            {/* SEARCH FILTER BOX inside Page */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14}/>
              <input id="doctor-panel-search" name="searchQuery" type="text" placeholder={`Search ${activeSidebarTab}...`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-800"/>
            </div>
          </div>)}

      </main>

    </div>);
}
