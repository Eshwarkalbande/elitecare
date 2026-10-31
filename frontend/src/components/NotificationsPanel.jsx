import React, { useState } from "react";
import { Bell, Send, Eye, Clock, AlertTriangle, Calendar, Filter, Download, RefreshCw, Trash2, Edit3, Share2, Plus, Info, ChevronDown } from "lucide-react";
export default function NotificationsPanel({ showToast }) {
    const [dateRange, setDateRange] = useState("22 Apr 2024 - 22 May 2024");
    const [notifType, setNotifType] = useState("All Types");
    const [notifStatus, setNotifStatus] = useState("All Status");
    const [userGroup, setUserGroup] = useState("All Groups");
    // Filter handlers
    const handleClearFilters = () => {
        setNotifType("All Types");
        setNotifStatus("All Status");
        setUserGroup("All Groups");
        showToast("Filters cleared");
    };
    return (<div className="space-y-6 text-left" id="notifications-panel">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="text-slate-900 shrink-0" size={24}/>
            Notifications Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create, send and manage notifications across the platform
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Active Date Period */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-705 shadow-sm cursor-pointer hover:bg-slate-50">
            <Calendar size={13.5} className="text-slate-400"/>
            <span>22 Apr 2024 - 22 May 2024</span>
            <ChevronDown size={12} className="text-slate-400 ml-1"/>
          </div>

          <button onClick={() => showToast("Showing filter options...")} className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm cursor-pointer hover:bg-slate-50">
            <Filter size={13} className="text-slate-500"/>
            <span>Filters</span>
          </button>

          <button onClick={() => showToast("Exporting notification logs report bundle...")} className="flex items-center gap-1.5 bg-white border border-slate-205 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm cursor-pointer hover:bg-slate-50 mr-1">
            <Download size={13} className="text-slate-500"/>
            <span>Export Report</span>
          </button>

          {/* Profile bell and notification counters */}
          <button onClick={() => showToast("Already on Notifications panel")} className="size-9 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 flex items-center justify-center relative transition cursor-pointer shadow-sm animate-pulse">
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

      {/* KPI METRIC CARDS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Card 1: Total Notifications */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow transition relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Total Notifications</p>
              <h3 className="text-2xl font-black text-slate-950 font-mono mt-2">12,458</h3>
            </div>
            <div className="p-2.5 rounded-2xl bg-indigo-55 bg-indigo-50 text-indigo-650 flex items-center justify-center border border-indigo-100/50">
              <Bell size={18}/>
            </div>
          </div>
          <div className="pt-3 text-[11px] font-bold text-emerald-600 font-mono flex items-center gap-1">
            <span className="text-sm">↑</span>
            <span>15.6% <span className="text-slate-400 font-sans font-medium">vs last 30 days</span></span>
          </div>
        </div>

        {/* Card 2: Sent Today */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow transition relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Sent Today</p>
              <h3 className="text-2xl font-black text-slate-950 font-mono mt-2">1,245</h3>
            </div>
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-650 flex items-center justify-center border border-emerald-100/50">
              <Send size={18} className="text-emerald-600"/>
            </div>
          </div>
          <div className="pt-3 text-[11px] font-bold text-emerald-600 font-mono flex items-center gap-1">
            <span className="text-sm">↑</span>
            <span>18.3% <span className="text-slate-400 font-sans font-medium">vs yesterday</span></span>
          </div>
        </div>

        {/* Card 3: Read Rate */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow transition relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Read Rate</p>
              <h3 className="text-2xl font-black text-slate-950 font-mono mt-2">78.5%</h3>
            </div>
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-650 flex items-center justify-center border border-blue-105/50">
              <Eye size={18} className="text-blue-600"/>
            </div>
          </div>
          <div className="pt-3 text-[11px] font-bold text-emerald-600 font-mono flex items-center gap-1">
            <span className="text-sm">↑</span>
            <span>6.2% <span className="text-slate-400 font-sans font-medium">vs last 30 days</span></span>
          </div>
        </div>

        {/* Card 4: Pending Notifications */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow transition relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Pending Notifications</p>
              <h3 className="text-2xl font-black text-slate-950 font-mono mt-2">324</h3>
            </div>
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-650 flex items-center justify-center border border-amber-100/50">
              <Clock size={18} className="text-amber-600"/>
            </div>
          </div>
          <div className="pt-3 text-[11px] font-bold text-emerald-600 font-mono flex items-center gap-1">
            <span className="text-sm">↑</span>
            <span>8.7% <span className="text-slate-400 font-sans font-medium">vs yesterday</span></span>
          </div>
        </div>

        {/* Card 5: Failed Deliveries */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow transition relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Failed Deliveries</p>
              <h3 className="text-2xl font-black text-slate-950 font-mono mt-2">18</h3>
            </div>
            <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-650 flex items-center justify-center border border-rose-100/50">
              <AlertTriangle size={18} className="text-rose-600"/>
            </div>
          </div>
          <div className="pt-3 text-[11px] font-bold text-rose-600 font-mono flex items-center gap-1">
            <span className="text-sm">↓</span>
            <span>28.6% <span className="text-slate-400 font-sans font-medium">vs last 30 days</span></span>
          </div>
        </div>

      </div>

      {/* FILTER CONTROL SECTION */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Date Range</label>
            <div className="relative">
              <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="appearance-none w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs py-2 px-3 pr-8 rounded-xl font-medium focus:outline-none cursor-pointer">
                <option>22 Apr 2024 - 22 May 2024</option>
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Notification Type</label>
            <div className="relative">
              <select value={notifType} onChange={(e) => setNotifType(e.target.value)} className="appearance-none w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs py-2 px-3 pr-8 rounded-xl font-medium focus:outline-none cursor-pointer">
                <option value="All Types">All Types</option>
                <option value="Reminder">Reminders</option>
                <option value="Alert">Alerts</option>
                <option value="Health">Health Tips</option>
                <option value="System">System Updates</option>
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Status</label>
            <div className="relative">
              <select value={notifStatus} onChange={(e) => setNotifStatus(e.target.value)} className="appearance-none w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs py-2 px-3 pr-8 rounded-xl font-medium focus:outline-none cursor-pointer">
                <option value="All Status">All Status</option>
                <option value="Sent">Sent</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Failed">Failed</option>
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
            </div>
          </div>

          <div className="space-y-1.5 relative">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">User Group</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <select value={userGroup} onChange={(e) => setUserGroup(e.target.value)} className="appearance-none w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs py-2 px-3 pr-8 rounded-xl font-medium focus:outline-none cursor-pointer">
                  <option value="All Groups">All Groups</option>
                  <option value="Patients">Patients Only</option>
                  <option value="Doctors">Doctors Only</option>
                  <option value="Clinicians">All Clinicians</option>
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

      {/* PERFORMANCE CHART AND TYPE DISTRIBUTION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Notification Performance Graph */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Notification Performance</h3>
              <p className="text-[10px] text-slate-400 font-medium">Platform transmission and retention tracker</p>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2.5 text-[9px] font-bold text-slate-500 mr-2">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"/> Sent
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"/> Opened
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"/> Clicked
                </span>
              </div>

              <select className="bg-slate-50 border border-slate-200 text-[10px] font-bold rounded px-2 py-0.5 text-slate-600 focus:outline-none cursor-pointer">
                <option>Daily</option>
                <option>Weekly</option>
              </select>
            </div>
          </div>

          <div className="h-48 w-full mt-4 relative flex items-end">
            <svg className="w-full h-full" viewBox="0 0 500 130" preserveAspectRatio="none">
              <line x1="10" y1="20" x2="490" y2="20" stroke="#f1f5f9" strokeDasharray="3,3"/>
              <line x1="10" y1="65" x2="490" y2="65" stroke="#f1f5f9" strokeDasharray="3,3"/>
              <line x1="10" y1="110" x2="490" y2="110" stroke="#f1f5f9" strokeDasharray="3,3"/>
              
              {/* Curve 1 (Sent - Purple) */}
              <path d="M 10,95 Q 60,60 110,40 T 210,65 T 310,80 T 410,50 T 490,60" fill="none" stroke="#6366f1" strokeWidth="2"/>
              {/* Curve 2 (Opened - Green) */}
              <path d="M 10,110 Q 60,85 110,60 T 210,80 T 310,95 T 410,75 T 490,85" fill="none" stroke="#10b981" strokeWidth="2"/>
              {/* Curve 3 (Clicked - Blue) */}
              <path d="M 10,120 Q 60,110 110,85 T 210,105 T 310,115 T 410,100 T 490,108" fill="none" stroke="#3b82f6" strokeWidth="1.6"/>
            </svg>

            <div className="absolute left-0 right-0 bottom-0 flex justify-between px-2 text-[8px] font-mono font-bold text-slate-400">
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

        {/* Notification Type Distribution */}
        <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Notification Type Distribution</h3>
          </div>

          <div className="flex items-center gap-4 py-4 justify-between">
            {/* Doughnut drawing */}
            <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
              <div className="absolute text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Total</p>
                <p className="text-base font-black text-slate-800 font-mono mt-0.5">12,458</p>
              </div>
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="56" cy="56" r="44" fill="transparent" stroke="#e2e8f0" strokeWidth="10"/>
                {/* Reminders 35.8% -> strokeDasharray="276" strokeDashoffset="98.8" (blue) */}
                <circle cx="56" cy="56" r="44" fill="transparent" stroke="#3b82f6" strokeWidth="10" strokeDasharray="276" strokeDashoffset="98.8"/>
                {/* Emergency 22.7% -> (green) */}
                <circle cx="56" cy="56" r="44" fill="transparent" stroke="#10b981" strokeWidth="10" strokeDasharray="276" strokeDashoffset="161.4"/>
                {/* Health 16.3% -> (teal) */}
                <circle cx="56" cy="56" r="44" fill="transparent" stroke="#14b8a6" strokeWidth="10" strokeDasharray="276" strokeDashoffset="206.4"/>
                {/* Prescription 14.2% -> (orange) */}
                <circle cx="56" cy="56" r="44" fill="transparent" stroke="#f97316" strokeWidth="10" strokeDasharray="276" strokeDashoffset="245.6"/>
                {/* System 7.5% -> (purple) */}
                <circle cx="56" cy="56" r="44" fill="transparent" stroke="#8b5cf6" strokeWidth="10" strokeDasharray="276" strokeDashoffset="266.3"/>
              </svg>
            </div>

            {/* Legend list */}
            <div className="space-y-1 text-[9.5px] font-bold text-slate-600 flex-1 leading-snug">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1 w-28 truncate"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"/> Appointment Reminders</span>
                <span className="font-mono text-slate-800 text-right">35.8% <span className="text-slate-400 font-normal">({(4462).toLocaleString()})</span></span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-1 w-28 truncate"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"/> Emergency Alerts</span>
                <span className="font-mono text-slate-800 text-right">22.7% <span className="text-slate-400 font-normal">({(2825).toLocaleString()})</span></span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-1 w-28 truncate"><span className="w-1.5 h-1.5 rounded-full bg-teal-500"/> Health Tips</span>
                <span className="font-mono text-slate-800 text-right">16.3% <span className="text-slate-400 font-normal">({(2036).toLocaleString()})</span></span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-1 w-28 truncate"><span className="w-1.5 h-1.5 rounded-full bg-orange-500"/> Prescription Reminders</span>
                <span className="font-mono text-slate-800 text-right">14.2% <span className="text-slate-400 font-normal">({(1770).toLocaleString()})</span></span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-1 w-28 truncate"><span className="w-1.5 h-1.5 rounded-full bg-purple-500"/> System Notifications</span>
                <span className="font-mono text-slate-800 text-right">7.5% <span className="text-slate-400 font-normal">({(933).toLocaleString()})</span></span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-1 w-28 truncate"><span className="w-1.5 h-1.5 rounded-full bg-slate-450 bg-slate-400"/> Others</span>
                <span className="font-mono text-slate-800 text-right">3.5% <span className="text-slate-400 font-normal">({(432).toLocaleString()})</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Audience Insights / Rings */}
        <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Audience Insights</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 flex-1 items-center">
            
            {/* Ring 1: Notifications by User Type */}
            <div className="text-center space-y-2">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wide">User Type</p>
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="40" cy="40" r="32" fill="transparent" stroke="#e2e8f0" strokeWidth="6"/>
                  {/* Patients 68% -> stroke bg-blue-500 */}
                  <circle cx="40" cy="40" r="32" fill="transparent" stroke="#3b82f6" strokeWidth="6" strokeDasharray="201" strokeDashoffset="64"/>
                  {/* Doctors 20% -> stroke bg-emerald-500 */}
                  <circle cx="40" cy="40" r="26" fill="transparent" stroke="#e8f5e9" strokeWidth="4"/>
                  <circle cx="40" cy="40" r="26" fill="transparent" stroke="#10b981" strokeWidth="4" strokeDasharray="163" strokeDashoffset="130"/>
                  {/* Hospitals 12% -> stroke bg-orange-500 */}
                  <circle cx="40" cy="40" r="20" fill="transparent" stroke="#fff3e0" strokeWidth="3.5"/>
                  <circle cx="40" cy="40" r="20" fill="transparent" stroke="#f97316" strokeWidth="3.5" strokeDasharray="125" strokeDashoffset="110"/>
                </svg>
              </div>

              <div className="space-y-0.5 text-[8.5px] font-black text-left">
                <div className="flex justify-between items-center text-xs">
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full"/> Patients</span>
                  <span className="font-mono">68%</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-[#10b981] rounded-full"/> Doctors</span>
                  <span className="font-mono">20%</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-orange-55 bg-orange-500 rounded-full"/> Hospitals</span>
                  <span className="font-mono">12%</span>
                </div>
              </div>
            </div>

            {/* Ring 2: Device Distribution */}
            <div className="text-center space-y-2">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wide">Device Status</p>
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="40" cy="40" r="32" fill="transparent" stroke="#e2e8f0" strokeWidth="6"/>
                  {/* Mobile App 72% */}
                  <circle cx="40" cy="40" r="32" fill="transparent" stroke="#00b4d8" strokeWidth="6" strokeDasharray="201" strokeDashoffset="56"/>
                  {/* Web Portal 21% */}
                  <circle cx="40" cy="40" r="26" fill="transparent" stroke="#06b6d4" strokeWidth="4" strokeDasharray="163" strokeDashoffset="128"/>
                  {/* Email 7% */}
                  <circle cx="40" cy="40" r="20" fill="transparent" stroke="#f59e0b" strokeWidth="3.5" strokeDasharray="125" strokeDashoffset="116"/>
                </svg>
              </div>

              <div className="space-y-0.5 text-[8.5px] font-black text-left">
                <div className="flex justify-between items-center text-xs">
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-[#00b4d8] rounded-full"/> Mobile App</span>
                  <span className="font-mono">72%</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-cyan-500 rounded-full"/> Web Portal</span>
                  <span className="font-mono">21%</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-amber-500 rounded-full"/> Email</span>
                  <span className="font-mono">7%</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* RECENT NOTIFICATIONS & SCHEDULED NOTIFICATIONS GRAPH GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Notifications Table List */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Recent Notifications</h3>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-sidebar-border border-slate-100 text-[10.5px] text-slate-400 font-extrabold uppercase pb-3">
                  <th className="pb-3 pl-1">#</th>
                  <th className="pb-3">Title</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3 text-right">Recipients</th>
                  <th className="pb-3">Sent Time</th>
                  <th className="pb-3 text-center">Status</th>
                  <th className="pb-3 text-center w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs">
                
                {[
            { id: 1, title: "Appointment Reminder", subtitle: "Scheduled visit verification", type: "Reminder", badgeStyle: "bg-blue-50 text-blue-700 hover:bg-blue-100", count: "1,250", time: "22 May 2024, 10:30 AM", status: "Sent", statusDot: "bg-emerald-500" },
            { id: 2, title: "Emergency Alert - Flood Warning", subtitle: "Flooding reports safety advisory", type: "Alert", badgeStyle: "bg-rose-50 text-rose-700 hover:bg-rose-100", count: "450", time: "22 May 2024, 09:15 AM", status: "Sent", statusDot: "bg-emerald-500" },
            { id: 3, title: "Health Tip: Stay Hydrated", subtitle: "Warm season nutrition care guide", type: "Health", badgeStyle: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100", count: "2,300", time: "22 May 2024, 08:00 AM", status: "Scheduled", statusDot: "bg-amber-500" },
            { id: 4, title: "Prescription Reminder", subtitle: "Dosage replenishment prompt alert", type: "Reminder", badgeStyle: "bg-blue-50 text-blue-700 hover:bg-theme-bg", count: "1,780", time: "22 May 2024, 07:45 AM", status: "Sent", statusDot: "bg-emerald-500" },
            { id: 5, title: "System Update: Maintenance", subtitle: "Infrastructure server clinical updates", type: "System", badgeStyle: "bg-purple-50 text-purple-700", count: "1,800", time: "22 May 2024, 07:30 AM", status: "Failed", statusDot: "bg-red-500" }
        ].map((row, idx) => (<tr key={idx} className="hover:bg-slate-50/50 text-slate-700">
                    <td className="py-3 pl-1 font-mono font-bold text-slate-400">{row.id}</td>
                    <td className="py-3">
                      <p className="font-extrabold text-slate-900">{row.title}</p>
                      <p className="text-[10px] text-slate-400 leading-none">{row.subtitle}</p>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${row.badgeStyle}`}>
                        {row.type}
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-slate-850 pr-4">{row.count}</td>
                    <td className="py-3 font-mono font-bold text-[10.5px] text-slate-500">{row.time}</td>
                    <td className="py-3 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${row.statusDot}`}/>
                        <span className="font-bold text-[11px] text-slate-805 text-slate-800">{row.status}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center justify-center gap-1 border-l border-slate-100 pl-2">
                        <button onClick={() => showToast(`Viewing draft matching row #${row.id}`)} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded cursor-pointer transition">
                          <Eye size={13}/>
                        </button>
                        <button onClick={() => showToast(`Editing notification draft row #${row.id}`)} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded cursor-pointer transition">
                          <Edit3 size={13}/>
                        </button>
                        <button onClick={() => showToast(`Sharing notification stats bundle #${row.id}`)} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded cursor-pointer transition">
                          <Share2 size={13}/>
                        </button>
                        <button onClick={() => showToast(`Deleting notification record #${row.id}`)} className="p-1 text-slate-405 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer transition">
                          <Trash2 size={13}/>
                        </button>
                      </div>
                    </td>
                  </tr>))}

              </tbody>
            </table>
          </div>

          <button onClick={() => showToast("Opening notification history workspace ledger...")} className="w-full text-center text-xs font-bold text-indigo-650 hover:text-indigo-805 py-2.5 border-t border-slate-100 mt-2 block">
            View All Notifications &rarr;
          </button>
        </div>

        {/* Scheduled Notifications stacked lists */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Scheduled Notifications</h3>
            <button onClick={() => showToast("Viewing full scheduled notifications queue...")} className="text-[11px] font-bold text-indigo-650 hover:underline">
              View All
            </button>
          </div>

          <div className="divide-y divide-slate-100 mt-3 flex-1 flex flex-col justify-center">
            
            {[
            { id: 1, title: "Weekly Health Tip", date: "23 May 2024, 10:00 AM", target: "Patients", status: "Scheduled" },
            { id: 2, title: "Appointment Reminder", date: "23 May 2024, 02:00 PM", target: "Patients", status: "Scheduled" },
            { id: 3, title: "Medication Reminder", date: "24 May 2024, 09:00 AM", target: "Patients", status: "Scheduled" },
            { id: 4, title: "Health Checkup Campaign", date: "25 May 2024, 11:00 AM", target: "All Users", status: "Scheduled" }
        ].map((col, idx) => (<div key={idx} className="flex justify-between items-center py-3 text-xs">
                <div className="space-y-0.5 text-left">
                  <p className="font-extrabold text-slate-800">{col.title}</p>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-450 text-slate-400 font-medium">
                    <span>{col.date}</span>
                    <span>•</span>
                    <span className="font-semibold text-slate-500">{col.target}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-amber-50 text-amber-700 font-bold rounded text-[10px]">
                  {col.status}
                </span>
              </div>))}

          </div>

          {/* Indigo banner full-width execute button block nested inside */}
          <button onClick={() => showToast("Triggering Create Notification interactive wizard...")} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md mt-4">
            <Plus size={14}/>
            <span>Create Notification</span>
          </button>

        </div>

      </div>

      {/* QUICK ACTIONS ROW & ABOUT ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Quick Actions List Bar */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-3.5">Quick Actions</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            
            <button onClick={() => showToast("Opening Send Emergency Alert interactive board...")} className="bg-red-50/50 hover:bg-red-50 border border-red-100 rounded-xl p-3 flex flex-col items-center justify-center text-center gap-1.5 group transition cursor-pointer">
              <div className="p-2 bg-red-100 text-red-650 rounded-lg group-hover:scale-105 transition duration-300">
                <Bell size={14} className="text-red-600"/>
              </div>
              <span className="text-[10.5px] font-black text-red-900 leading-tight">Send Emergency Alert</span>
            </button>

            <button onClick={() => showToast("Opening Create Health Campaign design forms...")} className="bg-emerald-50/40 hover:bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex flex-col items-center justify-center text-center gap-1.5 group transition cursor-pointer">
              <div className="p-2 bg-emerald-100 text-emerald-650 rounded-lg group-hover:scale-105 transition duration-300">
                <Send size={14} className="text-emerald-600"/>
              </div>
              <span className="text-[10.5px] font-black text-emerald-900 leading-tight">Create Health Campaign</span>
            </button>

            <button onClick={() => showToast("Opening Schedule Notification calendar matrix scheduler...")} className="bg-amber-50/40 hover:bg-amber-50 border border-amber-100 rounded-xl p-3 flex flex-col items-center justify-center text-center gap-1.5 group transition cursor-pointer">
              <div className="p-2 bg-amber-100 text-amber-650 rounded-lg group-hover:scale-105 transition duration-300">
                <Clock size={14} className="text-amber-600"/>
              </div>
              <span className="text-[10.5px] font-black text-amber-900 leading-tight">Schedule Notification</span>
            </button>

            <button onClick={() => showToast("Opening Notification HTML Templates builder panel...")} className="bg-blue-50/40 hover:bg-blue-50 border border-blue-105/40 rounded-xl p-3 flex flex-col items-center justify-center text-center gap-1.5 group transition cursor-pointer">
              <div className="p-2 bg-blue-100 text-blue-650 rounded-lg group-hover:scale-105 transition duration-300">
                <Bell size={14} className="text-blue-600"/>
              </div>
              <span className="text-[10.5px] font-black text-blue-900 leading-tight">Manage Templates</span>
            </button>

            <button onClick={() => showToast("Opening and configuring notification logs system rules...")} className="bg-purple-50/40 hover:bg-purple-50 border border-purple-100 rounded-xl p-3 flex flex-col items-center justify-center text-center gap-1.5 group transition cursor-pointer">
              <div className="p-2 bg-purple-110 bg-purple-100 text-purple-650 rounded-lg group-hover:scale-105 transition duration-300">
                <Info size={14} className="text-purple-600"/>
              </div>
              <span className="text-[10.5px] font-black text-purple-900 leading-tight">Export Report</span>
            </button>

          </div>
        </div>

        {/* Info illustration Panel */}
        <div className="lg:col-span-4 bg-[#f8fafc] border border-slate-200/80 p-5 rounded-2xl flex items-center justify-between shadow-sm relative overflow-hidden group">
          <div className="space-y-1.5 text-left max-w-[210px] z-10">
            <div className="flex items-center gap-1 text-indigo-600">
              <Info size={14}/>
              <span className="text-[9.5px] uppercase font-black tracking-wider font-mono">About Notifications</span>
            </div>
            <p className="text-xs font-black text-slate-800">Notification Management Hub</p>
            <p className="text-[10px] text-slate-500 font-sans leading-relaxed">
              Notification Management helps administrators send appointment reminders, emergency alerts, medication reminders, and healthcare updates to users in real-time.
            </p>
          </div>

          <div className="relative shrink-0 w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center border border-indigo-100 font-sans shadow-inner">
            <Bell size={28} className="text-indigo-500 animate-bounce"/>
            <span className="absolute top-4 right-4 bg-red-500 text-white font-mono text-[8.5px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-pulse">12</span>
          </div>
        </div>

      </div>

    </div>);
}
