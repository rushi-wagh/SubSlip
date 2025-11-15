import React, { useState } from "react";

export default function SelectBox({
  label,
  icon,
  name,
  options = [],
  value = "",
  onChange,
  placeholder = "Select an option",
}) {
  
  
  return (
    <div className="relative inline-flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm cursor-pointer">
      
      {/* Icon */}
      {icon || (
        <svg
          className="w-4 h-4 text-slate-600"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <path
            d="M3 5h18M3 12h18M3 19h18"
            stroke="#94a3b8"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}

      {/* Displayed label */}
      <span className="pointer-events-none truncate font-medium text-slate-700">
        {value ? value : placeholder}
      </span>

      {/* Invisible native select */}
      <select
        value={value}
        name={name}
        onChange={(e) => onChange?.(e.target.name,e.target.value)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        aria-label={label || placeholder}
      >
        <option value="">{placeholder}</option>

        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      {/* Dropdown arrow */}
      <svg
        className="ml-auto w-3 h-3 text-slate-400 pointer-events-none"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden
      >
        <path
          d="M6 8l4 4 4-4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
