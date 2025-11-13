
import React from "react";

/**
 * SelectBox — A general-purpose styled <select> matching your provided UI.
 *
 * ✅ Fully reusable — use for any data (division, subject, role, etc.)
 * ✅ Same look as your example (white background, border, icon, rounded)
 * ✅ Accessible — uses native <select> behind invisible overlay
 *
 * Props:
 * - label (optional): string to show next to icon (if no value selected)
 * - icon (optional): ReactNode (you can pass any icon)
 * - options: [{ value, label }] — array of select options
 * - value: current selected value
 * - onChange: (value) => void
 * - placeholder (optional): shown if no value selected
 */

export default function SelectBox({
  label,
  icon,
  options = [],
  value = "",
  onChange = () => {},
  placeholder = "Select an option",
}) {
  const currentLabel =
    options.find((opt) => opt.value === value)?.label || label || placeholder;

  return (
    <div className="relative inline-flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm cursor-pointer">
      {/* Icon (default is menu icon if none provided) */}
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
      <span className="text-slate-700 font-medium truncate pointer-events-none">
        {currentLabel}
      </span>

      {/* Invisible native select (captures clicks & keyboard) */}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        aria-label={label || placeholder}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Dropdown arrow */}
      <svg
        className="w-3 h-3 ml-auto text-slate-400 pointer-events-none"
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
