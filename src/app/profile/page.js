"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Background from "@/components/Background";
import { toast, Toaster } from "react-hot-toast";
import { User, Lock, Save, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword })
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Password Updated Successfully!");
      setNewPassword("");
    } else {
      toast.error(data.error);
    }
    setLoading(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen text-slate-200 font-sans p-8">
      <Background />
      <Toaster position="top-center" toastOptions={{ style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' } }}/>
      
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition">
            <ArrowLeft size={20} /> Back to Dashboard
        </Link>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 backdrop-blur-xl">
            <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <User className="text-cyan-400" /> My Profile
            </h1>

            <div className="mb-8 p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Name</p>
                <p className="text-white font-medium text-lg">{user.name}</p>
                <div className="h-px bg-slate-800 my-3"></div>
                <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Email</p>
                <p className="text-white font-medium text-lg">{user.email}</p>
            </div>

            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Lock size={18} className="text-yellow-400"/> Change Password
            </h2>

            <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="relative">
                    <input 
                        type="password" 
                        placeholder="Enter New Password"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-white focus:border-cyan-500 outline-none transition-all"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                </div>
                <button disabled={loading} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center gap-2 disabled:opacity-50">
                    {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Update Password</>}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
}