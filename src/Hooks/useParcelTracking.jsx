import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import Swal from "sweetalert2";
import useAuth from "./useAuth";

const useParcelTracking = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ parcelId, status, updatedBy, name, email, details }) => {
      switch (status) {
        case "submitted":
        case "paid":
        case "in-transit":
        case "delivered":
          return axiosSecure.post(`/trackings/${parcelId}`, {
            status,
            updatedBy,
            timestamp: new Date(),
            details,
          });

        case "rider_assigned":
          // Update parcel assigned rider
          await axiosSecure.patch(`/parcels/assign-rider/${parcelId}`, {
            assigned_rider: { name, email },
            delivery_status: "rider-assigned",
          });

          // Save tracking event
          return axiosSecure.post(`/trackings/${parcelId}`, {
            status,
            updatedBy,
            assigned_rider: { name, email },
            timestamp: new Date(),
            details,
          });

        default:
          throw new Error(`Unknown status: ${status}`);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["parcels"]);
      queryClient.invalidateQueries(["trackings"]);
      queryClient.invalidateQueries(["parcel", variables.parcelId]);

      Swal.fire(
        "Success",
        `Parcel status updated to "${variables.status}"`,
        "success"
      );
    },
    onError: (err) => {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to update parcel status",
        "error"
      );
    },
  });

  return {
    updateTrackingStatus: mutation.mutate,
    isLoading: mutation.isLoading,
    isError: mutation.isError,
    error: mutation.error,
  };
};

export default useParcelTracking;
