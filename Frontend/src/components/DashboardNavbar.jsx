import React from "react";
import { HiOutlineBell } from "react-icons/hi";

/**
 * FacultyNavbar.jsx
 *
 * - Strict TailwindCSS only (no extra CSS).
 * - Responsive and matches the provided UI:
 *   - Left: brand image (responsive)
 *   - Center: page title ("Faculty Dashboard") centered
 *   - Right: alerts pill with bell icon and a circular user avatar
 * - Replace brand with responsive image located at /assets/logo.png
 *
 * Usage:
 * <FacultyNavbar />
 */

const DashboardNavbar = () => {
  return (
    <header className="w-screen bg-white py-[1vw] px-[5vw]">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 border-1 rounded-lg border-gray-400">
        <div className="relative h-14 flex items-center justify-between">
          {/* Left: Brand */}
          <div className="flex items-center">
            <a href="#" className="inline-flex items-center">
              <img
                src="/assets/logo.png"
                alt="SubmitEase Faculty"
                className="h-6 sm:h-7 w-auto object-contain"
              />
              <span className="sr-only">SubmitEase Faculty</span>
            </a>
          </div>

          {/* Center: Title (absolutely centered so it's visually centered regardless of left/right width) */}
          <div className="">
            <div className="text-sm sm:text-base font-medium text-slate-400 pointer-events-none">
              Faculty Dashboard
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
export default DashboardNavbar;