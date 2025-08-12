import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../../Hooks/useAuth";
import UseAxios from "../../../Hooks/UseAxios";
import Swal from "sweetalert2";

const GoogleLogin = () => {
  const { loginWithGoogle, setUser } = useAuth();
  const axiosInstance = UseAxios();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path from PrivateRoute state (default to '/')
  const from = location.state?.from || "/";

  const handleGoogleLogin = () => {
    loginWithGoogle()
      .then(async (result) => {
        const googleUser = result.user;
        setUser(googleUser);

        const userInfo = {
          name: googleUser.displayName,
          email: googleUser.email,
          photo: googleUser.photoURL,
          role: "user",
          created_At: new Date().toISOString(),
          last_login: new Date().toISOString(),
        };

        // Save user in DB (upsert)
        await axiosInstance.post("/users", userInfo);

        Swal.fire({
          title: "Login Successful!",
          text: "You have been logged in with Google.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate(from, { replace: true }); // Redirect to original private route
        });
      })
      .catch((error) => {
        console.error("Google login error:", error);
        Swal.fire({
          title: "Login Failed",
          text: error.message || "Could not log in with Google.",
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  return (
    <div>
      <div className="divider">OR</div>
      <button
        onClick={handleGoogleLogin}
        className="btn bg-white text-black border-[#e5e5e5] w-full"
      >
        <svg
          aria-label="Google logo"
          width="16"
          height="16"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341" />
          <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57" />
          <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73" />
          <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55" />
        </svg>
        Login with Google
      </button>
    </div>
  );
};

export default GoogleLogin;
