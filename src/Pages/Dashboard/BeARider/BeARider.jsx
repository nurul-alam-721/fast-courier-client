import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import regionsData from "./../../../assets/warehouses.json";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";

const BeARider = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [districtOptions, setDistrictOptions] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const selectedRegion = watch("region");

  // Get unique regions from regionData
  const uniqueRegions = Array.from(
    new Set(regionsData.map((item) => item.region))
  );

  // Fetch user info from backend using email with useQuery
  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Update form values once userData is loaded
  useEffect(() => {
    if (userData) {
      setValue("name", userData?.name || user?.displayName || "");
      setValue("email", userData?.email || user?.email || "");
    }
  }, [userData, user, setValue]);

  // Watch region change and update district options
  useEffect(() => {
    if (selectedRegion) {
      const filteredDistricts = regionsData
        .filter((item) => item.region === selectedRegion)
        .map((item) => item.district);
      setDistrictOptions([...new Set(filteredDistricts)]);
    } else {
      setDistrictOptions([]);
    }
  }, [selectedRegion]);

  const onSubmit = async (data) => {
    const riderData = {
      ...data,
      status: "pending",
      appliedAt: new Date().toISOString(),
    };

    try {
      const res = await axiosSecure.post("/riders", riderData);
      if (res.data.insertedId) {
        reset();
        Swal.fire({
          icon: "success",
          title: "Application Submitted!",
          text: "Your rider request is under review.",
        });
      }
    } catch (err) {
      console.error("Error submitting:", err);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Please try again later.",
      });
    }
  };

  if (isLoading) return <p className="text-center">Loading user info...</p>;
  if (isError) return <p className="text-center text-red-500">Failed to load user info</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-base-100 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Become a Rider</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <input
          {...register("name")}
          value={watch("name")}
          className="input input-bordered w-full"
          readOnly
          placeholder="Name"
        />

        {/* Email */}
        <input
          {...register("email")}
          value={watch("email")}
          className="input input-bordered w-full"
          readOnly
          placeholder="Email"
        />

        {/* Region */}
        <select
          {...register("region", { required: true })}
          className="select select-bordered w-full"
        >
          <option value="">Select Region</option>
          {uniqueRegions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
        {errors.region && (
          <p className="text-red-500 text-sm">Region is required</p>
        )}

        {/* District */}
        <select
          {...register("district", { required: true })}
          className="select select-bordered w-full"
        >
          <option value="">Select District</option>
          {districtOptions.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
        {errors.district && (
          <p className="text-red-500 text-sm">District is required</p>
        )}

        {/* Phone */}
        <input
          {...register("phone", { required: true })}
          className="input input-bordered w-full"
          placeholder="Phone Number"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm">Phone is required</p>
        )}

        {/* NID */}
        <input
          {...register("nid", { required: true })}
          className="input input-bordered w-full"
          placeholder="National ID Card Number"
        />
        {errors.nid && <p className="text-red-500 text-sm">NID is required</p>}

        {/* Bike Brand */}
        <input
          {...register("bikeBrand", { required: true })}
          className="input input-bordered w-full"
          placeholder="Bike Brand"
        />
        {errors.bikeBrand && (
          <p className="text-red-500 text-sm">Bike brand is required</p>
        )}

        {/* Bike Reg No */}
        <input
          {...register("bikeRegNo", { required: true })}
          className="input input-bordered w-full"
          placeholder="Bike Registration Number"
        />
        {errors.bikeRegNo && (
          <p className="text-red-500 text-sm">Bike reg no is required</p>
        )}

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary w-full text-black">
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default BeARider;
