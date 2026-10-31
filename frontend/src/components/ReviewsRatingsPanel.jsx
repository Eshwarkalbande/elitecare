import React, { useState } from "react";
import { Star, Search, Filter, Download, Eye, Trash2, ChevronDown, Pencil, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, CalendarDays } from "lucide-react";
export default function ReviewsRatingsPanel({ showToast }) {
    const [searchQuery, setSearchQuery] = useState("");
    const stats = [
        { label: "Total Reviews", value: "4,896", icon: Star, color: "text-purple-500", bg: "bg-purple-50", border: "border-purple-100", trend: "↑ 18.7%", trendMuted: "vs last 30 days", isPositive: true },
        { label: "Average Rating", value: "4.6", suffix: " / 5", icon: Star, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-100", trend: "↑ 0.3", trendMuted: "vs last 30 days", isPositive: true },
        { label: "5 Star Reviews", value: "3,012", subtext: "(61.5%)", icon: "5★", color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-100", trend: "↑ 20.4%", trendMuted: "vs last 30 days", isPositive: true },
        { label: "4 Star Reviews", value: "1,256", subtext: "(25.6%)", icon: "4★", color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-100", trend: "↑ 15.3%", trendMuted: "vs last 30 days", isPositive: true },
        { label: "1-3 Star Reviews", value: "628", subtext: "(12.9%)", icon: "1-3★", color: "text-rose-500", bg: "bg-rose-50", border: "border-rose-100", trend: "↓ 8.6%", trendMuted: "vs last 30 days", isPositive: false },
    ];
    const renderStatus = (status) => {
        switch (status) {
            case "Published":
                return <span className="px-2.5 py-1 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800">Published</span>;
            case "Hidden":
                return <span className="px-2.5 py-1 text-[10px] font-bold rounded bg-amber-100 text-amber-800">Hidden</span>;
            default:
                return <span className="px-2.5 py-1 text-[10px] font-bold rounded bg-slate-100 text-slate-800">{status}</span>;
        }
    };
    const renderStars = (rating) => {
        return (<div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (<Star key={star} size={12} className={star <= rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}/>))}
      </div>);
    };
    // Static mockup data to match exact UI pixel-perfectly
    const mockTableData = [
        { id: "#REV12456", patName: "Ramesh Kumar", patId: "ID: USR-001245", docName: "Dr. Amit Verma", docSpec: "General Physician", patImg: "https://i.pravatar.cc/150?u=1", docImg: "https://i.pravatar.cc/150?u=doc1", rating: 5, review: "Very good experience. Doctor was very polite and explained everything clearly.", date: "22 May 2024", time: "10:45 AM", status: "Published" },
        { id: "#REV12455", patName: "Priya Sharma", patId: "ID: USR-001246", docName: "Dr. Neha Kapoor", docSpec: "Dermatologist", patImg: "https://i.pravatar.cc/150?u=2", docImg: "https://i.pravatar.cc/150?u=doc2", rating: 4, review: "Good experience. Treatment is working well for me.", date: "22 May 2024", time: "09:15 AM", status: "Published" },
        { id: "#REV12454", patName: "Arjun Singh", patId: "ID: USR-001247", docName: "Dr. Vivek Mehta", docSpec: "Orthopedic", patImg: "https://i.pravatar.cc/150?u=3", docImg: "https://i.pravatar.cc/150?u=doc3", rating: 5, review: "Excellent doctor. Highly recommended!", date: "21 May 2024", time: "04:45 PM", status: "Published" },
        { id: "#REV12453", patName: "Sneha Patel", patId: "ID: USR-001248", docName: "Dr. Priya Sharma", docSpec: "Pediatrician", patImg: "https://i.pravatar.cc/150?u=4", docImg: "https://i.pravatar.cc/150?u=doc4", rating: 3, review: "Good service but waiting time was a bit long.", date: "21 May 2024", time: "11:20 AM", status: "Published" },
        { id: "#REV12452", patName: "Vikram Malhotra", patId: "ID: USR-001249", docName: "Dr. Amit Verma", docSpec: "General Physician", patImg: "https://i.pravatar.cc/150?u=5", docImg: "https://i.pravatar.cc/150?u=doc1", rating: 3, review: "Average experience. Need improvement in follow-ups.", date: "20 May 2024", time: "02:10 PM", status: "Published" },
        { id: "#REV12451", patName: "Anjali Gupta", patId: "ID: USR-001250", docName: "Dr. Neha Kapoor", docSpec: "Dermatologist", patImg: "https://i.pravatar.cc/150?u=6", docImg: "https://i.pravatar.cc/150?u=doc2", rating: 5, review: "Very satisfied with the consultation and treatment.", date: "20 May 2024", time: "01:30 PM", status: "Published" },
        { id: "#REV12450", patName: "Manish Yadav", patId: "ID: USR-001251", docName: "Dr. Vivek Mehta", docSpec: "Orthopedic", patImg: "https://i.pravatar.cc/150?u=7", docImg: "https://i.pravatar.cc/150?u=doc3", rating: 2, review: "Not satisfied. Did not get proper time with the doctor.", date: "19 May 2024", time: "10:05 AM", status: "Hidden" },
        { id: "#REV12449", patName: "Kavita Reddy", patId: "ID: USR-001252", docName: "Dr. Priya Sharma", docSpec: "Pediatrician", patImg: "https://i.pravatar.cc/150?u=8", docImg: "https://i.pravatar.cc/150?u=doc4", rating: 5, review: "Wonderful doctor! My child is much better now.", date: "19 May 2024", time: "09:40 AM", status: "Published" },
        { id: "#REV12448", patName: "Rahul Singh", patId: "ID: USR-001253", docName: "Dr. Amit Verma", docSpec: "General Physician", patImg: "https://i.pravatar.cc/150?u=9", docImg: "https://i.pravatar.cc/150?u=doc1", rating: 4, review: "Good experience overall.", date: "18 May 2024", time: "03:20 PM", status: "Published" },
        { id: "#REV12447", patName: "Pooja Mehra", patId: "ID: USR-001254", docName: "Dr. Neha Kapoor", docSpec: "Dermatologist", patImg: "https://i.pravatar.cc/150?u=10", docImg: "https://i.pravatar.cc/150?u=doc2", rating: 2, review: "Not happy with the consultation.", date: "18 May 2024", time: "11:10 AM", status: "Hidden" },
    ];
    return (<div className="space-y-6">
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat, idx) => (<div key={idx} className="bg-white rounded-[14px] p-5 shadow-sm border border-slate-200">
            <div className="flex justify-between items-start">
              <div className="space-y-3 md:space-y-4">
                <p className="text-[11px] font-bold text-slate-500">{stat.label}</p>
                <div className="flex items-baseline gap-1">
                  <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
                  {stat.suffix && <span className="text-xs text-slate-500 font-bold">{stat.suffix}</span>}
                  {stat.subtext && <span className="text-xs text-slate-500 ml-1">{stat.subtext}</span>}
                </div>
              </div>
              <div className={`p-2.5 rounded-full ${stat.bg} ${stat.border} border`}>
                {typeof stat.icon === 'string' ? (<span className={`text-base font-bold ${stat.color}`}>{stat.icon}</span>) : (<stat.icon className={`size-5 ${stat.color}`} strokeWidth={2}/>)}
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
            <input type="text" placeholder="Search by patient name, doctor or review..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#047857]"/>
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
                <option>All Ratings</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-3.5 pointer-events-none"/>
            </div>

            <div className="relative">
              <select className="appearance-none border border-slate-200 text-slate-600 rounded-lg pl-3 pr-8 py-2 text-[11px] font-semibold outline-none focus:border-[#047857] bg-white cursor-pointer">
                <option>All Status</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-3.5 pointer-events-none"/>
            </div>

            <button className="border border-slate-200 text-slate-600 hover:bg-slate-50 transition rounded-lg px-3 py-2 flex items-center justify-between text-[11px] font-semibold bg-white min-w-[140px] cursor-pointer">
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
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-800 tracking-wide bg-white">
                <th className="py-4 px-3 w-10">
                  <div className="w-3.5 h-3.5 rounded border-2 border-slate-200 cursor-pointer hover:border-slate-300"></div>
                </th>
                <th className="py-4 px-3 whitespace-nowrap">Review ID</th>
                <th className="py-4 px-3 whitespace-nowrap">Patient</th>
                <th className="py-4 px-3 whitespace-nowrap">Doctor</th>
                <th className="py-4 px-3 whitespace-nowrap">Rating</th>
                <th className="py-4 px-3 w-[250px]">Review</th>
                <th className="py-4 px-3 whitespace-nowrap">Date</th>
                <th className="py-4 px-3 whitespace-nowrap">Status</th>
                <th className="py-4 px-3 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {mockTableData
            .filter(row => row.patName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.docName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.review.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((row, i) => (<tr key={i} className="hover:bg-slate-50/50 transition">
                  <td className="py-4 px-3">
                     <div className="w-3.5 h-3.5 rounded border-2 border-slate-200 cursor-pointer hover:border-slate-300"></div>
                  </td>
                  <td className="py-4 px-3 text-[11px] font-bold text-slate-600 whitespace-nowrap">{row.id}</td>
                  
                  <td className="py-4 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <img src={row.patImg} alt="" className="size-8 rounded-full border border-slate-200" referrerPolicy="no-referrer"/>
                      <div>
                        <p className="text-[11.5px] font-bold text-slate-900">{row.patName}</p>
                        <p className="text-[9.5px] font-mono text-slate-400">{row.patId}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <img src={row.docImg} alt="" className="size-8 rounded-full border border-slate-200" referrerPolicy="no-referrer"/>
                      <div>
                        <p className="text-[11.5px] font-bold text-slate-900">{row.docName}</p>
                        <p className="text-[10px] text-slate-500">{row.docSpec}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-3 whitespace-nowrap">
                    {renderStars(row.rating)}
                  </td>

                  <td className="py-4 px-3">
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed pr-4">{row.review}</p>
                  </td>

                  <td className="py-4 px-3 whitespace-nowrap">
                    <p className="text-[11.5px] font-bold text-slate-800">{row.date}</p>
                    <p className="text-[10px] text-slate-500">{row.time}</p>
                  </td>

                  <td className="py-4 px-3 whitespace-nowrap">
                    {renderStatus(row.status)}
                  </td>

                  <td className="py-4 px-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => showToast(`Viewing full review ${row.id}`)} className="p-1.5 text-blue-500 bg-blue-50 hover:bg-blue-100 hover:text-blue-600 rounded transition" title="View Full Review">
                        <Eye size={13}/>
                      </button>
                      <button onClick={() => showToast(`Edit review visibility ${row.id}`)} className="p-1.5 text-slate-500 bg-slate-50 hover:bg-slate-100 hover:text-slate-700 rounded transition" title="Change Status">
                        <Pencil size={13}/>
                      </button>
                      <button onClick={() => showToast(`Delete review ${row.id}`)} className="p-1.5 text-rose-500 bg-rose-50 hover:bg-rose-100 hover:text-rose-600 rounded transition" title="Delete Review">
                        <Trash2 size={13}/>
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
            Showing 1 to 10 of 4,896 reviews
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
              <button className="size-6 text-[11px] font-bold text-slate-600 hover:bg-slate-50 rounded">490</button>
              <button className="p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded border border-slate-100"><ChevronRight size={12}/></button>
              <button className="p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded border border-slate-100"><ChevronsRight size={12}/></button>
            </div>
          </div>
        </div>

      </div>
    </div>);
}
