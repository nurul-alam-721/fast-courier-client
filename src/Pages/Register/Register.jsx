import React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import GoogleLogin from "../Shared/SocialLogin/GoogleLogin";

const Register = () => {
  const { createUser, updateUserProfile, signOutUser } = useAuth();
  const axiosSecure = useAxiosSecure();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const imgbbKey = import.meta.env.VITE_imgbb_upload_key;

  const onSubmit = async (data) => {
    try {
      // Upload image to imgbb
      const formData = new FormData();
      formData.append("image", data.photo[0]);
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${imgbbKey}`,
        { method: "POST", body: formData }
      );
      const imgData = await res.json();
      if (!imgData.success) throw new Error("Image upload failed");

      const photoURL = imgData.data.url;

      // Create user in Firebase
      await createUser(data.email, data.password);

      // Update Firebase profile (name + photo)
      await updateUserProfile(data.name, photoURL);

      // Save user in backend DB
      await axiosSecure.post("/users", {
        name: data.name,
        email: data.email,
        photoURL,
        role: "user",
      });

      reset();

      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "Please login with your new account.",
      });

      // Log user out so they can re-login with updated profile
      await signOutUser();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200 px-4">
      <div className="card w-full max-w-md shadow-2xl bg-base-100">
        <div className="card-body">
          {/* Title */}
          <h1 className="text-3xl font-bold text-center mb-2">Create Account</h1>
          <p className="text-center text-gray-500 mb-6">
            Register to start booking your parcels
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Your name"
                className="input input-bordered w-full"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="input input-bordered w-full"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                placeholder="Create a strong password"
                className="input input-bordered w-full"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </div>

            {/* Profile Photo */}
            <div>
              <label className="block text-sm font-medium mb-1">Profile Photo</label>
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-full"
                {...register("photo", { required: "Profile photo is required" })}
              />
              {errors.photo && (
                <p className="text-red-500 text-sm">{errors.photo.message}</p>
              )}
            </div>

            {/* Submit */}
            <div>
              <button type="submit" className="btn btn-primary w-full rounded-full text-black">
                Register
              </button>
            </div>
          </form>

          <GoogleLogin></GoogleLogin>

          {/* Footer */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <a href="/login" className="link link-primary">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
