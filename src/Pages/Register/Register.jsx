import React from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../Hooks/useAuth";
import GoogleLogin from "../Shared/SocialLogin/GoogleLogin";
import { Link } from "react-router";

const Register = () => {
  const {createUser, setUser} = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    createUser(data.email, data.password)
    .then(result=>{
      console.log(result.user);
      setUser(result.user);
    })
    .catch(error=>{
      console.log(error);
    })
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left"></div>
        <div className="card bg-base-100 w-full max-w-lg shrink-0 shadow-2xl p-4">
          <h1 className="text-3xl mx-auto font-bold">Create an Account!</h1>
          <form className="card-body mb-0 pb-0" onSubmit={handleSubmit(onSubmit)}>
            <fieldset className="fieldset">
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                {...register("email", { required: true })}
                placeholder="Email"
              />

              {errors.email?.type === "required" && (
                <p className="text-red-500">Email is required.</p>
              )}

              <label className="label">Password</label>
              <input
                type="password"
                className="input"
                {...register("password", { required: true, minLength: 6 })}
                placeholder="Password"
              />

              {errors.password?.type === "required" && (
                <p className="text-red-500">Password is required.</p>
              )}

              {errors.password?.type === "minLength" && (
                <p className="text-red-500">
                  Password must be 6 characters or longer.
                </p>
              )}
              <button className="btn btn-neutral mt-4">Register</button>
              <p>Already Have an Account? <Link to={'/login'} className="btn btn-link">Login Now</Link></p>
            </fieldset>
          </form>
          <GoogleLogin></GoogleLogin>
        </div>
      </div>
    </div>
  );
};

export default Register;
