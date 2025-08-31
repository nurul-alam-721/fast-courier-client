import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

const AssignRider = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [selectedParcel, setSelectedParcel] = useState(null);
  const [riders, setRiders] = useState([]);
  const [loadingRiders, setLoadingRiders] = useState(false);

  // Load only paid & not-collected parcels
  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["paid-not-collected-parcels"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels");
      return res.data.filter(
        (parcel) =>
          parcel.payment_status === "paid" &&
          parcel.delivery_status === "not-collected"
      );
    },
  });

  // Fetch riders based on sender_service_center
  const fetchRiders = async (serviceCenter) => {
    try {
      setLoadingRiders(true);
      const res = await axiosSecure.get(
        `/riders/available?district=${serviceCenter}`
      );
      setRiders(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to load riders", "error");
    } finally {
      setLoadingRiders(false);
    }
  };

  const handleAssignClick = (parcel) => {
    setSelectedParcel(parcel);
    fetchRiders(parcel.sender_service_center);
    document.getElementById("assignRiderModal").showModal();
  };

  // ✅ Assign rider mutation (only once)
  const assignRiderMutation = useMutation({
    mutationFn: async ({ parcelId, rider }) => {
      // update parcel
      const res = await axiosSecure.patch(`/parcels/assign-rider/${parcelId}`, {
        assigned_rider: {
          name: rider.name,
          email: rider.email,
        },
        delivery_status: "in-transit",
      });

      // update rider
      await axiosSecure.patch(`/riders/update-status/${rider._id}`, {
        status: "in-delivery", // ✅ update rider status
      });

      return res.data;
    },
    onSuccess: () => {
      const modal = document.getElementById("assignRiderModal");
      if (modal) modal.close();
      Swal.fire("Success", "Rider assigned successfully", "success");
      queryClient.invalidateQueries(["paid-not-collected-parcels"]);
    },
    onError: () => {
      const modal = document.getElementById("assignRiderModal");
      if (modal) modal.close();
      Swal.fire("Error", "Failed to assign rider", "error");
    },
  });

  if (isLoading) {
    return <div className="text-center py-20 text-lg">Loading parcels...</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-3xl font-bold">Assign Rider</h2>

      <div className="overflow-x-auto rounded-lg shadow border border-base-300">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200 text-base font-semibold">
            <tr>
              <th>#</th>
              <th>Tracking ID</th>
              <th>Sender</th>
              <th>Receiver</th>
              <th>From → To</th>
              <th>Cost</th>
              <th>Weight</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {parcels.map((parcel, index) => (
              <tr key={parcel._id}>
                <td>{index + 1}</td>
                <td>{parcel.tracking_id}</td>
                <td>
                  <p className="font-medium">{parcel.sender_name}</p>
                  <p className="text-sm text-gray-500">
                    {parcel.sender_contact}
                  </p>
                </td>
                <td>
                  <p className="font-medium">{parcel.receiver_name}</p>
                  <p className="text-sm text-gray-500">
                    {parcel.receiver_contact}
                  </p>
                </td>
                <td>
                  <p>
                    {parcel.sender_region} → {parcel.receiver_region}
                  </p>
                  <p className="text-xs text-gray-500">
                    {parcel.sender_service_center} →{" "}
                    {parcel.receiver_service_center}
                  </p>
                </td>
                <td>৳{parcel.cost}</td>
                <td>{parcel.weight} kg</td>
                <td>
                  <span className="badge badge-success capitalize">
                    {parcel.payment_status}
                  </span>
                </td>
                <td>
                  <span className="badge badge-warning h-auto text-black capitalize">
                    {parcel.delivery_status}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => handleAssignClick(parcel)}
                    className="btn btn-sm btn-primary text-black h-auto"
                  >
                    Assign Rider
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Assign Rider Modal */}
      <dialog id="assignRiderModal" className="modal">
        <div className="modal-box max-w-md">
          <h3 className="font-bold text-xl mb-4">
            Select Rider for {selectedParcel?.sender_service_center}
          </h3>

          {loadingRiders ? (
            <p className="text-center text-gray-500">Loading riders...</p>
          ) : riders.length > 0 ? (
            <ul className="space-y-2">
              {riders.map((rider) => (
                <li
                  key={rider._id}
                  className="border p-3 rounded-lg flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold">{rider.name}</p>
                    <p className="text-sm text-gray-500">{rider.email}</p>
                    <p className="text-xs text-gray-400">
                      District: {rider.district}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      assignRiderMutation.mutate({
                        parcelId: selectedParcel._id,
                        rider,
                      })
                    }
                    className="btn btn-xs btn-success text-white"
                  >
                    Assign
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">
              No available riders in {selectedParcel?.sender_service_center}.
            </p>
          )}

          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AssignRider;
