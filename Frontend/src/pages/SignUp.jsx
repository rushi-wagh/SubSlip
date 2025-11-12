import React, { useState } from "react";
import { HiOutlineMail, HiOutlineUser, HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { RiKey2Line } from "react-icons/ri";
import { Toaster } from "../../Toaster";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";

const SignUp = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // simple password strength indicator (visual only to match UI)
  const strength = (() => {
    if (password.length > 10) return 3;
    if (password.length > 6) return 2;
    if (password.length > 0) return 1;
    return 0;
  })();
  const resetForm = () => {
      setFullName("");
      setEmail("");
      setPassword("");
      setConfirm("");
    }

  const submitHandler = async (e) => {
      e.preventDefault();
      console.log("hello")
      const userData = {
      name: `${fullName}`,
      email,
      password,
    };
    
    try {
      setLoading(true);
      // Send POST request with credentials
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/register`, userData, {
        withCredentials: true,
      });
      console.log(res.data)
      // Check response status
      setLoading(false);
      if (res.status === 201) {
        
        Toaster(res.data.message || "Account created successfully!", "success");
        navigate("/login")
        resetForm(); // optional: reset the form after success
      } else {
        Toaster(res.data.message || "Something went wrong!", "warning");
      }
    } catch (error) {
      setLoading(false);
      if (error.response) {
        // Backend responded with a status outside 2xx
        Toaster(
          error.response.data.message || "Error creating account",
          "error"
        );
      } else if (error.request) {
        // Request was made but no response
        Toaster("No response from server. Please try again.", "error");
      } else {
        // Other errors
        Toaster(error.message || "An unexpected error occurred", "error");
      }
      console.error(error);
    }

    
    }

  return (
    <div className="min-h-screen bg-[#f6f8fb] flex items-start sm:items-center justify-center py-12 sm:py-20">
      <div className="w-full max-w-md px-6">
        {/* Header - replaced brand text with responsive image */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center mb-2">
            <img
              src="/assets/logo.png"
              alt="SubmitEase logo"
              className="h-8 sm:h-10 w-auto object-contain"
            />
          </div>
          <p className="text-sm text-slate-500">Join the smart way to manage college submissions.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-transparent sm:border-gray-100 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-1">Sign up as Faculty</h2>
          <p className="text-xs text-slate-400 mb-4">Institutional emails recommended for verification.</p>



          <form onSubmit={submitHandler} className="space-y-4">
            {/* Full name */}
            <div>
              <label className="block text-sm font-medium text-slate-700">Full name</label>
              <div className="mt-2 relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <HiOutlineUser className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Dr. Jane Doe"
                  className="block w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#bfdbfe]"
                  required
                />
              </div>
            </div>

            {/* Institution email */}
            <div>
              <label className="block text-sm font-medium text-slate-700">Institution email</label>
              <div className="mt-2 relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <HiOutlineMail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@college.edu"
                  className="block w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#bfdbfe]"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <div className="mt-2 relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <RiKey2Line className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="block w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#bfdbfe]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                </button>
              </div>
            </div>


            {/* CTA */}
            <div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#1565ff] py-3 px-4 text-white font-medium shadow-sm hover:opacity-95"
              >
                
                {loading?<ThreeDots
  height="30"
  width="30"
  radius="9"
  color="white"
  ariaLabel="three-dots-loading"
  wrapperClass="custom-loader"
  visible={true}
/>:"Create Faculty Account"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
export default SignUp;