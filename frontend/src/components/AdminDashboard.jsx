import React, { useState, useEffect } from "react";
import { Users, UserPlus, Stethoscope, Building, CalendarDays, Video, MessageSquare, Bell, Share2, Map, TrendingUp, Activity, Settings, ShieldCheck, Clock, Search, Download, Plus, FileText, CheckCircle2, X, Flame, Star, FileSpreadsheet, DollarSign, Zap, HelpCircle, ChevronDown } from "lucide-react";
import DashboardHub from "./DashboardHub";
import UsersPanel from "./UsersPanel";
import DoctorDetailsPanel from "./DoctorDetailsPanel";
import AppointmentsPanel from "./AppointmentsPanel";
import HospitalsPanel from "./HospitalsPanel";
import ConsultationsPanel from "./ConsultationsPanel";
import ReviewsRatingsPanel from "./ReviewsRatingsPanel";
import VTSPanel from "./VTSPanel";
import HeatmapPanel from "./HeatmapPanel";
import ReportsPanel from "./ReportsPanel";
import AnalyticsPanel from "./AnalyticsPanel";
import NotificationsPanel from "./NotificationsPanel";
import MessagesPanel from "./MessagesPanel";
import BannersPanel from "./BannersPanel";
import SettingsPanel from "./SettingsPanel";
import RolesPanel from "./RolesPanel";
import AuditPanel from "./AuditPanel";
export default function AdminDashboard({ doctors, setDoctors, appointments, setAppointments, section }) {
    // Navigation tabs (Dashboard is active in the image)
    const [activeSidebarTab, setActiveSidebarTab] = useState("Dashboard");
    // When the top navbar drives a section, follow it. Without the prop the
    // component behaves exactly as before (internal sidebar state only).
    useEffect(() => {
        if (section) setActiveSidebarTab(section);
    }, [section]);
    // Controls opening separate interactive full drawers/modals for specific sidebar functions
    const [activeModalTab, setActiveModalTab] = useState(null);
    // App wide local states for our interactive "Extra Features inside Another"
    const [localUsers, setLocalUsers] = useState([
        {
            id: "USR-001245",
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
            id: "USR-001246",
            name: "Priya Sharma",
            userType: "Patient",
            email: "priya.sharma@gmail.com",
            phone: "+91 91234 56789",
            status: "Active",
            joinedDate: "22 May 2024",
            joinedTime: "09:15 AM",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
        },
        {
            id: "DOC-000125",
            name: "Dr. Anil Verma",
            userType: "Doctor",
            email: "anilverma@elitecare.com",
            phone: "+91 99887 76655",
            status: "Active",
            joinedDate: "21 May 2024",
            joinedTime: "04:45 PM",
            avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150"
        },
        {
            id: "DOC-000126",
            name: "Dr. Neha Kapoor",
            userType: "Doctor",
            email: "nehakapoor@elitecare.com",
            phone: "+91 88776 55443",
            status: "Active",
            joinedDate: "21 May 2024",
            joinedTime: "11:20 AM",
            avatar: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=150"
        },
        {
            id: "HOSP-000045",
            name: "Hotel Sunshine",
            userType: "Hospital",
            email: "info@hotelsunshine.com",
            phone: "+91 95555 44332",
            status: "Active",
            joinedDate: "20 May 2024",
            joinedTime: "02:10 PM",
            avatar: "text-HS"
        },
        {
            id: "USR-001247",
            name: "Amit Patel",
            userType: "Patient",
            email: "amit.patel@gmail.com",
            phone: "+91 90000 11223",
            status: "Inactive",
            joinedDate: "19 May 2024",
            joinedTime: "08:30 AM",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
        },
        {
            id: "USR-001248",
            name: "Rahul Singh",
            userType: "Patient",
            email: "rahul.singh@gmail.com",
            phone: "+91 93456 77889",
            status: "Blocked",
            joinedDate: "18 May 2024",
            joinedTime: "01:05 PM",
            avatar: "text-RK"
        },
        {
            id: "DOC-000127",
            name: "Dr. Pooja Mehta",
            userType: "Doctor",
            email: "pooja.mehta@elitecare.com",
            phone: "+91 88990 66554",
            status: "Active",
            joinedDate: "18 May 2024",
            joinedTime: "10:50 AM",
            avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150"
        }
    ]);
    const [localHospitals, setLocalHospitals] = useState([
        { id: "hosp-1", name: "EliteCare General Hospital", city: "Mumbai Main", beds: 145, distance: "0.8 km", isEmergency: true, rate: 4.9 },
        { id: "hosp-2", name: "Apollo Med-Center", city: "Mumbai Suburban", beds: 80, distance: "2.4 km", isEmergency: true, rate: 4.7 },
        { id: "hosp-3", name: "City Diagnostics Wing", city: "Mumbai East", beds: 12, distance: "4.1 km", isEmergency: false, rate: 4.3 },
        { id: "hosp-4", name: "St. Jude Pediatric Care", city: "Navi Mumbai", beds: 42, distance: "7.8 km", isEmergency: true, rate: 4.8 }
    ]);
    const [localFeedback, setLocalFeedback] = useState([
        { id: "fb-1", patientName: "Ramesh Kumar", rating: 5, comment: "Exceptional telemetry care, booking Dr. Amit Verma was instant!", date: "24 hours ago", status: "Approved" },
        { id: "fb-2", patientName: "Priya Sharma", rating: 4, comment: "Excellent dermatology prescription. App had zero delay, though chat was busy.", date: "1 day ago", status: "Approved" },
        { id: "fb-3", patientName: "Rohit Kumar", rating: 5, comment: "I tried the new diagnosis assistant, very helpful on my phone.", date: "2 days ago", status: "Approved" },
        { id: "fb-4", patientName: "Rahul Saxena", rating: 2, comment: "Consultation slot delayed by 15 minutes, please adjust queue logic.", date: "5 days ago", status: "Flagged" }
    ]);
    const [localIdeas, setLocalIdeas] = useState([
        { id: "idea-1", title: "AI based symptom checker for users", suggestedBy: "Admin", date: "2 days ago", tag: "New", color: "purple" },
        { id: "idea-2", title: "Add multiple language support", suggestedBy: "Admin", date: "5 days ago", tag: "In Progress", color: "blue" },
        { id: "idea-3", title: "E-Prescription insurance claims processing", suggestedBy: "Admin", date: "1 week ago", tag: "Planned", color: "emerald" }
    ]);
    const [localTickets, setLocalTickets] = useState([
        { id: "TCK-401", user: "Sneha Patel", subject: "Camera error on video consultation call", status: "Open", date: "1 hour ago", priority: "High" },
        { id: "TCK-392", user: "Arjun Singh", subject: "Subscription refund request", status: "In Progress", date: "4 hours ago", priority: "Medium" },
        { id: "TCK-344", user: "Rahul Shinde", subject: "Reports PDF attachment did not download", status: "Closed", date: "2 days ago", priority: "Low" }
    ]);
    // Operational System settings
    const [consultationBaseFee, setConsultationBaseFee] = useState(500); // Standard fee
    const [smsBalance, setSmsBalance] = useState(18500);
    const [emailBalance, setEmailBalance] = useState(24300);
    const [systemUptime, setSystemUptime] = useState("99.98%");
    const [activeAlertMsg, setActiveAlertMsg] = useState("Regular clinical schedules active. All medical specialists checked in.");
    // Search/Filters Inside Modal overlays
    const [searchQuery, setSearchQuery] = useState("");
    const [newIdeaInput, setNewIdeaInput] = useState("");
    // Add Item States
    const [toast, setToast] = useState(null);
    const [newUserName, setNewUserName] = useState("");
    const [newUserEmail, setNewUserEmail] = useState("");
    const [newUserAge, setNewUserAge] = useState("30");
    const [newDocName, setNewDocName] = useState("");
    const [newDocSpec, setNewDocSpec] = useState("General Practitioner");
    const [newDocExp, setNewDocExp] = useState("10+ Years");
    const [newDocLoc, setNewDocLoc] = useState("Cabin A-24, Ground Floor");
    const [newHospName, setNewHospName] = useState("");
    const [newHospBeds, setNewHospBeds] = useState("50");
    const [newHospCity, setNewHospCity] = useState("Mumbai West");
    // Heatmap focus states
    const [currentHeatmapPage, setCurrentHeatmapPage] = useState("Landing Page");
    const [currentHeatmapDevice, setCurrentHeatmapDevice] = useState("Desktop");
    const [hoveredHotspot, setHoveredHotspot] = useState(null);
    // Trigger brief alert banner notifications
    const showToast = (message) => {
        setToast(message);
        setTimeout(() => {
            setToast(null);
        }, 4000);
    };
    // Add handlers for new items
    const [newUserPhone, setNewUserPhone] = useState("");
    const [newUserType, setNewUserType] = useState("Patient");
    const [newUserStatus, setNewUserStatus] = useState("Active");
    const handleAddUser = (e) => {
        e.preventDefault();
        if (!newUserName.trim() || !newUserEmail.trim()) {
            showToast("Please enter complete name and email!");
            return;
        }
        const initials = newUserName.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
        const newUsr = {
            id: newUserType === "Doctor" ? `DOC-${100000 + localUsers.length + 1}` : newUserType === "Hospital" ? `HOSP-${100000 + localUsers.length + 1}` : `USR-${100000 + localUsers.length + 1}`,
            name: newUserName,
            userType: newUserType,
            email: newUserEmail,
            phone: newUserPhone.trim() || "+91 " + Math.floor(60000 + Math.random() * 40000) + " " + Math.floor(10000 + Math.random() * 90000),
            status: newUserStatus,
            joinedDate: "15 Jun 2026",
            joinedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            avatar: "text-" + initials
        };
        setLocalUsers([newUsr, ...localUsers]);
        setNewUserName("");
        setNewUserEmail("");
        setNewUserPhone("");
        setNewUserType("Patient");
        setNewUserStatus("Active");
        showToast(`Successfully registered ${newUserType.toLowerCase()} account for ${newUserName}!`);
    };
    const handleAddDoctor = (e) => {
        e.preventDefault();
        if (!newDocName.trim()) {
            showToast("Please enter doctor name!");
            return;
        }
        const newDoc = {
            id: "dr-" + Math.random().toString(36).substr(2, 9),
            name: newDocName,
            specialization: newDocSpec,
            rating: 4.8,
            experience: `${newDocExp} Exp.`,
            image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
            availability: ["Monday", "Wednesday", "Friday"],
            location: newDocLoc,
            bio: `Direct medical care specialist in the field of ${newDocSpec.toLowerCase()}`,
            certifications: ["Board Certified", "Senior Resident MD"]
        };
        setDoctors([newDoc, ...doctors]);
        setNewDocName("");
        showToast(`Dr. ${newDocName} was onboarded to the registry!`);
    };
    const handleAddHospital = (e) => {
        e.preventDefault();
        if (!newHospName.trim()) {
            showToast("Please enter hospital branch name!");
            return;
        }
        const newH = {
            id: "hosp-" + (localHospitals.length + 1),
            name: newHospName,
            city: newHospCity,
            beds: Number(newHospBeds) || 40,
            distance: "1.2 km",
            isEmergency: true,
            rate: 4.5
        };
        setLocalHospitals([newH, ...localHospitals]);
        setNewHospName("");
        showToast(`${newHospName} added successfully to clinic network!`);
    };
    const submitNewIdea = (e) => {
        e.preventDefault();
        if (!newIdeaInput.trim())
            return;
        const newId = {
            id: "idea-" + (localIdeas.length + 1),
            title: newIdeaInput,
            suggestedBy: "Admin",
            date: "Just now",
            tag: "New",
            color: "purple"
        };
        setLocalIdeas([newId, ...localIdeas]);
        setNewIdeaInput("");
        showToast("Collaborative suggestion added to pipeline.");
    };
    const handleRemoveUser = (id) => {
        setLocalUsers(localUsers.filter(u => u.id !== id));
        showToast("User record de-registered.");
    };
    const handleApproveFeedback = (id) => {
        setLocalFeedback(localFeedback.map(f => f.id === id ? { ...f, status: "Approved" } : f));
        showToast("Patient review approved for dashboard publication.");
    };
    // Reusable component for the Sidebar list items
    const SidebarItem = ({ label, icon: Icon, badge, modalTarget }) => {
        const isActive = activeSidebarTab === label || (modalTarget && activeSidebarTab === modalTarget);
        return (<button onClick={() => {
                if (modalTarget) {
                    setActiveSidebarTab(modalTarget);
                    setSearchQuery("");
                }
                else {
                    setActiveSidebarTab(label);
                }
            }} className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-left transition-all duration-150 cursor-pointer ${isActive
                ? "bg-[#047857] text-white font-semibold shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}>
        <div className="flex items-center gap-3">
          <Icon size={17} className={isActive ? "text-white" : "text-slate-400"}/>
          <span className="text-sm font-medium">{label}</span>
        </div>
        {badge && (<span className="px-1.5 py-0.5 text-[9px] font-bold bg-indigo-100 text-indigo-700 rounded-md">
            {badge}
          </span>)}
      </button>);
    };
    return (<div className="bg-slate-50 rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden min-h-[900px] flex flex-col font-sans relative" id="elitecare-enterprise-panel">
      
      {/* Toast Alert bar */}
      {toast && (<div className="fixed top-6 right-6 bg-slate-900 border border-slate-700 text-emerald-400 px-5 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-3 animate-bounce">
          <CheckCircle2 size={18}/>
          <span className="text-xs font-bold font-mono text-white">{toast}</span>
          <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white ml-2 text-xs">
            <X size={14}/>
          </button>
        </div>)}

      {/* CORE WRAPPER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[900px]">
        
        {/* ========================================================================================= */}
        {/* LEFT ENTERPRISE SIDEBAR PANEL (MIMICS THE IMAGE PRECISELY) */}
        {/* ========================================================================================= */}
        <aside className="lg:col-span-3 bg-white border-r border-slate-200 p-5 flex flex-col justify-between text-left">
          <div className="space-y-6">
            
            {/* Logo and App Title Branding */}
            <div className="flex items-center gap-2 px-1 py-1">
              <div className="bg-[#059669] p-1.5 rounded-lg text-white">
                <ShieldCheck size={22} className="stroke-[2.5]"/>
              </div>
              <div className="leading-tight">
                <span className="text-base font-black text-slate-900 uppercase tracking-tight block">EliteCare</span>
                <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Admin Panel</span>
              </div>
            </div>

            {/* Nav Menu Content Wrapper */}
            <div className="space-y-5">
              
              {/* PRIMARY TAB */}
              <div className="space-y-1">
                <SidebarItem label="Dashboard" icon={Activity}/>
                <div className="pl-4 border-l border-slate-200 ml-6 space-y-1">
                  <button onClick={() => {
            setActiveSidebarTab("Dashboard Hub");
        }} className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-all duration-150 cursor-pointer ${activeSidebarTab === "Dashboard Hub"
            ? "bg-[#ecfdf5] text-[#047857] font-bold"
            : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 text-[11px] font-medium"}`}>
                    <TrendingUp size={12} className={activeSidebarTab === "Dashboard Hub" ? "text-[#047857]" : "text-slate-400"}/>
                    <span>Dashboard Hub</span>
                  </button>
                </div>
              </div>

              {/* MANAGEMENT SECTION */}
              <div className="space-y-1.5">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-extrabold pl-4">Management</p>
                <div className="space-y-0.5">
                  <SidebarItem label="Users" icon={Users} modalTarget="users"/>
                  <SidebarItem label="Doctors" icon={Stethoscope} modalTarget="doctors"/>
                  <SidebarItem label="Hospitals" icon={Building} modalTarget="hospitals"/>
                  <SidebarItem label="Appointments" icon={CalendarDays} modalTarget="appointments"/>
                  <SidebarItem label="Consultations" icon={Video} modalTarget="consultations"/>
                  <SidebarItem label="Reviews & Ratings" icon={Star} modalTarget="feedback"/>
                </div>
              </div>

              {/* ENGAGEMENT SECTION */}
              <div className="space-y-1.5">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-extrabold pl-4">Engagement</p>
                <div className="space-y-0.5">
                  <SidebarItem label="Notifications" icon={Bell} modalTarget="notifications"/>
                  <SidebarItem label="Messages" icon={MessageSquare} modalTarget="messages"/>
                  <SidebarItem label="Banners & Ads" icon={Share2} modalTarget="banners"/>
                </div>
              </div>

              {/* ANALYTICS SECTION */}
              <div className="space-y-1.5">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-extrabold pl-4">Analytics</p>
                <div className="space-y-0.5">
                  <SidebarItem label="VTS" icon={Flame} badge="New" modalTarget="vts"/>
                  <SidebarItem label="Heatmap" icon={Map} modalTarget="heatmap"/>
                  <SidebarItem label="Reports" icon={FileText} modalTarget="reports"/>
                  <SidebarItem label="Analytics" icon={TrendingUp} modalTarget="analytics"/>
                </div>
              </div>

              {/* SYSTEM SECTION */}
              <div className="space-y-1.5">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-extrabold pl-4">System</p>
                <div className="space-y-0.5">
                  <SidebarItem label="Settings" icon={Settings} modalTarget="settings"/>
                  <SidebarItem label="Roles & Permissions" icon={ShieldCheck} modalTarget="roles"/>
                  <SidebarItem label="Audit Logs" icon={Clock} modalTarget="audits"/>
                </div>
              </div>

            </div>
          </div>

          {/* User profile capsule at the bottom of the sidebar */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-left">
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" alt="Admin Profile" className="size-9 rounded-full object-cover border border-slate-200" referrerPolicy="no-referrer"/>
              <div className="leading-tight">
                <p className="text-xs font-bold text-slate-800">Admin User</p>
                <p className="text-[9px] text-slate-400 font-medium font-mono">Super Admin</p>
              </div>
            </div>
          </div>
        </aside>

        {/* ========================================================================================= */}
        {/* MAIN BODY AREA & WORKSPACE VIEW */}
        {/* ========================================================================================= */}
        <main className="lg:col-span-9 p-6 lg:p-8 space-y-7 flex flex-col text-left">
          
          {/* HEADER ROW OF PLATFORM */}
          {!(activeSidebarTab === "notifications" || activeSidebarTab === "messages" || activeSidebarTab === "banners") && (<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 pb-5" id="platform-default-header-row">
            <div>
              {activeSidebarTab === "users" ? (<div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">Users</h1>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mt-1">
                    <button onClick={() => setActiveSidebarTab("Dashboard")} className="hover:text-[#047857] transition cursor-pointer">
                      Dashboard
                    </button>
                    <span>&gt;</span>
                    <span className="text-slate-600 font-semibold">Users</span>
                  </div>
                </div>) : activeSidebarTab === "doctors" ? (<div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">Doctor Details</h1>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mt-1">
                    <button onClick={() => setActiveSidebarTab("Dashboard")} className="hover:text-[#047857] transition cursor-pointer">
                      Dashboard
                    </button>
                    <span>&gt;</span>
                    <span className="text-slate-600 font-semibold">Doctor Details</span>
                  </div>
                </div>) : activeSidebarTab === "appointments" ? (<div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">Appointments</h1>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mt-1">
                    <button onClick={() => setActiveSidebarTab("Dashboard")} className="hover:text-[#047857] transition cursor-pointer">
                      Dashboard
                    </button>
                    <span>&gt;</span>
                    <span className="text-slate-600 font-semibold">Appointments</span>
                  </div>
                </div>) : activeSidebarTab === "hospitals" ? (<div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">Hospitals</h1>
                  <p className="text-sm text-slate-500 font-medium mt-0.5">Manage and oversee all hospitals in the system</p>
                </div>) : activeSidebarTab === "consultations" ? (<div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">Consultations</h1>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mt-1">
                    <button onClick={() => setActiveSidebarTab("Dashboard")} className="hover:text-[#047857] transition cursor-pointer">
                      Dashboard
                    </button>
                    <span>&gt;</span>
                    <span className="text-slate-600 font-semibold">Consultations</span>
                  </div>
                </div>) : activeSidebarTab === "feedback" ? (<div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">Reviews & Ratings</h1>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mt-1">
                    <button onClick={() => setActiveSidebarTab("Dashboard")} className="hover:text-[#047857] transition cursor-pointer">
                      Dashboard
                    </button>
                    <span>&gt;</span>
                    <span className="text-slate-600 font-semibold">Reviews & Ratings</span>
                  </div>
                </div>) : activeSidebarTab === "vts" ? (<div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">VTS Analytics</h1>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mt-1">
                    <button onClick={() => setActiveSidebarTab("Dashboard")} className="hover:text-[#047857] transition cursor-pointer">
                      Dashboard
                    </button>
                    <span>&gt;</span>
                    <span className="text-slate-600 font-semibold">VTS Analytics</span>
                  </div>
                </div>) : activeSidebarTab === "heatmap" ? (<div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">Interactive User Heatmap</h1>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mt-1">
                    <button onClick={() => setActiveSidebarTab("Dashboard")} className="hover:text-[#047857] transition cursor-pointer">
                      Dashboard
                    </button>
                    <span>&gt;</span>
                    <span className="text-slate-600 font-semibold">User Heatmap</span>
                  </div>
                </div>) : (<div>
                  <p className="text-[10px] font-bold text-[#047857] uppercase tracking-wider">
                    {activeSidebarTab === "Dashboard Hub" ? "Enterprise Console / Workspace" : "Enterprise Console"}
                  </p>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    {activeSidebarTab === "Dashboard Hub" ? "Dashboard Hub" : activeSidebarTab === "Dashboard" ? "Admin Dashboard" : `${activeSidebarTab} Workspace Panel`}
                  </h1>
                  <p className="text-xs text-slate-500 font-medium">
                    {activeSidebarTab === "Dashboard Hub"
                    ? "Real-time clinical event buffer telemetry, on-call stats, and specialty density tracker"
                    : activeSidebarTab === "Dashboard"
                        ? "Overview of platform activities and key metrics"
                        : "Enterprise data-layer interactive workspace"}
                  </p>
                </div>)}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              
              {/* Date dropdown mimicking reference image */}
              <div className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-700 font-bold flex items-center gap-2 shadow-sm cursor-pointer hover:bg-slate-50 transition">
                <CalendarDays size={14} className="text-slate-400"/>
                <span>22 Apr 2024 - 22 May 2024</span>
              </div>

              {/* Download report button mimicking image */}
              <button onClick={() => showToast("Downloading comprehensive analytics report PDF... Opened system pipe.")} className="bg-white border border-slate-200 hover:bg-slate-50 transition rounded-xl px-4 py-2 text-xs text-slate-705 font-bold flex items-center gap-2 shadow-sm cursor-pointer">
                <Download size={14} className="text-slate-400"/>
                <span>Download Report</span>
              </button>

              {/* Profile bell and notification counters */}
              <button onClick={() => setActiveSidebarTab("notifications")} className="size-9 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 flex items-center justify-center relative transition cursor-pointer shadow-sm animate-pulse">
                <Bell size={15} className="text-slate-700"/>
                <span className="absolute -top-1.5 -right-1.5 size-5 bg-rose-500 border-2 border-white text-white text-[9px] font-bold rounded-full flex items-center justify-center shrink-0">
                  12
                </span>
              </button>

              {/* Admin profile view top-right precisely matching mock */}
              <div className="flex items-center gap-2.5 pl-2.5 border-l border-slate-200">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" alt="Admin Profile" className="size-9 rounded-full object-cover border border-slate-200 shadow-sm" referrerPolicy="no-referrer"/>
                <div className="text-left leading-none hidden sm:block">
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-black text-slate-800">Admin User</p>
                    <ChevronDown size={12} className="text-slate-400"/>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">Super Admin</p>
                </div>
              </div>

            </div>
          </div>)}

          {activeSidebarTab === "Dashboard" ? (<>
              {/* ========================================================================================= */}
              {/* TOP METRICS GRID (5 DISTINCT CARDS MATCHING REFERENCE IMAGE PRECISELY) */}
          {/* ========================================================================================= */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Card 1: Patients/Total Users */}
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:shadow transition duration-150 relative">
              <div className="space-y-1">
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Total Users</p>
                <p className="text-2xl font-black text-slate-800 font-mono">12,458</p>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                  <span>↑ 18.6%</span> <span className="text-slate-400 font-medium">vs last 30 days</span>
                </span>
              </div>
              <div className="bg-sky-50 text-sky-600 p-3 rounded-xl">
                <Users size={16}/>
              </div>
            </div>

            {/* Card 2: Total Doctors */}
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:shadow transition duration-150">
              <div className="space-y-1">
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Total Doctors</p>
                <p className="text-2xl font-black text-slate-800 font-mono">{doctors.length + 1200}</p>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                  <span>↑ 15.3%</span> <span className="text-slate-400 font-medium">vs last 30 days</span>
                </span>
              </div>
              <div className="bg-emerald-50 text-[#047857] p-3 rounded-xl">
                <Stethoscope size={16}/>
              </div>
            </div>

            {/* Card 3: Total Appointments */}
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:shadow transition duration-150">
              <div className="space-y-1">
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Total Appointments</p>
                <p className="text-2xl font-black text-slate-800 font-mono">8,965</p>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                  <span>↑ 21.7%</span> <span className="text-slate-400 font-medium">vs last 30 days</span>
                </span>
              </div>
              <div className="bg-violet-50 text-violet-650 p-3 rounded-xl">
                <CalendarDays size={16}/>
              </div>
            </div>

            {/* Card 4: Total Consultations */}
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:shadow transition duration-150">
              <div className="space-y-1">
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Total Consultations</p>
                <p className="text-2xl font-black text-slate-800 font-mono">6,543</p>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                  <span>↑ 20.4%</span> <span className="text-slate-400 font-medium">vs last 30 days</span>
                </span>
              </div>
              <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl">
                <Video size={16}/>
              </div>
            </div>

            {/* Card 5: Total Revenue */}
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:shadow transition duration-150">
              <div className="space-y-1">
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Total Revenue</p>
                <p className="text-2xl font-black text-slate-800 font-mono">₹28,65,400</p>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                  <span>↑ 25.8%</span> <span className="text-slate-400 font-medium">vs last 30 days</span>
                </span>
              </div>
              <div className="bg-amber-50 text-amber-600 p-3 rounded-xl">
                <DollarSign size={16} className="text-amber-600"/>
              </div>
            </div>

          </section>

          {/* ========================================================================================= */}
          {/* CHARTS ROW (HEATMAP, LINE GRAPH AREA, SPEC DONUT - HIGH CRAFTSMANSHIP SVG GRAPHICS) */}
          {/* ========================================================================================= */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* 1. VTS LIVE HEATMAP MODULE */}
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-left">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">VTS Heatmap (Live)</h3>
                  <button title="Visits Traffic Tracking Visualizer" className="text-slate-400 hover:text-slate-650 cursor-pointer">
                    <HelpCircle size={13}/>
                  </button>
                </div>
                
                {/* selectors in layout */}
                <div className="flex gap-1.5 text-[10px]">
                  <select id="heatmap-page" name="currentHeatmapPage" value={currentHeatmapPage} onChange={(e) => setCurrentHeatmapPage(e.target.value)} aria-label="Heatmap page" className="p-1 px-1.5 border border-slate-200 rounded-lg text-slate-600 font-bold bg-slate-50 focus:outline-none">
                    <option value="Landing Page">Landing Page</option>
                    <option value="Doctor Find v2">Doctor Find v2</option>
                    <option value="Emergency Alert">Emergency Alert</option>
                  </select>

                  <select id="heatmap-device" name="currentHeatmapDevice" value={currentHeatmapDevice} onChange={(e) => setCurrentHeatmapDevice(e.target.value)} aria-label="Heatmap device" className="p-1 px-1.5 border border-slate-200 rounded-lg text-slate-600 font-bold bg-slate-50 focus:outline-none">
                    <option value="Desktop">Desktop</option>
                    <option value="Mobile App">Mobile App</option>
                  </select>
                </div>
              </div>

              {/* Heatmap overlay image container */}
              <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 group">
                {/* Landing page preview background */}
                <div className="absolute inset-0 bg-gradient-to-tr from-sky-100 via-indigo-50 to-emerald-50 flex flex-col justify-between p-4 text-left select-none">
                  
                  {/* Top line of mock app */}
                  <div className="flex justify-between items-center pb-1 border-b border-indigo-100/40">
                    <div className="text-[9px] font-black uppercase text-[#047857] flex items-center gap-1">🛡️ EliteCare</div>
                    <div className="flex gap-2 text-[8px] text-slate-400 font-mono font-medium"><span>Find Doctor</span> <span>Diagnostics</span></div>
                  </div>

                  {/* Core layout of preview */}
                  <div className="space-y-1 my-auto max-w-[70%]">
                    <p className="text-[7px] text-[#047857] font-extrabold uppercase">Telemetry Portal</p>
                    <h4 className="text-xs font-black tracking-tight leading-tight text-slate-900">Your Health, Our Absolute Priority</h4>
                    <p className="text-[8px] text-slate-500 leading-normal">Onboard certified clinicians and consult diagnostics instantaneously on our mobile sandbox.</p>
                    <div className="pt-1.5 flex gap-1.5">
                      <span className="bg-[#059669] text-white text-[8px] px-2 py-0.5 rounded-sm font-semibold shadow-sm">Book Appointment</span>
                      <span className="border border-slate-300 text-slate-600 text-[8px] px-1.5 py-0.5 rounded-sm font-bold bg-white">10 Min Clinic</span>
                    </div>
                  </div>

                  {/* Footer element watermark */}
                  <div className="pt-1 border-t border-indigo-100/30 flex justify-between items-center text-[7px] text-slate-400">
                    <span>24/7 Triage line active</span>
                    <span>⭐ 4.9 Rated</span>
                  </div>
                </div>

                {/* Translucent overlay heat colors */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Color blob A: Primary Header (Hot Red) */}
                  <div className="absolute top-1/4 left-1/5 size-14 rounded-full bg-red-500/35 filter blur-md mix-blend-multiply flex items-center justify-center animate-pulse" style={{ transform: hoveredHotspot === "hero" ? "scale(1.2)" : "scale(1)" }}/>
                  {/* Color blob B: CTA Button (Warm Orange) */}
                  <div className="absolute bottom-1/4 left-1/4 size-10 rounded-full bg-amber-500/50 filter blur-md mix-blend-multiply" style={{ transform: hoveredHotspot === "ctabtn" ? "scale(1.2)" : "scale(1)" }}/>
                  {/* Color blob C: Top Menu (Green-blue highlight) */}
                  <div className="absolute top-1 right-24 w-12 h-6 rounded-full bg-emerald-500/30 filter blur-sm mix-blend-darken"/>
                  {/* Color blob D: Doctor Profile image (Cyan) */}
                  <div className="absolute right-4 top-1/3 size-12 rounded-full bg-cyan-400/40 filter blur-md"/>
                </div>

                {/* Invisible hover trigger zones */}
                <div className="absolute top-1/4 left-1/5 w-24 h-12 bg-transparent cursor-pointer" onMouseEnter={() => setHoveredHotspot("hero")} onMouseLeave={() => setHoveredHotspot(null)}/>
                <div className="absolute bottom-1/4 left-12 w-28 h-10 bg-transparent cursor-pointer" onMouseEnter={() => setHoveredHotspot("ctabtn")} onMouseLeave={() => setHoveredHotspot(null)}/>

                {/* Live hotspot values indicator when hovering */}
                {hoveredHotspot && (<div className="absolute bottom-2 right-2 bg-slate-900/90 text-white text-[8px] px-2 py-1 rounded-md font-mono flex items-center gap-1.5 animate-in fade-in">
                    <span className="size-1.5 bg-rose-500 rounded-full animate-ping"/>
                    <span>
                      {hoveredHotspot === "hero"
                    ? "Header Title: 4,124 hover sessions / 94% retention"
                    : "CTA Booking: 3,450 clicks / 82% conversion"}
                    </span>
                  </div>)}
              </div>

              {/* Heat map low-to-high attention color bar mimicking reference */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-slate-400">
                  <span>High Attention</span>
                  <span>Low Attention</span>
                </div>
                {/* Gradient color line */}
                <div className="h-2 rounded-full bg-gradient-to-r from-red-500 via-orange-500 via-yellow-400 via-green-400 via-emerald-400 to-sky-400"/>
              </div>
            </div>

            {/* 2. APPOINTMENTS OVERVIEW AREA CHART (HIGH CRAFTSMANSHIP CUSTOM GRAPH) */}
            <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-left">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Appointments Overview</h3>
                <div className="flex gap-2 text-[10px] font-bold">
                  <span className="text-emerald-600 flex items-center gap-1">● Appointments</span>
                  <span className="text-indigo-600 flex items-center gap-1">● Consultations</span>
                </div>
              </div>

              {/* Beautiful, responsive custom SVG chart matching layout coordinates */}
              <div className="h-44 w-full relative flex items-end">
                <svg viewBox="0 0 300 150" className="w-full h-full text-slate-200">
                  {/* Grid lines */}
                  <line x1="10" y1="30" x2="290" y2="30" stroke="#f1f5f9" strokeWidth="1"/>
                  <line x1="10" y1="70" x2="290" y2="70" stroke="#f1f5f9" strokeWidth="1"/>
                  <line x1="10" y1="110" x2="290" y2="110" stroke="#f1f5f9" strokeWidth="1"/>
                  <line x1="10" y1="140" x2="290" y2="140" stroke="#f1f5f9" strokeWidth="1"/>

                  {/* Appointments curve Area & Path (Green - #10b981) */}
                  <path d="M 20,110 Q 80,60 140,80 T 260,30 L 260,140 L 20,140 Z" fill="url(#greenGradient)" opacity="0.15"/>
                  <path d="M 20,110 Q 80,60 140,80 T 260,30" fill="transparent" stroke="#10b981" strokeWidth="2.5"/>

                  {/* Consultations curve Area & Path (Blue - #4f46e5) */}
                  <path d="M 20,130 Q 80,110 140,115 T 260,80 L 260,140 L 20,140 Z" fill="url(#blueGradient)" opacity="0.15"/>
                  <path d="M 20,130 Q 80,110 140,115 T 260,80" fill="transparent" stroke="#4F46E5" strokeWidth="2" strokeDasharray="1 0"/>

                  {/* Key points/Markers on standard dates */}
                  <circle cx="20" cy="110" r="3" fill="#10b981"/>
                  <circle cx="20" cy="130" r="3" fill="#4F46E5"/>
                  <circle cx="140" cy="80" r="3" fill="#10b981"/>
                  <circle cx="140" cy="115" r="3" fill="#4F46E5"/>
                  <circle cx="260" cy="30" r="3.5" fill="#10b981" stroke="#fff" strokeWidth="1"/>
                  <circle cx="260" cy="80" r="3.5" fill="#4F46E5" stroke="#fff" strokeWidth="1"/>

                  {/* Gradients declaration inside SVG */}
                  <defs>
                    <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981"/>
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                    </linearGradient>
                    <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4F46E5"/>
                      <stop offset="100%" stopColor="#4F46E5" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                </svg>

                {/* Floating summary label overlay */}
                <div className="absolute top-2 left-2 bg-slate-900/90 text-[9px] text-emerald-400 px-2 py-0.5 rounded-md font-mono">
                  Peak Booking: May 20
                </div>
              </div>

              {/* Lower Dates intervals */}
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 px-1 pt-1 font-mono">
                <span>22 Apr</span>
                <span>29 Apr</span>
                <span>06 May</span>
                <span>13 May</span>
                <span>20 May</span>
              </div>
            </div>

            {/* 3. TOP SPECIALIZATIONS DONUT TARGET */}
            <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-left">
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Top Specializations</h3>
              
              {/* Pie/Donut alignment inside column */}
              <div className="flex flex-col items-center justify-center space-y-4">
                
                {/* SVG DONUT */}
                <div className="relative size-32">
                  <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                    {/* Background circle of gray */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="4.2"/>

                    {/* General Physician (32% - Green #047857) */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#047857" strokeWidth="4.2" strokeDasharray="32 68" strokeDashoffset="100"/>

                    {/* Dermatology (18% - Sky #38bdf8) */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#38bdf8" strokeWidth="4.2" strokeDasharray="18 82" strokeDashoffset="68"/>

                    {/* Pediatrics (15% - Orange #f97316) */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f97316" strokeWidth="4.2" strokeDasharray="15 85" strokeDashoffset="50"/>

                    {/* Psychiatry (12% - Violet #8b5cf6) */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#8b5cf6" strokeWidth="4.2" strokeDasharray="12 88" strokeDashoffset="35"/>

                    {/* Gynecology (10% - Rose #f43f5e) */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f43f5e" strokeWidth="4.2" strokeDasharray="10 90" strokeDashoffset="23"/>

                    {/* Others (13% - slate #94a3b8) */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#94a3b8" strokeWidth="4.2" strokeDasharray="13 87" strokeDashoffset="13"/>
                  </svg>
                  {/* Central Text display */}
                  <div className="absolute inset-0 flex flex-col justify-center items-center">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Total</span>
                    <span className="text-sm font-black text-slate-900 font-mono">8,965</span>
                  </div>
                </div>

                {/* Donut Legend lists mimicking exact text & color from reference image */}
                <div className="w-full text-[10px] space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 font-medium text-slate-600">
                      <span className="size-2 rounded-full bg-[#047857]"/> General Physician
                    </span>
                    <span className="font-mono font-bold text-slate-800">32%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 font-medium text-slate-600">
                      <span className="size-2 rounded-full bg-[#38bdf8]"/> Dermatology
                    </span>
                    <span className="font-mono font-bold text-slate-800">18%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 font-medium text-slate-600">
                      <span className="size-2 rounded-full bg-[#f97316]"/> Pediatrics
                    </span>
                    <span className="font-mono font-bold text-slate-800">15%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 font-medium text-slate-600">
                      <span className="size-2 rounded-full bg-[#8b5cf6]"/> Psychiatry
                    </span>
                    <span className="font-mono font-bold text-slate-800">12%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 font-medium text-slate-600">
                      <span className="size-2 rounded-full bg-[#f43f5e]"/> Gynecology
                    </span>
                    <span className="font-mono font-bold text-slate-800">10%</span>
                  </div>
                </div>

              </div>
            </div>

          </section>

          {/* ========================================================================================= */}
          {/* SEC ROW: ACTIVE APPOINTMENTS RECENT LIST, REVENUE FLOWS, TIMELINES (HIGH-DENSITY COMPONENT ARRAYS) */}
          {/* ========================================================================================= */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* A. RECENT PATIENTS APPOINTMENTS LIST (MIMICS THE PICTURE SLOTS DIRECTLY) */}
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Recent Appointments</h3>
                <button onClick={() => setActiveSidebarTab("appointments")} className="text-xs text-[#047857] hover:underline font-bold">
                  View All
                </button>
              </div>

              {/* Rows */}
              <div className="divide-y divide-slate-100">
                
                {/* User 1 */}
                <div className="py-3 flex items-center justify-between text-left hover:bg-slate-50 transition p-1.5 rounded-lg cursor-pointer" onClick={() => setActiveSidebarTab("appointments")}>
                  <div className="flex items-center gap-3">
                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150" alt="Ramesh Profile" className="size-8.5 rounded-full object-cover border border-slate-150" referrerPolicy="no-referrer"/>
                    <div className="leading-tight">
                      <p className="text-xs font-black text-slate-800">Ramesh Kumar</p>
                      <p className="text-[9px] text-[#047857] font-bold">Dr. Amit Verma</p>
                      <p className="text-[8px] text-slate-400 font-mono font-bold">Book ID: #APT1256</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-600 leading-tight">22 May 2024</p>
                    <p className="text-[9px] text-slate-400 font-mono">00:30 AM</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[8.5px] font-extrabold uppercase bg-emerald-50 text-emerald-700 font-mono border border-emerald-250">
                      Completed
                    </span>
                  </div>
                </div>

                {/* User 2 */}
                <div className="py-3 flex items-center justify-between text-left hover:bg-slate-50 transition p-1.5 rounded-lg cursor-pointer" onClick={() => setActiveSidebarTab("appointments")}>
                  <div className="flex items-center gap-3">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" alt="Priya Profile" className="size-8.5 rounded-full object-cover border border-slate-150" referrerPolicy="no-referrer"/>
                    <div className="leading-tight">
                      <p className="text-xs font-black text-slate-800">Priya Sharma</p>
                      <p className="text-[9px] text-[#38bdf8] font-bold font-mono">Dr. Neha Kapoor</p>
                      <p className="text-[8px] text-slate-400 font-mono font-bold">Book ID: #APT1255</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-600 leading-tight">22 May 2024</p>
                    <p className="text-[9px] text-slate-400 font-mono">11:00 AM</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[8.5px] font-extrabold uppercase bg-blue-50 text-blue-700 font-mono border border-blue-250">
                      Upcoming
                    </span>
                  </div>
                </div>

                {/* User 3 */}
                <div className="py-3 flex items-center justify-between text-left hover:bg-slate-50 transition p-1.5 rounded-lg cursor-pointer" onClick={() => setActiveSidebarTab("appointments")}>
                  <div className="flex items-center gap-3">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" alt="Arjun Profile" className="size-8.5 rounded-full object-cover border border-slate-150" referrerPolicy="no-referrer"/>
                    <div className="leading-tight">
                      <p className="text-xs font-black text-slate-800">Arjun Singh</p>
                      <p className="text-[9px] text-[#8b5cf6] font-bold font-mono">Dr. Vivek Mehta</p>
                      <p className="text-[8px] text-slate-400 font-mono font-bold">Book ID: #APT1254</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-600 leading-tight">22 May 2024</p>
                    <p className="text-[9px] text-slate-400 font-mono">01:15 AM</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[8.5px] font-extrabold uppercase bg-blue-50 text-blue-700 font-mono border border-blue-250">
                      Upcoming
                    </span>
                  </div>
                </div>

                {/* User 4 */}
                <div className="py-3 flex items-center justify-between text-left hover:bg-slate-50 transition p-1.5 rounded-lg cursor-pointer" onClick={() => setActiveSidebarTab("appointments")}>
                  <div className="flex items-center gap-3">
                    <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150" alt="Sneha Profile" className="size-8.5 rounded-full object-cover border border-slate-150" referrerPolicy="no-referrer"/>
                    <div className="leading-tight">
                      <p className="text-xs font-black text-slate-800">Sneha Patel</p>
                      <p className="text-[9px] text-rose-500 font-bold font-mono">Dr. Priya Sharma</p>
                      <p className="text-[8px] text-slate-400 font-mono font-bold font-mono">Book ID: #APT1253</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-600 leading-tight">22 May 2024</p>
                    <p className="text-[9px] text-slate-400 font-mono">11:30 AM</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[8.5px] font-extrabold uppercase bg-rose-50 text-rose-700 font-mono border border-rose-250">
                      Cancelled
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* B. REVENUE CHART PRECISE FIT */}
            <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Revenue Overview</h3>
                <button onClick={() => setActiveSidebarTab("reports")} className="text-xs text-[#047857] hover:underline font-bold">
                  View All
                </button>
              </div>

              <div className="text-left leading-tight">
                <p className="text-[11px] text-slate-405 text-slate-400 font-bold">ESTIMATED TURNOVER</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <h4 className="text-xl font-black text-slate-905">₹28,65,400</h4>
                  <span className="text-[9px] text-emerald-600 font-extrabold">↑ 25.8% vs last 30d</span>
                </div>
              </div>

              {/* High-Fidelity Custom SVG curve for Revenue */}
              <div className="h-32 w-full pt-2">
                <svg viewBox="0 0 200 100" className="size-full">
                  <path d="M 10,85 Q 50,55 90,40 T 170,30 L 170,100 L 10,100 Z" fill="url(#goldGradient)" opacity="0.15"/>
                  <path d="M 10,85 Q 50,55 90,40 T 170,30" fill="transparent" stroke="#10b981" strokeWidth="2"/>
                  <circle cx="10" cy="85" r="2.5" fill="#10b981"/>
                  <circle cx="50" cy="70" r="2.5" fill="#10b981"/>
                  <circle cx="95" cy="45" r="2.5" fill="#10b981"/>
                  <circle cx="170" cy="30" r="3" fill="#10b981" stroke="#fff" strokeWidth="1"/>

                  <defs>
                    <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981"/>
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 font-mono">
                <span>22 Apr</span>
                <span>29 Apr</span>
                <span>06 May</span>
                <span>13 May</span>
                <span>20 May</span>
              </div>
            </div>

            {/* C. PLATFORM EVENTS TIMELINE ACTIVITY */}
            <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Platform Activity</h3>
                <button onClick={() => setActiveSidebarTab("audits")} className="text-xs text-[#047857] hover:underline font-bold">
                  View All
                </button>
              </div>

              {/* TIMELINE DOTS */}
              <div className="relative pl-5 space-y-4 text-left border-l border-slate-100 ml-2">
                
                {/* Event 1 */}
                <div className="relative">
                  <span className="absolute -left-[24.5px] top-0.5 size-2.5 rounded-full bg-sky-400 ring-4 ring-white"/>
                  <p className="text-[11px] font-black leading-tight text-slate-800">New user registered</p>
                  <p className="text-[10px] text-slate-500 font-medium">Rohit Kumar</p>
                  <span className="text-[8px] text-slate-400 font-mono font-bold block mt-0.5">2 mins ago</span>
                </div>

                {/* Event 2 */}
                <div className="relative">
                  <span className="absolute -left-[24.5px] top-0.5 size-2.5 rounded-full bg-emerald-400 ring-4 ring-white"/>
                  <p className="text-[11px] font-black leading-tight text-slate-800">New doctor onboarded</p>
                  <p className="text-[10px] text-slate-505 text-slate-500 font-medium">Dr. Anjali Gupta</p>
                  <span className="text-[8px] text-slate-400 font-mono font-bold block mt-0.5">15 mins ago</span>
                </div>

                {/* Event 3 */}
                <div className="relative">
                  <span className="absolute -left-[24.5px] top-0.5 size-2.5 rounded-full bg-indigo-400 ring-4 ring-white"/>
                  <p className="text-[11px] font-black leading-tight text-slate-800">Appointment booked</p>
                  <p className="text-[10px] text-slate-500 font-mono font-bold text-[9px]">Book ID: #APT1256</p>
                  <span className="text-[8px] text-slate-400 font-mono font-bold block mt-0.5">25 mins ago</span>
                </div>

                {/* Event 4 */}
                <div className="relative">
                  <span className="absolute -left-[24.5px] top-0.5 size-2.5 rounded-full bg-purple-400 ring-4 ring-white"/>
                  <p className="text-[11px] font-black leading-tight text-slate-800">Consultation completed</p>
                  <p className="text-[10px] text-slate-500 font-mono font-bold text-[9px]">Book ID: #CONS563</p>
                  <span className="text-[8px] text-slate-400 font-mono font-bold block mt-0.5">1 hour ago</span>
                </div>

                {/* Event 5 */}
                <div className="relative">
                  <span className="absolute -left-[24.5px] top-0.5 size-2.5 rounded-full bg-amber-400 ring-4 ring-white"/>
                  <p className="text-[11px] font-black leading-tight text-slate-800">Payment received</p>
                  <p className="text-[10px] text-slate-500 font-bold text-amber-600">₹500 from Priya Sharma</p>
                  <span className="text-[8px] text-slate-400 font-mono font-bold block mt-0.5">2 hours ago</span>
                </div>

              </div>
            </div>

          </section>

          {/* ========================================================================================= */}
          {/* BOTTOM ROW: QUICK ACTIONS INTERACTION, HOST SERVICES DECK, COLLABORATIVE PIPELINE */}
          {/* ========================================================================================= */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* 1. QUICK ACTIONS BUTTON TILES */}
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-left">
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Quick Actions</h3>
              
              <div className="grid grid-cols-3 gap-3">
                
                {/* Button 1 */}
                <button onClick={() => {
                setActiveSidebarTab("doctors");
                showToast("Physician registry portal loaded. Use form below.");
            }} className="bg-slate-50 border border-slate-100 py-4.5 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-emerald-50 hover:border-emerald-250 transition-all duration-150 p-2.5 cursor-pointer text-center group">
                  <div className="bg-emerald-100 text-[#047857] p-2.5 rounded-xl group-hover:scale-110 transition">
                    <UserPlus size={16}/>
                  </div>
                  <span className="text-[10.5px] font-bold text-slate-700">Add Doctor</span>
                </button>

                {/* Button 2 */}
                <button onClick={() => {
                setActiveSidebarTab("hospitals");
                showToast("Clinical branches allocation portal loaded.");
            }} className="bg-slate-50 border border-slate-100 py-4.5 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-emerald-50 hover:border-emerald-250 transition-all duration-150 p-2.5 cursor-pointer text-center group">
                  <div className="bg-emerald-100 text-[#047857] p-2.5 rounded-xl group-hover:scale-110 transition">
                    <Building size={16}/>
                  </div>
                  <span className="text-[10.5px] font-bold text-slate-700">Add Hospital</span>
                </button>

                {/* Button 3 */}
                <button onClick={() => setActiveSidebarTab("notifications")} className="bg-slate-50 border border-slate-100 py-4.5 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-[#EEF2FF] hover:border-indigo-250 transition-all duration-150 p-2.5 cursor-pointer text-center group">
                  <div className="bg-indigo-100 text-[#4F46E5] p-2.5 rounded-xl group-hover:scale-110 transition">
                    <Bell size={16}/>
                  </div>
                  <span className="text-[10.5px] font-bold text-slate-700">Send Notification</span>
                </button>

                {/* Button 4 */}
                <button onClick={() => setActiveSidebarTab("banners")} className="bg-slate-50 border border-slate-100 py-4.5 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-[#FFFBEB] hover:border-amber-250 transition-all duration-150 p-2.5 cursor-pointer text-center group">
                  <div className="bg-amber-100 text-amber-600 p-2.5 rounded-xl group-hover:scale-110 transition">
                    <Share2 size={16}/>
                  </div>
                  <span className="text-[10.5px] font-bold text-slate-700">Create Banner</span>
                </button>

                {/* Button 5 */}
                <button onClick={() => setActiveSidebarTab("reports")} className="bg-slate-50 border border-slate-100 py-4.5 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-violet-50 hover:border-violet-250 transition-all duration-150 p-2.5 cursor-pointer text-center group">
                  <div className="bg-violet-100 text-violet-550 p-2.5 rounded-xl group-hover:scale-110 transition">
                    <FileText size={16}/>
                  </div>
                  <span className="text-[10.5px] font-bold text-slate-700">View Reports</span>
                </button>

                {/* Button 6 */}
                <button onClick={() => setActiveSidebarTab("settings")} className="bg-slate-50 border border-slate-100 py-4.5 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-rose-50 hover:border-rose-250 transition-all duration-150 p-2.5 cursor-pointer text-center group">
                  <div className="bg-rose-100 text-rose-500 p-2.5 rounded-xl group-hover:scale-110 transition">
                    <Zap size={16}/>
                  </div>
                  <span className="text-[10.5px] font-bold text-slate-700">Manage Offers</span>
                </button>

              </div>
            </div>

            {/* 2. SYSTEM TELEMETRY OVERVIEW */}
            <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-left">
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">System Overview</h3>
              
              <div className="space-y-3.5 pt-1">
                
                {/* Item A */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                    <Activity size={14} className="text-[#047857]"/>
                    <span>Server Status</span>
                  </div>
                  <span className="text-xs font-black text-emerald-600 flex items-center gap-1.5 font-mono">
                    <span className="size-2 bg-emerald-500 rounded-full animate-pulse"/>
                    <span>All systems operational</span>
                  </span>
                </div>

                {/* Item B */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs text-slate-605">
                    <span className="font-semibold text-slate-600">Sandbox Storage</span>
                    <span className="font-bold text-slate-800 font-mono">72% Used</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: "72%" }}/>
                  </div>
                </div>

                {/* Item C */}
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-600">SMS Balance</span>
                  <span className="text-xs text-slate-800 font-bold font-mono">{smsBalance.toLocaleString()} SMS</span>
                </div>

                {/* Item D */}
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-600">Email Balance</span>
                  <span className="text-xs text-slate-805 font-bold font-mono">{emailBalance.toLocaleString()} Emails</span>
                </div>

              </div>
            </div>

            {/* 3. NEW IDEAS / SUGGESTIONS (INTERACTIVE FEED) */}
            <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">New Ideas / Suggestions</h3>
                <button onClick={() => {
                const tag = prompt("Suggest new medical pipeline optimization:");
                if (tag) {
                    setLocalIdeas([{ id: "id-" + Math.random(), title: tag, suggestedBy: "Admin", date: "Just now", tag: "New", color: "purple" }, ...localIdeas]);
                    showToast("Your enterprise recommendation was submitted!");
                }
            }} className="text-[10px] text-[#047857] font-black border border-[#a7f3d0] bg-[#ecfdf5] px-2 py-0.5 rounded-full hover:bg-emerald-100 transition cursor-pointer flex items-center gap-1">
                  <Plus size={10}/>
                  <span>Add New Idea</span>
                </button>
              </div>

              {/* Feed lists */}
              <div className="space-y-3 pt-1 text-left">
                {localIdeas.map((idea) => (<div key={idea.id} className="text-left text-xs bg-slate-50/50 hover:bg-slate-50 border border-slate-100 p-2.5 rounded-xl leading-tight">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 text-[8px] font-black rounded font-mono ${idea.tag === "New"
                    ? "bg-purple-100 text-purple-700"
                    : idea.tag === "In Progress"
                        ? "bg-blue-105 bg-blue-100 text-blue-700"
                        : "bg-emerald-100 text-emerald-800"}`}>
                        {idea.tag}
                      </span>
                      <span className="text-[9px] text-slate-400 font-medium">{idea.date}</span>
                    </div>
                    <p className="font-extrabold text-slate-800 mt-2.5 text-[11px]">{idea.title}</p>
                    <p className="text-[9px] text-slate-400 mt-1 font-sans">Suggested by <span className="font-semibold text-slate-500">{idea.suggestedBy}</span></p>
                  </div>))}
              </div>
            </div>

          </section>
        </>) : activeSidebarTab === "Dashboard Hub" ? (<DashboardHub doctors={doctors} appointments={appointments}/>) : activeSidebarTab === "users" ? (<UsersPanel localUsers={localUsers} setLocalUsers={setLocalUsers} handleAddUser={handleAddUser} newUserName={newUserName} setNewUserName={setNewUserName} newUserEmail={newUserEmail} setNewUserEmail={setNewUserEmail} newUserPhone={newUserPhone} setNewUserPhone={setNewUserPhone} newUserType={newUserType} setNewUserType={setNewUserType} newUserStatus={newUserStatus} setNewUserStatus={setNewUserStatus} showToast={showToast} handleRemoveUser={handleRemoveUser}/>) : activeSidebarTab === "doctors" ? (<DoctorDetailsPanel doctors={doctors} setDoctors={setDoctors} appointments={appointments} showToast={showToast}/>) : activeSidebarTab === "appointments" ? (<AppointmentsPanel appointments={appointments} doctors={doctors} showToast={showToast}/>) : activeSidebarTab === "hospitals" ? (<HospitalsPanel showToast={showToast}/>) : activeSidebarTab === "consultations" ? (<ConsultationsPanel showToast={showToast}/>) : activeSidebarTab === "feedback" ? (<ReviewsRatingsPanel showToast={showToast}/>) : activeSidebarTab === "vts" ? (<VTSPanel showToast={showToast}/>) : activeSidebarTab === "heatmap" ? (<HeatmapPanel showToast={showToast}/>) : activeSidebarTab === "reports" ? (<ReportsPanel showToast={showToast}/>) : activeSidebarTab === "analytics" ? (<AnalyticsPanel showToast={showToast}/>) : activeSidebarTab === "notifications" ? (<NotificationsPanel showToast={showToast}/>) : activeSidebarTab === "messages" ? (<MessagesPanel showToast={showToast}/>) : activeSidebarTab === "banners" ? (<BannersPanel showToast={showToast}/>) : activeSidebarTab === "settings" ? (<SettingsPanel showToast={showToast}/>) : activeSidebarTab === "roles" ? (<RolesPanel showToast={showToast}/>) : activeSidebarTab === "audits" ? (<AuditPanel showToast={showToast}/>) : (<div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6" id="specific-page-container">
            
            {/* Page Header */}
            <div className="flex justify-between items-center border-b border-slate-150 pb-4">
              <div className="flex items-center gap-2">
                <div className="bg-emerald-55 bg-emerald-50 text-[#047857] p-2 rounded-xl">
                  <ShieldCheck size={20}/>
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">{activeSidebarTab} Workspace Panel</h2>
                  <p className="text-[10px] text-slate-400 font-mono uppercase">Enterprise data-layer secure view</p>
                </div>
              </div>
            </div>

            {/* SEARCH FILTER BOX inside Page */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14}/>
              <input id="admin-panel-search" name="searchQuery" type="text" placeholder={`Search ${activeSidebarTab}...`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-205 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-800"/>
            </div>

            <div className="space-y-6">

              {/* ================================ PANEL TAB 2: DOCTORS ================================ */}
              {activeSidebarTab === "doctors" && (<div className="space-y-6">
                  <form onSubmit={handleAddDoctor} className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-3 text-xs">
                    <h4 className="text-[11px] font-black uppercase text-slate-705 text-slate-700 tracking-wide">Onboard Certified Physician</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" required placeholder="Dr. Full Name" value={newDocName} onChange={(e) => setNewDocName(e.target.value)} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-800"/>
                      <select value={newDocSpec} onChange={(e) => setNewDocSpec(e.target.value)} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-700">
                        <option value="General Practitioner">General Practitioner</option>
                        <option value="Cardiologist">Cardiologist</option>
                        <option value="Neurologist">Neurologist</option>
                        <option value="Dermatologist">Dermatologist</option>
                        <option value="Pediatrician">Pediatrician</option>
                        <option value="Orthopedic">Orthopedic</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" required placeholder="Experience e.g. 18+ Years" value={newDocExp} onChange={(e) => setNewDocExp(e.target.value)} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-800 animate-none"/>
                      <button type="submit" className="bg-[#047857] text-white hover:bg-emerald-800 transition rounded-lg font-bold">
                        Approve Credentials
                      </button>
                    </div>
                  </form>

                  <div className="space-y-3">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Duty Registry</p>
                    <div className="divide-y divide-slate-100 max-h-[350px] overflow-y-auto">
                      {doctors
                    .filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.specialization.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(d => (<div key={d.id} className="py-2.5 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2.5">
                              <img src={d.image} alt={d.name} className="size-8.5 rounded-full object-cover border border-slate-100" referrerPolicy="no-referrer"/>
                              <div className="text-left">
                                <p className="font-extrabold text-slate-800">{d.name}</p>
                                <p className="text-[10px] text-slate-400">{d.specialization} • {d.experience}</p>
                              </div>
                            </div>
                            <span className="text-[9px] font-black text-[#047857] bg-emerald-50 border border-emerald-150 rounded px-2 py-0.5 font-mono">
                              ⭐ {d.rating}
                            </span>
                          </div>))}
                    </div>
                  </div>
                </div>)}

              {/* ================================ PANEL TAB 7: NOTIFICATIONS ================================ */}
              {activeSidebarTab === "notifications" && (<div className="space-y-5">
                  <div className="bg-slate-50 border border-slate-205 p-4 rounded-xl text-left space-y-3">
                    <h4 className="text-xs font-black uppercase text-slate-700 tracking-wide">Publish System Dashboard Broadcast Alert</h4>
                    <textarea className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none" rows={3} value={activeAlertMsg} onChange={(e) => setActiveAlertMsg(e.target.value)} placeholder="Type broadcast text displayed on patients dashboard..."/>
                    <button onClick={() => showToast("Enterprise clinical broadcast committed across client nodes.")} className="w-full bg-[#047857] text-white py-2 rounded-lg font-bold hover:bg-emerald-800 transition text-xs">
                      Dispatch Broadcast Banner
                    </button>
                  </div>
                </div>)}



              {/* ================================ PANEL TAB 11.5: VTS TELEMETRY DENSITY ================================ */}
              {activeSidebarTab === "vts" && (<div className="space-y-6 text-left">
                  <div className="bg-slate-50 p-4 border border-slate-205 rounded-xl text-xs space-y-3">
                    <h4 className="font-black text-slate-800 uppercase tracking-widest text-[10px]">Vital Tracking System (VTS) Dynamic Console</h4>
                    <p className="text-slate-500 leading-normal">
                      Monitor medical IoT streams, real-time patient heartbeats, and clinician network latency in the integrated sandbox.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div className="p-3 bg-white rounded-xl border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">UPLINK RATE</p>
                        <p className="text-lg font-black text-[#047857] font-mono">981 Mbps</p>
                        <span className="text-[9px] text-emerald-600 font-bold">● High Speed</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">IoT PATIENTS</p>
                        <p className="text-lg font-black text-slate-800 font-mono">1,482</p>
                        <span className="text-[9px] text-slate-400">Streaming live data</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">LATENCY</p>
                        <p className="text-lg font-black text-slate-800 font-mono">12 ms</p>
                        <span className="text-[9px] text-emerald-600 font-bold">Excellent</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">ALERTS TRIAGED</p>
                        <p className="text-lg font-black text-rose-600 font-mono">0 ACTIVE</p>
                        <span className="text-[9px] text-slate-400">All streams normal</span>
                      </div>
                    </div>
                  </div>

                  {/* Real-time patient heartbeat simulations */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Live IoT Stream Buffer</h4>
                    <div className="bg-slate-900 rounded-xl p-4 font-mono text-[11px] text-emerald-400 space-y-2 max-h-[220px] overflow-y-auto shadow-inner">
                      <div className="flex justify-between items-center bg-slate-800/50 p-2 rounded">
                        <span>[STREAM-102] Priya Sharma</span>
                        <span className="text-emerald-400 animate-pulse">● Heart: 74 bpm | SpO2: 99% | T: 98.4 F</span>
                        <span className="text-slate-400 font-bold">NORMAL</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-800/50 p-2 rounded">
                        <span>[STREAM-105] Ramesh Kumar</span>
                        <span className="text-[#3b82f6] animate-pulse">● Heart: 68 bpm | SpO2: 97% | T: 97.9 F</span>
                        <span className="text-slate-400 font-bold">NORMAL</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-800/50 p-2 rounded">
                        <span>[STREAM-108] Kavita Reddy</span>
                        <span className="text-amber-500">● Heart: 89 bpm | SpO2: 95% | T: 99.1 F</span>
                        <span className="text-amber-400 font-bold">ELEVATED TEMP</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-800/50 p-2 rounded">
                        <span>[STREAM-111] Arjun Singh</span>
                        <span className="text-emerald-400 animate-pulse">● Heart: 72 bpm | SpO2: 98% | T: 98.6 F</span>
                        <span className="text-slate-400 font-bold">NORMAL</span>
                      </div>
                    </div>
                  </div>

                  {/* Trigger Simulator Action */}
                  <div className="flex justify-end">
                    <button onClick={() => showToast("Emergency VTS trigger drills issued to active clinical nodes.")} className="bg-[#047857] hover:bg-emerald-800 text-white font-bold text-[11px] px-4 py-2 rounded-xl transition cursor-pointer">
                      Issue System-Wide VTS Status Check
                    </button>
                  </div>
                </div>)}

              {/* ================================ PANEL TAB 11: HEATMAP DATA VIEWER ================================ */}
              {activeSidebarTab === "heatmap" && (<div className="space-y-5">
                  <div className="bg-slate-50 p-4 border border-slate-250 rounded-xl text-xs space-y-3">
                    <h4 className="font-black text-slate-805">UI Click telemetry grid telemetry</h4>
                    <p className="text-slate-500">Live click coordinates tracking metrics captured from the EliteCare application portal landing page.</p>
                    
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-white rounded-lg border border-slate-100 text-left">
                        <p className="text-slate-400">Total hover coordinate triggers</p>
                        <p className="text-lg font-black text-slate-800 font-mono">14,240</p>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-slate-100 text-left">
                        <p className="text-slate-400">Average CTA conversions</p>
                        <p className="text-lg font-black text-[#047857] font-mono">82.4%</p>
                      </div>
                    </div>
                  </div>
                </div>)}

              {/* ================================ PANEL TAB 12: SYSTEM PORTAL SETTINGS ================================ */}
              {activeSidebarTab === "settings" && (<div className="space-y-5 text-left">
                  <div className="border border-slate-200/80 p-5 rounded-xl bg-slate-50 space-y-4 text-xs">
                    <h4 className="font-black uppercase text-slate-700 text-[11px] tracking-wide">Enterprise Tariff Setup</h4>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-600 block">General Telehealth Consultancy Standard Tariff ($)</label>
                      <input type="number" value={consultationBaseFee} onChange={(e) => setConsultationBaseFee(Math.max(Number(e.target.value), 50))} className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-mono"/>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-605 text-slate-600 block">Virtual Mailbox SMTP Account Balance</label>
                      <input type="number" value={emailBalance} onChange={(e) => setEmailBalance(Number(e.target.value))} className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-mono"/>
                    </div>

                    <button onClick={() => showToast("Telehealth portal system operational settings committed to Cloud SQL DB.")} className="w-full bg-[#047857] text-white py-2 rounded-lg font-bold hover:bg-emerald-800 transition">
                      Commit Database variables
                    </button>
                  </div>
                </div>)}

              {/* ================================ PANEL TAB 13: REPORTS GENERATOR ================================ */}
              {activeSidebarTab === "reports" && (<div className="space-y-5">
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs space-y-3">
                    <h4 className="font-black text-slate-700">Financial Reports & Auditing Tool</h4>
                    <p className="text-slate-400">Generate, compile, and download CSV/PDF audit balance ledger sheets corresponding to May 2026 operations.</p>
                    
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button onClick={() => showToast("Revenue CSV table ledger computed. Downloading file... Compiled to excel.")} className="bg-white border border-slate-200 p-3 rounded-xl hover:bg-slate-50 font-bold flex items-center justify-center gap-2">
                        <FileSpreadsheet size={15} className="text-[#047857]"/>
                        <span>Revenue XLS</span>
                      </button>
                      <button onClick={() => showToast("Medical Doctor Shifts duty charts output. Downloading file... Completed.")} className="bg-white border border-slate-200 p-3 rounded-xl hover:bg-slate-50 font-bold flex items-center justify-center gap-2">
                        <Download size={15} className="text-indigo-600"/>
                        <span>Duty List PDF</span>
                      </button>
                    </div>
                  </div>
                </div>)}

              {/* ================================ PANEL TAB 14: ANALYTICS DEMOGRAPHICS ================================ */}
              {activeSidebarTab === "analytics" && (<div className="space-y-5">
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs text-left space-y-3">
                    <h4 className="font-bold text-slate-805 text-slate-700">Active Patient Age bracket distributions</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[11px]">
                        <span>Age Bracket 18 - 30</span>
                        <span className="font-mono font-bold text-slate-700">42% (Most active users)</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: "42%" }}/>
                      </div>

                      <div className="flex justify-between items-center text-[11px] pt-1">
                        <span>Age Bracket 31 - 50</span>
                        <span className="font-mono font-bold text-slate-700">38%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500" style={{ width: "38%" }}/>
                      </div>

                      <div className="flex justify-between items-center text-[11px] pt-1">
                        <span>Age Bracket 51+</span>
                        <span className="font-mono font-bold text-slate-700">20%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-violet-400" style={{ width: "20%" }}/>
                      </div>
                    </div>
                  </div>
                </div>)}

              {/* ================================ PANEL TAB 15: ROLES AND AUDITS MATRIX ================================ */}
              {activeSidebarTab === "roles" && (<div className="space-y-4">
                  <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 text-xs text-left space-y-3.5">
                    <h4 className="font-black text-slate-750">Cloud Registry RBAC Security Protocol</h4>
                    <p className="text-slate-400 leading-normal">Assign role capabilities parameters for administrative login nodes.</p>
                    
                    <div className="space-y-2 pt-2.5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold">Super Admin Developer Privilege</span>
                        <span className="text-emerald-500 text-xs font-bold font-serif">✓ All Systems Allowed</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Associated Clinician Clinic login privileges</span>
                        <span className="text-[#047857]">Allowed</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Patient Diagnostics Profile writing privileges</span>
                        <span className="text-rose-500 font-bold block">Blocked Admin Only</span>
                      </div>
                    </div>
                  </div>
                </div>)}

              {/* ================================ PANEL TAB 16: SYSTEM AUDIT SECURITY LOGS ================================ */}
              {activeSidebarTab === "audits" && (<div className="space-y-4">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Trace Logs Telemetry</p>
                  <div className="space-y-2.5 max-h-[400px] overflow-y-auto">
                    <div className="p-3 border border-slate-100 rounded-xl bg-slate-50 text-xs text-left">
                      <p className="font-bold text-slate-805 text-slate-800">Admin User credentials verified.</p>
                      <p className="text-[10px] text-slate-400">Location: Mumbai IP Gateway • 1 hour ago</p>
                    </div>
                    <div className="p-3 border border-slate-100 rounded-xl bg-slate-50 text-xs text-left">
                      <p className="font-bold text-slate-850">Dr. Vivek Mehta altered schedule.</p>
                      <p className="text-[10px] text-slate-400">Session ID: #APRT202 • 3 hours ago</p>
                    </div>
                    <div className="p-3 border border-slate-100 rounded-xl bg-slate-50 text-xs text-left">
                      <p className="font-bold text-slate-850">Database Schema synchronized to Cloud instance.</p>
                      <p className="text-[10px] text-slate-400">Drizzle ORM Engine • 12 hours ago</p>
                    </div>
                  </div>
                </div>)}

            </div>

            {/* Bottom Actions of Inline Page */}
            <div className="border-t border-slate-150 pt-4 flex gap-3">
              <button onClick={() => {
                showToast("Bulk synchronization complete: Clean active buffers published.");
            }} className="bg-slate-900 text-white rounded-lg px-6 py-2 text-xs font-bold text-center hover:bg-slate-800 transition cursor-pointer">
                Sync Database Changes
              </button>
              <button onClick={() => {
                setActiveSidebarTab("Dashboard");
                setSearchQuery("");
            }} className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-100 transition cursor-pointer">
                Back to Dashboard
              </button>
            </div>

          </div>)}

      </main>
      </div>

    </div>);
}
