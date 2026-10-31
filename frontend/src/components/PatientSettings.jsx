import React, { useState } from "react";
import { User, Lock, HeartPulse, PhoneCall, CreditCard, Bell, ShieldCheck, Ruler, Globe, Moon, HelpCircle, MessageSquare, LogOut, Save, Trash2, Calendar, Droplet, Cake, Weight, Activity, CalendarCheck, CheckCircle2, FileText, Download, Plus, Edit2, MapPin, Mail, Phone, Info, Shield, Check, UploadCloud } from "lucide-react";
export default function PatientSettings({ onLogout }) {
    const [activeMenu, setActiveMenu] = useState("Profile Settings");
    return (<div className="-mx-4 md:-mx-8 lg:-mx-12 xl:-mx-16 -my-4 flex font-sans min-h-[calc(100vh-100px)] text-slate-800 bg-slate-50/50">
      {/* LEFT SIDEBAR */}
      <div className="w-[280px] shrink-0 border-r border-slate-200 bg-white hidden md:flex flex-col py-8 px-5 pt-8">
        <div className="flex items-center gap-3 mb-10 pl-2">
          <div className="size-12 rounded-full overflow-hidden bg-slate-200 shrink-0 border border-slate-300">
            <img src="https://i.pravatar.cc/150?img=11" alt="John Doe" className="w-full h-full object-cover"/>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 leading-tight">John Doe</h3>
            <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Premium Member</span>
          </div>
        </div>

        <div className="flex-1 space-y-8">
          {/* GENERAL */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">General</h4>
            <ul className="space-y-1">
              <MenuItem active={activeMenu === "Profile Settings"} onClick={() => setActiveMenu("Profile Settings")} icon={<User size={16}/>} label="Profile Settings"/>
              <MenuItem active={activeMenu === "Account Settings"} onClick={() => setActiveMenu("Account Settings")} icon={<Lock size={16}/>} label="Account Settings"/>
              <MenuItem active={activeMenu === "Health Information"} onClick={() => setActiveMenu("Health Information")} icon={<HeartPulse size={16}/>} label="Health Information"/>
              <MenuItem active={activeMenu === "Emergency Contacts"} onClick={() => setActiveMenu("Emergency Contacts")} icon={<PhoneCall size={16}/>} label="Emergency Contacts"/>
              <MenuItem active={activeMenu === "Insurance Details"} onClick={() => setActiveMenu("Insurance Details")} icon={<CreditCard size={16}/>} label="Insurance Details"/>
            </ul>
          </div>

          {/* PREFERENCES */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Preferences</h4>
            <ul className="space-y-1">
              <MenuItem active={activeMenu === "Notifications"} onClick={() => setActiveMenu("Notifications")} icon={<Bell size={16}/>} label="Notifications"/>
              <MenuItem active={activeMenu === "Privacy & Security"} onClick={() => setActiveMenu("Privacy & Security")} icon={<ShieldCheck size={16}/>} label="Privacy & Security"/>
              <MenuItem active={activeMenu === "Units & Measurements"} onClick={() => setActiveMenu("Units & Measurements")} icon={<Ruler size={16}/>} label="Units & Measurements"/>
              <MenuItem active={activeMenu === "Language"} onClick={() => setActiveMenu("Language")} icon={<Globe size={16}/>} label="Language"/>
              <MenuItem active={activeMenu === "Theme"} onClick={() => setActiveMenu("Theme")} icon={<Moon size={16}/>} label="Theme"/>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Support</h4>
            <ul className="space-y-1">
              <MenuItem active={activeMenu === "Help & Support"} onClick={() => setActiveMenu("Help & Support")} icon={<HelpCircle size={16}/>} label="Help & Support"/>
              <MenuItem active={activeMenu === "Feedback"} onClick={() => setActiveMenu("Feedback")} icon={<MessageSquare size={16}/>} label="Feedback"/>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 px-2 cursor-pointer text-slate-600 hover:text-slate-900 transition flex items-center gap-3 font-semibold text-sm" onClick={onLogout}>
          <LogOut size={16}/>
          <span>Log Out</span>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 bg-slate-50/50 p-6 md:p-10 lg:p-12">
        <div className="w-full max-w-[1400px] mx-auto pt-4 md:pt-0">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900">{activeMenu}</h1>
              <p className="text-sm text-slate-500 font-medium">
                {activeMenu === "Profile Settings" && "Update your personal information and profile details"}
                {activeMenu === "Account Settings" && "Manage your account security, login preferences and connected accounts"}
                {activeMenu === "Health Information" && "Manage your health preferences and information"}
                {!["Profile Settings", "Account Settings", "Health Information"].includes(activeMenu) && "Manage settings and preferences"}
              </p>
            </div>
            
            <button className="mt-4 sm:mt-0 bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 font-bold px-4 py-2 rounded-xl text-sm transition flex items-center gap-2 shadow-sm cursor-pointer whitespace-nowrap">
              <Save size={16}/>
              Save Changes
            </button>
          </div>

          <div className="space-y-6 pb-20">
            {activeMenu === "Profile Settings" && (<div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden">
                <h2 className="text-lg font-bold text-slate-800">Profile Information</h2>
                <p className="text-sm text-slate-500 mb-6">Update your personal information and profile details</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Full Name</label>
                    <input type="text" defaultValue="John Doe" className="w-full text-sm placeholder-slate-400 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"/>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Phone Number</label>
                    <div className="flex rounded-xl overflow-hidden border border-slate-200 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition">
                      <div className="bg-slate-50 border-r border-slate-200 px-3 py-2.5 flex items-center gap-1.5 cursor-pointer">
                        <span className="text-lg leading-none">🇺🇸</span>
                        <span className="text-xs text-slate-600 font-bold">⌄</span>
                      </div>
                      <input type="text" defaultValue="+1 (555) 123-4567" className="w-full text-sm px-4 py-2.5 focus:outline-none"/>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Email Address</label>
                    <input type="email" defaultValue="john.doe@example.com" className="w-full text-sm placeholder-slate-400 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"/>
                  </div>
                  <div className="space-y-1.5 ">
                    <label className="text-xs font-bold text-slate-600">Address</label>
                    <input type="text" defaultValue="123 Health Street, Wellness City, HC 12345" className="w-full text-sm placeholder-slate-400 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"/>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Date of Birth</label>
                    <div className="relative">
                      <input type="text" defaultValue="May 15, 1995" className="w-full text-sm placeholder-slate-400 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"/>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">Gender</label>
                      <select className="w-full text-sm bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition appearance-none pr-8 cursor-pointer">
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">Blood Type</label>
                      <select className="w-full text-sm bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition appearance-none pr-8 cursor-pointer" defaultValue="O Positive (O+)">
                        <option>A Positive (A+)</option>
                        <option>A Negative (A-)</option>
                        <option>B Positive (B+)</option>
                        <option>B Negative (B-)</option>
                        <option>O Positive (O+)</option>
                        <option>O Negative (O-)</option>
                        <option>AB Positive (AB+)</option>
                        <option>AB Negative (AB-)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-600 block">Profile Photo</label>
                  <div className="flex items-center gap-4 pt-1">
                    <div className="size-14 rounded-full overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
                      <img src="https://i.pravatar.cc/150?img=11" alt="John Doe" className="w-full h-full object-cover"/>
                    </div>
                    <button className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition cursor-pointer">
                      Change Photo
                    </button>
                    <button className="p-2 text-rose-500 bg-rose-50 rounded-xl hover:bg-rose-100 transition cursor-pointer" aria-label="Delete Photo">
                      <Trash2 size={16}/>
                    </button>
                  </div>
                </div>
              </div>)}

            {/* ACCOUNT SETTINGS VIEW (IMPLEMENTED AS REQUESTED) */}
            {activeMenu === "Account Settings" && (<div className="space-y-6">
                
                {/* LOGIN & SECURITY */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h2 className="text-lg font-bold text-slate-800">Login & Security</h2>
                  <p className="text-sm text-slate-500 mb-6">Manage your password and account security</p>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-6 gap-x-12">
                    
                    {/* Left Column */}
                    <div className="space-y-6">
                      <div className="space-y-1.5 flex flex-col justify-start">
                        <label className="text-xs font-bold text-slate-800">Email Address</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                          </span>
                          <input type="email" defaultValue="john.doe@example.com" readOnly className="w-full text-sm text-slate-700 bg-transparent border border-slate-200 rounded-xl pl-10 pr-24 py-2.5 focus:outline-none focus:border-emerald-300"/>
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                            Verified
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5 flex flex-col justify-start">
                        <label className="text-xs font-bold text-slate-800">Password</label>
                        <div className="flex items-center gap-4 w-full">
                          <input type="password" defaultValue="••••••••••••" readOnly className="w-full text-lg tracking-widest text-slate-500 bg-transparent border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none h-[42px]"/>
                          <button className="shrink-0 px-4 py-2.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition cursor-pointer whitespace-nowrap h-[42px]">
                            Change Password
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">Two-Factor Authentication</h4>
                          <p className="text-xs text-slate-400 mt-1">Add an extra layer of security to your account</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input type="checkbox" className="sr-only peer" defaultChecked/>
                          <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">Biometric Login</h4>
                          <p className="text-xs text-slate-400 mt-1">Use fingerprint or face ID to login</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input type="checkbox" className="sr-only peer" defaultChecked/>
                          <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">Active Sessions</h4>
                          <p className="text-xs text-slate-400 mt-1">Manage your logged-in devices</p>
                        </div>
                        <button className="shrink-0 px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition cursor-pointer">
                          View Sessions
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

                {/* ACCOUNT PREFERENCES */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h2 className="text-lg font-bold text-slate-800">Account Preferences</h2>
                  <p className="text-sm text-slate-500 mb-6">Manage your account preferences and communication settings</p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-6 gap-x-12">
                    
                    {/* Left Column */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                        <span className="text-sm font-bold text-slate-800">Account Type</span>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Premium Member</span>
                      </div>
                      <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                        <span className="text-sm font-bold text-slate-800">Date Joined</span>
                        <div className="flex items-center gap-1.5 text-sm text-slate-600 font-semibold">
                          <Calendar size={14} className="text-slate-400"/>
                          <span>Jan 15, 2024</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pb-4">
                        <span className="text-sm font-bold text-slate-800">Account Status</span>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Active
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">Communication Preferences</h4>
                          <p className="text-xs text-slate-500 mt-0.5">Choose how you want to receive important updates</p>
                        </div>
                        <button className="shrink-0 px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition cursor-pointer">
                          Manage Preferences
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="pr-4">
                          <h4 className="text-sm font-bold text-slate-800">Marketing Communications</h4>
                          <p className="text-xs text-slate-500 mt-0.5">Receive tips, offers and health updates</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input type="checkbox" className="sr-only peer"/>
                          <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                      </div>
                    </div>

                  </div>
                </div>

                {/* DANGER ZONE */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h2 className="text-lg font-bold text-slate-800">Danger Zone</h2>
                  <p className="text-sm text-slate-500 mb-6">Irreversible and sensitive account actions</p>
                  
                  <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="mt-0.5 size-10 shrink-0 bg-rose-100 text-rose-500 rounded-lg flex items-center justify-center">
                        <Trash2 size={18}/>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-rose-600 mb-0.5">Delete Account</h4>
                        <p className="text-xs text-slate-500">Once you delete your account, there is no going back. Please be certain.</p>
                      </div>
                    </div>
                    <button className="shrink-0 w-full md:w-auto px-4 py-2 text-xs font-bold text-rose-600 bg-white border border-rose-200 rounded-xl hover:bg-rose-50 transition cursor-pointer whitespace-nowrap shadow-sm">
                      Delete Account
                    </button>
                  </div>
                </div>

              </div>)}

            {/* HEALTH INFORMATION VIEW */}
            {activeMenu === "Health Information" && (<div className="space-y-6">
                
                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-32">
                    <div className="flex justify-between items-start">
                      <div className="p-2.5 bg-rose-50 text-rose-500 rounded-xl">
                        <Droplet size={20}/>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500">Blood Group</p>
                      <h4 className="text-xl font-black text-slate-800 tracking-tight">O+</h4>
                    </div>
                    <button className="text-xs font-bold text-emerald-600 text-left mt-2 flex items-center gap-1">Update</button>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-32">
                    <div className="flex justify-between items-start">
                      <div className="p-2.5 bg-indigo-50 text-indigo-500 rounded-xl">
                        <Cake size={20}/>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500">Date of Birth</p>
                      <h4 className="text-sm font-black text-slate-800 tracking-tight">15 May 1992</h4>
                      <p className="text-[10px] font-bold text-slate-400">32 Years</p>
                    </div>
                    <button className="text-xs font-bold text-emerald-600 text-left mt-1 flex items-center gap-1">Update</button>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-32">
                    <div className="flex justify-between items-start">
                      <div className="p-2.5 bg-purple-50 text-purple-500 rounded-xl">
                        <Ruler size={20}/>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500">Height</p>
                      <h4 className="text-xl font-black text-slate-800 tracking-tight">165 cm</h4>
                    </div>
                    <button className="text-xs font-bold text-emerald-600 text-left mt-2 flex items-center gap-1">Update</button>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-32">
                    <div className="flex justify-between items-start">
                      <div className="p-2.5 bg-sky-50 text-sky-500 rounded-xl">
                        <Weight size={20}/>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500">Weight</p>
                      <h4 className="text-xl font-black text-slate-800 tracking-tight">62 kg</h4>
                    </div>
                    <button className="text-xs font-bold text-emerald-600 text-left mt-2 flex items-center gap-1">Update</button>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-32">
                    <div className="flex justify-between items-start">
                      <div className="p-2.5 bg-orange-50 text-orange-500 rounded-xl">
                        <Activity size={20}/>
                      </div>
                    </div>
                    <div className="mb-2">
                      <p className="text-xs font-bold text-slate-500">BMI</p>
                      <h4 className="text-xl font-black text-slate-800 tracking-tight">22.8</h4>
                    </div>
                    <div><span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase">Normal</span></div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-32">
                    <div className="flex justify-between items-start">
                      <div className="p-2.5 bg-blue-50 text-blue-500 rounded-xl">
                        <CalendarCheck size={20}/>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500">Last Checkup</p>
                      <h4 className="text-sm font-black text-slate-800 tracking-tight">12 Mar 2024</h4>
                    </div>
                    <button className="text-xs font-bold text-emerald-600 text-left mt-1 flex items-center gap-1">View Details</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="font-bold text-slate-800">Personal Health Details</h3>
                        <button className="text-xs font-bold text-emerald-600 border border-emerald-200 rounded-lg px-2.5 py-1 flex items-center gap-1 hover:bg-emerald-50 transition">
                          <Edit2 size={12}/> Edit
                        </button>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <User size={16} className="text-slate-400 shrink-0 mt-0.5"/>
                          <div>
                            <p className="text-xs font-bold text-slate-500">Full Name</p>
                            <p className="text-sm font-medium text-slate-800">Priya Sharma</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Activity size={16} className="text-slate-400 shrink-0 mt-0.5"/>
                          <div>
                            <p className="text-xs font-bold text-slate-500">Gender</p>
                            <p className="text-sm font-medium text-slate-800">Female</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Phone size={16} className="text-slate-400 shrink-0 mt-0.5"/>
                          <div>
                            <p className="text-xs font-bold text-slate-500">Phone Number</p>
                            <p className="text-sm font-medium text-slate-800">+91 98765 43210</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Mail size={16} className="text-slate-400 shrink-0 mt-0.5"/>
                          <div>
                            <p className="text-xs font-bold text-slate-500">Email Address</p>
                            <p className="text-sm font-medium text-slate-800">priya.sharma@email.com</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5"/>
                          <div>
                            <p className="text-xs font-bold text-slate-500">Address</p>
                            <p className="text-sm font-medium text-slate-800 leading-tight">123, Green Park, New Delhi, India</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <FileText size={16} className="text-slate-400 shrink-0 mt-0.5"/>
                          <div>
                            <p className="text-xs font-bold text-slate-500">Occupation</p>
                            <p className="text-sm font-medium text-slate-800">Software Engineer</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <PhoneCall size={16} className="text-slate-400 shrink-0 mt-0.5"/>
                          <div>
                            <p className="text-xs font-bold text-slate-500">Emergency Contact</p>
                            <p className="text-sm font-medium text-slate-800">Rajesh Sharma (Father)<br />+91 91234 56789</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Middle Column */}
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="font-bold text-slate-800">Medical History</h3>
                        <button className="text-xs font-bold text-emerald-600 border border-emerald-200 rounded-lg px-2.5 py-1 flex items-center gap-1 hover:bg-emerald-50 transition">
                          <Edit2 size={12}/> Edit
                        </button>
                      </div>
                      <div className="space-y-4">
                        <div className="flex flex-row justify-between items-center pb-2 border-b border-slate-50">
                          <div className="flex items-center gap-2">
                            <HeartPulse size={16} className="text-slate-400"/>
                            <span className="text-sm font-bold text-slate-700">Chronic Diseases</span>
                          </div>
                          <span className="text-sm font-medium text-slate-500">No</span>
                        </div>
                        <div className="flex flex-row justify-between items-center pb-2 border-b border-slate-50">
                          <div className="flex items-center gap-2">
                            <Activity size={16} className="text-slate-400"/>
                            <span className="text-sm font-bold text-slate-700">Past Surgeries</span>
                          </div>
                          <span className="text-sm font-medium text-slate-500">No</span>
                        </div>
                        <div className="flex flex-row justify-between items-center pb-2 border-b border-slate-50">
                          <div className="flex items-center gap-2">
                            <FileText size={16} className="text-slate-400"/>
                            <span className="text-sm font-bold text-slate-700">Hospitalizations</span>
                          </div>
                          <span className="text-sm font-medium text-slate-500">No</span>
                        </div>
                        <div className="flex flex-row justify-between items-center pb-2 border-b border-slate-50">
                          <div className="flex items-center gap-2">
                            <User size={16} className="text-slate-400"/>
                            <span className="text-sm font-bold text-slate-700">Family Medical History</span>
                          </div>
                          <span className="text-sm font-medium text-slate-500">No</span>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-slate-400"/>
                            <span className="text-sm font-bold text-slate-700">Other Medical Conditions</span>
                          </div>
                          <span className="text-sm font-medium text-slate-500">No</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="font-bold text-slate-800">Lifestyle Information</h3>
                        <button className="text-xs font-bold text-emerald-600 border border-emerald-200 rounded-lg px-2.5 py-1 flex items-center gap-1 hover:bg-emerald-50 transition">
                          <Edit2 size={12}/> Edit
                        </button>
                      </div>
                      <div className="space-y-4">
                        <div className="flex flex-row justify-between items-center pb-2 border-b border-slate-50">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-700">Smoking</span>
                          </div>
                          <span className="text-sm font-medium text-slate-500">No</span>
                        </div>
                        <div className="flex flex-row justify-between items-center pb-2 border-b border-slate-50">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-700">Alcohol</span>
                          </div>
                          <span className="text-sm font-medium text-slate-500">Occasionally</span>
                        </div>
                        <div className="flex flex-row justify-between items-center pb-2 border-b border-slate-50">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-700">Exercise</span>
                          </div>
                          <span className="text-sm font-medium text-slate-500">3-4 times / week</span>
                        </div>
                        <div className="flex flex-row justify-between items-center pb-2 border-b border-slate-50">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-700">Diet</span>
                          </div>
                          <span className="text-sm font-medium text-slate-500">Vegetarian</span>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-700">Sleep</span>
                          </div>
                          <span className="text-sm font-medium text-slate-500">7-8 hours / night</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="font-bold text-slate-800">Allergies</h3>
                        <button className="text-xs font-bold text-emerald-600 border border-emerald-200 rounded-lg px-2.5 py-1 flex items-center gap-1 hover:bg-emerald-50 transition">
                          <Edit2 size={12}/> Edit
                        </button>
                      </div>
                      <div className="flex flex-col items-center text-center py-6">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-3">
                          <Check size={24}/>
                        </div>
                        <h4 className="font-bold text-emerald-600 mb-1">No Known Allergies</h4>
                        <p className="text-xs text-slate-500 mb-4">You have not added any allergy information.</p>
                        <button className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg px-4 py-2 flex items-center gap-1.5 transition">
                          <Plus size={14}/> Add Allergy
                        </button>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="font-bold text-slate-800">Current Medications</h3>
                        <button className="text-xs font-bold text-emerald-600 border border-emerald-200 rounded-lg px-2.5 py-1 flex items-center gap-1 hover:bg-emerald-50 transition">
                          <Edit2 size={12}/> Edit
                        </button>
                      </div>
                      <div className="flex flex-col items-center text-center py-6">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-3">
                          <Check size={24}/>
                        </div>
                        <h4 className="font-bold text-emerald-600 mb-1">No Current Medications</h4>
                        <p className="text-xs text-slate-500 mb-4">You are not taking any medications.</p>
                        <button className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg px-4 py-2 flex items-center gap-1.5 transition">
                          <Plus size={14}/> Add Medication
                        </button>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="font-bold text-slate-800">Immunization Records</h3>
                        <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition">View All</button>
                      </div>
                      <div className="space-y-4">
                        <div className="flex flex-row justify-between items-center pb-3 border-b border-slate-50">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-emerald-500"/>
                            <span className="text-sm font-bold text-slate-700">COVID-19 Vaccine</span>
                          </div>
                          <span className="text-sm font-medium text-slate-500">3 Doses</span>
                        </div>
                        <div className="flex flex-row justify-between items-center pb-3 border-b border-slate-50">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-emerald-500"/>
                            <span className="text-sm font-bold text-slate-700">Tetanus</span>
                          </div>
                          <span className="text-sm font-medium text-slate-500">16 Mar 2022</span>
                        </div>
                        <div className="flex flex-row justify-between items-center pb-3 border-b border-slate-50">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-emerald-500"/>
                            <span className="text-sm font-bold text-slate-700">Hepatitis B</span>
                          </div>
                          <span className="text-sm font-medium text-slate-500">06 Jan 2021</span>
                        </div>
                        <div className="flex flex-row justify-between items-center">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-emerald-500"/>
                            <span className="text-sm font-bold text-slate-700">Influenza</span>
                          </div>
                          <span className="text-sm font-medium text-slate-500">15 Oct 2023</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Health Documents */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-bold text-slate-800">Health Documents</h3>
                    <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition">View All</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition min-h-[140px]">
                      <div className="text-sky-500 mb-2">
                        <UploadCloud size={32}/>
                      </div>
                      <h4 className="text-sm font-bold text-emerald-600 mb-1">Upload Health Documents</h4>
                      <p className="text-[10px] text-slate-400">Drag and drop files here or click to browse<br />Supported files: PDF, JPG, PNG (Max 10MB)</p>
                    </div>

                    <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:shadow-sm transition bg-white min-h-[140px]">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-red-50 text-red-500 rounded-xl shrink-0">
                                <FileText size={24}/>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-800 line-clamp-1">Blood Test Report</h4>
                                <div className="flex gap-3 text-xs text-slate-500 mt-1">
                                    <span>12 Mar 2024</span>
                                    <span>1.2 MB</span>
                                </div>
                            </div>
                        </div>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition"><Download size={18}/></button>
                    </div>

                    <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:shadow-sm transition bg-white min-h-[140px]">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-50 text-blue-500 rounded-xl shrink-0">
                                <FileText size={24}/>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-800 line-clamp-1">X-Ray Chest</h4>
                                <div className="flex gap-3 text-xs text-slate-500 mt-1">
                                    <span>05 Feb 2024</span>
                                    <span>2.4 MB</span>
                                </div>
                            </div>
                        </div>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition"><Download size={18}/></button>
                    </div>

                    <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:shadow-sm transition bg-white min-h-[140px]">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-sky-50 text-sky-500 rounded-xl shrink-0">
                                <FileText size={24}/>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-800 line-clamp-1">ECG Report</h4>
                                <div className="flex gap-3 text-xs text-slate-500 mt-1">
                                    <span>20 Jan 2024</span>
                                    <span>1.8 MB</span>
                                </div>
                            </div>
                        </div>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition"><Download size={18}/></button>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex items-center gap-4">
                  <div className="p-3 bg-white text-emerald-600 rounded-full shadow-sm shrink-0">
                    <Shield size={24} className="fill-emerald-100"/>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Your health information is safe with us</h4>
                    <p className="text-xs text-slate-600 mt-0.5">We use advanced encryption and security measures to protect your personal health data.</p>
                  </div>
                </div>

              </div>)}

            {/* EMERGENCY CONTACTS VIEW */}
            {activeMenu === "Emergency Contacts" && (<div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden">
                  
                  {/* Primary Contact */}
                  <div className="mb-8">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                      Primary Emergency Contact 
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider">Primary Contact</span>
                    </h3>
                    <p className="text-xs text-slate-500 mb-6 border-b border-slate-100 pb-4">This contact will be notified first in case of an emergency.</p>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                      <div className="flex items-start gap-4">
                        <div className="size-12 rounded-full overflow-hidden bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg shrink-0 border border-emerald-200">
                          SS
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-bold text-slate-800">Sarah Smith</h4>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">Spouse</span>
                          </div>
                          <div className="space-y-1.5 pt-1">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Phone size={14} className="text-slate-400"/>
                              <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Mail size={14} className="text-slate-400"/>
                              <span>sarah.smith@example.com</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 md:pt-4">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <MapPin size={14} className="text-slate-400"/>
                            <span>123 Main Street, Apt 4B<br />Wellness City, HC 12345</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600 pb-1">
                            <Droplet size={14} className="text-slate-400"/>
                            <span>Relationship: Spouse</span>
                          </div>
                          <p className="text-xs font-semibold text-slate-500">Priority: 1 (Primary)</p>
                      </div>
                      
                      <div className="flex gap-2 shrink-0 md:pt-4">
                        <button className="p-2 text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition group">
                          <Edit2 size={16} className="group-hover:text-emerald-600 transition"/>
                        </button>
                        <button className="p-2 text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition group">
                          <Trash2 size={16} className="group-hover:text-rose-500 transition"/>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Other Contacts */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-slate-800">Other Emergency Contacts</h3>
                    <span className="text-xs font-bold text-slate-500">2 of 5 contacts added</span>
                  </div>
                  
                  <div className="space-y-6 pt-4 border-t border-slate-100">
                    
                    {/* Contact 2 */}
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-slate-100 pb-6">
                      <div className="flex items-start gap-4">
                        <div className="size-12 rounded-full overflow-hidden bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg shrink-0 border border-blue-100">
                          JM
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-bold text-slate-800">John Michael</h4>
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">Brother</span>
                          </div>
                          <div className="space-y-1.5 pt-1">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Phone size={14} className="text-slate-400"/>
                              <span>+1 (555) 987-6543</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Mail size={14} className="text-slate-400"/>
                              <span>john.michael@example.com</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 md:pt-4">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <MapPin size={14} className="text-slate-400"/>
                            <span>456 Oak Avenue<br />Wellness City, HC 12345</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600 pb-1">
                            <Droplet size={14} className="text-slate-400"/>
                            <span>Relationship: Brother</span>
                          </div>
                          <p className="text-xs font-semibold text-slate-500">Priority: 2</p>
                      </div>
                      
                      <div className="flex gap-2 shrink-0 md:pt-4">
                        <button className="p-2 text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition group">
                          <Edit2 size={16} className="group-hover:text-emerald-600 transition"/>
                        </button>
                        <button className="p-2 text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition group">
                          <Trash2 size={16} className="group-hover:text-rose-500 transition"/>
                        </button>
                      </div>
                    </div>

                    {/* Contact 3 */}
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                      <div className="flex items-start gap-4">
                        <div className="size-12 rounded-full overflow-hidden bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-lg shrink-0 border border-purple-100">
                          EM
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-bold text-slate-800">Emily Miller</h4>
                            <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">Friend</span>
                          </div>
                          <div className="space-y-1.5 pt-1">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Phone size={14} className="text-slate-400"/>
                              <span>+1 (555) 456-7890</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Mail size={14} className="text-slate-400"/>
                              <span>emily.miller@example.com</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 md:pt-4">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <MapPin size={14} className="text-slate-400"/>
                            <span>789 Pine Road<br />Wellness City, HC 12345</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600 pb-1">
                            <Droplet size={14} className="text-slate-400"/>
                            <span>Relationship: Friend</span>
                          </div>
                          <p className="text-xs font-semibold text-slate-500">Priority: 3</p>
                      </div>
                      
                      <div className="flex gap-2 shrink-0 md:pt-4">
                        <button className="p-2 text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition group">
                          <Edit2 size={16} className="group-hover:text-emerald-600 transition"/>
                        </button>
                        <button className="p-2 text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition group">
                          <Trash2 size={16} className="group-hover:text-rose-500 transition"/>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="bg-sky-50 border border-sky-100 rounded-2xl p-5 flex items-start gap-4">
                  <div className="p-2 bg-white text-sky-500 rounded-full shadow-sm shrink-0">
                    <Info size={20}/>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Why Emergency Contacts Matter</h4>
                    <p className="text-xs text-slate-600 mt-1">In case of a medical emergency, these contacts will be notified and can help make important decisions on your behalf if needed.</p>
                  </div>
                </div>

              </div>)}

            {/* INSURANCE DETAILS VIEW */}
            {activeMenu === "Insurance Details" && (<div className="space-y-6">
                
                {/* Primary Insurance */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-800 text-lg">Primary Insurance</h3>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wider">Primary</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Active</span>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-slate-100 pb-6 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                            <Shield size={24} className="fill-blue-100"/>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-base">Blue Cross Blue Shield</h4>
                            <p className="text-sm text-slate-500 font-medium">Health Insurance</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full md:w-auto">
                        <div>
                            <p className="text-xs text-slate-500 font-bold mb-1">Policy Number</p>
                            <p className="text-sm font-black text-slate-800">BCBS123456789</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-bold mb-1">Group Number</p>
                            <p className="text-sm font-black text-slate-800">GRP987654</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-bold mb-1">Member ID</p>
                            <p className="text-sm font-black text-slate-800">MEM12345678</p>
                        </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                      <div>
                          <p className="text-xs text-slate-500 font-bold mb-1">Policyholder Name</p>
                          <p className="text-sm font-bold text-slate-800">John Doe</p>
                      </div>
                      <div>
                          <p className="text-xs text-slate-500 font-bold mb-1">Date of Birth</p>
                          <p className="text-sm font-bold text-slate-800">May 15, 1995</p>
                      </div>
                      <div>
                          <p className="text-xs text-slate-500 font-bold mb-1">Relationship</p>
                          <p className="text-sm font-bold text-slate-800">Self</p>
                      </div>
                      <div>
                          <p className="text-xs text-slate-500 font-bold mb-1">Coverage Type</p>
                          <p className="text-sm font-bold text-slate-800">PPO</p>
                      </div>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="grid grid-cols-2 gap-8 w-full md:w-auto">
                        <div>
                            <p className="text-xs text-slate-500 font-bold mb-1">Plan Effective Date</p>
                            <div className="flex items-center gap-1.5">
                                <Calendar size={14} className="text-slate-400"/>
                                <span className="text-sm font-bold text-slate-800">Jan 01, 2024</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-bold mb-1">Plan Expiry Date</p>
                            <div className="flex items-center gap-1.5">
                                <Calendar size={14} className="text-slate-400"/>
                                <span className="text-sm font-bold text-slate-800">Dec 31, 2024</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 shrink-0 mt-6 md:mt-0 ml-auto">
                        <button className="p-2 text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition group">
                          <Edit2 size={16} className="group-hover:text-emerald-600 transition"/>
                        </button>
                        <button className="p-2 text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition group">
                          <Trash2 size={16} className="group-hover:text-rose-500 transition"/>
                        </button>
                    </div>
                  </div>
                </div>

                {/* Other Insurance */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800">Other Insurance Policies</h3>
                    <span className="text-xs font-bold text-slate-500">1 of 3 additional policies</span>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-slate-100 pb-6 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
                            <Shield size={24} className="fill-purple-100"/>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-base">Aetna Health Insurance</h4>
                            <p className="text-sm text-slate-500 font-medium">Health Insurance</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full md:w-auto">
                        <div>
                            <p className="text-xs text-slate-500 font-bold mb-1">Policy Number</p>
                            <p className="text-sm font-black text-slate-800">AETN987654321</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-bold mb-1">Group Number</p>
                            <p className="text-sm font-black text-slate-800">GRP112233</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-bold mb-1">Member ID</p>
                            <p className="text-sm font-black text-slate-800">MEM87654321</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-4 shrink-0">
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wider">Inactive</span>
                        <div className="flex gap-2">
                            <button className="p-2 text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition group">
                            <Edit2 size={16} className="group-hover:text-emerald-600 transition"/>
                            </button>
                            <button className="p-2 text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition group">
                            <Trash2 size={16} className="group-hover:text-rose-500 transition"/>
                            </button>
                        </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition">
                        View All Insurance Policies (1)
                    </button>
                  </div>
                </div>

                {/* Insurance Documents */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="font-bold text-slate-800">Insurance Documents</h3>
                        <p className="text-xs text-slate-500 mt-1">Upload and manage your insurance related documents.</p>
                    </div>
                    <button className="text-xs font-bold text-emerald-600 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-emerald-50 transition">
                        <UploadCloud size={14}/> Upload Document
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between bg-white hover:shadow-sm transition">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-12 bg-red-50 text-red-600 rounded border border-red-100 flex items-center justify-center font-bold text-[10px]">
                                PDF
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-800">Insurance Card - Front</h4>
                                <p className="text-[10px] text-slate-500 mt-0.5">Uploaded on May 10, 2024<br />245 KB</p>
                            </div>
                        </div>
                        <button className="p-1.5 text-slate-400 hover:text-slate-600 border border-slate-200 rounded-lg"><div className="w-1 h-1 bg-current rounded-full mb-0.5"></div><div className="w-1 h-1 bg-current rounded-full mb-0.5"></div><div className="w-1 h-1 bg-current rounded-full"></div></button>
                    </div>

                    <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between bg-white hover:shadow-sm transition">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-12 bg-red-50 text-red-600 rounded border border-red-100 flex items-center justify-center font-bold text-[10px]">
                                PDF
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-800">Insurance Card - Back</h4>
                                <p className="text-[10px] text-slate-500 mt-0.5">Uploaded on May 10, 2024<br />198 KB</p>
                            </div>
                        </div>
                        <button className="p-1.5 text-slate-400 hover:text-slate-600 border border-slate-200 rounded-lg"><div className="w-1 h-1 bg-current rounded-full mb-0.5"></div><div className="w-1 h-1 bg-current rounded-full mb-0.5"></div><div className="w-1 h-1 bg-current rounded-full"></div></button>
                    </div>

                    <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between bg-white hover:shadow-sm transition">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-12 bg-green-50 text-green-600 rounded border border-green-100 flex items-center justify-center font-bold text-[10px]">
                                JPG
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-800">Policy Document</h4>
                                <p className="text-[10px] text-slate-500 mt-0.5">Uploaded on May 10, 2024<br />1.2 MB</p>
                            </div>
                        </div>
                        <button className="p-1.5 text-slate-400 hover:text-slate-600 border border-slate-200 rounded-lg"><div className="w-1 h-1 bg-current rounded-full mb-0.5"></div><div className="w-1 h-1 bg-current rounded-full mb-0.5"></div><div className="w-1 h-1 bg-current rounded-full"></div></button>
                    </div>
                  </div>
                </div>

                <div className="bg-sky-50 border border-sky-100 rounded-2xl p-5 flex items-start gap-4">
                  <div className="p-2 bg-white text-sky-500 rounded-full shadow-sm shrink-0">
                    <Info size={20}/>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Keep Your Insurance Information Updated</h4>
                    <p className="text-xs text-slate-600 mt-1">Ensure your insurance details are up to date to avoid any issues during appointments and claim processing.</p>
                  </div>
                </div>

              </div>)}
            
            {/* Catch-all for non-implemented views */}
            {!["Profile Settings", "Account Settings", "Health Information", "Emergency Contacts", "Insurance Details"].includes(activeMenu) && (<div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">
                <p className="text-slate-500 font-medium">This section ({activeMenu}) is currently under construction.</p>
              </div>)}

          </div>
        </div>
      </div>
    </div>);
}
function MenuItem({ active, icon, label, onClick }) {
    return (<li>
      <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition cursor-pointer ${active
            ? "bg-emerald-50 text-emerald-700"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}>
        <span className={active ? "text-emerald-500" : "text-slate-400"}>{icon}</span>
        {label}
      </button>
    </li>);
}
