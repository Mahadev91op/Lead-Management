import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function LeadCharts({ leads }) {
  
  // Data for Status Pie Chart
  const statusData = [
    { name: "New", value: leads.filter(l => l.status === "New").length },
    { name: "Contacted", value: leads.filter(l => l.status === "Contacted").length },
    { name: "Meeting", value: leads.filter(l => l.status === "Meeting Fixed").length },
    { name: "Closed", value: leads.filter(l => l.status === "Closed").length },
  ].filter(d => d.value > 0);

  // Data for Service Bar Chart
  const serviceCounts = leads.reduce((acc, lead) => {
    acc[lead.service] = (acc[lead.service] || 0) + 1;
    return acc;
  }, {});
  
  const serviceData = Object.keys(serviceCounts).map(key => ({
    name: key.split(" ")[0], // Short name
    count: serviceCounts[key]
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      
      {/* Chart 1: Status Distribution */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <h3 className="text-slate-900 font-bold mb-4">Lead Status Distribution</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Services Demand */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <h3 className="text-slate-900 font-bold mb-4">Services Demand</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={serviceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip cursor={{fill: '#f1f5f9', opacity: 0.8}} contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a' }} />
              <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}