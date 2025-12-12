// components/LeadForm.js
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, User, Mail, Phone, ArrowRight, IndianRupee, Layers, Globe, FileText } from "lucide-react";

export default function LeadForm({ onLeadAdded }) {
  const [form, setForm] = useState({ 
    name: "", email: "", phone: "", 
    service: "Web Development", budget: "", source: "LinkedIn", notes: "" 
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;

    setLoading(true);
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    // फॉर्म को रीसेट करें (डिफॉल्ट वैल्यू के साथ)
    setForm({ name: "", email: "", phone: "", service: "Web Development", budget: "", source: "LinkedIn", notes: "" });
    setLoading(false);
    
    if (onLeadAdded) onLeadAdded();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="lg:col-span-1"
    >
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl shadow-2xl sticky top-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Plus className="text-cyan-400" /> New Client
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputGroup icon={<User size={18}/>} placeholder="Client Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InputGroup icon={<Mail size={18}/>} placeholder="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            <InputGroup icon={<Phone size={18}/>} placeholder="Phone" type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          </div>

          {/* Service Selection */}
          <div className="group">
            <label className="text-xs text-slate-500 uppercase tracking-wider ml-1">Service Interest</label>
            <div className="relative mt-1">
              <Layers className="absolute left-3 top-3 text-slate-500" size={18} />
              <select
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer"
                value={form.service}
                onChange={e => setForm({...form, service: e.target.value})}
              >
                <option>Web Development</option>
                <option>App Development</option>
                <option>UI/UX Design</option>
                <option>SEO & Marketing</option>
                <option>Graphic Design</option>
              </select>
            </div>
          </div>

          {/* Budget & Source */}
          <div className="grid grid-cols-2 gap-3">
             <InputGroup icon={<IndianRupee size={18}/>} placeholder="Budget (₹)" value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} />
             
             <div className="group">
                <div className="relative mt-1">
                  <Globe className="absolute left-3 top-3 text-slate-500" size={18} />
                  <select
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer text-sm"
                    value={form.source}
                    onChange={e => setForm({...form, source: e.target.value})}
                  >
                    <option>LinkedIn</option>
                    <option>Instagram</option>
                    <option>Upwork/Fiverr</option>
                    <option>Referral</option>
                    <option>Cold Call</option>
                  </select>
                </div>
             </div>
          </div>

          {/* Notes */}
          <div className="group">
             <div className="relative mt-1">
                <FileText className="absolute left-3 top-3 text-slate-500" size={18} />
                <textarea
                  rows="3"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500 placeholder-slate-600 text-sm"
                  placeholder="Project Requirements / Notes..."
                  value={form.notes}
                  onChange={e => setForm({...form, notes: e.target.value})}
                ></textarea>
             </div>
          </div>

          <button 
            disabled={loading}
            className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-cyan-500/20 transform hover:scale-[1.02] transition-all flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {loading ? "Adding..." : <>Add Deal <ArrowRight size={18} /></>}
          </button>
        </form>
      </div>
    </motion.div>
  );
}

// Helper (वही पुराना वाला)
function InputGroup({ icon, type = "text", placeholder, value, onChange }) {
  return (
    <div className="group">
      <div className="relative mt-1">
        <div className="absolute left-3 top-3 text-slate-500 group-focus-within:text-cyan-400 transition-colors">{icon}</div>
        <input
          type={type}
          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all placeholder-slate-600 text-sm"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
}