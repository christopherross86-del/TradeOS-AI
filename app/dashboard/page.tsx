export default function DashboardPage() {
  const stats = [
    { name: "Total Revenue", value: "$12,450", change: "+12.5%", icon: "💰" },
    { name: "Calls Answered", value: "142", change: "+18%", icon: "📞" },
    { name: "Jobs Booked", value: "38", change: "+5.4%", icon: "📅" },
    { name: "Active AI Agents", value: "4", change: "Maxed", icon: "🤖" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                stat.change.startsWith("+") ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-500">{stat.name}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-xs shrink-0">
                  S
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Sarah booked a new plumbing job for John Doe
                  </p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-lg mb-4">AI Employee Status</h3>
          <div className="space-y-6">
            {[
              { name: "Sarah", role: "Receptionist", status: "Active", calls: 42 },
              { name: "Mike", role: "Dispatcher", status: "Active", tasks: 12 },
              { name: "Jessica", role: "Office Manager", status: "Idle", tasks: 0 },
              { name: "Alex", role: "Analyst", status: "Active", reports: 2 },
            ].map((agent) => (
              <div key={agent.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-gray-600">
                    {agent.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{agent.name}</p>
                    <p className="text-xs text-gray-500">{agent.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${agent.status === "Active" ? "bg-green-500" : "bg-gray-300"}`}></span>
                  <span className="text-sm font-medium text-gray-700">{agent.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
