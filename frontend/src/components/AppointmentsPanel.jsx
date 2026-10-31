import React, { useState } from "react";
import { CalendarDays, Clock, CheckCircle2, XOctagon, User, Search, Filter, Download, Eye, MoreHorizontal, ChevronDown, ArrowDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
export default function AppointmentsPanel({ appointments, doctors, showToast }) {
    const [searchQuery, setSearchQuery] = useState("");
    // Stats (hardcoded for UI precision matching screenshot)
    const stats = [
        { label: "Total Appointments", value: "8,965", icon: CalendarDays, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100", trend: "↑ 21.7%", trendMuted: "vs last 30 days", isPositive: true },
        { label: "Upcoming", value: "2,450", icon: Clock, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-100", trend: "↑ 27.4%", trendMuted: "vs last 30 days", isPositive: true },
        { label: "Completed", value: "5,896", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-100", trend: "↑ 18.6%", trendMuted: "vs last 30 days", isPositive: true },
        { label: "Cancelled", value: "452", icon: XOctagon, color: "text-rose-500", bg: "bg-rose-50", border: "border-rose-100", trend: "↓ 12.3%", trendMuted: "vs last 30 days", isPositive: false },
        { label: "No Show", value: "167", icon: User, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-100", trend: "↓ 8.1%", trendMuted: "vs last 30 days", isPositive: false },
    ];
    const renderStatus = (status) => {
        switch (status) {
            case "Completed":
                return <span className="px-2.5 py-1 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800">Completed</span>;
            case "Upcoming":
                return <span className="px-2.5 py-1 text-[10px] font-bold rounded bg-blue-100 text-blue-800">Upcoming</span>;
            case "Cancelled":
                return <span className="px-2.5 py-1 text-[10px] font-bold rounded bg-rose-100 text-rose-800">Cancelled</span>;
            case "No Show":
                return <span className="px-2.5 py-1 text-[10px] font-bold rounded text-amber-800" style={{ backgroundColor: "#FDE68A" }}>No Show</span>;
            default:
                return <span className="px-2.5 py-1 text-[10px] font-bold rounded bg-slate-100 text-slate-800">{status}</span>;
        }
    };
    const renderPayment = (payment) => {
        switch (payment) {
            case "Paid":
                return <span className="px-2.5 py-1 text-[10px] font-bold rounded text-emerald-800 bg-emerald-50">Paid</span>;
            case "Refunded":
                return <span className="px-2.5 py-1 text-[10px] font-bold rounded text-slate-600 bg-slate-100">Refunded</span>;
            case "Pending":
                return <span className="px-2.5 py-1 text-[10px] font-bold rounded text-amber-700 bg-amber-50">Pending</span>;
            default:
                return <span className="px-2.5 py-1 text-[10px] font-bold rounded bg-slate-100 text-slate-800">{payment}</span>;
        }
    };
    const renderType = (type) => {
        switch (type) {
            case "In Clinic":
                return <span className="text-[11px] font-semibold text-blue-500">In Clinic</span>;
            case "Video Call":
                return <span className="text-[11px] font-semibold text-purple-500">Video Call</span>;
            default:
                return <span className="text-[11px] font-semibold text-slate-500">{type}</span>;
        }
    };
    // Static mockup data to match exact UI pixel-perfectly
    const mockTableData = [
        { id: "#APT1256", patName: "Ramesh Kumar", patId: "ID: USR-001245", docName: "Dr. Amit Verma", docSpec: "General Physician", patImg: "https://i.pravatar.cc/150?u=1", docImg: "https://i.pravatar.cc/150?u=doc1", date: "22 May 2024", time: "10:30 AM", type: "In Clinic", status: "Completed", payment: "Paid", amount: "₹800" },
        { id: "#APT1255", patName: "Priya Sharma", patId: "ID: USR-001246", docName: "Dr. Neha Kapoor", docSpec: "Dermatologist", patImg: "https://i.pravatar.cc/150?u=2", docImg: "https://i.pravatar.cc/150?u=doc2", date: "22 May 2024", time: "11:00 AM", type: "In Clinic", status: "Upcoming", payment: "Paid", amount: "₹800" },
        { id: "#APT1254", patName: "Arjun Singh", patId: "ID: USR-001247", docName: "Dr. Vivek Mehta", docSpec: "Orthopedic", patImg: "https://i.pravatar.cc/150?u=3", docImg: "https://i.pravatar.cc/150?u=doc3", date: "22 May 2024", time: "11:15 AM", type: "Video Call", status: "Upcoming", payment: "Paid", amount: "₹600" },
        { id: "#APT1253", patName: "Sneha Patel", patId: "ID: USR-001248", docName: "Dr. Priya Sharma", docSpec: "Pediatrician", patImg: "https://i.pravatar.cc/150?u=4", docImg: "https://i.pravatar.cc/150?u=doc4", date: "22 May 2024", time: "11:30 AM", type: "In Clinic", status: "Cancelled", payment: "Refunded", amount: "₹800" },
        { id: "#APT1252", patName: "Vikram Malhotra", patId: "ID: USR-001249", docName: "Dr. Amit Verma", docSpec: "General Physician", patImg: "https://i.pravatar.cc/150?u=5", docImg: "https://i.pravatar.cc/150?u=doc1", date: "21 May 2024", time: "04:00 PM", type: "Video Call", status: "Completed", payment: "Paid", amount: "₹600" },
        { id: "#APT1251", patName: "Anjali Gupta", patId: "ID: USR-001250", docName: "Dr. Neha Kapoor", docSpec: "Dermatologist", patImg: "https://i.pravatar.cc/150?u=6", docImg: "https://i.pravatar.cc/150?u=doc2", date: "21 May 2024", time: "03:30 PM", type: "In Clinic", status: "Completed", payment: "Paid", amount: "₹800" },
        { id: "#APT1250", patName: "Manish Yadav", patId: "ID: USR-001251", docName: "Dr. Vivek Mehta", docSpec: "Orthopedic", patImg: "https://i.pravatar.cc/150?u=7", docImg: "https://i.pravatar.cc/150?u=doc3", date: "21 May 2024", time: "02:00 PM", type: "Video Call", status: "No Show", payment: "Refunded", amount: "₹600" },
        { id: "#APT1249", patName: "Kavita Reddy", patId: "ID: USR-001252", docName: "Dr. Priya Sharma", docSpec: "Pediatrician", patImg: "https://i.pravatar.cc/150?u=8", docImg: "https://i.pravatar.cc/150?u=doc4", date: "20 May 2024", time: "11:00 AM", type: "In Clinic", status: "Upcoming", payment: "Pending", amount: "₹800" },
        { id: "#APT1248", patName: "Rahul Singh", patId: "ID: USR-001253", docName: "Dr. Amit Verma", docSpec: "General Physician", patImg: "https://i.pravatar.cc/150?u=9", docImg: "https://i.pravatar.cc/150?u=doc1", date: "20 May 2024", time: "10:30 AM", type: "In Clinic", status: "Upcoming", payment: "Pending", amount: "₹800" },
        { id: "#APT1247", patName: "Pooja Mehra", patId: "ID: USR-001254", docName: "Dr. Neha Kapoor", docSpec: "Dermatologist", patImg: "https://i.pravatar.cc/150?u=10", docImg: "https://i.pravatar.cc/150?u=doc2", date: "20 May 2024", time: "09:30 AM", type: "Video Call", status: "Completed", payment: "Paid", amount: "₹600" },
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
            <input type="text" placeholder="Search by patient name, doctor or appointment ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#047857]"/>
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
                <option>All Status</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-3.5 pointer-events-none"/>
            </div>

            <div className="relative">
              <select className="appearance-none border border-slate-200 text-slate-600 rounded-lg pl-3 pr-8 py-2 text-[11px] font-semibold outline-none focus:border-[#047857] bg-white cursor-pointer">
                <option>All Payment Status</option>
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
                <th className="py-4 px-3">Appointment ID</th>
                <th className="py-4 px-3">Patient</th>
                <th className="py-4 px-3">Doctor</th>
                <th className="py-4 px-3 cursor-pointer group">
                  <span className="flex items-center gap-1 group-hover:text-slate-600 transition">Date & Time <ArrowDown size={12}/></span>
                </th>
                <th className="py-4 px-3">Type</th>
                <th className="py-4 px-3">Status</th>
                <th className="py-4 px-3">Payment</th>
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
                        <p className="text-[9.5px] font-mono text-slate-400">{row.patId}</p>
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
                    <p className="text-[11.5px] font-bold text-slate-800">{row.date}</p>
                    <p className="text-[10px] text-slate-500">{row.time}</p>
                  </td>

                  <td className="py-3 px-3">
                    {renderType(row.type)}
                  </td>

                  <td className="py-3 px-3">
                    {renderStatus(row.status)}
                  </td>

                  <td className="py-3 px-3">
                    {renderPayment(row.payment)}
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
            Showing 1 to 10 of 8,965 appointments
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
              <button className="size-6 text-[11px] font-bold text-slate-600 hover:bg-slate-50 rounded">897</button>
              <button className="p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded border border-slate-100"><ChevronRight size={12}/></button>
              <button className="p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded border border-slate-100"><ChevronsRight size={12}/></button>
            </div>
          </div>
        </div>

      </div>
    </div>);
}
