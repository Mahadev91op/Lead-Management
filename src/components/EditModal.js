// src/components/EditModal.js
import { useState } from "react";
import { motion } from "framer-motion";
import { X, Save, User, Mail, Phone, IndianRupee, Link as LinkIcon, FileText, Loader2 } from "lucide-react";

export default function EditModal({ lead, onClose, onSave }) {
  const [form, setForm] = useState({ ...lead });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave(lead._id, form);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-950/50">
          <h3 className="text-lg font-bold text-white">Edit Deal</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition bg-slate-800 p-1.5 rounded-full">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          
          <InputGroup icon={<User size={16}/>} value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Name" />
          <InputGroup icon={<Mail size={16}/>} value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Email" />
          
          <div className="grid grid-cols-2 gap-3">
            <InputGroup icon={<Phone size={16}/>} value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="Phone" />
            <InputGroup icon={<IndianRupee size={16}/>} value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} placeholder="Budget" />
          </div>

          <InputGroup icon={<LinkIcon size={16}/>} value={form.socialLink} onChange={e => setForm({...form, socialLink: e.target.value})} placeholder="Social Link" />

          {/* Service & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
                <label className="text-xs text-slate-500 ml-1">Service</label>
                <select className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-3 text-white text-sm outline-none focus:border-cyan-500"
                    value={form.service} onChange={e => setForm({...form, service: e.target.value})}>
                    <option>Web Development</option>
                    <option>App Development</option>
                    <option>SEO & Marketing</option>
                    <option>UI/UX Design</option>
                </select>
            </div>
            <div className="space-y-1">
                <label className="text-xs text-slate-500 ml-1">Status</label>
                <select className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-3 text-white text-sm outline-none focus:border-cyan-500"
                    value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Meeting Fixed">Meeting Fixed</option>
                    <option value="Closed">Closed</option>
                </select>
            </div>
          </div>

          <div className="relative">
            <FileText className="absolute left-3 top-3 text-slate-500" size={16} />
            <textarea rows="3" className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pl-10 pr-3 text-white text-sm outline-none focus:border-cyan-500 placeholder-slate-600 resize-none"
              placeholder="Notes..." value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}></textarea>
          </div>

          {/* --- History Log Section Added --- */}
          {form.history && form.history.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Activity Log</h4>
                <div className="space-y-2 max-h-24 overflow-y-auto custom-scrollbar pr-1">
                {form.history.slice().reverse().map((h, i) => (
                    <div key={i} className="text-xs text-slate-500 flex justify-between items-start border-b border-slate-800/50 pb-1 last:border-0">
                    <span className="w-2/3"><span className="text-cyan-500 font-medium">{h.by}</span>: {h.msg}</span>
                    <span className="text-slate-600 text-[10px] whitespace-nowrap">{new Date(h.date).toLocaleDateString()}</span>
                    </div>
                ))}
                </div>
            </div>
          )}
          {/* ---------------------------------- */}

          <div className="pt-2">
            <button disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 transition-all shadow-lg shadow-cyan-900/20">
                {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Save Changes</>}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function InputGroup({ icon, value, onChange, placeholder }) {
  return (
    <div className="relative">
      <div className="absolute left-3.5 top-3 text-slate-500">{icon}</div>
      <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pl-10 pr-3 text-white text-sm outline-none focus:border-cyan-500 placeholder-slate-600 transition-all"
        placeholder={placeholder} value={value} onChange={onChange} />
    </div>
  );
}