// components/Header.js
import { motion } from "framer-motion";
import { User } from "lucide-react";

export default function Header() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="flex justify-between items-center mb-12"
    >
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          Dev<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Samp</span>
        </h1>
        <p className="text-slate-400 mt-2 text-sm md:text-base">Lead Management System & CRM</p>
      </div>
      <div className="hidden md:block">
        <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-4 py-2 rounded-full transition-all">
          <User size={18} /> Admin
        </button>
      </div>
    </motion.div>
  );
}