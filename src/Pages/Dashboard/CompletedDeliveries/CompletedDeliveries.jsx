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

  // Fetch completed parcels
  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["completedParcels", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels/completed");
      return res.data;
    },
  });

  // Calculate remaining earning per parcel
  const getEarning = (parcel) => {
    if (!parcel.cost) return 0;
    const cost = Number(parcel.cost);
    const total =
      parcel.sender_region === parcel.receiver_region ? cost * 0.1 : cost * 0.2;
    const paid = parcel.paid_amount || 0;
    return Math.max(total - paid, 0);
  };

  // Total remaining earnings
  const totalEarnings = parcels
    .filter((p) => getEarning(p) > 0)
    .reduce((sum, parcel) => sum + getEarning(parcel), 0);

  // Single parcel cash-out
  const handleParcelCashOut = async (parcel) => {
    const remaining = getEarning(parcel);
    const amount = Number(parcelAmounts[parcel._id]) || remaining;

    if (amount < 200)
      return Swal.fire("Error", "Minimum cash-out amount is 200", "error");
    if (amount > remaining)
      return Swal.fire(
        "Error",
        "Amount exceeds remaining parcel earning",
        "error"
      );

    try {
      await axiosSecure.post("/rider/cash-out", {
        parcelId: parcel._id,
        amount,
        riderEmail: user.email,
      });
      Swal.fire("Success", `Cashed out $${amount}`, "success");
      setParcelAmounts((prev) => ({ ...prev, [parcel._id]: "" }));
      queryClient.invalidateQueries(["completedParcels", user?.email]);
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Cash-out failed",
        "error"
      );
    }
  };

  // Custom total cash-out
  const handleCustomCashOut = async () => {
    const amountNum = Number(customAmount);
    if (amountNum < 200)
      return Swal.fire("Error", "Minimum cash-out amount is 200", "error");
    if (amountNum > totalEarnings)
      return Swal.fire(
        "Error",
        "Amount exceeds total available earnings",
        "error"
      );

    try {
      await axiosSecure.post("/rider/cash-out", {
        riderEmail: user.email,
        amount: amountNum,
      });
      Swal.fire("Success", `Cashed out ৳${amountNum}`, "success");
      setCustomAmount("");
      queryClient.invalidateQueries(["completedParcels", user?.email]);
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Cash-out failed",
        "error"
      );
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Completed Deliveries</h2>
      <p className="mb-2">
        Total Earnings:{" "}
        <span className="font-bold">${totalEarnings.toFixed(2)}</span>
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
          <button
            className="btn btn-primary text-black"
            onClick={handleCustomCashOut}
          >
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
                const remaining = getEarning(parcel);
                return (
                  <tr
                    key={parcel._id}
                    className={remaining < 200 ? "opacity-50" : ""}
                  >
                    <td>{parcel.tracking_id}</td>
                    <td>{parcel.title}</td>
                    <td>
                      {parcel.sender_name}
                      <br />
                      {parcel.sender_contact}
                    </td>
                    <td>
                      {parcel.receiver_name}
                      <br />
                      {parcel.receiver_contact}
                    </td>
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
                            setParcelAmounts((prev) => ({
                              ...prev,
                              [parcel._id]: e.target.value,
                            }))
                          }
                          className="input input-bordered w-24"
                          disabled={remaining < 200}
                        />
                      ) : (
                        <span>N/A</span>
                      )}
                    </td>
                    <td>
                      {parcel.updatedAt
                        ? new Date(parcel.updatedAt).toLocaleString()
                        : "N/A"}
                    </td>
                    <td>
                      {remaining >= 200 ? (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleParcelCashOut(parcel)}
                        >
                          Cash Out
                        </button>
                      ) : (
                        <span className="text-gray-400">Not enough</span>
                      )}
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
