import React, { useState, useMemo } from "react";
import { FileText, User, Database, Search, SlidersHorizontal, Copy, Check, CalendarDays, X, UserCheck, AlertTriangle, ChevronLeft, ChevronRight, Info } from "lucide-react";
export default function AuditPanel({ showToast }) {
    // dataset matching reference audit.png exactly
    const logs = [
        {
            id: "#LOG-24568",
            user: "Admin User",
            role: "Super Admin",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
            action: "Login",
            actionType: "Login",
            module: "Authentication",
            details: "Admin logged in to the system",
            ipAddress: "192.168.1.10",
            dateTime: "22 May 2024 10:45 AM",
            status: "Success",
            userAgent: "Windows 10, Chrome 124.0.0.0",
            metadata: {
                login_method: "Email",
                mfa_verified: true,
                session_id: "sess_8f7g6h5j4k3l",
                location: "New Delhi, India"
            }
        },
        {
            id: "#LOG-24567",
            user: "Priya Sharma",
            role: "Admin",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
            action: "Update Role",
            actionType: "Update",
            module: "User Management",
            details: "Updated user role for Rahul Sharma",
            ipAddress: "192.168.1.15",
            dateTime: "22 May 2024 10:32 AM",
            status: "Success",
            userAgent: "MacOS, Safari 17.1",
            metadata: {
                target_user_id: "USR-4091",
                old_role: "Viewer",
                new_role: "Support Agent",
                database_nodes_altered: ["security_matrix_registry"]
            }
        },
        {
            id: "#LOG-24566",
            user: "Rahul Verma",
            role: "Admin",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
            action: "Delete Doctor",
            actionType: "Delete",
            module: "Doctor Management",
            details: "Deleted doctor profile ID: DOC-1256",
            ipAddress: "192.168.1.18",
            dateTime: "22 May 2024 10:20 AM",
            status: "Success",
            userAgent: "Linux Mint, Firefox 125.0",
            metadata: {
                deleted_doctor_id: "DOC-1256",
                archive_completed: true,
                cascade_appointments_reassigned: 14
            }
        },
        {
            id: "#LOG-24565",
            user: "Neha Kapoor",
            role: "Admin",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150",
            action: "Create Appointment",
            actionType: "Create",
            module: "Appointments",
            details: "Created appointment for patient ID: PAT-4587",
            ipAddress: "192.168.1.22",
            dateTime: "22 May 2024 09:55 AM",
            status: "Success",
            userAgent: "iOS, Safari Mobile",
            metadata: {
                appointment_id: "APPT-10928",
                patient_id: "PAT-4587",
                allocated_physician_id: "DOC-8891",
                consultation_mode: "Telehealth"
            }
        },
        {
            id: "#LOG-24564",
            user: "Mike Johnson",
            role: "Admin",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
            action: "Export Report",
            actionType: "Export",
            module: "Reports",
            details: "Exported appointment report (Excel)",
            ipAddress: "192.168.1.12",
            dateTime: "22 May 2024 09:40 AM",
            status: "Success",
            userAgent: "Windows 11, Edge 122.0",
            metadata: {
                ledger_exported: "Appointment Frequency Logs",
                format: "CSV / XLSX",
                download_bytes: "204,410 kb",
                server_compression: "gzip"
            }
        },
        {
            id: "#LOG-24563",
            user: "Admin User",
            role: "Super Admin",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
            action: "Update Settings",
            actionType: "Update",
            module: "Settings",
            details: "Updated system general settings",
            ipAddress: "192.168.1.10",
            dateTime: "22 May 2024 09:25 AM",
            status: "Success",
            userAgent: "Windows 10, Chrome 124.0.0.0",
            metadata: {
                fields_changed: ["platform_tagline", "timezone"],
                old_tagline: "Quality Care Guaranteed",
                new_tagline: "Your Health, Our Priority"
            }
        },
        {
            id: "#LOG-24562",
            user: "Unknown User",
            role: "Guest",
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
            action: "Failed Login",
            actionType: "Failed",
            module: "Authentication",
            details: "Invalid password attempt",
            ipAddress: "192.168.1.55",
            dateTime: "22 May 2024 09:10 AM",
            status: "Failed",
            userAgent: "Unknown Platform, Python-Requests/2.31",
            metadata: {
                attempted_email: "hacky-admin@elitecare.com",
                error_code: "auth/invalid-credential-combination",
                threat_level: "High",
                firewall_log_action: "IP_throttle_active_60m"
            }
        },
        {
            id: "#LOG-24561",
            user: "Priya Sharma",
            role: "Admin",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
            action: "Add Banner",
            actionType: "Create",
            module: "Banners & Ads",
            details: "Added new banner: Summer Campaign",
            ipAddress: "192.168.1.15",
            dateTime: "22 May 2024 08:55 AM",
            status: "Success",
            userAgent: "MacOS, Chrome 124.0",
            metadata: {
                banner_title: "Summer Wellness Checkup discount 20%",
                dimensions: "1280x300",
                target_audience: "General Public"
            }
        },
        {
            id: "#LOG-24560",
            user: "Arjun Singh",
            role: "Admin",
            avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150",
            action: "Update Payment",
            actionType: "Update",
            module: "Billing & Payments",
            details: "Updated payment status for INV-2569",
            ipAddress: "192.168.1.18",
            dateTime: "22 May 2024 08:30 AM",
            status: "Success",
            userAgent: "Android Mobile, Firefox Touch",
            metadata: {
                invoice_number: "INV-2569",
                amount_collected: "₹1,250",
                status_before: "Pending Selection",
                status_after: "Settled Clear"
            }
        },
        {
            id: "#LOG-24559",
            user: "Sneha Patel",
            role: "Admin",
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
            action: "Change Role",
            actionType: "Update",
            module: "Roles & Permissions",
            details: "Changed role for user ID: USR-1024",
            ipAddress: "192.168.1.20",
            dateTime: "22 May 2024 08:15 AM",
            status: "Success",
            userAgent: "MacOS, Safari 17.2",
            metadata: {
                modified_user_id: "USR-1024",
                authorized_by: "Admin Group-1",
                audit_tag: "RBAC_REMEDIATION"
            }
        }
    ];
    // Selected Log State (Defaults to row 1)
    const [selectedLogId, setSelectedLogId] = useState("#LOG-24568");
    const selectedLog = useMemo(() => {
        return logs.find(l => l.id === selectedLogId) || logs[0];
    }, [logs, selectedLogId]);
    // Copy helper
    const [copied, setCopied] = useState(false);
    const handleCopyJSON = () => {
        navigator.clipboard.writeText(JSON.stringify(selectedLog.metadata, null, 2));
        setCopied(true);
        showToast("JSON payload copied successfully to system clipboard.");
        setTimeout(() => setCopied(false), 2000);
    };
    // Filter States
    const [search, setSearch] = useState("");
    const [userFilter, setUserFilter] = useState("All");
    const [actionFilter, setActionFilter] = useState("All");
    const [moduleFilter, setModuleFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    // Options lists for dropdown filters
    const usersOptions = useMemo(() => ["All", ...Array.from(new Set(logs.map(l => l.user)))], [logs]);
    const actionOptions = useMemo(() => ["All", ...Array.from(new Set(logs.map(l => l.action)))], [logs]);
    const moduleOptions = useMemo(() => ["All", ...Array.from(new Set(logs.map(l => l.module)))], [logs]);
    // Filter computation
    const filteredLogs = useMemo(() => {
        return logs.filter(l => {
            const matchSearch = l.id.toLowerCase().includes(search.toLowerCase()) ||
                l.user.toLowerCase().includes(search.toLowerCase()) ||
                l.details.toLowerCase().includes(search.toLowerCase()) ||
                l.ipAddress.toLowerCase().includes(search.toLowerCase()) ||
                l.module.toLowerCase().includes(search.toLowerCase());
            const matchUser = userFilter === "All" || l.user === userFilter;
            const matchAction = actionFilter === "All" || l.action === actionFilter;
            const matchModule = moduleFilter === "All" || l.module === moduleFilter;
            const matchStatus = statusFilter === "All" || l.status === statusFilter;
            return matchSearch && matchUser && matchAction && matchModule && matchStatus;
        });
    }, [logs, search, userFilter, actionFilter, moduleFilter, statusFilter]);
    // Metrics
    const totalLogs = "24,568";
    const adminActions = "18,452";
    const userActions = "5,731";
    const failedAttempts = "385";
    const dataChanges = "12,648";
    // Action Badge styling helper
    const getActionBadgeStyle = (type) => {
        switch (type) {
            case "Login": return "bg-green-50 text-emerald-750 text-emerald-700 border border-emerald-100";
            case "Update": return "bg-blue-50 text-blue-700 border border-blue-100";
            case "Delete": return "bg-rose-50 text-rose-700 border border-rose-100";
            case "Create": return "bg-emerald-50 text-[#047857] border border-emerald-150";
            case "Export": return "bg-purple-50 text-purple-700 border border-purple-100";
            default: return "bg-rose-50 text-rose-700 border border-rose-100";
        }
    };
    return (<div className="space-y-6 w-full text-left" id="audit-logs-workspace-container">
      
      {/* Metrics Row Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex items-center gap-3.5">
          <div className="bg-blue-50 text-blue-605 text-blue-600 p-2.5 rounded-xl border border-blue-105 border-blue-100">
            <FileText size={18}/>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Logs</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-base font-black text-slate-800">{totalLogs}</span>
              <span className="text-[9px] text-emerald-600 font-extrabold">↑ 18.6% vs last 30d</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex items-center gap-3.5">
          <div className="bg-purple-50 text-purple-700 p-2.5 rounded-xl border border-purple-100">
            <User size={18}/>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Admin Actions</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-base font-black text-slate-800">{adminActions}</span>
              <span className="text-[9px] text-emerald-600 font-extrabold">↑ 16.2% vs last 30d</span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex items-center gap-3.5">
          <div className="bg-[#10b981]/10 text-emerald-700 p-2.5 rounded-xl">
            <UserCheck size={18}/>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">User Actions</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-base font-black text-slate-800">{userActions}</span>
              <span className="text-[9px] text-[#047857] font-extrabold">↑ 21.4% vs last 30d</span>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex items-center gap-3.5 border-l-4 border-l-red-500">
          <div className="bg-red-55 bg-red-50 text-red-650 text-red-655 text-red-600 p-2.5 rounded-xl border border-red-105 border-red-100">
            <AlertTriangle size={18}/>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Failed Attempts</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-base font-black text-slate-800">{failedAttempts}</span>
              <span className="text-[9px] text-red-500 font-extrabold">↓ 8.3% vs last 30d</span>
            </div>
          </div>
        </div>

        {/* Metric 5 */}
        <div className="col-span-2 md:col-span-1 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex items-center gap-3.5">
          <div className="bg-[#f97316]/10 text-orange-600 p-2.5 rounded-xl">
            <Database size={18}/>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Data Changes</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-base font-black text-slate-800">{dataChanges}</span>
              <span className="text-[9px] text-emerald-600 font-extrabold">↑ 19.7% vs last 30d</span>
            </div>
          </div>
        </div>

      </div>

      {/* Toolbar Options filter card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs w-full">
        
        {/* Left Side Searched Filter box */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13}/>
          <input type="text" placeholder="Search by user, action, module or IP address..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-205 rounded-xl focus:outline-none"/>
        </div>

        {/* Mid Right filter dropdown list stack */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select value={userFilter} onChange={(e) => setUserFilter(e.target.value)} className="p-2 sm:px-3.5 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 cursor-pointer focus:outline-none">
            <option value="All">All Users</option>
            {usersOptions.filter(o => o !== "All").map(o => <option key={o} value={o}>{o}</option>)}
          </select>

          <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} className="p-2 sm:px-3.5 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 cursor-pointer focus:outline-none">
            <option value="All">All Actions</option>
            {actionOptions.filter(o => o !== "All").map(o => <option key={o} value={o}>{o}</option>)}
          </select>

          <select value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value)} className="p-2 sm:px-3.5 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 cursor-pointer focus:outline-none">
            <option value="All">All Modules</option>
            {moduleOptions.filter(o => o !== "All").map(o => <option key={o} value={o}>{o}</option>)}
          </select>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="p-2 sm:px-3.5 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 cursor-pointer focus:outline-none">
            <option value="All">All Status</option>
            <option value="Success">Success Only</option>
            <option value="Failed">Failed Only</option>
          </select>

          {/* Static Calendar period dropdown */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-700 font-semibold flex items-center gap-2 cursor-pointer hover:bg-slate-100 transition">
            <CalendarDays size={13} className="text-slate-400"/>
            <span>22 Apr 2024 - 22 May 2024</span>
          </div>

          <button type="button" onClick={() => {
            setSearch("");
            setUserFilter("All");
            setActionFilter("All");
            setModuleFilter("All");
            setStatusFilter("All");
            showToast("Filters initialized successfully.");
        }} className="bg-white border border-slate-200 hover:bg-slate-50 font-semibold text-slate-700 p-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs" title="Reset All Filters">
            <SlidersHorizontal size={13} className="text-slate-500"/>
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Double Column content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Left Table Panel (8/12 width) */}
        <div className="xl:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold text-[10px] uppercase bg-slate-50/50">
                  <th className="py-3 px-4 w-[110px]">Log ID</th>
                  <th className="py-3 px-4 w-[180px]">User</th>
                  <th className="py-3 px-4 w-[120px]">Action</th>
                  <th className="py-3 px-4 w-[150px]">Module</th>
                  <th className="py-3 px-4 max-w-[220px]">Details</th>
                  <th className="py-3 px-4 w-[120px]">IP Address</th>
                  <th className="py-3 px-4 w-[170px]">Date & Time</th>
                  <th className="py-3 px-4 w-[100px] text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => {
            const isSelected = log.id === selectedLogId;
            return (<tr key={log.id} onClick={() => setSelectedLogId(log.id)} className={`hover:bg-slate-50/60 transition-all duration-150 cursor-pointer text-[11px] ${isSelected ? "bg-[#047857]/5 font-semibold" : ""}`}>
                      <td className="py-3 px-4 font-mono font-bold text-[#047857] w-[110px]">
                        <div className="flex items-center gap-1.5">
                          <span className={`size-1.5 rounded-full shrink-0 ${log.status === "Success" ? "bg-emerald-500" : "bg-red-500 animate-pulse"}`}/>
                          <span>{log.id}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 w-[180px]">
                        <div className="flex items-center gap-2">
                          <img src={log.avatar} alt={log.user} className="size-6 rounded-full object-cover border border-slate-100" referrerPolicy="no-referrer"/>
                          <div className="text-left">
                            <p className="font-extrabold text-slate-800 leading-tight">{log.user}</p>
                            <p className="text-[9.5px] text-slate-400 font-bold leading-none mt-0.5">{log.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold w-[120px]">
                        <span className={`px-2 py-0.5 rounded text-[8.5px] font-black ${getActionBadgeStyle(log.actionType)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-semibold w-[150px]">{log.module}</td>
                      <td className="py-3 px-4 text-slate-600 font-medium max-w-[220px] truncate" title={log.details}>
                        {log.details}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500 font-semibold w-[120px]">{log.ipAddress}</td>
                      <td className="py-3 px-4 font-mono text-slate-500 w-[170px] truncate" title={log.dateTime}>{log.dateTime}</td>
                      <td className="py-3 px-4 text-center w-[100px]">
                        <span className={`inline-flex px-1.5 py-0.5 font-bold rounded-lg text-[9px] ${log.status === "Success"
                    ? "bg-emerald-50 text-[#047857]"
                    : "bg-rose-50 text-rose-700"}`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>);
        })}
                {filteredLogs.length === 0 && (<tr>
                    <td colSpan={8} className="text-center py-8 text-xs font-semibold text-slate-400">
                      No tracing logs found matching the selected parameters.
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>

          {/* Footer Pagination Row */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-3.5 border-t border-slate-100 text-xs text-slate-500 font-semibold w-full">
            <div>
              Showing <span className="font-bold text-slate-800">1 to {filteredLogs.length}</span> of <span className="font-bold text-slate-800">24,568 logs</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span>Show</span>
                <select className="p-1 px-2 border border-slate-200 rounded-lg bg-slate-50 font-bold focus:outline-none">
                  <option value="10">10 per page</option>
                  <option value="25">25 per page</option>
                  <option value="50">50 per page</option>
                </select>
              </div>

              <div className="inline-flex gap-1">
                <button className="p-1 hover:bg-slate-50 rounded-lg text-slate-400" disabled>
                  <ChevronLeft size={14}/>
                </button>
                <button className="px-2.5 py-1 bg-emerald-50 text-[#047857] border border-emerald-100 font-bold rounded-lg text-xs">1</button>
                <button className="px-2.5 py-1 hover:bg-slate-50 text-slate-600 rounded-lg text-xs">2</button>
                <button className="px-2.5 py-1 hover:bg-slate-50 text-slate-600 rounded-lg text-xs">3</button>
                <span className="px-1 text-slate-400">...</span>
                <button className="px-2.5 py-1 hover:bg-slate-50 text-slate-600 rounded-lg text-xs">2457</button>
                <button className="p-1 hover:bg-slate-50 rounded-lg text-slate-600">
                  <ChevronRight size={14}/>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Log details Sheet Panel - Sticky for high usability preview */}
        <div className="xl:col-span-4 xl:sticky xl:top-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4 relative">
          
          <div className="flex justify-between items-center border-b border-slate-50 pb-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight">Log Details</h3>
            <button onClick={() => showToast("Dismissed active session inspect node.")} className="p-1 hover:bg-slate-50 rounded-full transition text-slate-400 hover:text-slate-600 cursor-pointer">
              <X size={15}/>
            </button>
          </div>

          {/* Log Details content fields stack */}
          <div className="space-y-4 text-xs">
            
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold">Log ID</span>
              <span className="font-mono font-black text-slate-800 text-sm bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">{selectedLog.id}</span>
            </div>

            <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl flex items-center justify-between">
              <span className="text-slate-400 font-semibold text-[10.5px]">User Identity</span>
              <div className="flex items-center gap-2">
                <img src={selectedLog.avatar} alt={selectedLog.user} className="size-7 rounded-full object-cover border border-slate-100" referrerPolicy="no-referrer"/>
                <div className="text-left">
                  <p className="font-extrabold text-slate-800">{selectedLog.user}</p>
                  <p className="text-[9.5px] text-[#047857] font-black">{selectedLog.role}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="p-2.5 bg-slate-50/50 border border-slate-100 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Action</span>
                <span className="font-bold text-slate-700 block mt-1">{selectedLog.action}</span>
              </div>
              <div className="p-2.5 bg-slate-50/50 border border-slate-100 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Status</span>
                <span className={`inline-flex px-2 py-0.5 rounded-full font-black mt-1 text-[9.5px] ${selectedLog.status === "Success" ? "bg-emerald-100 text-[#047857]" : "bg-rose-50 text-rose-700"}`}>
                  {selectedLog.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="p-2.5 bg-slate-50/50 border border-slate-100 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Module Group</span>
                <span className="font-semibold text-slate-600 block mt-1">{selectedLog.module}</span>
              </div>
              <div className="p-2.5 bg-slate-50/50 border border-slate-100 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">IP Address</span>
                <span className="font-mono text-slate-700 font-bold block mt-1">{selectedLog.ipAddress}</span>
              </div>
            </div>

            <div className="p-2.5 bg-slate-50/50 border border-slate-100 rounded-xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">User Browser Agent</span>
              <span className="font-mono text-slate-600 text-[10.5px] block mt-1 leading-normal">{selectedLog.userAgent}</span>
            </div>

            <div className="p-2.5 bg-slate-50/50 border border-slate-100 rounded-xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Date & Time</span>
              <span className="font-mono text-slate-500 font-bold block mt-1">{selectedLog.dateTime}</span>
            </div>

            <div className="p-2.5 bg-slate-50/50 border border-slate-100 rounded-xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Activity description</span>
              <p className="font-medium text-slate-600 mt-1 leading-relaxed text-[11px]">{selectedLog.details} and acknowledged trace tokens.</p>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                <span>Additional Information</span>
                <button onClick={handleCopyJSON} className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-800 transition cursor-pointer font-bold text-[9px] uppercase">
                  {copied ? <Check size={11} className="text-[#047857]"/> : <Copy size={11}/>}
                  <span>{copied ? "Copied" : "Copy Payload"}</span>
                </button>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl text-left border border-slate-800 overflow-x-auto max-h-[160px] shadow-inner font-mono text-[10px] text-emerald-400 leading-normal">
                <pre>{JSON.stringify(selectedLog.metadata, null, 2)}</pre>
              </div>
            </div>

            <button onClick={() => showToast(`Routing to dashboard details directory for ${selectedLog.user}...`)} className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-slate-950 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 mt-4">
              <User size={13} className="text-slate-400"/>
              <span>View User Profile</span>
            </button>

          </div>
        </div>

      </div>

      <div className="p-3.5 bg-blue-50/40 border border-blue-100 rounded-2xl flex items-center gap-2.5 text-xs text-slate-600 font-medium">
        <Info size={14} className="text-blue-500 shrink-0"/>
        <span>Audit Logs help you track and monitor all system activities and user actions for security and compliance. Logs are retained for 1 year.</span>
      </div>

    </div>);
}
