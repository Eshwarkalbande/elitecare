import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Heart, Search, Bell, CheckCircle2, Phone, Mail, MapPin, Clock, ArrowRight, ShieldCheck, Star, Activity, Video, Cpu, Beaker, Dumbbell, Apple, Mic, HeartHandshake, Siren, CalendarDays, Stethoscope, ChevronRight, Building, GraduationCap, Users, Facebook, Twitter, Instagram, Linkedin, Youtube, Menu, X, } from "lucide-react";
import { SERVICES, DOCTORS, BENEFITS, STATISTICS, MOCK_APPOINTMENTS, MOCK_RECORDS } from "./mockData";
// Specialized components
import SymptomChecker from "./components/SymptomChecker";
import MedicineScanner from "./components/MedicineScanner";
import PatientDashboard from "./components/PatientDashboard";
import DoctorFinder from "./components/DoctorFinder";
import NearbyHospitals from "./components/NearbyHospitals";
import LoginPage from "./components/LoginPage";
import VideoConsultation from "./components/VideoConsultation";
import LabTests from "./components/LabTests";
import WorkoutAndDiet from "./components/WorkoutAndDiet";
import EmotionMind from "./components/EmotionMind";
import SurgeryAssist from "./components/SurgeryAssist";
import TenMinConsult from "./components/TenMinConsult";
import ChatbotWidget from "./components/ChatbotWidget";
import AdminDashboard from "./components/AdminDashboard";
import DoctorDashboard from "./components/DoctorDashboard";
import EmergencyAlert from "./components/EmergencyAlert";
import HealthProblems from "./components/HealthProblems";
import QuickSymptomLog from "./components/QuickSymptomLog";
import WellnessRewards from "./components/WellnessRewards";
import VoiceAssistance from "./components/VoiceAssistance";
import PatientSettings from "./components/PatientSettings";
import MedicalHistoryPanel from "./components/MedicalHistoryPanel";
import PrescriptionHistoryPanel from "./components/PrescriptionHistoryPanel";
import SmartServices from "./components/SmartServices";
import AdminNavWidgets from "./components/AdminNavWidgets";
import HealthHub from "./components/HealthHub";
import LabReportExplainer from "./components/LabReportExplainer";
import MedicineReminders from "./components/MedicineReminders";
import LanguageButton from "./components/hub/LanguageButton";
import EmergencyCard from "./components/hub/EmergencyCard";
import AiConsentSetting from "./components/hub/AiConsentSetting";
import HealthTranslator from "./components/HealthTranslator";
import ErrorBoundary from "./components/hub/ErrorBoundary";
import { FEATURES } from "./config/features";
import { getStoredUser, clearSession } from "./services/authService";
import { getAppointments as fetchPatientAppointments } from "./services/patientService";
function EliteCareLogo({ size = 36 }) {
    return (<svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="full-grad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#047857"/>
          <stop offset="50%" stopColor="#059669"/>
          <stop offset="100%" stopColor="#10b981"/>
        </linearGradient>
      </defs>
      
      {/* Outer rounded cross */}
      <path d="M 45 15 
           h 30 
           a 10 10 0 0 1 10 10 
           v 20 
           h 20 
           a 10 10 0 0 1 10 10 
           v 20 
           a 10 10 0 0 1 -10 10 
           h -20 
           v 20 
           a 10 10 0 0 1 -10 10 
           h -30 
           a 10 10 0 0 1 -10 -10 
           v -25 
           h -20 
           a 10 10 0 0 1 -10 -10 
           v -20 
           a 10 10 0 0 1 10 -10 
           h 25 
           v -20 
           a 10 10 0 0 1 10 -10 
           z" fill="url(#full-grad)"/>
      
      {/* Styled human figure inside */}
      <circle cx="60" cy="45" r="8" fill="white"/>
      <path d="M 38 58 
           c 10 -5, 34 -5, 44 0 
           c -4 7, -11 13, -22 13 
           c -11 0, -18 -6, -22 -13 
           z" fill="white"/>
      <path d="M 54 58 
           l 6 15 
           l 6 -15 
           z" fill="white"/>

      {/* Supporting hand at the bottom */}
      <path d="M 32 82 
           c 10 22, 46 22, 56 0 
           c -12 12, -44 12, -56 0 
           z" fill="white" opacity="0.8"/>
      <path d="M 28 77 
           c 15 28, 50 28, 64 0 
           c -10 22, -54 22, -64 0 
           z" fill="url(#full-grad)"/>
    </svg>);
}
const ALL_PAGES = [
    "Home",
    "Patient Dashboard",
    "Doctor Dashboard",
    "Find the Doctor",
    "Nearby Hospitals",
    "Medicine Scanner",
    "Quick Symptom Log",
    "Voice Assistance",
    "Video Consultation",
    "Lab Tests",
    "Workout & Diet",
    "Emotion & Mind",
    "Surgery Assist",
    "10-Min Consult",
    "Emergency Alert",
    "Health Problems",
    "Wellness Rewards",
    "General Settings"
];
export default function App() {
    // Navigation active tab
    // Options: "Home" | "Dashboard" | "Patient Dashboard" | "Find the Doctor" | "Nearby Hospitals" | "Medicine Scanner"
    const [activeTab, setActiveTab] = useState("Home");
    const [searchGlobal, setSearchGlobal] = useState("");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    // Honour the OS "reduce motion" setting: keeps transitions off for everyone.
    const prefersReducedMotion = useReducedMotion();

    // Admin: which AdminDashboard section the top nav is pointing at.
    const [adminSection, setAdminSection] = useState("Dashboard");
    const [isAdminMoreOpen, setIsAdminMoreOpen] = useState(false);

    // Scroll back to the top whenever the active view changes, so long pages
    // don't leave the user stranded mid-document. Skipped on first render so a
    // browser-restored scroll position is preserved on reload.
    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    }, [activeTab, prefersReducedMotion]);
    // Patient Profile State & Controls
    const [patientProfile, setPatientProfile] = useState({
        fullName: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 019-2834",
        address: "123 Wellness Way, Suite 400, New York, NY 10001",
        bloodGroup: "O+",
        hasDiabetes: true,
        hasHypertension: true,
        hasAsthma: false,
        hasThyroid: false,
        hasHeartIssue: false,
        otherConditions: "Mild pollen allergies in springtime.",
        emergencyContactName: "Jane Doe",
        emergencyContactPhone: "+1 (555) 019-5867"
    });
    const [isProfileFormOpen, setIsProfileFormOpen] = useState(false);
    const [isProfileSavedSuccess, setIsProfileSavedSuccess] = useState(false);
    // Form edit buffer fields to handle raw edits before saving
    const [editFullName, setEditFullName] = useState(patientProfile.fullName);
    const [editEmail, setEditEmail] = useState(patientProfile.email);
    const [editPhone, setEditPhone] = useState(patientProfile.phone);
    const [editAddress, setEditAddress] = useState(patientProfile.address);
    const [editBloodGroup, setEditBloodGroup] = useState(patientProfile.bloodGroup);
    const [editHasDiabetes, setEditHasDiabetes] = useState(patientProfile.hasDiabetes);
    const [editHasHypertension, setEditHasHypertension] = useState(patientProfile.hasHypertension);
    const [editHasAsthma, setEditHasAsthma] = useState(patientProfile.hasAsthma);
    const [editHasThyroid, setEditHasThyroid] = useState(patientProfile.hasThyroid);
    const [editHasHeartIssue, setEditHasHeartIssue] = useState(patientProfile.hasHeartIssue);
    const [editOtherConditions, setEditOtherConditions] = useState(patientProfile.otherConditions);
    const [editEmergencyName, setEditEmergencyName] = useState(patientProfile.emergencyContactName);
    const [editEmergencyPhone, setEditEmergencyPhone] = useState(patientProfile.emergencyContactPhone);
    const startEditingProfile = () => {
        setEditFullName(patientProfile.fullName);
        setEditEmail(patientProfile.email);
        setEditPhone(patientProfile.phone);
        setEditAddress(patientProfile.address);
        setEditBloodGroup(patientProfile.bloodGroup);
        setEditHasDiabetes(patientProfile.hasDiabetes);
        setEditHasHypertension(patientProfile.hasHypertension);
        setEditHasAsthma(patientProfile.hasAsthma);
        setEditHasThyroid(patientProfile.hasThyroid);
        setEditHasHeartIssue(patientProfile.hasHeartIssue);
        setEditOtherConditions(patientProfile.otherConditions);
        setEditEmergencyName(patientProfile.emergencyContactName);
        setEditEmergencyPhone(patientProfile.emergencyContactPhone);
        setIsProfileFormOpen(true);
        setIsProfileSavedSuccess(false);
    };
    const savePatientProfile = (e) => {
        e.preventDefault();
        setPatientProfile({
            fullName: editFullName,
            email: editEmail,
            phone: editPhone,
            address: editAddress,
            bloodGroup: editBloodGroup,
            hasDiabetes: editHasDiabetes,
            hasHypertension: editHasHypertension,
            hasAsthma: editHasAsthma,
            hasThyroid: editHasThyroid,
            hasHeartIssue: editHasHeartIssue,
            otherConditions: editOtherConditions,
            emergencyContactName: editEmergencyName,
            emergencyContactPhone: editEmergencyPhone
        });
        setIsProfileSavedSuccess(true);
        setTimeout(() => {
            setIsProfileFormOpen(false);
            setIsProfileSavedSuccess(false);
        }, 1800);
    };
    // Global State for Applet Interactions (Appointments tracker)
    const [doctorsList, setDoctorsList] = useState(DOCTORS);
    const [userRole, setUserRole] = useState("patient");
    const [currentUserName, setCurrentUserName] = useState("John Doe");
    const [currentUserEmail, setCurrentUserEmail] = useState("john.doe@example.com");
    const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
    const [records, setRecords] = useState(MOCK_RECORDS);
    const [preSelectedDoctor, setPreSelectedDoctor] = useState(null);
    // Gamification Central Engine States (Persisted in localStorage)
    const [userXP, setUserXP] = useState(() => {
        const saved = localStorage.getItem("elitecare_xp");
        return saved ? parseInt(saved, 10) : 120;
    });
    const [userLevel, setUserLevel] = useState(() => {
        const saved = localStorage.getItem("elitecare_level");
        return saved ? parseInt(saved, 10) : 3;
    });
    const [wellnessCoins, setWellnessCoins] = useState(() => {
        const saved = localStorage.getItem("elitecare_coins");
        return saved ? parseInt(saved, 10) : 450;
    });
    const [streakCount, setStreakCount] = useState(() => {
        const saved = localStorage.getItem("elitecare_streak");
        return saved ? parseInt(saved, 10) : 5;
    });
    // Sync to localStorage
    useEffect(() => {
        localStorage.setItem("elitecare_xp", userXP.toString());
        localStorage.setItem("elitecare_level", userLevel.toString());
        localStorage.setItem("elitecare_coins", wellnessCoins.toString());
        localStorage.setItem("elitecare_streak", streakCount.toString());
    }, [userXP, userLevel, wellnessCoins, streakCount]);
    // Gamification xp loader
    const addXP = (amount, coinAmount = 0) => {
        setUserXP((prev) => {
            const nextXP = prev + amount;
            const xpNeeded = userLevel * 150;
            if (nextXP >= xpNeeded) {
                setUserLevel((lvl) => {
                    const nextLvl = lvl + 1;
                    setNotifications((prevNotif) => [
                        {
                            id: "level-up-" + Date.now(),
                            text: `🎉 LEVEL UP! You reached Level ${nextLvl} Health Sovereign! +100 bonus wellness coins rewarded!`,
                            time: "Just now",
                            unread: true,
                        },
                        ...prevNotif,
                    ]);
                    return nextLvl;
                });
                return nextXP - xpNeeded;
            }
            return nextXP;
        });
        if (coinAmount > 0) {
            setWellnessCoins((wallet) => wallet + coinAmount);
        }
    };
    // Notification panel toggle
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: "n-1", text: "New: Smart Medicine Scanner is now fully operational with Gemini 3.5 AI.", time: "Just now", unread: true },
        { id: "n-2", text: "Reminder: Scheduled consult with Dr. Sarah Johnson on June 18.", time: "2 hrs ago", unread: true },
        { id: "n-3", text: "Healthy tips: Log your daily habit check-ins to unlock dashboard health goals.", time: "1 day ago", unread: false },
    ]);
    // Profile status modal simulation
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [isSignedIn, setIsSignedIn] = useState(false);

    // --- Restore session on page refresh (token saved by LoginPage) ---
    useEffect(() => {
        const savedUser = getStoredUser();
        const savedToken = localStorage.getItem("elitecare_token");
        if (savedUser && savedToken) {
            setIsSignedIn(true);
            setUserRole(savedUser.role === "doctor" ? "physician" : savedUser.role);
            setCurrentUserName(savedUser.name);
            setCurrentUserEmail(savedUser.email);
        }
    }, []);

    // --- Pull real appointments from the backend once a patient is signed in ---
    useEffect(() => {
        if (!isSignedIn || userRole !== "patient") return;
        fetchPatientAppointments()
            .then((rows) => {
                const mapped = rows.map((r) => ({
                    id: r.id,
                    doctorName: r.doctor_name,
                    specialization: r.specialization,
                    date: r.appointment_date,
                    time: r.appointment_time,
                    patientName: currentUserName,
                    status: r.status,
                    fee: r.fee,
                }));
                setAppointments(mapped);
            })
            .catch((err) => {
                console.warn("Could not load appointments from backend, showing sample data instead.", err?.message);
            });
    }, [isSignedIn, userRole]);

    // Scroll to top upon tab selection
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [activeTab]);
    // Handle Booking scheduling action
    const handleBookAppointment = (newApt) => {
        setAppointments([newApt, ...appointments]);
        // Append to notifications
        setNotifications([
            {
                id: "n-" + Date.now(),
                text: `Confirmed slot booked with ${newApt.doctorName} for ${newApt.date} at ${newApt.time}.`,
                time: "Just now",
                unread: true,
            },
            ...notifications,
        ]);
    };
    // Cancel Appointment handler
    const handleCancelAppointment = (id) => {
        setAppointments(appointments.filter((apt) => apt.id !== id));
    };
    // Select doctor and go straight to scheduling view
    const handleBookDirect = (doc) => {
        setPreSelectedDoctor(doc);
        setActiveTab("Find the Doctor");
    };
    const handleClearPreselect = () => {
        setPreSelectedDoctor(null);
    };
    // Map service icon name to custom Lucide JSX
    const renderServiceIcon = (iconName) => {
        const props = { className: "text-green-600", size: 24 };
        switch (iconName) {
            case "Video":
                return <Video {...props}/>;
            case "Cpu":
                return <Cpu {...props}/>;
            case "Beaker":
                return <Beaker {...props}/>;
            case "Activity":
                return <Activity {...props}/>;
            case "Dumbbell":
                return <Dumbbell {...props}/>;
            case "Apple":
                return <Apple {...props}/>;
            case "Mic":
                return <Mic {...props}/>;
            case "HeartHandshake":
                return <HeartHandshake {...props}/>;
            case "Siren":
                return <Siren {...props} className="text-green-600 animate-pulse-slow"/>;
            case "CalendarDays":
                return <CalendarDays {...props}/>;
            case "Stethoscope":
                return <Stethoscope {...props}/>;
            case "Clock":
                return <Clock {...props}/>;
            default:
                return <Heart {...props}/>;
        }
    };
    // Route a Smart Service card's "Launch Applet" action to the right dashboard
    const handleServiceLaunch = (id) => {
        if (id === "video-consult") setActiveTab("Video Consultation");
        else if (id === "lab-tests") setActiveTab("Lab Tests");
        else if (id === "symptom-checker") setActiveTab("Quick Symptom Log");
        else if (id === "voice-assist") setActiveTab("Voice Assistance");
        else if (id === "visit-booking") setActiveTab("Find the Doctor");
        else if (id === "health-problem") setActiveTab("Health Problems");
        else if (id === "emergency-alert") setActiveTab("Emergency Alert");
        else if (id === "workout-plan" || id === "diet-plan") setActiveTab("Workout & Diet");
        else if (id === "emotion-health") setActiveTab("Emotion & Mind");
        else if (id === "surgery-assist") setActiveTab("Surgery Assist");
        else if (id === "10-min-service") setActiveTab("10-Min Consult");
        else setActiveTab("Patient Dashboard");
    };
    const renderBenefitIcon = (iconName) => {
        const props = { className: "text-emerald-600 size-6 shrink-0" };
        switch (iconName) {
            case "Sparkles":
                return <CheckCircle2 {...props}/>;
            case "ShieldCheck":
                return <ShieldCheck {...props}/>;
            case "PhoneCall":
                return <Phone {...props}/>;
            case "BadgeCheck":
                return <CheckCircle2 {...props}/>;
            case "Building2":
                return <Building {...props}/>;
            case "FileSpreadsheet":
                return <CheckCircle2 {...props}/>;
            case "BookmarkCheck":
                return <CheckCircle2 {...props}/>;
            default:
                return <CheckCircle2 {...props}/>;
        }
    };
    const renderStatisticsIcon = (iconName) => {
        const props = { className: "text-green-600 shrink-0", size: 30 };
        switch (iconName) {
            case "Building":
                return <Building {...props}/>;
            case "Users":
                return <Users {...props}/>;
            case "GraduationCap":
                return <GraduationCap {...props}/>;
            case "Clock":
                return <Clock {...props}/>;
            default:
                return <Heart {...props}/>;
        }
    };
    // Admin nav items map 1:1 onto real AdminDashboard sidebar sections
    // (its internal `activeSidebarTab` values).
    const ADMIN_NAV_ITEMS = [
        { label: "Dashboard", section: "Dashboard" },
        { label: "Users", section: "users" },
        { label: "Appointments", section: "appointments" },
        { label: "Analytics", section: "analytics" },
        { label: "Audit Logs", section: "audits" },
        { label: "Reports", section: "reports" },
    ];
    // Shared/general pages that used to sit in the admin navbar, now grouped
    // behind a "More" dropdown so the admin nav stays focused.
    const ADMIN_MORE_ITEMS = ["Find the Doctor", "Nearby Hospitals", "Medicine Scanner"];

    // Close every open navbar dropdown on Escape (accessibility).
    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key !== "Escape") return;
            setShowNotifications(false);
            setShowProfileMenu(false);
            setIsAdminMoreOpen(false);
            setIsMobileMenuOpen(false);
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    // Close the navbar dropdowns when clicking anywhere outside the header.
    const navbarRef = useRef(null);
    useEffect(() => {
        const onPointerDown = (e) => {
            if (navbarRef.current && navbarRef.current.contains(e.target)) return;
            setShowNotifications(false);
            setShowProfileMenu(false);
            setIsAdminMoreOpen(false);
        };
        document.addEventListener("mousedown", onPointerDown);
        return () => document.removeEventListener("mousedown", onPointerDown);
    }, []);

    const menuItems = userRole === "admin"
        ? ["Admin Dashboard", "Patient Dashboard", "Find the Doctor", "Nearby Hospitals", "Medicine Scanner"]
        : userRole === "physician"
            ? ["Doctor Dashboard", "Patient Dashboard", "Find the Doctor", "Nearby Hospitals", "Medicine Scanner"]
            : ["Patient Dashboard", "Find the Doctor", "Nearby Hospitals", "Medicine Scanner"];
    return (<div className="min-h-screen bg-slate-50/10 text-slate-800 font-sans selection:bg-green-150 selection:text-green-805 flex flex-col justify-between overflow-x-hidden antialiased">
      
      {/* 1. NAVBAR SECTION - FULL WIDTH */}
      <header ref={navbarRef} className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 py-4 w-full" id="navbar">
        <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16 flex items-center justify-between gap-4">
          
          {/* Logo and Brand */}
          <div className="flex items-center gap-1.5 cursor-pointer select-none" onClick={() => setActiveTab("Home")}>
            <EliteCareLogo size={38}/>
            <span className="text-2xl font-black tracking-tight flex items-center">
              <span className="text-emerald-700">Elite</span>
              <span className="text-[#16A34A]">Care</span>
            </span>
            {isSignedIn && userRole === "admin" && (<span className="text-[9px] font-black uppercase tracking-wide text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md px-1 ml-1 shrink-0" title="Admin Console">Admin Console</span>)}
          </div>

            {/* Desktop Center Navigation Menu */}
            {isSignedIn && userRole !== "admin" && (<nav className="hidden lg:flex items-center gap-1">
                {menuItems.map((item) => (<motion.button key={item} whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }} onClick={() => {
                    setActiveTab(item);
                    setSearchGlobal("");
                }} className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition duration-150 relative cursor-pointer ${activeTab === item
                    ? "text-green-600 bg-green-50"
                    : "text-slate-600 hover:text-green-600"}`}>
                    {item}
                    {activeTab === item && (<motion.span layoutId="nav-indicator" className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-4 h-1 rounded-full bg-green-600" transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}></motion.span>)}
                  </motion.button>))}
              </nav>)}

            {/* Admin Desktop Navigation Menu — admin-focused sections, no visual restyle */}
            {isSignedIn && userRole === "admin" && (<nav className="hidden xl:flex items-center gap-1 shrink-0" aria-label="Admin sections">
                {ADMIN_NAV_ITEMS.map((item) => (<motion.button key={item.label} whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }} onClick={() => {
                    setAdminSection(item.section);
                    setActiveTab("Admin Dashboard");
                    setSearchGlobal("");
                    setIsAdminMoreOpen(false);
                }} className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition duration-150 relative cursor-pointer whitespace-nowrap shrink-0 ${activeTab === "Admin Dashboard" && adminSection === item.section
                    ? "text-green-600 bg-green-50"
                    : "text-slate-600 hover:text-green-600"}`}>
                    {item.label}
                    {activeTab === "Admin Dashboard" && adminSection === item.section && (<motion.span layoutId="nav-indicator" className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-4 h-1 rounded-full bg-green-600" transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}></motion.span>)}
                  </motion.button>))}

                {/* More dropdown for the general pages */}
                <div className="relative">
                  <motion.button whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }} onClick={() => setIsAdminMoreOpen(!isAdminMoreOpen)} aria-haspopup="menu" aria-expanded={isAdminMoreOpen} aria-label="More admin pages" className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition duration-150 cursor-pointer whitespace-nowrap shrink-0 ${isAdminMoreOpen || ADMIN_MORE_ITEMS.includes(activeTab)
                    ? "text-green-600 bg-green-50"
                    : "text-slate-600 hover:text-green-600"}`}>
                    More
                  </motion.button>
                  <AnimatePresence>
                    {isAdminMoreOpen && (<motion.div initial={{ opacity: 0, scale: 0.97, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: -4 }} transition={{ duration: prefersReducedMotion ? 0 : 0.15 }} className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-200 shadow-2xl rounded-2xl p-2 z-50 text-xs">
                      {ADMIN_MORE_ITEMS.map((item) => (<button key={item} onClick={() => {
                        setActiveTab(item);
                        setSearchGlobal("");
                        setIsAdminMoreOpen(false);
                    }} className={`w-full text-left px-3 py-2.5 rounded-xl transition font-medium cursor-pointer ${activeTab === item ? "text-green-600 bg-green-50" : "text-slate-800 hover:bg-slate-50"}`}>
                        {item}
                      </button>))}
                    </motion.div>)}
                  </AnimatePresence>
                </div>
              </nav>)}

            {/* Large Search bar in center — yields to the wider admin nav below xl */}
            {isSignedIn && (<div className={`${isSignedIn && userRole === "admin" ? "hidden xl:flex" : "hidden md:flex"} relative max-w-xs w-full min-w-0 shrink`}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15}/>
                <input id="global-search" name="globalSearch" type="text" aria-label={isSignedIn && userRole === "admin" ? "Search users, doctors, appointments" : "Search doctors, medicine, services"} placeholder={isSignedIn && userRole === "admin" ? "Search users, doctors, appointments..." : "Search doctors, medicine, services..."} className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 focus:bg-white text-gray-700 shadow-inner" value={searchGlobal} onChange={(e) => {
                setSearchGlobal(e.target.value);
                // Auto-route helper keys
                const q = e.target.value.toLowerCase();
                if (isSignedIn && userRole === "admin") {
                    // Admin routes straight into the matching AdminDashboard section.
                    if (q.includes("user"))
                        { setAdminSection("users"); setActiveTab("Admin Dashboard"); }
                    else if (q.includes("doctor"))
                        { setAdminSection("doctors"); setActiveTab("Admin Dashboard"); }
                    else if (q.includes("appointment"))
                        { setAdminSection("appointments"); setActiveTab("Admin Dashboard"); }
                    else if (q.includes("audit") || q.includes("log"))
                        { setAdminSection("audits"); setActiveTab("Admin Dashboard"); }
                    else if (q.includes("report"))
                        { setAdminSection("reports"); setActiveTab("Admin Dashboard"); }
                    return;
                }
                if (q.includes("doctor"))
                    setActiveTab("Find the Doctor");
                else if (q.includes("hospital") || q.includes("nearby"))
                    setActiveTab("Nearby Hospitals");
                else if (q.includes("scanner") || q.includes("medicine"))
                    setActiveTab("Medicine Scanner");
                else if (q.includes("symptom"))
                    setActiveTab("Medicine Scanner");
            }}/>
              </div>)}

            {/* Icons and Auth widgets */}
            <div className="flex items-center gap-3">
              
              {/* PERSISTENT GAMIFIED STATS HUD */}
              {isSignedIn && userRole === "patient" && (<div onClick={() => setActiveTab("Wellness Rewards")} className="flex items-center gap-2 bg-slate-100/60 border border-slate-200/50 hover:border-emerald-300 hover:bg-[#EEFDF5] px-3 py-1.5 rounded-full shadow-2xs shrink-0 cursor-pointer transition active:scale-98 select-none" title="Click to view Wellness Rewards & Prizes!">
                  {/* Streak indication */}
                  <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-black text-amber-600 bg-amber-50/90 border border-amber-200/50 px-2 py-0.5 rounded-full" title="Consecutive Health Streak 🔥">
                    <span>🔥</span>
                    <span className="font-mono">{streakCount}d</span>
                  </div>

                  {/* Level text */}
                  <div className="hidden sm:flex flex-col text-left justify-center border-r border-slate-200 pr-2 mr-1">
                    <span className="text-[8px] text-gray-400 uppercase font-black tracking-widest leading-none">Level {userLevel}</span>
                    <div className="w-16 bg-slate-200 h-1 rounded-full mt-1 overflow-hidden" title={`${userXP}/${userLevel * 150} XP to next Level`}>
                      <div className="bg-green-600 h-full rounded-full" style={{ width: `${Math.round((userXP / (userLevel * 150)) * 100)}%` }}/>
                    </div>
                  </div>

                  {/* Coins balance */}
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs font-black text-amber-700 bg-amber-55/40 border border-amber-200 px-2.5 py-0.5 rounded-full" title="Wellness Coins Balance 🪙">
                    <span>🪙</span>
                    <span className="font-mono">{wellnessCoins}</span>
                  </div>
                </div>)}
              
              {/* Admin-only widgets: system status, pending badge, quick actions */}
              {isSignedIn && userRole === "admin" && (<AdminNavWidgets onOpenSection={(section) => {
                setAdminSection(section);
                setActiveTab("Admin Dashboard");
              }}/>)}

              {/* App language (Phase 2B). The one header control the phase work
                  is allowed to add: it switches the language of every screen
                  that calls t(), and the choice is remembered. */}
              <LanguageButton />

              {/* Notification bell */}
              <div className="relative">
                <button onClick={() => {
            setShowNotifications(!showNotifications);
            setShowProfileMenu(false);
        }} className="size-10 rounded-full hover:bg-gray-50 text-slate-600 flex items-center justify-center border border-gray-200 transition cursor-pointer relative" title="Alerts and Notifications">
                  <Bell size={16}/>
                  {notifications.some((un) => un.unread) && (<span className="absolute top-2 right-2 inline-flex size-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white leading-none">
                      {notifications.filter((un) => un.unread).length}
                    </span>)}
                </button>

                {/* Notifications Panel Box */}
                <AnimatePresence>
                {showNotifications && (<motion.div initial={{ opacity: 0, scale: 0.98, y: -6 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -6 }} transition={{ duration: prefersReducedMotion ? 0 : 0.18 }} className="absolute right-0 mt-3 w-80 bg-white border border-gray-150 shadow-2xl rounded-2xl p-4 z-50 text-xs">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-2">
                      <span className="font-bold text-gray-700">Notifications Logs</span>
                      <button onClick={() => setNotifications(notifications.map((n) => ({ ...n, unread: false })))} className="text-[10px] text-green-600 hover:text-green-700 underline font-semibold">
                        Mark all read
                      </button>
                    </div>
                    <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                      {notifications.map((n) => (<div key={n.id} className={`p-2 rounded-lg transition-colors text-left ${n.unread ? "bg-green-50/65 border-l-2 border-green-500" : "bg-gray-50/50"}`}>
                          <p className="text-slate-800 leading-snug">{n.text}</p>
                          <span className="text-[9px] text-gray-400 mt-1 block">{n.time}</span>
                        </div>))}
                    </div>
                  </motion.div>)}
                </AnimatePresence>
              </div>

              {/* User profile avatar / Login */}
              {isSignedIn ? (<div className="relative">
                  <div onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
            }} className="flex items-center gap-2 cursor-pointer group">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" alt="User Avatar" className="size-9 rounded-full object-cover border-2 border-green-500 group-hover:opacity-85 transition"/>
                    <div className="hidden md:flex flex-col text-left select-none leading-none">
                      <span className="text-xs font-black text-slate-800 flex items-center gap-1">
                        {currentUserName}
                        {userRole === "admin" && <span className="text-[9px] bg-slate-905 text-slate-800 border border-slate-300 rounded-md px-1">Admin</span>}
                        {userRole === "physician" && <span className="text-[9px] bg-cyan-55 text-cyan-800 border border-cyan-200 rounded-md px-1">MD</span>}
                      </span>
                    </div>
                  </div>

                  <AnimatePresence>
                  {showProfileMenu && (<motion.div initial={{ opacity: 0, scale: 0.98, y: -6 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -6 }} transition={{ duration: prefersReducedMotion ? 0 : 0.18 }} className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 shadow-2xl rounded-2xl p-2 z-50 text-xs">
                      {/* Dynamic user profile header following screenshot */}
                      <div className="p-3 border-b border-gray-100 text-left">
                        <span className="block font-black text-slate-800 text-[13px]">
                          {currentUserName}
                        </span>
                        <span className="block text-[10px] text-slate-400 mt-1 font-semibold">
                          {userRole === "admin" ? "Admin" : userRole === "physician" ? "Doctor" : "Patient"} •{" "}
                          {currentUserEmail
                    ? currentUserEmail
                        .split("@")
                        .map((part) => part
                        .split(".")
                        .map((sub) => sub.charAt(0).toUpperCase() + sub.slice(1))
                        .join("."))
                        .join("@")
                    : ""}
                        </span>
                      </div>

                      {/* Dropdown Options List: Exactly 3 dynamic options tailored to the logged-in role */}
                      <div className="py-1 space-y-0.5 text-left">
                        {userRole === "admin" && (<button onClick={() => {
                        setActiveTab("Admin Dashboard");
                        setShowProfileMenu(false);
                    }} className="w-full text-left px-3 py-2.5 hover:bg-slate-50 text-slate-800 rounded-xl transition font-extrabold flex items-center gap-2 cursor-pointer" id="btn-admin-dashboard-link">
                            <span className="text-violet-600 font-bold text-sm">👤</span>
                            <span>Admin Panel</span>
                          </button>)}
                        {userRole === "admin" && (<>
                            {[
                                { label: "Audit Logs", section: "audits", icon: "🕓" },
                                { label: "Roles & Permissions", section: "roles", icon: "🛡️" },
                                { label: "System Settings", section: "settings", icon: "⚙️" },
                            ].map((row) => (<button key={row.section} onClick={() => {
                                setAdminSection(row.section);
                                setActiveTab("Admin Dashboard");
                                setShowProfileMenu(false);
                            }} className="w-full text-left px-3 py-2.5 hover:bg-slate-50 text-slate-800 rounded-xl transition font-medium flex items-center gap-2 cursor-pointer">
                                <span className="text-slate-500 font-bold text-[13px]">{row.icon}</span>
                                <span>{row.label}</span>
                            </button>))}
                          </>)}

                        {userRole === "physician" && (<button onClick={() => {
                        setActiveTab("Doctor Dashboard");
                        setShowProfileMenu(false);
                    }} className="w-full text-left px-3 py-2.5 hover:bg-slate-50 text-slate-800 rounded-xl transition font-extrabold flex items-center gap-2 cursor-pointer" id="btn-doctor-dashboard-link">
                            <span className="text-cyan-600 font-bold text-[13px]">🩺</span>
                            <span>Doctor Dashboard</span>
                          </button>)}

                        {userRole === "patient" && (<>
                            <button onClick={() => {
                        setActiveTab("Home");
                        setShowProfileMenu(false);
                    }} className="w-full text-left px-3 py-2.5 hover:bg-slate-50 text-slate-800 rounded-xl transition font-extrabold flex items-center gap-2 cursor-pointer" id="btn-patient-home-link">
                              <span className="text-emerald-500 font-bold text-sm">🏠</span>
                              <span>Patient Panel</span>
                            </button>
                            <button onClick={() => {
                        setActiveTab("General Settings");
                        setShowProfileMenu(false);
                    }} className="w-full text-left px-3 py-2.5 hover:bg-slate-50 text-slate-800 rounded-xl transition font-medium flex items-center gap-2 cursor-pointer" id="btn-patient-settings-link">
                              <span className="text-slate-500 font-bold text-sm">⚙️</span>
                              <span>General Settings</span>
                            </button>
                          </>)}

                        {/* Removed duplicate Patient Portal button */}

                        <button onClick={() => {
                    clearSession();
                    setIsSignedIn(false);
                    setShowProfileMenu(false);
                }} className="w-full text-left px-3 py-2.5 hover:bg-rose-50 text-rose-500 hover:text-rose-600 rounded-xl transition font-bold cursor-pointer" id="btn-sign-out">
                          Sign Out
                        </button>
                      </div>
                  </motion.div>)}
                  </AnimatePresence>
                </div>) : (<button onClick={() => {
                const loginCard = document.getElementById("elitecare-login-panel");
                if (loginCard) {
                    loginCard.scrollIntoView({ behavior: "smooth" });
                }
            }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1 shadow-sm shadow-green-600/10 cursor-pointer">
                  Please Sign In
                </button>)}

              {/* Mobile Menu Icon */}
              {isSignedIn && (<button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"} aria-expanded={isMobileMenuOpen} className={`${isSignedIn && userRole === "admin" ? "xl:hidden" : "lg:hidden"} size-10 rounded-full hover:bg-gray-50 flex items-center justify-center border border-gray-200 transition cursor-pointer`}>
                  {isMobileMenuOpen ? <X size={18}/> : <Menu size={18}/>}
                </button>)}
            </div>

          </div>

          {/* Mobile responsive navigation overlay */}
          <AnimatePresence>
          {isSignedIn && isMobileMenuOpen && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: prefersReducedMotion ? 0 : 0.18 }} className={`${isSignedIn && userRole === "admin" ? "xl:hidden" : "lg:hidden"} mt-3 border-t border-gray-100 pt-3 flex flex-col gap-1.5 overflow-hidden`}>
              {userRole === "admin" ? (<>
                {ADMIN_NAV_ITEMS.map((item) => (<button key={item.label} onClick={() => {
                    setAdminSection(item.section);
                    setActiveTab("Admin Dashboard");
                    setIsMobileMenuOpen(false);
                }} className={`w-full text-left px-4 py-2 rounded-xl text-xs font-semibold ${activeTab === "Admin Dashboard" && adminSection === item.section ? "text-green-600 bg-green-50" : "text-slate-600 hover:bg-gray-50"}`}>
                  {item.label}
                </button>))}
                {ADMIN_MORE_ITEMS.map((item) => (<button key={item} onClick={() => {
                    setActiveTab(item);
                    setIsMobileMenuOpen(false);
                }} className={`w-full text-left px-4 py-2 rounded-xl text-xs font-semibold ${activeTab === item ? "text-green-600 bg-green-50" : "text-slate-600 hover:bg-gray-50"}`}>
                  {item}
                </button>))}
              </>) : (menuItems.map((item) => (<button key={item} onClick={() => {
                    setActiveTab(item);
                    setIsMobileMenuOpen(false);
                }} className={`w-full text-left px-4 py-2 rounded-xl text-xs font-semibold ${activeTab === item ? "text-green-600 bg-green-50" : "text-slate-600 hover:bg-gray-50"}`}>
                  {item}
                </button>)))}
            </motion.div>)}
          </AnimatePresence>
        </header>

      {/* 2. CHOOSE CORRESPONDING VIEW - FULL WIDTH WITH SIDE PADDING */}
      <main className="py-4 flex-grow w-full px-4 md:px-8 lg:px-12 xl:px-16 space-y-12">
        {!isSignedIn ? (<LoginPage onLoginSuccess={(email, name, role) => {
                setIsSignedIn(true);
                setUserRole(role);
                setCurrentUserName(name);
                setCurrentUserEmail(email);
                if (role === "admin") {
                    setActiveTab("Admin Dashboard");
                }
                else {
                    setActiveTab("Home");
                }
            }} EliteCareLogo={EliteCareLogo}/>) : (
            /* A render-time throw in any view would otherwise blank the whole
               app. The boundary changes nothing when nothing throws. */
            <ErrorBoundary key={activeTab}>
            {/* One keyed motion.div per activeTab: wraps (does not restructure)
               the existing conditional blocks so switching views cross-fades. */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeTab}
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 0 }}
                transition={prefersReducedMotion
                  ? { duration: 0.12 }
                  : { duration: 0.25, ease: "easeOut", exit: { duration: 0.12 } }}
              >
            {/* VIEW A: LANDING PAGE HOME */}
            {activeTab === "Home" && (<div className="space-y-24">

              {/* A1. HERO SECTION */}
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-green-100/85 p-6 md:p-10 rounded-3xl border border-green-200/85 shadow-sm">
                
                {/* Hero Words Column with direct layout container */}
                <div className="lg:col-span-6 space-y-6">
                  <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 rounded-full px-4 py-1.5 border border-emerald-100">
                    <span className="size-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="text-[10px] font-extrabold tracking-wide uppercase">Smart Clinical Care Network</span>
                  </div>

                  <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
                    Your Health, <br />
                    <span className="text-[#16A34A] font-display">Our Priority</span>
                  </h1>

                  <p className="text-sm md:text-base text-gray-500 leading-relaxed font-sans max-w-md">
                    Advanced care for you and your family.
                  </p>

                  {/* Bullet perks in vertical list stack */}
                  <div className="space-y-2.5 max-w-xs">
                    {[
                    "30 Min Consultation",
                    "Personalised Care",
                    "Smart Health Tracking",
                    "Secure & Private",
                ].map((perk, i) => (<div key={i} className="flex items-center gap-2.5 text-xs font-semibold text-slate-800">
                        <CheckCircle2 className="text-[#16A34A] shrink-0" size={16}/>
                        <span>{perk}</span>
                      </div>))}
                  </div>

                  {/* Hero CTA buttons */}
                  <div className="flex flex-wrap gap-4 pt-2">
                    <button onClick={() => setActiveTab("Find the Doctor")} className="bg-[#16A34A] hover:bg-[#15803d] text-white font-bold rounded-lg px-6 py-3.5 text-xs transition duration-150 cursor-pointer shadow-md shadow-green-600/10">
                      Book Appointment
                    </button>
                    <button onClick={() => setActiveTab("Medicine Scanner")} className="border border-[#16A34A] hover:bg-green-50/20 text-[#16A34A] font-bold rounded-lg px-6 py-3.5 text-xs transition duration-150 cursor-pointer">
                      AI Symptom Checker
                    </button>
                  </div>
                </div>

                {/* Hero Illustration Column */}
                <div className="lg:col-span-6 relative flex justify-center">
                  <div className="absolute inset-0 bg-gradient-to-tr from-green-50 to-transparent rounded-3xl -rotate-2 scale-95 blur-xs"></div>
                  {/* Generated Happy family image to match the mockup */}
                  <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-150 p-2 shadow-xl hover:scale-[1.01] transition-transform duration-300">
                    <img src="/src/assets/images/hero_family_banner_1781504221395.jpg" alt="Happy medical family" className="w-full h-80 md:h-96 object-cover rounded-xl" onError={(e) => {
                    e.currentTarget.src =
                        "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600";
                }}/>
                  </div>
                </div>

              </section>

              {/* PATIENT DIGITAL PROFILE SECTION */}
              <section className="bg-white border border-slate-150 p-6 md:p-8 rounded-3xl shadow-sm space-y-6 relative overflow-hidden text-left" id="patient-dossier-section">
                
                {/* Visual Accent */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-500 via-emerald-600 to-green-600"></div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                      <CheckCircle2 size={11}/>
                      <span>Patient Health Registry</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                      Personal Profile & Illness History
                    </h2>
                    <p className="text-xs text-gray-400">
                      Keep your active symptoms, medical diagnoses, and contact credentials synchronized for live clinical triage.
                    </p>
                  </div>

                  {!isProfileFormOpen && (<button type="button" onClick={startEditingProfile} className="text-xs font-extrabold text-white bg-slate-950 hover:bg-slate-800 rounded-xl px-5 py-3 transition shadow-md cursor-pointer shrink-0">
                      ✏️ Edit Patient Profile & Conditions
                    </button>)}
                </div>

                {/* Case 1: Form is open (Editing mode as requested by user) */}
                {isProfileFormOpen ? (<form onSubmit={savePatientProfile} className="space-y-6 bg-slate-50 p-5 md:p-7 rounded-2xl border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-300">
                    
                    {isProfileSavedSuccess ? (<div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                        <div className="size-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 animate-bounce">
                          <CheckCircle2 size={32}/>
                        </div>
                        <h4 className="text-sm font-extrabold text-slate-900">Patient Registry Updated Successfully!</h4>
                        <p className="text-xs text-slate-400">Securing variables & synchronizing clinical directories...</p>
                      </div>) : (<div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          
                          {/* Column 1: Contact Coordinates */}
                          <div className="space-y-4">
                            <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-gray-200 pb-1.5">
                              1. Personal Coordinates
                            </h4>
                            
                            <div className="space-y-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-700 block">Full Patient Name</label>
                                <input type="text" required value={editFullName} onChange={(e) => setEditFullName(e.target.value)} className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. John Doe"/>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-700 block">Email Address</label>
                                <input type="email" required value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. john@example.com"/>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-700 block">Phone Number</label>
                                <input type="text" required value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. +1 (555) 019-2834"/>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-700 block">Blood Group Type</label>
                                <select value={editBloodGroup} onChange={(e) => setEditBloodGroup(e.target.value)} className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (<option key={bg} value={bg}>{bg}</option>))}
                                </select>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-700 block">Residential Address</label>
                                <input type="text" required value={editAddress} onChange={(e) => setEditAddress(e.target.value)} className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. 123 Wellness Way, New York, NY"/>
                              </div>
                            </div>
                          </div>

                          {/* Column 2: Previous Diseases / Illness Matrix */}
                          <div className="space-y-4">
                            <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-gray-200 pb-1.5">
                              2. Active Medical Illnesses
                            </h4>
                            
                            <div className="space-y-3 pt-1">
                              <label className="text-[10px] font-bold text-gray-400 block mb-2">Check any historic or current ailments:</label>
                              
                              <label className="flex items-center gap-2.5 text-xs text-slate-800 font-medium cursor-pointer py-1 hover:bg-white px-2 rounded-lg transition">
                                <input type="checkbox" checked={editHasDiabetes} onChange={(e) => setEditHasDiabetes(e.target.checked)} className="size-4 rounded text-green-600 focus:ring-green-500 border-gray-300"/>
                                <span>Sugar / Diabetes (HBA1c check)</span>
                              </label>

                              <label className="flex items-center gap-2.5 text-xs text-slate-800 font-medium cursor-pointer py-1 hover:bg-white px-2 rounded-lg transition">
                                <input type="checkbox" checked={editHasHypertension} onChange={(e) => setEditHasHypertension(e.target.checked)} className="size-4 rounded text-green-600 focus:ring-green-500 border-gray-300"/>
                                <span>BP / High Blood Pressure</span>
                              </label>

                              <label className="flex items-center gap-2.5 text-xs text-slate-800 font-medium cursor-pointer py-1 hover:bg-white px-2 rounded-lg transition">
                                <input type="checkbox" checked={editHasAsthma} onChange={(e) => setEditHasAsthma(e.target.checked)} className="size-4 rounded text-green-600 focus:ring-green-500 border-gray-300"/>
                                <span>Asthma / Respiratory Issues</span>
                              </label>

                              <label className="flex items-center gap-2.5 text-xs text-slate-800 font-medium cursor-pointer py-1 hover:bg-white px-2 rounded-lg transition">
                                <input type="checkbox" checked={editHasThyroid} onChange={(e) => setEditHasThyroid(e.target.checked)} className="size-4 rounded text-green-600 focus:ring-green-500 border-gray-300"/>
                                <span>Thyroid Dysfunction</span>
                              </label>

                              <label className="flex items-center gap-2.5 text-xs text-slate-800 font-medium cursor-pointer py-1 hover:bg-white px-2 rounded-lg transition">
                                <input type="checkbox" checked={editHasHeartIssue} onChange={(e) => setEditHasHeartIssue(e.target.checked)} className="size-4 rounded text-green-600 focus:ring-green-500 border-gray-300"/>
                                <span>Chronic Coronary / Heart Issues</span>
                              </label>
                            </div>
                          </div>

                          {/* Column 3: Emergency contact details and notes */}
                          <div className="space-y-4">
                            <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-gray-200 pb-1.5">
                              3. Emergency Contacts & Notes
                            </h4>
                            
                            <div className="space-y-4">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-700 block">Emergency Contact Name</label>
                                <input type="text" required value={editEmergencyName} onChange={(e) => setEditEmergencyName(e.target.value)} className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. Jane Doe"/>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-700 block">Emergency Contact Phone</label>
                                <input type="text" required value={editEmergencyPhone} onChange={(e) => setEditEmergencyPhone(e.target.value)} className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. +1 (555) 019-5867"/>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-700 block">Other Diseases / Diagnostic Notes</label>
                                <textarea value={editOtherConditions} onChange={(e) => setEditOtherConditions(e.target.value)} rows={2} className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-sans resize-none" placeholder="Enter any other illnesses, prescription notes, or surgical histories here..."/>
                              </div>
                            </div>
                          </div>

                        </div>

                        {/* Form Submit Row */}
                        <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                          <button type="button" onClick={() => setIsProfileFormOpen(false)} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 font-bold rounded-lg text-xs transition cursor-pointer">
                            Cancel Changes
                          </button>
                          <button type="submit" className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-extrabold rounded-lg text-xs transition shadow-md cursor-pointer">
                            Save Profile & Update Registry
                          </button>
                        </div>
                      </div>)}
                  </form>) : (
                /* Case 2: Form is collapsed (Showing the summarized Patient dossier cards) */
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
                    
                    {/* Patient Card Avatar Column */}
                    <div className="sm:col-span-1 bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-2">
                      <div className="size-16 rounded-full bg-green-100 text-green-700 font-black text-lg flex items-center justify-center border-2 border-white shadow-sm">
                        {patientProfile.fullName.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900">{patientProfile.fullName}</h4>
                        <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold rounded px-1.5 py-0.5 inline-block">
                          Primary Member
                        </span>
                      </div>
                    </div>

                    {/* Patient Contact Details */}
                    <div className="sm:col-span-1.5 space-y-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block border-b border-gray-200 pb-1">
                        Coordinates Contact
                      </span>
                      <div className="space-y-1.5 text-xs text-slate-800">
                        <p className="flex items-center gap-1.5"><span className="text-gray-400 font-medium">Email:</span> {patientProfile.email}</p>
                        <p className="flex items-center gap-1.5"><span className="text-gray-400 font-medium">Phone:</span> {patientProfile.phone}</p>
                        <p className="flex items-center gap-1.5"><span className="text-gray-400 font-medium font-mono">Blood:</span> <strong className="text-red-600 text-xs">{patientProfile.bloodGroup}</strong></p>
                        <p className="flex items-center gap-1.5"><span className="text-gray-400 font-medium">Address:</span> {patientProfile.address}</p>
                      </div>
                    </div>

                    {/* Patient illness state */}
                    <div className="sm:col-span-1.5 space-y-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block border-b border-gray-200 pb-1">
                        Active Diagnosed Illnesses
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {patientProfile.hasDiabetes && (<span className="text-[10px] bg-red-50 text-red-700 border border-red-100 font-extrabold px-2 py-0.5 rounded-lg">
                            Sugar / Diabetes
                          </span>)}
                        {patientProfile.hasHypertension && (<span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-100 font-extrabold px-2 py-0.5 rounded-lg">
                            BP / Hypertension
                          </span>)}
                        {patientProfile.hasAsthma && (<span className="text-[10px] bg-cyan-50 text-cyan-700 border border-cyan-100 font-extrabold px-2 py-0.5 rounded-lg">
                            Asthma
                          </span>)}
                        {patientProfile.hasThyroid && (<span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-100 font-extrabold px-2 py-0.5 rounded-lg">
                            Thyroid
                          </span>)}
                        {patientProfile.hasHeartIssue && (<span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-100 font-extrabold px-2 py-0.5 rounded-lg">
                            Heart Issue
                          </span>)}
                        {!patientProfile.hasDiabetes && !patientProfile.hasHypertension && !patientProfile.hasAsthma && !patientProfile.hasThyroid && !patientProfile.hasHeartIssue && (<span className="text-[10px] bg-green-50 text-green-700 border border-green-100 font-extrabold px-2 py-0.5 rounded-lg">
                            No Active Diseases / All Healthy
                          </span>)}
                      </div>
                      <p className="text-[10.5px] text-gray-400 leading-snug truncate italic pt-1 text-left">
                        "{patientProfile.otherConditions}"
                      </p>
                    </div>

                    {/* Patient Emergency Core */}
                    <div className="sm:col-span-1 space-y-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block border-b border-gray-200 pb-1">
                        Emergency Contact
                      </span>
                      <div className="space-y-1 text-xs text-slate-800">
                        <p className="font-extrabold">{patientProfile.emergencyContactName}</p>
                        <p className="text-gray-400">{patientProfile.emergencyContactPhone}</p>
                      </div>
                    </div>

                  </div>)}

              </section>

              {/* A2. SMART SERVICES SECTOR - INTERACTIVE 3D FLIP CARDS */}
              <SmartServices onLaunch={handleServiceLaunch} />

              {/* A3. TOP DOCTORS HORIZONTAL SLIDER ROWS */}
              <section className="space-y-8 bg-slate-50/50 p-6 md:p-8 rounded-3xl border border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1 text-left">
                    <span className="text-[10px] bg-green-50 text-green-700 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                      Highly Rated Experts
                    </span>
                    <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
                      Top Doctors For You
                    </h2>
                    <p className="text-xs text-gray-500">
                      Double-boarded consulting staff currently accepting new client intake schedules.
                    </p>
                  </div>
                  <button onClick={() => setActiveTab("Find the Doctor")} className="text-xs font-bold text-green-700 hover:text-green-800 bg-white border border-gray-200 shadow-xs hover:shadow rounded-lg px-4 py-2 transition flex items-center gap-1.5 cursor-pointer">
                    <span>View All Doctors</span>
                    <ChevronRight size={14}/>
                  </button>
                </div>

                {/* Horizontal Doctor Cards Container */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5">
                  {doctorsList.slice(0, 6).map((doc) => (<div key={doc.id} onClick={() => handleBookDirect(doc)} className="bg-white border border-gray-150 rounded-2xl shadow-xs overflow-hidden hover:shadow-lg transition-transform hover:-translate-y-0.5 duration-200 cursor-pointer flex flex-col justify-between">
                      <div>
                        {/* Doctor Avatar */}
                        <div className="relative h-40 bg-gray-100">
                          <img src={doc.image} alt={doc.name} className="w-full h-full object-cover"/>
                          <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-md px-1.5 py-0.5 shadow-xs flex items-center gap-0.5 text-[10px] font-bold">
                            <Star className="text-amber-400 fill-amber-400" size={10}/>
                            <span>{doc.rating}</span>
                          </span>
                        </div>

                        <div className="p-3 text-left">
                          <span className="text-[8px] bg-green-50 text-green-700 font-bold px-1.5 py-0.5 rounded">
                            {doc.specialization}
                          </span>
                          <h4 className="font-extrabold text-slate-900 mt-1.5 text-xs tracking-tight line-clamp-1">
                            {doc.name}
                          </h4>
                          <span className="text-[10px] text-gray-400 block">{doc.experience}</span>
                        </div>
                      </div>

                      <div className="p-3 pt-0 border-t border-gray-50">
                        <button onClick={(e) => {
                        e.stopPropagation();
                        handleBookDirect(doc);
                    }} className="w-full bg-slate-950 text-white font-semibold text-[10px] py-1.5 rounded-lg hover:bg-slate-850 transition cursor-pointer">
                          Book Slot
                        </button>
                      </div>
                    </div>))}
                </div>
              </section>

              {/* A4. BENEFITS LABELS WITH DYNAMIC BADGES */}
              <section className="space-y-8">
                <div className="text-center space-y-1">
                  <span className="text-[10px] bg-green-50 text-green-700 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                    Our Core Strengths
                  </span>
                  <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
                    Our Elite Benefits Guarantee
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {BENEFITS.map((b) => (<div key={b.id} className="p-5 border border-gray-100 bg-white rounded-2xl shadow-xs flex items-start gap-4 hover:shadow-md transition-shadow">
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                        {renderBenefitIcon(b.iconName)}
                      </div>
                      <div className="text-left space-y-0.5">
                        <h4 className="font-extrabold text-slate-800 text-xs leading-snug">{b.title}</h4>
                        <p className="text-[11px] text-gray-400 leading-normal font-sans">{b.description}</p>
                      </div>
                    </div>))}
                </div>
              </section>

              {/* A5. STATISTICS DISPLAY CARD */}
              <section className="bg-green-600 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5">
                  <Heart size={200}/>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center relative z-10">
                  {STATISTICS.map((stat, idx) => (<div key={idx} className="space-y-1.5 flex flex-col items-center">
                      <div className="size-12 rounded-full bg-white/20 flex items-center justify-center text-white mb-2 shadow-sm">
                        {renderStatisticsIcon(stat.icon)}
                      </div>
                      <div className="text-3xl md:text-4xl font-extrabold tracking-tight">{stat.value}</div>
                      <div className="text-[11px] uppercase tracking-widest text-green-150 font-bold">
                        {stat.subtitle}
                      </div>
                    </div>))}
                </div>
              </section>

            </div>)}

          {/* VIEW B: COMPREHENSIVE MEDICAL DASHBOARD (PORTAL + VITAL CHARTS) */}
          {activeTab === "Admin Dashboard" && userRole === "admin" && (<AdminDashboard doctors={doctorsList} setDoctors={setDoctorsList} appointments={appointments} setAppointments={setAppointments} section={adminSection}/>)}

          {activeTab === "Doctor Dashboard" && (<DoctorDashboard doctors={doctorsList} setDoctors={setDoctorsList} appointments={appointments} setAppointments={setAppointments}/>)}

          {activeTab === "Dashboard" || activeTab === "Patient Dashboard" ? (<PatientDashboard appointments={appointments} records={records} onCancelAppointment={handleCancelAppointment} onNavigateToSymptom={() => setActiveTab("Medicine Scanner")} onNavigateToDoctors={() => setActiveTab("Find the Doctor")} onAddXP={addXP} onNavigateToDoctorDashboard={() => setActiveTab("Doctor Dashboard")} onNavigateToHealthHub={() => setActiveTab("Health Hub")}/>) : null}

          {/* VIEW C: SEARCH, FILTER, AND SCHEDULE APPOINTMENTS */}
          {activeTab === "Find the Doctor" && (<DoctorFinder onBookAppointment={handleBookAppointment} preSelectedDoctor={preSelectedDoctor} clearPreSelectedDoctor={handleClearPreselect} onNavigateToDashboard={() => setActiveTab("Patient Dashboard")} doctors={doctorsList}/>)}

          {/* VIEW D: RADIUS MAPS & TRIP LOG DIRECTIONS GPS */}
          {activeTab === "Nearby Hospitals" && <NearbyHospitals />}

          {/* VIEW D_VIDEO: IMMERSIVE TELEHEALTH CLINIC VIDEO ROOM */}
          {activeTab === "Video Consultation" && (<VideoConsultation appointments={appointments} patientName={patientProfile.fullName} onNavigateToAppointments={() => setActiveTab("Patient Dashboard")}/>)}

          {/* VIEW D_LABS: NABL ACCREDITED CLINICAL LAB DIRECTORY */}
          {activeTab === "Lab Tests" && (<LabTests patientName={patientProfile.fullName}/>)}

          {/* VIEW E: SCANNER PACKS (WITH EMBEDDED AI CHANGER SYMPTOMER CHATS) */}
          {activeTab === "Medicine Scanner" && (<div className="space-y-16">
              <MedicineScanner />
              <div className="border-t border-gray-150/50 pt-16">
                <SymptomChecker onBookDirect={handleBookDirect} onNavigateToDoctors={() => setActiveTab("Find the Doctor")}/>
              </div>
            </div>)}

          {/* VIEW WORKOUT_DIET: WORKOUT & NUTRITION GAME HUB */}
          {activeTab === "Workout & Diet" && (<WorkoutAndDiet onAddXP={addXP} coins={wellnessCoins}/>)}

          {/* VIEW EMOTION_MIND: CALMING STRESS HARMONIZER & BREATH RING */}
          {activeTab === "Emotion & Mind" && (<EmotionMind onAddXP={addXP} patientName={patientProfile.fullName}/>)}

          {/* VIEW SURGERY_ASSIST: SURGICAL READINESS AUDIT CHECKLISTS */}
          {activeTab === "Surgery Assist" && (<SurgeryAssist onAddXP={addXP} patientName={patientProfile.fullName}/>)}

           {/* VIEW TENMIN_CONSULT: EMERGENCY DIRECT CHAT MATCH PORTAL */}
          {activeTab === "10-Min Consult" && (<TenMinConsult onAddXP={addXP} patientName={patientProfile.fullName}/>)}

          {/* VIEW: EMERGENCY DISPATCH AND RESCUE PROTOCOLS */}
          {activeTab === "Emergency Alert" && (<EmergencyAlert onAddXP={addXP} patientProfile={patientProfile}/>)}

          {/* VIEW: ENCYCLOPEDIA HEALTH PROBLEM PORTALS */}
          {activeTab === "Health Problems" && (<HealthProblems onAddXP={addXP} patientProfile={patientProfile}/>)}

          {/* VIEW: QUICK DIAGNOSTIC VITAL CHECKIN SYMPTOM LOG */}
          {activeTab === "Quick Symptom Log" && (<QuickSymptomLog onAddXP={addXP} onNavigateToDoctors={() => setActiveTab("Find the Doctor")}/>)}

          {/* VIEW: WELLNESS REWARDS PORTAL */}
          {activeTab === "Wellness Rewards" && (<WellnessRewards coins={wellnessCoins} streak={streakCount} xp={userXP} level={userLevel} onAddCoins={(amt) => setWellnessCoins((prev) => prev + amt)} onDeductCoins={(amt) => {
                    if (wellnessCoins >= amt) {
                        setWellnessCoins((prev) => prev - amt);
                        return true;
                    }
                    return false;
                }} onAddXP={addXP}/>)}

          {/* VIEW: AI CONTEXTUAL CLINICAL VOICE ASSISTANCE */}
          {activeTab === "Voice Assistance" && (<VoiceAssistance onNavigate={setActiveTab} onAddXP={(xpAmt, coinAmt = 0) => {
                    addXP(xpAmt);
                    if (coinAmt > 0) {
                        setWellnessCoins((prev) => prev + coinAmt);
                    }
                }}/>)}

          {/* VIEW: GENERAL SETTINGS */}
          {activeTab === "General Settings" && (<PatientSettings onLogout={() => { clearSession(); setIsSignedIn(false); }}/>)}

          {/* VIEW: HEALTH HUB — grouped entry point for the new patient sections.
              Only renders while the flag in src/config/features.js is true. */}
          {activeTab === "Health Hub" && FEATURES.healthHub && (<HealthHub onNavigate={setActiveTab} onBack={() => setActiveTab("Patient Dashboard")}/>)}

          {/* Health Hub sections. Each one is behind its own flag, so flipping a
              flag off in src/config/features.js removes the screen completely. */}
          {activeTab === "Health Translator" && FEATURES.healthTranslator && (
            <HealthTranslator onBack={() => setActiveTab("Health Hub")} />
          )}

          {activeTab === "Lab Report Explainer" && FEATURES.labReportExplainer && (
            <LabReportExplainer onBack={() => setActiveTab("Health Hub")} />
          )}
          {activeTab === "Medicine Reminders" && FEATURES.medicineReminders && (
            <MedicineReminders onBack={() => setActiveTab("Health Hub")} />
          )}
          {activeTab === "Emergency Health Card" && FEATURES.emergencyCard && (
            <EmergencyCard onBack={() => setActiveTab("Health Hub")} />
          )}
          {activeTab === "AI Consent" && FEATURES.preConsultSummary && (
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 px-4 pt-6">
                <button
                  type="button"
                  onClick={() => setActiveTab("Patient Dashboard")}
                  className="text-[10px] uppercase font-black tracking-wider text-slate-500 hover:text-emerald-700 bg-white border border-gray-200 px-3 py-2 rounded-xl transition cursor-pointer"
                >
                  ← Back
                </button>
              </div>
              <AiConsentSetting />
            </div>
          )}

          {/* Navigational Control Footer - Redirect to Last Page Option */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-16 pt-8 border-t border-slate-200 bg-white p-5 rounded-3xl shadow-xs border border-slate-100 text-left">
            <div className="space-y-1">
              <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wide block">Portal Navigator</span>
              <p className="text-[11px] text-slate-500 font-medium font-sans">Instantly redirect to the final page of the medical application.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
              <button type="button" onClick={() => {
                setActiveTab(ALL_PAGES[ALL_PAGES.length - 1]);
            }} className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 hover:shadow-md text-white font-black rounded-2xl text-xs transition active:scale-95 flex items-center gap-2 cursor-pointer select-none shadow-sm shadow-green-600/15" id="btn-redirect-last-page">
                <span>🚀 Redirect to Last Page</span>
                <span className="font-semibold text-emerald-100 font-mono">({ALL_PAGES[ALL_PAGES.length - 1]})</span>
                <span>→</span>
              </button>
            </div>
          </div>
              </motion.div>
            </AnimatePresence>
            </ErrorBoundary>
          )}

      </main>

        {/* 3. COLUMNS SATELLITE FOOTER - FULL WIDTH */}
        <footer className="border-t border-emerald-900 bg-[#0B2E1E] text-emerald-100 py-12 px-4 md:px-8 lg:px-12 xl:px-16 space-y-8 mt-24 w-full">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
            
            {/* Col 1 - Branding logo & description */}
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 cursor-pointer select-none" onClick={() => setActiveTab("Home")}>
                <EliteCareLogo size={32}/>
                <span className="text-xl font-black tracking-tight flex items-center">
                  <span className="text-[#38BDF8]">Elite</span>
                  <span className="text-[#4ADE80]">Care</span>
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/80 leading-relaxed font-sans max-w-xs">
                EliteCare is your trusted healthcare companion, bridging general practice clinics, online diagnostic telemetry, and certified doctors together for a healthier tomorrow.
              </p>
              
              {/* Social Grid */}
              <div className="flex gap-2 pt-2">
                {[
            { icon: <Facebook size={14}/>, link: "https://facebook.com/elitecare" },
            { icon: <Twitter size={14}/>, link: "https://twitter.com/elitecare" },
            { icon: <Instagram size={14}/>, link: "https://instagram.com/elitecare" },
            { icon: <Linkedin size={14}/>, link: "https://linkedin.com/company/elitecare" },
            { icon: <Youtube size={14}/>, link: "https://youtube.com/elitecare" },
        ].map((soc, idx) => (<a key={idx} href={soc.link} target="_blank" rel="noreferrer" className="size-8 rounded-full border border-emerald-800 bg-emerald-950 text-emerald-300 hover:text-white hover:border-emerald-400 flex items-center justify-center transition duration-150">
                    {soc.icon}
                  </a>))}
              </div>
            </div>

            {/* Col 2 - Quick Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Information</h4>
              <ul className="space-y-2 text-xs">
                {menuItems.map((item) => (<li key={item}>
                    <button onClick={() => setActiveTab(item)} className="text-emerald-200/80 hover:text-white transition cursor-pointer">
                      {item}
                    </button>
                  </li>))}
              </ul>
            </div>

            {/* Col 3 - Services links list */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Our Services</h4>
              <ul className="space-y-2 text-xs text-emerald-200/80 font-sans font-medium">
                {SERVICES.slice(0, 6).map((serv) => (<li key={serv.id}>
                    <button onClick={() => {
                if (serv.id === "video-consult") {
                    setActiveTab("Video Consultation");
                }
                else if (serv.id === "lab-tests") {
                    setActiveTab("Lab Tests");
                }
                else if (serv.id === "symptom-checker" || serv.id === "voice-assist") {
                    setActiveTab("Quick Symptom Log");
                }
                else if (serv.id === "visit-booking") {
                    setActiveTab("Find the Doctor");
                }
                else if (serv.id === "health-problem") {
                    setActiveTab("Health Problems");
                }
                else if (serv.id === "emergency-alert") {
                    setActiveTab("Emergency Alert");
                }
                else if (serv.id === "workout-plan" || serv.id === "diet-plan") {
                    setActiveTab("Workout & Diet");
                }
                else if (serv.id === "emotion-health") {
                    setActiveTab("Emotion & Mind");
                }
                else if (serv.id === "surgery-assist") {
                    setActiveTab("Surgery Assist");
                }
                else if (serv.id === "10-min-service") {
                    setActiveTab("10-Min Consult");
                }
                else {
                    setActiveTab("Patient Dashboard");
                }
            }} className="hover:text-white text-left transition cursor-pointer">
                      {serv.title}
                    </button>
                  </li>))}
              </ul>
            </div>

            {/* Col 4 - Contact Info */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Contact Us</h4>
              <ul className="space-y-3 text-xs text-emerald-200/80 font-sans font-medium">
                <li className="flex items-start gap-2.5">
                  <MapPin size={15} className="text-emerald-450 shrink-0 mt-0.5"/>
                  <span>123 Health Street, Suite 500, New Delhi, India - 110001</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone size={15} className="text-emerald-450 shrink-0"/>
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail size={15} className="text-emerald-450 shrink-0"/>
                  <span>support@elitecare.com</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Clock size={15} className="text-emerald-450 shrink-0"/>
                  <span>Mon - Sun: 24/7 Support</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Copyright Section */}
          <div className="border-t border-emerald-900/60 pt-6 text-center text-[10px] text-emerald-200/50 font-medium tracking-wide">
            © 2026 EliteCare. All rights reserved. Made under clinical supervision for direct wellness checkups.
          </div>
        </footer>

        {/* Global Floating AI Chatbot Hub with Voice dictation and WhatsApp sharing */}
        {isSignedIn && <ChatbotWidget />}

        {/* Beautiful Floating Original WhatsApp circular launcher just like AI Chatbot on the left side */}
        {isSignedIn && (<a href="https://wa.me/919876543210?text=Hi%20EliteCare%2C%20I%20am%20using%2520the%20Patient%2520Portal%20and%2520need%20quick%2520clinical%20assistance." target="_blank" rel="noopener noreferrer" title="Chat with EliteCare on WhatsApp" className="fixed bottom-6 left-6 z-50 size-14 bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center rounded-full shadow-2xl transition-transform hover:scale-105 border-2 border-white/60 cursor-pointer animate-none">
            {/* Original high-fidelity premium WhatsApp icon brand vector */}
            <svg className="size-7 fill-current text-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 .003c-6.627 0-12 5.373-12 12 0 2.159.57 4.258 1.648 6.102L.033 24l5.98-1.568A11.91 11.91 0 0 0 12 24.003c6.627 0 12-5.373 12-12s-5.373-12-12-12zm6.737 15.65c-.261.737-1.303 1.353-1.895 1.455-.544.095-1.25.166-3.664-.833-3.08-1.275-5.074-4.417-5.228-4.622-.153-.205-1.25-1.666-1.25-3.187 0-1.52.793-2.269 1.077-2.571.284-.301.62-.378.826-.378.206 0 .412.007.593.014.192.007.447-.074.701.536.262.628.895 2.185.97 2.34.076.155.127.336.024.536-.103.2-.232.329-.364.482-.132.152-.279.34-.399.458-.135.132-.276.275-.12.544.156.27.69 1.135 1.479 1.834.981.874 1.815 1.144 2.073 1.255.258.111.411.087.564-.093.153-.18.66-.767.837-1.026.177-.258.354-.216.597-.126.244.09 1.554.733 1.82 1.045.267.311.267.466.182.74z"/>
            </svg>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border border-white text-[9px] font-black items-center justify-center text-white">✓</span>
            </span>
          </a>)}

    </div>);
}
