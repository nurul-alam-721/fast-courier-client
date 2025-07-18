import React, { useState } from "react";
import { useForm } from "react-hook-form";
import regionsData from "../../assets/warehouses.json";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";

const SendParcel = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [senderServiceCenters, setSenderServiceCenters] = useState([]);
  const [receiverServiceCenters, setReceiverServiceCenters] = useState([]);

  const type = watch("type");

  const calculateCost = (data) => {
    const sender = data.sender_service_center?.trim().toLowerCase();
    const receiver = data.receiver_service_center?.trim().toLowerCase();
    const isSameDistrict = sender === receiver;
    const weight = parseFloat(data.weight) || 0;

    let baseCost = 0;
    let extraCost = 0;
    let interDistrictSurcharge = 0;
    let totalCost = 0;

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

    totalCost = baseCost + extraCost + interDistrictSurcharge;

    return { baseCost, extraCost, interDistrictSurcharge, totalCost };
  };

  const onSubmit = async (data) => {
    const costInfo = calculateCost(data);

    const breakdown = `
      <div style="text-align: left; font-size: 14px">
        <p><strong>User Email:</strong> ${user?.email}</p>
        <p><strong>Base Cost:</strong> ৳${costInfo.baseCost}</p>
        ${
          costInfo.extraCost > 0
            ? `<p><strong>Extra Weight Charge:</strong> ৳${costInfo.extraCost}</p>`
            : ""
        }
        ${
          costInfo.interDistrictSurcharge > 0
            ? `<p><strong>Inter-district Surcharge:</strong> ৳${costInfo.interDistrictSurcharge}</p>`
            : ""
        }
        <p style="margin-top: 10px; font-size: 16px;"><strong style="color: #e63946">Total Cost: ৳${
          costInfo.totalCost
        }</strong></p>
      </div>
    `;

    const result = await Swal.fire({
      title: "Delivery Cost Breakdown",
      html: breakdown,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "<span style='color:black'>Confirm</span>",
    });

    if (result.isConfirmed) {
      const now = new Date();
      const parcel = {
        ...data,
        created_email: user?.email,
        cost: costInfo.totalCost,
        creation_date: now.toISOString(),
        creation_time: now.toLocaleString(),
        tracking_id: `PKG-${Date.now()}`,
        delivery_status: "pending",
        payment_status: "unpaid",
      };
      console.log("Saving Percel: ", parcel);

      axiosSecure.post("/parcels", parcel).then((res) => {
        console.log(res.data);
        if (res.data?.insertedId) {
          Swal.fire("Success!", "Parcel booked successfully.", "success");
          reset();
        }
      });
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
      <h2 className="text-2xl font-bold mb-2 text-base-content">
        Send a Parcel
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Parcel Info */}
        <div className="border border-white rounded-xl p-4">
          <h3 className="text-xl font-semibold mb-4 text-base-content">
            Parcel Info
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block mb-1 font-medium text-base-content">
                Type
              </label>
              <div className="flex items-center gap-4">
                <label className="label cursor-pointer gap-2">
                  <input
                    type="radio"
                    value="document"
                    {...register("type", { required: true })}
                    className="radio checked:bg-blue-500"
                  />
                  <span className="label-text">Document</span>
                </label>
                <label className="label cursor-pointer gap-2">
                  <input
                    type="radio"
                    value="non-document"
                    {...register("type", { required: true })}
                    className="radio checked:bg-blue-500"
                  />
                  <span className="label-text">Non-document</span>
                </label>
              </div>
              {errors.type && (
                <p className="text-red-500 text-sm">Parcel type is required</p>
              )}
            </div>
            <div>
              <label className="block mb-1 font-medium text-base-content">
                Parcel Name
              </label>
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
                <label className="block mb-1 font-medium text-base-content">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register("weight", { required: true })}
                  className="input input-bordered w-full"
                />
                {errors.weight && (
                  <p className="text-red-500 text-sm">Weight is required</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sender and Receiver Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sender */}
          <div className="border border-white rounded-xl p-4">
            <h3 className="text-xl font-semibold mb-4 text-base-content">
              Sender Info
            </h3>
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
                {...register("pickup_instruction", { required: true })}
                placeholder="Pickup Instructions"
                className="textarea textarea-bordered w-full"
              />
            </div>
          </div>

          {/* Receiver */}
          <div className="border border-white rounded-xl p-4">
            <h3 className="text-xl font-semibold mb-4 text-base-content">
              Receiver Info
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <input
                {...register("receiver_name", { required: true })}
                placeholder="Name"
                className="input input-bordered w-full"
              />
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
                {...register("delivery_instruction", { required: true })}
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
