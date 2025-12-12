// app/page.js
"use client"; // क्योंकि हम बटन और स्टेट यूज़ करेंगे
import { useState, useEffect } from "react";

export default function Home() {
  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  // पेज लोड होते ही लीड्स लाना
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const res = await fetch("/api/leads");
    const data = await res.json();
    if (data.success) setLeads(data.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // API को डेटा भेजना
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", email: "", phone: "" }); // फॉर्म खाली करें
    fetchLeads(); // लिस्ट रिफ्रेश करें
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">DevSamp CRM</h1>

      {/* लीड ऐड करने का फॉर्म */}
      <div className="bg-white p-6 rounded shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Lead</h2>
        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            className="border p-2 rounded w-full"
            placeholder="Client Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className="border p-2 rounded w-full"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            className="border p-2 rounded w-full"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Save
          </button>
        </form>
      </div>

      {/* लीड्स की लिस्ट */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {leads.map((lead) => (
          <div key={lead._id} className="bg-white p-4 rounded shadow border-l-4 border-blue-500">
            <h3 className="font-bold text-lg">{lead.name}</h3>
            <p className="text-gray-600">{lead.email}</p>
            <p className="text-gray-600">{lead.phone}</p>
            <span className={`px-2 py-1 text-xs rounded-full mt-2 inline-block 
              ${lead.status === 'New' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
              {lead.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}