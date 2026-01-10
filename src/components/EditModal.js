// src/components/EditModal.js
import { useState } from "react";
import { X, Save, Clock, User } from "lucide-react";
import { motion } from "framer-motion";

export default function EditModal({ lead, onClose, onSave }) {
  const [formData, setFormData] = useState({ ...lead });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave(lead._id, formData);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex justify-between items-center p-5 border-b border-slate-800 bg-slate-950">
          <h2 className="text-xl font-bold text-white">Edit Lead</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full"><X size={20}/></button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
             {/* Fields */}
             <div className="space-y-1">
                <label className="text-xs text-slate-400 ml-1">Client Name</label>
                <input className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-cyan-500" 
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
             </div>
             <div className="space-y-1">
                <label className="text-xs text-slate-400 ml-1">Niche</label>
                <input className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-cyan-500" 
                    value={formData.niche} onChange={e => setFormData({...formData, niche: e.target.value})} />
             </div>
             <div className="space-y-1">
                <label className="text-xs text-slate-400 ml-1">Email</label>
                <input className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-cyan-500" 
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
             </div>
             <div className="space-y-1">
                <label className="text-xs text-slate-400 ml-1">Phone</label>
                <input className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-cyan-500" 
                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
             </div>
             <div className="space-y-1">
                <label className="text-xs text-slate-400 ml-1">Budget</label>
                <input className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-cyan-500" 
                    value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} />
             </div>
             <div className="space-y-1">
                <label className="text-xs text-slate-400 ml-1">Next Follow Up</label>
                <input type="date" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-cyan-500" 
                    value={formData.followUpDate ? formData.followUpDate.split('T')[0] : ''} onChange={e => setFormData({...formData, followUpDate: e.target.value})} />
             </div>
             <div className="col-span-1 md:col-span-2 space-y-1">
                <label className="text-xs text-slate-400 ml-1">Notes</label>
                <textarea rows="3" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-cyan-500" 
                    value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
             </div>

             <div className="col-span-1 md:col-span-2">
                <button disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl transition-all">
                    {loading ? "Saving..." : "Update Lead"}
                </button>
             </div>
          </form>

          {/* --- History / Timeline Section --- */}
          <div className="border-t border-slate-800 pt-5">
            <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2"><Clock size={16}/> Activity History</h3>
            <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800 space-y-4 max-h-40 overflow-y-auto custom-scrollbar">
                {lead.history && lead.history.length > 0 ? (
                    lead.history.slice().reverse().map((h, i) => (
                        <div key={i} className="flex gap-3 text-xs">
                            <div className="min-w-[4px] bg-slate-700 rounded-full"></div>
                            <div>
                                <p className="text-slate-300">{h.msg}</p>
                                <div className="text-slate-500 flex gap-2 mt-1">
                                    <span>{new Date(h.date).toLocaleString()}</span>
                                    <span>•</span>
                                    <span className="text-cyan-600">{h.by || "System"}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-slate-600 text-xs italic">No history recorded yet.</p>
                )}
            </div>
          </div>
          {/* ---------------------------------- */}
        </div>
      </motion.div>
    </div>
  );
}