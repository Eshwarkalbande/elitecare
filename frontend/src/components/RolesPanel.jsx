import React, { useState, useMemo } from "react";
import { Shield, Key, Users, UserCheck, CheckCircle, Plus, Search, ChevronRight, Edit, Trash, RefreshCw, Info } from "lucide-react";
export default function RolesPanel({ showToast }) {
    // Roles Static Records List
    const [roles, setRoles] = useState([
        { id: "1", name: "Super Admin", key: "super_admin", description: "Full access to all modules and settings. Can manage users, roles, permissions and system configurations.", userCount: 12, isSystem: true, status: "Active", createdOn: "10 Jan 2024, 10:30 AM", lastUpdated: "22 May 2024, 09:15 AM" },
        { id: "2", name: "Admin", key: "admin_staff", description: "Operational management capabilities. Can oversee doctors, appointments and standard users.", userCount: 25, isSystem: false, status: "Active", createdOn: "15 Jan 2024, 02:00 PM", lastUpdated: "22 May 2024, 09:10 AM" },
        { id: "3", name: "Doctor Admin", key: "doctor_admin", description: "Direct control over physician accounts, rosters, clinics, on-call schedules metrics.", userCount: 18, isSystem: false, status: "Active", createdOn: "18 Jan 2024, 11:15 AM", lastUpdated: "21 May 2024, 04:30 PM" },
        { id: "4", name: "Hospital Admin", key: "hospital_admin", description: "Oversees local ward beds, hospital metadata parameters, local inventory pipelines.", userCount: 22, isSystem: false, status: "Active", createdOn: "20 Jan 2024, 09:00 AM", lastUpdated: "20 May 2024, 10:15 AM" },
        { id: "5", name: "Support Agent", key: "support_agent", description: "In charge of active telemetry inquiries, tickets, patient complaints, live text portals.", userCount: 28, isSystem: false, status: "Active", createdOn: "22 Jan 2024, 10:00 AM", lastUpdated: "22 May 2024, 08:30 AM" },
        { id: "6", name: "Content Manager", key: "content_manager", description: "Edits system banners, advertisements, blogs, notification broadcast campaigns.", userCount: 8, isSystem: false, status: "Active", createdOn: "25 Jan 2024, 03:30 PM", lastUpdated: "19 May 2024, 11:20 AM" },
        { id: "7", name: "Finance Manager", key: "finance_manager", description: "Reviews appointment billing, invoices, credit refunds, payouts distributions.", userCount: 6, isSystem: false, status: "Active", createdOn: "28 Jan 2024, 04:15 PM", lastUpdated: "18 May 2024, 03:45 PM" },
        { id: "8", name: "Viewer", key: "viewer_restricted", description: "ReadOnly observation clearance. No writing or alteration permission across endpoints.", userCount: 33, isSystem: false, status: "Active", createdOn: "01 Feb 2024, 01:00 PM", lastUpdated: "12 May 2024, 10:00 AM" }
    ]);
    // Selected Role State
    const [selectedRoleId, setSelectedRoleId] = useState("1");
    const selectedRole = useMemo(() => {
        return roles.find(r => r.id === selectedRoleId) || roles[0];
    }, [roles, selectedRoleId]);
    // Sidebar Roles Search
    const [roleSearch, setRoleSearch] = useState("");
    const filteredRoles = useMemo(() => {
        return roles.filter(r => r.name.toLowerCase().includes(roleSearch.toLowerCase()));
    }, [roles, roleSearch]);
    // Permissions Checklist State (Grouped/Keyed by [roleId_permissionId])
    const [matrixPermissions, setMatrixPermissions] = useState(() => {
        // Seed initial standard matrices for standard roles
        const baseModules = [
            { id: "dash", name: "Dashboard", module: "Dashboard Overview" },
            { id: "usr", name: "User Management", module: "User Directory" },
            { id: "doc", name: "Doctor Management", module: "Clinical Roster" },
            { id: "hosp", name: "Hospital Management", module: "Wards & Clinics" },
            { id: "appt", name: "Appointments", module: "Schedules" },
            { id: "cons", name: "Consultations", module: "Clinical Case Logs" },
            { id: "bill", name: "Billing & Payments", module: "Finance & Refunds" },
            { id: "supp", name: "Support & Tickets", module: "CRM Inquiries" },
            { id: "rep", name: "Reports & Analytics", module: "System Metrics" },
            { id: "set", name: "System Settings", module: "General Admin Panel" }
        ];
        const initial = {};
        // Seed for Super Admin (all true), viewer (only view true), and others (mix)
        ["1", "2", "3", "4", "5", "6", "7", "8"].forEach(rid => {
            initial[rid] = baseModules.map(m => {
                const isSuper = rid === "1";
                const isViewer = rid === "8";
                return {
                    id: m.id,
                    name: m.name,
                    module: m.module,
                    permissions: {
                        view: isSuper || isViewer || Math.random() > 0.1,
                        add: isSuper ? true : isViewer ? false : Math.random() > 0.4,
                        edit: isSuper ? true : isViewer ? false : Math.random() > 0.4,
                        delete: isSuper ? true : isViewer ? false : Math.random() > 0.7,
                        export: isSuper ? true : isViewer ? false : Math.random() > 0.5,
                        manage: isSuper ? true : isViewer ? false : Math.random() > 0.6,
                    }
                };
            });
        });
        return initial;
    });
    // Current Matrix Rows base
    const currentMatrix = useMemo(() => {
        return matrixPermissions[selectedRoleId] || [];
    }, [matrixPermissions, selectedRoleId]);
    const [permissionsSearch, setPermissionsSearch] = useState("");
    const filteredMatrix = useMemo(() => {
        if (!permissionsSearch)
            return currentMatrix;
        return currentMatrix.filter(row => row.name.toLowerCase().includes(permissionsSearch.toLowerCase()) ||
            row.module.toLowerCase().includes(permissionsSearch.toLowerCase()));
    }, [currentMatrix, permissionsSearch]);
    // Compute stats for current selected role Matrix
    const stats = useMemo(() => {
        const rows = matrixPermissions[selectedRoleId] || [];
        let totalPermissionsChecked = 0;
        let totalAvailableCells = rows.length * 6; // 6 checkboxes per row
        rows.forEach(r => {
            if (r.permissions.view)
                totalPermissionsChecked++;
            if (r.permissions.add)
                totalPermissionsChecked++;
            if (r.permissions.edit)
                totalPermissionsChecked++;
            if (r.permissions.delete)
                totalPermissionsChecked++;
            if (r.permissions.export)
                totalPermissionsChecked++;
            if (r.permissions.manage)
                totalPermissionsChecked++;
        });
        return {
            granted: totalPermissionsChecked,
            denied: totalAvailableCells - totalPermissionsChecked,
            total: totalAvailableCells,
            percent: totalAvailableCells > 0 ? Math.round((totalPermissionsChecked / totalAvailableCells) * 100) : 100
        };
    }, [matrixPermissions, selectedRoleId]);
    const toggleCheck = (rowId, type) => {
        setMatrixPermissions(prev => {
            const copy = { ...prev };
            const roleRows = [...(copy[selectedRoleId] || [])];
            const targetIndex = roleRows.findIndex(r => r.id === rowId);
            if (targetIndex !== -1) {
                roleRows[targetIndex] = {
                    ...roleRows[targetIndex],
                    permissions: {
                        ...roleRows[targetIndex].permissions,
                        [type]: !roleRows[targetIndex].permissions[type]
                    }
                };
                copy[selectedRoleId] = roleRows;
            }
            return copy;
        });
        showToast(`Toggled permission: ${type} capability mutated.`);
    };
    const handleAddRoleClick = () => {
        const roleNameInput = prompt("Enter the name for the new security role:");
        if (!roleNameInput || !roleNameInput.trim())
            return;
        const key = roleNameInput.toLowerCase().replace(/\s+/g, "_");
        const newId = (roles.length + 1).toString();
        const newRole = {
            id: newId,
            name: roleNameInput.trim(),
            key,
            description: "Custom administrative role definition with customizable access permissions matrix.",
            userCount: 0,
            isSystem: false,
            status: "Active",
            createdOn: "16 Jun 2026, 12:00 PM",
            lastUpdated: "16 Jun 2026, 12:00 PM"
        };
        setRoles([...roles, newRole]);
        setSelectedRoleId(newId);
        showToast(`Security role "${roleNameInput}" successfully compiled and appended to identity registry.`);
    };
    return (<div className="space-y-6 w-full text-left" id="roles-permissions-space-dock">
      
      {/* Metrics Row (exact mimic of reference image) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex items-center gap-3.5">
          <div className="bg-[#10b981]/10 text-emerald-700 p-2.5 rounded-xl">
            <Shield size={18}/>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Roles</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-black text-slate-800">{roles.length}</span>
              <span className="text-[9px] text-emerald-600 font-extrabold">+14.3% vs last 30d</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex items-center gap-3.5">
          <div className="bg-[#a855f7]/10 text-purple-700 p-2.5 rounded-xl">
            <Key size={18}/>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Permissions</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-black text-slate-800">126</span>
              <span className="text-[9px] text-[#8b5cf6] font-extrabold">+8.7% vs last 30d</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex items-center gap-3.5">
          <div className="bg-[#f97316]/10 text-orange-600 p-2.5 rounded-xl">
            <Users size={18}/>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Roles Assigned</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-black text-slate-800">152</span>
              <span className="text-[9px] text-orange-600 font-extrabold">+12.5% vs last 30d</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex items-center gap-3.5">
          <div className="bg-[#3b82f6]/10 text-blue-600 p-2.5 rounded-xl">
            <UserCheck size={18}/>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Admin Users</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-black text-slate-800">12</span>
              <span className="text-[9px] text-blue-600 font-extrabold">+9.1% vs last 30d</span>
            </div>
          </div>
        </div>

        <div className="col-span-2 md:col-span-1 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex items-center gap-3.5">
          <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl border border-emerald-100">
            <CheckCircle size={18}/>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Roles</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-black text-slate-800">8</span>
              <span className="text-[9px] text-slate-500 font-bold">0% vs last 30d</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Structural Body */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Col 1: Roles Left List (3/12 width) */}
        <div className="xl:col-span-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 space-y-4">
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={12}/>
              <input type="text" placeholder="Search roles..." value={roleSearch} onChange={(e) => setRoleSearch(e.target.value)} className="w-full text-xs pl-8 pr-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"/>
            </div>
            <button onClick={handleAddRoleClick} className="bg-[#047857] hover:bg-emerald-800 text-white p-2.5 rounded-xl shadow-xs transition shrink-0 cursor-pointer flex items-center justify-center" title="Add Security Role">
              <Plus size={14}/>
            </button>
          </div>

          <div className="space-y-1.5 max-h-[480px] overflow-y-auto">
            {filteredRoles.map((role) => {
            const isSelected = role.id === selectedRoleId;
            return (<button key={role.id} onClick={() => setSelectedRoleId(role.id)} className={`w-full flex items-center justify-between p-3 rounded-xl transition text-left cursor-pointer ${isSelected
                    ? "bg-slate-50 border border-slate-200"
                    : "hover:bg-slate-50/60"}`}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg shrink-0 ${isSelected ? "bg-emerald-50 text-[#047857]" : "bg-slate-50 text-slate-400"}`}>
                      <Shield size={14}/>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-black text-slate-800 truncate leading-tight">{role.name}</p>
                        {role.isSystem && (<span className="bg-emerald-100 text-[#047857] px-1 py-[1px] rounded text-[8px] font-black tracking-tight font-sans uppercase">System</span>)}
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{role.userCount} Active Users</p>
                    </div>
                  </div>
                  <ChevronRight size={12} className={isSelected ? "text-[#047857]" : "text-slate-350"}/>
                </button>);
        })}
          </div>
        </div>

        {/* Col 2: Permissions Matrix (5/12 width) */}
        <div className="xl:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-50 pb-3">
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight">Permissions Matrix</h3>
              <p className="text-[10px] text-[#047857] mt-0.5 font-bold">Role: <span className="font-black text-slate-800">{selectedRole.name}</span></p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={11}/>
                <input type="text" placeholder="Filter permissions..." value={permissionsSearch} onChange={(e) => setPermissionsSearch(e.target.value)} className="text-[10px] bg-slate-50 border border-slate-200 rounded-lg pl-7 pr-2 py-1.5 w-[130px] focus:outline-none"/>
              </div>
              <button onClick={() => {
            setMatrixPermissions(prev => {
                const copy = { ...prev };
                copy[selectedRoleId] = (copy[selectedRoleId] || []).map(row => ({
                    ...row,
                    permissions: { view: true, add: true, edit: true, delete: true, export: true, manage: true }
                }));
                return copy;
            });
            showToast("Bulk Action: Granted all roles clearances.");
        }} className="text-[10px] text-[#047857] bg-emerald-50 hover:bg-emerald-100 px-2 py-1.5 rounded-lg border border-emerald-100 font-black cursor-pointer shadow-xs transition">
                Expand All
              </button>
            </div>
          </div>

          {/* Matrix table list */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold text-[10px] uppercase bg-slate-50/50">
                  <th className="py-2.5 px-3 font-extrabold">Module</th>
                  <th className="py-2 px-1.5 text-center font-extrabold">View</th>
                  <th className="py-2 px-1.5 text-center font-extrabold">Add</th>
                  <th className="py-2 px-1.5 text-center font-extrabold">Edit</th>
                  <th className="py-2 px-1.5 text-center font-extrabold">Del</th>
                  <th className="py-2 px-1.5 text-center font-extrabold">Exp</th>
                  <th className="py-2 px-1.5 text-center font-extrabold">Mng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMatrix.map((row) => (<tr key={row.id} className="hover:bg-slate-50/40 transition">
                    <td className="py-2.5 px-3">
                      <p className="font-extrabold text-slate-800 leading-tight">{row.name}</p>
                      <p className="text-[9px] text-[#047857] font-semibold mt-0.5">{row.module}</p>
                    </td>
                    <td className="text-center">
                      <input type="checkbox" checked={row.permissions.view} onChange={() => toggleCheck(row.id, "view")} className="accent-[#047857] size-3.5 cursor-pointer rounded"/>
                    </td>
                    <td className="text-center">
                      <input type="checkbox" checked={row.permissions.add} onChange={() => toggleCheck(row.id, "add")} className="accent-[#047857] size-3.5 cursor-pointer rounded"/>
                    </td>
                    <td className="text-center">
                      <input type="checkbox" checked={row.permissions.edit} onChange={() => toggleCheck(row.id, "edit")} className="accent-[#047857] size-3.5 cursor-pointer rounded"/>
                    </td>
                    <td className="text-center">
                      <input type="checkbox" checked={row.permissions.delete} onChange={() => toggleCheck(row.id, "delete")} className="accent-[#047857] size-3.5 cursor-pointer rounded"/>
                    </td>
                    <td className="text-center">
                      <input type="checkbox" checked={row.permissions.export} onChange={() => toggleCheck(row.id, "export")} className="accent-[#047857] size-3.5 cursor-pointer rounded"/>
                    </td>
                    <td className="text-center">
                      <input type="checkbox" checked={row.permissions.manage} onChange={() => toggleCheck(row.id, "manage")} className="accent-[#047857] size-3.5 cursor-pointer rounded"/>
                    </td>
                  </tr>))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Col 3: Role Details (4/12 width) */}
        <div className="xl:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-5">
          <div className="border-b border-slate-50 pb-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight">Role Details</h3>
            <p className="text-[10px] text-slate-400 font-medium">Verify role metadata values and credentials status.</p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Descriptive Field Cards */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider block">Role Name</span>
                <span className="font-extrabold text-slate-800 block mt-1">{selectedRole.name}</span>
              </div>
              <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider block">Role Key</span>
                <span className="font-mono text-slate-500 font-bold block mt-1">{selectedRole.key}</span>
              </div>
            </div>

            <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
              <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider block">Role description</span>
              <p className="font-medium text-slate-600 mt-1 leading-relaxed text-[11px]">{selectedRole.description}</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 text-center">
                <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider block">Status</span>
                <span className="inline-flex px-2 py-0.5 bg-emerald-50 text-[#047857] rounded-full font-black mt-1.5 text-[9px]">Active</span>
              </div>
              <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 text-center">
                <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider block">Total Users</span>
                <span className="font-mono font-black text-slate-800 text-sm block mt-1">{selectedRole.userCount}</span>
              </div>
              <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 text-center">
                <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider block">System Key</span>
                <span className={`inline-flex px-2 py-0.5 rounded-full font-black mt-1.5 text-[9px] ${selectedRole.isSystem ? "bg-emerald-50 text-[#047857]" : "bg-slate-100 text-slate-500"}`}>
                  {selectedRole.isSystem ? "YES" : "NO"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100 text-[10.5px]">
              <div>
                <span className="text-slate-400 font-bold">Created On</span>
                <p className="font-medium text-slate-600 font-mono mt-0.5">{selectedRole.createdOn}</p>
              </div>
              <div>
                <span className="text-slate-400 font-bold">Last Updated</span>
                <p className="font-medium text-slate-600 font-mono mt-0.5">{selectedRole.lastUpdated}</p>
              </div>
            </div>

            {/* Custom SVG Pie Chart mimicking image summary */}
            <div className="pt-4 border-t border-slate-100 space-y-3.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Permissions Summary</span>
              
              <div className="flex items-center gap-6 bg-slate-50/40 p-3.5 rounded-2xl border border-slate-100">
                {/* SVG Radial Gauge */}
                <div className="relative size-20 shrink-0 flex items-center justify-center">
                  <svg className="size-full rotate-270">
                    <circle cx="40" cy="40" r="32" className="stroke-slate-200 fill-none" strokeWidth="6"/>
                    <circle cx="40" cy="40" r="32" className="stroke-emerald-500 fill-none transition-all duration-500" strokeWidth="6" strokeDasharray="201" strokeDashoffset={201 - (201 * stats.percent) / 100}/>
                  </svg>
                  <div className="absolute inset-x-0 text-center flex flex-col justify-center items-center">
                    <span className="text-sm font-black font-mono text-slate-800 leading-none">{stats.granted}</span>
                    <span className="text-[8px] text-slate-400 block font-bold font-mono mt-0.5">Total</span>
                  </div>
                </div>

                <div className="flex-1 space-y-1.5 text-[11px]">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-emerald-500"/>
                      <span className="font-bold text-slate-500">Granted</span>
                    </div>
                    <span className="font-mono font-black text-slate-700">{stats.granted} ({stats.percent}%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-amber-500"/>
                      <span className="font-bold text-slate-500">Partial</span>
                    </div>
                    <span className="font-mono font-black text-slate-500">0 (0%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-red-500"/>
                      <span className="font-bold text-slate-500">Denied</span>
                    </div>
                    <span className="font-mono font-black text-slate-700">{stats.denied} ({100 - stats.percent}%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons (mimics mockup) */}
            <div className="pt-3.5 space-y-2">
              <button type="button" onClick={() => showToast(`Initiated role editor compilation flow for ${selectedRole.name}`)} className="w-full py-2.5 border border-[#10b981] hover:bg-emerald-50 text-[#047857] hover:text-emerald-800 rounded-xl font-extrabold text-xs transition cursor-pointer flex items-center justify-center gap-2">
                <Edit size={12}/>
                <span>Edit Role</span>
              </button>
              <button type="button" onClick={() => {
            if (selectedRole.isSystem) {
                showToast("System Protection Active: Core system privileges cannot be unregistered.");
                return;
            }
            if (confirm(`Are you sure you want to permanently unregister role "${selectedRole.name}"?`)) {
                setRoles(roles.filter(r => r.id !== selectedRoleId));
                setSelectedRoleId(roles[0].id);
                showToast(`Role deregistered from environment directory.`);
            }
        }} className="w-full py-2.5 border border-rose-200 hover:bg-rose-50 text-rose-600 hover:text-rose-700 rounded-xl font-extrabold text-xs transition cursor-pointer flex items-center justify-center gap-2">
                <Trash size={12}/>
                <span>Delete Role</span>
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Absolute Bottom Information Strip */}
      <div className="p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-605 font-medium text-slate-600">
          <Info size={14} className="text-indigo-600 shrink-0"/>
          <span>Roles & Permissions help you control access to modules and features based on user roles. Manage roles and their permissions to ensure data security and workflow management.</span>
        </div>
        <div className="flex items-center gap-2 shrink-0 text-slate-50s font-bold text-slate-500">
          <span>Data is updated every 5 minutes</span>
          <button onClick={() => showToast("Role matrix and permissions synchronizing complete... Saved offline cache.")} className="p-1 hover:bg-slate-100 rounded-full transition cursor-pointer" title="Force Synchronize">
            <RefreshCw size={11} className="text-slate-400 hover:text-slate-700"/>
          </button>
        </div>
      </div>

    </div>);
}
