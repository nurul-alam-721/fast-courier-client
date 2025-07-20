import React from 'react';
import useAuth from '../../../Hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { isPending, data: payments = [] } = useQuery({
    queryKey: ['payments', user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}`);
      return res.data;
    }
  });

  if (isPending) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Payment History</h2>
      <div className="overflow-x-auto bg-slate-800 rounded shadow">
        <table className="table w-full">
          <thead className="bg-base-200 text-base font-semibold">
            <tr>
              <th>#</th>
              <th>Parcel ID</th>
              <th>Amount</th>
              <th>Transaction ID</th>
              <th>Payment Method</th>
              <th>Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => {
              const formattedDate = new Date(payment.date).toLocaleString('en-BD', {
                timeZone: 'Asia/Dhaka',
                dateStyle: 'medium',
                timeStyle: 'short'
              });

              return (
                <tr key={payment._id} className="hover">
                  <td>{index + 1}</td>
                  <td>{payment.parcelId}</td>
                  <td>৳{payment.amount}</td>
                  <td>{payment.transactionId}</td>
                  <td>{payment.paymentMethod?.[0] || 'N/A'}</td>
                  <td>{formattedDate}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {payments.length === 0 && (
          <div className="p-6 text-center text-gray-500">No payments found.</div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
