import React, { useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const ActiveRiders = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedRider, setSelectedRider] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const { data: activeRiders = [], isLoading } = useQuery({
    queryKey: ["activeRiders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/active");
      return res.data;
    },
  });

  const removeApprovalMutation = useMutation({
    mutationFn: (id) => axiosSecure.patch(`/riders/pending/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["activeRiders"]);
      Swal.fire("Updated", "Approval removed", "success");
    },
    onError: (err) => Swal.fire("Error", err.message, "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/riders/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["activeRiders"]);
      Swal.fire("Deleted", "Rider deleted", "success");
    },
    onError: (err) => Swal.fire("Error", err.message, "error"),
  });

  const filteredRiders = activeRiders.filter((r) =>
    r.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading)
    return (
      <div className="text-center text-xl mt-50 loading-infinity loading-xl"></div>
    );

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Active Riders</h2>

      <input
        type="text"
        placeholder="Search by name"
        className="input input-bordered mb-4 w-full max-w-xs"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th> {/* new column */}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRiders.map((rider, i) => (
              <tr key={rider._id}>
                <td>{i + 1}</td>
                <td>{rider.name}</td>
                <td>{rider.email}</td>
                <td>{rider.phone || "N/A"}</td>
                <td>
                  <span
                    className={`badge ${
                      rider.status === "available"
                        ? "badge-success"
                        : "badge-warning"
                    }`}
                  >
                    {rider.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-info mr-2"
                    onClick={() => setSelectedRider(rider)}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-sm btn-warning mr-2"
                    onClick={() => removeApprovalMutation.mutate(rider._id)}
                  >
                    Remove Approval
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => deleteMutation.mutate(rider._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedRider && (
        <dialog open className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-2">Rider Info</h3>
            <p>
              <strong>Name:</strong> {selectedRider.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedRider.email}
            </p>
            <p>
              <strong>Phone:</strong> {selectedRider.phone || "N/A"}
            </p>
            <p>
              <strong>Region:</strong> {selectedRider.region}
            </p>
            <p>
              <strong>District:</strong> {selectedRider.district}
            </p>
            <p>
              <strong>NID:</strong> {selectedRider.nid || "N/A"}
            </p>
            <p>
              <strong>Bike Brand:</strong> {selectedRider.bikeBrand || "N/A"}
            </p>
            <p>
              <strong>Bike Reg No:</strong> {selectedRider.bikeRegNo || "N/A"}
            </p>
            <div className="modal-action">
              <button className="btn" onClick={() => setSelectedRider(null)}>
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default ActiveRiders;
