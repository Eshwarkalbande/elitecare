import React, { useState } from "react";
import { Flame, MapPin, TrendingUp, Compass, Clock, CheckCircle, AlertTriangle, TrendingDown, Activity, MousePointerClick, Sparkles } from "lucide-react";
export default function HeatmapPanel({ showToast }) {
    const [activeFunnelStep, setActiveFunnelStep] = useState(null);
    const [activePredictionHover, setActivePredictionHover] = useState(null);
    // Top 7 dynamic KPIs list
    const kpis = [
        { label: "Live Visitors Right Now", value: "126", trend: "Online Users", flag: true, icon: Activity, color: "text-emerald-600 bg-emerald-50" },
        { label: "New Visitors Today", value: "3,245", trend: "↑ 18.6% vs yesterday", icon: MousePointerClick, color: "text-blue-600 bg-blue-50" },
        { label: "Returning Visitors", value: "42.8%", trend: "↑ 6.2% vs yesterday", icon: Compass, color: "text-purple-600 bg-purple-50" },
        { label: "Avg. Session Time", value: "04:32", trend: "↑ 12.4% vs last 7 days", icon: Clock, color: "text-cyan-600 bg-cyan-50" },
        { label: "Bounce Rate", value: "28.45%", trend: "↓ 3.6% vs last 7 days", icon: Flame, color: "text-rose-600 bg-rose-50" },
        { label: "Conversion Rate", value: "12.35%", trend: "↑ 4.7% vs last 7 days", icon: TrendingUp, color: "text-amber-600 bg-amber-50" },
        { label: "AI Symptom Checker", value: "2,987", trend: "↑ 16.3% vs last 7 days", icon: Sparkles, color: "text-indigo-600 bg-indigo-50" }
    ];
    // User Journey Funnel items array
    const funnelSteps = [
        { step: "Landing Page", users: "10,000", drop: "0%", pct: "w-full", color: "bg-blue-600 shadow-blue-105" },
        { step: "Find Doctor", users: "7,500", drop: "25%", pct: "w-3/4", color: "bg-teal-500 shadow-teal-100" },
        { step: "Doctor Profile", users: "5,200", drop: "30.7%", pct: "w-7/12", color: "bg-amber-500 shadow-amber-100" },
        { step: "Book Appointment", users: "2,800", drop: "46.2%", pct: "w-4/12", color: "bg-orange-500 shadow-orange-100" },
        { step: "Payment Success", users: "1,800", drop: "35.7%", pct: "w-3/12", color: "bg-rose-500 shadow-rose-100" }
    ];
    // Cities ranking list
    const cities = [
        { name: "Mumbai", count: 67, pct: "22.5%" },
        { name: "Nagpur", count: 45, pct: "15.1%" },
        { name: "Pune", count: 28, pct: "9.4%" },
        { name: "Delhi", count: 32, pct: "10.7%" },
        { name: "Bangalore", count: 41, pct: "13.8%" },
        { name: "Other Cities", count: 120, pct: "28.5%" }
    ];
    // Clicks Over Time points (Hourly)
    const clickPoints = [
        { time: "12 AM", clicks: 200 },
        { time: "4 AM", clicks: 450 },
        { time: "8 AM", clicks: 1200 },
        { time: "12 PM", clicks: 2312 }, // Peer Point (9 AM - 11 AM area)
        { time: "4 PM", clicks: 1500 },
        { time: "8 PM", clicks: 900 }
    ];
    // Peak Traffic metrics
    const peakTraffic = [
        { range: "9 AM - 11 AM", volume: "2,312", pct: "w-full", color: "bg-[#047857]" },
        { range: "2 PM - 4 PM", volume: "1,987", pct: "w-11/12", color: "bg-emerald-600" },
        { range: "7 PM - 10 PM", volume: "1,765", pct: "w-9/12", color: "bg-indigo-600" },
        { range: "11 AM - 1 PM", volume: "1,256", pct: "w-7/12", color: "bg-blue-600" },
        { range: "4 PM - 6 PM", volume: "986", pct: "w-5/12", color: "bg-slate-500" },
        { range: "Others", volume: "925", pct: "w-4/12", color: "bg-slate-400" }
    ];
    // Predictor percentage distributions
    const predictions = [
        { label: "Appointment Booking", val: "35%", color: "bg-emerald-500", raw: 35 },
        { label: "Doctor Search", val: "25%", color: "bg-blue-500", raw: 25 },
        { label: "Symptom Check", val: "20%", color: "bg-indigo-500", raw: 20 },
        { label: "Hospital Info", val: "10%", color: "bg-purple-500", raw: 10 },
        { label: "Likely to Bounce", val: "10%", color: "bg-rose-500", raw: 10 }
    ];
    return (<div className="space-y-6 text-left" id="heatmap-main-panel">
      
      {/* 8-card parallel dynamic horizontal metric row */}
      <div className="grid grid-cols-2 md:grid-cols-7 gap-3.5">
        {kpis.map((k, idx) => {
            const Icon = k.icon;
            return (<div key={idx} className="bg-white p-3.5 border border-slate-200/85 rounded-xl flex flex-col justify-between shadow-sm relative group overflow-hidden">
              <div className="space-y-0.5">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight leading-none truncate max-w-[85px]">{k.label}</span>
                  <div className={`p-1 rounded-md ${k.color}`}>
                    <Icon size={12}/>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <span className="text-xl font-black font-mono text-slate-900 leading-none">{k.value}</span>
                  {k.flag && (<span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 animate-pulse"></span>
                    </span>)}
                </div>
              </div>
              <div className="pt-2 text-[9px] font-bold text-emerald-600 font-mono leading-none">
                {k.trend}
              </div>
            </div>);
        })}
      </div>

      {/* Grid Row 2: Live Locations map vs journey funnel vs AI insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fade-in">
        
        {/* Real-time Location Distribution */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Real-time Visitors by Location</h3>
                <p className="text-[10px] text-slate-400 font-medium">Regional live session overlays</p>
              </div>
              <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-slate-150">
                India (IN)
              </span>
            </div>

            {/* Custom Interactive Click Overlay Map representation */}
            <div className="h-44 w-full bg-slate-50 my-4 rounded-xl border border-slate-100 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:14px_24px]"/>
              
              {/* Colored Pulsing Glow Dots overlay mimicking the heat tracking maps */}
              <div className="absolute top-1/3 left-1/2 -translate-x-12 -translate-y-6 flex items-center justify-center">
                <span className="absolute inline-flex h-12 w-12 rounded-full bg-amber-400 opacity-20 animate-ping"></span>
                <span className="absolute inline-flex h-6 w-6 rounded-full bg-[#ef4444] opacity-50 blur-[2px]"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
              </div>

              <div className="absolute bottom-1/3 left-1/2 -translate-x-4 translate-y-3 flex items-center justify-center">
                <span className="absolute inline-flex h-8 w-8 rounded-full bg-yellow-300 opacity-25 animate-pulse"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
              </div>

              <div className="absolute top-1/4 left-1/2 translate-x-8 -translate-y-2 flex items-center justify-center">
                <span className="absolute inline-flex h-6 w-6 rounded-full bg-emerald-300 opacity-30 animate-pulse"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </div>

              {/* Thermal Heat Map indicators Legend */}
              <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center px-2 py-1 bg-white/90 border border-slate-150 rounded-lg text-[9px] font-bold text-slate-500 shadow-sm">
                <span>Low Visited</span>
                <div className="h-2 w-24 bg-gradient-to-r from-blue-400 via-yellow-400 to-red-500 rounded"/>
                <span>High Attention</span>
              </div>
            </div>
          </div>

          {/* Locations tables details */}
          <div className="space-y-1.5">
            {cities.map((city, idx) => (<div key={idx} className="flex justify-between items-center text-[10px] border-b border-slate-50 pb-1 last:border-0 last:pb-0">
                <div className="flex items-center gap-1.5">
                  <MapPin size={11} className="text-slate-400"/>
                  <span className="text-slate-600 font-bold">{city.name}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="font-extrabold text-slate-800">{city.count} users</span>
                  <span className="text-slate-400">{city.pct}</span>
                </div>
              </div>))}
          </div>
        </div>

        {/* User Journey Funnel with drop-offs */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">User Journey Funnel</h3>
            <p className="text-[10px] text-slate-400 font-medium font-sans">Funnel conversion dropoff metrics</p>
          </div>

          <div className="space-y-2.5 my-4">
            {funnelSteps.map((f, i) => (<div key={i} className="space-y-1 cursor-pointer" onMouseEnter={() => setActiveFunnelStep(i)} onMouseLeave={() => setActiveFunnelStep(null)}>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-black text-slate-700">{f.step}</span>
                  <div className="flex gap-2 font-mono text-[9px] text-slate-400 font-bold">
                    <span className="text-slate-700 font-black">{f.users} users</span>
                    {f.drop !== "0%" && <span className="text-rose-500 bg-rose-50 px-1 rounded">▼ Down {f.drop}</span>}
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-6.5 rounded-lg overflow-hidden flex items-center pr-3 relative hover:brightness-95 transition">
                  <div className={`h-full ${f.color} ${f.pct} rounded-r-lg transition-all duration-300 flex items-center pl-3`}>
                    <span className="text-[9px] font-black text-white">{f.pct === "w-full" ? "100%" : f.pct === "w-3/4" ? "75%" : f.pct === "w-7/12" ? "52%" : f.pct === "w-4/12" ? "28%" : "18%"}</span>
                  </div>
                </div>
              </div>))}
          </div>

          {/* Conversion aggregate row */}
          <div className="flex justify-between items-center p-3.5 bg-emerald-50 rounded-xl border border-emerald-100">
            <span className="text-[10px] font-bold text-[#047857] uppercase tracking-wider">Overall Conversion Rate</span>
            <span className="text-xl font-black font-mono text-[#047857]">18.0%</span>
          </div>
        </div>

        {/* AI Insight bullet panel list */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">AI Insights <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-md ml-1 inline-block">Today</span></h3>
            <p className="text-[10px] text-slate-400 font-medium">Automated engagement audits analysis logs</p>
          </div>

          {/* Insights items list block layout */}
          <div className="space-y-3 flex-1 pt-4">
            
            <div className="flex gap-3 text-xs bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50">
              <Sparkles size={16} className="text-emerald-600 mt-0.5 shrink-0"/>
              <div>
                <p className="font-bold text-slate-900 leading-tight">Most Clicked Feature</p>
                <p className="text-[10px] text-slate-500 pt-0.5">AI Symptom Checker captures <strong className="text-emerald-700">2,987 clicks</strong> today.</p>
              </div>
            </div>

            <div className="flex gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/50">
              <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0"/>
              <div>
                <p className="font-bold text-slate-900 leading-tight">Most Ignored Section</p>
                <p className="text-[10px] text-slate-500 pt-0.5">Diet Plan module recorded only <strong className="text-amber-600">412 interactive clicks</strong>.</p>
              </div>
            </div>

            <div className="flex gap-3 text-xs bg-blue-50/60 p-3 rounded-xl border border-blue-100/40">
              <TrendingUp size={16} className="text-blue-600 mt-0.5 shrink-0"/>
              <div>
                <p className="font-bold text-slate-900 leading-tight">Best Performing CTA</p>
                <p className="text-[10px] text-slate-500 pt-0.5">"Book Appointment" triggers record CTR of <strong className="text-blue-700 font-mono">18.6%</strong>.</p>
              </div>
            </div>

            <div className="flex gap-3 text-xs bg-rose-50/60 p-3 rounded-xl border border-rose-100/40">
              <TrendingDown size={16} className="text-[#ef4444] mt-0.5 shrink-0"/>
              <div>
                <p className="font-bold text-slate-900 leading-tight">Drop-off Point</p>
                <p className="text-[10px] text-slate-500 pt-0.5">Payment checkout logs highest dropoff tier rate of <strong className="text-rose-600 font-mono">34.2%</strong>.</p>
              </div>
            </div>

          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-500">Suggested: Improve Doctor Profile Page</span>
            <button onClick={() => showToast("Opening AI-generated doctors design templates optimizer...")} className="bg-indigo-600 hover:bg-indigo-800 text-white font-extrabold text-[10px] px-2.5 py-1.5 rounded-lg transition">
              View Details
            </button>
          </div>
        </div>

      </div>

      {/* Row 3: Landing Page Heatmap preview vs clicks graph vs donut devices */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Heatmap Preview Overlay card */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Heatmap Preview <span className="text-[10px] text-slate-400 font-medium">(Landing Page)</span></h3>
            <p className="text-[10px] text-slate-400 font-medium">Visual distribution focus metrics</p>
          </div>

          {/* Visual simulation of EliteCare landing page with colored thermal blobs */}
          <div className="h-44 w-full bg-slate-950 my-4 rounded-xl relative overflow-hidden flex items-center justify-center p-3 border border-slate-800">
            {/* Dark abstract mock browser background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-black opacity-90"/>
            
            {/* Visual elements */}
            <div className="relative text-center space-y-1.5 z-10 w-full">
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[8px] font-black tracking-widest px-2 py-0.5 rounded-full uppercase">EliteCare Medical</span>
              <p className="text-sm font-black text-white leading-tight font-sans">Your Health, Our Priority</p>
              <p className="text-[7.5px] text-slate-400 max-w-xs mx-auto">Access 24/7 Virtual Consultation and Diagnostic Suite Tools safely</p>
              
              <div className="flex justify-center gap-2 pt-2">
                <div className="relative">
                  {/* Heat glow over Book Appointment */}
                  <div className="absolute -inset-2 bg-rose-500 blur-lg rounded-full opacity-70 animate-pulse"/>
                  <button className="relative bg-rose-600 text-white text-[8px] font-bold px-3 py-1.5 rounded">Book Appointment</button>
                </div>

                <div className="relative">
                  {/* Heat glow over AI Symptom Checker */}
                  <div className="absolute -inset-2 bg-yellow-400 blur-md rounded-full opacity-60 animate-pulse"/>
                  <button className="relative bg-slate-800 text-slate-200 text-[8px] font-bold px-3 py-1.5 rounded border border-slate-700">AI Symptom Checker</button>
                </div>
              </div>
            </div>

            {/* Scale legend on overlay */}
            <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[7px] text-slate-400 font-bold px-2 py-0.5 bg-slate-900/60 rounded">
              <span>Low Attention (Cold)</span>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 rounded my-1"/>
              <span>High Attention (Hot)</span>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 font-medium italic">
            *Red glowing areas indicate optimal click concentration (Call to Action conversion centers).
          </p>
        </div>

        {/* Clicks Over Time graph curve */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start border-b border-slate-100 pb-2">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Clicks Over Time</h3>
              <p className="text-[10px] text-slate-400 font-medium">Daily hourly density triggers rate</p>
            </div>
            
            <select className="bg-slate-50 border border-slate-200 text-[10px] font-bold rounded px-2 py-0.5 text-slate-600 focus:outline-none cursor-pointer">
              <option>Hourly</option>
              <option>Daily</option>
            </select>
          </div>

          <div className="h-36 w-full mt-4 relative flex items-end">
            <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
              <path d="M 10,90 Q 60,70 110,15 T 210,70 T 290,80" fill="none" stroke="#10b981" strokeWidth="2"/>
              <path d="M 10,90 Q 60,70 110,15 T 210,70 T 290,80 L 290,95 L 10,95 Z" fill="url(#clicksGrad)" opacity="0.15"/>
              <defs>
                <linearGradient id="clicksGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981"/>
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                </linearGradient>
              </defs>
              
              {/* Highlight Point */}
              <circle cx="120" cy="22" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5"/>
            </svg>

            {/* Inline dynamic tooltip simulation */}
            <div className="absolute top-2 left-1/3 bg-slate-900 text-white rounded p-1.5 font-mono text-[8px] border border-slate-700">
              <p className="font-extrabold">9 AM - 11 AM</p>
              <p className="text-emerald-400">Clicks: 2,312</p>
            </div>

            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[8px] font-mono text-slate-400 font-bold px-1">
              <span>12 AM</span>
              <span>4 AM</span>
              <span>8 AM</span>
              <span>12 PM</span>
              <span>4 PM</span>
              <span>8 PM</span>
            </div>
          </div>
        </div>

        {/* Traffic by Device (Pie/Donut) */}
        <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Traffic by Device</h3>
            <p className="text-[10px] text-slate-400 font-medium">Acquisition agent system distributions</p>
          </div>

          <div className="flex flex-col items-center py-2">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute text-center">
                <p className="text-[9px] font-bold text-slate-400 uppercase leading-none">Total</p>
                <p className="text-base font-black text-slate-800 font-mono mt-0.5">45,231</p>
              </div>
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="38" fill="transparent" stroke="#e2e8f0" strokeWidth="9"/>
                <circle cx="48" cy="48" r="38" fill="transparent" stroke="#0d9488" strokeWidth="9" strokeDasharray="238" strokeDashoffset="103"/>
                <circle cx="48" cy="48" r="38" fill="transparent" stroke="#2563eb" strokeWidth="9" strokeDasharray="238" strokeDashoffset="193"/>
                <circle cx="48" cy="48" r="38" fill="transparent" stroke="#d97706" strokeWidth="9" strokeDasharray="238" strokeDashoffset="210"/>
              </svg>
            </div>
          </div>

          <div className="space-y-1 pt-1 border-t border-slate-50">
            <div className="flex justify-between items-center text-[10px]">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-[#0d9488] rounded-full"/> Mobile</span>
              <span className="font-mono text-slate-700 font-extrabold">55.6% <span className="text-slate-400 font-medium">(25,152)</span></span>
            </div>
            <div className="flex justify-between items-center text-[10px]">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full"/> Desktop</span>
              <span className="font-mono text-slate-700 font-extrabold">37.8% <span className="text-slate-400 font-semibold">(17,091)</span></span>
            </div>
            <div className="flex justify-between items-center text-[10px]">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-amber-500 rounded-full"/> Tablet</span>
              <span className="font-mono text-slate-700 font-extrabold">6.6% <span className="text-slate-400 font-medium">(2,988)</span></span>
            </div>
          </div>
        </div>

      </div>

      {/* Row 4: Peak traffic times vs pages list views vs pred vs rev vs health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Peak traffic lists */}
        <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Peak Traffic Hours</h3>
            <p className="text-[10px] text-slate-400 font-medium">Densest volume timeline segments</p>
          </div>

          <div className="space-y-2 mt-3 flex-1 justify-center flex flex-col">
            {peakTraffic.map((pt, idx) => (<div key={idx} className="space-y-0.5">
                <div className="flex justify-between items-center text-[9px] font-bold text-slate-600">
                  <span>{pt.range}</span>
                  <span className="font-mono font-black">{pt.volume} clicks</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${pt.color} ${pt.pct} rounded-full`}/>
                </div>
              </div>))}
          </div>
        </div>

        {/* Top Pages ranking */}
        <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Top Pages by Views</h3>
            <p className="text-[10px] text-slate-400 font-medium font-sans">Platforms primary navigation hits</p>
          </div>

          <div className="divide-y divide-slate-100 my-2">
            {[
            { path: "/ (Landing Page)", views: "25,421", pct: "20.2%" },
            { path: "/find-doctors", views: "18,254", pct: "14.5%" },
            { path: "/book-appointment", views: "15,632", pct: "12.4%" },
            { path: "/symptom-checker", views: "12,365", pct: "9.8%" },
            { path: "/doctor-profile", views: "10,254", pct: "8.1%" }
        ].map((p, idx) => (<div key={idx} className="flex justify-between items-center py-2 text-[10px] font-sans">
                <span className="font-mono text-indigo-600 truncate max-w-[130px] font-bold">{p.path}</span>
                <div className="flex items-center gap-1.5 font-mono text-slate-500">
                  <span className="font-extrabold text-slate-800">{p.views}</span>
                  <span>({p.pct})</span>
                </div>
              </div>))}
          </div>

          <button onClick={() => showToast("Opening landing logs analytics...")} className="w-full text-center text-xs font-bold text-indigo-600 py-1 border-t border-slate-100 block">
            View All Pages &rarr;
          </button>
        </div>

        {/* Intent Prediction */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Visitor Intent Prediction (AI)</h3>
            <p className="text-[10px] text-slate-400 font-medium font-mono">Classifier weights</p>
          </div>

          <div className="space-y-1.5 my-3">
            {predictions.map((p, idx) => (<div key={idx} onMouseEnter={() => setActivePredictionHover(p.label)} onMouseLeave={() => setActivePredictionHover(null)} className={`p-1 px-1.5 rounded transition ${activePredictionHover === p.label ? "bg-slate-50 scale-102" : ""}`}>
                <div className="flex justify-between items-center text-[9px] font-bold text-slate-650">
                  <span className="flex items-center gap-1"><span className={`w-1.5 h-1.5 rounded-full ${p.color}`}/> {p.label}</span>
                  <span className="font-mono">{p.val}</span>
                </div>
              </div>))}
          </div>
        </div>

        {/* Revenue Correlation */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between gap-3 text-left">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Revenue Correlation</h3>
            <p className="text-[10px] text-slate-400 font-medium">Platform marketing ROI</p>
          </div>

          <div className="space-y-3 pt-1">
            <div className="p-2.5 border border-slate-100 rounded-xl bg-slate-50 text-[10px] font-bold">
              <p className="text-slate-400">Total Visitors</p>
              <p className="text-base font-black text-slate-800 font-mono">10,000</p>
            </div>
            
            <div className="p-2.5 border border-slate-100 rounded-xl bg-slate-50 text-[10px] font-bold">
              <p className="text-slate-400">Appointments Booked</p>
              <p className="text-base font-black text-[#047857] font-mono flex items-center gap-1">
                <span>1,250</span> <span className="text-[9px] text-rose-500">▼ down</span>
              </p>
            </div>

            <div className="p-2.5 border border-emerald-100 rounded-xl bg-emerald-50/50 text-[10px] font-bold">
              <p className="text-slate-450 text-[#047857]">Total Revenue</p>
              <p className="text-base font-black text-[#047857] font-mono">₹3,50,000</p>
              <span className="text-[8px] text-emerald-600">↑ 22.5% vs last 7 days</span>
            </div>
          </div>
        </div>

        {/* Platform Health dial */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Platform Health</h3>
            <p className="text-[10px] text-slate-400 font-medium font-sans">Enterprise clinical system score</p>
          </div>

          <div className="flex flex-col items-center justify-center py-2 text-center">
            <div className="relative w-18 h-18 flex items-center justify-center bg-emerald-50 border border-emerald-100 rounded-full shadow-inner">
              <div className="text-center">
                <span className="text-2xl font-black text-emerald-700 font-mono">92</span>
                <span className="text-[9px] block font-bold text-slate-400 uppercase font-sans">/100</span>
              </div>
            </div>
            <span className="text-[10px] font-extrabold text-[#047857] uppercase tracking-wide pt-1 text-emerald-600 block">Excellent</span>
          </div>

          <div className="space-y-1 text-[9px] border-t border-slate-100 pt-1.5 font-bold">
            <div className="flex justify-between">
              <span className="text-slate-450 text-slate-400">User Satisfaction:</span>
              <span className="text-slate-800 font-mono">89%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-450 text-slate-400">Doctor Availabilities:</span>
              <span className="text-slate-800 font-mono">95%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-450 text-slate-400">Appointment Success:</span>
              <span className="text-slate-800 font-mono">91%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-450 text-slate-400">System Performance:</span>
              <span className="text-slate-872 text-slate-800 font-mono">98%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Row 5: Smart Alerts Footers */}
      <div className="space-y-2">
        <p className="text-[10px] uppercase font-bold text-slate-400">Smart Alerts & Tickers</p>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          
          <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-xl text-xs flex gap-2 text-left">
            <TrendingUp size={14} className="text-emerald-600 shrink-0 mt-0.5"/>
            <div className="space-y-0.5">
              <p className="font-bold text-slate-900 leading-tight">Traffic Spike <span className="text-[8px] bg-emerald-100 text-emerald-800 rounded px-1 ml-1">Just now</span></p>
              <p className="text-[10px] text-slate-500">Traffic increased by 45% in last 1 hour.</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-xl text-xs flex gap-2 text-left">
            <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5"/>
            <div className="space-y-0.5">
              <p className="font-bold text-slate-900 leading-tight">High Bounce Rate <span className="text-[8px] bg-amber-100 text-amber-800 rounded px-1 ml-1">10 min ago</span></p>
              <p className="text-[10px] text-slate-500">Bounce rate is 28.45% on /book-appointment.</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-xl text-xs flex gap-2 text-left">
            <TrendingDown size={14} className="text-rose-500 shrink-0 mt-0.5"/>
            <div className="space-y-0.5">
              <p className="font-bold text-slate-900 leading-tight">Conversion Drop <span className="text-[8px] bg-rose-100 text-rose-800 rounded px-1 ml-1">15 min ago</span></p>
              <p className="text-[10px] text-slate-500">Appointment conversion drop 8.3% today.</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-xl text-xs flex gap-2 text-left">
            <Sparkles size={14} className="text-indigo-600 shrink-0 mt-0.5"/>
            <div className="space-y-0.5">
              <p className="font-bold text-slate-900 leading-tight">New Feature Hits <span className="text-[8px] bg-indigo-100 text-indigo-800 rounded px-1 ml-1">30 min ago</span></p>
              <p className="text-[10px] text-slate-500">AI Symptom Checker usage grew by 32%.</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/60 p-3 rounded-xl text-xs flex gap-2 text-left">
            <CheckCircle size={14} className="text-[#047857] shrink-0 mt-0.5"/>
            <div className="space-y-0.5">
              <p className="font-bold text-slate-900 leading-tight">System Normal <span className="text-[8px] bg-slate-100 text-slate-800 rounded px-1 ml-1">1 hour ago</span></p>
              <p className="text-[10px] text-slate-500">All services running beautifully smoothly.</p>
            </div>
          </div>

        </div>
      </div>

    </div>);
}
