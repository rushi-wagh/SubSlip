import React, { useState } from "react";
import { HiOutlineSearch, HiOutlineFilter } from "react-icons/hi";
import { FiCheck } from "react-icons/fi";
import { IoCloudDownloadOutline } from "react-icons/io5";

/**
 * ClassSummary.jsx
 *
 * - Recreates the provided Class Summary UI using Tailwind CSS only.
 * - Responsive: stacks on small screens, full layout on md+.
 * - Strict Tailwind classes — do NOT add external CSS.
 * - Replace assets (avatars / logo) under /public/assets if needed.
 *
 * Usage:
 * <ClassSummary />
 */

const CCPage = () => {
  const subjects = [
    "DAA",
    "Operating Systems",
    "Computer Networks",
    "DBMS",
    "Web Development",
    "Microprocessor",
  ];

  const rows = [
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
  ];

  const totalStudents = 45;
  const subjectsCount = subjects.length;
  const submittedCount = 38;
  const pendingCount = 7;
  const progressPercent = Math.round((submittedCount / totalStudents) * 100);

  const [query, setQuery] = useState("");

  const filteredRows = rows.filter((r) =>
    r.name.toLowerCase().includes(query.toLowerCase())
  );

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
            <path
              d="M12 8v5l3 3"
              stroke="#b45309"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
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

  const exportCsv = () => {
    const header = ["Student Name", ...subjects, "Final Verification"];
    const data = rows.map((r) => [r.name, ...r.statuses, r.final]);
    const csv = [header, ...data].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "class-summary.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-screen min-h-screen">
      <div className="w-full mx-auto space-y-6 px-[5vw]">
        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="col-span-1 bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <div className="text-sm text-slate-500">Class</div>
            <div className="mt-2 font-semibold text-slate-800">CSE - TE A</div>
            <div className="text-xs text-slate-400 mt-1">Current section</div>
          </div>

          <div className="col-span-1 bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <div className="text-sm text-slate-500">Total Students</div>
            <div className="mt-2 font-semibold text-slate-800 text-xl">
              {totalStudents}
            </div>
          </div>

          <div className="col-span-1 bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <div className="text-sm text-slate-500">Subjects</div>
            <div className="mt-2 font-semibold text-slate-800 text-xl">
              {subjectsCount}
            </div>
          </div>

          <div className="col-span-1 bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <div className="text-sm text-slate-500">Submitted</div>
            <div className="mt-2 font-semibold text-slate-800 text-xl">
              {submittedCount}
            </div>
            <div className="mt-2">
              <span className="inline-flex items-center gap-2 bg-emerald-600/10 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                <FiCheck className="w-4 h-4 text-emerald-700" /> On track
              </span>
            </div>
          </div>

          <div className="col-span-1 bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <div className="text-sm text-slate-500">Pending</div>
            <div className="mt-2 font-semibold text-slate-800 text-xl">
              {pendingCount}
            </div>
            <div className="mt-2">
              <span className="inline-flex items-center gap-2 bg-amber-400/10 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
                <svg
                  className="w-3 h-3"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M12 8v5l3 3"
                    stroke="#b45309"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Needs attention
              </span>
            </div>
          </div>

          <div className="hidden lg:block col-span-1" />
        </div>

        {/* Progress */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-slate-700">
              Overall Progress
            </div>
            <div className="text-xs text-slate-400">
              {submittedCount} of {totalStudents} students submitted
            </div>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-3">
            <div
              className="h-3 rounded-full bg-blue-600"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Header + controls */}
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div>
            <div className="text-sm font-semibold text-slate-700 mb-1">
              Student Submission Status
            </div>
            <div className="text-xs text-slate-400">
              Submitted: {submittedCount} / {totalStudents} students
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="relative w-full md:w-80">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                <HiOutlineSearch className="w-5 h-5" />
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="search"
                placeholder="Search by student or subject"
                className="w-full rounded-full border border-slate-200 py-3 pl-12 pr-4 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#bfdbfe]"
              />
            </div>

            <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
              <HiOutlineFilter className="w-5 h-5" /> Show: All
            </button>

            <button
              onClick={exportCsv}
              className="inline-flex items-center gap-2 rounded-lg bg-[#2563eb] px-4 py-2 text-sm text-white shadow-sm hover:opacity-95"
            >
              <IoCloudDownloadOutline className="w-5 h-5" /> Export
            </button>
          </div>
        </div>

        {/* Table card */}
        <div className="bg-white rounded-2xl border border-slate-100 p-0 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="text-xs text-slate-400">
                Showing 1–10 of {totalStudents}
              </div>
              <div className="text-xs text-slate-400">
                Live overview of submissions
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] table-auto">
              <thead>
                <tr className="text-left text-xs text-slate-500 bg-white">
                  <th className="py-4 px-6">Student Name</th>
                  {subjects.map((sub) => (
                    <th key={sub} className="py-4 px-6">
                      {sub}
                    </th>
                  ))}
                  <th className="py-4 px-6">Final Verification</th>
                </tr>
              </thead>

              <tbody>
                {filteredRows.map((r, i) => (
                  <tr
                    key={r.id}
                    className={`${i % 2 === 0 ? "bg-white" : "bg-[#f6fbff]"}`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={r.avatar}
                          alt={r.name}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                        <div className="font-medium text-slate-800">
                          {r.name}
                        </div>
                      </div>
                    </td>

                    {r.statuses.map((st, idx) => (
                      <td key={idx} className="py-4 px-6">
                        <Pill status={st}>
                          {st === "done"
                            ? "Done"
                            : st === "pending"
                            ? "Pending"
                            : "Not Started"}
                        </Pill>
                      </td>
                    ))}

                    <td className="py-4 px-6">
                      {r.final === "submission_done" ? (
                        <div className="inline-flex items-center gap-2 bg-emerald-600/10 text-emerald-700 px-4 py-2 rounded-full">
                          <FiCheck className="w-4 h-4" /> Submission Done
                        </div>
                      ) : (
                        <button className="px-4 py-2 rounded-full border border-slate-200 text-sm text-slate-500">
                          Finalize
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="text-xs text-slate-400">
              Showing 1–10 of {totalStudents}
            </div>
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 text-slate-600">
                Prev
              </button>
              <div className="flex items-center gap-2">
                <button className="w-8 h-8 rounded-full text-sm bg-white text-slate-600 border border-slate-100">
                  1
                </button>
                <button className="w-8 h-8 rounded-full text-sm bg-white text-slate-600 border border-slate-100">
                  2
                </button>
                <button className="w-8 h-8 rounded-full text-sm bg-white text-slate-600 border border-slate-100">
                  3
                </button>
              </div>
              <button className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 text-slate-600">
                Next
              </button>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400 py-6">
          Terms • Privacy
        </div>
        <select defaultValue="Pick a color" className="select">
  <option disabled={true}>Pick a color</option>
  <option>Crimson</option>
  <option>Amber</option>
  <option>Velvet</option>
</select>
      </div>
    </div>
  );
};
export default CCPage;
