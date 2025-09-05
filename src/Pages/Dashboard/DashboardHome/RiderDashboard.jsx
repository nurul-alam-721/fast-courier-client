import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Truck, CheckCircle, Clock, UserCheck } from "lucide-react";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    pieColor: "#FACC15",
  },
  "in-transit": {
    label: "In Transit",
    icon: Truck,
    color: "bg-blue-100 text-blue-700 border-blue-200",
    pieColor: "#3B82F6",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle,
    color: "bg-green-100 text-green-700 border-green-200",
    pieColor: "#22C55E",
  },
  "rider-assigned": {
    label: "Rider Assigned",
    icon: UserCheck,
    color: "bg-purple-100 text-purple-700 border-purple-200",
    pieColor: "#A78BFA",
  },
};

const RiderDashboard = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data, isLoading } = useQuery({
    queryKey: ["riderDashboard", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get("/rider/parcels/dashboard");
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // Safe destructure
  const assignedParcels = data?.assignedParcels || [];
  const statusCounts = data?.statusCounts || [];

  const pieData = statusCounts.map((item) => ({
    name: statusConfig[item.delivery_status]?.label || item.delivery_status,
    value: item.count,
    color: statusConfig[item.delivery_status]?.pieColor || "#9CA3AF",
  }));

  return (
    <div className="space-y-8">
      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statusCounts.map((item) => {
          const config = statusConfig[item.delivery_status] || {
            label: item.delivery_status,
            icon: Clock,
            color: "bg-gray-100 text-gray-700 border-gray-200",
          };
          const Icon = config.icon;
          return (
            <div
              key={item.delivery_status}
              className={`p-6 rounded-2xl shadow-md border ${config.color} flex flex-col items-center justify-center`}
            >
              <Icon className="w-10 h-10 mb-2" />
              <h3 className="text-lg font-semibold">{config.label}</h3>
              <p className="text-2xl font-bold">{item.count}</p>
            </div>
          );
        })}
      </div>

      {/* Pie Chart */}
      <div className="p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-bold mb-4 text-center">
          Parcel Status Distribution
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Assigned Parcels Count */}
      <div className="p-6 rounded-2xl shadow-md text-center">
        <h2 className="text-xl font-bold">
          Total Assigned Parcels: {assignedParcels.length}
        </h2>
      </div>
    </div>
  );
};

export default RiderDashboard;
