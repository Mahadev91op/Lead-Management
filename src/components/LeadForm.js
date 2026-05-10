// src/components/LeadForm.js
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { X, Save, User, Mail, Phone, Calendar, Flag, IndianRupee, Layers, FileText, Link as LinkIcon, Loader2, Briefcase, AlertCircle } from "lucide-react";

export default function LeadForm({ onClose, onLeadAdded }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // Validation State

  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({ 
    name: "", email: "", phone: "", niche: "",
    service: "Web Development", budget: "", source: "LinkedIn", notes: "", socialLink: "", 
    priority: "Medium", followUpDate: today
  });

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Client Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return; // Stop if invalid

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex justify-between items-center p-5 border-b border-slate-200 bg-slate-50">
          <h2 className="text-xl font-bold text-slate-900">Add New Lead</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900 bg-slate-200 p-2 rounded-full"><X size={20}/></button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Inputs with Error Handling */}
                <InputGroup 
                    icon={<User size={18}/>} 
                    placeholder="Client Name *" 
                    value={form.name} 
                    onChange={e => { setForm({...form, name: e.target.value}); if(errors.name) setErrors({...errors, name: null}); }} 
                    error={errors.name}
                />
                
                <InputGroup icon={<Briefcase size={18}/>} placeholder="Business Niche (e.g. Real Estate)" value={form.niche} onChange={e => setForm({...form, niche: e.target.value})} />
                
                <InputGroup 
                    icon={<Mail size={18}/>} 
                    type="email" 
                    placeholder="Email Address *" 
                    value={form.email} 
                    onChange={e => { setForm({...form, email: e.target.value}); if(errors.email) setErrors({...errors, email: null}); }}
                    error={errors.email}
                />
                
                <InputGroup icon={<Phone size={18}/>} type="tel" placeholder="Phone Number" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                <InputGroup icon={<LinkIcon size={18}/>} placeholder="Social Link" value={form.socialLink} onChange={e => setForm({...form, socialLink: e.target.value})} />

                <div className="relative group">
                    <Flag className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                    <select className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-900 outline-none focus:border-cyan-500 appearance-none text-sm"
                        value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                        <option value="High">High Priority 🔥</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="Low">Low Priority</option>
                    </select>
                </div>
                
                <InputGroup icon={<Calendar size={18}/>} type="date" value={form.followUpDate} onChange={e => setForm({...form, followUpDate: e.target.value})} />

                <div className="relative group">
                    <Layers className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                    <select className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-900 outline-none focus:border-cyan-500 appearance-none text-sm"
                        value={form.service} onChange={e => setForm({...form, service: e.target.value})}>
                        <option>Web Development</option>
                        <option>App Development</option>
                        <option>SEO & Marketing</option>
                        <option>UI/UX Design</option>
                    </select>
                </div>
                
                <div className="relative group">
                    <Flag className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                    <select className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-900 outline-none focus:border-cyan-500 appearance-none text-sm"
                        value={form.source} onChange={e => setForm({...form, source: e.target.value})}>
                        <option>LinkedIn</option>
                        <option>Facebook Ads</option>
                        <option>Google Ads</option>
                        <option>Referral</option>
                        <option>Direct</option>
                    </select>
                </div>

                <InputGroup icon={<IndianRupee size={18}/>} placeholder="Budget" value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} />

                <div className="md:col-span-2 relative">
                    <FileText className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                    <textarea rows="3" className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-900 outline-none focus:border-cyan-500 text-sm resize-none"
                    placeholder="Requirement Notes..." value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}></textarea>
                </div>

                <div className="md:col-span-2">
                    <button disabled={loading} className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2">
                        {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Save Lead</>}
                    </button>
                </div>
            </form>
        </div>
      </motion.div>
    </div>
  );
}

function InputGroup({ icon, type = "text", placeholder, value, onChange, error }) {
  return (
    <div className="relative group">
      <div className={`absolute left-3.5 top-3.5 transition-colors ${error ? "text-red-500" : "text-slate-400 group-focus-within:text-cyan-600"}`}>{icon}</div>
      <input 
        type={type} 
        className={`w-full bg-white border rounded-xl py-3 pl-11 pr-4 text-slate-900 outline-none placeholder-slate-400 text-sm transition-all shadow-sm
        ${error ? "border-red-500 focus:border-red-500 animate-shake" : "border-slate-200 focus:border-cyan-500"}`}
        placeholder={placeholder} value={value} onChange={onChange} 
      />
      {error && <span className="absolute right-3 top-3.5 text-red-500"><AlertCircle size={18}/></span>}
    </div>
  );
}