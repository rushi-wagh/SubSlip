import React, { useState } from "react";
import { RiKey2Line } from "react-icons/ri";
import { HiOutlineMail } from "react-icons/hi";
// SubmitEaseLogin.jsx
// Single-file React component that reproduces the provided UI using TailwindCSS.
// Default export a React component. This file intentionally contains only Tailwind classes
// and inline SVG icons so no external CSS is required.

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
          <h1 className="text-2xl font-semibold text-slate-900"></h1>
          <p className="text-sm text-slate-500 mt-1">
            Connecting Faculty for Smarter Submission Management.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-transparent sm:border-gray-100 p-6 sm:p-8">
          {/* Pill / tab */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center bg-[#e9f5ff] text-[#0369a1] rounded-full px-4 py-2 text-sm font-medium shadow-sm">
              Faculty Portal
            </div>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700"
              >
                Faculty email
              </label>
              <div className="mt-2">
                <div className="relative flex item-center ">
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

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <div className="mt-2 relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <RiKey2Line className="w-4 h-4" />
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#bfdbfe]"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                ></button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#1565ff] py-3 px-4 text-white font-medium shadow-sm hover:opacity-95"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
