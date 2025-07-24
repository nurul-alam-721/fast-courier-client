import React from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import GoogleLogin from "../Shared/SocialLogin/GoogleLogin";
import Swal from "sweetalert2";
import useAuth from "../../Hooks/useAuth";

const Login = () => {
  const { signInUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
  signInUser(data.email, data.password)
    .then(() => {
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      navigate(from, { replace: true });
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
        timer: 2500,
        showConfirmButton: false,
        timerProgressBar: true,
      });
    });
};


  return (
    <div>
      <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="card-body pb-0">
          <h3 className="text-4xl font-bold">Login to your account!</h3>

          <fieldset className="fieldset">
            <label className="label">Email</label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="input"
              placeholder="Email"
            />
            {errors.email && <p className="text-red-600">Email is required</p>}

            <label className="label">Password</label>
            <input
              type="password"
              {...register("password", { required: true, minLength: 6 })}
              className="input"
              placeholder="Password"
            />
            {errors.password?.type === "required" && (
              <p className="text-red-600">Password is required</p>
            )}
            {errors.password?.type === "minLength" && (
              <p className="text-red-600">Password must be at least 6 characters</p>
            )}

            <div>
              <a className="link link-hover">Forgot password?</a>
            </div>
          </fieldset>

          <button className="btn btn-neutral mt-4 w-fit">Login</button>
          <p>
            New to this site?{" "}
            <Link className="btn btn-link" to="/register">
              Register Now
            </Link>
          </p>
        </form>
        <GoogleLogin />
      </div>
    </div>
  );
};

export default Login;
