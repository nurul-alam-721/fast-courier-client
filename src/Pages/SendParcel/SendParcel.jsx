import React, { useState } from "react";
import { useForm } from "react-hook-form";
import regionsData from "../../assets/warehouses.json";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import { useNavigate } from "react-router";

const SendParcel = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [senderServiceCenters, setSenderServiceCenters] = useState([]);
  const [receiverServiceCenters, setReceiverServiceCenters] = useState([]);
  const type = watch("type");

  // Cost calculator
  const calculateCost = (data) => {
    const sender = data.sender_service_center?.trim().toLowerCase();
    const receiver = data.receiver_service_center?.trim().toLowerCase();
    const isSameDistrict = sender && receiver ? sender === receiver : false;
    const weight = parseFloat(data.weight || 0);

    let baseCost = 0,
      extraCost = 0,
      interDistrictSurcharge = 0;

    if (data.type === "document") {
      baseCost = isSameDistrict ? 60 : 80;
    } else {
      baseCost = isSameDistrict ? 110 : 150;
      if (weight > 3) {
        const extraWeight = weight - 3;
        extraCost = extraWeight * 40;
        if (!isSameDistrict) interDistrictSurcharge = 40;
      }
    }

    const totalCost = baseCost + extraCost + interDistrictSurcharge;
    return { baseCost, extraCost, interDistrictSurcharge, totalCost };
  };

  const onSubmit = async (data) => {
    const costInfo = calculateCost(data);
    const payload = {
      created_email: user?.email,
      sender_name: data.sender_name,
      sender_contact: data.sender_contact,
      receiver_name: data.receiver_name,
      receiver_contact: data.receiver_contact,
      delivery_address: data.receiver_address,
      weight: type === "non-document" ? Number(data.weight || 0) : 0,
      cost: costInfo.totalCost,

      // Optional extras (for record keeping)
      title: data.title,
      type: type,
      sender_region: data.sender_region,
      sender_service_center: data.sender_service_center,
      sender_address: data.sender_address,
      pickup_instruction: data.pickup_instruction,
      receiver_region: data.receiver_region,
      receiver_service_center: data.receiver_service_center,
      delivery_instruction: data.delivery_instruction,
      tracking_id: `PKG-${Date.now()}`,
    };

    try {
      const res = await axiosSecure.post("/parcels", payload);
      if (res.data?.insertedId) {
        Swal.fire("Success!", "Parcel booked successfully.", "success").then(
          () => {
            reset();
            navigate("/dashboard/myParcels");
          }
        );
      } else {
        Swal.fire("Error!", "Could not create parcel. Try again.", "error");
      }
    } catch (err) {
      Swal.fire(
        "Error!",
        err?.response?.data?.error || "Something went wrong.",
        "error"
      );
    }
  };

  const handleSenderRegionChange = (region) => {
    const options = regionsData
      .filter((r) => r.region === region)
      .map((r) => r.district);
    setSenderServiceCenters([...new Set(options)]);
  };

  const handleReceiverRegionChange = (region) => {
    const options = regionsData
      .filter((r) => r.region === region)
      .map((r) => r.district);
    setReceiverServiceCenters([...new Set(options)]);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-base-100 shadow rounded-xl border border-white">
      <h2 className="text-2xl font-bold mb-4">Send a Parcel</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Parcel Info */}
        <div className="border border-white rounded-xl p-4">
          <h3 className="text-xl font-semibold mb-4">Parcel Info</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block mb-1 font-medium">Type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="document"
                    {...register("type", { required: true })}
                    className="radio checked:bg-blue-500"
                  />
                  <span>Document</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="non-document"
                    {...register("type", { required: true })}
                    className="radio checked:bg-blue-500"
                  />
                  <span>Non-document</span>
                </label>
              </div>
              {errors.type && (
                <p className="text-red-500 text-sm">Parcel type is required</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">Parcel Name</label>
              <input
                {...register("title", { required: true })}
                className="input input-bordered w-full"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">Parcel name is required</p>
              )}
            </div>

            {type === "non-document" && (
              <div>
                <label className="block mb-1 font-medium">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  {...register("weight", {
                    required: "Weight is required for non-documents",
                    min: 0,
                  })}
                  className="input input-bordered w-full"
                />
                {errors.weight && (
                  <p className="text-red-500 text-sm">
                    {errors.weight.message}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sender Info */}
          <div className="border border-white rounded-xl p-4">
            <h3 className="text-xl font-semibold mb-4">Sender Info</h3>
            <div className="grid grid-cols-1 gap-4">
              <input
                {...register("sender_name", { required: true })}
                placeholder="Name"
                className="input input-bordered w-full"
              />
              {errors.sender_name && (
                <p className="text-red-500 text-sm">Sender name is required</p>
              )}

              <input
                {...register("sender_contact", { required: true })}
                placeholder="Contact"
                className="input input-bordered w-full"
              />

              <select
                {...register("sender_region", { required: true })}
                onChange={(e) => handleSenderRegionChange(e.target.value)}
                className="select select-bordered w-full"
              >
                <option value="">Select Region</option>
                {[...new Set(regionsData.map((r) => r.region))].map(
                  (region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  )
                )}
              </select>

              <select
                {...register("sender_service_center", { required: true })}
                className="select select-bordered w-full"
              >
                <option value="">Select Service Center</option>
                {senderServiceCenters.map((center, i) => (
                  <option key={i} value={center}>
                    {center}
                  </option>
                ))}
              </select>

              <input
                {...register("sender_address", { required: true })}
                placeholder="Address"
                className="input input-bordered w-full"
              />
              <textarea
                {...register("pickup_instruction")}
                placeholder="Pickup Instructions"
                className="textarea textarea-bordered w-full"
              />
            </div>
          </div>

          {/* Receiver Info */}
          <div className="border border-white rounded-xl p-4">
            <h3 className="text-xl font-semibold mb-4">Receiver Info</h3>
            <div className="grid grid-cols-1 gap-4">
              <input
                {...register("receiver_name", { required: true })}
                placeholder="Name"
                className="input input-bordered w-full"
              />
              {errors.receiver_name && (
                <p className="text-red-500 text-sm">
                  Receiver name is required
                </p>
              )}

              <input
                {...register("receiver_contact", { required: true })}
                placeholder="Contact"
                className="input input-bordered w-full"
              />

              <select
                {...register("receiver_region", { required: true })}
                onChange={(e) => handleReceiverRegionChange(e.target.value)}
                className="select select-bordered w-full"
              >
                <option value="">Select Region</option>
                {[...new Set(regionsData.map((r) => r.region))].map(
                  (region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  )
                )}
              </select>

              <select
                {...register("receiver_service_center", { required: true })}
                className="select select-bordered w-full"
              >
                <option value="">Select Service Center</option>
                {receiverServiceCenters.map((center, i) => (
                  <option key={i} value={center}>
                    {center}
                  </option>
                ))}
              </select>

              <input
                {...register("receiver_address", { required: true })}
                placeholder="Address"
                className="input input-bordered w-full"
              />
              <textarea
                {...register("delivery_instruction")}
                placeholder="Delivery Instructions"
                className="textarea textarea-bordered w-full"
              />
            </div>
          </div>
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-primary text-black">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendParcel;
