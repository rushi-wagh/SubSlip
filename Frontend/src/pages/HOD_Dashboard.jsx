import React, { useState } from "react";
import {
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi";
import { FiCheck } from "react-icons/fi";
import { IoCloudDownloadOutline } from "react-icons/io5";

/**
 * SubmissionMatrix.jsx
 *
 * - Single-file React component that recreates the provided UI exactly (Tailwind only).
 * - Responsive: stacks controls on small screens, shows full table on md+.
 * - Strict Tailwind classes only. Do not add external CSS.
 * - Uses sample data. Wire to your backend/data layer as needed.
 *
 * Usage:
 * <SubmissionMatrix />
 *
 * Notes:
 * - The table columns represent subjects; each cell shows a pill status: Done / Pending / Not Started.
 * - Top controls include year/division selects, search, Reset Filters, Export CSV.
 * - Pagination controls at bottom.
 * - All imagery/icons use react-icons; replace avatar urls / data as needed.
 */

const HOD_Dashboard = () => {
  const subjects = [
    "DAA",
    "Operating Systems",
    "Computer Networks",
    "DBMS",
    "Web Development",
    "Microprocessor",
  ];

  // sample rows
  const initialRows = [
    {
      id: 1,
      avatar: "/assets/avatar1.jpg",
      name: "Ramu",
      statuses: ["done", "done", "pending", "done", "pending", "done"],
      final: "finalize",
    },
    {
      id: 2,
      avatar: "/assets/avatar2.jpg",
      name: "Shyam",
      statuses: ["done", "done", "done", "done", "done", "done"],
      final: "submission_done",
    },
    {
      id: 3,
      avatar: "/assets/avatar3.jpg",
      name: "Aarav Patil",
      statuses: ["done", "pending", "done", "pending", "done", "done"],
      final: "finalize",
    },
    {
      id: 4,
      avatar: "/assets/avatar4.jpg",
      name: "Kiran Shah",
      statuses: ["pending", "pending", "pending", "done", "pending", "pending"],
      final: "finalize",
    },
    {
      id: 5,
      avatar: "/assets/avatar5.jpg",
      name: "Neha Kulkarni",
      statuses: ["done", "done", "done", "done", "done", "done"],
      final: "submission_done",
    },
  ];

  const [rows] = useState(initialRows);
  const [query, setQuery] = useState("");
  const [year] = useState("SY");
  const [division] = useState("Division B");
  const [page, setPage] = useState(1);

  // helpers for pill styles
  const Pill = ({ status, children }) => {
    if (status === "done")
      return (
        <span className="inline-flex items-center gap-2 bg-emerald-600/10 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
          <FiCheck className="w-4 h-4 text-emerald-700" />
          {children}
        </span>
      );
    if (status === "pending")
      return (
        <span className="inline-flex items-center gap-2 bg-amber-400/10 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 8v5l3 3" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {children}
        </span>
      );
    return (
      <span className="inline-flex items-center gap-2 bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-sm font-medium">
        {children}
      </span>
    );
  };

  // filtered rows
  const filteredRows = rows.filter((r) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return r.name.toLowerCase().includes(q);
  });

  // pagination (simple mock)
  const perPage = 10;
  const total = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pageRows = filteredRows.slice((page - 1) * perPage, page * perPage);

  // CSV export (simple)
  const exportCsv = () => {
    const header = ["Student Name", ...subjects, "Final Verification"];
    const data = rows.map((r) => [r.name, ...r.statuses, r.final]);
    const csv = [header, ...data].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "submissions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-screen px-[5vw] pt-[2vw]">
      {/* Top controls */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Year chip */}
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm">
            <svg className="w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M3 7h18M7 3v4M17 3v4" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="3" y="7" width="18" height="14" rx="2" stroke="#94a3b8" strokeWidth="1.25" />
            </svg>
            <span className="text-slate-700 font-medium">Year {year}</span>
            <span className="text-xs text-slate-400 ml-2">SY</span>
          </div>

          {/* Division chip */}
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm">
            <svg className="w-4 h-4 text-slate-600" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M3 5h18M3 12h18M3 19h18" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-slate-700 font-medium">{division}</span>
          </div>

          {/* search */}
          <div className="flex-1 min-w-[220px]">
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                <HiOutlineSearch className="w-5 h-5" />
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="search"
                placeholder="Search student or subject..."
                className="w-full rounded-full border border-slate-200 py-3 pl-12 pr-4 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#bfdbfe]"
              />
            </div>
          </div>
        </div>

        {/* right controls */}
        <div className="ml-auto flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
            <HiOutlineFilter className="w-5 h-5" />
            Reset Filters
          </button>

          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-2 rounded-lg bg-[#2563eb] px-4 py-2 text-sm text-white shadow-sm hover:opacity-95"
          >
            <IoCloudDownloadOutline className="w-5 h-5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* status pills row */}
      <div className="flex items-center gap-3 mb-4">
        <Pill status="done">Done</Pill>
        <Pill status="pending">Pending</Pill>
        <Pill status="not">Not Started</Pill>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-slate-100 p-0 shadow-sm overflow-hidden">
        {/* Table header area */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-400">Showing 1–10 of 124</div>
            <div className="text-xs text-slate-400">SY · Division B</div>
          </div>
        </div>

        {/* actual table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] table-auto">
            <thead>
              <tr className="text-left text-xs text-slate-500 bg-white">
                <th className="py-4 px-6">Student Name</th>
                {subjects.map((sub) => (
                  <th key={sub} className="py-4 px-6">{sub}</th>
                ))}
                <th className="py-4 px-6">Final Verification</th>
              </tr>
            </thead>

            <tbody>
              {pageRows.map((r, i) => (
                <tr key={r.id} className={`${i % 2 === 0 ? "bg-white" : "bg-[#f0f8ff]"}`}>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img src={r.avatar} alt={r.name} className="w-9 h-9 rounded-full object-cover" />
                      <div className="font-medium text-slate-800">{r.name}</div>
                    </div>
                  </td>

                  {r.statuses.map((st, idx) => (
                    <td key={idx} className="py-4 px-6">
                      <div className="flex items-center justify-start">
                        <Pill status={st}>{st === "done" ? "Done" : st === "pending" ? "Pending" : "Not Started"}</Pill>
                      </div>
                    </td>
                  ))}

                  <td className="py-4 px-6">
                    {r.final === "submission_done" ? (
                      <div className="inline-flex items-center gap-2 bg-emerald-600/10 text-emerald-700 px-4 py-2 rounded-full">
                        <FiCheck className="w-4 h-4" /> Submission Done
                      </div>
                    ) : (
                      <button className="px-4 py-2 rounded-full border border-slate-200 text-sm text-slate-500">Finalize</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* pagination and footer */}
        <div className="p-4 flex items-center justify-between">
          <div className="text-xs text-slate-400">Showing 1–10 of 124</div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 text-slate-600"
            >
              <HiOutlineChevronLeft className="w-4 h-4" />
            </button>

            <div className="hidden sm:flex items-center gap-2">
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-8 h-8 rounded-full text-sm ${page === n ? "bg-[#2563eb] text-white" : "bg-white text-slate-600 border border-slate-100"}`}
                >
                  {n}
                </button>
              ))}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 text-slate-600"
            >
              <HiOutlineChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default HOD_Dashboard;

/* small helper Pill used above (kept inside file to respect the single-file request) */
function Pill({ status, children }) {
  if (status === "done")
    return (
      <span className="inline-flex items-center gap-2 bg-emerald-600/10 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
        <FiCheck className="w-4 h-4 text-emerald-700" />
        {children}
      </span>
    );
  if (status === "pending")
    return (
      <span className="inline-flex items-center gap-2 bg-amber-400/10 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 8v5l3 3" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {children}
      </span>
    );
  return (
    <span className="inline-flex items-center gap-2 bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-sm font-medium">
      {children}
    </span>
  );
}
