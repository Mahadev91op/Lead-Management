// src/components/LeadCard.js
import { motion } from "framer-motion";
import { Mail, Phone, MessageCircle, Trash2, IndianRupee, Globe, Calendar, Link as LinkIcon, UserCircle, Edit2, Flag, Briefcase, AlertCircle, Clock } from "lucide-react";

export default function LeadCard({ lead, onDelete, onUpdateStatus, onEdit }) {
  
  // Smart Alert Logic
  const isOverdue = new Date(lead.followUpDate) < new Date().setHours(0,0,0,0) && lead.status !== "Closed";
  const isToday = new Date(lead.followUpDate).toDateString() === new Date().toDateString() && lead.status !== "Closed";

  const getStatusColor = (status) => {
    switch (status) {
      case "New": return "text-cyan-400 bg-cyan-500/10 border-cyan-500/30";
      case "Contacted": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
      case "Closed": return "text-green-400 bg-green-500/10 border-green-500/30";
      default: return "text-slate-400 bg-slate-500/10 border-slate-500/30";
    }
  };

  const getPriorityColor = (p) => {
    if(p === "High") return "text-red-400 bg-red-500/10 border-red-500/20";
    if(p === "Medium") return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
    return "text-slate-400 bg-slate-500/10 border-slate-500/20";
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`group bg-white border p-5 rounded-2xl transition-all shadow-md flex flex-col justify-between h-full
        ${isOverdue ? "border-red-300 shadow-red-100" : isToday ? "border-green-300 shadow-green-100" : "border-slate-200 hover:border-cyan-400 shadow-sm hover:shadow-cyan-100"}
      `}
    >
      <div>
        {/* Top Header */}
        <div className="flex justify-between items-start mb-4">
            <div className="flex flex-wrap gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/40 px-2 py-1 rounded border border-cyan-500/20">
                {lead.service}
                </span>
                {lead.niche && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/40 px-2 py-1 rounded border border-indigo-500/20 flex items-center gap-1">
                    <Briefcase size={10} /> {lead.niche}
                    </span>
                )}
                {/* Alert Badges */}
                {isOverdue && <span className="flex items-center gap-1 text-[10px] font-bold bg-red-500/20 text-red-400 px-2 py-1 rounded animate-pulse"><AlertCircle size={10} /> Late</span>}
                {isToday && <span className="flex items-center gap-1 text-[10px] font-bold bg-green-500/20 text-green-400 px-2 py-1 rounded"><Clock size={10} /> Today</span>}
            </div>
        </div>

        {/* Main Info */}
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-600 transition-colors leading-tight">
                {lead.name}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5">
                    <span className={`flex items-center gap-1 ${isOverdue ? "text-red-400 font-bold" : isToday ? "text-green-400 font-bold" : ""}`}>
                        <Calendar size={12}/> {new Date(lead.followUpDate || lead.createdAt).toLocaleDateString()}
                    </span>
                    {lead.budget && <span className="flex items-center text-green-400 font-mono bg-green-500/5 px-1.5 rounded"><IndianRupee size={10} />{lead.budget}</span>}
                </div>
            </div>
            <div className="flex gap-1">
                <button onClick={() => onEdit(lead)} className="text-slate-500 hover:text-blue-400 p-1.5 hover:bg-blue-500/10 rounded transition-colors"><Edit2 size={16} /></button>
                <button onClick={() => onDelete(lead._id)} className="text-slate-500 hover:text-red-400 p-1.5 hover:bg-red-500/10 rounded transition-colors"><Trash2 size={16} /></button>
            </div>
        </div>

        {/* Contact Info */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm text-slate-600 flex flex-col gap-2.5 mt-3">
           <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <span className="flex items-center gap-2 truncate"><Mail size={14} className="text-slate-500"/> {lead.email}</span>
              <a href={`mailto:${lead.email}`} className="text-cyan-600 hover:bg-cyan-100 p-1 rounded-md transition"><Mail size={12}/></a>
           </div>
           <div className="flex justify-between items-center">
              <span className="flex items-center gap-2"><Phone size={14} className="text-slate-500"/> {lead.phone || "No Phone"}</span>
              {lead.phone && <a href={`tel:${lead.phone}`} className="text-cyan-600 hover:bg-cyan-100 p-1 rounded-md transition"><Phone size={12}/></a>}
           </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200">
          <select 
            value={lead.status} 
            onChange={(e) => onUpdateStatus(lead._id, e.target.value)}
            className={`text-[11px] font-bold px-2 py-1.5 rounded-lg border outline-none bg-white cursor-pointer ${getStatusColor(lead.status)}`}
          >
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Meeting Fixed">Meeting</option>
            <option value="Closed">Closed</option>
          </select>

          {lead.phone && (
            <a href={`https://wa.me/${lead.phone.replace(/\D/g,'')}`} target="_blank" className="flex items-center gap-1 text-[11px] font-bold text-green-500 hover:text-white px-3 py-1.5 rounded-lg border border-green-500/20 hover:bg-green-600 transition-all">
              <MessageCircle size={14} /> Chat
            </a>
          )}
      </div>
    </motion.div>
  );
}