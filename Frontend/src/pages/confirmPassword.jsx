import React, { useState } from "react";
import { RiKey2Line } from "react-icons/ri";
import { HiOutlineMail } from "react-icons/hi";
import { ThreeDots } from "react-loader-spinner";
import { Toaster } from "../../Toaster";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { roleRoute } from "../assets/roleRoute.jsx";

// ChangePassword.jsx
// Single-file React component using TailwindCSS.

const ChangePassword = () => {
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login , user } = useAuth(); // optional — in case you want to update auth after change
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    // basic client-side checks
    if (!email || !oldPassword || !newPassword) {
      Toaster("Please fill all fields", "error");
      return;
    }
    if (oldPassword === newPassword) {
      Toaster("New password must be different from old password", "error");
      return;
    }

    const payload = { email, oldPassword, newPassword };

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/change-password`,
        payload,
        { withCredentials: true }
      );

      setLoading(false);

      if (res?.status === 200) {
        Toaster(res.data?.message || "Password changed successfully", "success");

        // Optionally update auth or redirect — adjust to your flow:
        // if backend returns updated user, you might want to update context/localStorage
        if (res.data?.data?.user) {
          // example: update localStorage / auth context
          localStorage.setItem("user", JSON.stringify(res.data.data.user));
          if (login) login(res.data.data.user);
        }
        navigate(roleRoute(user.role));
      } else {
        Toaster(res.data?.message || "Failed to change password", "error");
      }
    } catch (err) {
      setLoading(false);
      const msg = err?.response?.data?.message || err.message || "Something went wrong";
      Toaster(msg, "error");
      console.error("Change password error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8fb] flex items-start sm:items-center justify-center py-12 sm:py-20">
      <div className="w-full max-w-md px-6">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-10">
          <div className="flex justify-center mb-2">
            <img
              src="/assets/logo.png"
              alt="SubmitEase Logo"
              className="h-8 sm:h-15 w-auto object-contain"
            />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">Change Password</h1>
          <p className="text-sm text-slate-500 mt-1">Securely update your account credentials.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-transparent sm:border-gray-100 p-6 sm:p-8">
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center bg-[#e9f5ff] text-[#0369a1] rounded-full px-4 py-2 text-sm font-medium shadow-sm">
              Account Security
            </div>
          </div>

          <form className="space-y-4" onSubmit={submitHandler}>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <div className="mt-2">
                <div className="relative flex item-center">
                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                    <HiOutlineMail className="w-4 h-4" />
                  </span>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@college.edu"
                    className="block w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#bfdbfe]"
                    required
                    aria-describedby="email-help"
                  />
                </div>
              </div>
            </div>

            {/* Old password */}
            <div>
              <label htmlFor="oldPassword" className="block text-sm font-medium text-slate-700">
                Old Password
              </label>
              <div className="mt-2 relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <RiKey2Line className="w-4 h-4" />
                </span>
                <input
                  id="oldPassword"
                  type={showOld ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#bfdbfe]"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  aria-label={showOld ? "Hide old password" : "Show old password"}
                  onClick={() => setShowOld((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showOld ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* New password */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700">
                New Password
              </label>
              <div className="mt-2 relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <RiKey2Line className="w-4 h-4" />
                </span>
                <input
                  id="newPassword"
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#bfdbfe]"
                  placeholder="At least 8 characters"
                  required
                />
                <button
                  type="button"
                  aria-label={showNew ? "Hide new password" : "Show new password"}
                  onClick={() => setShowNew((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showNew ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#1565ff] py-3 px-4 text-white font-medium shadow-sm hover:opacity-95"
              >
                {loading ? (
                  <ThreeDots
                    height="30"
                    width="30"
                    radius="9"
                    color="white"
                    ariaLabel="three-dots-loading"
                    wrapperClass="custom-loader"
                    visible={true}
                  />
                ) : (
                  "Change Password"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
