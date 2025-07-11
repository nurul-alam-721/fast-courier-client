import React from "react";
import { useForm } from "react-hook-form";
import GoogleLogin from "../Shared/SocialLogin/GoogleLogin";
import { Link } from "react-router";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div >
      <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="card-body pb-0">
            <h3 className="text-4xl font-bold">Login to your account!</h3>
          <fieldset className="fieldset">
            <label className="label">Email</label>
            <input
              type="email"
              {...register("email")}
              className="input"
              placeholder="Email"
            />

            <label className="label">Password</label>
            <input
              type="password"
              {...register("password", { required: true, minLength: 6 })}
              className="input"
              placeholder="Password"
            />

            {
            errors.password?.type === "required" && (
              <p className="text-red-600">Password is required</p>
            )
            }
            {
                errors.password?.type === 'minLength' && <p className="text-red-600">Password must be 6 characters long</p>
            }

            <div>
              <a className="link link-hover">Forgot password?</a>
            </div>
          </fieldset>
            <button className="btn btn-neutral mt-4 w-fit">Login</button>
            <p>New to this site? Please <Link className="btn btn-link" to="/register">Register Now</Link></p>
        </form>
      <GoogleLogin></GoogleLogin>
      </div>
    </div>
  );
};

export default Login;
