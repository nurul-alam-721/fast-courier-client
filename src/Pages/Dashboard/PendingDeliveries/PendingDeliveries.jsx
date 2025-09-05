import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useParcelTracking from "../../../Hooks/useParcelTracking";

const PendingDeliveries = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { updateTrackingStatus } = useParcelTracking();

  // Fetch assigned parcels
  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["assignedParcels", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels/assigned");
      return res.data;
    },
  });

  // Mutation to update delivery status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ parcelId, newStatus }) => {
      const res = await axiosSecure.patch(`/parcels/update-status/${parcelId}`, {
        newStatus,
      });
      return { parcelId, newStatus, data: res.data };
    },
    onSuccess: async ({ parcelId, newStatus }) => {
      queryClient.setQueryData(["assignedParcels", user?.email], (old) =>
        old?.map((p) =>
          p._id === parcelId ? { ...p, delivery_status: newStatus } : p
        )
      );

      Swal.fire({
        icon: "success",
        title: `Delivery status updated to "${newStatus}"`,
        timer: 1500,
        showConfirmButton: false,
      });

      // Send tracking event
      await updateTrackingStatus({
        parcelId,
        updatedBy: user?.email,
        status: newStatus,
        details:
          newStatus === "in-transit"
            ? "Parcel is out for delivery"
            : "Parcel delivered successfully",
      });
    },
  });

  const handleStatusChange = (parcel) => {
    let newStatus = "";
    if (parcel.delivery_status === "rider-assigned") newStatus = "in-transit";
    else if (parcel.delivery_status === "in-transit") newStatus = "delivered";
    else return;

    Swal.fire({
      title: `Are you sure you want to mark as ${newStatus}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        updateStatusMutation.mutate({ parcelId: parcel._id, newStatus });
      }
    });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Pending Deliveries</h2>
      {parcels.length === 0 ? (
        <p>No pending deliveries.</p>
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
                <th>Cost</th>
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
                  <td>৳{parcel.cost}</td>
                  <td>
                    {(parcel.delivery_status === "rider-assigned" ||
                      parcel.delivery_status === "in-transit") && (
                      <button
                        className="btn w-full btn-sm text-black btn-primary"
                        onClick={() => handleStatusChange(parcel)}
                        disabled={updateStatusMutation.isLoading}
                      >
                        {parcel.delivery_status === "rider-assigned"
                          ? "Start Delivery"
                          : "Mark as Delivered"}
                      </button>
                    )}
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

export default PendingDeliveries;
