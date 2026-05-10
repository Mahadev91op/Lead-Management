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
    <div className="min-h-screen text-slate-800 font-sans p-8">
      <Background />
      <Toaster position="top-center" toastOptions={{ style: { background: '#ffffff', color: '#0f172a', border: '1px solid #e2e8f0' } }}/>
      
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition">
            <ArrowLeft size={20} /> Back to Dashboard
        </Link>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <User className="text-cyan-600" /> My Profile
            </h1>

            <div className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Name</p>
                <p className="text-slate-900 font-medium text-lg">{user.name}</p>
                <div className="h-px bg-slate-200 my-3"></div>
                <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Email</p>
                <p className="text-slate-900 font-medium text-lg">{user.email}</p>
            </div>

            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Lock size={18} className="text-yellow-500"/> Change Password
            </h2>

            <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="relative">
                    <input 
                        type="password" 
                        placeholder="Enter New Password"
                        className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-slate-900 focus:border-cyan-500 outline-none transition-all shadow-sm"
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