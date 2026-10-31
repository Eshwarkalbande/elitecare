import React, { useState } from "react";
import { MessageSquare, Mail, CheckCircle, TrendingUp, Bell, Search, ChevronRight, Download, Filter, RefreshCw, Calendar, ChevronDown, Star, Paperclip, Smile, Send, MoreVertical, Phone, MapPin, AlertCircle } from "lucide-react";
export default function MessagesPanel({ showToast }) {
    // Chat filtering tabs
    const [activeTab, setActiveTab] = useState("All Messages");
    const [dateRange, setDateRange] = useState("22 Apr 2024 - 22 May 2024");
    const [messageType, setMessageType] = useState("All Types");
    const [messageStatus, setMessageStatus] = useState("All Status");
    const [priorityParam, setPriorityParam] = useState("All Priority");
    // Chat conversation index holder
    const [activeConvIdx, setActiveConvIdx] = useState(0);
    // Send message textbox
    const [messageBody, setMessageBody] = useState("");
    const [activeInputTab, setActiveInputTab] = useState("Message");
    // Conversations list mocks
    const initialConversations = [
        {
            id: "CONV-00125",
            name: "Rahul Sharma",
            userType: "Patient",
            roleBadgeColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
            lastMsg: "Need appointment reschedule",
            time: "2 min ago",
            unreads: 2,
            starred: true,
            online: true,
            phone: "+91 98765 43210",
            email: "rahul.sharma@email.com",
            location: "New Delhi, India",
            detailsRef: "#ECU125487",
            joined: "12 Jan 2024",
            lastAppt: "20 May 2024",
            doctor: "Dr. Arjun Mehta",
            messages: [
                { sender: "patient", text: "Hi, I need to reschedule my appointment on 24th May.", time: "10:30 AM" },
                { sender: "nurse", text: "Hello Rahul, sure! I'll help you reschedule your appointment.", time: "10:31 AM", isCommitted: true },
                { sender: "patient", text: "Can we change it to 27th May evening?", time: "10:32 AM" },
                { sender: "nurse", text: "Yes, 27th May at 6:30 PM is available. Please confirm if that works for you.", time: "10:33 AM", isCommitted: true },
                { sender: "patient", text: "Yes, confirmed. Thank you!", time: "10:34 AM" },
            ],
            rating: 5
        },
        {
            id: "CONV-00126",
            name: "Priya Patel",
            userType: "Patient",
            roleBadgeColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
            lastMsg: "Prescription issue",
            time: "15 min ago",
            unreads: 1,
            starred: false,
            online: false,
            phone: "+91 91234 56789",
            email: "priya.patel@email.com",
            location: "Mumbai, India",
            detailsRef: "#ECU987123",
            joined: "18 Feb 2024",
            lastAppt: "15 May 2024",
            doctor: "Dr. Neha Kapoor",
            messages: [
                { sender: "patient", text: "Hello, my medicine brand is out of stock. Can you specify an alternative?", time: "11:20 AM" },
                { sender: "nurse", text: "I will check with Dr. Kapoor. One moment please.", time: "11:22 AM", isCommitted: true }
            ],
            rating: null
        },
        {
            id: "CONV-00127",
            name: "Dr. Mehta",
            userType: "Doctor",
            roleBadgeColor: "bg-blue-50 text-blue-700 border-blue-100",
            avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150",
            lastMsg: "Patient follow-up list is checked",
            time: "30 min ago",
            unreads: 0,
            starred: true,
            online: true,
            phone: "+91 99887 76655",
            email: "dr.mehta@elitecare.com",
            location: "Cabin B-12, Main Clinic",
            detailsRef: "#DOC-ARJUN",
            joined: "05 Aug 2022",
            lastAppt: "Today",
            doctor: "Chief Surgeon",
            messages: [
                { sender: "patient", text: "Nurse, please update the cardiac reports for Room 402.", time: "09:40 AM" },
                { sender: "nurse", text: "Already updated on the cloud dashboard, Doctor.", time: "09:42 AM", isCommitted: true },
                { sender: "patient", text: "Patient follow-up list is checked, thank you.", time: "10:00 AM" }
            ],
            rating: null
        },
        {
            id: "CONV-00128",
            name: "Anita Verma",
            userType: "Patient",
            roleBadgeColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
            lastMsg: "Health checkup details verified",
            time: "1 hr ago",
            unreads: 0,
            starred: false,
            online: true,
            phone: "+91 88776 55443",
            email: "anita.verma@gmail.com",
            location: "Bengaluru, India",
            detailsRef: "#ECU771239",
            joined: "22 Oct 2023",
            lastAppt: "10 May 2024",
            doctor: "Dr. Anil Verma",
            messages: [
                { sender: "patient", text: "Is fasting required for tomorrow's glucose lab test?", time: "08:15 AM" },
                { sender: "nurse", text: "Yes, Anita. Please fast for at least 8 hours prior to blood collection.", time: "08:18 AM", isCommitted: true },
                { sender: "patient", text: "Health checkup details verified", time: "08:30 AM" }
            ],
            rating: null
        },
        {
            id: "CONV-00129",
            name: "Amit Singh",
            userType: "Patient",
            roleBadgeColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
            avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150",
            lastMsg: "Payment related query dispatched",
            time: "2 hrs ago",
            unreads: 0,
            starred: false,
            online: false,
            phone: "+91 90000 11223",
            email: "amit.singh@gmail.com",
            location: "Kolkata, India",
            detailsRef: "#ECU445588",
            joined: "14 Nov 2023",
            lastAppt: "12 May 2024",
            doctor: "Dr. Priya Roy",
            messages: [
                { sender: "patient", text: "The transaction was debited twice. Can you examine, please?", time: "07:11 AM" },
                { sender: "nurse", text: "We have received the payment notification. One transaction will automatically refund in 3 days.", time: "07:14 AM", isCommitted: true }
            ],
            rating: null
        }
    ];
    const [conversations, setConversations] = useState(initialConversations);
    const currentChat = conversations[activeConvIdx] || conversations[0];
    // Send message execution
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!messageBody.trim())
            return;
        const updated = [...conversations];
        updated[activeConvIdx].messages.push({
            sender: "nurse",
            text: messageBody,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isCommitted: true
        });
        // Set last message text
        updated[activeConvIdx].lastMsg = messageBody;
        updated[activeConvIdx].time = "Just now";
        setConversations(updated);
        setMessageBody("");
        showToast("Message successfully delivered!");
    };
    const handleClearFilters = () => {
        setMessageType("All Types");
        setMessageStatus("All Status");
        setPriorityParam("All Priority");
        showToast("Filters restored to default.");
    };
    return (<div className="space-y-6 text-left" id="messages-panel">
      
      {/* HEADER ROW */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="text-slate-900 shrink-0" size={24}/>
            Messages
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Communicate and manage conversations across the platform
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Active Date Period */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-705 shadow-sm cursor-pointer hover:bg-slate-50">
            <Calendar size={13.5} className="text-slate-400"/>
            <span>22 Apr 2024 - 22 May 2024</span>
            <ChevronDown size={12} className="text-slate-400 ml-1"/>
          </div>

          <button onClick={() => showToast("Showing chat filter layers...")} className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm cursor-pointer hover:bg-slate-50">
            <Filter size={13} className="text-slate-500"/>
            <span>Filters</span>
          </button>

          <button onClick={() => showToast("Exporting patient conversational log files...")} className="flex items-center gap-1.5 bg-white border border-slate-205 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm cursor-pointer hover:bg-slate-50 mr-1">
            <Download size={13} className="text-slate-500"/>
            <span>Export Chats</span>
          </button>

          {/* Profile bell and notification counters */}
          <button onClick={() => showToast("Showing panel notifications...")} className="size-9 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 flex items-center justify-center relative transition cursor-pointer shadow-sm animate-pulse">
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

      {/* KPI METRICS BAR row of 5 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Card 1: Total Messages */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-450 text-slate-400 font-extrabold uppercase tracking-wider">Total Messages</p>
              <h3 className="text-2xl font-black text-slate-950 font-mono mt-2">8,542</h3>
            </div>
            <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-650 flex items-center justify-center border border-indigo-100/50">
              <MessageSquare size={18}/>
            </div>
          </div>
          <div className="pt-3 text-[11px] font-bold text-emerald-600 font-mono flex items-center gap-1">
            <span>↑</span>
            <span>18.6% <span className="text-slate-400 font-sans font-medium">vs last 30 days</span></span>
          </div>
        </div>

        {/* Card 2: Unread Messages */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-450 text-slate-400 font-extrabold uppercase tracking-wider">Unread Messages</p>
              <h3 className="text-2xl font-black text-slate-950 font-mono mt-2">324</h3>
            </div>
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-650 flex items-center justify-center border border-emerald-100/50">
              <Mail size={18} className="text-emerald-660 text-emerald-600"/>
            </div>
          </div>
          <div className="pt-3 text-[11px] font-bold text-rose-600 font-mono flex items-center gap-1">
            <span>↓</span>
            <span>8.2% <span className="text-slate-405 text-slate-400 font-sans font-medium">vs last 30 days</span></span>
          </div>
        </div>

        {/* Card 3: Resolved Conversations */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Resolved Conversations</p>
              <h3 className="text-2xl font-black text-slate-950 font-mono mt-2">7,891</h3>
            </div>
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-650 flex items-center justify-center border border-amber-100/50">
              <CheckCircle size={18} className="text-amber-600"/>
            </div>
          </div>
          <div className="pt-3 text-[11px] font-bold text-emerald-600 font-mono flex items-center gap-1">
            <span>↑</span>
            <span>22.4% <span className="text-slate-400 font-sans font-medium">vs last 30 days</span></span>
          </div>
        </div>

        {/* Card 4: Active Chats */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Active Chats</p>
              <h3 className="text-2xl font-black text-slate-950 font-mono mt-2">126</h3>
            </div>
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-650 flex items-center justify-center border border-blue-105/50">
              <MessageSquare size={18} className="text-blue-600"/>
            </div>
          </div>
          <div className="pt-3 text-[11px] font-bold text-emerald-600 font-mono flex items-center gap-1">
            <span>↑</span>
            <span>12.6% <span className="text-slate-400 font-sans font-medium">vs last 30 days</span></span>
          </div>
        </div>

        {/* Card 5: Response Rate */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Response Rate</p>
              <h3 className="text-2xl font-black text-slate-950 font-mono mt-2">96.8%</h3>
            </div>
            <div className="p-2.5 rounded-2xl bg-teal-50 text-teal-650 flex items-center justify-center border border-teal-100/50">
              <TrendingUp size={18} className="text-teal-600"/>
            </div>
          </div>
          <div className="pt-3 text-[11px] font-bold text-emerald-600 font-mono flex items-center gap-1">
            <span>↑</span>
            <span>5.3% <span className="text-slate-405 text-slate-400 font-sans font-medium">vs last 30 days</span></span>
          </div>
        </div>

      </div>

      {/* SEARCH AND FILTER CRITERIA DROPDOWNS BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
          
          <div className="space-y-1.5">
            <label className="text-[10pt] font-bold text-slate-400 uppercase tracking-tight">Date Range</label>
            <div className="relative">
              <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="appearance-none w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs py-2 px-3 pr-8 rounded-xl font-medium focus:outline-none cursor-pointer animate-none">
                <option>22 Apr 2024 - 22 May 2024</option>
                <option>Today Only</option>
                <option>Last 30 Days</option>
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10pt] font-bold text-slate-400 uppercase tracking-tight">Message Type</label>
            <div className="relative">
              <select value={messageType} onChange={(e) => setMessageType(e.target.value)} className="appearance-none w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs py-2 px-3 pr-8 rounded-xl font-medium focus:outline-none cursor-pointer">
                <option value="All Types">All Types</option>
                <option value="Direct Patient">Direct Patients</option>
                <option value="Doctor Referral">Clinical Doctors</option>
                <option value="Escalations">Escalations</option>
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10pt] font-bold text-slate-400 uppercase tracking-tight">Status</label>
            <div className="relative">
              <select value={messageStatus} onChange={(e) => setMessageStatus(e.target.value)} className="appearance-none w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs py-2 px-3 pr-8 rounded-xl font-medium focus:outline-none">
                <option value="All Status">All Status</option>
                <option value="Open">Open Only</option>
                <option value="Pending">Pending Only</option>
                <option value="Resolved">Resolved Only</option>
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10pt] font-bold text-slate-400 uppercase tracking-tight">Priority</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <select value={priorityParam} onChange={(e) => setPriorityParam(e.target.value)} className="appearance-none w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs py-2 px-3 pr-8 rounded-xl font-medium focus:outline-none cursor-pointer">
                  <option value="All Priority">All Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
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

      {/* MAIN CHAT ROW layout: 3 panes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch min-h-[550px]">
        
        {/* Pane 1: Conversations List side (col-span-3) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden">
          
          <div className="p-3.5 border-b border-slate-100">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Conversations</h3>
            </div>
            
            {/* Find Text Box */}
            <div className="relative flex items-center">
              <Search size={14} className="absolute left-3 text-slate-400 pointer-events-none"/>
              <input type="text" placeholder="Search conversations..." className="w-full text-xs pl-8.5 pr-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-755 font-medium placeholder:text-slate-400"/>
              <button onClick={() => showToast("Showing filters...")} className="absolute right-3 text-slate-450 hover:text-slate-700 cursor-pointer text-slate-400">
                <Filter size={13}/>
              </button>
            </div>

            {/* Selection tags container row */}
            <div className="flex flex-wrap gap-1 mt-2.5">
              {[
            { name: "All Messages", count: "8,542" },
            { name: "Unread", count: "324" },
            { name: "Starred", count: "128" },
            { name: "Doctors", count: "1,245" },
            { name: "Patients", count: "6,765" }
        ].map((tag, idx) => {
            const isActive = activeTab === tag.name;
            return (<button key={idx} onClick={() => { setActiveTab(tag.name); showToast(`Active view: ${tag.name}`); }} className={`text-[9.5px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 border cursor-pointer transition ${isActive
                    ? "bg-slate-900 border-slate-950 text-white"
                    : "bg-slate-50 border-slate-150 text-slate-500 hover:bg-slate-100"}`}>
                    <span>{tag.name}</span>
                    <span className={`text-[8px] px-1 rounded-full ${isActive ? "bg-slate-700" : "bg-slate-200/60 text-slate-600"}`}>{tag.count}</span>
                  </button>);
        })}
            </div>
          </div>

          {/* Scrollable list body */}
          <div className="flex-1 divide-y divide-slate-50 max-h-[380px] overflow-y-auto">
            {conversations.map((thread, idx) => {
            const isActive = activeConvIdx === idx;
            return (<div key={thread.id} onClick={() => setActiveConvIdx(idx)} className={`p-3 text-left flex gap-2.5 items-start cursor-pointer hover:bg-slate-50 transition ${isActive ? "bg-indigo-50/50" : ""}`}>
                  <div className="relative shrink-0 mt-0.5">
                    <img src={thread.avatar} alt={thread.name} referrerPolicy="no-referrer" className="w-9 h-9 rounded-full object-cover border border-slate-200"/>
                    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${thread.online ? "bg-emerald-500" : "bg-blue-400"}`}/>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <p className={`text-xs truncate ${isActive ? "font-black text-indigo-950" : "font-extrabold text-slate-800"}`}>{thread.name}</p>
                      <span className="text-[9px] text-slate-400 font-mono font-bold shrink-0">{thread.time}</span>
                    </div>
                    <p className={`text-[10.5px] truncate ${thread.unreads > 0 ? "font-bold text-slate-900" : "text-slate-450 text-slate-400"}`}>
                      {thread.lastMsg}
                    </p>
                  </div>

                  {thread.unreads > 0 && (<span className="bg-indigo-600 text-white text-[9px] font-bold font-mono h-4 w-4 rounded-full flex items-center justify-center shrink-0 mt-2">
                      {thread.unreads}
                    </span>)}
                </div>);
        })}
          </div>

          <button onClick={() => showToast("Loading earlier database conversations...")} className="w-full text-center py-2 text-[10.5px] font-black uppercase text-slate-400 hover:text-slate-600 hover:bg-slate-50 border-t border-slate-100 cursor-pointer select-none">
            Load More Conversations &darr;
          </button>
        </div>

        {/* Pane 2: Message Conversation Window (col-span-6) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden">
          
          {/* Active Chat Top Line */}
          <div className="bg-white border-b border-slate-100 p-3.5 flex justify-between items-center sm:px-4.5">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <img src={currentChat.avatar} alt={currentChat.name} referrerPolicy="no-referrer" className="w-9 h-9 rounded-full object-cover border border-slate-200"/>
                <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${currentChat.online ? "bg-emerald-500" : "bg-blue-400"}`}/>
              </div>
              <div className="text-left">
                <p className="font-extrabold text-slate-900 text-xs">{currentChat.name}</p>
                <div className="flex items-center gap-1 text-[9.5px] text-slate-400">
                  <span className={`w-1 h-1 rounded-full ${currentChat.online ? "bg-emerald-500" : "bg-slate-350 bg-slate-300"}`}/>
                  <span>{currentChat.online ? "Online" : "Away"}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <button onClick={() => {
            const updated = [...conversations];
            updated[activeConvIdx].starred = !updated[activeConvIdx].starred;
            setConversations(updated);
            showToast(updated[activeConvIdx].starred ? "Conversation starred" : "Conversation unstarred");
        }} className={`p-1.5 rounded-lg hover:bg-slate-50 transition cursor-pointer ${currentChat.starred ? "text-amber-500" : "hover:text-slate-600"}`}>
                <Star size={14} fill={currentChat.starred ? "currentColor" : "none"}/>
              </button>

              <button onClick={() => showToast("Opening attachments folder...")} className="p-1.5 rounded-lg hover:bg-slate-50 hover:text-slate-600 transition cursor-pointer">
                <Paperclip size={14}/>
              </button>

              <div className="border-l border-slate-150 h-5 my-1 mx-0.5"/>

              <button onClick={() => showToast("Opening contextual menu options...")} className="p-1.5 rounded-lg hover:bg-slate-50 hover:text-slate-600 transition cursor-pointer">
                <MoreVertical size={14}/>
              </button>
            </div>
          </div>

          {/* Message Thread Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/20 max-h-[290px] min-h-[260px]">
            <div className="text-center relative">
              <span className="relative z-10 bg-slate-100 text-slate-500 text-[9px] font-bold font-mono uppercase px-2.5 py-0.5 rounded-md border border-slate-150">Today</span>
            </div>

            {currentChat.messages.map((msg, idx) => {
            const isPatient = msg.sender === "patient";
            return (<div key={idx} className={`flex gap-2.5 items-start ${isPatient ? "justify-start text-left" : "justify-end text-right"}`}>
                  
                  {isPatient && (<img src={currentChat.avatar} alt="" className="w-6.5 h-6.5 rounded-full object-cover shrink-0 border border-slate-200 mt-1"/>)}

                  <div className="max-w-[80%]">
                    <div className={`p-2.5 rounded-2xl text-[11px] leading-relaxed shadow-sm font-sans ${isPatient
                    ? "bg-white text-slate-800 border border-slate-150 rounded-tl-none"
                    : "bg-[#ecfdf5] text-[#065f46] border border-emerald-110 border-emerald-100 rounded-tr-none"}`}>
                      <p className="font-medium whitespace-pre-wrap">{msg.text}</p>
                    </div>
                    <div className={`flex items-center gap-1.5 text-[8.5px] text-slate-400 mt-1 ${isPatient ? "justify-start pl-1" : "justify-end pr-1"}`}>
                      <span className="font-mono font-medium">{msg.time}</span>
                      {!isPatient && (<span className="text-emerald-500 font-bold">✓✓</span>)}
                    </div>
                  </div>

                </div>);
        })}

            {/* Satisfaction Rating Banner */}
            {currentChat.rating && (<div className="text-center py-2 bg-amber-50 border border-amber-100 rounded-xl space-y-1 mx-2">
                <p className="text-[10px] text-amber-800 font-extrabold leading-none">
                  {currentChat.name} rated this conversation
                </p>
                <div className="flex justify-center gap-0.5 text-amber-500">
                  {Array.from({ length: currentChat.rating }).map((_, i) => (<Star key={i} size={11.5} fill="currentColor"/>))}
                </div>
              </div>)}
          </div>

          {/* Chat text area draft board */}
          <div className="p-3 bg-white border-t border-slate-100">
            {/* Input toggle headers */}
            <div className="flex gap-4 border-b border-slate-100 pb-1.5 mb-2 px-1 text-xs">
              <button onClick={() => setActiveInputTab("Message")} className={`pb-1 px-1 font-bold transition select-none cursor-pointer ${activeInputTab === "Message" ? "border-b-2 border-indigo-600 text-slate-900" : "text-slate-400 hover:text-slate-600"}`}>
                Message
              </button>
              <button onClick={() => setActiveInputTab("Note")} className={`pb-1 px-1 font-bold transition select-none cursor-pointer ${activeInputTab === "Note" ? "border-b-2 border-indigo-600 text-slate-900" : "text-slate-400 hover:text-slate-600"}`}>
                Note (Private draft)
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 flex gap-2 items-center">
                <button type="button" onClick={() => showToast("Opening emojis menu...")} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <Smile size={16}/>
                </button>
                <button type="button" onClick={() => showToast("Choose clinical folder attachment...")} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <Paperclip size={16}/>
                </button>
                
                <input type="text" value={messageBody} onChange={(e) => setMessageBody(e.target.value)} placeholder={activeInputTab === "Message" ? "Type your message..." : "Write internal clinic note (visible only to admins)..."} className="bg-transparent flex-1 focus:outline-none text-xs text-slate-800 py-1"/>
              </div>

              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2 px-4 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer shrink-0 h-[36px]">
                <span>Send</span>
                <Send size={11}/>
              </button>
            </form>

            {/* Quick Response shortcuts */}
            <div className="flex flex-wrap gap-1 mt-2.5 pt-2 border-t border-slate-50">
              {[
            { name: "Appointment Info", action: "Here is your appointment info details: Date..." },
            { name: "Reschedule", action: "We can reschedule you on Monday next week. Please confirm." },
            { name: "Prescription Help", action: "Your prescription was sent to your local pharmacy." },
            { name: "Billing Support", action: "Our billing officer is examining your duplicate charge." }
        ].map((shortcut, i) => (<button key={i} type="button" onClick={() => { setMessageBody(shortcut.action); showToast(`Template injected: ${shortcut.name}`); }} className="bg-slate-55 bg-slate-100 hover:bg-slate-150 border border-slate-200 rounded-lg py-1 px-2 text-[10px] font-bold text-slate-600 cursor-pointer select-none transition">
                  {shortcut.name}
                </button>))}
            </div>

          </div>

        </div>

        {/* Pane 3: User Details (col-span-3) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-4.5 flex flex-col justify-between text-left">
          
          <div className="space-y-4">
            {/* Minimal profile card top */}
            <div className="text-center space-y-2 border-b border-slate-100 pb-4">
              <img src={currentChat.avatar} alt="" referrerPolicy="no-referrer" className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-indigo-100 p-0.5"/>
              <div>
                <h3 className="text-sm font-black text-slate-900">{currentChat.name}</h3>
                <span className="inline-block mt-1 font-bold text-[9.5px] uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100">
                  {currentChat.userType}
                </span>
              </div>
            </div>

            {/* Communication links list */}
            <div className="space-y-2.5 text-xs text-slate-600 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <Mail size={13} className="text-slate-400"/>
                <span className="font-semibold select-all text-[11px] text-slate-700 truncate">{currentChat.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={13} className="text-slate-400"/>
                <span className="font-bold select-all text-[11px] text-slate-705 font-mono">{currentChat.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin size={13} className="text-slate-400"/>
                <span className="font-semibold text-[11px] text-slate-700">{currentChat.location}</span>
              </div>
            </div>

            {/* Static descriptive matrix */}
            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-400 font-medium">User ID</span>
                <span className="font-mono text-slate-800 font-bold">{currentChat.detailsRef}</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-400 font-medium">Member Since</span>
                <span className="text-slate-755 font-bold text-slate-700">{currentChat.joined}</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-400 font-medium">Last Appointment</span>
                <span className="text-slate-755 font-bold text-slate-700">{currentChat.lastAppt}</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-400 font-medium">Assigned Doctor</span>
                <span className="text-indigo-600 font-bold hover:underline cursor-pointer">{currentChat.doctor}</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-400 font-medium">Health Status</span>
                <span className="bg-emerald-100 text-emerald-800 font-black text-[9px] px-1.5 py-0.5 rounded font-mono uppercase">Good</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-400 font-medium">Total Appointments</span>
                <span className="font-mono text-slate-800 font-bold">6</span>
              </div>
            </div>
          </div>

          <button onClick={() => showToast(`Redirecting to full profile view for customer ${currentChat.id}...`)} className="w-full bg-slate-900 group-hover:bg-slate-800 text-white hover:bg-slate-800 py-2.5 rounded-xl text-xs font-black uppercase text-center mt-4 transition cursor-pointer flex items-center justify-center gap-1 shadow-sm">
            <span>View Full Profile</span>
            <ChevronRight size={13}/>
          </button>

        </div>

      </div>

      {/* BOTTOM DASHBOARD analytics rows: 1 horizontal grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Graph Block 1: Message Trend (col-span-4) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
            <div>
              <h3 className="text-xs font-extrabold text-slate-900 tracking-tight">Message Trend</h3>
              <p className="text-[10px] text-slate-400">Total conversations over elapsed time</p>
            </div>
            
            <div className="flex items-center gap-1.5">
              <span className="text-[8px] font-bold text-slate-400 shrink-0">Daily</span>
              <ChevronDown size={10} className="text-slate-400"/>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[8px] font-bold text-slate-500 mt-2">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-indigo-600"/> Received</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"/> Replied</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"/> Resolved</span>
          </div>

          <div className="h-32 mt-3 relative flex items-end">
            <svg className="w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="none">
              {/* Grid lines */}
              <line x1="0" y1="15" x2="200" y2="15" stroke="#f8fafc" strokeWidth="1"/>
              <line x1="0" y1="40" x2="200" y2="40" stroke="#f8fafc" strokeWidth="1"/>
              <line x1="0" y1="65" x2="200" y2="65" stroke="#f8fafc" strokeWidth="1"/>
              {/* Wave 1 */}
              <path d="M 0,60 Q 30,35 60,45 T 120,30 T 180,50 T 200,45" fill="none" stroke="#6366f1" strokeWidth="1.6"/>
              {/* Wave 2 */}
              <path d="M 0,72 Q 30,55 60,61 T 120,40 T 180,62 T 200,55" fill="none" stroke="#10b981" strokeWidth="1.6"/>
              {/* Wave 3 */}
              <path d="M 0,78 Q 30,68 60,72 T 120,55 T 180,70 T 200,68" fill="none" stroke="#3b82f6" strokeWidth="1.2"/>
            </svg>
            <div className="absolute left-0 right-0 bottom-0 flex justify-between px-1 text-[7px] font-mono font-bold text-slate-400">
              <span>22 Apr</span>
              <span>02 May</span>
              <span>12 May</span>
              <span>22 May</span>
            </div>
          </div>
        </div>

        {/* Graph Block 2: Messages by Category (col-span-4) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
            <h3 className="text-xs font-extrabold text-slate-900 tracking-tight">Messages by Category</h3>
            <select className="bg-slate-50 border border-slate-200 text-[9px] font-bold text-slate-505 rounded px-1.5 focus:outline-none">
              <option>All Types</option>
            </select>
          </div>

          <div className="flex items-center gap-4 py-3 justify-between">
            {/* Doughnut graph */}
            <div className="relative w-22 h-22 flex items-center justify-center shrink-0">
              <div className="absolute text-center">
                <p className="text-[7.5px] font-bold text-slate-400 uppercase leading-none">Total</p>
                <p className="text-xs font-black text-slate-805 font-mono mt-0.5">8,542</p>
              </div>
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="44" cy="44" r="34" fill="transparent" stroke="#f1f5f9" strokeWidth="7"/>
                {/* Segment 1 */}
                <circle cx="44" cy="44" r="34" fill="transparent" stroke="#6366f1" strokeWidth="7" strokeDasharray="213" strokeDashoffset="90"/>
                {/* Segment 2 */}
                <circle cx="44" cy="44" r="34" fill="transparent" stroke="#10b981" strokeWidth="7" strokeDasharray="213" strokeDashoffset="142"/>
                {/* Segment 3 */}
                <circle cx="44" cy="44" r="34" fill="transparent" stroke="#14b8a6" strokeWidth="7" strokeDasharray="213" strokeDashoffset="171"/>
                {/* Segment 4 */}
                <circle cx="44" cy="44" r="34" fill="transparent" stroke="#f97316" strokeWidth="7" strokeDasharray="213" strokeDashoffset="193"/>
                {/* Segment 5 */}
                <circle cx="44" cy="44" r="34" fill="transparent" stroke="#a855f7" strokeWidth="7" strokeDasharray="213" strokeDashoffset="204"/>
              </svg>
            </div>

            {/* Legend checklist */}
            <div className="space-y-0.5 text-[8.5px] font-bold text-slate-650 flex-1 leading-snug">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1 w-18 truncate"><span className="w-1 h-1 bg-indigo-500 rounded-full"/> Appointment Queries</span>
                <span className="font-mono text-slate-800 text-right">42.6%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1 w-18 truncate"><span className="w-1 h-1 bg-emerald-500 rounded-full"/> Health Consultation</span>
                <span className="font-mono text-slate-800 text-right">24.7%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1 w-18 truncate"><span className="w-1 h-1 bg-teal-500 rounded-full"/> Billing & Payments</span>
                <span className="font-mono text-slate-800 text-right">13.8%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1 w-18 truncate"><span className="w-1 h-1 bg-orange-500 rounded-full"/> Prescription Issues</span>
                <span className="font-mono text-slate-800 text-right">10.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1 w-18 truncate"><span className="w-1 h-1 bg-purple-500 rounded-full"/> Feedback</span>
                <span className="font-mono text-slate-800 text-right">5.1%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1 w-18 truncate"><span className="w-1 h-1 bg-slate-400 rounded-full"/> Others</span>
                <span className="font-mono text-slate-800 text-right">3.6%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Table Block 3: Recent Conversations (col-span-4) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
            <h3 className="text-xs font-extrabold text-slate-900 tracking-tight">Recent Conversations</h3>
            <button onClick={() => showToast("Showing all active chats...")} className="text-[10px] font-bold text-indigo-650 hover:underline">View All &rarr;</button>
          </div>

          <div className="mt-3 flex-1 overflow-x-auto">
            <table className="w-full text-left font-sans text-[11px]">
              <thead>
                <tr className="border-b border-slate-100 text-[9px] text-slate-405 font-bold uppercase text-slate-400">
                  <th className="pb-2">User</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Priority</th>
                  <th className="pb-2">Last Message</th>
                  <th className="pb-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                {[
            { name: "Rahul Sharma", type: "Appointment", pStyle: "bg-rose-50 text-rose-700", priority: "High", time: "2 mins ago", status: "Open", sStyle: "bg-emerald-55 bg-emerald-50 text-emerald-800" },
            { name: "Priya Patel", type: "Prescription", pStyle: "bg-orange-50 text-orange-700", priority: "Medium", time: "15 mins ago", status: "Pending", sStyle: "bg-amber-50 text-amber-850" },
            { name: "Dr. Mehta", type: "Consultation", pStyle: "bg-blue-50 text-blue-700", priority: "Low", time: "30 mins ago", status: "Resolved", sStyle: "bg-slate-100 text-slate-600" },
            { name: "Anita Verma", type: "Health Query", pStyle: "bg-orange-50 text-orange-700", priority: "Medium", time: "1 hr ago", status: "Open", sStyle: "bg-emerald-55 bg-emerald-50 text-emerald-800" },
            { name: "Amit Singh", type: "Billing", pStyle: "bg-blue-50 text-blue-700", priority: "Low", time: "2 hrs ago", status: "Closed", sStyle: "bg-slate-100 text-slate-600" }
        ].map((row, i) => (<tr key={i} className="hover:bg-slate-50/50">
                    <td className="py-2.5 font-bold text-slate-800">{row.name}</td>
                    <td className="py-2.5 text-slate-450 text-slate-500">{row.type}</td>
                    <td className="py-2.5">
                      <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-black uppercase font-mono ${row.pStyle}`}>{row.priority}</span>
                    </td>
                    <td className="py-2.5 text-slate-450 font-mono text-[9.5px] text-slate-400">{row.time}</td>
                    <td className="py-2.5 text-center">
                      <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-bold font-sans ${row.sStyle}`}>{row.status}</span>
                    </td>
                  </tr>))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Option Action Column 4: Quick Actions panel (col-span-12 or standalone) */}
        <div className="lg:col-span-12 bg-indigo-50/40 p-4 rounded-2xl border border-indigo-100/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-indigo-905">
            <AlertCircle size={16} className="text-indigo-600"/>
            <p className="text-[11px] font-bold text-slate-700 font-sans leading-relaxed">
              <strong>Quick Actions:</strong> Launch new medical dispatches, apply automated artificial intelligent recommended follow-ups, or publish general bulletin alerts across the EliteCare node network.
            </p>
          </div>
          
          <div className="flex flex-wrap lg:flex-nowrap gap-2 shrink-0">
            <button onClick={() => showToast("Creating fresh outbound message block...")} className="bg-indigo-650 hover:bg-indigo-700 bg-indigo-600 text-white font-extrabold text-[10.5px] px-3.5 py-2.5 rounded-xl transition cursor-pointer">
              New Message
            </button>
            <button onClick={() => showToast("Analyzing chat for AI response generation...")} className="bg-white border border-slate-200 text-slate-700 font-extrabold text-[10.5px] px-3.5 py-2.5 rounded-xl hover:bg-slate-50 transition cursor-pointer">
              AI Suggested Replies
            </button>
            <button onClick={() => showToast("Opening broadcast bulletin board form...")} className="bg-white border border-slate-200 text-slate-700 font-extrabold text-[10.5px] px-3.5 py-2.5 rounded-xl hover:bg-slate-50 transition cursor-pointer">
              Broadcast Message
            </button>
            <button onClick={() => showToast("Archiving Chat logs to report vault...")} className="bg-white border border-slate-200 text-slate-700 font-extrabold text-[10.5px] px-3.5 py-2.5 rounded-xl hover:bg-slate-50 transition cursor-pointer">
              Export Chats
            </button>
          </div>
        </div>

      </div>

      {/* Information Banner Info Footer Strip */}
      <div className="bg-slate-50 border border-slate-200 p-4.5 rounded-2xl flex items-start gap-3">
        <div className="p-1.5 bg-slate-200/60 rounded-lg text-slate-500 shrink-0 mt-0.5">
          <AlertCircle size={15}/>
        </div>
        <div className="text-left select-none text-[11px] text-slate-500 font-sans leading-normal">
          Messages Management helps administrators communicate with patients, doctors, and hospitals efficiently while tracking response times and support performance.
        </div>
      </div>

    </div>);
}
