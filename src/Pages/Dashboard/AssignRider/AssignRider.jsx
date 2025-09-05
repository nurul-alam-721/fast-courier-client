import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useParcelTracking from "../../../Hooks/useParcelTracking";
import useAuth from "../../../Hooks/useAuth";

const AssignRider = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [selectedRider, setSelectedRider] = useState(null);
  const { updateTrackingStatus } = useParcelTracking();
  const { user } = useAuth();

  // Validate ObjectId
  const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

  // Fetch parcels (paid + pending)
  const {
    data: parcels = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["paidPendingParcels"],
    queryFn: async () => {
      try {
        const res = await axiosSecure.get("/parcels/paid-pending");
        return res.data;
      } catch (err) {
        console.error(
          "Error fetching parcels:",
          err.response?.data || err.message
        );
        throw err;
      }
    },
    retry: 0,
  });

  // Fetch riders (all riders)
  const { data: riders = [] } = useQuery({
    queryKey: ["riders"],
    queryFn: async () => {
      try {
        const res = await axiosSecure.get("/riders");
        return res.data;
      } catch (err) {
        console.error(
          "Error fetching riders:",
          err.response?.data || err.message
        );
        throw err;
      }
    },
    retry: 0,
  });

  // Filter riders based on parcel's service center
  const filteredRiders = selectedParcel
    ? riders.filter(
        (rider) => rider.district === selectedParcel.sender_service_center
      )
    : [];

  // Mutation for assigning rider
  const assignMutation = useMutation({
    mutationFn: async ({ parcelId, rider }) => {
      // Update parcel with assigned rider
      const res = await axiosSecure.patch(`/parcels/assign-rider/${parcelId}`, {
        assigned_rider: {
          name: rider.name,
          email: rider.email,
        },
        delivery_status: "rider-assigned",
      });

      // Update tracking status with rider info
      await updateTrackingStatus({
        parcelId,
        status: "rider_assigned",
        updatedBy: user.email,
        name: rider.name,
        email: rider.email,
        details: `Parcel assigned to ${rider.name}`,
      });

      return res.data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries(["paidPendingParcels"]);
      Swal.fire("Success!", "Rider assigned successfully!", "success");
      setSelectedParcel(null);
    },
    onError: (err) => {
      Swal.fire(
        "Error!",
        `Failed to assign rider: ${err.response?.data?.message || err.message}`,
        "error"
      );
    },
  });

  if (isLoading) return <p>Loading parcels...</p>;
  if (error) {
    return (
      <p>
        Error loading parcels: {error.response?.data?.message || error.message}
      </p>
    );
  }

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">
        Assign Rider to Pending Parcels
      </h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Tracking ID</th>
              <th>Title</th>
              <th>Type</th>
              <th>Sender</th>
              <th>Receiver</th>
              <th>Cost</th>
              <th>Status</th>
              <th>Assign</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel) => (
              <tr key={parcel._id}>
                <td>{parcel.tracking_id || "N/A"}</td>
                <td>{parcel.title || "N/A"}</td>
                <td>{parcel.type || "N/A"}</td>
                <td>
                  {parcel.sender_name} ({parcel.sender_region || "N/A"})
                </td>
                <td>
                  {parcel.receiver_name} ({parcel.receiver_region || "N/A"})
                </td>
                <td>{parcel.cost ? `${parcel.cost}৳` : "N/A"}</td>
                <td>
                  <span className="badge badge-warning">
                    {parcel.delivery_status || "N/A"}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => {
                      console.log("Selected parcel:", parcel);
                      setSelectedParcel(parcel);
                    }}
                    className="btn btn-sm btn-primary text-black"
                    disabled={!parcel._id || !isValidObjectId(parcel._id)}
                  >
                    Assign Rider
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Simplified Modal with improved text visibility */}
      {selectedParcel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Assign Rider</h3>
              <button
                onClick={() => setSelectedParcel(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold text-gray-900 mb-1">
                Parcel ID:{" "}
                <span className="text-blue-600">
                  {selectedParcel.tracking_id || "N/A"}
                </span>
              </p>
              <p className="text-gray-800">
                Service Center:{" "}
                <span className="font-medium">
                  {selectedParcel.sender_service_center || "N/A"}
                </span>
              </p>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3 text-lg">
                Available Riders
              </h4>

              {filteredRiders.length === 0 ? (
                <div className="text-center py-6 bg-gray-100 rounded-lg border border-gray-300">
                  <p className="text-gray-800 font-medium">
                    No riders found for this service center
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    Please check back later or contact support
                  </p>
                </div>
              ) : (
                <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg">
                  {filteredRiders.map((rider) => (
                    <div
                      key={rider._id}
                      className="p-4 border-b border-gray-200 last:border-b-0 flex justify-between items-center hover:bg-gray-50"
                    >
                      <div>
                        <p className="font-bold text-gray-900">
                          {rider.name || "N/A"}
                        </p>
                        <p className="text-gray-800">{rider.email || "N/A"}</p>
                        <p className="text-gray-700 text-sm">
                          {rider.district || "N/A"}
                        </p>
                      </div>
                      <button
                        className="btn btn-sm bg-green-600 hover:bg-green-700 text-white font-medium"
                        onClick={() => {
                          if (!selectedParcel?._id) {
                            return Swal.fire(
                              "Error",
                              "Parcel ID is missing",
                              "error"
                            );
                          }
                          if (!isValidObjectId(selectedParcel._id)) {
                            return Swal.fire(
                              "Error",
                              "Invalid Parcel ID format",
                              "error"
                            );
                          }

                          Swal.fire({
                            title: "Confirm Assignment",
                            text: `Assign ${
                              rider.name || "this rider"
                            } to this parcel?`,
                            icon: "question",
                            showCancelButton: true,
                            confirmButtonColor: "#10B981",
                            cancelButtonColor: "#EF4444",
                            confirmButtonText: "Yes, assign!",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              assignMutation.mutate({
                                parcelId: selectedParcel._id,
                                rider: rider,
                              });
                            }
                          });
                        }}
                        disabled={assignMutation.isLoading}
                      >
                        {assignMutation.isLoading ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                          "Assign"
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                className="btn bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium"
                onClick={() => setSelectedParcel(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignRider;
