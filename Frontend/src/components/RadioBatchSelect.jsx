import React, { useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";

const RadioBatchSelect = () => {
  // sample batches — replace or prop-drill as needed
  const batches = [
    { id: "B1", label: "Batch A", meta: "CS301 · Morning" },
    { id: "B2", label: "Batch B", meta: "CS301 · Afternoon" },
    { id: "B3", label: "Batch C", meta: "CS301 · Evening" },
    { id: "B4", label: "Batch D", meta: "CS301 · Weekend" },
  ];

  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");

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
          placeholder="Search batches by name"
          className="w-full rounded-lg border border-slate-200 py-3 pl-12 pr-4 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#bfdbfe]"
        />
      </div>

      {/* Batch selector cards */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {batches
          .filter(
            (b) =>
              b.label.toLowerCase().includes(query.toLowerCase()) ||
              b.meta.toLowerCase().includes(query.toLowerCase())
          )
          .map((b) => {
            const isSelected = selected === b.id;

            return (
              <label
                key={b.id}
                htmlFor={`batch-${b.id}`}
                className={`flex-shrink-0 cursor-pointer min-w-[12rem] md:min-w-[14rem] block rounded-lg p-3 border transition-colors duration-150 ${
                  isSelected
                    ? "bg-[#eff8ff] border-[#2b7df7] text-[#0f4fc1] shadow-sm"
                    : "bg-white border-slate-100 text-slate-700 hover:border-slate-200"
                }`}
              >
                {/* hidden native radio for accessibility */}
                <input
                  id={`batch-${b.id}`}
                  type="radio"
                  name="batch"
                  value={b.id}
                  checked={isSelected}
                  onChange={() => setSelected(b.id)}
                  className="sr-only"
                />

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div
                      className={`text-sm font-semibold ${
                        isSelected ? "text-[#0f4fc1]" : "text-slate-800"
                      }`}
                    >
                      {b.label}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">{b.meta}</div>
                  </div>

                  <div className="flex items-center">
                    {/* visual radio indicator */}
                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? "border-[#2b7df7]"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-3 h-3 rounded-full bg-[#2b7df7]" />
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

export default RadioBatchSelect;
