import React, { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { NavLink } from "react-router-dom";

/**
 * Improved Navbar
 *
 * - Keeps the parent wrapper: <div className="absolute top-0 left-0 w-screen h-[12vh]">...
 * - Strict Tailwind classes only.
 * - Responsive: centered links on md+, hamburger on smaller screens.
 * - Accessible: aria attributes, logical focusable elements.
 * - Uses /assets/logo.png as the responsive brand image.
 */

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="absolute top-0 left-0 w-screen h-[12vh] z-50">
        <div className="w-screen h-full px-4 py-3 sm:px-6 lg:px-8">
          <nav
            className="h-full flex items-center justify-between gap-4 bg-white/90 border border-slate-100 rounded-2xl px-4 py-2 shadow-sm"
            role="navigation"
            aria-label="Main navigation"
          >
            {/* Left: logo */}
            <div className="flex items-center h-full">
              <a href="#" className="inline-flex items-center">
                <img
                  src="/assets/logo.png"
                  alt="SubmitEase"
                  className="h-[4.5vh] sm:h-[4.6vh] md:h-[3.9vh] lg:h-[4vh] object-contain"
                />
              </a>
            </div>

            {/* Center: links - hidden on small screens */}
            <div className="hidden md:flex flex-1 justify-center">
              <ul className="flex items-center gap-8 text-sm text-slate-700">
                <li>
                  <a href="#" className="hover:text-slate-900 transition">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900 transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900 transition">
                    About
                  </a>
                </li>
              </ul>
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-3">
              {/* desktop actions */}
              <div className="hidden md:flex items-center gap-3">
                <NavLink
                  to="/login"
                  className="px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 transition"
                >
                  Login
                </NavLink>

                <NavLink
                  to="/signup"
                  className="px-4 py-2 rounded-lg bg-[#2563eb] text-white text-sm shadow-sm hover:opacity-95 transition"
                >
                  Signup
                </NavLink>
              </div>

              {/* mobile menu toggle */}
              <button
                type="button"
                className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-slate-100"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((s) => !s)}
              >
                {mobileOpen ? (
                  <HiOutlineX className="w-6 h-6" />
                ) : (
                  <HiOutlineMenu className="w-6 h-6" />
                )}
              </button>
            </div>
          </nav>

          {/* Mobile panel */}
          {mobileOpen && (
            <div className="mt-3 md:hidden">
              <div className="bg-white/95 border border-slate-100 rounded-2xl shadow-sm p-4">
                <ul className="flex flex-col gap-2 text-sm text-slate-700 mb-4">
                  <li>
                    <a href="#" className="block px-3 py-2 rounded-md hover:bg-slate-50">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block px-3 py-2 rounded-md hover:bg-slate-50">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block px-3 py-2 rounded-md hover:bg-slate-50">
                      About
                    </a>
                  </li>
                </ul>

                <div className="flex gap-3">
                  <a
                    href="#"
                    className="flex-1 text-center px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Login
                  </a>
                  <a
                    href="#"
                    className="flex-1 text-center px-4 py-2 rounded-lg bg-[#2563eb] text-white text-sm shadow-sm hover:opacity-95"
                  >
                    Signup
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
