import React, { useState } from "react";
import { Users, CalendarDays, Video, DollarSign, TrendingUp, Star, Download, ChevronDown, Clock, Heart, Smartphone } from "lucide-react";
export default function AnalyticsPanel({ showToast }) {
    const [activeDateRange, setActiveDateRange] = useState("22 Apr 2024 - 22 May 2024");
    const [activeTrendSegment, setActiveTrendSegment] = useState(null);
    // Statistics KPIs (Row of 6 cards with miniature line graphs)
    const stats = [
        { label: "Total Patients", value: "10,000+", icon: Users, trend: "↑ 12.3% vs last 30 days", text: "text-emerald-700 font-sans", iconBg: "bg-emerald-50 text-emerald-600", stroke: "M0 12 Q10 2, 20 8 T40 5 T60 9" },
        { label: "Total Appointments", value: "1,240", icon: CalendarDays, trend: "↑ 8.7% vs last 30 days", text: "text-blue-700 font-sans", iconBg: "bg-blue-50 text-blue-600", stroke: "M0 10 Q10 11, 20 4 T40 7 T65 3" },
        { label: "Consultations", value: "820", icon: Video, trend: "↑ 9.5% vs last 30 days", text: "text-purple-700 font-sans", iconBg: "bg-purple-50 text-purple-600", stroke: "M0 14 Q10 6, 20 9 T40 4 T60 6" },
        { label: "Revenue", value: "₹35,00,000", icon: DollarSign, trend: "↑ 15.2% vs last 30 days", text: "text-amber-700 font-sans", iconBg: "bg-amber-50 text-amber-600", stroke: "M0 6 Q10 4, 20 8 T40 5 T60 11" },
        { label: "Conversion Rate", value: "18.0%", icon: TrendingUp, trend: "↑ 2.8% vs last 30 days", text: "text-indigo-700 font-sans", iconBg: "bg-indigo-50 text-indigo-100/50 text-indigo-700", stroke: "M0 11 Q10 8, 20 10 T40 9 T60 7" },
        { label: "Avg. Rating", value: "4.7 / 5", icon: Star, trend: "↑ 0.3 vs last 30 days", text: "text-rose-700 font-sans", iconBg: "bg-rose-50 text-rose-500", stroke: "M0 9 Q10 11, 20 8 T40 10 T60 12" }
    ];
    // Top Performing Doctors list
    const doctors = [
        { name: "Dr. Amit Verma", specialty: "Orthopedic", count: "150+", rating: "4.9", img: "https://i.pravatar.cc/100?u=doc1" },
        { name: "Dr. Priya Sharma", specialty: "Dermatologist", count: "120+", rating: "4.8", img: "https://i.pravatar.cc/100?u=doc2" },
        { name: "Dr. Rohit Patel", specialty: "Pediatrician", count: "110+", rating: "4.9", img: "https://i.pravatar.cc/100?u=doc3" },
        { name: "Dr. Neha Kapoor", specialty: "Gynecologist", count: "105+", rating: "4.7", img: "https://i.pravatar.cc/100?u=doc4" },
        { name: "Dr. Vivek Mehta", specialty: "Cardiologist", count: "95+", rating: "4.6", img: "https://i.pravatar.cc/100?u=doc5" }
    ];
    // Hours Weekly Grid Analysis
    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const hourHeaders = ["12 AM", "4 AM", "8 AM", "12 PM", "4 PM", "8 PM"];
    // Heat map color grades matching user hour intensity density
    const gridCells = [
        // Mon
        [1, 2, 4, 5, 5, 3],
        // Tue
        [1, 1, 3, 5, 4, 3],
        // Wed
        [2, 2, 4, 4, 5, 4],
        // Thu
        [1, 1, 4, 5, 4, 2],
        // Fri
        [2, 2, 5, 5, 5, 4],
        // Sat
        [1, 1, 3, 4, 4, 3],
        // Sun
        [1, 1, 2, 3, 3, 2]
    ];
    return (<div className="space-y-6 text-left" id="analytics-main-panel">
      
      {/* Date Filter Selection Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 flex-1">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Date Range Filter</label>
            <div className="relative">
              <select className="appearance-none w-full bg-slate-50 border border-slate-200/70 text-slate-700 text-xs py-2 px-3 pr-8 rounded-xl font-medium focus:outline-none cursor-pointer">
                <option>{activeDateRange}</option>
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={() => showToast("Opening custom reports analytics filters panel...")} className="px-3.5 py-2 hover:bg-slate-50 text-[11px] text-slate-600 font-bold border border-slate-200 rounded-xl flex items-center gap-1.5 transition cursor-pointer">
            <span>Filters</span>
          </button>
          
          <button onClick={() => showToast("Downloading comprehensive analytics ledger package...")} className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-[11px] text-white font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer">
            <Download size={13}/>
            <span>Export Report</span>
          </button>
        </div>

      </div>

      {/* Row of 6 sleek stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {stats.map((s, idx) => {
            const Icon = s.icon;
            return (<div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200/85 shadow-sm flex flex-col justify-between hover:shadow transition relative overflow-hidden group">
              <div className="space-y-1">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-tight leading-none truncate max-w-[100px]">{s.label}</span>
                  <div className={`p-1.5 rounded-lg border border-transparent absolute right-3 top-3 ${s.iconBg}`}>
                    <Icon size={13}/>
                  </div>
                </div>
                <p className="text-xl font-black text-slate-950 font-mono pt-3">{s.value}</p>
              </div>

              {/* Sparkling Visual mini-graph line */}
              <div className="h-6 w-full mt-2 relative">
                <svg className="w-full h-full" viewBox="0 0 60 15">
                  <path d={s.stroke} fill="none" stroke="#22c55e" strokeWidth="1.5"/>
                </svg>
              </div>

              <div className="pt-2 text-[9px] font-bold text-emerald-600 font-mono">
                {s.trend}
              </div>
            </div>);
        })}
      </div>

      {/* Row 2: Patient Trend graph vs Dept Pie vs Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fade-in">
        
        {/* Patient Trend Line Chart */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Patient Trend</h3>
              <p className="text-[10px] text-slate-400 font-medium font-sans">Platforms comparative medical trajectory</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex gap-2 text-[10px] font-bold text-slate-500">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#10b981]"></span> New Patients</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-600"></span> Returning Patients</span>
              </div>

              <select className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg px-2.5 py-1 text-slate-600 cursor-pointer">
                <option>This Month</option>
                <option>Weekly</option>
                <option>Yearly</option>
              </select>
            </div>
          </div>

          <div className="h-44 w-full mt-4 relative flex items-end">
            <svg className="w-full h-full" viewBox="0 0 500 130" preserveAspectRatio="none">
              <line x1="10" y1="20" x2="490" y2="20" stroke="#f1f5f9" strokeDasharray="3,3"/>
              <line x1="10" y1="65" x2="490" y2="65" stroke="#f1f5f9" strokeDasharray="3,3"/>
              <line x1="10" y1="110" x2="490" y2="110" stroke="#f1f5f9" strokeDasharray="3,3"/>
              
              {/* Curve 1 (New Patients - Green) */}
              <path d="M 20,105 Q 100,20 180,95 T 340,105 T 480,95" fill="none" stroke="#10b981" strokeWidth="2"/>
              {/* Curve 2 (Returning Patients - Blue) */}
              <path d="M 20,120 Q 100,50 180,110 T 340,115 T 480,105" fill="none" stroke="#2563eb" strokeWidth="1.8"/>
            </svg>

            {/* Bottom dynamic days markers labels */}
            <div className="absolute left-0 right-0 bottom-0 flex justify-between px-3 text-[9px] text-slate-400 font-bold font-mono">
              <span>22 Apr</span>
              <span>28 Apr</span>
              <span>04 May</span>
              <span>10 May</span>
              <span>16 May</span>
              <span>22 May</span>
            </div>
          </div>

          {/* Miniature summary tags */}
          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3.5 mt-3">
            <div className="p-2 border border-slate-100 bg-slate-50 rounded-xl relative">
              <p className="text-[10px] text-slate-400 font-extrabold uppercase">New Patients Registered</p>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-base font-black text-slate-800 font-mono">6,250</span>
                <span className="text-[9.5px] font-bold text-emerald-600 bg-emerald-100/55 px-1.5 py-0.5 rounded">↑ 12.5%</span>
              </div>
            </div>

            <div className="p-2 border border-slate-100 bg-slate-50 rounded-xl">
              <p className="text-[10px] text-slate-400 font-extrabold uppercase">Returning Patients</p>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-base font-black text-slate-800 font-mono">3,750</span>
                <span className="text-[9.5px] font-bold text-blue-600 bg-blue-100/55 px-1.5 py-0.5 rounded">↑ 11.3%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments by Department */}
        <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Appointments by Department</h3>
            <p className="text-[10px] text-slate-400 font-medium">Platform aggregate clinic allocations</p>
          </div>

          <div className="flex flex-col items-center justify-center py-2 relative">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="38" fill="transparent" stroke="#e2e8f0" strokeWidth="9"/>
                <circle cx="48" cy="48" r="38" fill="transparent" stroke="#10b981" strokeWidth="9" strokeDasharray="238" strokeDashoffset="83"/>
                <circle cx="48" cy="48" r="38" fill="transparent" stroke="#2563eb" strokeWidth="9" strokeDasharray="238" strokeDashoffset="142"/>
                <circle cx="48" cy="48" r="38" fill="transparent" stroke="#f59e0b" strokeWidth="9" strokeDasharray="238" strokeDashoffset="190"/>
                <circle cx="48" cy="48" r="38" fill="transparent" stroke="#06b6d4" strokeWidth="9" strokeDasharray="238" strokeDashoffset="214"/>
              </svg>
            </div>
          </div>

          <div className="space-y-1.5 pt-1.5 border-t border-slate-50 text-[10px] font-bold">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"/> General Medicine</span>
              <span className="font-mono text-slate-700">35%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-600"/> Pediatrics</span>
              <span className="font-mono text-slate-700">20%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"/> Cardiology</span>
              <span className="font-mono text-slate-700">18%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500"/> Orthopedics</span>
              <span className="font-mono text-slate-700">15%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-400"/> Others</span>
              <span className="font-mono text-slate-700">12%</span>
            </div>
          </div>

          <div className="pt-2.5 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-[#047857]">
            <span>Total: 1,240 appointments</span>
            <span>↑ 8.7%</span>
          </div>
        </div>

        {/* Patient Demographics (Gender / Age) */}
        <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Patient Demographics</h3>
            <p className="text-[10px] text-slate-400 font-medium">Patient classification attributes</p>
          </div>

          {/* Gender side division */}
          <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-50">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute text-center text-[10px] font-black text-slate-800">56%</div>
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="26" fill="transparent" stroke="#f43f5e" strokeWidth="5.5"/>
                <circle cx="32" cy="32" r="26" fill="transparent" stroke="#3b82f6" strokeWidth="5.5" strokeDasharray="163" strokeDashoffset="71"/>
              </svg>
            </div>
            <div className="flex-1 space-y-1 text-[10px] font-bold text-slate-600">
              <div className="flex justify-between">
                <span>Male (Indigo):</span>
                <span className="font-mono text-slate-800 text-[11px]">56%</span>
              </div>
              <div className="flex justify-between">
                <span>Female (Rose):</span>
                <span className="font-mono text-slate-800 text-[11px]">44%</span>
              </div>
            </div>
          </div>

          {/* Age Breakout vertical stack list */}
          <div className="space-y-1.5 pt-2">
            <h4 className="text-[10px] uppercase font-bold text-slate-400">Age Group breakdown</h4>
            {[
            { bracket: "0-18 Years", val: "18%", color: "bg-indigo-100 text-indigo-700" },
            { bracket: "19-35 Years", val: "32%", color: "bg-blue-100 text-blue-700" },
            { bracket: "36-50 Years", val: "28%", color: "bg-orange-100 text-orange-700" },
            { bracket: "51+ Years", val: "22%", color: "bg-yellow-100 text-yellow-700" }
        ].map((a, idx) => (<div key={idx} className="flex justify-between items-center text-[10px] font-sans">
                <span className={`px-2 py-0.5 rounded text-[9.5px] font-black ${a.color}`}>{a.bracket}</span>
                <span className="font-mono font-black text-slate-700">{a.val}</span>
              </div>))}
          </div>

          <div className="pt-2.5 border-t border-slate-50 flex justify-between text-xs font-bold">
            <span className="text-slate-400">Total Patients database:</span>
            <span className="text-slate-800 font-mono">10,000+</span>
          </div>
        </div>

      </div>

      {/* Row 3: Traffic Source vs Top Doctors vs Status vs y-weekly-Hour Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fade-in">
        
        {/* Traffic Source acquisition channels */}
        <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Traffic Source</h3>
            <p className="text-[10px] text-slate-400 font-medium font-sans">Acquisition metrics breakout</p>
          </div>

          <div className="flex justify-center py-2.5">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="38" fill="transparent" stroke="#e2e8f0" strokeWidth="8"/>
                <circle cx="48" cy="48" r="38" fill="transparent" stroke="#3b82f6" strokeWidth="8" strokeDasharray="238" strokeDashoffset="83"/>
                <circle cx="48" cy="48" r="38" fill="transparent" stroke="#10b981" strokeWidth="8" strokeDasharray="238" strokeDashoffset="142"/>
                <circle cx="48" cy="48" r="38" fill="transparent" stroke="#d97706" strokeWidth="8" strokeDasharray="238" strokeDashoffset="190"/>
                <circle cx="48" cy="48" r="38" fill="transparent" stroke="#a855f7" strokeWidth="8" strokeDasharray="238" strokeDashoffset="214"/>
              </svg>
            </div>
          </div>

          <div className="space-y-1 pt-1.5 border-t border-slate-50 text-[9.5px] font-bold">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-600"/> Direct</span>
              <span className="font-mono text-slate-700">35.6% <span className="text-slate-400 font-medium">(3,556)</span></span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"/> Organic Search</span>
              <span className="font-mono text-slate-700">28.4% <span className="text-slate-400 font-semibold">(2,840)</span></span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"/> Referral</span>
              <span className="font-mono text-slate-700">18.7% <span className="text-slate-400 font-medium">(1,870)</span></span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-purple-500"/> Social Media</span>
              <span className="font-mono text-slate-700">12.9% <span className="text-slate-400 font-medium">(1,290)</span></span>
            </div>
            <div className="flex justify-between items-center font-sans">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-400"/> Email</span>
              <span className="font-mono text-slate-700">4.4% <span className="text-slate-400 font-medium">(444)</span></span>
            </div>
          </div>

          <div className="pt-2 text-center border-t border-slate-50 text-[10px] font-bold text-slate-400 font-mono">
            Total Visitors: 9,842
          </div>
        </div>

        {/* Top Performing Doctors */}
        <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center pb-2 border-b border-slate-50">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Top Performing Doctors</h3>
              <p className="text-[10px] text-slate-400 font-medium">Clinician productivity score index</p>
            </div>
          </div>

          <div className="space-y-2 py-2 flex-1 flex flex-col justify-center">
            {doctors.map((row, idx) => (<div key={idx} className="flex justify-between items-center text-xs border-b border-slate-50 pb-1.5 last:border-0 last:pb-0">
                <div className="flex items-center gap-2">
                  <img src={row.img} alt={row.name} className="w-7.5 h-7.5 rounded-full border border-slate-200 object-cover"/>
                  <div className="text-left">
                    <p className="font-extrabold text-slate-900 text-[11px] leading-tight">{row.name}</p>
                    <p className="text-[9px] text-slate-400 font-medium">{row.specialty}</p>
                  </div>
                </div>
                <div className="text-right font-mono text-[10px] leading-none shrink-0 border-l border-slate-100 pl-2">
                  <p className="font-black text-slate-805 text-slate-800">{row.count}</p>
                  <span className="text-amber-500 font-bold block pt-0.5">★ {row.rating}</span>
                </div>
              </div>))}
          </div>

          <button onClick={() => showToast("Opening clinicians parameters details charts...")} className="w-full text-center text-xs font-bold text-indigo-600 border-t border-slate-100 pt-2 block">
            View All Doctors &rarr;
          </button>
        </div>

        {/* Appointment Status Donut */}
        <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Appointment Status</h3>
            <p className="text-[10px] text-slate-400 font-medium">Patient consultations flow summary</p>
          </div>

          <div className="flex items-center justify-center py-2">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="38" fill="transparent" stroke="#e2e8f0" strokeWidth="8"/>
                <circle cx="48" cy="48" r="38" fill="transparent" stroke="#10b981" strokeWidth="8" strokeDasharray="238" strokeDashoffset="75"/>
                <circle cx="48" cy="48" r="38" fill="transparent" stroke="#3b82f6" strokeWidth="8" strokeDasharray="238" strokeDashoffset="180"/>
                <circle cx="48" cy="48" r="38" fill="transparent" stroke="#ef4444" strokeWidth="8" strokeDasharray="238" strokeDashoffset="210"/>
              </svg>
            </div>
          </div>

          <div className="space-y-1 pt-1.5 border-t border-slate-50 text-[10px] font-bold">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-[#10b981] rounded-full"/> Completed</span>
              <span className="font-mono text-slate-700">820 <span className="text-slate-400 font-medium">(66.1%)</span></span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full"/> Upcoming</span>
              <span className="font-mono text-slate-700">320 <span className="text-slate-400 font-semibold">(25.8%)</span></span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-rose-500 rounded-full"/> Cancelled</span>
              <span className="font-mono text-slate-700">100 <span className="text-slate-400 font-medium">(8.1%)</span></span>
            </div>
          </div>

          <div className="pt-2 text-center border-t border-slate-50 text-[10px] font-bold text-slate-400 font-mono">
            Total Appointments: 1,240
          </div>
        </div>

        {/* Time Analysis Hourly Heatmap Grid array */}
        <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Time Analysis <span className="text-slate-400 text-[10px] font-medium font-sans">(By Hour)</span></h3>
            <p className="text-[10px] text-slate-400 font-medium">Hourly clinical load schedule concentration</p>
          </div>

          {/* Heat mapping rows / matrix */}
          <div className="space-y-1.5 my-3 flex-1 flex flex-col justify-center">
            
            {/* Headers X-axis */}
            <div className="flex justify-between items-center text-[7.5px] font-mono text-slate-400 font-extrabold pl-9">
              {hourHeaders.map((h, i) => (<span key={i} className="w-6.5 text-center">{h}</span>))}
            </div>

            {/* Matrix details */}
            {weekdays.map((day, rowIdx) => (<div key={rowIdx} className="flex items-center gap-2 text-[8px] font-bold text-slate-500 leading-none">
                <span className="w-6.5 text-left shrink-0 font-sans">{day}</span>
                <div className="flex justify-between flex-1">
                  {gridCells[rowIdx].map((val, cellIdx) => {
                const bg = val === 5
                    ? "bg-emerald-700"
                    : val === 4
                        ? "bg-emerald-600"
                        : val === 3
                            ? "bg-emerald-400"
                            : val === 2
                                ? "bg-emerald-200"
                                : "bg-emerald-50";
                return (<div key={cellIdx} onClick={() => showToast(`Day: ${day}, Hour slice load level: ${val}/5`)} className={`w-6 h-4 rounded-md ${bg} hover:ring-1 hover:ring-emerald-700 hover:ring-offset-1 transition cursor-pointer`}/>);
            })}
                </div>
              </div>))}

            {/* Low to High indicator line legend */}
            <div className="flex justify-between items-center text-[7px] text-slate-400 font-bold font-sans pt-1.5 pl-9">
              <span>Low</span>
              <div className="h-1.5 w-24 bg-gradient-to-r from-emerald-50 via-emerald-400 to-emerald-700 rounded"/>
              <span>High Intensity</span>
            </div>

          </div>
        </div>

      </div>

      {/* Row 4: Key Insights Bento Panels Highlight row */}
      <div className="space-y-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
        <h3 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Key Analytics Insights & Actionables</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1 flex flex-col justify-between text-left">
            <div className="flex justify-between items-start">
              <span className="text-[9px] text-[#047857] font-black uppercase tracking-wider bg-emerald-50 px-1 py-0.5 rounded">Peak Slot</span>
              <Clock size={13} className="text-emerald-600"/>
            </div>
            <p className="text-sm font-black text-slate-800 font-sans pt-2">10 AM - 2 PM</p>
            <p className="text-[10px] text-slate-450 text-slate-400 font-medium">Optimal peak slot recorded daily. Plan clinical resources accordingly.</p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1 flex flex-col justify-between text-left">
            <div className="flex justify-between items-start">
              <span className="text-[9px] text-blue-700 font-black uppercase tracking-wider bg-blue-50 px-1 py-0.5 rounded">Volume Hit</span>
              <CalendarDays size={13} className="text-blue-600"/>
            </div>
            <p className="text-sm font-black text-slate-800 font-sans pt-2">Saturday surge</p>
            <p className="text-[10px] text-slate-450 text-slate-400 font-medium">Saturday records 28% higher appointment demand vs other weekdays.</p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1 flex flex-col justify-between text-left">
            <div className="flex justify-between items-start">
              <span className="text-[9px] text-indigo-700 font-black uppercase tracking-wider bg-indigo-50 px-1 py-0.5 rounded">Device</span>
              <Smartphone size={13} className="text-indigo-600"/>
            </div>
            <p className="text-sm font-black text-slate-800 font-sans pt-2">55.6% Mobile</p>
            <p className="text-[10px] text-slate-450 text-slate-400 font-medium">Over half of patients access via smartphone. Optimize touch views.</p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1 flex flex-col justify-between text-left">
            <div className="flex justify-between items-start">
              <span className="text-[9px] text-red-700 font-black uppercase tracking-wider bg-red-50 px-1 py-0.5 rounded">Top revenue</span>
              <Heart size={13} className="text-red-500 animate-pulse"/>
            </div>
            <p className="text-sm font-black text-slate-800 font-sans pt-2">Cardiology</p>
            <p className="text-[10px] text-slate-450 text-slate-400 font-medium">Cardiology clinic registers highest total consultancy revenue capture.</p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1 flex flex-col justify-between text-left">
            <div className="flex justify-between items-start">
              <span className="text-[9px] text-purple-700 font-black uppercase tracking-wider bg-purple-50 px-1 py-0.5 rounded">Retentive</span>
              <TrendingUp size={13} className="text-purple-600"/>
            </div>
            <p className="text-sm font-black text-slate-800 font-sans pt-2">↑ 9.5% Grow</p>
            <p className="text-[10px] text-slate-455 text-slate-400 font-medium">Patient retention rate improved by 9.5% relative to last months indexes.</p>
          </div>

        </div>
      </div>

    </div>);
}
