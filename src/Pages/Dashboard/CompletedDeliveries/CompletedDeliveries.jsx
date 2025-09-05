import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

const CompletedDeliveries = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [customAmount, setCustomAmount] = useState("");
  const [parcelAmounts, setParcelAmounts] = useState({});

  // --- Helper: calculate remaining earnings per parcel using cashouts ---
  const calculatePendingEarnings = (parcels, cashouts) => {
    const cashoutMap = cashouts.reduce((acc, c) => {
      if (c.parcelId) acc[c.parcelId] = (acc[c.parcelId] || 0) + c.amount;
      return acc;
    }, {});

    return parcels.reduce((sum, p) => {
      const cost = Number(p.cost) || 0;
      const total = p.sender_region === p.receiver_region ? cost * 0.75 : cost * 0.9;
      const paid = cashoutMap[p._id] || 0;
      return sum + Math.max(total - paid, 0);
    }, 0);
  };

  const getParcelRemaining = (parcel, cashouts) => {
    const cost = Number(parcel.cost) || 0;
    const total = parcel.sender_region === parcel.receiver_region ? cost * 0.75 : cost * 0.9;
    const paid = cashouts
      .filter((c) => c.parcelId === parcel._id)
      .reduce((sum, c) => sum + Number(c.amount || 0), 0);
    return Math.max(total - paid, 0);
  };

  // --- Fetch completed parcels ---
  const { data: parcels = [], isLoading: parcelsLoading } = useQuery({
    queryKey: ["completedParcels", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels/completed");
      return res.data;
    },
  });

  // --- Fetch cashout history ---
  const { data: cashouts = [], isLoading: cashoutsLoading } = useQuery({
    queryKey: ["cashouts", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/rider/cash-out/history/${user?.email}`);
      return res.data;
    },
  });

  const isLoading = parcelsLoading || cashoutsLoading;

  // --- Total remaining earnings (pending) ---
  const totalEarnings = calculatePendingEarnings(parcels, cashouts);

  // --- Single parcel cash-out ---
  const handleParcelCashOut = async (parcel) => {
    const remaining = getParcelRemaining(parcel, cashouts);
    const amount = Number(parcelAmounts[parcel._id]) || remaining;

    if (amount < 200) return Swal.fire("Error", "Minimum cash-out is 200", "error");
    if (amount > remaining) return Swal.fire("Error", "Amount exceeds remaining parcel earning", "error");

    try {
      const { data } = await axiosSecure.post("/rider/cash-out", {
        parcelId: parcel._id,
        amount,
        email: user.email,
      });

      Swal.fire("Success", `Cashed out ৳${data.amount}`, "success");
      setParcelAmounts((prev) => ({ ...prev, [parcel._id]: "" }));

      // Update frontend state to include new cashout
      queryClient.invalidateQueries(["cashouts", user?.email]);
      queryClient.invalidateQueries(["completedParcels", user?.email]);
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Cash-out failed", "error");
    }
  };

  // --- Custom total cash-out ---
  const handleCustomCashOut = async () => {
    const amountNum = Number(customAmount);
    if (!customAmount || isNaN(amountNum)) {
      return Swal.fire("Error", "Please enter a valid amount", "error");
    }
    if (amountNum < 200) {
      return Swal.fire("Error", "Minimum cash-out is 200", "error");
    }
    if (amountNum > totalEarnings) {
      return Swal.fire("Error", "Amount exceeds total available earnings", "error");
    }

    try {
      const { data } = await axiosSecure.post("/rider/cash-out", {
        email: user.email,
        amount: amountNum,
      });

      Swal.fire("Success", `Cashed out ৳${data.totalAmount}`, "success");
      setCustomAmount("");
      setParcelAmounts({});
      queryClient.invalidateQueries(["cashouts", user?.email]);
      queryClient.invalidateQueries(["completedParcels", user?.email]);
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Cash-out failed", "error");
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Completed Deliveries</h2>
      <p className="mb-2 font-semibold">
        Total Remaining Earnings: <span className="font-bold text-blue-600">৳{totalEarnings.toFixed(2)}</span>
      </p>

      {/* Custom cash-out */}
      {totalEarnings > 0 && (
        <div className="mb-4 flex items-center gap-2">
          <input
            type="number"
            placeholder="Enter amount to cash out"
            className="input input-bordered w-48"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            min={200}
            max={totalEarnings}
          />
          <button className="btn btn-primary text-black" onClick={handleCustomCashOut}>
            Cash Out
          </button>
        </div>
      )}

      {parcels.length === 0 ? (
        <p>No completed deliveries yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Tracking ID</th>
                <th>Title</th>
                <th>Sender</th>
                <th>Receiver</th>
                <th>Pickup</th>
                <th>Status</th>
                <th>Parcel Cost</th>
                <th>Remaining Earning</th>
                <th>Cash-out Amount</th>
                <th>Delivered At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel) => {
                const remaining = getParcelRemaining(parcel, cashouts);
                return (
                  <tr key={parcel._id}>
                    <td>{parcel.tracking_id}</td>
                    <td>{parcel.title}</td>
                    <td>{parcel.sender_name}<br />{parcel.sender_contact}</td>
                    <td>{parcel.receiver_name}<br />{parcel.receiver_contact}</td>
                    <td>{parcel.sender_service_center}</td>
                    <td className="capitalize">{parcel.delivery_status}</td>
                    <td>৳{parcel.cost}</td>
                    <td>৳{remaining.toFixed(2)}</td>
                    <td>
                      {remaining > 0 ? (
                        <input
                          type="number"
                          placeholder={remaining.toFixed(2)}
                          min={200}
                          max={remaining}
                          value={parcelAmounts[parcel._id] || ""}
                          onChange={(e) =>
                            setParcelAmounts((prev) => ({ ...prev, [parcel._id]: e.target.value }))
                          }
                          className="input input-bordered w-24"
                          disabled={remaining < 200}
                        />
                      ) : (
                        <span>N/A</span>
                      )}
                    </td>
                    <td>{parcel.updatedAt ? new Date(parcel.updatedAt).toLocaleString() : "N/A"}</td>
                    <td>
                      <button
                        className={`btn btn-sm ${remaining >= 200 ? "btn-success" : "btn-disabled opacity-50"}`}
                        onClick={() => handleParcelCashOut(parcel)}
                        disabled={remaining < 200}
                      >
                        Cash Out
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CompletedDeliveries;
