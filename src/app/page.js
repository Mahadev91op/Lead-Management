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
import LeadBoard from "@/components/LeadBoard"; 
import LeadForm from "@/components/LeadForm"; 
import EditModal from "@/components/EditModal";
import LeadCharts from "@/components/LeadCharts";
import ConfirmModal from "@/components/ConfirmModal"; 
import { Plus, LayoutGrid, List, Search, ChevronLeft, ChevronRight, Download, Columns, Loader2, BellRing, ArrowRight } from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  
  // States
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("board"); 
  
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const fetchLeads = async (page = 1) => {
    // Note: Hum yahan setLoading(true) nahi kar rahe taaki search karte waqt "flash" na ho
    // Sirf initial load par spinner dikhayenge
    if(leads.length === 0) setLoading(true); 

    try {
      const query = new URLSearchParams({
        page, limit: 100, 
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

  const urgentLeads = leads.filter(l => {
    if (l.status === "Closed") return false;
    const followDate = new Date(l.followUpDate || l.createdAt);
    followDate.setHours(0,0,0,0);
    const today = new Date();
    today.setHours(0,0,0,0);
    return followDate <= today;
  });

  if (!user) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">Loading DevSamp...</div>;

  return (
    <div className="min-h-screen text-slate-800 font-sans pb-20">
      <Background />
      <Toaster position="top-center" toastOptions={{ style: { background: '#ffffff', color: '#0f172a', border: '1px solid #e2e8f0' } }}/>

      <div className="max-w-[1600px] mx-auto p-4 md:p-6">
        <Header />
        
        {viewMode !== 'board' && !loading && leads.length > 0 && <LeadCharts leads={leads} />}

        <Stats leads={leads} /> 

        {urgentLeads.length > 0 && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-2xl mb-6 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-full text-red-600">
                <BellRing size={20} className="animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-red-800 text-sm">Action Required!</h3>
                <p className="text-red-600 text-xs mt-0.5">You have {urgentLeads.length} lead(s) requiring follow-up today or overdue.</p>
              </div>
            </div>
            <button 
              onClick={() => { setViewMode('table'); setSortConfig({ key: 'followUpDate', direction: 'asc' }) }} 
              className="text-xs font-bold bg-white text-red-600 px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-100 transition flex items-center gap-1"
            >
              View Leads <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* Filters & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 sticky top-2 z-30 bg-white/80 p-2 rounded-2xl backdrop-blur-md border border-slate-200 shadow-sm">
            
            {/* FIX: Form Wrapper to prevent reload on Enter */}
            <form onSubmit={(e) => e.preventDefault()} className="relative w-full md:w-96 group">
                <Search className="absolute left-3 top-3 text-slate-400 group-focus-within:text-cyan-600 transition-colors" size={18} />
                <input 
                    type="text" 
                    placeholder="Search leads..." 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 focus:border-cyan-500 outline-none transition-all shadow-inner"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </form>

            <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
                <button onClick={downloadCSV} className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold px-3 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-sm">
                    <Download size={18} />
                </button>

                <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-1 shadow-inner">
                    <button onClick={() => setViewMode("board")} className={`p-2.5 rounded-lg transition-all ${viewMode==='board' ? 'bg-white text-cyan-600 shadow-sm border border-slate-200/60' : 'text-slate-500 hover:text-slate-700'}`} title="Kanban Board"><Columns size={18}/></button>
                    <button onClick={() => setViewMode("grid")} className={`p-2.5 rounded-lg transition-all ${viewMode==='grid' ? 'bg-white text-cyan-600 shadow-sm border border-slate-200/60' : 'text-slate-500 hover:text-slate-700'}`} title="Grid View"><LayoutGrid size={18}/></button>
                    <button onClick={() => setViewMode("table")} className={`p-2.5 rounded-lg transition-all ${viewMode==='table' ? 'bg-white text-cyan-600 shadow-sm border border-slate-200/60' : 'text-slate-500 hover:text-slate-700'}`} title="Table View"><List size={18}/></button>
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
        {loading && leads.length === 0 ? (
            <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-cyan-500" size={40} /></div>
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