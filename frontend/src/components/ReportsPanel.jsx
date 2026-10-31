import React, { useState } from "react";
import { FileText, Eye, Calendar, Download, Share2, Layers, Search, ChevronDown, ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
export default function ReportsPanel({ showToast }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All Categories");
    const [activeDateRange, setActiveDateRange] = useState("22 Apr 2024 - 22 May 2024");
    const [currentPage, setCurrentPage] = useState(1);
    // Reports Stat Cards (Row of 6) with sparklines
    const stats = [
        { label: "Total Reports Generated", value: "1,250", icon: FileText, trend: "↑ 18.4% vs last 7 days", color: "text-[#047857] bg-emerald-50", stroke: "M0 10 Q10 2, 20 8 T40 4 T60 9" },
        { label: "Total Data Views", value: "9,842", icon: Eye, trend: "↑ 12.7% vs last 7 days", color: "text-blue-600 bg-blue-50", stroke: "M0 8 Q10 9, 20 4 T40 7 T60 2" },
        { label: "Scheduled Reports", value: "156", icon: Calendar, trend: "↑ 8.6% vs last 7 days", color: "text-purple-600 bg-purple-50", stroke: "M0 12 Q10 6, 20 9 T40 3 T60 6" },
        { label: "Downloads", value: "3,421", icon: Download, trend: "↑ 15.3% vs last 7 days", color: "text-amber-600 bg-amber-50", stroke: "M0 5 Q10 4, 20 7 T40 5 T60 10" },
        { label: "Shared Reports", value: "982", icon: Share2, trend: "↑ 9.4% vs last 7 days", color: "text-pink-600 bg-pink-50", stroke: "M0 11 Q10 8, 20 10 T40 9 T60 7" },
        { label: "Active Reports", value: "72", icon: Layers, trend: "↑ 6.2% vs last 7 days", color: "text-cyan-600 bg-cyan-50", stroke: "M0 9 Q10 11, 20 8 T40 9 T60 10" }
    ];
    // Popular reports
    const popularReports = [
        { name: "Appointments Overview", category: "Appointments", views: "2,312 views", color: "bg-emerald-100 text-emerald-800" },
        { name: "Patient Demographics", category: "Patients", views: "1,986 views", color: "bg-blue-100 text-blue-800" },
        { name: "Revenue Summary", category: "Revenue", views: "1,576 views", color: "bg-amber-100 text-amber-800" },
        { name: "Doctor Performance", category: "Doctors", views: "1,245 views", color: "bg-purple-100 text-purple-800" },
        { name: "Hospital Utilization", category: "Others", views: "1,102 views", color: "bg-slate-100 text-slate-850" }
    ];
    // All Reports Table mock
    const reportsTable = [
        { name: "Appointments Overview - Weekly", subText: "Overview of all appointments for the week", category: "Appointments", generatedBy: "Admin User", generatedOn: "22 May 2024 10:30 AM", views: "1,245", downloads: "320", status: "Published", theme: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100", dot: "bg-emerald-500" },
        { name: "Patient Demographics - Monthly", subText: "Monthly patient demographic analysis", category: "Patients", generatedBy: "Admin User", generatedOn: "21 May 2024 04:15 AM", views: "987", downloads: "210", status: "Published", theme: "bg-blue-50 text-blue-700 hover:bg-blue-100", dot: "bg-emerald-500" },
        { name: "Revenue Summary - Q2 2024", subText: "Revenue summary for Q2 2024", category: "Revenue", generatedBy: "Admin User", generatedOn: "20 May 2024 11:45 AM", views: "1,576", downloads: "450", status: "Published", theme: "bg-amber-50 text-amber-700 hover:bg-amber-100", dot: "bg-emerald-500" },
        { name: "Doctor Performance Report", subText: "Performance metrics of all doctors", category: "Doctors", generatedBy: "Admin User", generatedOn: "19 May 2024 09:20 AM", views: "845", downloads: "198", status: "Scheduled", theme: "bg-purple-50 text-purple-700 hover:bg-purple-100", dot: "bg-blue-500" },
        { name: "Hospital Utilization Report", subText: "Hospital utilization and capacity report", category: "Others", generatedBy: "Admin User", generatedOn: "18 May 2024 02:30 PM", views: "732", downloads: "156", status: "Published", theme: "bg-slate-100 text-slate-700 hover:bg-slate-200", dot: "bg-emerald-500" }
    ];
    // Filter table based on search and category filter
    const filteredReports = reportsTable.filter(r => {
        const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "All Categories" || r.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });
    return (<div className="space-y-6 text-left" id="reports-main-panel">
      
      {/* Top filter row */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 flex-1">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Date Selection</label>
            <div className="relative">
              <select className="appearance-none w-full bg-slate-50 border border-slate-200/70 text-slate-705 text-slate-700 text-xs py-2 px-3 pr-8 rounded-xl font-medium focus:outline-none cursor-pointer">
                <option>{activeDateRange}</option>
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={() => {
            showToast("Refreshing dynamic data reports compilation from main database...");
        }} className="px-3.5 py-2 hover:bg-slate-50 text-[11px] text-slate-600 font-bold border border-slate-200 rounded-xl flex items-center gap-1.5 transition cursor-pointer">
            <span>Filters</span>
          </button>
          
          <button onClick={() => {
            showToast("Downloading compiled PDF/XLS bundle containing all medical audits logs...");
        }} className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-[11px] text-white font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer">
            <Download size={13}/>
            <span>Export Report</span>
          </button>
        </div>

      </div>

      {/* Row of 6 cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {stats.map((s, idx) => {
            const Icon = s.icon;
            return (<div key={idx} className="bg-white p-4 rounded-2xl border border-slate-201 border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow transition relative overflow-hidden group">
              <div className="space-y-1">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-tight leading-none truncate max-w-[100px]">{s.label}</span>
                  <div className={`p-1.5 rounded-lg border border-transparent absolute right-3 top-3 ${s.color}`}>
                    <Icon size={13}/>
                  </div>
                </div>
                <p className="text-xl font-black text-slate-950 font-mono pt-3">{s.value}</p>
              </div>

              {/* Mini Sparkline inside Card */}
              <div className="h-6 w-full mt-2 relative">
                <svg className="w-full h-full" viewBox="0 0 60 15">
                  <path d={s.stroke} fill="none" stroke="#2563eb" strokeWidth="1.5"/>
                </svg>
              </div>

              <div className="pt-2 text-[9px] font-bold text-emerald-600 font-mono">
                {s.trend}
              </div>
            </div>);
        })}
      </div>

      {/* Row 3: Reports Overview Line graph vs Categories Doughnut vs Popular list */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fade-in">
        
        {/* Line graph Reports Overview */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Reports Overview</h3>
              <p className="text-[10px] text-slate-400 font-medium font-sans">Trajectory audit logs compilation details</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex gap-2 text-[9px] font-bold text-slate-550 text-slate-500">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#10b981]"></span> Generated</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-600"></span> Views</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Downloads</span>
              </div>

              <select className="bg-slate-50 border border-slate-200 text-[10px] font-extrabold rounded-lg px-2 py-0.5 text-slate-600 cursor-pointer">
                <option>This Month</option>
                <option>Last Month</option>
              </select>
            </div>
          </div>

          <div className="h-44 w-full mt-4 relative flex items-end">
            <svg className="w-full h-full" viewBox="0 0 500 130" preserveAspectRatio="none">
              {/* Curve 1 (Generated - Green) */}
              <path d="M 10,110 Q 90,50 170,95 T 330,115 T 490,105" fill="none" stroke="#10b981" strokeWidth="2"/>
              {/* Curve 2 (Views - Blue) */}
              <path d="M 10,90 Q 90,30 170,75 T 330,95 T 490,82" fill="none" stroke="#2563eb" strokeWidth="2"/>
              {/* Curve 3 (Downloads - Amber) */}
              <path d="M 10,120 Q 90,80 170,110 T 330,125 T 490,118" fill="none" stroke="#d97706" strokeWidth="1.5" strokeDasharray="3,3"/>
            </svg>

            <div className="absolute left-0 right-0 bottom-0 flex justify-between px-2 text-[8px] text-slate-400 font-bold font-mono">
              <span>16 Apr</span>
              <span>22 Apr</span>
              <span>28 Apr</span>
              <span>04 May</span>
              <span>10 May</span>
              <span>16 May</span>
              <span>22 May</span>
            </div>
          </div>
        </div>

        {/* Reports by Category doughnut circle */}
        <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Reports by Category</h3>
            <p className="text-[10px] text-slate-400 font-medium">Aggregate metric groups classification</p>
          </div>

          <div className="flex flex-col items-center justify-center py-2 relative">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute text-center">
                <p className="text-[8px] font-black text-slate-400 uppercase leading-none">Total Reports</p>
                <p className="text-sm font-black text-slate-900 font-mono mt-0.5">1,250</p>
              </div>
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="38" fill="transparent" stroke="#e2e8f0" strokeWidth="8.5"/>
                <circle cx="48" cy="48" r="38" fill="transparent" stroke="#047857" strokeWidth="8.5" strokeDasharray="238" strokeDashoffset="83"/>
                <circle cx="48" cy="48" r="38" fill="transparent" stroke="#2563eb" strokeWidth="8.5" strokeDasharray="238" strokeDashoffset="142"/>
                <circle cx="48" cy="48" r="38" fill="transparent" stroke="#d97706" strokeWidth="8.5" strokeDasharray="238" strokeDashoffset="190"/>
                <circle cx="48" cy="48" r="38" fill="transparent" stroke="#a855f7" strokeWidth="8.5" strokeDasharray="238" strokeDashoffset="214"/>
              </svg>
            </div>
          </div>

          <div className="space-y-1 pt-1.5 border-t border-slate-50 text-[10px] font-bold">
            <div className="flex justify-between">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#047857]"/> Appointments</span>
              <span className="text-slate-700 font-mono">35%</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-600"/> Patients</span>
              <span className="text-slate-700 font-mono">25%</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"/> Revenue</span>
              <span className="text-slate-700 font-mono">20%</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-purple-500"/> Doctors</span>
              <span className="text-slate-700 font-mono">10%</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-400"/> Others</span>
              <span className="text-slate-700 font-mono">10%</span>
            </div>
          </div>
        </div>

        {/* Popular Reports quick leaderboard score */}
        <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center pb-2">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Popular Reports</h3>
              <p className="text-[10px] text-slate-400 font-medium">Widely accessed dynamic databases</p>
            </div>
            <button onClick={() => showToast("Opening full dashboard metrics analytics...")} className="text-[11px] font-bold text-[#047857] hover:underline">
              View All
            </button>
          </div>

          <div className="space-y-2.5 flex-1 pt-2">
            {popularReports.map((item, idx) => (<div key={idx} className="flex justify-between items-center text-xs pb-1.5 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="space-y-0.5">
                  <p className="font-extrabold text-slate-800 text-[11px] font-sans truncate max-w-[120px]">{item.name}</p>
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${item.color}`}>
                    {item.category}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-slate-500 font-bold">{item.views}</span>
              </div>))}
          </div>
        </div>

      </div>

      {/* Row 4: All Reports Ledger Table component */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-50 pb-3">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">All Reports</h3>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input Filter */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13}/>
              <input type="text" placeholder="Search reports..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-slate-50 border border-slate-250 p-1.5 pl-8 rounded-xl text-xs text-slate-700 font-medium w-48 focus:outline-none"/>
            </div>

            {/* Category Select Filter */}
            <div className="relative">
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="appearance-none bg-slate-50 border border-slate-250 py-1.5 px-3 pr-8 rounded-xl text-xs font-bold text-slate-650 text-slate-600 focus:outline-none cursor-pointer">
                <option value="All Categories">All Categories</option>
                <option value="Appointments">Appointments Only</option>
                <option value="Patients">Patients Details</option>
                <option value="Revenue">Financials</option>
                <option value="Doctors">Clinician stats</option>
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
            </div>
          </div>
        </div>

        {/* Ledger Table listing */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans">
            <thead>
              <tr className="border-b border-slate-100 text-[10.5px] text-slate-405 text-slate-400 uppercase font-black">
                <th className="pb-3 pl-2">Report Name</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Generated By</th>
                <th className="pb-3">Generated On</th>
                <th className="pb-3 text-right">Views</th>
                <th className="pb-3 text-right">Downloads</th>
                <th className="pb-3 text-center">Status</th>
                <th className="pb-3 text-center w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredReports.map((row, idx) => (<tr key={idx} className="text-xs hover:bg-slate-50/50 text-slate-705 text-slate-700">
                  <td className="py-3 pl-2 max-w-[210px] truncate">
                    <p className="font-extrabold text-slate-900 text-[11.5px] leading-snug">{row.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{row.subText}</p>
                  </td>
                  <td className="py-3">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-black ${row.theme}`}>
                      {row.category}
                    </span>
                  </td>
                  <td className="py-3 font-semibold text-slate-500">{row.generatedBy}</td>
                  <td className="py-3 font-mono text-[10px] text-slate-450 text-slate-400 font-bold">{row.generatedOn}</td>
                  <td className="py-3 text-right font-mono font-bold text-slate-800">{row.views}</td>
                  <td className="py-3 text-right font-mono text-slate-500 font-semibold">{row.downloads}</td>
                  <td className="py-3 text-center">
                    <div className="inline-flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${row.dot}`}/>
                      <span className="font-bold text-[10px] text-slate-700">{row.status}</span>
                    </div>
                  </td>
                  <td className="py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button onClick={() => showToast(`Pre-viewing report: ${row.name}`)} className="p-1 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded transition cursor-pointer">
                        <Eye size={13}/>
                      </button>
                      <button onClick={() => showToast(`Downloading report document matching: ${row.name}`)} className="p-1 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded transition cursor-pointer">
                        <Download size={13}/>
                      </button>
                      <button onClick={() => showToast(`Opening secure document share link for: ${row.name}`)} className="p-1 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded transition cursor-pointer">
                        <Share2 size={13}/>
                      </button>
                      <button onClick={() => showToast("Opening settings menu option...")} className="p-1 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded transition cursor-pointer">
                        <MoreVertical size={13}/>
                      </button>
                    </div>
                  </td>
                </tr>))}
              
              {filteredReports.length === 0 && (<tr>
                  <td colSpan={8} className="text-center py-8 text-xs text-slate-400 font-bold">
                    No reports match the provided search criteria.
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>

        {/* Table paginations row */}
        <div className="flex justify-between items-center text-xs text-slate-400 pt-4 border-t border-slate-50">
          <span className="font-medium">Showing 1 to {filteredReports.length} of 25 reports</span>
          <div className="flex items-center gap-1 font-mono">
            <button onClick={() => showToast("Loading previous page...")} className="p-1 border border-slate-200 rounded hover:bg-indigo-50 transition cursor-pointer">
              <ChevronLeft size={13}/>
            </button>
            <button className="px-2 py-0.5 border border-indigo-600 bg-indigo-50 text-indigo-700 rounded hover:opacity-80 transition cursor-pointer font-bold">1</button>
            <button onClick={() => showToast("Opening page 2...")} className="px-2 py-0.5 border border-slate-200 rounded hover:bg-slate-50 transition cursor-pointer">2</button>
            <button onClick={() => showToast("Opening page 3...")} className="px-2 py-0.5 border border-slate-200 rounded hover:bg-slate-50 transition cursor-pointer font-bold">3</button>
            <span className="px-1.5 text-slate-400 font-bold">...</span>
            <button onClick={() => showToast("Opening page 5...")} className="px-2 py-0.5 border border-slate-200 rounded hover:bg-slate-50 transition cursor-pointer font-bold">5</button>
            <button onClick={() => showToast("Loading next page...")} className="p-1 border border-slate-200 rounded hover:bg-indigo-50 transition cursor-pointer">
              <ChevronRight size={13}/>
            </button>
          </div>
        </div>

      </div>

    </div>);
}
