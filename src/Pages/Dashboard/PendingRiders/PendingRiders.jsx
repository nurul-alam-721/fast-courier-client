import React, { useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";

const PendingRiders = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedRider, setSelectedRider] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { isPending, data: riders = [], refetch } = useQuery({
    queryKey: ['pending-riders'],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/pending");
      return res.data;
    },
  });

  const filteredRiders = riders.filter((r) =>
    r.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = async (id) => {
    try {
      await axiosSecure.patch(`/riders/approve/${id}`);
      Swal.fire("Success", "Rider approved", "success");
      refetch();
    } catch {
      Swal.fire("Error", "Failed to approve rider", "error");
    }
  };

  const handleCancel = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to cancel this rider?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/riders/${id}`);
        Swal.fire("Deleted", "Rider cancelled", "success");
        refetch();
      } catch {
        Swal.fire("Error", "Failed to cancel rider", "error");
      }
    }
  };

  if (isPending) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Pending Riders</h2>

      <input
        type="text"
        placeholder="Search by name"
        className="input input-bordered mb-4 w-full max-w-xs"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRiders.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center">No matching riders found.</td>
              </tr>
            )}
            {filteredRiders.map((rider, i) => (
              <tr key={rider._id}>
                <td>{i + 1}</td>
                <td>{rider.name}</td>
                <td>{rider.email}</td>
                <td>{rider.phone || "N/A"}</td>
                <td>
                  <button className="btn btn-sm btn-info mr-2" onClick={() => setSelectedRider(rider)}>View</button>
                  <button className="btn btn-sm btn-success mr-2" onClick={() => handleApprove(rider._id)}>Approve</button>
                  <button className="btn btn-sm btn-error" onClick={() => handleCancel(rider._id)}>Reject</button>
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
            <p><strong>Name:</strong> {selectedRider.name}</p>
            <p><strong>Email:</strong> {selectedRider.email}</p>
            <p><strong>Phone:</strong> {selectedRider.phone || "N/A"}</p>
            <p><strong>Region:</strong> {selectedRider.region || "N/A"}</p>
            <p><strong>District:</strong> {selectedRider.district || "N/A"}</p>
            <p><strong>NID:</strong> {selectedRider.nid || "N/A"}</p>
            <p><strong>Bike Brand:</strong> {selectedRider.bikeBrand || "N/A"}</p>
            <p><strong>Bike Reg No:</strong> {selectedRider.bikeRegNo || "N/A"}</p>
            <p><strong>Status:</strong> {selectedRider.status}</p>
            <div className="modal-action">
              <button className="btn" onClick={() => setSelectedRider(null)}>Close</button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default PendingRiders;
