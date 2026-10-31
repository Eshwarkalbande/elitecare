import React, { useState } from "react";
import { Share2, Target, Eye, TrendingUp, Plus, Calendar, Bell, Filter, Download, RefreshCw, ChevronDown, Smartphone, AlertCircle, Sparkles, ChevronLeft, ChevronRight, Trash2, Edit3, BookOpen, UserCheck, Package, FileSpreadsheet } from "lucide-react";
export default function BannersPanel({ showToast }) {
    const [dateRange, setDateRange] = useState("22 Apr 2024 - 22 May 2024");
    const [bannerType, setBannerType] = useState("All Types");
    const [placement, setPlacement] = useState("All Placements");
    const [status, setStatus] = useState("All Status");
    // Selection list for banners listing table
    const initialBanners = [
        {
            id: 1,
            name: "Summer Health Checkup",
            subtitle: "Get up to 30% off on health checkups",
            type: "Promotional",
            typeBadge: "bg-indigo-50 text-indigo-750",
            placement: "Home Page",
            status: "Active",
            statusBadge: "bg-emerald-100 text-emerald-805 text-emerald-800",
            schedule: "20 Apr 2024 - 31 May 2024",
            impressions: 32450,
            clicks: 2450,
            ctr: "7.55%",
            primaryText: "Summer Health Checkup",
            secondaryText: "Get up to 30% OFF",
            imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=350",
            btnText: "Book Now"
        },
        {
            id: 2,
            name: "Women's Health Campaign",
            subtitle: "Special care for a healthy you",
            type: "Health Campaign",
            typeBadge: "bg-emerald-50 text-emerald-700",
            placement: "Dashboard",
            status: "Active",
            statusBadge: "bg-emerald-100 text-emerald-805 text-emerald-805 text-emerald-800",
            schedule: "18 Apr 2024 - 18 Jun 2024",
            impressions: 24785,
            clicks: 1892,
            ctr: "7.63%",
            primaryText: "Women's Care Drive",
            secondaryText: "Free Consultations",
            imageUrl: "https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&q=80&w=350",
            btnText: "Learn More"
        },
        {
            id: 3,
            name: "Book Appointment Easily",
            subtitle: "Quick & easy appointment booking",
            type: "Feature Update",
            typeBadge: "bg-blue-50 text-blue-700",
            placement: "Appointment Page",
            status: "Active",
            statusBadge: "bg-emerald-100 text-emerald-805 text-emerald-800",
            schedule: "10 Apr 2024 - 10 Jun 2024",
            impressions: 18650,
            clicks: 1425,
            ctr: "7.65%",
            primaryText: "Instant Slots Open",
            secondaryText: "Skip the queues hoy",
            imageUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=350",
            btnText: "Reserve Now"
        },
        {
            id: 4,
            name: "Free Doctor Consultation",
            subtitle: "Talk to doctors from home",
            type: "Promotional",
            typeBadge: "bg-indigo-50 text-indigo-750",
            placement: "Consultation Page",
            status: "Paused",
            statusBadge: "bg-amber-100 text-amber-800",
            schedule: "15 Apr 2024 - 25 May 2024",
            impressions: 12480,
            clicks: 842,
            ctr: "6.75%",
            primaryText: "Consultation From Home",
            secondaryText: "Zero Booking Fee Today",
            imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=350",
            btnText: "Consult Free"
        },
        {
            id: 5,
            name: "Diabetes Awareness Month",
            subtitle: "Prevent, care and manage diabetes",
            type: "Health Campaign",
            typeBadge: "bg-emerald-50 text-emerald-700",
            placement: "Home Page",
            status: "Completed",
            statusBadge: "bg-slate-100 text-slate-650",
            schedule: "01 Apr 2024 - 30 Apr 2024",
            impressions: 15475,
            clicks: 1125,
            ctr: "7.27%",
            primaryText: "Defeat Diabetes Together",
            secondaryText: "Complementary Blood Checked",
            imageUrl: "https://images.unsplash.com/photo-1607619056574-7b8d304f2c38?auto=format&fit=crop&q=80&w=350",
            btnText: "Register"
        }
    ];
    const [banners, setBanners] = useState(initialBanners);
    const [selectedBannerIdx, setSelectedBannerIdx] = useState(0);
    const activePreview = banners[selectedBannerIdx] || banners[0];
    const handleClearFilters = () => {
        setBannerType("All Types");
        setPlacement("All Placements");
        setStatus("All Status");
        showToast("Banner filters cleared");
    };
    return (<div className="space-y-6 text-left" id="banners-panel">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Share2 className="text-slate-900 shrink-0" size={24}/>
            Banners & Ads
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create, manage and track banner performance across the platform
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Active Period Range */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-705 shadow-sm cursor-pointer hover:bg-slate-50">
            <Calendar size={13.5} className="text-slate-400"/>
            <span>22 Apr 2024 - 22 May 2024</span>
            <ChevronDown size={12} className="text-slate-400 ml-1"/>
          </div>

          <button onClick={() => showToast("Showing dynamic placement configs...")} className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm cursor-pointer hover:bg-slate-50">
            <Filter size={13} className="text-slate-500"/>
            <span>Filters</span>
          </button>

          <button onClick={() => showToast("Exporting comprehensive billing & clicks data bundle...")} className="flex items-center gap-1.5 bg-white border border-slate-205 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm cursor-pointer hover:bg-slate-50 mr-1">
            <Download size={13} className="text-slate-500"/>
            <span>Export Report</span>
          </button>

          {/* Profile bell and notification counters */}
          <button onClick={() => showToast("Already on Banners panel")} className="size-9 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 flex items-center justify-center relative transition cursor-pointer shadow-sm animate-pulse">
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
      </div>

      {/* KPI STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Card 1: Total Banners */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Total Banners</p>
              <h3 className="text-2xl font-black text-slate-950 font-mono mt-2">42</h3>
            </div>
            <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-650 flex items-center justify-center border border-indigo-100/50">
              <Share2 size={18}/>
            </div>
          </div>
          <div className="pt-3 text-[11px] font-bold text-emerald-600 font-mono flex items-center gap-1">
            <span>↑</span>
            <span>16.2% <span className="text-slate-404 text-slate-400 font-sans font-medium">vs last 30 days</span></span>
          </div>
        </div>

        {/* Card 2: Active Banners */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Active Banners</p>
              <h3 className="text-2xl font-black text-slate-950 font-mono mt-2">18</h3>
            </div>
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-650 flex items-center justify-center border border-emerald-100/50">
              <Target size={18} className="text-emerald-650 text-emerald-600"/>
            </div>
          </div>
          <div className="pt-3 text-[11px] font-bold text-emerald-600 font-mono flex items-center gap-1">
            <span>↑</span>
            <span>12.5% <span className="text-slate-400 font-sans font-medium">vs last 30 days</span></span>
          </div>
        </div>

        {/* Card 3: Total Impressions */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Total Impressions</p>
              <h3 className="text-2xl font-black text-slate-951 font-mono mt-2 text-slate-950">1,25,840</h3>
            </div>
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-650 flex items-center justify-center border border-blue-105/50">
              <Eye size={18} className="text-blue-600"/>
            </div>
          </div>
          <div className="pt-3 text-[11px] font-bold text-emerald-600 font-mono flex items-center gap-1">
            <span>↑</span>
            <span>28.6% <span className="text-slate-404 text-slate-400 font-sans font-medium">vs last 30 days</span></span>
          </div>
        </div>

        {/* Card 4: Total Clicks */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Total Clicks</p>
              <h3 className="text-2xl font-black text-slate-950 font-mono mt-2">8,542</h3>
            </div>
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-650 flex items-center justify-center border border-amber-100/50">
              <Target size={18} className="text-amber-600 animate-pulse"/>
            </div>
          </div>
          <div className="pt-3 text-[11px] font-bold text-emerald-600 font-mono flex items-center gap-1">
            <span>↑</span>
            <span>19.8% <span className="text-slate-400 font-sans font-medium">vs last 30 days</span></span>
          </div>
        </div>

        {/* Card 5: CTR (Click Through Rate) */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">CTR (Click Through Rate)</p>
              <h3 className="text-2xl font-black text-slate-955 font-mono mt-2 text-slate-950">6.78%</h3>
            </div>
            <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-650 flex items-center justify-center border border-rose-100/50">
              <TrendingUp size={18} className="text-rose-600"/>
            </div>
          </div>
          <div className="pt-3 text-[11px] font-bold text-emerald-600 font-mono flex items-center gap-1">
            <span>↑</span>
            <span>2.4% <span className="text-slate-404 text-slate-400 font-sans font-medium">vs last 30 days</span></span>
          </div>
        </div>

      </div>

      {/* FILTERS CONTAINER BLOCK */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-450 text-slate-400 uppercase tracking-tight">Date Range</label>
            <div className="relative">
              <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="appearance-none w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs py-2 px-3 pr-8 rounded-xl font-medium focus:outline-none cursor-pointer">
                <option>22 Apr 2024 - 22 May 2024</option>
                <option>Last 30 Days</option>
                <option>All Calendar Year</option>
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-405 pointer-events-none text-slate-400"/>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Banner Type</label>
            <div className="relative">
              <select value={bannerType} onChange={(e) => setBannerType(e.target.value)} className="appearance-none w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs py-2 px-3 pr-8 rounded-xl font-medium focus:outline-none cursor-pointer">
                <option value="All Types">All Types</option>
                <option value="Promotional">Promotional Only</option>
                <option value="Health Campaign">Health Campaigns</option>
                <option value="Feature Update">Feature Updates</option>
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Placement</label>
            <div className="relative">
              <select value={placement} onChange={(e) => setPlacement(e.target.value)} className="appearance-none w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs py-2 px-3 pr-8 rounded-xl font-medium focus:outline-none cursor-pointer">
                <option value="All Placements">All Placements</option>
                <option value="Home Page">Home Page Only</option>
                <option value="Dashboard">Dashboard</option>
                <option value="Appointment Page">Appointment Screen</option>
                <option value="Consultation Page">Consultation Hub</option>
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Status</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="appearance-none w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs py-2 px-3 pr-8 rounded-xl font-medium focus:outline-none cursor-pointer">
                  <option value="All Status">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Paused">Paused</option>
                  <option value="Completed">Completed</option>
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
              </div>

              <button onClick={handleClearFilters} className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">
                <RefreshCw size={12}/>
                <span>Clear Filters</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* PERFORMANCE OVERVIEW & CAMPAIGNS CREATION GRID row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Impressions & Clicks Line Graph */}
        <div className="lg:col-span-4 bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Impressions & Clicks</h3>
              <p className="text-[10pt] text-slate-400 shrink-0">Traffic performance timeline tracker</p>
            </div>

            <select className="bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-550 rounded px-1.5 focus:outline-none cursor-pointer">
              <option>Daily</option>
            </select>
          </div>

          <div className="flex items-center gap-3 text-[9px] font-bold text-slate-500 mt-2">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-indigo-650 rounded-full"/> Impressions</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"/> Clicks</span>
          </div>

          <div className="h-32 mt-4 relative flex items-end">
            <svg className="w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="none">
              <line x1="0" y1="20" x2="200" y2="20" stroke="#f8fafc" strokeWidth="1"/>
              <line x1="0" y1="45" x2="200" y2="45" stroke="#f8fafc" strokeWidth="1"/>
              <line x1="0" y1="70" x2="200" y2="70" stroke="#f8fafc" strokeWidth="1"/>
              
              {/* Impressions curve - Purple */}
              <path d="M 0,60 Q 30,30 60,40 T 120,25 T 180,48 T 200,38" fill="none" stroke="#6366f1" strokeWidth="2.2"/>
              {/* Clicks curve - Green */}
              <path d="M 0,72 Q 30,55 60,60 T 120,45 T 180,68 T 200,60" fill="none" stroke="#10b981" strokeWidth="1.8"/>
            </svg>
            <div className="absolute left-0 right-0 bottom-0 flex justify-between px-1 text-[7.5px] font-mono font-bold text-slate-400">
              <span>22 Apr</span>
              <span>02 May</span>
              <span>12 May</span>
              <span>22 May</span>
            </div>
          </div>
        </div>

        {/* Banners by Type Doughnut */}
        <div className="lg:col-span-3 bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-2.5">
            <h3 className="text-xs font-black text-slate-905 text-slate-900 uppercase">Banners by Type</h3>
          </div>

          <div className="flex items-center gap-2 py-2.5 justify-between">
            <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
              <div className="absolute text-center">
                <span className="text-[7px] font-bold text-slate-400 uppercase leading-none">Total</span>
                <p className="text-xs font-black text-slate-800 font-mono mt-0.5">42</p>
              </div>
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="31" fill="transparent" stroke="#f1f5f9" strokeWidth="6"/>
                <circle cx="40" cy="40" r="31" fill="transparent" stroke="#6366f1" strokeWidth="6" strokeDasharray="194" strokeDashoffset="70"/>
                <circle cx="40" cy="40" r="31" fill="transparent" stroke="#10b981" strokeWidth="6" strokeDasharray="194" strokeDashoffset="128"/>
                <circle cx="40" cy="40" r="31" fill="transparent" stroke="#3b82f6" strokeWidth="6" strokeDasharray="194" strokeDashoffset="158"/>
                <circle cx="40" cy="40" r="31" fill="transparent" stroke="#f97316" strokeWidth="6" strokeDasharray="194" strokeDashoffset="178"/>
              </svg>
            </div>

            <div className="space-y-0.5 text-[8.5px] font-bold text-slate-600 flex-1 leading-tight">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1 w-16 truncate"><span className="w-1 h-1 bg-indigo-500 rounded-full"/> Promotional</span>
                <span className="font-mono text-slate-900">35.7% <span className="text-slate-400 font-normal">(15)</span></span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-1 w-16 truncate"><span className="w-1 h-1 bg-emerald-500 rounded-full"/> Health Camp.</span>
                <span className="font-mono text-slate-900">28.6% <span className="text-slate-400 font-normal">(12)</span></span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-1 w-16 truncate"><span className="w-1 h-1 bg-blue-500 rounded-full"/> Feature Update</span>
                <span className="font-mono text-slate-900">19% <span className="text-slate-400 font-normal">(8)</span></span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-1 w-16 truncate"><span className="w-1 h-1 bg-orange-500 rounded-full"/> Seasonal Offers</span>
                <span className="font-mono text-slate-900">9.5% <span className="text-slate-400 font-normal">(4)</span></span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-1 w-16 truncate"><span className="w-1 h-1 bg-slate-400 rounded-full"/> Others</span>
                <span className="font-mono text-slate-900">7.2% <span className="text-slate-400 font-normal">(3)</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance by Placement horizontal chart */}
        <div className="lg:col-span-3 bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-2.5">
            <h3 className="text-xs font-black text-slate-900 uppercase">Performance by Placement</h3>
          </div>

          <div className="space-y-2 mt-2 flex-1 flex flex-col justify-center">
            
            {[
            { name: "Home Page", value: 52410, w: "w-[100%]" },
            { name: "Appointment Page", value: 28745, w: "w-[54%]" },
            { name: "Dashboard", value: 20134, w: "w-[38%]" },
            { name: "Consultation Page", value: 14892, w: "w-[28%]" },
            { name: "Others", value: 9659, w: "w-[18%]" }
        ].map((bar, idx) => (<div key={idx} className="space-y-1 text-left text-[10.5px]">
                <div className="flex justify-between font-bold text-slate-700">
                  <span className="truncate w-24">{bar.name}</span>
                  <span className="font-mono text-slate-805 text-slate-800">{(bar.value).toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className={`bg-indigo-600 h-full rounded-full ${bar.w}`}/>
                </div>
              </div>))}

          </div>
        </div>

        {/* Create Stunning Banners Indigo Advert Widget Box */}
        <div className="lg:col-span-2 bg-gradient-to-br from-indigo-700 to-indigo-900 text-white p-4 rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 opacity-15 rotate-12 z-0 shrink-0">
            <Sparkles size={110}/>
          </div>

          <div className="z-10 text-left space-y-1">
            <div className="bg-indigo-600/30 w-7 h-7 rounded-lg flex items-center justify-center shrink-0">
              <Sparkles size={14} className="text-indigo-200"/>
            </div>
            <h4 className="text-xs font-black tracking-wide leading-tight mt-1.5">Create Stunning Banners</h4>
            <p className="text-[9.5px] text-indigo-200 leading-normal font-sans">
              Engage users with attractive banners and drive more actions.
            </p>
          </div>

          <button onClick={() => showToast("Launching Banner creation form wizard widget...")} className="w-full text-indigo-900 font-extrabold bg-white hover:bg-slate-50 transition py-2 rounded-xl text-[10.5px] mt-4 flex items-center justify-center gap-1 z-10 cursor-pointer shadow">
            <Plus size={12}/>
            <span>Add New Banner</span>
          </button>
        </div>

      </div>

      {/* TABLE LIST & INTERACTIVE SMARTPHONE APP PREVIEW GRID ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Banner table logs list (col-span-9) */}
        <div className="lg:col-span-9 bg-white p-5 rounded-2xl border border-slate-205 shadow-sm flex flex-col justify-between">
          
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Banners List</h3>
          </div>

          <div className="overflow-x-auto mt-4 flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-black uppercase pb-3">
                  <th className="pb-3 pl-1 w-8">#</th>
                  <th className="pb-3">Banner Name</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Placement</th>
                  <th className="pb-3 text-center">Status</th>
                  <th className="pb-3">Schedule</th>
                  <th className="pb-3 text-right">Impressions</th>
                  <th className="pb-3 text-right">Clicks</th>
                  <th className="pb-3 text-right">CTR</th>
                  <th className="pb-3 text-center w-20">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs">
                
                {banners.map((row, idx) => {
            const isSelected = selectedBannerIdx === idx;
            return (<tr key={row.id} onClick={() => { setSelectedBannerIdx(idx); showToast(`Loaded preview for: ${row.name}`); }} className={`hover:bg-slate-50/60 cursor-pointer text-slate-705 text-slate-700 transition ${isSelected ? "bg-indigo-50/40" : ""}`}>
                      <td className="py-3.5 pl-1 font-mono font-bold text-slate-400">{row.id}</td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-3">
                          <img src={row.imageUrl} alt="" className="w-11 h-7 rounded-md object-cover border border-slate-200"/>
                          <div>
                            <p className="font-extrabold text-slate-900 leading-tight">{row.name}</p>
                            <p className="text-[10px] text-slate-400 leading-none mt-1">{row.subtitle}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black ${row.typeBadge}`}>
                          {row.type}
                        </span>
                      </td>
                      <td className="py-3.5 font-semibold text-[11px] text-slate-700">{row.placement}</td>
                      <td className="py-3.5 text-center">
                        <span className={`px-2 py-0.5 rounded-[5px] text-[10px] font-black uppercase tracking-wider font-mono ${row.statusBadge}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3.5 font-semibold text-[11px] text-slate-500 font-mono">{row.schedule}</td>
                      <td className="py-3.5 text-right font-mono font-bold text-slate-800 pr-2">{(row.impressions).toLocaleString()}</td>
                      <td className="py-3.5 text-right font-mono font-bold text-slate-805 pr-2">{(row.clicks).toLocaleString()}</td>
                      <td className="py-3.5 text-right font-mono font-bold text-slate-805 pr-2">{row.ctr}</td>
                      <td className="py-3.5">
                        <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => showToast(`Deactivating / Modifying campaign status for row #${row.id}`)} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded transition">
                            <Edit3 size={13}/>
                          </button>
                          <button onClick={() => showToast(`Deleting banner campaign #${row.id}`)} className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition">
                            <Trash2 size={13}/>
                          </button>
                        </div>
                      </td>
                    </tr>);
        })}

              </tbody>
            </table>
          </div>

          {/* Table pagination row details */}
          <div className="border-t border-slate-100 pt-3.5 mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <p className="text-slate-400 font-bold">Showing 1 to 5 of 42 entries</p>
            
            <div className="flex items-center gap-1 font-mono font-bold">
              <button onClick={() => showToast("Showing page prev...")} className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition cursor-pointer">
                <ChevronLeft size={13}/>
              </button>
              <button onClick={() => showToast("Showing page 1...")} className="px-3 py-1 bg-indigo-600 text-white rounded-lg selection:bg-indigo-700 font-sans">1</button>
              <button onClick={() => showToast("Showing page 2...")} className="px-3 py-1 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer">2</button>
              <button onClick={() => showToast("Showing page 3...")} className="px-3 py-1 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer">3</button>
              <span className="text-slate-400 px-1">...</span>
              <button onClick={() => showToast("Showing page 9...")} className="px-3 py-1 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer animate-none">9</button>
              <button onClick={() => showToast("Showing page next...")} className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition cursor-pointer">
                <ChevronRight size={13}/>
              </button>
            </div>
          </div>

        </div>

        {/* Smartphone Simulator Preview Column (col-span-3) */}
        <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="text-left border-b border-slate-100 pb-2">
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-1">
              <Smartphone size={15}/>
              Quick Preview
            </h3>
            <p className="text-[10px] text-slate-400 leading-snug">See how your banner appears on the platform (tap a row to swap preview)</p>
          </div>

          {/* Mock Smartphone Frame Container */}
          <div className="my-5 mx-auto w-64 h-[25rem] rounded-[2.5rem] border-[7px] border-slate-800 shadow-xl overflow-hidden bg-white relative flex flex-col justify-between select-none">
            {/* Camera dot notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-4 bg-slate-800 rounded-full z-30 flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-slate-900 rounded-full mr-2"/>
              <span className="w-1.5 h-0.5 bg-slate-900 rounded-lg"/>
            </div>

            {/* Simulated Phone UI Header */}
            <div className="bg-slate-90 bg-slate-100 pt-8 pb-2 px-4 shadow-sm border-b border-slate-105 flex justify-between items-center z-20">
              <div className="flex items-center gap-1">
                <div className="bg-indigo-600 text-white p-0.5 rounded-md font-sans text-[7.5px] font-black">EC</div>
                <span className="text-[10px] font-black text-slate-900 tracking-tight">EliteCare</span>
              </div>
              <div className="flex items-center gap-1 text-[8.5px] font-bold text-slate-500">
                <Eye size={10}/>
                <span className="font-mono text-[7px]">Prew.</span>
              </div>
            </div>

            {/* Phone Screen body */}
            <div className="flex-1 bg-slate-50/60 p-3 space-y-3 mt-1.5">
              
              {/* Target Banner Inside Simulator */}
              <div className="bg-white rounded-xl border border-slate-150 overflow-hidden shadow-sm flex flex-col justify-between text-left h-[10.5rem] relative group">
                <img src={activePreview.imageUrl} alt="" className="w-full h-20 object-cover border-b border-slate-100 shrink-0"/>
                
                <div className="p-2.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[7.5px] tracking-wide uppercase font-black bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100">
                      {activePreview.type}
                    </span>
                    <p className="font-extrabold text-[11px] text-slate-900 leading-tight truncate mt-1">
                      {activePreview.primaryText}
                    </p>
                    <p className="text-[9px] text-slate-400 leading-none truncate font-sans">
                      {activePreview.secondaryText}
                    </p>
                  </div>

                  <button onClick={() => showToast(`Preview Banner clicked inside phone: ${activePreview.name}`)} className="w-full bg-slate-900 text-white font-black text-[9px] text-center py-1.5 rounded-lg border border-slate-900 hover:bg-slate-800 transition shadow-inner select-none cursor-pointer mt-1">
                    {activePreview.btnText}
                  </button>
                </div>
              </div>

              {/* Grid of beautiful quick navigation buttons inside emulator */}
              <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-black">
                <div className="bg-white border border-slate-150 p-2 rounded-xl flex flex-col items-center justify-center gap-1 shadow-sm">
                  <div className="p-1 bg-indigo-50 text-indigo-650 rounded-lg shrink-0">
                    <BookOpen size={11} className="text-indigo-600"/>
                  </div>
                  <span className="text-[8.5px] text-indigo-950 font-black leading-none truncate w-full">Book Appt</span>
                </div>

                <div className="bg-white border border-slate-150 p-2 rounded-xl flex flex-col items-center justify-center gap-1 shadow-sm">
                  <div className="p-1 bg-emerald-50 text-emerald-650 rounded-lg shrink-0">
                    <UserCheck size={11} className="text-emerald-600"/>
                  </div>
                  <span className="text-[8.5px] text-emerald-950 font-black leading-none truncate w-full">Consult Doc</span>
                </div>

                <div className="bg-white border border-slate-150 p-2 rounded-xl flex flex-col items-center justify-center gap-1 shadow-sm">
                  <div className="p-1 bg-amber-50 text-amber-650 rounded-lg shrink-0">
                    <Package size={11} className="text-amber-650 text-amber-600"/>
                  </div>
                  <span className="text-[8.5px] text-amber-950 font-black leading-none truncate w-full">Health Pack</span>
                </div>

                <div className="bg-white border border-slate-150 p-2 rounded-xl flex flex-col items-center justify-center gap-1 shadow-sm">
                  <div className="p-1 bg-blue-50 text-blue-650 rounded-lg shrink-0">
                    <FileSpreadsheet size={11} className="text-blue-600"/>
                  </div>
                  <span className="text-[8.5px] text-blue-950 font-black leading-none truncate w-full">My Reports</span>
                </div>
              </div>

            </div>

            {/* Smartphone screen bottom indicator bar */}
            <div className="bg-white pb-2 pt-0.5 flex justify-center items-center z-20">
              <span className="w-18 h-1 bg-slate-350 bg-slate-300 rounded-full"/>
            </div>

          </div>

          <button onClick={() => showToast("Opening custom banner design wizard module...")} className="w-full text-indigo-655 font-bold hover:text-indigo-850 hover:underline text-xs text-center border-t border-slate-150 pt-2.5 block cursor-pointer">
            How it works &rarr;
          </button>
        </div>

      </div>

      {/* Info indicator Footer Stripe */}
      <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-start gap-3">
        <div className="p-1.5 bg-slate-205 bg-slate-200/60 rounded-lg text-slate-550 shrink-0 mt-0.5">
          <AlertCircle size={15} className="text-slate-500"/>
        </div>
        <div className="text-left py-0.5 select-none text-[11px] text-slate-550 text-slate-500 font-sans leading-normal">
          Banners & Ads help you promote campaigns, offers and updates to users across the platform. Track performance and optimize for better engagement.
        </div>
      </div>

    </div>);
}
