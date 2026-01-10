// src/components/ConfirmModal.js
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, X } from "lucide-react";

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-6 text-center">
            <div className="mx-auto bg-red-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
                <AlertTriangle className="text-red-500" size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title || "Are you sure?"}</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                {message || "This action cannot be undone. This lead will be permanently removed from your database."}
            </p>
            
            <div className="flex gap-3 justify-center">
                <button 
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-medium hover:bg-slate-700 transition border border-slate-700"
                >
                    Cancel
                </button>
                <button 
                    onClick={onConfirm}
                    className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-500 shadow-lg shadow-red-900/20 flex items-center gap-2 transition"
                >
                    <Trash2 size={18} /> Delete Lead
                </button>
            </div>
        </div>
      </motion.div>
    </div>
  );
}