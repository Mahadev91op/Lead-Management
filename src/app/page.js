// app/page.js
"use client";

import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import Background from "@/components/Background";
import Header from "@/components/Header";
import Stats from "@/components/Stats"; // <-- New Import
import LeadForm from "@/components/LeadForm";
import LeadList from "@/components/LeadList";

export default function Home() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async (silent = false) => {
    if (!silent) setLoading(true);
    const res = await fetch("/api/leads");
    const data = await res.json();
    if (data.success) setLeads(data.data);
    if (!silent) setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDelete = async (id) => {
    if(!confirm("Are you sure?")) return;
    setLeads(leads.filter(l => l._id !== id));
    toast.success("Lead removed");
    await fetch(`/api/leads/${id}`, { method: "DELETE" });
    fetchLeads(true);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    setLeads(leads.map(lead => lead._id === id ? { ...lead, status: newStatus } : lead));
    if(newStatus === 'Closed') toast.success("Deal Closed! Amount added to revenue 🎉");
    else toast("Status Updated");
    await fetch(`/api/leads/${id}`, { 
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    });
  };

  return (
    <div className="min-h-screen text-slate-200 selection:bg-cyan-500 selection:text-white font-sans">
      <Background />
      <Toaster position="bottom-right" toastOptions={{
        style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' }
      }}/>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <Header />

        {/* --- Stats Dashboard --- */}
        <Stats leads={leads} />
        {/* ----------------------- */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 xl:col-span-3">
             <LeadForm onLeadAdded={() => {
               fetchLeads(true);
               toast.success("Added to Pipeline!");
             }} />
          </div>

          <div className="lg:col-span-8 xl:col-span-9">
            <LeadList 
              leads={leads} 
              loading={loading} 
              onDelete={handleDelete}
              onUpdateStatus={handleUpdateStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
}