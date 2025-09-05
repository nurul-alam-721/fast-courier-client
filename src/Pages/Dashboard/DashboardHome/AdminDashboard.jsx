import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Truck, CheckCircle, Clock, UserCheck, DollarSign, Package } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const statusConfig = {
  pending: { label: "Pending", icon: Clock, color: "bg-yellow-100 text-yellow-700 border-yellow-200", pieColor: "#FACC15" },
  "in-transit": { label: "In Transit", icon: Truck, color: "bg-blue-100 text-blue-700 border-blue-200", pieColor: "#3B82F6" },
  delivered: { label: "Delivered", icon: CheckCircle, color: "bg-green-100 text-green-700 border-green-200", pieColor: "#22C55E" },
  "rider-assigned": { label: "Rider Assigned", icon: UserCheck, color: "bg-purple-100 text-purple-700 border-purple-200", pieColor: "#A78BFA" },
};

const AdminDashboard = () => {
  const axiosSecure = useAxiosSecure();

  const { data, isLoading } = useQuery({
    queryKey: ["adminDashboardData"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/parcels/dashboard");
      return res.data;
    },
  });

  if (isLoading) return <div className="flex justify-center items-center h-40"><span className="loading loading-spinner loading-lg text-primary"></span></div>;

  const { statusCounts = [], totalParcels } = data;

  return (
    <div className="space-y-10">
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl shadow-md border bg-blue-100 text-blue-700 flex flex-col items-center justify-center">
          <Package className="w-10 h-10 mb-2" />
          <h3 className="text-lg font-semibold">Total Parcels</h3>
          <p className="text-2xl font-bold">{totalParcels}</p>
        </div>
       
        {statusCounts.map(item => {
          const config = statusConfig[item.delivery_status] || { label: item.delivery_status, icon: Clock, color: "bg-gray-100 text-gray-700 border-gray-200", pieColor: "#9CA3AF" };
          const Icon = config.icon;
          return (
            <div key={item.delivery_status} className={`p-6 rounded-2xl shadow-md border ${config.color} flex flex-col items-center justify-center`}>
              <Icon className="w-10 h-10 mb-2" />
              <h3 className="text-lg font-semibold">{config.label}</h3>
              <p className="text-2xl font-bold">{item.count}</p>
            </div>
          );
        })}
      </div>
      {/* Pie Chart */}
      <div className="w-full h-[400px] shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-bold text-blue-600 mb-4 text-center">📊 Delivery Status Distribution</h2>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={statusCounts.map(item => ({
                name: statusConfig[item.delivery_status]?.label || item.delivery_status,
                value: item.count,
                color: statusConfig[item.delivery_status]?.pieColor || "#9CA3AF",
              }))}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={130}
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {statusCounts.map((item, index) => (
                <Cell key={`cell-${index}`} fill={statusConfig[item.delivery_status]?.pieColor || "#9CA3AF"} />
              ))}
            </Pie>
            <Tooltip formatter={value => [`${value} parcels`, "Count"]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;
