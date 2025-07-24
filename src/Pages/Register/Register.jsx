import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../Hooks/useAuth";
import GoogleLogin from "../Shared/SocialLogin/GoogleLogin";
import { Link } from "react-router";
import axios from "axios";
import UseAxios from "../../Hooks/UseAxios";

const Register = () => {
  const {createUser, setUser, updateProfileInfo} = useAuth();
  const [profilePic, setProfilePic] = useState('');
  const axiosInstance = UseAxios();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
  createUser(data.email, data.password)
    .then(async (result) => {
      console.log("Firebase user created:", result.user);
      setUser(result.user); 
      // Prepare user data for database
      const userInfo = {
        email: result.user.email,
        role: 'user',
        created_At: new Date().toISOString(),
        last_login: new Date().toISOString()
      };

      try {
        // Save user to backend database
       const res = await axiosInstance.post('/users', userInfo);
       console.log(res.data);


        // Update Firebase user profile
        const updateProfileData = {
          displayName: data.name,
          photoURL: profilePic,
        };

        await updateProfileInfo(updateProfileData);
        console.log("Firebase profile updated");

        // Optional: Show success alert or redirect
      } catch (err) {
        console.error("Error saving user or updating profile:", err);
      }
    })
    .catch((error) => {
      console.error("Firebase createUser error:", error);
    });
};


  const handleImageUpload = async(e) =>{
    e.preventDefault();
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append('image', image)
    console.log(image);

    const res = await axios.post(`https://api.imgbb.com/1/upload?expiration=600&key=${import.meta.env.VITE_imgbb_upload_key}`, formData);
    setProfilePic(res.data.data.url);
  }

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left"></div>
        <div className="card bg-base-100 w-full max-w-lg shrink-0 shadow-2xl p-4">
          <h1 className="text-3xl mx-auto font-bold">Create an Account!</h1>
          <form className="card-body mb-0 pb-0" onSubmit={handleSubmit(onSubmit)}>
            <fieldset className="fieldset">
              <label className="label">Name</label>
              <input
                type="text"
                className="input"
                {...register("name", { required: true })}
                placeholder="Your Name"
              />

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

              {/* image upload */}
              <label className="label">Profile Picture</label>
              <input
                type="file"
                className="input"
               onChange={handleImageUpload}
                placeholder="Upload Your Profile Picture"
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
