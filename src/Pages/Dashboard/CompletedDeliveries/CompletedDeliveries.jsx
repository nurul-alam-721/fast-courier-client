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

  // Fetch completed parcels
  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["completedParcels", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/completed?riderEmail=${user.email}`);
      return res.data;
    },
  });

  // Calculate rider earning per parcel
  const getEarning = (parcel) => {
    if (!parcel.cost) return 0;
    const cost = Number(parcel.cost);
    return parcel.sender_region === parcel.receiver_region ? cost * 0.1 : cost * 0.2;
  };

  // Total earnings (only uncashed parcels)
  const totalEarnings = parcels
    .filter(p => !p.earning_paid)
    .reduce((sum, parcel) => sum + getEarning(parcel), 0);

  // Single parcel cash-out
  const handleParcelCashOut = async (parcel) => {
    try {
      const { value: confirm } = await Swal.fire({
        title: `Cash out $${getEarning(parcel).toFixed(2)} for this parcel?`,
        showCancelButton: true,
        confirmButtonText: "Yes",
      });
      if (!confirm) return;

      await axiosSecure.post("/rider/cash-out", {
        parcelId: parcel._id,
        amount: getEarning(parcel),
      });

      Swal.fire("Success", "Parcel earning cashed out", "success");
      queryClient.invalidateQueries(["completedParcels", user?.email]);
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Cash-out failed", "error");
    }
  };

  // Custom cash-out for total earnings
  const handleCustomCashOut = async () => {
    const amountNum = Number(customAmount);
    if (isNaN(amountNum) || amountNum < 200) {
      return Swal.fire("Error", "Minimum cash-out amount is 200", "error");
    }

    if (amountNum > totalEarnings) {
      return Swal.fire("Error", "Requested amount exceeds available earnings", "error");
    }

    try {
      await axiosSecure.post("/rider/cash-out", {
        email: user.email,
        amount: amountNum,
      });

      Swal.fire("Success", `Cashed out $${amountNum}`, "success");
      setCustomAmount("");
      queryClient.invalidateQueries(["completedParcels", user?.email]);
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Cash-out failed", "error");
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Completed Deliveries</h2>
      <p className="mb-2">
        Total Earnings: <span className="font-bold">${totalEarnings.toFixed(2)}</span>
      </p>

      {/* Custom cash-out input */}
      {totalEarnings > 0 && (
        <div className="mb-4 flex items-center gap-2">
          <input
            type="number"
            placeholder="Enter amount to cash out"
            className="input input-bordered w-48"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
          />
          <button className="btn text-black btn-primary" onClick={handleCustomCashOut}>
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
                <th>Delivery Status</th>
                <th>Parcel Cost</th>
                <th>Rider Earning</th>
                <th>Delivered At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel) => (
                <tr key={parcel._id}>
                  <td>{parcel.tracking_id}</td>
                  <td>{parcel.title}</td>
                  <td>
                    {parcel.sender_name} <br />
                    {parcel.sender_contact}
                  </td>
                  <td>
                    {parcel.receiver_name} <br />
                    {parcel.receiver_contact}
                  </td>
                  <td>{parcel.sender_service_center}</td>
                  <td className="capitalize">{parcel.delivery_status}</td>
                  <td>${parcel.cost}</td>
                  <td>${getEarning(parcel).toFixed(2)}</td>
                  <td>
                    {parcel.updatedAt
                      ? new Date(parcel.updatedAt).toLocaleString()
                      : "N/A"}
                  </td>
                  <td>
                    {!parcel.earning_paid && (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleParcelCashOut(parcel)}
                      >
                        Cash Out
                      </button>
                    )}
                    {parcel.earning_paid && <span className="text-green-500">Paid</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CompletedDeliveries;
