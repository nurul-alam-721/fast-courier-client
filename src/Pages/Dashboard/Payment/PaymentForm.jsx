import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import useParcelTracking from "../../../Hooks/useParcelTracking";

const PaymentForm = ({ id }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { updateTrackingStatus } = useParcelTracking();

  const { isLoading: queryLoading, data: parcelInfo } = useQuery({
    queryKey: ["parcels", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/${id}`);
      return res.data;
    },
  });

  if (queryLoading || !parcelInfo) {
    return (
      <div className="text-center mt-10 font-semibold loading-xl loading-spinner">
        Loading parcel info...
      </div>
    );
  }

  const amount = Number(parcelInfo.cost || 0);
  const amountInCents = amount * 100;

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    setIsLoading(true);
    setError("");

    try {
      // Create PaymentIntent
      const res = await axiosSecure.post("/create-payment-intent", {
        amountInCents,
        id,
      });

      const clientSecret = res.data.clientSecret;

      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: user.displayName || "Unknown Sender",
            email: user.email || "no-email@example.com",
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent?.status === "succeeded") {
        const paymentData = {
          parcelId: id,
          amount,
          title: parcelInfo.title,
          transactionId: result.paymentIntent.id,
          email: parcelInfo.created_email,
          sender_name: parcelInfo.sender_name,
          paymentMethod: result.paymentIntent.payment_method_types,
          date: new Date(),
        };

        // Save payment info to DB
        const paymentRes = await axiosSecure.post("/payments", paymentData);

        if (paymentRes.data?.insertedId) {
          await Swal.fire({
            icon: "success",
            title: "Payment Successful!",
            text: `Your payment of ৳${amount} was successful.`,
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          await updateTrackingStatus({
            parcelId: id,
            status: "paid",
            updatedBy: user.email,
            details: `Parcel cost paid by ${user.displayName}`
          });

          navigate("/dashboard/myparcels");
        } else {
          setError("Payment succeeded but recording failed.");
        }
      } else {
        setError("Payment failed. Please try again.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError("Payment failed. Try again.");
    }

    setIsLoading(false);
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl space-y-6 border border-gray-200"
    >
      <h2 className="text-2xl font-semibold text-center text-gray-800">
        Pay for Your Parcel
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details
        </label>
        <div className="rounded-md border border-gray-300 bg-white p-4 focus-within:ring-2 focus-within:ring-blue-500 transition">
          <CardElement
            options={{
              hidePostalCode: false,
              style: {
                base: {
                  fontSize: "16px",
                  color: "#111827",
                  "::placeholder": { color: "#9ca3af" },
                },
                invalid: { color: "#ef4444" },
              },
            }}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full py-3 px-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
      >
        {isLoading ? "Processing..." : `Pay ৳${amount}`}
      </button>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
};

export default PaymentForm;
