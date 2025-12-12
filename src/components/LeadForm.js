// src/components/LeadForm.js
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { X, Save, User, Mail, Phone, Calendar, Flag, IndianRupee, Layers, Globe, FileText, Link as LinkIcon, Loader2 } from "lucide-react";

export default function LeadForm({ onClose, onLeadAdded }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Automatic Date Logic (Today's Date)
  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({ 
    name: "", email: "", phone: "", service: "Web Development", 
    budget: "", source: "LinkedIn", notes: "", socialLink: "", 
    priority: "Medium", 
    followUpDate: today // <-- Automatic Date Here
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setLoading(true);
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, addedBy: user.name }),
    });
    setLoading(false);
    onLeadAdded();
    onClose();
  };

  if(!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex justify-between items-center p-5 border-b border-slate-800 bg-slate-950">
          <h2 className="text-xl font-bold text-white">Add New Lead</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full"><X size={20}/></button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                <InputGroup icon={<User size={18}/>} placeholder="Client Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                <InputGroup icon={<Mail size={18}/>} type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                <InputGroup icon={<Phone size={18}/>} type="tel" placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                <InputGroup icon={<LinkIcon size={18}/>} placeholder="Social Link" value={form.socialLink} onChange={e => setForm({...form, socialLink: e.target.value})} />

                <div className="relative group">
                    <Flag className="absolute left-3.5 top-3.5 text-slate-500" size={18} />
                    <select className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white outline-none focus:border-cyan-500 appearance-none text-sm"
                        value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                        <option value="High">High Priority 🔥</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="Low">Low Priority</option>
                    </select>
                </div>
                
                {/* Date Input with Auto-Value */}
                <InputGroup icon={<Calendar size={18}/>} type="date" value={form.followUpDate} onChange={e => setForm({...form, followUpDate: e.target.value})} />

                <div className="relative group">
                    <Layers className="absolute left-3.5 top-3.5 text-slate-500" size={18} />
                    <select className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white outline-none focus:border-cyan-500 appearance-none text-sm"
                        value={form.service} onChange={e => setForm({...form, service: e.target.value})}>
                        <option>Web Development</option>
                        <option>App Development</option>
                        <option>SEO & Marketing</option>
                        <option>UI/UX Design</option>
                    </select>
                </div>
                
                <InputGroup icon={<IndianRupee size={18}/>} placeholder="Budget" value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} />

                <div className="md:col-span-2 relative">
                    <FileText className="absolute left-3.5 top-3.5 text-slate-500" size={18} />
                    <textarea rows="3" className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white outline-none focus:border-cyan-500 text-sm resize-none"
                    placeholder="Requirement Notes..." value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}></textarea>
                </div>

                <div className="md:col-span-2">
                    <button disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2">
                        {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Save Lead</>}
                    </button>
                </div>
            </form>
        </div>
      </motion.div>
    </div>
  );
}

function InputGroup({ icon, type = "text", placeholder, value, onChange }) {
  return (
    <div className="relative group">
      <div className="absolute left-3.5 top-3.5 text-slate-500 group-focus-within:text-cyan-400 transition-colors">{icon}</div>
      <input type={type} className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white outline-none focus:border-cyan-500 placeholder-slate-600 text-sm transition-all"
        placeholder={placeholder} value={value} onChange={onChange} />
    </div>
  );
}