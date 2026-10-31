import React, { useState } from "react";
import { Users, Eye, User, Clock, CornerDownRight, Zap, SlidersHorizontal, ChevronDown, RefreshCw, Globe, Monitor, Smartphone, Tablet, CalendarDays, FileSpreadsheet } from "lucide-react";
export default function VTSPanel({ showToast }) {
    const [selectedRange, setSelectedRange] = useState("22 Apr 2024 - 22 May 2024");
    const [selectedSegment, setSelectedSegment] = useState("All Users");
    const [selectedDevice, setSelectedDevice] = useState("All Devices");
    const [selectedCountry, setSelectedCountry] = useState("All Countries");
    const [selectedSource, setSelectedSource] = useState("All Sources");
    const [activeTrendPoint, setActiveTrendPoint] = useState(null);
    // Statistics Header Row
    const stats = [
        { label: "Total Visitors", value: "45,231", icon: Users, color: "text-blue-600 bg-blue-50 border-blue-100", trend: "↑ 18.6%", isPositive: true },
        { label: "Page Views", value: "1,25,984", icon: Eye, color: "text-emerald-600 bg-emerald-50 border-emerald-100", trend: "↑ 20.4%", isPositive: true },
        { label: "Sessions", value: "78,542", icon: User, color: "text-amber-600 bg-amber-50 border-amber-100", trend: "↑ 16.2%", isPositive: true },
        { label: "Avg. Session Duration", value: "04:32 mins", icon: Clock, color: "text-cyan-600 bg-cyan-50 border-cyan-100", trend: "↑ 16.2%", isPositive: true },
        { label: "Bounce Rate", value: "28.45%", icon: CornerDownRight, color: "text-rose-600 bg-rose-50 border-rose-100", trend: "↓ 3.6%", isPositive: true }, // bounce going down is positive
        { label: "Events", value: "3,45,678", icon: Zap, color: "text-indigo-600 bg-indigo-50 border-indigo-100", trend: "↑ 25.1%", isPositive: true }
    ];
    // Landing pages
    const landingPages = [
        { rank: 1, path: "/", visitors: "18,254", percentage: "40.3%", stroke: "M0 10 Q10 2, 20 8 T40 4 T60 9" },
        { rank: 2, path: "/find-doctors", visitors: "12,365", percentage: "27.3%", stroke: "M0 8 Q10 9, 20 5 T40 7 T60 2" },
        { rank: 3, path: "/book-appointment", visitors: "8,521", percentage: "18.8%", stroke: "M0 12 Q10 6, 20 9 T40 3 T60 6" },
        { rank: 4, path: "/symptom-checker", visitors: "3,254", percentage: "7.2%", stroke: "M0 5 Q10 4, 20 7 T40 5 T60 10" },
        { rank: 5, path: "/health-tools", visitors: "1,892", percentage: "4.2%", stroke: "M0 11 Q10 8, 20 10 T40 9 T60 7" },
        { rank: 6, path: "/login", visitors: "945", percentage: "2.2%", stroke: "M0 9 Q10 11, 20 8 T40 9 T60 10" }
    ];
    // Exit pages
    const exitPages = [
        { rank: 1, path: "/book-appointment", exits: "6,521", percentage: "24.6%", stroke: "M0 7 Q10 4, 20 8 T40 5 T60 9" },
        { rank: 2, path: "/symptom-checker", exits: "4,852", percentage: "18.3%", stroke: "M0 10 Q10 8, 20 9 T40 4 T60 3" },
        { rank: 3, path: "/find-doctors", exits: "4,125", percentage: "15.6%", stroke: "M0 8 Q10 9, 20 7 T40 9 T60 5" },
        { rank: 4, path: "/health-tools", exits: "3,254", percentage: "12.3%", stroke: "M0 12 Q10 5, 20 9 T40 6 T60 10" },
        { rank: 5, path: "/doctor-profile", exits: "2,745", percentage: "10.4%", stroke: "M0 6 Q10 9, 20 6 T40 8 T60 7" },
        { rank: 6, path: "/", exits: "1,892", percentage: "7.1%", stroke: "M0 11 Q10 4, 20 8 T40 4 T60 5" }
    ];
    // Sources Pie Donut mock representation
    const sources = [
        { label: "Direct / None", percentage: "35.6%", count: "16,112", color: "bg-blue-600" },
        { label: "Organic Search", percentage: "28.3%", count: "12,803", color: "bg-[#047857]" },
        { label: "Referral", percentage: "16.7%", count: "7,548", color: "bg-cyan-500" },
        { label: "Social Media", percentage: "10.2%", count: "4,618", color: "bg-amber-500" },
        { label: "Email", percentage: "5.2%", count: "2,350", color: "bg-purple-500" },
        { label: "Others", percentage: "4.0%", count: "1,800", color: "bg-slate-400" }
    ];
    // Country listing
    const countries = [
        { name: "India", percentage: "32.6%", count: "14,745", code: "IN", flag: "🇮🇳" },
        { name: "United States", percentage: "18.4%", count: "8,317", code: "US", flag: "🇺🇸" },
        { name: "United Kingdom", percentage: "7.6%", count: "3,438", code: "GB", flag: "🇬🇧" },
        { name: "Canada", percentage: "5.3%", count: "2,396", code: "CA", flag: "🇨🇦" },
        { name: "Australia", percentage: "4.1%", count: "1,855", code: "AU", flag: "🇦🇺" },
        { name: "Others", percentage: "31.9%", count: "14,480", code: "--", flag: "🗺️" }
    ];
    // Trend data mapping
    const trendData = [
        { day: "22 Apr", visitors: 1100, sessions: 600, views: 1800 },
        { day: "27 Apr", visitors: 2200, sessions: 1300, views: 3200 },
        { day: "02 May", visitors: 1700, sessions: 900, views: 2400 },
        { day: "07 May", visitors: 2100, sessions: 1150, views: 2900 },
        { day: "12 May", visitors: 1400, sessions: 750, views: 2100 },
        { day: "17 May", visitors: 1850, sessions: 1000, views: 2750 },
        { day: "22 May", visitors: 1600, sessions: 850, views: 2500 },
    ];
    return (<div className="space-y-6 text-left" id="vts-main-panel">
      
      {/* Upper Filters row */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5 flex-1">
          {/* Date range picker input simulation */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Date Range</label>
            <div className="relative cursor-pointer" onClick={() => showToast("Opening custom calendar date range editor...")}>
              <select className="appearance-none w-full bg-slate-50 border border-slate-200/70 text-slate-700 text-xs py-2 px-3 pr-8 rounded-xl font-medium focus:outline-none cursor-pointer">
                <option>{selectedRange}</option>
              </select>
              <CalendarDays size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
            </div>
          </div>

          {/* Segment dropdown */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Segment</label>
            <div className="relative">
              <select value={selectedSegment} onChange={(e) => {
            setSelectedSegment(e.target.value);
            showToast(`Visitor Segment filter updated to: ${e.target.value}`);
        }} className="appearance-none w-full bg-slate-50 border border-slate-200/70 text-slate-700 text-xs py-2 px-3 pr-8 rounded-xl font-medium focus:outline-none cursor-pointer">
                <option value="All Users">All Users</option>
                <option value="New Members">New Members</option>
                <option value="Registered Patients">Registered Patients</option>
                <option value="Clinicians">Clinicians</option>
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
            </div>
          </div>

          {/* Device filter dropdown */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Device</label>
            <div className="relative">
              <select value={selectedDevice} onChange={(e) => {
            setSelectedDevice(e.target.value);
            showToast(`Device segment filter updated to: ${e.target.value}`);
        }} className="appearance-none w-full bg-slate-50 border border-slate-200/70 text-slate-700 text-xs py-2 px-3 pr-8 rounded-xl font-medium focus:outline-none cursor-pointer">
                <option value="All Devices">All Devices</option>
                <option value="Mobile Only">Mobile Only</option>
                <option value="Desktop Only">Desktop Only</option>
                <option value="Tablet Only">Tablet Only</option>
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
            </div>
          </div>

          {/* Country filter dropdown */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Country</label>
            <div className="relative">
              <select value={selectedCountry} onChange={(e) => {
            setSelectedCountry(e.target.value);
            showToast(`Regional country stream selected: ${e.target.value}`);
        }} className="appearance-none w-full bg-slate-50 border border-slate-200/70 text-slate-700 text-xs py-2 px-3 pr-8 rounded-xl font-medium focus:outline-none cursor-pointer">
                <option value="All Countries">All Countries</option>
                <option value="India">India (IN)</option>
                <option value="United States">United States (US)</option>
                <option value="United Kingdom">United Kingdom (GB)</option>
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
            </div>
          </div>

          {/* Source / Medium filter dropdown */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Source / Medium</label>
            <div className="relative">
              <select value={selectedSource} onChange={(e) => {
            setSelectedSource(e.target.value);
            showToast(`Acquisition source filter updated to: ${e.target.value}`);
        }} className="appearance-none w-full bg-slate-50 border border-slate-200/70 text-slate-700 text-xs py-2 px-3 pr-8 rounded-xl font-medium focus:outline-none cursor-pointer">
                <option value="All Sources">All Sources</option>
                <option value="Direct / None">Direct / None</option>
                <option value="Organic Search">Organic Search</option>
                <option value="Referral Link">Referral Link</option>
                <option value="Social Networks">Social Networks</option>
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
            </div>
          </div>
        </div>

        {/* More Filters button action */}
        <div className="flex gap-2 self-end">
          <button onClick={() => showToast("Additional advanced segment filters modal loaded.")} className="px-3.5 py-2 hover:bg-slate-50 text-xs text-slate-600 font-bold border border-slate-200 rounded-xl flex items-center gap-1.5 transition cursor-pointer">
            <SlidersHorizontal size={13} className="text-slate-500"/>
            <span>More Filters</span>
          </button>

          <button onClick={() => showToast("Exporting comprehensive VTS CSV audit ledger...")} className="px-3.5 py-2 hover:bg-slate-50 text-xs text-slate-600 font-bold border border-slate-200 rounded-xl flex items-center gap-1.5 transition cursor-pointer">
            <FileSpreadsheet size={13} className="text-emerald-600"/>
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards (6 column grid system) */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (<div key={i} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow transition duration-150 relative overflow-hidden group">
              <div className="space-y-1">
                <div className="flex justify-between items-start">
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-tight leading-none">{stat.label}</p>
                  <div className={`p-1.5 rounded-lg border ${stat.color} absolute right-3 top-3`}>
                    <Icon size={14}/>
                  </div>
                </div>
                <p className="text-xl font-black text-slate-900 font-mono pt-3">{stat.value}</p>
              </div>
              <div className="flex items-center gap-1 pt-2">
                <span className="text-[10px] font-bold text-emerald-600 font-mono">{stat.trend}</span>
                <span className="text-[9px] text-slate-400 font-medium">vs last 30 days</span>
              </div>
            </div>);
        })}
      </div>

      {/* Row 2: Visitor Trend vs Source Donut vs Country List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Visitors Trend Line Chart */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Visitor Trend</h3>
              <p className="text-[10px] text-slate-450 text-slate-400 font-medium">Overview of platforms traffic trajectory</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex gap-2 text-[10px] font-bold text-slate-500">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#10b981]"></span> Visitors</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-600"></span> Sessions</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Page Views</span>
              </div>

              <select onClick={() => showToast("Interval filtered successfully.")} className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg px-2.5 py-1 text-slate-600 focus:outline-none cursor-pointer">
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
          </div>

          {/* SVG Custom Interactive Line Chart */}
          <div className="h-48 w-full mt-4 relative flex items-end">
            <svg className="w-full h-full" viewBox="0 0 500 150" preserveAspectRatio="none">
              <defs>
                <linearGradient id="visitorsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.15"/>
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0"/>
                </linearGradient>
                <linearGradient id="sessionsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.15"/>
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0"/>
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="10" y1="20" x2="490" y2="20" stroke="#f1f5f9" strokeDasharray="3,3"/>
              <line x1="10" y1="60" x2="490" y2="60" stroke="#f1f5f9" strokeDasharray="3,3"/>
              <line x1="10" y1="100" x2="490" y2="100" stroke="#f1f5f9" strokeDasharray="3,3"/>
              <line x1="10" y1="130" x2="490" y2="130" stroke="#e2e8f0"/>

              {/* Area Shading */}
              <path d="M 20,110 L 100,50 L 180,95 L 260,65 L 340,115 L 420,80 L 480,105 L 480,130 L 20,130 Z" fill="url(#visitorsGrad)"/>
              <path d="M 20,130 L 100,100 L 180,120 L 260,110 L 340,125 L 420,115 L 480,122 L 480,130 L 20,130 Z" fill="url(#sessionsGrad)"/>

              {/* Visitors Curve (Green) */}
              <path d="M 20,110 Q 100,20 180,95 T 340,115 T 480,105" fill="none" stroke="#10b981" strokeWidth="2"/>

              {/* Sessions Curve (Blue) */}
              <path d="M 20,130 Q 100,90 180,120 T 340,125 T 480,122" fill="none" stroke="#2563eb" strokeWidth="2"/>

              {/* Page Views Curve (Purple) */}
              <path d="M 20,90 Q 100,40 180,75 T 340,95 T 480,82" fill="none" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4,4"/>

              {/* Interactive Dots */}
              {trendData.map((d, index) => {
            const x = 20 + index * 75;
            const isHovered = activeTrendPoint === index;
            return (<g key={index} className="cursor-pointer" onMouseEnter={() => setActiveTrendPoint(index)} onMouseLeave={() => setActiveTrendPoint(null)}>
                    <circle cx={x} cy={110 - (d.visitors - 1000) / 10} r={isHovered ? 5 : 3.5} fill="#10b981" stroke="#ffffff" strokeWidth="1.5"/>
                    <circle cx={x} cy={130 - (d.sessions - 60) / 10} r={isHovered ? 5 : 3.5} fill="#2563eb" stroke="#ffffff" strokeWidth="1.5"/>
                  </g>);
        })}
            </svg>

            {/* Custom Interactive Tooltip box */}
            {activeTrendPoint !== null && (<div className="absolute bg-slate-900 text-white rounded-xl p-3 shadow-lg text-[10px] space-y-1 border border-slate-700 pointer-events-none" style={{ left: `${30 + activeTrendPoint * 60}px`, bottom: "75px" }}>
                <p className="font-extrabold text-slate-350">{trendData[activeTrendPoint].day} Metrics</p>
                <div className="flex gap-2.5 font-mono">
                  <span className="text-emerald-400">Visitors: {trendData[activeTrendPoint].visitors}</span>
                  <span className="text-blue-400">Sessions: {trendData[activeTrendPoint].sessions}</span>
                  <span className="text-purple-400">Views: {trendData[activeTrendPoint].views}</span>
                </div>
              </div>)}
            
            {/* Days markers labels under SVG */}
            <div className="absolute left-0 right-0 bottom-0 flex justify-between px-3 text-[9px] text-slate-400 font-bold font-mono">
              <span>22 Apr</span>
              <span>27 Apr</span>
              <span>02 May</span>
              <span>07 May</span>
              <span>12 May</span>
              <span>17 May</span>
              <span>22 May</span>
            </div>
          </div>
        </div>

        {/* Visitors by Source / Medium */}
        <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Visitors by Source / Medium</h3>
            <p className="text-[10px] text-slate-400 font-medium">Acquisition channel breakdown metrics</p>
          </div>

          <div className="flex flex-col items-center justify-center py-3">
            {/* Donut Chart representation */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* Central text */}
              <div className="absolute text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Total</p>
                <p className="text-lg font-black text-slate-900 font-mono mt-1">45,231</p>
              </div>
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="50" fill="transparent" stroke="#e2e8f0" strokeWidth="12"/>
                {/* Simulated segments stacked with exact visual percent */}
                <circle cx="64" cy="64" r="50" fill="transparent" stroke="#2563eb" strokeWidth="12" strokeDasharray="314" strokeDashoffset="111"/>
                <circle cx="64" cy="64" r="50" fill="transparent" stroke="#047857" strokeWidth="12" strokeDasharray="314" strokeDashoffset="200"/>
                <circle cx="64" cy="64" r="50" fill="transparent" stroke="#06b6d4" strokeWidth="12" strokeDasharray="314" strokeDashoffset="253"/>
                <circle cx="64" cy="64" r="50" fill="transparent" stroke="#f59e0b" strokeWidth="12" strokeDasharray="314" strokeDashoffset="284"/>
                <circle cx="64" cy="64" r="50" fill="transparent" stroke="#a855f7" strokeWidth="12" strokeDasharray="314" strokeDashoffset="300"/>
              </svg>
            </div>
          </div>

          {/* List distribution detail columns */}
          <div className="space-y-1.5 pt-1.5">
            {sources.map((src, i) => (<div key={i} className="flex justify-between items-center text-[11px]">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${src.color}`}/>
                  <span className="text-slate-600 font-bold text-[10px]">{src.label}</span>
                </div>
                <div className="flex gap-2 font-mono text-slate-500 text-[10px]">
                  <span className="font-extrabold text-slate-700">{src.percentage}</span>
                  <span>({src.count})</span>
                </div>
              </div>))}
          </div>
        </div>

        {/* Visitors by Country */}
        <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Visitors by Country</h3>
            <p className="text-[10px] text-slate-400 font-medium">Demographics geographical footprint</p>
          </div>

          {/* Map layout element mock */}
          <div className="h-28 w-full bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 relative overflow-hidden my-2.5">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:12px_12px]"/>
            <Globe size={40} className="text-indigo-200 animate-pulse"/>
            <div className="absolute text-[10px] font-bold text-slate-400 bg-white/90 border border-slate-100 rounded-md px-2 py-0.5 shadow-sm">
              Global Stream Map Live
            </div>
          </div>

          {/* Country detailed list */}
          <div className="space-y-2">
            {countries.map((c, i) => (<div key={i} className="flex justify-between items-center text-[11px] border-b border-slate-50 pb-1 last:border-0 last:pb-0">
                <div className="flex items-center gap-2">
                  <span>{c.flag}</span>
                  <span className="text-slate-700 font-bold text-[10px]">{c.name}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono">
                  <span className="font-black text-slate-800">{c.percentage}</span>
                  <span className="text-slate-400">({c.count})</span>
                </div>
              </div>))}
          </div>
        </div>

      </div>

      {/* Row 3: Top Landing Pages vs Top Exit Pages vs Real-time map list metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Top Landing Pages */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Top Landing Pages</h3>
            <p className="text-[10px] text-slate-400 font-medium font-sans">Platforms primary entry path traffic score</p>
          </div>

          <div className="flex-1 overflow-x-auto min-h-[280px]">
            <table className="w-full text-left font-sans">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] text-slate-400 uppercase font-black">
                  <th className="pb-2 w-8">#</th>
                  <th className="pb-2">Landing Page</th>
                  <th className="pb-2 text-right">Visitors</th>
                  <th className="pb-2 text-right">% Visitors</th>
                  <th className="pb-2 text-center w-16">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {landingPages.map((page, index) => (<tr key={index} className="text-xs text-slate-700 font-medium hover:bg-slate-50/50">
                    <td className="py-2.5 font-bold text-slate-400 font-mono">{page.rank}</td>
                    <td className="py-2.5 font-mono text-indigo-600 truncate max-w-[120px]">{page.path}</td>
                    <td className="py-2.5 text-right font-bold text-slate-800 font-mono">{page.visitors}</td>
                    <td className="py-2.5 text-right text-slate-500 font-mono">{page.percentage}</td>
                    <td className="py-2.5 text-center">
                      <svg className="w-10 h-4 mx-auto" viewBox="0 0 60 15">
                        <path d={page.stroke} fill="none" stroke="#10b981" strokeWidth="1.5"/>
                      </svg>
                    </td>
                  </tr>))}
              </tbody>
            </table>
          </div>

          <button onClick={() => showToast("Loading full listing of landing pages analytics...")} className="w-full text-center text-xs font-bold text-indigo-600 hover:text-indigo-800 transition py-2 border-t border-slate-100 mt-2 block">
            View All Pages &rarr;
          </button>
        </div>

        {/* Top Exit Pages */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Top Exit Pages</h3>
            <p className="text-[10px] text-slate-400 font-medium font-sans">Platforms primary abandonment coordinate index</p>
          </div>

          <div className="flex-1 overflow-x-auto min-h-[280px]">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] text-slate-400 uppercase font-extrabold">
                  <th className="pb-2 w-8">#</th>
                  <th className="pb-2">Exit Page</th>
                  <th className="pb-2 text-right">Exits</th>
                  <th className="pb-2 text-right">% Exits</th>
                  <th className="pb-2 text-center w-16">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {exitPages.map((page, index) => (<tr key={index} className="text-xs text-slate-700 font-medium hover:bg-slate-50/50">
                    <td className="py-2.5 font-bold text-slate-400 font-mono">{page.rank}</td>
                    <td className="py-2.5 font-mono text-purple-600 truncate max-w-[120px]">{page.path}</td>
                    <td className="py-2.5 text-right font-bold text-slate-800 font-mono">{page.exits}</td>
                    <td className="py-2.5 text-right text-slate-500 font-mono">{page.percentage}</td>
                    <td className="py-2.5 text-center">
                      <svg className="w-10 h-4 mx-auto" viewBox="0 0 60 15">
                        <path d={page.stroke} fill="none" stroke="#ef4444" strokeWidth="1.5"/>
                      </svg>
                    </td>
                  </tr>))}
              </tbody>
            </table>
          </div>

          <button onClick={() => showToast("Loading full listing of exit point parameters...")} className="w-full text-center text-xs font-bold text-purple-600 hover:text-purple-800 transition py-2 border-t border-slate-100 mt-2 block">
            View All Pages &rarr;
          </button>
        </div>

        {/* Real-time active users summary */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Real-time Visitors</h3>
              <p className="text-[10px] text-slate-400 font-medium">Real-time user session density parameters</p>
            </div>
            <button onClick={() => showToast("Opening interactive user session visual tracking center...")} className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 transition">
              <span>View Live Map</span>
              <span className="text-lg leading-none">&rarr;</span>
            </button>
          </div>

          {/* Real-time Indicator numbers */}
          <div className="flex items-center gap-4 py-2 bg-emerald-50/40 p-4 rounded-xl border border-emerald-100/30">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            <div className="space-y-0.5">
              <span className="text-3xl font-black font-mono text-slate-850">126</span>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Active Users on Site</p>
            </div>
          </div>

          {/* Device Breakdown stats percentage rows */}
          <div className="grid grid-cols-3 gap-2 text-center">
            
            <div className="p-2.5 border border-slate-100 bg-slate-50 rounded-xl space-y-1">
              <Monitor size={14} className="mx-auto text-blue-600"/>
              <p className="text-[9px] text-slate-400 uppercase font-bold leading-none pt-1">Desktop</p>
              <p className="text-xs font-mono font-black text-slate-800">56 <span className="text-[9px] text-slate-400 font-medium">(44.4%)</span></p>
            </div>

            <div className="p-2.5 border border-slate-100 bg-slate-50 rounded-xl space-y-1">
              <Smartphone size={14} className="mx-auto text-[#047857]"/>
              <p className="text-[9px] text-slate-400 uppercase font-bold leading-none pt-1">Mobile</p>
              <p className="text-xs font-mono font-black text-slate-800">62 <span className="text-[9px] text-slate-400 font-medium">(49.2%)</span></p>
            </div>

            <div className="p-2.5 border border-slate-100 bg-slate-50 rounded-xl space-y-1">
              <Tablet size={14} className="mx-auto text-amber-500"/>
              <p className="text-[9px] text-slate-400 uppercase font-bold leading-none pt-1">Tablet</p>
              <p className="text-xs font-mono font-black text-slate-800">8 <span className="text-[9px] text-slate-400 font-medium">(6.3%)</span></p>
            </div>

          </div>

          {/* Bottom live page listing */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <p className="text-[10px] font-bold text-slate-450 text-slate-400 uppercase tracking-tight">Top Active Pages</p>
            
            <div className="space-y-1.5 max-h-[145px] overflow-y-auto">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-slate-600 text-[11px] truncate max-w-[170px] font-semibold">/</span>
                <span className="font-mono text-slate-805 bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-bold">32 active</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-slate-600 text-[11px] truncate max-w-[170px] font-semibold">/find-doctors</span>
                <span className="font-mono text-slate-805 bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-bold">28 active</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-slate-600 text-[11px] truncate max-w-[170px] font-semibold">/book-appointment</span>
                <span className="font-mono text-slate-805 bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-bold">18 active</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-slate-600 text-[11px] truncate max-w-[170px] font-semibold">/symptom-checker</span>
                <span className="font-mono text-slate-805 bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-bold">15 active</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Info notice banner */}
      <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"/>
          <p className="font-sans">
            <strong>VTS (Visitor Tracking System)</strong> helps you track user behavior in real-time including page views, clicks, scrolls, and user journey across the platform.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold font-mono">
          <RefreshCw size={11} className="text-slate-400 rotate-0 animate-spin"/>
          <span>Data is updated every 5 minutes</span>
        </div>
      </div>

    </div>);
}
