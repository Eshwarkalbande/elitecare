import React, { useState } from "react";
import { Building2, CheckCircle2, Hospital as HospitalIcon, Users, CalendarDays, Search, Plus, MapPin, Phone, Eye, Pencil, Trash2, ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
export default function HospitalsPanel({ showToast }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    // Form states for manual registration
    const [formHospitalName, setFormHospitalName] = useState("");
    const [formHospitalEmail, setFormHospitalEmail] = useState("");
    const [formHospitalLocation, setFormHospitalLocation] = useState("");
    const [formHospitalPhone, setFormHospitalPhone] = useState("");
    const [formHospitalDoctors, setFormHospitalDoctors] = useState(15);
    const [formHospitalStatus, setFormHospitalStatus] = useState("Active");
    const [hospitals, setHospitals] = useState([
        { id: 1, name: "City General Hospital", email: "info@citygeneral.com", location: "New Delhi, India", phone: "+91 98765 43210", doctors: 45, status: "Active", joined: "22 Apr 2024", img: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=150" },
        { id: 2, name: "Sunrise Medical Center", email: "contact@sunrisemedical.com", location: "Mumbai, India", phone: "+91 87654 32109", doctors: 32, status: "Active", joined: "20 Apr 2024", img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=150" },
        { id: 3, name: "Green Valley Hospital", email: "hello@greenvalley.com", location: "Bangalore, India", phone: "+91 76543 21098", doctors: 28, status: "Active", joined: "18 Apr 2024", img: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=150" },
        { id: 4, name: "Metro Health Institute", email: "admin@metrohealth.com", location: "Hyderabad, India", phone: "+91 65432 10987", doctors: 38, status: "Active", joined: "15 Apr 2024", img: "https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?auto=format&fit=crop&q=80&w=150" },
        { id: 5, name: "Care & Cure Hospital", email: "care@carecure.com", location: "Chennai, India", phone: "+91 54321 09876", doctors: 25, status: "Inactive", joined: "10 Apr 2024", img: "https://images.unsplash.com/photo-1596541223130-5d6ce4b5327e?auto=format&fit=crop&q=80&w=150" },
        { id: 6, name: "Hopewell Hospital", email: "support@hopewell.com", location: "Kolkata, India", phone: "+91 43210 98765", doctors: 22, status: "Active", joined: "8 Apr 2024", img: "https://images.unsplash.com/photo-1638202993928-7267aad84c31?auto=format&fit=crop&q=80&w=150" },
        { id: 7, name: "Life Line Hospital", email: "info@lifeline.com", location: "Pune, India", phone: "+91 32109 87654", doctors: 18, status: "Inactive", joined: "5 Apr 2024", img: "https://images.unsplash.com/photo-1587370560942-ad2a04eabb6d?auto=format&fit=crop&q=80&w=150" },
    ]);
    const handleNewHospitalSubmit = (e) => {
        e.preventDefault();
        if (!formHospitalName.trim()) {
            showToast("Please enter hospital name!");
            return;
        }
        const newHospitalRecord = {
            id: hospitals.length + 1,
            name: formHospitalName,
            email: formHospitalEmail || "consult@hospital.com",
            location: formHospitalLocation || "India",
            phone: formHospitalPhone || "+91 99999 88888",
            doctors: formHospitalDoctors || 10,
            status: formHospitalStatus,
            joined: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
            img: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=150"
        };
        setHospitals([newHospitalRecord, ...hospitals]);
        // Clear inputs
        setFormHospitalName("");
        setFormHospitalEmail("");
        setFormHospitalLocation("");
        setFormHospitalPhone("");
        setFormHospitalDoctors(15);
        setFormHospitalStatus("Active");
        setIsAddModalOpen(false);
        showToast(`${formHospitalName} was added manually as a clinical partner!`);
    };
    const handleDeleteHospital = (id, name) => {
        if (confirm(`Remove clinical partner hospital: ${name}?`)) {
            setHospitals(hospitals.filter(h => h.id !== id));
            showToast(`${name} was removed successfully.`);
        }
    };
    // Stats calculate
    const totalHospitals = hospitals.length;
    const activeHospitals = hospitals.filter(h => h.status === "Active").length;
    const inactiveHospitals = hospitals.filter(h => h.status === "Inactive").length;
    const totalDoctorsCount = hospitals.reduce((acc, curr) => acc + curr.doctors, 0);
    const stats = [
        { label: "Total Hospitals", value: String(totalHospitals), icon: Building2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", trend: "↑ 12.5%", trendMuted: "vs last 30 days", isPositive: true },
        { label: "Active Hospitals", value: String(activeHospitals), icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-100", trend: "↑ 15.3%", trendMuted: "vs last 30 days", isPositive: true },
        { label: "Inactive Hospitals", value: String(inactiveHospitals), icon: HospitalIcon, color: "text-rose-500", bg: "bg-rose-50", border: "border-rose-100", trend: "↓ 8.2%", trendMuted: "vs last 30 days", isPositive: false },
        { label: "Total Doctors", value: String(totalDoctorsCount), icon: Users, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-100", trend: "↑ 18.6%", trendMuted: "vs last 35 days", isPositive: true },
        { label: "Total Appointments", value: "8,965", icon: CalendarDays, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100", trend: "↑ 21.7%", trendMuted: "vs last 30 days", isPositive: true },
    ];
    return (<div className="space-y-6">
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat, idx) => (<div key={idx} className="bg-white rounded-[14px] p-5 shadow-sm border border-slate-200">
            <div className="flex justify-between items-start">
              <div className="space-y-3 md:space-y-4">
                <p className="text-[11px] font-bold text-slate-500">{stat.label}</p>
                <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
              </div>
              <div className={`p-2.5 rounded-full ${stat.bg} ${stat.border} border`}>
                <stat.icon className={`size-5 ${stat.color}`} strokeWidth={2}/>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-[10px]">
              <span className={`font-bold ${stat.isPositive ? "text-emerald-500" : "text-rose-500"}`}>{stat.trend}</span>
              <span className="text-slate-400">{stat.trendMuted}</span>
            </div>
          </div>))}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[14px] shadow-sm border border-slate-200 p-5 space-y-5">
        
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h3 className="text-[13px] font-bold text-slate-800 tracking-wide">Hospitals List</h3>
        </div>

        {/* Filters Top Bar */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4"/>
            <input type="text" placeholder="Search hospitals..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-[11.5px] outline-none focus:border-[#047857] text-slate-700 font-medium"/>
          </div>

          <div className="flex items-center gap-3">
             <div className="relative border border-slate-200 rounded-lg bg-white">
              <select className="appearance-none text-slate-600 pl-3 pr-9 py-2.5 text-[11px] font-bold outline-none focus:border-[#047857] bg-transparent cursor-pointer min-w-[130px]">
                <option>All Status</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 size-3.5 pointer-events-none"/>
            </div>

            <div className="relative border border-slate-200 rounded-lg bg-white">
              <select className="appearance-none text-slate-600 pl-3 pr-9 py-2.5 text-[11px] font-bold outline-none focus:border-[#047857] bg-transparent cursor-pointer min-w-[130px]">
                <option>All Cities</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 size-3.5 pointer-events-none"/>
            </div>

            <button onClick={() => setIsAddModalOpen(true)} className="bg-[#047857] hover:bg-emerald-800 text-white rounded-lg px-4 py-2.5 flex items-center gap-2 text-[11.5px] font-bold transition shadow-sm cursor-pointer whitespace-nowrap">
              <Plus className="size-4" strokeWidth={3}/>
              <span>Add Hospital</span>
            </button>
          </div>
        </div>

        {/* Table itself */}
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap border-collapse">
            <thead>
              <tr className="border-b border-t border-slate-100 text-[11px] font-bold text-slate-800 tracking-wide bg-white">
                <th className="py-4 px-3 w-72">Hospital</th>
                <th className="py-4 px-3">Location</th>
                <th className="py-4 px-3">Contact</th>
                <th className="py-4 px-3">Doctors</th>
                <th className="py-4 px-3">Status</th>
                <th className="py-4 px-3">Joined On</th>
                <th className="py-4 px-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {hospitals.filter(h => h.name.toLowerCase().includes(searchQuery.toLowerCase())).map((row, i) => (<tr key={i} className="hover:bg-slate-50/50 transition bg-white">
                  
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-3">
                      <img src={row.img} alt="" className="size-10 rounded-lg object-cover border border-slate-200 shadow-sm" referrerPolicy="no-referrer"/>
                      <div>
                        <p className="text-[11.5px] font-bold text-slate-900">{row.name}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{row.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1.5 text-slate-600">
                        <MapPin size={13} className="text-slate-400"/>
                        <span className="text-[11px] font-semibold">{row.location}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                     <div className="flex items-center gap-1.5 text-slate-600">
                        <Phone size={13} className="text-slate-400"/>
                        <span className="text-[11px] font-medium">{row.phone}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 text-[11.5px] font-bold text-slate-700">
                    {row.doctors}
                  </td>

                  <td className="py-3.5 px-3">
                    {row.status === "Active" ? (<span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-emerald-50 text-[#047857] border border-emerald-100">Active</span>) : (<span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-rose-50 text-rose-600 border border-rose-100">Inactive</span>)}
                  </td>

                  <td className="py-3.5 px-3 text-[11.5px] font-semibold text-slate-600">
                    {row.joined}
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => showToast(`Viewing profile of ${row.name}`)} className="p-1.5 bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-600 rounded transition">
                        <Eye size={13}/>
                      </button>
                      <button onClick={() => showToast(`Edit ${row.name}`)} className="p-1.5 bg-emerald-50 text-emerald-500 hover:bg-emerald-100 hover:text-emerald-600 rounded transition">
                        <Pencil size={13}/>
                      </button>
                      <button onClick={() => handleDeleteHospital(row.id, row.name)} className="p-1.5 bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-600 rounded transition">
                        <Trash2 size={13}/>
                      </button>
                    </div>
                  </td>

                </tr>))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-3 text-[11px] font-semibold text-slate-500">
           <span>Showing 1 to {hospitals.length} of {hospitals.length} results</span>
           <div className="flex gap-1.5">
             <button className="px-2.5 py-1.5 border border-slate-200 rounded text-slate-400 hover:bg-slate-50"><ChevronLeft size={13}/></button>
             <button className="px-3 py-1.5 border border-[#047857] bg-emerald-50 text-[#047857] rounded font-bold">1</button>
             <button className="px-2.5 py-1.5 border border-slate-200 rounded text-slate-400 hover:bg-slate-50"><ChevronRight size={13}/></button>
           </div>
        </div>

      </div>

      {/* Manual Adjoining Adding Hospital Dialog Modal Overlay */}
      {isAddModalOpen && (<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 text-left animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <span className="bg-[#eff6ff] text-[#2563eb] p-1.5 rounded-lg">
                  <Building2 size={16}/>
                </span>
                <span>Register Hospital Branch</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="size-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition cursor-pointer">
                <X size={15}/>
              </button>
            </div>

            <form onSubmit={handleNewHospitalSubmit} className="space-y-4 pt-3.5 text-xs text-slate-700">
              
              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wide text-[9.5px]">Hospital Name</label>
                <input type="text" value={formHospitalName} onChange={(e) => setFormHospitalName(e.target.value)} placeholder="e.g. Apollo Wellness Center" required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#047857] focus:border-[#047857]"/>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wide text-[9.5px]">Email Address</label>
                <input type="email" value={formHospitalEmail} onChange={(e) => setFormHospitalEmail(e.target.value)} placeholder="e.g. contact@apollo.com" required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#047857] focus:border-[#047857]"/>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wide text-[9.5px]">Location / City</label>
                  <input type="text" value={formHospitalLocation} onChange={(e) => setFormHospitalLocation(e.target.value)} placeholder="e.g. Bangalore, India" required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#047857] focus:border-[#047857]"/>
                </div>
                
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wide text-[9.5px]">Phone Number</label>
                  <input type="text" value={formHospitalPhone} onChange={(e) => setFormHospitalPhone(e.target.value)} placeholder="e.g. +91 91122 33445" required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#047857] focus:border-[#047857]"/>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wide text-[9.5px]">Doctor Count</label>
                  <input type="number" value={formHospitalDoctors} onChange={(e) => setFormHospitalDoctors(Number(e.target.value))} min={1} required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#047857] focus:border-[#047857]"/>
                </div>
                
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wide text-[9.5px]">Status</label>
                  <select value={formHospitalStatus} onChange={(e) => setFormHospitalStatus(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#047857] font-bold cursor-pointer">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 flex gap-2.5 justify-end">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded-xl text-slate-500 font-bold hover:bg-slate-50 transition cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-[#047857] hover:bg-[#065f46] text-white rounded-xl font-bold hover:shadow-md transition cursor-pointer">
                  Register Partner
                </button>
              </div>

            </form>
          </div>
        </div>)}

    </div>);
}
