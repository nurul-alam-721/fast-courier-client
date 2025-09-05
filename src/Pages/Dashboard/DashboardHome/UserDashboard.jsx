import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const UserDashboard = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Fetch dashboard data using TanStack Query
  const { data: dashboardData, isLoading, isError } = useQuery(
    ["userDashboard", user?.email],
    async () => {
      const res = await axiosSecure.get("/user/parcels/dashboard");
      return res.data;
    },
    {
      enabled: !!user,
    }
  );

  if (isLoading) return <div>Loading dashboard...</div>;
  if (isError || !dashboardData) return <div>No dashboard data found</div>;

  const { myParcels = [], statusCounts = [], totalPaid = 0 } = dashboardData;

  return (
    <div className="p-4 text-gray-900">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-blue-600 text-white rounded shadow">
          <h2 className="font-semibold">Total Parcels</h2>
          <p className="text-xl">{myParcels.length}</p>
        </div>
        <div className="p-4 bg-green-600 text-white rounded shadow">
          <h2 className="font-semibold">Total Paid</h2>
          <p className="text-xl">{totalPaid}</p>
        </div>
        <div className="p-4 bg-yellow-500 text-white rounded shadow">
          <h2 className="font-semibold">Total Status Types</h2>
          <p className="text-xl">{statusCounts.length}</p>
        </div>
      </div>

      {/* Parcel Status Counts */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Parcel Status Counts</h2>
        <div className="flex flex-wrap gap-4">
          {statusCounts.map((status) => (
            <div
              key={status.delivery_status}
              className="p-3 bg-gray-800 text-white rounded shadow"
            >
              <p className="capitalize">{status.delivery_status}</p>
              <p className="font-bold">{status.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Parcels Table */}
      <div>
        <h2 className="text-xl font-semibold mb-2">My Parcels</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-700 text-gray-900">
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="border px-2 py-1">Title</th>
                <th className="border px-2 py-1">Receiver</th>
                <th className="border px-2 py-1">Cost</th>
                <th className="border px-2 py-1">Status</th>
                <th className="border px-2 py-1">Paid Amount</th>
              </tr>
            </thead>
            <tbody>
              {myParcels.map((parcel) => (
                <tr
                  key={parcel._id}
                  className="odd:bg-gray-100 even:bg-gray-200"
                >
                  <td className="border px-2 py-1">{parcel.title}</td>
                  <td className="border px-2 py-1">{parcel.receiver_name}</td>
                  <td className="border px-2 py-1">{parcel.cost}</td>
                  <td className="border px-2 py-1">{parcel.delivery_status}</td>
                  <td className="border px-2 py-1">
                    {parcel.paid_amount || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
