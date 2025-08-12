import React, { useState, useEffect, useMemo } from "react";
import Swal from "sweetalert2";
import { MdSearch } from "react-icons/md";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "./Hooks/useAxiosSecure";

const MakeAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [debouncedEmail, setDebouncedEmail] = useState("");

  // Debounce email input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedEmail(email);
    }, 300);
    return () => clearTimeout(timer);
  }, [email]);

  // Fetch users using TanStack Query
  const { data: matchedUsers = [], isLoading, isError, error } = useQuery({
    queryKey: ["users", debouncedEmail],
    queryFn: async () => {
      try {
        if (debouncedEmail.trim()) {
          const res = await axiosSecure.get(`/users/search?email=${debouncedEmail}`);
          return res.data;
        } else {
          const res = await axiosSecure.get("/users");
          return res.data;
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Retry once on failure
  });

  // Handle role change
  const handleChangeRole = async (id, newRole) => {
    try {
      const res = await axiosSecure.patch(`/users/${id}`, { role: newRole });
      if (res.data.modifiedCount > 0) {
        Swal.fire("Success", `User role updated to ${newRole}`, "success");
        
        // Update the cache
        queryClient.setQueryData(["users", debouncedEmail], (oldData) => {
          return oldData.map((user) =>
            user._id === id ? { ...user, role: newRole } : user
          );
        });
      }
    } catch (err) {
      console.error("Error updating role:", err);
      Swal.fire("Error", "Failed to update role", "error");
    }
  };

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB") + " " + date.toLocaleTimeString();
  };

  // Define table columns
  const columns = useMemo(
    () => [
      {
        header: "#",
        cell: ({ row }) => row.index + 1,
      },
      {
        header: "Name",
        accessorKey: "name",
        cell: ({ getValue }) => getValue() || "N/A",
      },
      {
        header: "Email",
        accessorKey: "email",
      },
      {
        header: "Role",
        accessorKey: "role",
        cell: ({ getValue }) => getValue() || "user",
      },
      {
        header: "Created At",
        accessorKey: "created_At",
        cell: ({ getValue }) => formatDate(getValue()),
      },
      {
        header: "Action",
        cell: ({ row }) => (
          <button
            onClick={() =>
              handleChangeRole(
                row.original._id,
                row.original.role === "admin" ? "user" : "admin"
              )
            }
            className={`btn btn-sm ${
              row.original.role === "admin" ? "btn-warning" : "btn-success"
            }`}
          >
            {row.original.role === "admin" ? "Remove Admin" : "Make Admin"}
          </button>
        ),
      },
    ],
    []
  );

  // Initialize TanStack Table
  const table = useReactTable({
    data: matchedUsers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Manage Admin Access</h2>
      
      {/* Search Input */}
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

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="alert alert-error">
          <span>
            Error fetching users: {error?.response?.data?.error || error?.message || "Unknown error"}
          </span>
        </div>
      )}

      {/* No Results Message */}
      {!isLoading && !isError && email && matchedUsers.length === 0 && (
        <p>No users matched. Try a different email.</p>
      )}

      {/* TanStack Table */}
      {!isLoading && !isError && matchedUsers.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
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