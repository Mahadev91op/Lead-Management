// src/app/page.js
"use client";

import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import Background from "@/components/Background";
import Header from "@/components/Header";
import Stats from "@/components/Stats";
import LeadCard from "@/components/LeadCard";
import LeadTable from "@/components/LeadTable"; 
import LeadForm from "@/components/LeadForm"; 
import EditModal from "@/components/EditModal";
import LeadCharts from "@/components/LeadCharts";
import ConfirmModal from "@/components/ConfirmModal"; // <-- New Import
import { Plus, LayoutGrid, List, Search, ChevronLeft, ChevronRight, Download } from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  
  // States
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("table"); 
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });

  // Modals State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [deleteId, setDeleteId] = useState(null); // <-- State for Custom Delete

  const fetchLeads = async (page = 1) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page, limit: 10, search, status: statusFilter, sortBy: sortConfig.key, order: sortConfig.direction
      });
      const res = await fetch(`/api/leads?${query.toString()}`);
      const data = await res.json();
      if (data.success) {
        setLeads(data.data);
        setPagination(data.pagination);
      }
    } catch (err) { toast.error("Failed to load leads"); }
    setLoading(false);
  };

  const downloadCSV = () => {
    if (leads.length === 0) return toast.error("No data to export");
    const headers = ["Name,Niche,Email,Phone,Service,Budget,Status,Date,AddedBy"];
    const rows = leads.map(l => 
      `"${l.name}","${l.niche||''}","${l.email}","${l.phone}","${l.service}","${l.budget}","${l.status}","${new Date(l.createdAt).toLocaleDateString()}","${l.addedBy}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "leads_export.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast.success("Excel/CSV Downloaded! 📄");
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchLeads(1), 300); 
    return () => clearTimeout(timer);
  }, [search, statusFilter, sortConfig]);

  useEffect(() => { if(user) fetchLeads(1); }, [user]);

  const handleSort = (key, direction) => setSortConfig({ key, direction });

  // --- Updated Delete Logic ---
  const confirmDelete = async () => {
    if(!deleteId) return;
    await fetch(`/api/leads/${deleteId}`, { method: "DELETE" });
    fetchLeads(pagination.page);
    toast.success("Lead Deleted Successfully");
    setDeleteId(null);
  };
  // ----------------------------

  const handleUpdateStatus = async (id, newStatus) => {
    setLeads(leads.map(lead => lead._id === id ? { ...lead, status: newStatus } : lead));
    await fetch(`/api/leads/${id}`, { 
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: newStatus }) 
    });
    if(newStatus === 'Closed') toast.success("Deal Closed! 🎉");
    else toast.success("Status Updated");
  };

  const handleEditSave = async (id, updatedData) => {
    await fetch(`/api/leads/${id}`, { 
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updatedData) 
    });
    fetchLeads(pagination.page);
    toast.success("Lead Info Updated");
  };

  if (!user) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">Loading DevSamp...</div>;

  return (
    <div className="min-h-screen text-slate-200 font-sans pb-20">
      <Background />
      <Toaster position="top-center" toastOptions={{ style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' } }}/>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <Header />
        {!loading && leads.length > 0 && <LeadCharts leads={leads} />}
        <Stats leads={leads} /> 

        {/* Filters */}
        <div className="flex overflow-x-auto gap-2 mb-6 pb-2 custom-scrollbar">
            {["All", "New", "Contacted", "Meeting Fixed", "Closed"].map((status) => (
                <button key={status} onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                        statusFilter === status ? "bg-cyan-600 text-white border-cyan-500 shadow-lg" : "bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800"
                    }`}
                >
                    {status}
                </button>
            ))}
        </div>

        {/* Search & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="relative w-full md:w-96 group">
                <Search className="absolute left-3 top-3 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                <input type="text" placeholder="Search by name, niche, email..." 
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-cyan-500 outline-none transition-all"
                    value={search} onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="flex gap-3 w-full md:w-auto">
                <button onClick={downloadCSV} className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2">
                    <Download size={18} /> <span className="hidden sm:inline">Export</span>
                </button>
                <div className="flex bg-slate-900 border border-slate-700 rounded-xl p-1">
                    <button onClick={() => setViewMode("grid")} className={`p-2.5 rounded-lg transition-all ${viewMode==='grid' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500'}`}><LayoutGrid size={18}/></button>
                    <button onClick={() => setViewMode("table")} className={`p-2.5 rounded-lg transition-all ${viewMode==='table' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500'}`}><List size={18}/></button>
                </div>
                <button onClick={() => setShowAddModal(true)} className="flex-1 md:flex-none bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95">
                    <Plus size={20} /> <span className="hidden sm:inline">Add Lead</span>
                </button>
            </div>
        </div>

        {/* Content Area */}
        {loading ? (
             // --- Skeleton Loader (Professional Look) ---
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
                {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="h-48 bg-slate-900/50 rounded-2xl border border-slate-800"></div>
                ))}
             </div>
        ) : (
            <>
                {viewMode === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {leads.map(lead => (
                            <LeadCard key={lead._id} lead={lead} onDelete={(id) => setDeleteId(id)} onUpdateStatus={handleUpdateStatus} onEdit={setEditingLead} />
                        ))}
                    </div>
                ) : (
                    <LeadTable leads={leads} onDelete={(id) => setDeleteId(id)} onEdit={setEditingLead} onSort={handleSort} sortConfig={sortConfig} onUpdateStatus={handleUpdateStatus} />
                )}

                {leads.length > 0 && (
                    <div className="flex justify-between items-center mt-6 bg-slate-900/50 p-3 px-5 rounded-xl border border-slate-800">
                        <span className="text-xs font-medium text-slate-400">Page {pagination.page} of {pagination.pages} • Total {pagination.total} leads</span>
                        <div className="flex gap-2">
                            <button disabled={pagination.page === 1} onClick={() => fetchLeads(pagination.page - 1)} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 disabled:opacity-30 text-slate-300 transition"><ChevronLeft size={16}/></button>
                            <button disabled={pagination.page === pagination.pages} onClick={() => fetchLeads(pagination.page + 1)} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 disabled:opacity-30 text-slate-300 transition"><ChevronRight size={16}/></button>
                        </div>
                    </div>
                )}

                {leads.length === 0 && !loading && (
                    <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800 mt-4">
                        <p className="text-slate-500">No leads found. Try changing filters or add a new one.</p>
                    </div>
                )}
            </>
        )}
      </div>

      {showAddModal && <LeadForm onClose={() => setShowAddModal(false)} onLeadAdded={() => fetchLeads(1)} />}
      {editingLead && <EditModal lead={editingLead} onClose={() => setEditingLead(null)} onSave={handleEditSave} />}
      
      {/* --- Custom Confirm Modal --- */}
      <ConfirmModal 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={confirmDelete} 
        title="Delete Lead?"
        message="Are you sure you want to remove this client? This action cannot be undone."
      />
    </div>
  );
}