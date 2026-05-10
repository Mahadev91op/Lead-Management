// src/components/EditModal.js
import { useState } from "react";
import { X, Save, Clock, User } from "lucide-react";
import { motion } from "framer-motion";

export default function EditModal({ lead, onClose, onSave }) {
  const [formData, setFormData] = useState({ ...lead });
  const [loading, setLoading] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave(lead._id, { ...formData, newNote: newNote ? newNote : undefined });
    setLoading(false);
    onClose();
  };

  const handleAddNoteQuickly = async () => {
    if (!newNote.trim()) return;
    setAddingNote(true);
    await onSave(lead._id, { newNote: newNote.trim() });
    setNewNote("");
    setAddingNote(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex justify-between items-center p-5 border-b border-slate-200 bg-slate-50">
          <h2 className="text-xl font-bold text-slate-900">Edit Lead</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900 bg-slate-200 p-2 rounded-full"><X size={20}/></button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
             {/* Fields */}
             <div className="space-y-1">
                <label className="text-xs text-slate-500 ml-1">Client Name</label>
                <input className="w-full bg-white border border-slate-200 shadow-sm rounded-xl p-3 text-slate-900 outline-none focus:border-cyan-500" 
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
             </div>
             <div className="space-y-1">
                <label className="text-xs text-slate-500 ml-1">Niche</label>
                <input className="w-full bg-white border border-slate-200 shadow-sm rounded-xl p-3 text-slate-900 outline-none focus:border-cyan-500" 
                    value={formData.niche} onChange={e => setFormData({...formData, niche: e.target.value})} />
             </div>
             <div className="space-y-1">
                <label className="text-xs text-slate-500 ml-1">Email</label>
                <input className="w-full bg-white border border-slate-200 shadow-sm rounded-xl p-3 text-slate-900 outline-none focus:border-cyan-500" 
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
             </div>
             <div className="space-y-1">
                <label className="text-xs text-slate-500 ml-1">Phone</label>
                <input className="w-full bg-white border border-slate-200 shadow-sm rounded-xl p-3 text-slate-900 outline-none focus:border-cyan-500" 
                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
             </div>
             <div className="space-y-1">
                <label className="text-xs text-slate-500 ml-1">Budget</label>
                <input className="w-full bg-white border border-slate-200 shadow-sm rounded-xl p-3 text-slate-900 outline-none focus:border-cyan-500" 
                    value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} />
             </div>
             <div className="space-y-1">
                <label className="text-xs text-slate-500 ml-1">Next Follow Up</label>
                <input type="date" className="w-full bg-white border border-slate-200 shadow-sm rounded-xl p-3 text-slate-900 outline-none focus:border-cyan-500" 
                    value={formData.followUpDate ? formData.followUpDate.split('T')[0] : ''} onChange={e => setFormData({...formData, followUpDate: e.target.value})} />
             </div>
             <div className="col-span-1 md:col-span-2 space-y-1">
                <label className="text-xs text-slate-500 ml-1">Notes</label>
                <textarea rows="3" className="w-full bg-white border border-slate-200 shadow-sm rounded-xl p-3 text-slate-900 outline-none focus:border-cyan-500" 
                    value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
             </div>

             <div className="col-span-1 md:col-span-2">
                <button disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl transition-all">
                    {loading ? "Saving..." : "Update Lead"}
                </button>
             </div>
          </form>

          {/* --- History / Timeline Section --- */}
          <div className="border-t border-slate-200 pt-5">
            <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><Clock size={16}/> Activity History</h3>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-4 max-h-40 overflow-y-auto custom-scrollbar">
                {lead.history && lead.history.length > 0 ? (
                    lead.history.slice().reverse().map((h, i) => (
                        <div key={i} className="flex gap-3 text-xs">
                            <div className="min-w-[4px] bg-slate-300 rounded-full"></div>
                            <div>
                                <p className="text-slate-700">{h.msg}</p>
                                <div className="text-slate-500 flex gap-2 mt-1">
                                    <span>{new Date(h.date).toLocaleString()}</span>
                                    <span>•</span>
                                    <span className="text-cyan-600 font-medium">{h.by || "System"}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-slate-500 text-xs italic">No history recorded yet.</p>
                )}
            </div>
            <div className="mt-3 flex gap-2">
                <input 
                    type="text" 
                    placeholder="Add a quick note or update..." 
                    className="flex-1 bg-white border border-slate-200 shadow-sm rounded-xl px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-500"
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                />
                <button 
                    type="button"
                    onClick={handleAddNoteQuickly}
                    disabled={addingNote || !newNote.trim()}
                    className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all disabled:opacity-50"
                >
                    {addingNote ? "..." : "Add"}
                </button>
            </div>
          </div>
          {/* ---------------------------------- */}
        </div>
      </motion.div>
    </div>
  );
}