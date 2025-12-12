// components/LeadCard.js
import { motion } from "framer-motion";
import { Mail, Phone, MessageCircle, Trash2, IndianRupee, Globe, Calendar } from "lucide-react";

export default function LeadCard({ lead, onDelete, onUpdateStatus }) {
  
  const getStatusColor = (status) => {
    switch (status) {
      case "New": return "text-cyan-400 border-cyan-500/30 bg-cyan-500/10";
      case "Contacted": return "text-yellow-400 border-yellow-500/30 bg-yellow-500/10";
      case "Closed": return "text-green-400 border-green-500/30 bg-green-500/10";
      default: return "text-slate-400 border-slate-500/30 bg-slate-500/10";
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all duration-300 relative"
    >
      {/* Top Section: Service Tag & Budget */}
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/20">
          {lead.service || "Web Dev"}
        </span>
        {lead.budget && (
          <span className="flex items-center text-green-400 font-mono font-bold text-sm">
            <IndianRupee size={12} className="mr-0.5" />{lead.budget}
          </span>
        )}
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
              {lead.name}
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
               <Globe size={12}/> {lead.source} • <Calendar size={12}/> {new Date(lead.createdAt).toLocaleDateString()}
            </div>
          </div>
          <button 
            onClick={() => onDelete(lead._id)}
            className="text-slate-600 hover:text-red-500 transition-colors p-1.5 hover:bg-red-500/10 rounded"
            title="Delete Lead"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Contact Details */}
        <div className="flex flex-col gap-1.5 text-slate-400 text-sm mt-2 p-3 bg-slate-950/50 rounded-lg border border-slate-800">
          <div className="flex items-center gap-2 truncate">
            <Mail size={14} className="text-slate-500 shrink-0" /> 
            <span className="truncate">{lead.email}</span>
          </div>
          {lead.phone && (
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-slate-500 shrink-0" /> 
              <span>{lead.phone}</span>
            </div>
          )}
        </div>

        {/* Notes (अगर है तो) */}
        {lead.notes && (
          <p className="text-xs text-slate-500 italic mt-1 line-clamp-2">
            "{lead.notes}"
          </p>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/50">
          <select 
            value={lead.status}
            onChange={(e) => onUpdateStatus(lead._id, e.target.value)}
            className={`text-xs font-medium px-2 py-1 rounded border outline-none bg-slate-950 cursor-pointer ${getStatusColor(lead.status)}`}
          >
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Meeting Fixed">Meeting Fixed</option>
            <option value="Closed">Closed</option>
          </select>

          {lead.phone && (
            <a 
              href={`https://wa.me/${lead.phone.replace(/\D/g,'')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-bold text-green-500 hover:text-green-400 transition-all hover:bg-green-500/10 px-2 py-1 rounded"
            >
              <MessageCircle size={14} /> Chat
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}