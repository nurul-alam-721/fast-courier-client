import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2";
import UseAxios from "../../Hooks/UseAxios";

const Register = () => {
  const { createUser, updateUserProfile, logOut } = useAuth();
  const axiosInstance = UseAxios();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await createUser(data.email, data.password);

      await updateUserProfile(data.name, data.photoURL);

      const userInfo = {
        name: data.name,
        email: data.email,
        photoURL: data.photoURL,
        role: "student",
      };

      await axiosInstance.post("/users", userInfo);

      await logOut();
      reset();

      Swal.fire("Success", "Account created successfully. Please login.", "success");
      navigate("/login");
    } catch (err) {
      if (err.response?.status === 409) {
        setError("email", {
          type: "manual",
          message: "Account already exists with this email.",
        });
      } else {
        console.error(err);
        Swal.fire("Error", "Registration failed", "error");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="w-full max-w-md p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold text-center mb-4">Register</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div>
            <input
              {...register("name", { required: "Name is required" })}
              type="text"
              placeholder="Name"
              className="input input-bordered w-full"
            />
            {errors.name && <p className="text-error text-sm">{errors.name.message}</p>}
          </div>

          <div>
            <input
              {...register("photoURL", { required: "Photo URL is required" })}
              type="text"
              placeholder="Photo URL"
              className="input input-bordered w-full"
            />
            {errors.photoURL && <p className="text-error text-sm">{errors.photoURL.message}</p>}
          </div>

          <div>
            <input
              {...register("email", { required: "Email is required" })}
              type="email"
              placeholder="Email"
              className="input input-bordered w-full"
            />
            {errors.email && <p className="text-error text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <input
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
              type="password"
              placeholder="Password"
              className="input input-bordered w-full"
            />
            {errors.password && <p className="text-error text-sm">{errors.password.message}</p>}
          </div>

          <button className="btn btn-primary w-full" type="submit">
            Register
          </button>
        </form>

        <div className="divider">OR</div>
        <GoogleLogin />
      </div>
    </div>
  );
};

export default Register;
