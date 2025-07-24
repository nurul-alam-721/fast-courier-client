import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { MdSearch } from "react-icons/md";
import useAxiosSecure from "./Hooks/useAxiosSecure";

const MakeAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const [email, setEmail] = useState("");
  const [matchedUsers, setMatchedUsers] = useState([]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (email.trim()) {
        axiosSecure
          .get(`/users/search?email=${email}`)
          .then((res) => setMatchedUsers(res.data))
          .catch(() => setMatchedUsers([]));
      } else {
        setMatchedUsers([]);
      }
    }, 300); // debounce delay

    return () => clearTimeout(delayDebounce);
  }, [email, axiosSecure]);

  const handleChangeRole = async (id, newRole) => {
    try {
      const res = await axiosSecure.patch(`/users/${id}`, { role: newRole });
      if (res.data.modifiedCount > 0) {
        Swal.fire("Success", `User role updated to ${newRole}`, "success");
        setMatchedUsers((prev) =>
          prev.map((u) => (u._id === id ? { ...u, role: newRole } : u))
        );
      }
    } catch {
      Swal.fire("Error", "Failed to update role", "error");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB") + " " + date.toLocaleTimeString();
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Manage Admin Access</h2>

      <div className="form-control max-w-sm">
        <label className="input input-bordered flex items-center gap-2">
          <MdSearch />
          <input
            type="text"
            className="grow"
            placeholder="Search users by email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
      </div>

      {email && matchedUsers.length === 0 ? (
        <p>No users matched. Try a different email.</p>
      ) : null}

      {matchedUsers.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {matchedUsers.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.name || "N/A"}</td>
                  <td>{user.email}</td>
                  <td>{user.role || "user"}</td>
                  <td>{formatDate(user.created_At)}</td>
                  <td>
                    {user.role === "admin" ? (
                      <button
                        onClick={() => handleChangeRole(user._id, "user")}
                        className="btn btn-sm btn-warning"
                      >
                        Remove Admin
                      </button>
                    ) : (
                      <button
                        onClick={() => handleChangeRole(user._id, "admin")}
                        className="btn btn-sm btn-success"
                      >
                        Make Admin
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

export default MakeAdmin;
