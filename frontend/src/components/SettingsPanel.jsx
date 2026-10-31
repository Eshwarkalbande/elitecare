import React, { useState } from "react";
import { Sliders, Globe, Shield, Bell, Mail, Smartphone, CreditCard, Calendar, RefreshCw, Cpu, Database, Key, FileText, Check, Info, Upload, Settings } from "lucide-react";
export default function SettingsPanel({ showToast }) {
    // Navigation
    const [activeTab, setActiveTab] = useState("general");
    // General Settings State
    const [platformName, setPlatformName] = useState("EliteCare");
    const [platformTagline, setPlatformTagline] = useState("Your Health, Our Priority");
    const [timezone, setTimezone] = useState("(UTC +05:30) Asia/Kolkata");
    const [dateFormat, setDateFormat] = useState("DD MMM YYYY");
    const [timeFormat, setTimeFormat] = useState("12 Hour (AM/PM)");
    const [language, setLanguage] = useState("English");
    const [currency, setCurrency] = useState("INR (₹)");
    // Security Toggles
    const [twoFactor, setTwoFactor] = useState(true);
    const [loginLimit, setLoginLimit] = useState(true);
    const [strongPassword, setStrongPassword] = useState(true);
    const [sessionTimeout, setSessionTimeout] = useState("30 Minutes");
    // Email Configuration
    const [mailDriver, setMailDriver] = useState("SMTP");
    const [fromEmail, setFromEmail] = useState("noreply@elitecare.com");
    const [fromName, setFromName] = useState("EliteCare Admin");
    const [smtpHost, setSmtpHost] = useState("smtp.elasticemail.com");
    const [smtpPort, setSmtpPort] = useState("587");
    const [encryption, setEncryption] = useState("TLS");
    // Maintenance
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [maintenanceMsg, setMaintenanceMsg] = useState("We are currently under maintenance. Please check back soon.");
    // System Overviews
    const version = "v2.4.1";
    const environment = "Production";
    const serverTime = "22 May 2024, 10:45 AM";
    const phpVersion = "8.2.10";
    const dbVersion = "MySQL 8.0.32";
    const storageUsed = 42.6; // GB
    const storageTotal = 100; // GB
    const activeUsersCount = "3,256";
    const totalVisitsCount = "78,542";
    // Sidebar Menu List
    const navItems = [
        { id: "general", label: "General Settings", icon: Sliders },
        { id: "site", label: "Site Settings", icon: Globe },
        { id: "security", label: "Security Settings", icon: Shield },
        { id: "notification", label: "Notification Settings", icon: Bell },
        { id: "email", label: "Email Settings", icon: Mail },
        { id: "sms", label: "SMS Settings", icon: Smartphone },
        { id: "payment", label: "Payment Settings", icon: CreditCard },
        { id: "appointment", label: "Appointment Settings", icon: Calendar },
        { id: "preferences", label: "Global Preferences", icon: Settings },
        { id: "maintenance", label: "Maintenance Mode", icon: RefreshCw },
        { id: "integrations", label: "Integrations", icon: Cpu },
        { id: "backup", label: "Backup & Restore", icon: Database },
        { id: "api", label: "API Settings", icon: Key },
        { id: "syslogs", label: "System Logs", icon: FileText }
    ];
    const handleSaveGeneral = (e) => {
        e.preventDefault();
        showToast(`General settings successfully saved! Global Name updated to: "${platformName}"`);
    };
    const handleBackupNow = () => {
        showToast("Starting cloud datastore backup stream... Completed successfully.");
    };
    const handleRestoreNow = () => {
        showToast("Opening database rollback node... Selected state restore checkpoint verified.");
    };
    return (<div className="space-y-6 w-full text-left" id="admin-settings-panel">
      
      {/* Upper Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Side: Navigation Links Column */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 space-y-1 h-fit">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isTabActive = activeTab === item.id;
            return (<button key={item.id} onClick={() => {
                    setActiveTab(item.id);
                    showToast(`Selected category: ${item.label}`);
                }} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold tracking-tight transition-all cursor-pointer ${isTabActive
                    ? "bg-[#10b981]/10 text-[#047857] shadow-xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
                <IconComponent size={14} className={isTabActive ? "text-[#047857]" : "text-slate-400"}/>
                <span>{item.label}</span>
              </button>);
        })}
        </div>

        {/* Middle Area: General Settings Card Forms */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between">
          <form onSubmit={handleSaveGeneral} className="space-y-5">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">General Settings</h3>
                <p className="text-[11px] text-slate-400 font-medium">Configure the basic settings for your platform.</p>
              </div>
              <button type="submit" className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#047857] hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition cursor-pointer">
                <Check size={14}/>
                <span>Save Changes</span>
              </button>
            </div>

            <div className="space-y-4">
              {/* Platform Name */}
              <div className="grid grid-cols-3 items-center gap-4">
                <label className="text-[11px] text-slate-500 font-bold uppercase tracking-wide">Platform Name</label>
                <div className="col-span-2">
                  <input type="text" value={platformName} onChange={(e) => setPlatformName(e.target.value)} className="w-full text-xs p-2.5 bg-slate-50 border border-slate-205 rounded-xl font-bold focus:outline-none focus:ring-1 focus:ring-[#047857] text-slate-800"/>
                </div>
              </div>

              {/* Tagline */}
              <div className="grid grid-cols-3 items-center gap-4">
                <label className="text-[11px] text-slate-500 font-bold uppercase tracking-wide">Platform Tagline</label>
                <div className="col-span-2">
                  <input type="text" value={platformTagline} onChange={(e) => setPlatformTagline(e.target.value)} className="w-full text-xs p-2.5 bg-slate-50 border border-slate-205 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#047857] text-slate-800 font-medium"/>
                </div>
              </div>

              {/* Logo Row */}
              <div className="grid grid-cols-3 items-center gap-4">
                <label className="text-[11px] text-slate-500 font-bold uppercase tracking-wide">Platform Logo</label>
                <div className="col-span-2 flex items-center gap-3">
                  <div className="size-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-emerald-600 font-black font-mono relative p-1.5">
                    {/* Tiny custom brand mimic logo */}
                    <span className="text-[9px] bg-emerald-50 text-[#047857] p-1 border border-emerald-150 rounded font-black tracking-tighter uppercase">EC</span>
                  </div>
                  <div>
                    <button type="button" onClick={() => showToast("Uploading new platform logo image file...")} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-[10.5px] text-slate-700 hover:bg-slate-50 transition shadow-xs cursor-pointer">
                      <Upload size={12} className="text-slate-400"/>
                      <span>Change Logo</span>
                    </button>
                    <p className="text-[9px] text-slate-400 mt-1">PNG, JPG or SVG. Max size 2MB</p>
                  </div>
                </div>
              </div>

              {/* Favicon Row */}
              <div className="grid grid-cols-3 items-center gap-4">
                <label className="text-[11px] text-slate-500 font-bold uppercase tracking-wide">Favicon</label>
                <div className="col-span-2 flex items-center gap-3">
                  <div className="size-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-emerald-600 font-black relative p-1.5">
                    <span className="text-[8px] bg-slate-100 text-slate-600 p-1 border border-slate-200 rounded font-bold font-mono uppercase">EC</span>
                  </div>
                  <div>
                    <button type="button" onClick={() => showToast("Uploading custom ico format Favicon files...")} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-[10.5px] text-slate-700 hover:bg-slate-50 transition shadow-xs cursor-pointer">
                      <Upload size={12} className="text-slate-400"/>
                      <span>Change Favicon</span>
                    </button>
                    <p className="text-[9px] text-slate-400 mt-1">ICO, PNG. Max size 512KB</p>
                  </div>
                </div>
              </div>

              {/* Timezone */}
              <div className="grid grid-cols-3 items-center gap-4">
                <label className="text-[11px] text-slate-500 font-bold uppercase tracking-wide">Default Timezone</label>
                <div className="col-span-2">
                  <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="w-full text-xs p-2.5 bg-slate-50 border border-slate-205 rounded-xl text-slate-800 font-semibold focus:outline-none cursor-pointer">
                    <option value="(UTC +05:30) Asia/Kolkata">(UTC +05:30) Asia/Kolkata</option>
                    <option value="(UTC +00:00) UTC / London">(UTC +00:00) UTC / London</option>
                    <option value="(UTC -05:00) US Eastern standard">(UTC -05:00) US Eastern standard</option>
                    <option value="(UTC +08:00) Asia/Singapore">(UTC +08:00) Asia/Singapore</option>
                  </select>
                </div>
              </div>

              {/* Date Format */}
              <div className="grid grid-cols-3 items-center gap-4">
                <label className="text-[11px] text-slate-500 font-bold uppercase tracking-wide">Date Format</label>
                <div className="col-span-2">
                  <select value={dateFormat} onChange={(e) => setDateFormat(e.target.value)} className="w-full text-xs p-2.5 bg-slate-50 border border-slate-205 rounded-xl text-slate-800 font-semibold focus:outline-none cursor-pointer">
                    <option value="DD MMM YYYY">DD MMM YYYY (e.g. 22 May 2024)</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2024-05-22)</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 05/22/2024)</option>
                  </select>
                </div>
              </div>

              {/* Time Format */}
              <div className="grid grid-cols-3 items-center gap-4">
                <label className="text-[11px] text-slate-500 font-bold uppercase tracking-wide">Time Format</label>
                <div className="col-span-2">
                  <select value={timeFormat} onChange={(e) => setTimeFormat(e.target.value)} className="w-full text-xs p-2.5 bg-slate-50 border border-slate-205 rounded-xl text-slate-800 font-semibold focus:outline-none cursor-pointer">
                    <option value="12 Hour (AM/PM)">12 Hour (AM/PM)</option>
                    <option value="24 Hour">24 Hour (e.g. 22:45)</option>
                  </select>
                </div>
              </div>

              {/* Default Language */}
              <div className="grid grid-cols-3 items-center gap-4">
                <label className="text-[11px] text-slate-500 font-bold uppercase tracking-wide">Default Language</label>
                <div className="col-span-2">
                  <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full text-xs p-2.5 bg-slate-50 border border-slate-205 rounded-xl text-slate-800 font-semibold focus:outline-none cursor-pointer">
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Spanish">Spanish</option>
                    <option value="German">German</option>
                  </select>
                </div>
              </div>

              {/* Currency */}
              <div className="grid grid-cols-3 items-center gap-4">
                <label className="text-[11px] text-slate-500 font-bold uppercase tracking-wide">Currency</label>
                <div className="col-span-2">
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full text-xs p-2.5 bg-slate-50 border border-slate-205 rounded-xl text-slate-800 font-bold focus:outline-none cursor-pointer">
                    <option value="INR (₹)">INR (₹)</option>
                    <option value="USD ($)">USD ($)</option>
                    <option value="EUR (€)">EUR (€)</option>
                    <option value="GBP (£)">GBP (£)</option>
                  </select>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Right Side: System Overview Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">System Overview</h3>
              <p className="text-[11px] text-slate-400 font-medium">Important system information at a glance.</p>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-550 font-bold text-slate-400">Platform Version</span>
                <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold text-[10px]">{version}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-550 font-bold text-slate-400">Environment</span>
                <span className="font-bold text-slate-700">{environment}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-550 font-bold text-slate-400">Server Time</span>
                <span className="font-bold text-slate-700">{serverTime}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-550 font-bold text-slate-400">PHP Version</span>
                <span className="font-mono font-bold text-slate-700">{phpVersion}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-550 font-bold text-slate-400">Database Version</span>
                <span className="font-mono font-bold text-slate-700">{dbVersion}</span>
              </div>
              <div className="space-y-1.5 py-1.5">
                <div className="flex justify-between items-center text-[10.5px]">
                  <span className="text-slate-550 font-bold text-slate-400">Storage Used</span>
                  <span className="font-mono text-slate-700 font-bold">{storageUsed} GB / {storageTotal} GB</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(storageUsed / storageTotal) * 100}%` }}/>
                </div>
                <p className="text-[9px] text-[#047857] text-right font-black">{(storageUsed / storageTotal) * 100}%</p>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-550 font-bold text-slate-400">Active Users</span>
                <span className="font-mono font-black text-slate-850 text-slate-800">{activeUsersCount}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-550 font-bold text-slate-400">Total Visits (30 Days)</span>
                <span className="font-mono font-black text-slate-850 text-slate-800">{totalVisitsCount}</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-start gap-2.5">
            <span className="p-1 px-1.5 bg-emerald-700 text-white rounded-full text-[10px] font-bold">✓</span>
            <div>
              <p className="text-xs font-black text-[#047857]">All Systems Operational</p>
              <p className="text-[9.5px] text-[#047857]/80 mt-0.5">Your platform is running smoothly.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Row: 4 Configuration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Security Settings */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">Security Settings</h4>
              <p className="text-[10px] text-slate-400 font-medium">Manage security related configurations.</p>
            </div>

            <div className="space-y-3">
              {/* Toggles */}
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-600">Two-Factor Auth</span>
                <button type="button" onClick={() => {
            setTwoFactor(!twoFactor);
            showToast(`Two-Factor Authentication: ${!twoFactor ? "Enabled" : "Disabled"}`);
        }} className={`w-9 h-5 rounded-full p-0.5 transition duration-250 cursor-pointer ${twoFactor ? "bg-[#10b981]" : "bg-slate-200"}`}>
                  <div className={`size-4 rounded-full bg-white shadow-xs transform transition duration-250 ${twoFactor ? "translate-x-4" : "translate-x-0"}`}/>
                </button>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-600">Login Limitation</span>
                <button type="button" onClick={() => {
            setLoginLimit(!loginLimit);
            showToast(`Login Attempt Limitation: ${!loginLimit ? "Active" : "Inactive"}`);
        }} className={`w-9 h-5 rounded-full p-0.5 transition duration-250 cursor-pointer ${loginLimit ? "bg-[#10b981]" : "bg-slate-200"}`}>
                  <div className={`size-4 rounded-full bg-white shadow-xs transform transition duration-250 ${loginLimit ? "translate-x-4" : "translate-x-0"}`}/>
                </button>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-600">Strong Password Policy</span>
                <button type="button" onClick={() => {
            setStrongPassword(!strongPassword);
            showToast(`Strong Password constraints: ${!strongPassword ? "Required" : "Optional"}`);
        }} className={`w-9 h-5 rounded-full p-0.5 transition duration-250 cursor-pointer ${strongPassword ? "bg-[#10b981]" : "bg-slate-200"}`}>
                  <div className={`size-4 rounded-full bg-white shadow-xs transform transition duration-250 ${strongPassword ? "translate-x-4" : "translate-x-0"}`}/>
                </button>
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Session Timeout</label>
                <select value={sessionTimeout} onChange={(e) => {
            setSessionTimeout(e.target.value);
            showToast(`Session auto-disconnect timer: ${e.target.value}`);
        }} className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none cursor-pointer">
                  <option value="15 Minutes">15 Minutes</option>
                  <option value="30 Minutes">30 Minutes</option>
                  <option value="1 Hour">1 Hour</option>
                  <option value="4 Hours">4 Hours</option>
                </select>
              </div>
            </div>
          </div>

          <button type="button" onClick={() => showToast("Opening Advanced Cyber-security settings cluster...")} className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-xs text-slate-700 hover:bg-slate-50 transition shadow-xs cursor-pointer">
            <Shield size={12} className="text-slate-400"/>
            <span>Configure Security</span>
          </button>
        </div>

        {/* Card 2: Email Settings */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">Email Settings</h4>
              <p className="text-[10px] text-slate-400 font-medium">Configure email settings for the platform.</p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-0.5 border-b border-slate-50">
                <span className="text-slate-400 font-semibold">Mail Driver</span>
                <span className="font-bold text-slate-700">{mailDriver}</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-slate-50">
                <span className="text-slate-400 font-semibold">From Email</span>
                <span className="font-semibold text-slate-700 truncate max-w-[130px]" title={fromEmail}>{fromEmail}</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-slate-50">
                <span className="text-slate-400 font-semibold">From Name</span>
                <span className="font-semibold text-slate-700 truncate">{fromName}</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-slate-50">
                <span className="text-slate-400 font-semibold">SMTP Host</span>
                <span className="font-mono text-slate-700 truncate max-w-[110px]" title={smtpHost}>{smtpHost}</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-slate-50">
                <span className="text-slate-400 font-semibold">SMTP Port</span>
                <span className="font-mono font-bold text-slate-700">{smtpPort}</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-400 font-semibold">Encryption</span>
                <span className="font-bold text-slate-700">{encryption}</span>
              </div>
            </div>
          </div>

          <button type="button" onClick={() => showToast("SMTP Port handshake parameters details window opened.")} className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-xs text-slate-700 hover:bg-slate-50 transition shadow-xs cursor-pointer">
            <Mail size={12} className="text-slate-400"/>
            <span>Manage Email Settings</span>
          </button>
        </div>

        {/* Card 3: Maintenance Mode */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">Maintenance Mode</h4>
              <p className="text-[10px] text-slate-400 font-medium">Enable maintenance mode for the platform.</p>
            </div>

            <div className="space-y-3.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-600">Maintenance Mode</span>
                <button type="button" onClick={() => {
            setMaintenanceMode(!maintenanceMode);
            showToast(`Maintenance Mode has been ${!maintenanceMode ? "ENABLED. Guests will be redirected to offline page." : "DISABLED. Platform is restored live."}`);
        }} className={`w-10 h-5.5 rounded-full p-0.5 transition duration-250 cursor-pointer ${maintenanceMode ? "bg-amber-500 animate-pulse" : "bg-slate-200"}`}>
                  <div className={`size-4.5 rounded-full bg-white shadow-xs transform transition duration-250 ${maintenanceMode ? "translate-x-4.5" : "translate-x-0"}`}/>
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Custom Message</label>
                <textarea value={maintenanceMsg} onChange={(e) => setMaintenanceMsg(e.target.value)} rows={3} className="w-full p-2 text-[10.5px] bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#047857] resize-none text-slate-700 leading-relaxed font-sans"/>
              </div>
            </div>
          </div>

          <button type="button" onClick={() => showToast("Maintenance offline notice text updated.")} className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-xs text-slate-700 hover:bg-slate-50 transition shadow-xs cursor-pointer">
            {/* Wrench icon mimic with RefreshCw */}
            <RefreshCw size={12} className="text-slate-400"/>
            <span>Save Maintenance Settings</span>
          </button>
        </div>

        {/* Card 4: Backup & Restore */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">Backup & Restore</h4>
              <p className="text-[10px] text-slate-400 font-medium">Manage backups of your platform data.</p>
            </div>

            <div className="space-y-3.5 text-xs text-left">
              <div className="space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[9.5px] tracking-wide block">Last Backup</span>
                <span className="font-bold text-slate-700 block">21 May 2024, 11:30 PM</span>
              </div>
              <div className="space-y-1 pt-1">
                <span className="text-slate-400 font-bold uppercase text-[9.5px] tracking-wide block">Next Scheduled Backup</span>
                <span className="font-bold text-[#047857] block">23 May 2024, 02:00 AM</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={handleBackupNow} className="inline-flex items-center justify-center gap-1 px-2.5 py-2.5 border border-emerald-200 text-[#047857] hover:bg-emerald-50 rounded-xl font-bold text-[10.5px] transition cursor-pointer">
              <Database size={11} className="text-emerald-500"/>
              <span>Backup Now</span>
            </button>
            <button type="button" onClick={handleRestoreNow} className="inline-flex items-center justify-center gap-1 px-2.5 py-2.5 border border-amber-200 text-amber-700 hover:bg-amber-50 rounded-xl font-bold text-[10.5px] transition cursor-pointer">
              <RefreshCw size={11} className="text-amber-500"/>
              <span>Restore</span>
            </button>
          </div>
        </div>

      </div>

      {/* Info Strip at Absolute Bottom */}
      <div className="p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-600 font-medium">
          <Info size={14} className="text-[#047857] shrink-0"/>
          <span>Admin Settings allow you to manage and customize your platform preferences, security, notifications, and system configurations.</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 bg-emerald-100 text-[#047857] px-2.5 py-1 rounded-full text-[10px] font-black">
          <Check size={10}/>
          <span>Changes are saved automatically</span>
        </div>
      </div>

    </div>);
}
