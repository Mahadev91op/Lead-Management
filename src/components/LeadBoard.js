// src/components/LeadBoard.js
import LeadCard from "./LeadCard";
import { motion } from "framer-motion";

export default function LeadBoard({ leads, onDelete, onUpdateStatus, onEdit }) {
  const statuses = ["New", "Contacted", "Meeting Fixed", "Closed"];

  const getColumnColor = (status) => {
    if (status === "New") return "border-blue-500/30 bg-blue-500/5";
    if (status === "Contacted") return "border-yellow-500/30 bg-yellow-500/5";
    if (status === "Meeting Fixed") return "border-purple-500/30 bg-purple-500/5";
    return "border-green-500/30 bg-green-500/5";
  };

  return (
    <div className="flex overflow-x-auto pb-4 gap-4 h-[calc(100vh-220px)] custom-scrollbar">
      {statuses.map((status) => {
        // Filter leads for this column
        const columnLeads = leads.filter((l) => l.status === status);

        return (
          <div key={status} className={`min-w-[320px] max-w-[320px] flex flex-col rounded-2xl border ${getColumnColor(status)} backdrop-blur-sm bg-white`}>
            {/* Column Header */}
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-2xl">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">{status}</h3>
              <span className="text-xs font-bold bg-slate-200 px-2 py-1 rounded-full text-slate-600">
                {columnLeads.length}
              </span>
            </div>

            {/* Cards Container (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 custom-scrollbar">
              {columnLeads.length > 0 ? (
                columnLeads.map((lead) => (
                  <LeadCard 
                    key={lead._id} 
                    lead={lead} 
                    onDelete={onDelete} 
                    onUpdateStatus={onUpdateStatus} 
                    onEdit={onEdit} 
                  />
                ))
              ) : (
                <div className="text-center py-10 opacity-30 text-sm italic">Empty</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}