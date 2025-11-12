import React from "react";
import { FaLinkedinIn, FaTwitter, FaGithub } from "react-icons/fa";

/**
 * Footer.jsx
 *
 * - Strict Tailwind CSS only (no extra CSS).
 * - Responsive: stacked on small screens, four columns on md+.
 * - Brand replaced by responsive image at /assets/logo.png per your request.
 * - Use this component as a page footer — it matches the provided UI layout.
 *
 * Place your logo at: /public/assets/logo.png (update src if different).
 */

export default function Footer() {
  return (
    <footer className="w-full bg-[#e8e8e8]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 py-10">
        <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand / social / copyright */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <img
                src="/assets/logo.png"
                alt="SubmitEase"
                className="h-7 w-auto object-contain"
              />
            </div>


            
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Product</h3>
            <ul className="space-y-3 text-slate-600">
              <li>
                <a href="#" className="hover:text-slate-800">Features</a>
              </li>
              <li>
                <a href="#" className="hover:text-slate-800">Pricing</a>
              </li>
              <li>
                <a href="#" className="hover:text-slate-800">FAQs</a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Company</h3>
            <ul className="space-y-3 text-slate-600">
              <li>
                <a href="#" className="hover:text-slate-800">About</a>
              </li>
              <li>
                <a href="#" className="hover:text-slate-800">Contact</a>
              </li>
              <li>
                <a href="#" className="hover:text-slate-800">Careers</a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Legal</h3>
            <ul className="space-y-3 text-slate-600">
              <li>
                <a href="#" className="hover:text-slate-800">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-slate-800">Terms of Use</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
