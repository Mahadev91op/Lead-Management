// src/components/LeadCard.js
import { motion } from "framer-motion";
import { Mail, Phone, MessageCircle, Trash2, IndianRupee, Globe, Calendar, Link as LinkIcon, UserCircle, Edit2, Flag } from "lucide-react";

export default function LeadCard({ lead, onDelete, onUpdateStatus, onEdit }) {
  
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
      className="group bg-slate-900/80 border border-slate-800 p-5 rounded-2xl hover:border-cyan-500/30 transition-all shadow-lg hover:shadow-cyan-900/10"
    >
      {/* Top Header: Service & Priority */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/40 px-2 py-1 rounded border border-cyan-500/20">
            {lead.service}
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border flex items-center gap-1 ${getPriorityColor(lead.priority)}`}>
            <Flag size={10} /> {lead.priority || "Medium"}
            </span>
        </div>
        
        <div className="flex items-center gap-1 text-[10px] text-slate-500 bg-slate-950 px-2 py-1 rounded-full border border-slate-800">
            <UserCircle size={10} className="text-purple-400" />
            <span className="truncate max-w-[80px]">{lead.addedBy}</span>
        </div>
      </div>

      {/* Main Info */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors leading-tight">
              {lead.name}
            </h3>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5">
               <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(lead.createdAt).toLocaleDateString()}</span>
               <span className="flex items-center gap-1"><Globe size={12}/> {lead.source}</span>
               {lead.budget && <span className="flex items-center text-green-400 font-mono bg-green-500/5 px-1.5 rounded"><IndianRupee size={10} />{lead.budget}</span>}
            </div>
          </div>
          
          {/* Edit/Delete Buttons */}
          <div className="flex gap-1">
            <button onClick={() => onEdit(lead)} className="text-slate-500 hover:text-blue-400 p-1.5 hover:bg-blue-500/10 rounded transition-colors" title="Edit">
                <Edit2 size={16} />
            </button>
            <button onClick={() => onDelete(lead._id)} className="text-slate-500 hover:text-red-400 p-1.5 hover:bg-red-500/10 rounded transition-colors" title="Delete">
                <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50 text-sm text-slate-400 flex flex-col gap-2.5">
           <div className="flex justify-between items-center border-b border-slate-800/50 pb-2">
              <span className="flex items-center gap-2 truncate"><Mail size={14} className="text-slate-600"/> {lead.email}</span>
              {lead.socialLink && (
                <a href={lead.socialLink} target="_blank" className="text-blue-400 hover:text-blue-300"><LinkIcon size={14}/></a>
              )}
           </div>
           <span className="flex items-center gap-2"><Phone size={14} className="text-slate-600"/> {lead.phone || "No Phone"}</span>
        </div>

        {/* Notes */}
        {lead.notes && <p className="text-xs text-slate-500 italic line-clamp-2 px-1">"{lead.notes}"</p>}

        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-1 pt-3 border-t border-slate-800/50">
          <select 
            value={lead.status} 
            onChange={(e) => onUpdateStatus(lead._id, e.target.value)}
            className={`text-[11px] font-bold px-2 py-1.5 rounded-lg border outline-none bg-slate-950 cursor-pointer ${getStatusColor(lead.status)}`}
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
      </div>
    </motion.div>
  );
}