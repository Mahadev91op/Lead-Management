import { motion } from "framer-motion";
import { User, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center mb-12">
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white">
          Dev<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Samp</span>
        </h1>
        <p className="text-slate-400 mt-2 text-sm">Custom CRM System</p>
      </div>
      <div>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-white font-medium flex items-center gap-2">
              <User className="text-cyan-400" /> {user.name}
            </span>
            <button onClick={logout} className="bg-red-500/10 text-red-400 px-3 py-2 rounded-lg hover:bg-red-500/20 transition">
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <Link href="/login" className="bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2 rounded-full font-bold transition">
            Login
          </Link>
        )}
      </div>
    </motion.div>
  );
}