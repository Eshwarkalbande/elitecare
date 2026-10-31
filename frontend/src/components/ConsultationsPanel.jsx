import React, { useState } from "react";
import { Video, CheckCircle2, MessageSquare, XOctagon, Search, Filter, Download, Eye, MoreHorizontal, ChevronDown, ArrowDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, CalendarDays } from "lucide-react";
export default function ConsultationsPanel({ showToast }) {
    const [searchQuery, setSearchQuery] = useState("");
    const stats = [
        { label: "Total Consultations", value: "6,543", icon: Video, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-100", trend: "↑ 20.4%", trendMuted: "vs last 30 days", isPositive: true },
        { label: "Completed", value: "5,230", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-100", trend: "↑ 19.6%", trendMuted: "vs last 30 days", isPositive: true },
        { label: "Video Consultations", value: "4,125", icon: Video, color: "text-purple-500", bg: "bg-purple-50", border: "border-purple-100", trend: "↑ 22.1%", trendMuted: "vs last 30 days", isPositive: true },
        { label: "Chat Consultations", value: "1,896", icon: MessageSquare, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-100", trend: "↑ 17.3%", trendMuted: "vs last 30 days", isPositive: true },
        { label: "Cancelled", value: "321", icon: XOctagon, color: "text-rose-500", bg: "bg-rose-50", border: "border-rose-100", trend: "↓ 8.7%", trendMuted: "vs last 30 days", isPositive: false },
    ];
    const renderStatus = (status) => {
        switch (status) {
            case "Completed":
                return <span className="px-2.5 py-1 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800">Completed</span>;
            case "Cancelled":
                return <span className="px-2.5 py-1 text-[10px] font-bold rounded bg-rose-100 text-rose-800">Cancelled</span>;
            default:
                return <span className="px-2.5 py-1 text-[10px] font-bold rounded bg-slate-100 text-slate-800">{status}</span>;
        }
    };
    const renderType = (type) => {
        switch (type) {
            case "Chat":
                return <span className="px-2.5 py-1 text-[10px] font-bold rounded text-amber-600 bg-amber-50">{type}</span>;
            case "Video Call":
                return <span className="px-2.5 py-1 text-[10px] font-bold rounded text-purple-600 bg-purple-50">{type}</span>;
            default:
                return <span className="px-2.5 py-1 text-[10px] font-bold rounded bg-slate-100 text-slate-500">{type}</span>;
        }
    };
    const mockTableData = [
        { id: "#CONS563", patName: "Ramesh Kumar", patPhone: "+91 98765 43210", docName: "Dr. Amit Verma", docSpec: "General Physician", patImg: "https://i.pravatar.cc/150?u=1", docImg: "https://i.pravatar.cc/150?u=doc1", type: "Video Call", date: "22 May 2024", time: "10:30 AM", duration: "00:15:24", status: "Completed", amount: "₹800" },
        { id: "#CONS562", patName: "Priya Sharma", patPhone: "+91 91234 56789", docName: "Dr. Neha Kapoor", docSpec: "Dermatologist", patImg: "https://i.pravatar.cc/150?u=2", docImg: "https://i.pravatar.cc/150?u=doc2", type: "Chat", date: "22 May 2024", time: "09:15 AM", duration: "00:08:46", status: "Completed", amount: "₹500" },
        { id: "#CONS561", patName: "Arjun Singh", patPhone: "+91 99887 76655", docName: "Dr. Vivek Mehta", docSpec: "Orthopedic", patImg: "https://i.pravatar.cc/150?u=3", docImg: "https://i.pravatar.cc/150?u=doc3", type: "Video Call", date: "21 May 2024", time: "04:45 PM", duration: "00:12:18", status: "Completed", amount: "₹800" },
        { id: "#CONS560", patName: "Sneha Patel", patPhone: "+91 98765 12345", docName: "Dr. Priya Sharma", docSpec: "Pediatrician", patImg: "https://i.pravatar.cc/150?u=4", docImg: "https://i.pravatar.cc/150?u=doc4", type: "Video Call", date: "21 May 2024", time: "11:20 AM", duration: "00:10:05", status: "Completed", amount: "₹800" },
        { id: "#CONS559", patName: "Vikram Malhotra", patPhone: "+91 87654 32109", docName: "Dr. Amit Verma", docSpec: "General Physician", patImg: "https://i.pravatar.cc/150?u=5", docImg: "https://i.pravatar.cc/150?u=doc1", type: "Chat", date: "20 May 2024", time: "02:10 PM", duration: "00:06:33", status: "Cancelled", amount: "₹0" },
        { id: "#CONS558", patName: "Anjali Gupta", patPhone: "+91 98989 45678", docName: "Dr. Neha Kapoor", docSpec: "Dermatologist", patImg: "https://i.pravatar.cc/150?u=6", docImg: "https://i.pravatar.cc/150?u=doc2", type: "Video Call", date: "19 May 2024", time: "03:30 PM", duration: "00:14:22", status: "Completed", amount: "₹800" },
        { id: "#CONS557", patName: "Manish Yadav", patPhone: "+91 91234 99876", docName: "Dr. Vivek Mehta", docSpec: "Orthopedic", patImg: "https://i.pravatar.cc/150?u=7", docImg: "https://i.pravatar.cc/150?u=doc3", type: "Chat", date: "19 May 2024", time: "10:05 AM", duration: "00:07:41", status: "Completed", amount: "₹500" },
        { id: "#CONS556", patName: "Kavita Reddy", patPhone: "+91 90000 11122", docName: "Dr. Priya Sharma", docSpec: "Pediatrician", patImg: "https://i.pravatar.cc/150?u=8", docImg: "https://i.pravatar.cc/150?u=doc4", type: "Video Call", date: "18 May 2024", time: "05:40 PM", duration: "00:11:30", status: "Completed", amount: "₹800" },
        { id: "#CONS555", patName: "Rahul Singh", patPhone: "+91 93456 77889", docName: "Dr. Amit Verma", docSpec: "General Physician", patImg: "https://i.pravatar.cc/150?u=9", docImg: "https://i.pravatar.cc/150?u=doc1", type: "Chat", date: "18 May 2024", time: "01:15 PM", duration: "00:05:12", status: "Completed", amount: "₹500" },
        { id: "#CONS554", patName: "Pooja Mehra", patPhone: "+91 88888 77766", docName: "Dr. Neha Kapoor", docSpec: "Dermatologist", patImg: "https://i.pravatar.cc/150?u=10", docImg: "https://i.pravatar.cc/150?u=doc2", type: "Video Call", date: "17 May 2024", time: "09:25 AM", duration: "00:13:55", status: "Cancelled", amount: "₹0" },
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

      {/* Main Table Area */}
      <div className="bg-white rounded-[14px] shadow-sm border border-slate-200 p-5 space-y-5">
        
        {/* Filters Bar */}
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center justify-between">
          
          <div className="flex-1 max-w-sm relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4"/>
            <input type="text" placeholder="Search by patient name, doctor name or consultation ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#047857]"/>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="relative">
              <select className="appearance-none border border-slate-200 text-slate-600 rounded-lg pl-3 pr-8 py-2 text-[11px] font-semibold outline-none focus:border-[#047857] bg-white cursor-pointer">
                <option>All Doctors</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-3.5 pointer-events-none"/>
            </div>

            <div className="relative">
              <select className="appearance-none border border-slate-200 text-slate-600 rounded-lg pl-3 pr-8 py-2 text-[11px] font-semibold outline-none focus:border-[#047857] bg-white cursor-pointer">
                <option>All Type</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-3.5 pointer-events-none"/>
            </div>

            <div className="relative">
              <select className="appearance-none border border-slate-200 text-slate-600 rounded-lg pl-3 pr-8 py-2 text-[11px] font-semibold outline-none focus:border-[#047857] bg-white cursor-pointer">
                <option>All Status</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-3.5 pointer-events-none"/>
            </div>

            <button className="border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition rounded-lg px-3 py-2 flex items-center justify-between text-[11px] font-semibold bg-white min-w-[140px] cursor-pointer">
              <span>Select Date Range</span>
              <CalendarDays className="size-3.5"/>
            </button>

            <button className="border border-slate-200 text-slate-600 hover:bg-slate-50 transition rounded-lg px-3 py-2 flex items-center gap-1.5 text-[11px] font-semibold bg-white cursor-pointer ml-1">
              <Filter className="size-3.5"/>
              <span>More Filters</span>
            </button>

            <button className="border border-slate-200 text-slate-600 hover:bg-slate-50 transition rounded-lg px-3 py-2 flex items-center gap-1.5 text-[11px] font-semibold bg-white cursor-pointer">
              <Download className="size-3.5"/>
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Table itself */}
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-800 tracking-wide bg-white">
                <th className="py-4 px-3 w-10">
                  <div className="w-3.5 h-3.5 rounded border-2 border-slate-200 cursor-pointer hover:border-slate-300"></div>
                </th>
                <th className="py-4 px-3">Consultation ID</th>
                <th className="py-4 px-3">Patient</th>
                <th className="py-4 px-3">Doctor</th>
                <th className="py-4 px-3">Type</th>
                <th className="py-4 px-3 cursor-pointer group">
                  <span className="flex items-center gap-1 group-hover:text-slate-600 transition">Date & Time <ArrowDown size={12}/></span>
                </th>
                <th className="py-4 px-3">Duration</th>
                <th className="py-4 px-3">Status</th>
                <th className="py-4 px-3">Amount</th>
                <th className="py-4 px-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {mockTableData
            .filter(row => row.patName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.docName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.id.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((row, i) => (<tr key={i} className="hover:bg-slate-50/50 transition">
                  <td className="py-3 px-3">
                     <div className="w-3.5 h-3.5 rounded border-2 border-slate-200 cursor-pointer hover:border-slate-300"></div>
                  </td>
                  <td className="py-3 px-3 text-[11px] font-bold text-slate-600">{row.id}</td>
                  
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <img src={row.patImg} alt="" className="size-8 rounded-full border border-slate-200" referrerPolicy="no-referrer"/>
                      <div>
                        <p className="text-[11.5px] font-bold text-slate-900">{row.patName}</p>
                        <p className="text-[9.5px] font-mono text-slate-400">{row.patPhone}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <img src={row.docImg} alt="" className="size-8 rounded-full border border-slate-200" referrerPolicy="no-referrer"/>
                      <div>
                        <p className="text-[11.5px] font-bold text-slate-900">{row.docName}</p>
                        <p className="text-[10px] text-slate-500">{row.docSpec}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    {renderType(row.type)}
                  </td>

                  <td className="py-3 px-3">
                    <p className="text-[11.5px] font-bold text-slate-800">{row.date}</p>
                    <p className="text-[10px] text-slate-500">{row.time}</p>
                  </td>

                  <td className="py-3 px-3 text-[11px] font-bold text-slate-600">
                    {row.duration}
                  </td>

                  <td className="py-3 px-3">
                    {renderStatus(row.status)}
                  </td>

                  <td className="py-3 px-3 text-[11.5px] font-bold text-slate-800">
                    {row.amount}
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => showToast(`Viewing details for ${row.id}`)} className="p-1.5 text-blue-500 hover:bg-blue-50 hover:text-blue-600 rounded transition">
                        <Eye size={14}/>
                      </button>
                      <button onClick={() => showToast("Opening options menu...")} className="p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded transition">
                        <MoreHorizontal size={14}/>
                      </button>
                    </div>
                  </td>

                </tr>))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <p className="text-[11px] font-semibold text-slate-500">
            Showing 1 to 10 of 6,543 consultations
          </p>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <select className="border border-slate-200 text-slate-600 rounded bg-white text-[10px] font-semibold px-2 py-1 outline-none cursor-pointer">
                <option>10 per page</option>
              </select>
            </div>
            
            <div className="flex items-center gap-1">
              <button className="p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded border border-slate-100"><ChevronsLeft size={12}/></button>
              <button className="p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded border border-slate-100"><ChevronLeft size={12}/></button>
              <button className="size-6 text-[11px] font-bold text-white bg-[#047857] hover:bg-emerald-800 rounded">1</button>
              <button className="size-6 text-[11px] font-bold text-slate-600 hover:bg-slate-50 rounded">2</button>
              <button className="size-6 text-[11px] font-bold text-slate-600 hover:bg-slate-50 rounded">3</button>
              <span className="text-slate-400 text-xs px-1">...</span>
              <button className="size-6 text-[11px] font-bold text-slate-600 hover:bg-slate-50 rounded">655</button>
              <button className="p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded border border-slate-100"><ChevronRight size={12}/></button>
              <button className="p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded border border-slate-100"><ChevronsRight size={12}/></button>
            </div>
          </div>
        </div>

      </div>
    </div>);
}
