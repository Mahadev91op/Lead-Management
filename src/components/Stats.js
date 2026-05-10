// components/Stats.js
import { motion } from "framer-motion";
import { TrendingUp, Users, Wallet, CheckCircle } from "lucide-react";

export default function Stats({ leads }) {
  // 1. Total Leads
  const totalLeads = leads.length;

  // 2. Closed Deals (Active Clients)
  const closedDeals = leads.filter(l => l.status === "Closed").length;

  // 3. Conversion Rate (सफलता दर)
  const conversionRate = totalLeads > 0 ? ((closedDeals / totalLeads) * 100).toFixed(0) : 0;

  // 4. Total Pipeline Value (Total Budget count karna)
  const totalValue = leads.reduce((acc, curr) => {
    // "20000" या "20k" से सिर्फ नंबर निकालना
    const amount = parseInt(curr.budget?.replace(/[^0-9]/g, '') || 0); 
    return acc + amount;
  }, 0);

  // कार्ड्स का डिज़ाइन
  const cards = [
    { label: "Total Leads", value: totalLeads, icon: <Users className="text-blue-600" />, color: "from-blue-50 to-white" },
    { label: "Pipeline Value", value: `₹${totalValue.toLocaleString()}`, icon: <Wallet className="text-green-600" />, color: "from-green-50 to-white" },
    { label: "Closed Deals", value: closedDeals, icon: <CheckCircle className="text-purple-600" />, color: "from-purple-50 to-white" },
    { label: "Success Rate", value: `${conversionRate}%`, icon: <TrendingUp className="text-orange-600" />, color: "from-orange-50 to-white" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`bg-gradient-to-br ${card.color} border border-slate-200 p-4 rounded-2xl shadow-sm`}
        >
          <div className="flex justify-between items-start mb-2">
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{card.label}</p>
            {card.icon}
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{card.value}</h3>
        </motion.div>
      ))}
    </div>
  );
}