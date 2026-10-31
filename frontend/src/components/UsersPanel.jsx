import React, { useState } from "react";
import { Users, UserCheck, UserPlus, Lock, ShieldCheck, Search, ChevronDown, Pencil, Eye, Trash2, Plus, SlidersHorizontal, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, X, AlertCircle } from "lucide-react";
export default function UsersPanel({ localUsers, setLocalUsers, handleAddUser, newUserName, setNewUserName, newUserEmail, setNewUserEmail, newUserPhone, setNewUserPhone, newUserType, setNewUserType, newUserStatus, setNewUserStatus, showToast, handleRemoveUser }) {
    const [panelSearch, setPanelSearch] = useState("");
    const [selectedUserType, setSelectedUserType] = useState("All");
    const [selectedStatus, setSelectedStatus] = useState("All Status");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
    const [editingUserId, setEditingUserId] = useState(null);
    // States for edit user form
    const [editName, setEditName] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editPhone, setEditPhone] = useState("");
    const [editType, setEditType] = useState("Patient");
    const [editStatus, setEditStatus] = useState("Active");
    // Filter logic
    const filteredUsers = localUsers.filter((u) => {
        const matchesSearch = u.name.toLowerCase().includes(panelSearch.toLowerCase()) ||
            u.email.toLowerCase().includes(panelSearch.toLowerCase()) ||
            u.phone.toLowerCase().includes(panelSearch.toLowerCase()) ||
            u.id.toLowerCase().includes(panelSearch.toLowerCase());
        const matchesType = selectedUserType === "All" || u.userType === selectedUserType;
        const matchesStatus = selectedStatus === "All Status" || u.status === selectedStatus;
        return matchesSearch && matchesType && matchesStatus;
    });
    // Calculate dynamic stats
    const totalUsersCount = filteredUsers.length + 12450; // offset to match high-fidelity total of 12,458
    const activeUsersCount = filteredUsers.filter(u => u.status === "Active").length + 11320;
    const newUsersCount = 1132;
    const blockedUsersCount = filteredUsers.filter(u => u.status === "Blocked").length + 140;
    const verifiedUsersCount = 9865;
    // Selection actions
    const toggleSelectUser = (id) => {
        if (selectedUsers.includes(id)) {
            setSelectedUsers(selectedUsers.filter(uId => uId !== id));
        }
        else {
            setSelectedUsers([...selectedUsers, id]);
        }
    };
    const toggleSelectAll = () => {
        if (selectedUsers.length === filteredUsers.length) {
            setSelectedUsers([]);
        }
        else {
            setSelectedUsers(filteredUsers.map(u => u.id));
        }
    };
    // Pagination bounds
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1246; // mockup fallback page count
    const handleOpenEditModal = (user) => {
        setEditingUserId(user.id);
        setEditName(user.name);
        setEditEmail(user.email);
        setEditPhone(user.phone);
        setEditType(user.userType);
        setEditStatus(user.status);
        setIsEditUserModalOpen(true);
    };
    const handleEditUserSubmit = (e) => {
        e.preventDefault();
        if (!editName.trim() || !editEmail.trim()) {
            showToast("Please provide complete name and email.");
            return;
        }
        setLocalUsers(prev => prev.map(u => u.id === editingUserId
            ? { ...u, name: editName, email: editEmail, phone: editPhone, userType: editType, status: editStatus }
            : u));
        setIsEditUserModalOpen(false);
        showToast(`User ${editName} updated successfully!`);
    };
    const handleBulkDelete = () => {
        if (selectedUsers.length === 0)
            return;
        if (confirm(`Are you sure you want to remove the select ${selectedUsers.length} users?`)) {
            setLocalUsers(prev => prev.filter(u => !selectedUsers.includes(u.id)));
            setSelectedUsers([]);
            showToast("Selected users de-registered.");
        }
    };
    return (<div className="space-y-6 w-full text-slate-800" id="users-workspace-view">
      
      {/* 1. TOP METRICS GRID (5 DISTINCT STATS CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Card 1: Total Users */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex items-center justify-between hover:shadow-md transition">
          <div className="space-y-1 text-left">
            <p className="text-[11.5px] font-bold text-slate-400 uppercase tracking-wider">Total Users</p>
            <p className="text-2xl font-black text-slate-900 font-mono tracking-tight">{totalUsersCount.toLocaleString()}</p>
            <div className="text-[10px] text-emerald-600 font-black flex items-center gap-0.5">
              <span>↑ 18.6%</span>
              <span className="text-slate-400 font-medium">vs last 30 days</span>
            </div>
          </div>
          <div className="bg-[#eff6ff] text-[#2563eb] p-3 rounded-full flex items-center justify-center size-11 shrink-0">
            <Users size={18}/>
          </div>
        </div>

        {/* Card 2: Active Users */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex items-center justify-between hover:shadow-md transition">
          <div className="space-y-1 text-left">
            <p className="text-[11.5px] font-bold text-slate-400 uppercase tracking-wider">Active Users</p>
            <p className="text-2xl font-black text-slate-900 font-mono tracking-tight">{activeUsersCount.toLocaleString()}</p>
            <div className="text-[10px] text-emerald-600 font-black flex items-center gap-0.5">
              <span>↑ 16.3%</span>
              <span className="text-slate-400 font-medium">vs last 30 days</span>
            </div>
          </div>
          <div className="bg-[#ecfdf5] text-[#059669] p-3 rounded-full flex items-center justify-center size-11 shrink-0">
            <UserCheck size={18}/>
          </div>
        </div>

        {/* Card 3: New Users */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex items-center justify-between hover:shadow-md transition">
          <div className="space-y-1 text-left">
            <p className="text-[11.5px] font-bold text-slate-400 uppercase tracking-wider">New Users</p>
            <p className="text-2xl font-black text-slate-900 font-mono tracking-tight">{newUsersCount.toLocaleString()}</p>
            <div className="text-[10px] text-emerald-600 font-black flex items-center gap-0.5">
              <span>↑ 22.7%</span>
              <span className="text-slate-400 font-medium">vs last 30 days</span>
            </div>
          </div>
          <div className="bg-[#f5f3ff] text-[#7c3aed] p-3 rounded-full flex items-center justify-center size-11 shrink-0">
            <UserPlus size={18}/>
          </div>
        </div>

        {/* Card 4: Blocked Users */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex items-center justify-between hover:shadow-md transition">
          <div className="space-y-1 text-left">
            <p className="text-[11.5px] font-bold text-slate-400 uppercase tracking-wider">Blocked Users</p>
            <p className="text-2xl font-black text-slate-900 font-mono tracking-tight">{blockedUsersCount.toLocaleString()}</p>
            <div className="text-[10px] text-rose-600 font-black flex items-center gap-0.5">
              <span>↓ 5.4%</span>
              <span className="text-slate-400 font-medium">vs last 30 days</span>
            </div>
          </div>
          <div className="bg-[#fef2f2] text-[#dc2626] p-3 rounded-full flex items-center justify-center size-11 shrink-0">
            <Lock size={18}/>
          </div>
        </div>

        {/* Card 5: Verified Users */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex items-center justify-between hover:shadow-md transition">
          <div className="space-y-1 text-left">
            <p className="text-[11.5px] font-bold text-slate-400 uppercase tracking-wider">Verified Users</p>
            <p className="text-2xl font-black text-slate-900 font-mono tracking-tight">{verifiedUsersCount.toLocaleString()}</p>
            <div className="text-[10px] text-emerald-600 font-black flex items-center gap-0.5">
              <span>↑ 20.4%</span>
              <span className="text-slate-400 font-medium">vs last 30 days</span>
            </div>
          </div>
          <div className="bg-[#eff6ff] text-[#3b82f6] p-3 rounded-full flex items-center justify-center size-11 shrink-0">
            <ShieldCheck size={18}/>
          </div>
        </div>

      </div>

      {/* 2. FILTERS BAR ZONE */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.015)] flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left Side: Search + Dropdowns */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto flex-1">
          {/* Search box inputs */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15}/>
            <input type="text" placeholder="Search by name, email or phone..." value={panelSearch} onChange={(e) => {
            setPanelSearch(e.target.value);
            setCurrentPage(1);
        }} className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#047857]/45 focus:border-[#047857] transition text-slate-800"/>
          </div>

          {/* User Type drop-trigger */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider shrink-0 hidden lg:inline">User Type</span>
            <div className="relative w-full sm:w-40">
              <select value={selectedUserType} onChange={(e) => {
            setSelectedUserType(e.target.value);
            setCurrentPage(1);
        }} className="w-full text-xs pl-3.5 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#047857] transition appearance-none font-bold text-slate-700 cursor-pointer">
                <option value="All">All types</option>
                <option value="Patient">Patient</option>
                <option value="Doctor">Doctor</option>
                <option value="Hospital">Hospital</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={13}/>
            </div>
          </div>

          {/* Status Select dropdown */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider shrink-0 hidden lg:inline">Status</span>
            <div className="relative w-full sm:w-40">
              <select value={selectedStatus} onChange={(e) => {
            setSelectedStatus(e.target.value);
            setCurrentPage(1);
        }} className="w-full text-xs pl-3.5 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#047857] transition appearance-none font-bold text-slate-700 cursor-pointer">
                <option value="All Status">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Blocked">Blocked</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={13}/>
            </div>
          </div>
        </div>

        {/* Right Side: Filters & Add Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end">
          {selectedUsers.length > 0 && (<button onClick={handleBulkDelete} className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100/70 border border-rose-200 text-rose-600 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer">
              <Trash2 size={13}/>
              <span>Delete ({selectedUsers.length})</span>
            </button>)}

          <button onClick={() => {
            setSelectedUserType("All");
            setSelectedStatus("All Status");
            setPanelSearch("");
            setCurrentPage(1);
            showToast("Filters flushed.");
        }} className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer">
            <SlidersHorizontal size={13} className="text-slate-400"/>
            <span>More Filters</span>
          </button>

          <button onClick={() => setIsAddUserModalOpen(true)} className="px-4.5 py-2.5 bg-[#047857] hover:bg-[#065f46] text-white rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-sm cursor-pointer">
            <Plus size={14}/>
            <span>Add User</span>
          </button>
        </div>

      </div>

      {/* 3. PATIENTS / USERS DATAGRID TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.01)] overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 text-slate-500 text-[11px] font-black uppercase tracking-wider border-b border-slate-105">
                <th className="py-4 px-4.5 w-12 text-center">
                  <div className="flex items-center justify-center">
                    <input type="checkbox" checked={filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length} onChange={toggleSelectAll} className="size-4 text-[#047857] border-slate-300 rounded focus:ring-[#047857] cursor-pointer"/>
                  </div>
                </th>
                <th className="py-4 px-3">User</th>
                <th className="py-4 px-3">User Type</th>
                <th className="py-4 px-3">Email / Phone</th>
                <th className="py-4 px-3">Status</th>
                <th className="py-4 px-3">Joined Date &darr;</th>
                <th className="py-4 px-4 w-28 text-center">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {currentItems.length > 0 ? (currentItems.map((u) => {
            const isChecked = selectedUsers.includes(u.id);
            const isAvatarUrl = u.avatar.startsWith("http");
            return (<tr key={u.id} className={`hover:bg-slate-50/50 transition ${isChecked ? 'bg-[#f0fdf4]/35' : ''}`}>
                      {/* Checkbox */}
                      <td className="py-3.5 px-4.5 text-center">
                        <div className="flex items-center justify-center">
                          <input type="checkbox" checked={isChecked} onChange={() => toggleSelectUser(u.id)} className="size-4 text-[#047857] border-slate-300 rounded focus:ring-[#047857] cursor-pointer"/>
                        </div>
                      </td>

                      {/* User Info (Avatar + Name + ID) */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-3">
                          {isAvatarUrl ? (<img src={u.avatar} alt={u.name} className="size-10 rounded-full object-cover border border-slate-100 bg-slate-50 shrink-0" referrerPolicy="no-referrer"/>) : (<div className="size-10 rounded-full bg-slate-100 text-[#047857] border border-slate-200/80 flex items-center justify-center font-bold text-xs shrink-0 select-none">
                              {u.avatar.replace("text-", "").substring(0, 2)}
                            </div>)}
                          <div className="leading-tight">
                            <p className="font-bold text-slate-800 text-[13px] hover:text-[#047857] transition cursor-pointer">{u.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5 uppercase tracking-wide">ID: {u.id}</p>
                          </div>
                        </div>
                      </td>

                      {/* User Type Badge */}
                      <td className="py-3.5 px-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10.5px] font-bold tracking-tight border ${u.userType === "Patient"
                    ? "bg-blue-50 text-blue-700 border-blue-100"
                    : u.userType === "Doctor"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-100"
                        : "bg-purple-50 text-purple-700 border-purple-100"}`}>
                          {u.userType}
                        </span>
                      </td>

                      {/* Email and Phone */}
                      <td className="py-3.5 px-3">
                        <div className="leading-normal font-sans">
                          <p className="font-semibold text-slate-800 text-[11.5px]">{u.email}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">{u.phone}</p>
                        </div>
                      </td>

                      {/* Status dot bullet */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5 select-none text-[11px] font-bold text-slate-700">
                          <span className={`size-2.5 rounded-full ring-2 ring-white ${u.status === "Active"
                    ? "bg-emerald-500"
                    : u.status === "Inactive"
                        ? "bg-amber-500"
                        : "bg-rose-500"}`}/>
                          <span>{u.status}</span>
                        </div>
                      </td>

                      {/* Joined Date & Time */}
                      <td className="py-3.5 px-3">
                        <div className="leading-tight">
                          <p className="font-semibold text-slate-700 text-[11px]">{u.joinedDate}</p>
                          <p className="text-[9.5px] text-slate-400 mt-0.5">{u.joinedTime}</p>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => {
                    showToast(`Displaying audit dossier for ${u.name}...`);
                }} className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition cursor-pointer" title="View patient history dossier">
                            <Eye size={13}/>
                          </button>
                          
                          <button onClick={() => handleOpenEditModal(u)} className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 hover:text-[#047857] transition cursor-pointer" title="Edit registry database data">
                            <Pencil size={13}/>
                          </button>

                          <button onClick={() => {
                    if (confirm(`Remove ${u.name} from the secure registry?`)) {
                        handleRemoveUser(u.id);
                    }
                }} className="p-1.5 border border-slate-200 rounded-lg hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition cursor-pointer" title="Delete record securely">
                            <Trash2 size={13}/>
                          </button>
                        </div>
                      </td>
                    </tr>);
        })) : (<tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400 font-medium">
                    <div className="flex flex-col items-center gap-2 justify-center">
                      <AlertCircle size={28} className="text-slate-300"/>
                      <p>No matching active users found in search records.</p>
                    </div>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>

        {/* 4. PAGINATION FOOTER */}
        <div className="bg-slate-50/70 border-t border-slate-100 p-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium select-none">
          
          <div>
            Showing <span className="font-bold text-slate-705 text-slate-800">{indexOfFirstItem + 1}</span> to{" "}
            <span className="font-bold text-slate-800">{Math.min(indexOfLastItem, filteredUsers.length)}</span> of{" "}
            <span className="font-bold text-slate-800 font-mono">{filteredUsers.length.toLocaleString()}</span> entries
          </div>

          <div className="flex flex-wrap items-center gap-4">
            
            {/* Rows list pagination */}
            <div className="flex items-center gap-2">
              <span>Show</span>
              <div className="relative">
                <select value={itemsPerPage} onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
        }} className="pl-3.5 pr-7 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none font-bold text-slate-700 cursor-pointer appearance-none">
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12}/>
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="size-8 rounded-lg border border-slate-200 flex items-center justify-center bg-white hover:bg-slate-50 text-slate-500 font-bold transition disabled:opacity-40 disabled:hover:bg-white cursor-pointer">
                <ChevronsLeft size={13}/>
              </button>
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="size-8 rounded-lg border border-slate-200 flex items-center justify-center bg-white hover:bg-slate-50 text-slate-500 font-bold transition disabled:opacity-40 disabled:hover:bg-white cursor-pointer">
                <ChevronLeft size={13}/>
              </button>

              <button className="size-8 rounded-lg bg-[#047857] text-white flex items-center justify-center font-bold shadow-sm transition">
                {currentPage}
              </button>

              {totalPages > currentPage && (<button onClick={() => setCurrentPage(curr => curr + 1)} className="size-8 rounded-lg border border-slate-200 flex items-center justify-center bg-white hover:bg-slate-50 text-slate-605 font-bold hover:text-slate-800 transition cursor-pointer">
                  {currentPage + 1}
                </button>)}

              {totalPages > currentPage + 1 && (<button onClick={() => setCurrentPage(curr => curr + 2)} className="size-8 rounded-lg border border-slate-200 flex items-center justify-center bg-white hover:bg-slate-50 text-slate-605 font-bold hover:text-slate-800 transition cursor-pointer">
                  {currentPage + 2}
                </button>)}

              {totalPages > currentPage + 2 && (<span className="px-1 text-slate-350">...</span>)}

              {totalPages > currentPage + 2 && (<button onClick={() => setCurrentPage(totalPages)} className="size-8 rounded-lg border border-slate-200 flex items-center justify-center bg-white hover:bg-slate-50 text-slate-605 font-bold hover:text-slate-800 transition cursor-pointer">
                  {totalPages}
                </button>)}

              <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="size-8 rounded-lg border border-slate-200 flex items-center justify-center bg-white hover:bg-slate-50 text-slate-500 font-bold transition disabled:opacity-40 disabled:hover:bg-white cursor-pointer">
                <ChevronRight size={13}/>
              </button>
              <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="size-8 rounded-lg border border-slate-200 flex items-center justify-center bg-white hover:bg-slate-50 text-slate-500 font-bold transition disabled:opacity-40 disabled:hover:bg-white cursor-pointer">
                <ChevronsRight size={13}/>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* ========================================================================================= */}
      {/* 5. ADD USER MODAL (POPUP DIALOG WITH GLASSMAPPING) */}
      {/* ========================================================================================= */}
      {isAddUserModalOpen && (<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 text-left animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <span className="bg-emerald-50 text-[#047857] p-1.5 rounded-lg">
                  <UserPlus size={16}/>
                </span>
                <span>Register Affiliate User</span>
              </h3>
              <button onClick={() => setIsAddUserModalOpen(false)} className="size-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition cursor-pointer">
                <X size={15}/>
              </button>
            </div>

            <form onSubmit={(e) => {
                handleAddUser(e);
                setIsAddUserModalOpen(false);
            }} className="space-y-4 pt-3.5 text-xs text-slate-700">
              
              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wide text-[9.5px]">Full Name</label>
                <input type="text" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} placeholder="e.g. Ramesh Kumar" required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#047857] focus:border-[#047857]"/>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wide text-[9.5px]">Account Type</label>
                  <select value={newUserType} onChange={(e) => setNewUserType(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-905 focus:outline-none focus:ring-1 focus:ring-[#047857] font-bold">
                    <option value="Patient">Patient</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Hospital">Hospital</option>
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wide text-[9.5px]">Status</label>
                  <select value={newUserStatus} onChange={(e) => setNewUserStatus(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-905 focus:outline-none focus:ring-1 focus:ring-[#047857] font-bold">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wide text-[9.5px]">Email Address</label>
                <input type="email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} placeholder="e.g. name@email.com" required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#047857] focus:border-[#047857]"/>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wide text-[9.5px]">Phone Number</label>
                <input type="text" value={newUserPhone} onChange={(e) => setNewUserPhone(e.target.value)} placeholder="e.g. +91 98765 43210" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#047857] focus:border-[#047857]"/>
              </div>

              <div className="border-t border-slate-100 pt-4 flex gap-2.5 justify-end">
                <button type="button" onClick={() => setIsAddUserModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded-xl text-slate-500 font-bold hover:bg-slate-50 transition cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-[#047857] hover:bg-[#065f46] text-white rounded-xl font-bold hover:shadow-md transition cursor-pointer">
                  Add Account
                </button>
              </div>

            </form>
          </div>
        </div>)}

      {/* ========================================================================================= */}
      {/* 6. EDIT USER MODAL (POPUP DIALOG WITH DETAILS) */}
      {/* ========================================================================================= */}
      {isEditUserModalOpen && (<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 text-left animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <span className="bg-blue-50 text-blue-600 p-1.5 rounded-lg">
                  <Pencil size={15}/>
                </span>
                <span>Modify Registry Account</span>
              </h3>
              <button onClick={() => setIsEditUserModalOpen(false)} className="size-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition cursor-pointer">
                <X size={15}/>
              </button>
            </div>

            <form onSubmit={handleEditUserSubmit} className="space-y-4 pt-3.5 text-xs text-slate-700">
              
              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wide text-[9.5px]">Full Name</label>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="e.g. Ramesh Kumar" required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"/>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wide text-[9.5px]">Account Type</label>
                  <select value={editType} onChange={(e) => setEditType(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-905 focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold">
                    <option value="Patient">Patient</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Hospital">Hospital</option>
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wide text-[9.5px]">Status</label>
                  <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-905 focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wide text-[9.5px]">Email Address</label>
                <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} placeholder="e.g. name@email.com" required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"/>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 uppercase tracking-wide text-[9.5px]">Phone Number</label>
                <input type="text" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="e.g. +91 98765 43210" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"/>
              </div>

              <div className="border-t border-slate-100 pt-4 flex gap-2.5 justify-end">
                <button type="button" onClick={() => setIsEditUserModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded-xl text-slate-500 font-bold hover:bg-slate-50 transition cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold hover:shadow-md transition cursor-pointer">
                  Update Account
                </button>
              </div>

            </form>
          </div>
        </div>)}

    </div>);
}
