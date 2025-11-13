import React from "react";
import { HiOutlineBell } from "react-icons/hi";
import { useAuth } from "../context/AuthContext.jsx";
import { roleRoute } from "../assets/roleRoute.jsx";
import { Link, NavLink } from "react-router-dom";

const DashboardNavbar = () => {
  const { user } = useAuth();

  return (
    <header className="w-screen bg-white py-[1vw] px-[5vw]">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 border rounded-lg border-gray-300">
        <div className="relative h-14 flex items-center">
          {/* Left: Brand */}
          <div className="flex items-center">
            <a href="#" className="inline-flex items-center" aria-label="Home">
              <img
                src="/assets/logo.png"
                alt="SubmitEase Faculty"
                className="h-6 sm:h-7 w-auto object-contain"
              />
            </a>
          </div>

          {/* Center: Title (absolutely centered so it's visually centered regardless of left/right width) */}
          <div className="absolute inset-x-0 left-0 right-0 pointer-events-none flex justify-center">
            <div className="text-sm sm:text-base font-medium text-slate-600 pointer-events-auto">
              {user?.role ? (
                user.role === "ClassCoordinator" ? (
                  <Link
                    to={`${roleRoute(user.role)}/ccpage`}
                    className="text-blue-500 hover:underline"
                  >
                    {user.role} Dashboard
                  </Link>
                ) : (
                  <span>{user.role} Dashboard</span>
                )
              ) : (
                <span>Dashboard</span>
              )}
            </div>
          </div>

          {/* Right: actions (bell / profile placeholder) */}
          <div className="ml-auto flex items-center gap-4">
            <button
              type="button"
              aria-label="Notifications"
              className="inline-flex items-center justify-center rounded-md p-2 hover:bg-slate-50"
            >
              <HiOutlineBell className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
