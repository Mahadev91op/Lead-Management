// src/components/LeadTable.js
import { motion } from "framer-motion";
import { Mail, Phone, Calendar, ArrowUp, ArrowDown, IndianRupee, Trash2, Edit2, Link as LinkIcon, MessageCircle } from "lucide-react";

export default function LeadTable({ leads, onEdit, onDelete, onSort, sortConfig, onUpdateStatus }) {
  
  const getPriorityColor = (p) => {
    if(p === "High") return "bg-red-500/20 text-red-400 border-red-500/20";
    if(p === "Medium") return "bg-yellow-500/20 text-yellow-400 border-yellow-500/20";
    return "bg-slate-500/20 text-slate-400 border-slate-500/20";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "New": return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case "Contacted": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      case "Meeting Fixed": return "text-purple-400 bg-purple-500/10 border-purple-500/20";
      case "Closed": return "text-green-400 bg-green-500/10 border-green-500/20";
      default: return "text-slate-400 bg-slate-500/10 border-slate-500/20";
    }
  };

  const handleHeaderClick = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    onSort(key, direction);
  };

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) return <ArrowDown size={14} className="opacity-20 ml-1" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp size={14} className="text-cyan-400 ml-1" /> 
      : <ArrowDown size={14} className="text-cyan-400 ml-1" />;
  };

  return (
    <div className="overflow-x-auto bg-white border border-slate-200 rounded-2xl shadow-sm">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider bg-slate-50">
            <th onClick={() => handleHeaderClick('name')} className="p-4 font-medium cursor-pointer hover:text-slate-900 transition"><div className="flex items-center">Client <SortIcon column="name"/></div></th>
            <th onClick={() => handleHeaderClick('priority')} className="p-4 font-medium cursor-pointer hover:text-slate-900 transition"><div className="flex items-center">Priority <SortIcon column="priority"/></div></th>
            <th onClick={() => handleHeaderClick('budget')} className="p-4 font-medium cursor-pointer hover:text-slate-900 transition"><div className="flex items-center">Budget <SortIcon column="budget"/></div></th>
            <th onClick={() => handleHeaderClick('status')} className="p-4 font-medium cursor-pointer hover:text-slate-900 transition"><div className="flex items-center">Status <SortIcon column="status"/></div></th>
            <th onClick={() => handleHeaderClick('createdAt')} className="p-4 font-medium cursor-pointer hover:text-slate-900 transition"><div className="flex items-center">Date <SortIcon column="createdAt"/></div></th>
            <th className="p-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-slate-100">
          {leads.map((lead, i) => (
            <motion.tr 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              key={lead._id} 
              className="hover:bg-slate-50 transition-colors group"
            >
              <td className="p-4">
                <div className="font-bold text-slate-900 group-hover:text-cyan-600 transition">{lead.name}</div>
                <div className="text-xs text-slate-500 flex flex-col gap-1.5 mt-1.5">
                  <span className="flex items-center gap-2"><Mail size={12}/> {lead.email}</span>
                  
                  {lead.phone && (
                    <div className="flex items-center gap-2">
                        <Phone size={12}/> {lead.phone}
                        <a href={`https://wa.me/${lead.phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-400 bg-green-500/10 p-1 rounded-full transition-colors flex items-center justify-center w-5 h-5">
                            <MessageCircle size={12} />
                        </a>
                    </div>
                  )}

                  {lead.socialLink && (
                    <a href={lead.socialLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 hover:underline">
                      <LinkIcon size={12}/> Profile
                    </a>
                  )}
                </div>
              </td>

              <td className="p-4">
                <div className="flex flex-col items-start gap-1.5">
                    <span className="text-slate-600 text-xs font-medium">{lead.service}</span>
                    
                    {/* --- Display Niche --- */}
                    {lead.niche && <span className="text-indigo-400 text-[11px] italic">{lead.niche}</span>}
                    {/* --------------------- */}

                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getPriorityColor(lead.priority)}`}>
                        {lead.priority || "Medium"}
                    </span>
                </div>
              </td>

              <td className="p-4 font-mono text-green-400 font-bold">
                {lead.budget ? <span className="flex items-center gap-1"><IndianRupee size={12}/>{lead.budget}</span> : "-"}
              </td>

              <td className="p-4">
                <select 
                    value={lead.status} 
                    onChange={(e) => onUpdateStatus(lead._id, e.target.value)}
                    className={`text-[11px] font-bold px-2 py-1.5 rounded-lg border outline-none bg-white cursor-pointer transition-all w-28 ${getStatusColor(lead.status)}`}
                >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Meeting Fixed">Meeting</option>
                    <option value="Closed">Closed</option>
                </select>
              </td>

              <td className="p-4 text-slate-500 text-xs">
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <Calendar size={12} className="text-slate-400"/> 
                    {new Date(lead.createdAt).toLocaleDateString()}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 pl-4">by {lead.addedBy}</div>
              </td>

              <td className="p-4 text-right">
                <div className="flex justify-end gap-2">
                    <button onClick={() => onEdit(lead)} className="text-slate-500 hover:text-cyan-600 p-2 bg-slate-50 hover:bg-cyan-50 rounded transition border border-transparent hover:border-cyan-200" title="Edit">
                        <Edit2 size={16} />
                    </button>
                    <button onClick={() => onDelete(lead._id)} className="text-slate-500 hover:text-red-600 p-2 bg-slate-50 hover:bg-red-50 rounded transition border border-transparent hover:border-red-200" title="Delete">
                        <Trash2 size={16} />
                    </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}