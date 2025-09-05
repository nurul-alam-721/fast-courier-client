import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, isSameMonth, isSameYear } from "date-fns";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const MyEarnings = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // --- Fetch completed deliveries ---
  const { data: deliveries = [] } = useQuery({
    queryKey: ["completed-deliveries", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/completed?email=${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // --- Fetch cashout history ---
  const { data: cashouts = [] } = useQuery({
    queryKey: ["cashouts", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/rider/cash-out/history/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // --- Compute stats ---
const stats = useMemo(() => {
  const now = new Date();

  // Compute earnings from completed deliveries
  const deliveriesWithEarnings = deliveries.map((d) => {
    const cost = Number(d.cost) || 0;
    const earning = d.sender_region === d.receiver_region ? cost * 0.75 : cost * 0.9;
    return { ...d, earning };
  });

  const totalCompletedEarnings = deliveriesWithEarnings.reduce((sum, d) => sum + d.earning, 0);

  // Total cashouts
  const totalCashedOut = cashouts.reduce((sum, c) => sum + Number(c.amount || 0), 0);

  // Pending = total earnings from deliveries - total cashed out
  const pendingEarnings = totalCompletedEarnings - totalCashedOut;

  // Total Earnings = pending + cashed out
  const totalEarnings = pendingEarnings + totalCashedOut;

  // Monthly & yearly earnings
  const monthlyEarnings = deliveriesWithEarnings
    .filter((d) => d.updatedAt && isSameMonth(new Date(d.updatedAt), now))
    .reduce((sum, d) => sum + d.earning, 0);

  const yearlyEarnings = deliveriesWithEarnings
    .filter((d) => d.updatedAt && isSameYear(new Date(d.updatedAt), now))
    .reduce((sum, d) => sum + d.earning, 0);

  return {
    totalEarnings,
    pendingEarnings,
    monthlyEarnings,
    yearlyEarnings,
    totalCashouts: totalCashedOut,
  };
}, [deliveries, cashouts]);

  // --- React Table setup ---
  const columns = useMemo(
    () => [
      {
        header: "Date",
        accessorKey: "date",
        cell: (info) => (info.getValue() ? format(new Date(info.getValue()), "PPpp") : "N/A"),
      },
      {
        header: "Parcel",
        accessorKey: "parcelTitle",
        cell: (info) => info.getValue() || "Multiple Parcels",
      },
      {
        header: "Amount (৳)",
        accessorKey: "amount",
        cell: (info) => Number(info.getValue() || 0).toFixed(2),
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (info) => info.getValue() || "pending",
      },
    ],
    []
  );

  const table = useReactTable({
    data: cashouts.sort((a, b) => new Date(b.date) - new Date(a.date)),
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">📊 My Earnings</h2>

      {/* --- Stats --- */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-4 bg-white rounded-xl shadow">
          <p className="text-gray-600">Total Earnings</p>
          <h3 className="text-xl text-blue-600 font-bold">
            ৳ {stats.totalEarnings.toFixed(2)}
          </h3>
        </div>
        <div className="p-4 bg-white rounded-xl shadow">
          <p className="text-gray-600">Eligible Cashout Earnings</p>
          <h3 className="text-xl font-bold text-orange-500">
            ৳ {stats.pendingEarnings.toFixed(2)}
          </h3>
        </div>
        <div className="p-4 bg-white rounded-xl shadow">
          <p className="text-gray-600">Total Cashed Out</p>
          <h3 className="text-xl font-bold text-green-600">
            ৳ {stats.totalCashouts.toFixed(2)}
          </h3>
        </div>
        <div className="p-4 bg-white rounded-xl shadow">
          <p className="text-gray-600">This Month</p>
          <h3 className="text-xl text-purple-600 font-bold">
            ৳ {stats.monthlyEarnings.toFixed(2)}
          </h3>
        </div>
        <div className="p-4 bg-white rounded-xl shadow">
          <p className="text-gray-600">This Year</p>
          <h3 className="text-xl text-rose-600 font-bold">
            ৳ {stats.yearlyEarnings.toFixed(2)}
          </h3>
        </div>
      </div>

      {/* --- Cashout History Table --- */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-lg font-bold mb-3 text-yellow-600">💳 Cashout History</h3>
        {cashouts.length === 0 ? (
          <p className="text-gray-500">No cashouts yet.</p>
        ) : (
          <>
            <table className="w-full border-collapse text-gray-800 font-semibold border border-gray-300">
              <thead className="bg-gray-100">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="border border-gray-300 p-2 text-left cursor-pointer"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted()] ?? null}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="border border-gray-300 p-2">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center text-blue-800 font-semibold justify-between mt-3">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span>
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </span>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyEarnings;
