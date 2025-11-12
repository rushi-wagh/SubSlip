// replace the original search container with this block
import React, { useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";

const Select = () => {
  // sample batches — replace/prop-drill as needed
  const batches = [
    { id: "B1", label: "Batch A", meta: "CS301 · Morning" },
    { id: "B2", label: "Batch B", meta: "CS301 · Afternoon" },
    { id: "B3", label: "Batch C", meta: "CS301 · Evening" },
    { id: "B4", label: "Batch D", meta: "CS301 · Weekend" },
  ];

  const [selected, setSelected] = useState(new Set());
  const [query, setQuery] = useState("");

  const toggle = (id) => {
    setSelected((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  };

  return (
    <div className="flex-1">
      {/* Search input */}
      <div className="relative mb-3">
        <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
          <HiOutlineSearch className="w-5 h-5" />
        </span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="search"
          placeholder="Search students by name or roll"
          className="w-full rounded-lg border border-slate-200 py-3 pl-12 pr-4 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#bfdbfe]"
        />
      </div>

      {/* Batch selector cards (horizontal scroll on small screens) */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {batches
          .filter((b) => b.label.toLowerCase().includes(query.toLowerCase()) || b.meta.toLowerCase().includes(query.toLowerCase()))
          .map((b) => {
            const isSelected = selected.has(b.id);
            return (
              <label
                key={b.id}
                htmlFor={`batch-${b.id}`}
                onClick={(e) => {
                  // prevent label default which might also toggle; we handle toggle explicitly
                  e.preventDefault();
                  toggle(b.id);
                }}
                className={`flex-shrink-0 cursor-pointer min-w-[12rem] md:min-w-[14rem] block rounded-lg p-3 border transition-colors duration-150 ${
                  isSelected
                    ? "bg-[#eff8ff] border-[#2b7df7] text-[#0f4fc1] shadow-sm"
                    : "bg-white border-slate-100 text-slate-700 hover:border-slate-200"
                }`}
              >
                {/* hidden native checkbox for accessibility */}
                <input
                  id={`batch-${b.id}`}
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggle(b.id)}
                  className="sr-only"
                />

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className={`text-sm font-semibold ${isSelected ? "text-[#0f4fc1]" : "text-slate-800"}`}>{b.label}</div>
                    <div className="text-xs text-slate-400 mt-1">{b.meta}</div>
                  </div>

                  <div className="flex items-center">
                    {/* visual checkbox */}
                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                        isSelected ? "bg-[#2b7df7] border-[#2b7df7]" : "bg-white border-slate-200"
                      }`}
                      aria-hidden
                    >
                      {isSelected ? (
                        <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 10l3 3 9-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <div />
                      )}
                    </div>
                  </div>
                </div>
              </label>
            );
          })}
      </div>
    </div>
  );
}

export default Select;
