import React, { useState } from "react";
import { useForm } from "react-hook-form";
import regionsData from "../../assets/warehouses.json";
import Swal from "sweetalert2";

const SendParcel = ({ user }) => {
  const { register, handleSubmit, watch, reset } = useForm();
  const [senderServiceCenters, setSenderServiceCenters] = useState([]);
  const [receiverServiceCenters, setReceiverServiceCenters] = useState([]);

  const type = watch("type");
  const senderRegion = watch("sender_region");
  const receiverRegion = watch("receiver_region");

  const calculateCost = (data) => {
    // Normalize service center names for reliable comparison
    const sender = data.sender_service_center?.trim().toLowerCase();
    const receiver = data.receiver_service_center?.trim().toLowerCase();
    const isSameDistrict = sender === receiver;

    const weight = parseFloat(data.weight) || 0;

    console.log({
      senderServiceCenter: sender,
      receiverServiceCenter: receiver,
      isSameDistrict,
      weight,
      type: data.type,
    });

    if (data.type === "document") {
      return isSameDistrict ? 60 : 80;
    } else {
      if (weight <= 3) {
        return isSameDistrict ? 110 : 150;
      } else {
        const extraWeight = weight - 3;
        return isSameDistrict
          ? 110 + extraWeight * 40
          : 150 + extraWeight * 40 + 40;
      }
    }
  };

  const onSubmit = async (data) => {
    const cost = calculateCost(data);

    const result = await Swal.fire({
      title: `Delivery Cost: ৳${cost}`,
      text: "Do you want to confirm sending this parcel?",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Confirm",
    });

    if (result.isConfirmed) {
      const parcel = {
        ...data,
        cost,
        creation_date: new Date().toISOString(),
      };

      console.log("Saving parcel to DB:", parcel);
      Swal.fire("Success!", "Parcel booked successfully.", "success");
      reset();
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
      <h2 className="text-2xl font-bold mb-2 text-base-content">Send a Parcel</h2>
      <p className="mb-6 text-base-content/70">
        Fill in the details to schedule your parcel for pickup and delivery.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Parcel Info */}
        <div className="border border-white rounded-xl p-4">
          <h3 className="text-xl font-semibold mb-4 text-base-content">Parcel Info</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block mb-1 font-medium text-base-content">Type</label>
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
            </div>
            <div>
              <label className="block mb-1 font-medium text-base-content">Parcel Name</label>
              <input
                {...register("title", { required: true })}
                placeholder="e.g. Electronics, Books, Legal Document"
                className="input input-bordered w-full"
              />
            </div>
            {type === "non-document" && (
              <div>
                <label className="block mb-1 font-medium text-base-content">Weight (kg)</label>
                <input type="number" {...register("weight")} className="input input-bordered w-full" />
              </div>
            )}
          </div>
        </div>

        {/* Sender and Receiver Info side-by-side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sender Info */}
          <div className="border border-white rounded-xl p-4">
            <h3 className="text-xl font-semibold mb-4 text-base-content">Sender Info</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block mb-1 font-medium text-base-content">Name</label>
                <input
                  defaultValue={user?.displayName || ""}
                  {...register("sender_name", { required: true })}
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-base-content">Contact</label>
                <input {...register("sender_contact", { required: true })} className="input input-bordered w-full" />
              </div>
              <div>
                <label className="block mb-1 font-medium text-base-content">Select Region</label>
                <select
                  {...register("sender_region", { required: true })}
                  onChange={(e) => handleSenderRegionChange(e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option value="">Select</option>
                  {[...new Set(regionsData.map((r) => r.region))].map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium text-base-content">Service Center</label>
                <select {...register("sender_service_center", { required: true })} className="select select-bordered w-full">
                  <option value="">Select</option>
                  {senderServiceCenters.map((d, i) => (
                    <option key={i} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium text-base-content">Address</label>
                <input {...register("sender_address", { required: true })} className="input input-bordered w-full" />
              </div>
              <div>
                <label className="block mb-1 font-medium text-base-content">Pickup Instruction</label>
                <textarea {...register("pickup_instruction", { required: true })} className="textarea textarea-bordered w-full" />
              </div>
            </div>
          </div>

          {/* Receiver Info */}
          <div className="border border-white rounded-xl p-4">
            <h3 className="text-xl font-semibold mb-4 text-base-content">Receiver Info</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block mb-1 font-medium text-base-content">Name</label>
                <input {...register("receiver_name", { required: true })} className="input input-bordered w-full" />
              </div>
              <div>
                <label className="block mb-1 font-medium text-base-content">Contact</label>
                <input {...register("receiver_contact", { required: true })} className="input input-bordered w-full" />
              </div>
              <div>
                <label className="block mb-1 font-medium text-base-content">Select Region</label>
                <select
                  {...register("receiver_region", { required: true })}
                  onChange={(e) => handleReceiverRegionChange(e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option value="">Select</option>
                  {[...new Set(regionsData.map((r) => r.region))].map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium text-base-content">Service Center</label>
                <select {...register("receiver_service_center", { required: true })} className="select select-bordered w-full">
                  <option value="">Select</option>
                  {receiverServiceCenters.map((d, i) => (
                    <option key={i} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium text-base-content">Address</label>
                <input {...register("receiver_address", { required: true })} className="input input-bordered w-full" />
              </div>
              <div>
                <label className="block mb-1 font-medium text-base-content">Delivery Instruction</label>
                <textarea {...register("delivery_instruction", { required: true })} className="textarea textarea-bordered w-full" />
              </div>
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
