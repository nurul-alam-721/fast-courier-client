import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import PaymentForm from "./PaymentForm";
import { useParams } from "react-router-dom";

// Load Stripe public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Payment = () => {
  const { id } = useParams();

  // Handle missing parcel ID
  if (!id) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center text-red-600">
          <h2 className="text-2xl font-bold mb-4">Parcel ID Missing!</h2>
          <p>Invalid payment link.</p>
          <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Handle missing Stripe key
  if (!stripePromise) {
    console.error("Missing Stripe key");
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center text-red-600">
          <h2 className="text-2xl font-bold mb-4">Stripe Init Failed</h2>
          <p>Contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 flex items-center justify-center">
      <div className="w-full max-w-xl px-4">
        <Elements stripe={stripePromise}>
          <PaymentForm id={id} />
        </Elements>
      </div>
    </div>
  );
};

export default Payment;
