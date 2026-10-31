import React, { useState } from "react";
import { ChevronDown, Calendar, Video, Wallet, Star, CheckCircle2, FileText, Clock, MapPin, Stethoscope, TrendingUp, User, MoreHorizontal, Plus, X } from "lucide-react";
export default function DoctorDetailsPanel({ doctors, setDoctors, appointments, selectedDoctorId, onSelectDoctor, showToast }) {
    // Find currently active doctor or default to DOC-000126 (Dr. Neha Kapoor)
    const defaultDocId = doctors.find(d => d.id.includes("000126") || d.name.includes("Neha"))?.id || (doctors[0]?.id || "DOC-000126");
    const [activeDocId, setActiveDocId] = useState(selectedDoctorId || defaultDocId);
    const [activePeriod, setActivePeriod] = useState("22 Apr 2026 - 22 May 2026");
    const [activeDetailsTab, setActiveDetailsTab] = useState("Overview");
    // Onboard doctor modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [formDocName, setFormDocName] = useState("");
    const [formDocSpecialization, setFormDocSpecialization] = useState("Cardiologist");
    const [formDocExperience, setFormDocExperience] = useState("10 Years");
    const [formDocLocation, setFormDocLocation] = useState("Delhi, India");
    const [formDocBio, setFormDocBio] = useState("");
    const [formDocEmail, setFormDocEmail] = useState("");
    const [formDocPhone, setFormDocPhone] = useState("");
    const [formDocLicense, setFormDocLicense] = useState("");
    const [formDocGender, setFormDocGender] = useState("Female");
    const [formDocDob, setFormDocDob] = useState("1990-05-15");
    const [formDocLanguages, setFormDocLanguages] = useState("English, Hindi");
    // View, Edit, and Delete doctor modal states
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    // Edit doctor forms state pre-sets
    const [editDocName, setEditDocName] = useState("");
    const [editDocSpecialization, setEditDocSpecialization] = useState("Cardiologist");
    const [editDocExperience, setEditDocExperience] = useState("");
    const [editDocLocation, setEditDocLocation] = useState("");
    const [editDocBio, setEditDocBio] = useState("");
    const [editDocEmail, setEditDocEmail] = useState("");
    const [editDocPhone, setEditDocPhone] = useState("");
    const [editDocLicense, setEditDocLicense] = useState("");
    const [editDocGender, setEditDocGender] = useState("");
    const [editDocDob, setEditDocDob] = useState("");
    const [editDocLanguages, setEditDocLanguages] = useState("");
    const openEditModal = () => {
        setEditDocName(activeDoc.name || "");
        setEditDocSpecialization(activeDoc.specialization || "Cardiologist");
        setEditDocExperience(activeDoc.experience || "10 Years");
        setEditDocLocation(activeDoc.location || "Delhi, India");
        setEditDocBio(activeDoc.bio || "");
        setEditDocEmail(activeDoc.email || `${activeDoc.name.toLowerCase().replace(/\s+/g, '')}@elitecare.com`);
        setEditDocPhone(activeDoc.phone || "+91 88776 55443");
        setEditDocLicense(activeDoc.license || "DMC/2016/67890");
        setEditDocGender(activeDoc.gender || "Female");
        setEditDocDob(activeDoc.dob || "1988-04-12");
        setEditDocLanguages(activeDoc.languages || "English, Hindi");
        setIsEditModalOpen(true);
    };
    // Dynamic selector
    const activeDoc = doctors.find(d => d.id === activeDocId) || {
        id: "DOC-000126",
        name: "Dr. Neha Kapoor",
        specialization: "Dermatologist",
        experience: "8 Years",
        location: "Delhi, India",
        availability: ["10:00 AM - 06:00 PM"],
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=150",
        bio: "Dr. Neha Kapoor is an experienced Dermatologist with over 8 years of practice in treating a wide range of skin, hair, and nail conditions. She is dedicated to providing personalized care using the latest medical advancements.",
        email: "neha@elitecare.com",
        phone: "+91 88776 55443",
        license: "DMC/2016/67890",
        gender: "Female",
        dob: "12 Apr 1988",
        languages: "English, Hindi"
    };
    // Get dynamic metrics & lists based on doctors
    const docSpecificAppointments = appointments.filter(a => a.doctorName.toLowerCase().includes(activeDoc.name.toLowerCase()));
    // Hardcode/Calculate some metrics to precisely match the screenshot for Neha Kapoor
    const isNeha = activeDoc.id.includes("000126") || activeDoc.name.includes("Neha");
    const totalAppointments = isNeha ? 1245 : (docSpecificAppointments.length * 15 || 180);
    const totalConsultations = isNeha ? 1102 : (docSpecificAppointments.length * 12 || 155);
    const totalRevenue = isNeha ? "₹12,45,600" : `₹${(totalConsultations * 800).toLocaleString()}`;
    const averageRating = isNeha ? "4.8" : (activeDoc.rating || 4.7).toString();
    const handleDocChange = (id) => {
        setActiveDocId(id);
        if (onSelectDoctor)
            onSelectDoctor(id);
        showToast(`Loaded details profile for ${doctors.find(d => d.id === id)?.name || "selected professional"}`);
    };
    const handleOnboardSubmit = (e) => {
        e.preventDefault();
        if (!formDocName.trim()) {
            showToast("Please enter physician name!");
            return;
        }
        const newDocId = `DOC-${Math.floor(100000 + Math.random() * 900000)}`;
        const freshDoctor = {
            id: newDocId,
            name: formDocName,
            specialization: formDocSpecialization,
            experience: formDocExperience,
            location: formDocLocation,
            availability: ["10:00 AM - 05:00 PM"],
            rating: 4.9,
            image: formDocGender === "Female"
                ? "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=150"
                : "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150",
            bio: formDocBio || `Highly qualified ${formDocSpecialization} specialized in patient-centric care, diagnostics, and customized treatment planning.`,
            // Attach extra credentials to object
            email: formDocEmail || `${formDocName.toLowerCase().replace(/\s+/g, '')}@expertclinic.com`,
            phone: formDocPhone || "+91 99988 77766",
            license: formDocLicense || "NMC/2026/" + Math.floor(10000 + Math.random() * 90000),
            gender: formDocGender,
            dob: formDocDob,
            languages: formDocLanguages
        };
        if (setDoctors) {
            setDoctors((prev) => [freshDoctor, ...prev]);
        }
        setActiveDocId(newDocId);
        setIsAddModalOpen(false);
        showToast(`${formDocName} has been onboarded manually to clinical registry!`);
        // Reset forms
        setFormDocName("");
        setFormDocBio("");
        setFormDocEmail("");
        setFormDocPhone("");
        setFormDocLicense("");
    };
    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (!editDocName.trim()) {
            showToast("Please enter physician name!");
            return;
        }
        if (setDoctors) {
            setDoctors((prev) => prev.map((d) => {
                if (d.id === activeDoc.id) {
                    return {
                        ...d,
                        name: editDocName,
                        specialization: editDocSpecialization,
                        experience: editDocExperience,
                        location: editDocLocation,
                        bio: editDocBio,
                        email: editDocEmail,
                        phone: editDocPhone,
                        license: editDocLicense,
                        gender: editDocGender,
                        dob: editDocDob,
                        languages: editDocLanguages
                    };
                }
                return d;
            }));
        }
        setIsEditModalOpen(false);
        showToast(`Successfully updated credentials for ${editDocName}!`);
    };
    const handleDeleteSubmit = () => {
        if (doctors.length <= 1) {
            showToast("Operation cancelled: The registry requires at least one active physician.");
            setIsDeleteModalOpen(false);
            return;
        }
        const currentDocName = activeDoc.name;
        const currentDocId = activeDoc.id;
        // Filter out the deleted doctor
        if (setDoctors) {
            setDoctors((prev) => prev.filter((d) => d.id !== currentDocId));
        }
        // Auto-select another doctor
        const remainingDocs = doctors.filter((d) => d.id !== currentDocId);
        const nextDoc = remainingDocs[0];
        if (nextDoc) {
            setActiveDocId(nextDoc.id);
            if (onSelectDoctor)
                onSelectDoctor(nextDoc.id);
        }
        setIsDeleteModalOpen(false);
        showToast(`${currentDocName} has been permanently deleted from clinical registry.`);
    };
    return (<div className="space-y-6 w-full text-slate-800" id="doctor-details-workspace-view">
      
      {/* 1. SELECT DOCTOR QUICK TOGGLE BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.015)] flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <span className="p-2 bg-emerald-50 text-[#047857] rounded-xl animate-none">
            <Stethoscope size={18}/>
          </span>
          <div className="text-left">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black leading-none">Select Medical Professional</p>
            <p className="text-xs font-bold text-slate-800 mt-1">Medical Staff Registry Portal</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="relative min-w-[220px]">
            <select value={activeDocId} onChange={(e) => handleDocChange(e.target.value)} className="w-full text-xs pl-3.5 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#047857] transition appearance-none font-bold text-slate-700 cursor-pointer">
              {doctors.map(d => (<option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={13}/>
          </div>

          <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2.5 bg-[#047857] hover:bg-emerald-800 text-white rounded-xl flex items-center gap-2 text-xs font-bold transition shadow-sm cursor-pointer whitespace-nowrap">
            <Plus size={14} strokeWidth={3}/>
            <span>Onboard Doctor</span>
          </button>
        </div>
      </div>

      {/* 2. TOP SPLIT ROW: BIO & EMP-DETAILS CARD vs VERIFICATION CHECKLIST CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Grid: Bio & Employment Details (Spans 8 columns) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.015)] p-6 space-y-6 flex flex-col md:flex-row justify-between items-stretch gap-6">
          
          {/* Doctor Info Circle Card */}
          <div className="flex flex-col items-center justify-center text-center p-3 border-r border-dashed border-slate-100 md:w-1/3 shrink-0">
            <div className="relative">
              <img src={activeDoc.image || activeDoc.avatar || "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=150"} alt={activeDoc.name} className="size-28 rounded-full object-cover border-4 border-slate-50 shadow-md" referrerPolicy="no-referrer"/>
              <span className="absolute bottom-1 right-1 size-4 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
            
            <div className="mt-4 space-y-1.5">
              <div className="flex items-center gap-1.5 justify-center">
                <h2 className="text-base font-black text-slate-800 tracking-tight leading-tight">{activeDoc.name}</h2>
                <span className="bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded text-[9.5px] uppercase border border-blue-100">Doctor</span>
              </div>
              <p className="text-xs text-[#047857] font-bold">{activeDoc.specialization}</p>
              <p className="text-[10px] text-slate-400 font-mono">ID: {activeDoc.id}</p>
            </div>

            <div className="mt-5 space-y-2 text-left w-full max-w-[200px] text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <FileText size={13} className="text-slate-400 shrink-0"/>
                <span className="truncate">{activeDoc.email || `${activeDoc.name.toLowerCase().replace(/\s+/g, '')}@elitecare.com`}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={13} className="text-slate-400 shrink-0"/>
                <span>{activeDoc.phone || "+91 88776 55443"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={13} className="text-slate-400 shrink-0"/>
                <span>{activeDoc.location || "Delhi, India"}</span>
              </div>
            </div>

            <div className="mt-4 flex flex-col items-center gap-3 w-full">
              <span className="inline-flex px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full font-bold text-[10.5px]">
                Active
              </span>

              {/* Administrative Command Suite */}
              <div className="pt-3.5 border-t border-slate-100 w-full flex flex-col gap-2">
                <p className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold text-center">Manage Registry</p>
                <div className="grid grid-cols-3 gap-1.5 px-1.5">
                  <button onClick={() => setIsViewModalOpen(true)} className="flex flex-col items-center justify-center py-2 px-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 transition-all font-bold group cursor-pointer" title="View Bio Card">
                    <User size={14} className="text-slate-400 group-hover:text-slate-600 group-hover:scale-110 transition"/>
                    <span className="text-[10px] mt-1 font-black">View</span>
                  </button>
                  
                  <button onClick={openEditModal} className="flex flex-col items-center justify-center py-2 px-1.5 rounded-xl bg-[#eff6ff] hover:bg-blue-100 border border-blue-200 text-[#2563eb] hover:text-[#1d4ed8] transition-all font-bold group cursor-pointer" title="Edit Physician Profile">
                    <FileText size={14} className="text-[#3b82f6] group-hover:text-[#1d4ed8] group-hover:scale-110 transition"/>
                    <span className="text-[10px] mt-1 font-black">Edit</span>
                  </button>
                  
                  <button onClick={() => setIsDeleteModalOpen(true)} className="flex flex-col items-center justify-center py-2 px-1.5 rounded-xl bg-[#fef2f2] hover:bg-rose-100 border border-rose-200 text-[#e11d48] hover:text-[#b91c1c] transition-all font-bold group cursor-pointer" title="Deregister Profile">
                    <X size={14} className="text-[#f43f5e] group-hover:text-[#b91c1c] group-hover:scale-110 transition"/>
                    <span className="text-[10px] mt-1 font-black">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Details Tables Grid */}
          <div className="flex-1 flex flex-col justify-between">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-xs font-medium text-slate-600 text-left pt-2 pb-4">
              
              <div className="space-y-1 border-b border-slate-50 pb-2">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">User Type</p>
                <p className="font-bold text-slate-800">Doctor</p>
              </div>

              <div className="space-y-1 border-b border-slate-50 pb-2">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Joined Date</p>
                <p className="font-bold text-slate-800">21 May 2024, 11:20 AM</p>
              </div>

              <div className="space-y-1 border-b border-slate-50 pb-2">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Experience</p>
                <p className="font-bold text-slate-800">{activeDoc.experience || "8 Years"}</p>
              </div>

              <div className="space-y-1 border-b border-slate-50 pb-2">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Qualification</p>
                <p className="font-bold text-slate-800">MD - {activeDoc.specialization || "Dermatology"}</p>
              </div>

              <div className="space-y-1 border-b border-slate-50 pb-2">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Registration No.</p>
                <p className="font-mono font-bold text-slate-800">{activeDoc.license || "DMC/2016/67890"}</p>
              </div>

              <div className="space-y-1 border-b border-slate-50 pb-2">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Languages</p>
                <p className="font-bold text-slate-800">{activeDoc.languages || "English, Hindi"}</p>
              </div>

              <div className="space-y-1 pb-2">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Gender</p>
                <p className="font-bold text-slate-800">{activeDoc.gender || "Female"}</p>
              </div>

              <div className="space-y-1 pb-2">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Date of Birth</p>
                <p className="font-bold text-slate-800">{activeDoc.dob || "12 Apr 1988"}</p>
              </div>

            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between mt-auto">
              <div className="flex items-center gap-2">
                <div className="size-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <p className="text-[10.5px] font-bold text-slate-600">On duty and taking appointments</p>
              </div>
              <span className="text-[9.5px] font-bold text-[#047857]">VERIFIED PROFILE</span>
            </div>
          </div>

        </div>

        {/* Right Grid: Verification Checklist (Spans 4 columns) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.015)] p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-left">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Verification Status</h3>
              <button className="text-slate-400 hover:text-slate-600 transition">
                <MoreHorizontal size={14}/>
              </button>
            </div>

            {/* Checklist items list */}
            <div className="space-y-3">
              
              <div className="flex items-center justify-between p-2.5 border border-slate-100 rounded-xl hover:bg-slate-50/50 transition">
                <div className="flex items-center gap-2.5">
                  <span className="p-1 bg-emerald-100 text-emerald-600 rounded-full">
                    <CheckCircle2 size={12}/>
                  </span>
                  <span className="text-xs font-bold text-slate-700">Email Address</span>
                </div>
                <span className="text-[9.5px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">Verified</span>
              </div>

              <div className="flex items-center justify-between p-2.5 border border-slate-100 rounded-xl hover:bg-slate-50/50 transition">
                <div className="flex items-center gap-2.5">
                  <span className="p-1 bg-emerald-100 text-emerald-600 rounded-full">
                    <CheckCircle2 size={12}/>
                  </span>
                  <span className="text-xs font-bold text-slate-700">Phone Number</span>
                </div>
                <span className="text-[9.5px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">Verified</span>
              </div>

              <div className="flex items-center justify-between p-2.5 border border-slate-100 rounded-xl hover:bg-slate-50/50 transition">
                <div className="flex items-center gap-2.5">
                  <span className="p-1 bg-emerald-100 text-emerald-600 rounded-full">
                    <CheckCircle2 size={12}/>
                  </span>
                  <span className="text-xs font-bold text-slate-700">Medical License</span>
                </div>
                <span className="text-[9.5px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">Verified</span>
              </div>

              <div className="flex items-center justify-between p-2.5 border border-slate-100 rounded-xl hover:bg-slate-50/55 transition">
                <div className="flex items-center gap-2.5">
                  <span className="p-1 bg-emerald-100 text-emerald-600 rounded-full">
                    <CheckCircle2 size={12}/>
                  </span>
                  <span className="text-xs font-bold text-slate-700">Aadhaar Card</span>
                </div>
                <span className="text-[9.5px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">Verified</span>
              </div>

              <div className="flex items-center justify-between p-2.5 border border-slate-100 rounded-xl hover:bg-slate-50/50 transition">
                <div className="flex items-center gap-2.5">
                  <span className="p-1 bg-emerald-100 text-emerald-600 rounded-full">
                    <CheckCircle2 size={12}/>
                  </span>
                  <span className="text-xs font-bold text-slate-700">Identity Proof</span>
                </div>
                <span className="text-[9.5px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">Verified</span>
              </div>

              <div className="flex items-center justify-between p-2.5 border border-slate-100 rounded-xl hover:bg-slate-50/50 transition">
                <div className="flex items-center gap-2.5">
                  <span className="p-1 bg-emerald-100 text-emerald-600 rounded-full">
                    <CheckCircle2 size={12}/>
                  </span>
                  <span className="text-xs font-bold text-slate-700">Address Proof</span>
                </div>
                <span className="text-[9.5px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">Verified</span>
              </div>

            </div>
          </div>

          <button onClick={() => showToast(`Opening document manager for ${activeDoc.name}...`)} className="w-full py-2 border border-blue-200 text-blue-600 bg-blue-50/20 hover:bg-blue-50 hover:border-blue-300 transition text-[11px] font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer mt-4">
            <FileText size={13}/>
            <span>View All Documents</span>
          </button>
        </div>

      </div>

      {/* 3. FOUR DISTINCT STATS METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Appointments */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex items-center justify-between hover:shadow-md transition">
          <div className="space-y-1 text-left">
            <p className="text-[11.5px] font-bold text-slate-400 uppercase tracking-wider">Total Appointments</p>
            <p className="text-2xl font-black text-slate-900 font-mono tracking-tight">{totalAppointments.toLocaleString()}</p>
            <div className="text-[10px] text-emerald-600 font-black flex items-center gap-0.5">
              <span>↑ 18.6%</span>
              <span className="text-slate-400 font-medium">vs last 30 days</span>
            </div>
          </div>
          <div className="bg-[#eff6ff] text-[#2563eb] p-3 rounded-full flex items-center justify-center size-11 shrink-0">
            <Calendar size={18}/>
          </div>
        </div>

        {/* Card 2: Total Consultations */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex items-center justify-between hover:shadow-md transition">
          <div className="space-y-1 text-left">
            <p className="text-[11.5px] font-bold text-slate-400 uppercase tracking-wider">Total Consultations</p>
            <p className="text-2xl font-black text-slate-900 font-mono tracking-tight">{totalConsultations.toLocaleString()}</p>
            <div className="text-[10px] text-emerald-600 font-black flex items-center gap-0.5">
              <span>↑ 15.3%</span>
              <span className="text-slate-400 font-medium">vs last 30 days</span>
            </div>
          </div>
          <div className="bg-[#eff6ff] text-[#3b82f6] p-3 rounded-full flex items-center justify-center size-11 shrink-0">
            <Video size={18}/>
          </div>
        </div>

        {/* Card 3: Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex items-center justify-between hover:shadow-md transition">
          <div className="space-y-1 text-left">
            <p className="text-[11.5px] font-bold text-slate-400 uppercase tracking-wider">Total Revenue</p>
            <p className="text-2xl font-black text-[#047857] font-mono tracking-tight">{totalRevenue}</p>
            <div className="text-[10px] text-emerald-600 font-black flex items-center gap-0.5">
              <span>↑ 22.7%</span>
              <span className="text-slate-400 font-medium">vs last 30 days</span>
            </div>
          </div>
          <div className="bg-amber-50 text-amber-600 p-3 rounded-full flex items-center justify-center size-11 shrink-0">
            <Wallet size={18}/>
          </div>
        </div>

        {/* Card 4: Average Rating */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex items-center justify-between hover:shadow-md transition">
          <div className="space-y-1 text-left">
            <p className="text-[11.5px] font-bold text-slate-400 uppercase tracking-wider">Average Rating</p>
            <p className="text-2xl font-black text-slate-900 font-mono tracking-tight">{averageRating} <span className="text-xs text-slate-400 font-normal">/ 5</span></p>
            <div className="text-[10px] text-emerald-600 font-black flex items-center gap-0.5">
              <span>↑ 0.2</span>
              <span className="text-slate-400 font-medium">vs last 30 days</span>
            </div>
          </div>
          <div className="bg-[#faf5ff] text-[#a855f7] p-3 rounded-full flex items-center justify-center size-11 shrink-0">
            <Star size={18} className="fill-[#a855f7]"/>
          </div>
        </div>

      </div>

      {/* 4. DETAILS SECTION TABS */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.01)] overflow-hidden">
        
        {/* Tab Row Layout */}
        <div className="flex border-b border-slate-100 overflow-x-auto select-none no-scrollbar bg-slate-50/20">
          {[
            "Overview",
            "Appointments",
            "Consultations",
            "Earnings",
            "Reviews",
            "Documents",
            "Activity Log"
        ].map((tab) => {
            const isActive = activeDetailsTab === tab;
            return (<button key={tab} onClick={() => {
                    setActiveDetailsTab(tab);
                    showToast(`Selected tab: ${tab}`);
                }} className={`px-5 py-4 text-xs font-black tracking-tight border-b-2 transition-all duration-150 shrink-0 cursor-pointer ${isActive
                    ? "border-[#047857] text-[#047857] bg-white font-black"
                    : "border-transparent text-slate-400 hover:text-slate-800 hover:bg-slate-50/50"}`}>
                {tab}
              </button>);
        })}
        </div>

        {/* Tab Content Rendering Container */}
        <div className="p-6">
          
          {/* TAB 1: OVERVIEW COMPONENT (Three Columns Layout matching Image Precisely) */}
          {activeDetailsTab === "Overview" && (<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Column 1: About Doctor (Spans 5 Columns) */}
              <div className="lg:col-span-5 space-y-6 text-left border-r border-slate-100 lg:pr-6">
                
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">About Doctor</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    {activeDoc.bio}
                  </p>
                </div>

                <div className="space-y-2.5 pt-2">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Specializations</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Acne Treatment", "Hair Disorders", "Skin Allergy", activeDoc.specialization].map(spec => (<span key={spec} className="text-[10.5px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                        {spec}
                      </span>))}
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-50">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Clinic Details</h4>
                  
                  <div className="space-y-3 font-sans">
                    {/* Item 1 */}
                    <div className="flex items-start gap-2.5">
                      <div className="bg-slate-50 p-2 rounded-xl text-slate-400 border border-slate-100 mt-0.5">
                        <MapPin size={13}/>
                      </div>
                      <div className="text-xs leading-normal">
                        <p className="font-extrabold text-slate-800">Skin & You Clinic</p>
                        <p className="text-slate-400 text-[10.5px] font-medium">E-45, Greater Kailash Part 1, New Delhi - 110048</p>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="flex items-start gap-2.5">
                      <div className="bg-slate-50 p-2 rounded-xl text-slate-400 border border-slate-100 mt-0.5">
                        <Wallet size={13}/>
                      </div>
                      <div className="text-xs leading-normal">
                        <p className="font-extrabold text-slate-800">Consultation Fee</p>
                        <p className="text-[#047857] font-bold text-[11.5px] mt-0.5">₹800</p>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* Column 2: Availability (Spans 3 Columns) */}
              <div className="lg:col-span-3 space-y-4 text-left border-r border-slate-100 lg:pr-6">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg animate-none">
                    <Clock size={14}/>
                  </span>
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Availability</h4>
                </div>

                <div className="divide-y divide-slate-100 pt-1 text-xs font-sans">
                  
                  <div className="py-2.5 flex justify-between items-center text-[11.5px] font-semibold text-slate-700">
                    <span className="text-slate-400 font-bold">Monday</span>
                    <span>10:00 AM - 06:00 PM</span>
                  </div>

                  <div className="py-2.5 flex justify-between items-center text-[11.5px] font-semibold text-slate-700">
                    <span className="text-slate-400 font-bold">Tuesday</span>
                    <span>10:00 AM - 06:00 PM</span>
                  </div>

                  <div className="py-2.5 flex justify-between items-center text-[11.5px] font-semibold text-slate-700">
                    <span className="text-slate-400 font-bold">Wednesday</span>
                    <span>10:00 AM - 06:00 PM</span>
                  </div>

                  <div className="py-2.5 flex justify-between items-center text-[11.5px] font-semibold text-slate-700">
                    <span className="text-slate-400 font-bold">Thursday</span>
                    <span>10:00 AM - 06:00 PM</span>
                  </div>

                  <div className="py-2.5 flex justify-between items-center text-[11.5px] font-semibold text-slate-700">
                    <span className="text-slate-400 font-bold">Friday</span>
                    <span>10:00 AM - 06:00 PM</span>
                  </div>

                  <div className="py-2.5 flex justify-between items-center text-[11.5px] font-semibold text-slate-700">
                    <span className="text-slate-400 font-bold">Saturday</span>
                    <span>10:00 AM - 02:00 PM</span>
                  </div>

                  <div className="py-2.5 flex justify-between items-center text-[11.5px]">
                    <span className="text-slate-400 font-bold">Sunday</span>
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">Unavailable</span>
                  </div>

                </div>
              </div>

              {/* Column 3: Recent Activity (Spans 4 Columns) */}
              <div className="lg:col-span-4 space-y-4 text-left">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Recent Activity</h4>
                  <button onClick={() => {
                setActiveDetailsTab("Activity Log");
                showToast("Expanded full chronicle log view.");
            }} className="text-xs text-blue-600 hover:underline font-bold">
                    View All
                  </button>
                </div>

                {/* Vertical timeline items layout */}
                <div className="space-y-4 font-sans text-xs">
                  
                  {/* Task 1 */}
                  <div className="flex gap-3 items-start">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl mt-0.5 shrink-0 animate-none">
                      <Video size={13}/>
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-800 leading-tight">New consultation completed</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Consultation with Ramesh Kumar</p>
                      <span className="text-[9.5px] text-slate-400 mt-1 block">1 hour ago</span>
                    </div>
                  </div>

                  {/* Task 2 */}
                  <div className="flex gap-3 items-start">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl mt-0.5 shrink-0 animate-none">
                      <Calendar size={13}/>
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-800 leading-tight">Appointment booked</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">By Priya Sharma</p>
                      <span className="text-[9.5px] text-slate-400 mt-1 block">3 hours ago</span>
                    </div>
                  </div>

                  {/* Task 3 */}
                  <div className="flex gap-3 items-start">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl mt-0.5 shrink-0 animate-none">
                      <User size={13}/>
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-800 leading-tight">Profile updated</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Updated clinic details</p>
                      <span className="text-[9.5px] text-slate-400 mt-1 block">1 day ago</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>)}

          {/* TAB 2: APPOINTMENTS LIST */}
          {activeDetailsTab === "Appointments" && (<div className="space-y-4 text-left">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-2">Logged Bookings</h4>
              <div className="border border-slate-100 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10.5px] font-black uppercase text-slate-500 border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-4">Patient Name</th>
                      <th className="py-3 px-4">Problem</th>
                      <th className="py-3 px-4">Date / Time</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {docSpecificAppointments.length > 0 ? (docSpecificAppointments.map(app => (<tr key={app.id} className="hover:bg-slate-50/50">
                          <td className="py-3.5 px-4 font-bold text-slate-800">{app.patientName}</td>
                          <td className="py-3.5 px-4 text-slate-500 font-medium">{app.specialization || "General consultation"}</td>
                          <td className="py-3.5 px-4">
                            <p className="font-semibold text-slate-700">{app.date}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{app.time}</p>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-full">
                              Confirmed
                            </span>
                          </td>
                        </tr>))) : (<>
                        <tr className="hover:bg-slate-50/50">
                          <td className="py-3.5 px-4 font-bold text-slate-800">Ramesh Kumar</td>
                          <td className="py-3.5 px-4 text-slate-500 font-medium">Post-acne scars and dry patches</td>
                          <td className="py-3.5 px-4">
                            <p className="font-semibold text-slate-700">22 Jun 2026</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">10:30 AM</p>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-full">
                              Completed
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                          <td className="py-3.5 px-4 font-bold text-slate-800">Priya Sharma</td>
                          <td className="py-3.5 px-4 text-slate-500 font-medium">Routine skin review</td>
                          <td className="py-3.5 px-4">
                            <p className="font-semibold text-slate-700">24 Jun 2026</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">02:15 PM</p>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex px-2 py-0.5 bg-blue-50 text-blue-700 font-bold text-[10px] rounded-full">
                              In Queue
                            </span>
                          </td>
                        </tr>
                      </>)}
                  </tbody>
                </table>
              </div>
            </div>)}

          {/* TAB 3: CONSULTATIONS */}
          {activeDetailsTab === "Consultations" && (<div className="space-y-4 text-left font-sans text-xs">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Digital Prescription Transcripts</h4>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-[#047857] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Case No. RX-991204</span>
                  <span className="text-[10.5px] text-slate-400">Published yesterday</span>
                </div>
                <div>
                  <p className="font-extrabold text-slate-800">Severe Treatment Plan</p>
                  <p className="text-slate-500 mt-1 leading-relaxed text-[11.5px] font-medium">Patient presents with erythematous plaques on bilateral palms with pruritus. Prescribed Momate Lotion (0.1%) once daily for 7 days + Cetirizine 10mg h.s. at night.</p>
                </div>
                <div className="flex gap-2 justify-end pt-2 border-t border-slate-200/50">
                  <button className="px-3.5 py-1.5 border border-slate-200 rounded-lg text-slate-500 font-bold hover:bg-slate-100 transition cursor-pointer">Download RX</button>
                  <button className="px-3.5 py-1.5 bg-[#047857] text-white font-bold rounded-lg hover:bg-[#065f46] transition cursor-pointer">E-Sign Document</button>
                </div>
              </div>
            </div>)}

          {/* TAB 4: EARNINGS */}
          {activeDetailsTab === "Earnings" && (<div className="space-y-5 text-left font-sans">
              <div className="flex justify-between items-center text-xs">
                <h4 className="font-black uppercase tracking-wider text-slate-800">Revenue Logs</h4>
                <span className="text-[11px] font-bold text-[#047857]">Target: ₹15,00,000 / month</span>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-150 flex flex-col justify-center items-center h-48 space-y-3">
                <TrendingUp size={28} className="text-emerald-500 animate-none"/>
                <div className="text-center">
                  <p className="text-lg font-black text-slate-900">{totalRevenue}</p>
                  <p className="text-xs text-slate-400 font-medium">Secure gross payout disbursed on 1st of every month.</p>
                </div>
              </div>
            </div>)}

          {/* TAB 5: REVIEWS */}
          {activeDetailsTab === "Reviews" && (<div className="space-y-4 text-left">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Dispatched Patient Feedbacks</h4>
              <div className="space-y-3 font-sans text-xs">
                
                <div className="p-4 border border-slate-100 rounded-xl space-y-1.5">
                  <div className="flex justify-between items-center">
                    <p className="font-extrabold text-slate-800">Ramesh Kumar</p>
                    <span className="text-[10px] text-slate-400">10 Jun 2026</span>
                  </div>
                  <div className="text-amber-500">★★★★★</div>
                  <p className="text-slate-500 font-medium leading-relaxed">"Excellent diagnostics and consult! Dr. Neha was very patient and explained the lifestyle revisions thoroughly. Highly recommended."</p>
                </div>

              </div>
            </div>)}

          {/* TAB 6: DOCUMENTS */}
          {activeDetailsTab === "Documents" && (<div className="space-y-4 text-left">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Medical Credential Vault</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans">
                
                <div className="p-4 border border-slate-100 rounded-2xl flex items-center justify-between hover:bg-slate-50 transition">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                      <FileText size={16}/>
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-800">State Medical Council License</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{activeDoc.license || "DMC-LICENSE-2016.pdf"}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#047857] bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase">Active</span>
                </div>

              </div>
            </div>)}

          {/* TAB 7: ACTIVITY LOG */}
          {activeDetailsTab === "Activity Log" && (<div className="space-y-4 text-left">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Recent Activity Ledger</h4>
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                
                <div className="py-2.5 px-3 border-l-2 border-slate-200 bg-slate-50/50 flex justify-between items-center text-[11px] font-sans">
                  <div className="text-left space-y-0.5">
                    <p className="font-bold text-slate-800">Successful Portal Login</p>
                    <p className="text-slate-500">Logged in from registered clinic browser session</p>
                  </div>
                  <span className="text-slate-400 text-[10px] shrink-0 font-medium">15 Jun, 22:15</span>
                </div>

              </div>
            </div>)}

        </div>

      </div>

      {/* Manual Doctor Registration Onboarding Form dialog overlay */}
      {isAddModalOpen && (<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 text-left animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-905 uppercase tracking-tight flex items-center gap-2">
                <span className="bg-[#eff6ff] text-[#2563eb] p-1.5 rounded-lg">
                  <Stethoscope size={16}/>
                </span>
                <span>Onboard Medical Specialist</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="size-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition cursor-pointer">
                <X size={15}/>
              </button>
            </div>

            <form onSubmit={handleOnboardSubmit} className="space-y-4 pt-3.5 text-xs text-slate-700">
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wide text-[9.5px]">Physician Full Name</label>
                  <input type="text" value={formDocName} onChange={(e) => setFormDocName(e.target.value)} placeholder="e.g. Dr. Rohan Dev" required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#047857] focus:border-[#047857]"/>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wide text-[9.5px]">Specialty Practice Area</label>
                  <select value={formDocSpecialization} onChange={(e) => setFormDocSpecialization(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#047857] font-bold cursor-pointer">
                    <option value="Cardiologist">Cardiologist (Heart)</option>
                    <option value="Neurologist">Neurologist (Brain)</option>
                    <option value="Dermatologist">Dermatologist (Skin)</option>
                    <option value="Pediatrician">Pediatrician (Kids)</option>
                    <option value="Orthopedic">Orthopedic (Bones)</option>
                    <option value="Gynecologist">Gynecologist (Women's Health)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wide text-[9.5px]">Email Address (Personal/Work)</label>
                  <input type="email" value={formDocEmail} onChange={(e) => setFormDocEmail(e.target.value)} placeholder="e.g. rohan.dev@elitecare.com" required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#047857] focus:border-[#047857]"/>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wide text-[9.5px]">Phone Number</label>
                  <input type="text" value={formDocPhone} onChange={(e) => setFormDocPhone(e.target.value)} placeholder="e.g. +91 99887 76655" required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#047857] focus:border-[#047857]"/>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wide text-[9.5px]">Experience Span</label>
                  <input type="text" value={formDocExperience} onChange={(e) => setFormDocExperience(e.target.value)} placeholder="e.g. 12 Years" required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#047857] focus:border-[#047857]"/>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wide text-[9.5px]">Gender Orientation</label>
                  <select value={formDocGender} onChange={(e) => setFormDocGender(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none">
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Diverse">Diverse</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wide text-[9.5px]">Date of Birth</label>
                  <input type="date" value={formDocDob} onChange={(e) => setFormDocDob(e.target.value)} required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none"/>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wide text-[9.5px]">Cabin / Practice Location</label>
                  <input type="text" value={formDocLocation} onChange={(e) => setFormDocLocation(e.target.value)} placeholder="e.g. Mumbai Clinic, Room 402" required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none"/>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wide text-[9.5px]">Medical Registration No.</label>
                  <input type="text" value={formDocLicense} onChange={(e) => setFormDocLicense(e.target.value)} placeholder="e.g. DMC/2016/54321" required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#047857]"/>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wide text-[9.5px]">Medical Biography / Bio</label>
                <textarea value={formDocBio} onChange={(e) => setFormDocBio(e.target.value)} placeholder="Summarize accomplishments, clinical focuses..." rows={2} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none resize-none"/>
              </div>

              <div className="border-t border-slate-100 pt-4 flex gap-2.5 justify-end">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded-xl text-slate-500 font-bold hover:bg-slate-50 transition cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-[#047857] hover:bg-[#065f46] text-white rounded-xl font-bold hover:shadow-md transition cursor-pointer">
                  Register Expert
                </button>
              </div>

            </form>
          </div>
        </div>)}

      {/* 2. VIEW DOCTOR MODAL COVER */}
      {isViewModalOpen && (<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 text-left animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <span className="bg-emerald-50 text-emerald-700 p-1.5 rounded-lg">
                  <User size={16}/>
                </span>
                <span>Specialist Credentials Passport</span>
              </h3>
              <button onClick={() => setIsViewModalOpen(false)} className="size-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition cursor-pointer">
                <X size={15}/>
              </button>
            </div>

            <div className="pt-4 space-y-4">
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <img src={activeDoc.image || activeDoc.avatar || "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=150"} alt={activeDoc.name} className="size-16 rounded-full object-cover border-2 border-white shadow-sm" referrerPolicy="no-referrer"/>
                <div>
                  <h4 className="text-sm font-black text-slate-900 leading-tight">{activeDoc.name}</h4>
                  <p className="text-xs text-[#047857] font-bold mt-0.5">{activeDoc.specialization}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5 font-bold">ID: {activeDoc.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                  <p className="text-[9px] text-slate-400 uppercase font-bold">Practice Area</p>
                  <p className="font-bold text-slate-800 mt-1">{activeDoc.specialization}</p>
                </div>
                <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                  <p className="text-[9px] text-slate-400 uppercase font-bold">Practice Experience</p>
                  <p className="font-bold text-slate-800 mt-1">{activeDoc.experience || "8 Years"}</p>
                </div>
                <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                  <p className="text-[9px] text-slate-400 uppercase font-bold">Cabinet Address</p>
                  <p className="font-bold text-slate-800 mt-1">{activeDoc.location || "Delhi, India"}</p>
                </div>
                <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                  <p className="text-[9px] text-slate-400 uppercase font-bold">System Credentials No.</p>
                  <p className="font-bold font-mono text-slate-800 mt-1">{activeDoc.license || "DMC/2016/67890"}</p>
                </div>
                <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                  <p className="text-[9px] text-slate-400 uppercase font-bold">Email</p>
                  <p className="font-bold text-slate-800 mt-1 truncate">{activeDoc.email || `${activeDoc.name.toLowerCase().replace(/\s+/g, '')}@elitecare.com`}</p>
                </div>
                <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                  <p className="text-[9px] text-slate-400 uppercase font-bold">Phone No.</p>
                  <p className="font-bold text-slate-800 mt-1">{activeDoc.phone || "+91 88776 55443"}</p>
                </div>
                <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                  <p className="text-[9px] text-slate-400 uppercase font-bold">Gender & languages</p>
                  <p className="font-bold text-slate-800 mt-1">{activeDoc.gender || "Female"} ({activeDoc.languages || "English, Hindi"})</p>
                </div>
                <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                  <p className="text-[9px] text-slate-400 uppercase font-bold">Date of Birth</p>
                  <p className="font-bold text-slate-800 mt-1">{activeDoc.dob || "12 Apr 1988"}</p>
                </div>
              </div>

              <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                <p className="text-[9px] text-slate-400 uppercase font-bold">Medical Background Biography</p>
                <p className="text-slate-600 mt-1.5 leading-relaxed text-xs">
                  {activeDoc.bio || "No custom biography supplied for this practitioner yet."}
                </p>
              </div>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-4 flex justify-end">
              <button onClick={() => setIsViewModalOpen(false)} className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer">
                Done
              </button>
            </div>
          </div>
        </div>)}

      {/* 3. EDIT DOCTOR MODAL COVER */}
      {isEditModalOpen && (<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 text-left animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <span className="bg-[#eff6ff] text-[#2563eb] p-1.5 rounded-lg">
                  <FileText size={16}/>
                </span>
                <span>Edit Specialist Credentials</span>
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="size-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition cursor-pointer">
                <X size={15}/>
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 pt-3.5 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wide text-[9.5px]">Physician Full Name</label>
                  <input type="text" value={editDocName} onChange={(e) => setEditDocName(e.target.value)} required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#047857] focus:border-[#047857]"/>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wide text-[9.5px]">Specialization Category</label>
                  <select value={editDocSpecialization} onChange={(e) => setEditDocSpecialization(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold cursor-pointer font-sans">
                    <option value="Cardiologist">Cardiologist (Heart)</option>
                    <option value="Neurologist">Neurologist (Brain)</option>
                    <option value="Dermatologist">Dermatologist (Skin)</option>
                    <option value="Pediatrician">Pediatrician (Kids)</option>
                    <option value="Orthopedic">Orthopedic (Bones)</option>
                    <option value="Gynecologist">Gynecologist (Women's Health)</option>
                    <option value="General Practitioner">General Practitioner</option>
                    <option value="Eye Specialist">Eye Specialist</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wide text-[9.5px]">Email Address</label>
                  <input type="email" value={editDocEmail} onChange={(e) => setEditDocEmail(e.target.value)} required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none"/>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wide text-[9.5px]">Phone Number</label>
                  <input type="text" value={editDocPhone} onChange={(e) => setEditDocPhone(e.target.value)} required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none"/>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wide text-[9.5px]">Experience Span</label>
                  <input type="text" value={editDocExperience} onChange={(e) => setEditDocExperience(e.target.value)} required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none"/>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wide text-[9.5px]">Gender</label>
                  <select value={editDocGender} onChange={(e) => setEditDocGender(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none font-sans">
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Diverse">Diverse</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wide text-[9.5px]">Languages Fluency</label>
                  <input type="text" value={editDocLanguages} onChange={(e) => setEditDocLanguages(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"/>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wide text-[9.5px]">Cabin / Practice Location</label>
                  <input type="text" value={editDocLocation} onChange={(e) => setEditDocLocation(e.target.value)} required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none"/>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wide text-[9.5px]">Registration / License No.</label>
                  <input type="text" value={editDocLicense} onChange={(e) => setEditDocLicense(e.target.value)} required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none"/>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wide text-[9.5px]">Biography</label>
                <textarea value={editDocBio} onChange={(e) => setEditDocBio(e.target.value)} rows={2} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none resize-none"/>
              </div>

              <div className="border-t border-slate-100 pt-4 flex gap-2.5 justify-end">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded-xl text-slate-500 font-bold hover:bg-slate-50 transition cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition cursor-pointer">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>)}

      {/* 4. DELETE MODAL COVER */}
      {isDeleteModalOpen && (<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="flex flex-col items-center gap-3">
              <span className="p-3 bg-rose-50 text-rose-600 rounded-full">
                <X size={24}/>
              </span>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                Deregister Specialist
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed px-2">
                Are you absolutely sure you want to remove <strong className="text-slate-800">{activeDoc.name}</strong> from the clinical registry?
                This operation is irreversible.
              </p>
            </div>

            <div className="mt-6 flex gap-2.5 justify-center">
              <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded-xl text-slate-500 text-xs font-bold hover:bg-slate-100 transition cursor-pointer">
                Cancel, Keep Profile
              </button>
              <button onClick={handleDeleteSubmit} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm transition cursor-pointer">
                Yes, Deregister
              </button>
            </div>
          </div>
        </div>)}

    </div>);
}
