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
import LeadBoard from "@/components/LeadBoard"; // <-- New Import
import LeadForm from "@/components/LeadForm"; 
import EditModal from "@/components/EditModal";
import LeadCharts from "@/components/LeadCharts";
import ConfirmModal from "@/components/ConfirmModal"; 
import { Plus, LayoutGrid, List, Search, ChevronLeft, ChevronRight, Download, Columns } from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  
  // States
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("board"); // Default to Board view for pro feel
  
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const fetchLeads = async (page = 1) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page, limit: 100, // Fetch more for board view
        search, status: statusFilter, sortBy: sortConfig.key, order: sortConfig.direction
      });

      const res = await fetch(`/api/leads?${query.toString()}`);
      const data = await res.json();
      if (data.success) {
        setLeads(data.data);
        setPagination(data.pagination);
      }
    } catch (err) {
      toast.error("Failed to load leads");
    }
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

  useEffect(() => {
    if(user) fetchLeads(1);
  }, [user]);

  const handleSort = (key, direction) => {
    setSortConfig({ key, direction });
  };

  const confirmDelete = async () => {
    if(!deleteId) return;
    await fetch(`/api/leads/${deleteId}`, { method: "DELETE" });
    fetchLeads(pagination.page);
    toast.success("Lead Deleted");
    setDeleteId(null);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    // Optimistic Update
    setLeads(prev => prev.map(lead => lead._id === id ? { ...lead, status: newStatus } : lead));
    
    await fetch(`/api/leads/${id}`, { 
      method: "PUT", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({ status: newStatus }) 
    });
    
    if(newStatus === 'Closed') toast.success("Deal Closed! 🎉");
    else toast.success("Status Updated");
  };

  const handleEditSave = async (id, updatedData) => {
    await fetch(`/api/leads/${id}`, { 
      method: "PUT", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify(updatedData) 
    });
    fetchLeads(pagination.page);
    toast.success("Lead Info Updated");
  };

  if (!user) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">Loading DevSamp...</div>;

  return (
    <div className="min-h-screen text-slate-200 font-sans pb-20">
      <Background />
      <Toaster position="top-center" toastOptions={{ style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' } }}/>

      <div className="max-w-[1600px] mx-auto p-4 md:p-6">
        <Header />
        
        {/* Only show charts in Table/Grid mode to save space in Board mode */}
        {viewMode !== 'board' && !loading && leads.length > 0 && <LeadCharts leads={leads} />}

        <Stats leads={leads} /> 

        {/* Filters & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 sticky top-2 z-30 bg-slate-950/80 p-2 rounded-2xl backdrop-blur-md border border-slate-800">
            <div className="relative w-full md:w-96 group">
                <Search className="absolute left-3 top-3 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                <input 
                    type="text" 
                    placeholder="Search leads..." 
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-cyan-500 outline-none transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
                <button onClick={downloadCSV} className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold px-3 py-2.5 rounded-xl transition-all flex items-center gap-2">
                    <Download size={18} />
                </button>

                {/* View Switcher */}
                <div className="flex bg-slate-900 border border-slate-700 rounded-xl p-1">
                    <button onClick={() => setViewMode("board")} className={`p-2.5 rounded-lg transition-all ${viewMode==='board' ? 'bg-slate-800 text-cyan-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`} title="Kanban Board"><Columns size={18}/></button>
                    <button onClick={() => setViewMode("grid")} className={`p-2.5 rounded-lg transition-all ${viewMode==='grid' ? 'bg-slate-800 text-cyan-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`} title="Grid View"><LayoutGrid size={18}/></button>
                    <button onClick={() => setViewMode("table")} className={`p-2.5 rounded-lg transition-all ${viewMode==='table' ? 'bg-slate-800 text-cyan-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`} title="Table View"><List size={18}/></button>
                </div>

                <button 
                    onClick={() => setShowAddModal(true)} 
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 whitespace-nowrap"
                >
                    <Plus size={20} /> Add Lead
                </button>
            </div>
        </div>

        {/* Content Area */}
        {loading ? (
            <div className="h-64 flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-500"></div></div>
        ) : (
            <>
                {viewMode === "board" && (
                    <LeadBoard 
                        leads={leads} 
                        onDelete={(id) => setDeleteId(id)} 
                        onUpdateStatus={handleUpdateStatus} 
                        onEdit={setEditingLead} 
                    />
                )}

                {viewMode === "grid" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {leads.map(lead => (
                            <LeadCard 
                                key={lead._id} 
                                lead={lead} 
                                onDelete={(id) => setDeleteId(id)} 
                                onUpdateStatus={handleUpdateStatus} 
                                onEdit={setEditingLead} 
                            />
                        ))}
                    </div>
                )}

                {viewMode === "table" && (
                    <LeadTable 
                        leads={leads} 
                        onDelete={(id) => setDeleteId(id)} 
                        onEdit={setEditingLead} 
                        onSort={handleSort}
                        sortConfig={sortConfig}
                        onUpdateStatus={handleUpdateStatus} 
                    />
                )}
            </>
        )}
      </div>

      {showAddModal && <LeadForm onClose={() => setShowAddModal(false)} onLeadAdded={() => fetchLeads(1)} />}
      {editingLead && <EditModal lead={editingLead} onClose={() => setEditingLead(null)} onSave={handleEditSave} />}
      
      <ConfirmModal 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={confirmDelete} 
        title="Delete Lead?"
        message="Are you sure? This action is permanent."
      />
    </div>
  );
}