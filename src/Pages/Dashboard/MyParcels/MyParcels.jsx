import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';

const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const { data: parcels = [], isLoading, refetch } = useQuery({
    queryKey: ['my-parcels', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const handleView = (parcel) => {
    Swal.fire({
      title: 'Parcel Details',
      html: `
        <p><strong>Title:</strong> ${parcel.title}</p>
        <p><strong>Type:</strong> ${parcel.type}</p>
        <p><strong>Weight:</strong> ${parcel.weight} kg</p>
        <p><strong>Sender:</strong> ${parcel.senderName} (${parcel.senderEmail})</p>
        <p><strong>Receiver:</strong> ${parcel.receiverName} (${parcel.receiverPhoneNumber})</p>
        <p><strong>Delivery Address:</strong> ${parcel.deliveryAddress}</p>
        <p><strong>Requested Date:</strong> ${parcel.requestedDeliveryDate}</p>
        <p><strong>Cost:</strong> ৳${parcel.cost}</p>
        <p><strong>Payment Status:</strong> <span class="capitalize">${parcel.payment_status}</span></p>
        <p><strong>Booking Date:</strong> ${new Date(parcel.createdAt).toLocaleString()}</p>
      `,
      icon: 'info',
      confirmButtonText: 'Close',
    });
  };

  const handlePay = (id) => {
    navigate(`/dashboard/payment/${id}`)
  };

  const handleDelete = async (parcel) => {
  const confirm = await Swal.fire({
    title: `Delete "${parcel.title}"?`,
    text: 'This action is permanent.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
  });

  if (!confirm.isConfirmed) return;

  setDeletingId(parcel._id);
  try {
    const res = await axiosSecure.delete(`/parcels/${parcel._id}`);
    if (res.data.success) {
      await Swal.fire('Deleted!', res.data.message, 'success');
      refetch();
    } else {
      throw new Error(res.data.message);
    }
  } catch (error) {
    console.error('Delete failed:', error);
    Swal.fire('Error', error.message || 'Something went wrong.', 'error');
  } finally {
    setDeletingId(null);
  }
};

  if (isLoading) {
    return <div className="text-center py-10">Loading your parcels...</div>;
  }

  return (
    <div className="overflow-x-auto px-4">
      <h2 className="text-2xl font-bold mb-6">📦 My Parcels</h2>
      <table className="table table-zebra w-full text-center">
        <thead className="bg-base-200 text-base font-semibold">
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Type</th>
            <th>Booking Date</th>
            <th>Requested Date</th>
            <th>Cost</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {parcels.length === 0 ? (
            <tr>
              <td colSpan="8" className="py-6 text-gray-500">No parcels found.</td>
            </tr>
          ) : (
            parcels.map((parcel, index) => (
              <tr key={parcel._id}>
                <td>{index + 1}</td>
                <td>{parcel.title}</td>
                <td className="capitalize">{parcel.type}</td>
                <td>{new Date(parcel.createdAt).toLocaleDateString('en-GB')}</td>
                <td>{parcel.requestedDeliveryDate}</td>
                <td>৳{parcel.cost}</td>
                <td>
                  <span
                    className={`badge ${
                      parcel.payment_status === 'paid' ? 'badge-success' : 'badge-error'
                    } text-white capitalize`}
                  >
                    {parcel.payment_status}
                  </span>
                </td>
                <td className="flex flex-wrap gap-2 justify-center">
                  <button onClick={() => handleView(parcel)} className="btn btn-xs btn-info">View</button>
                <button onClick={() => handlePay(parcel._id)} className="btn btn-xs btn-warning">Pay</button>
                  <button
                    onClick={() => handleDelete(parcel)}
                    disabled={deletingId === parcel._id}
                    className="btn btn-xs btn-error"
                  >
                    {deletingId === parcel._id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MyParcels;
