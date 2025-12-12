// components/LeadList.js
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import LeadCard from "./LeadCard";

export default function LeadList({ leads, loading, onDelete, onUpdateStatus }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterService, setFilterService] = useState("All"); // Service filter
  const [sortBy, setSortBy] = useState("Newest"); // Sorting

  // --- Filtering Logic ---
  let filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (lead.phone && lead.phone.includes(searchTerm));
    const matchesService = filterService === "All" || lead.service === filterService;
    return matchesSearch && matchesService;
  });

  // --- Sorting Logic ---
  filteredLeads.sort((a, b) => {
    if (sortBy === "Budget: High to Low") {
      const budgetA = parseInt(a.budget?.replace(/[^0-9]/g, '') || 0);
      const budgetB = parseInt(b.budget?.replace(/[^0-9]/g, '') || 0);
      return budgetB - budgetA; // ज्यादा पैसा ऊपर
    }
    if (sortBy === "Oldest") return new Date(a.createdAt) - new Date(b.createdAt);
    return new Date(b.createdAt) - new Date(a.createdAt); // Default: Newest first
  });

  return (
    <div className="lg:col-span-2">
      
      {/* --- Controls Bar --- */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Pipeline</h2>
          <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700">
            Showing {filteredLeads.length} leads
          </span>
        </div>

        {/* Search & Filters Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search name or phone..." 
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Service */}
          <div className="relative">
            <Filter className="absolute left-3 top-2.5 text-slate-500" size={16} />
            <select 
              className="bg-slate-900 border border-slate-700 rounded-xl py-2 pl-9 pr-8 text-sm text-slate-300 focus:outline-none appearance-none cursor-pointer hover:border-slate-600"
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
            >
              <option value="All">All Services</option>
              <option value="Web Development">Web Dev</option>
              <option value="App Development">App Dev</option>
              <option value="SEO & Marketing">SEO</option>
              <option value="UI/UX Design">UI/UX</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-2.5 text-slate-500" size={16} />
            <select 
              className="bg-slate-900 border border-slate-700 rounded-xl py-2 pl-9 pr-8 text-sm text-slate-300 focus:outline-none appearance-none cursor-pointer hover:border-slate-600"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="Newest">Newest First</option>
              <option value="Oldest">Oldest First</option>
              <option value="Budget: High to Low">Budget: High-Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* --- Cards Grid --- */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {filteredLeads.map((lead) => (
              <LeadCard 
                key={lead._id} 
                lead={lead} 
                onDelete={onDelete}
                onUpdateStatus={onUpdateStatus}
              />
            ))}
          </AnimatePresence>

          {filteredLeads.length === 0 && (
            <div className="col-span-full text-center py-12 bg-slate-900/50 rounded-xl border border-dashed border-slate-800">
              <p className="text-slate-500">No leads match your filters.</p>
              <button 
                onClick={() => {setSearchTerm(""); setFilterService("All");}}
                className="mt-2 text-cyan-400 hover:underline text-sm"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}