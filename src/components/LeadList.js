import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ArrowUpDown, Inbox } from "lucide-react";
import LeadCard from "./LeadCard";

export default function LeadList({ leads, loading, onDelete, onUpdateStatus, onEdit }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterService, setFilterService] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  let filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (lead.phone && lead.phone.includes(searchTerm));
    const matchesService = filterService === "All" || lead.service === filterService;
    return matchesSearch && matchesService;
  });

  filteredLeads.sort((a, b) => {
    if (sortBy === "Budget: High to Low") {
      const budgetA = parseInt(a.budget?.replace(/[^0-9]/g, '') || 0);
      const budgetB = parseInt(b.budget?.replace(/[^0-9]/g, '') || 0);
      return budgetB - budgetA;
    }
    if (sortBy === "Oldest") return new Date(a.createdAt) - new Date(b.createdAt);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="lg:col-span-2">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><Inbox className="text-cyan-400" size={20}/> Pipeline</h2>
          <span className="text-[10px] font-bold bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700">
            {filteredLeads.length} leads
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
            <input type="text" placeholder="Search leads..." className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:border-cyan-500 outline-none"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex gap-2">
             <div className="relative">
                <Filter className="absolute left-3 top-2.5 text-slate-500" size={14} />
                <select className="bg-slate-900 border border-slate-700 rounded-xl py-2 pl-8 pr-6 text-sm text-slate-300 outline-none appearance-none cursor-pointer"
                  value={filterService} onChange={(e) => setFilterService(e.target.value)}>
                  <option value="All">All Services</option>
                  <option value="Web Development">Web Dev</option>
                  <option value="App Development">App Dev</option>
                  <option value="SEO & Marketing">SEO</option>
                </select>
             </div>
             <div className="relative">
                <ArrowUpDown className="absolute left-3 top-2.5 text-slate-500" size={14} />
                <select className="bg-slate-900 border border-slate-700 rounded-xl py-2 pl-8 pr-6 text-sm text-slate-300 outline-none appearance-none cursor-pointer"
                  value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="Newest">Newest</option>
                  <option value="Oldest">Oldest</option>
                  <option value="Budget: High to Low">Budget</option>
                </select>
             </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center h-40 pt-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {filteredLeads.map((lead) => (
              <LeadCard key={lead._id} lead={lead} onDelete={onDelete} onUpdateStatus={onUpdateStatus} onEdit={onEdit} />
            ))}
          </AnimatePresence>
          {filteredLeads.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-500 bg-slate-900/30 rounded-xl border border-dashed border-slate-800">No leads found.</div>
          )}
        </div>
      )}
    </div>
  );
}