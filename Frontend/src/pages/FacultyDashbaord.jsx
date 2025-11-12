import React from 'react'

const FacultyDashbaord = () => {
  return (
    <div className='w-screen relative overflow-x-hidden h-screen flex px-[2vw] gap-[1vw]'>
      <SidebarFilter/>
      <SubmissionsPanel/>
    </div>
  )
}

export default FacultyDashbaord

// SidebarFilter.jsx
import { HiOutlineChevronRight } from "react-icons/hi";

/**
 * SidebarFilter
 * - Left sidebar component with brand, subject radio list, and stats cards.
 * - Strict Tailwind ONLY. Responsive: hidden on small screens (use on md+).
 * - Replace brand with image at /assets/logo.png
 *
 * Props:
 * - subjects: [{ id, title, code, subtitle, selected }]
 * - stats: { total, submitted, pending }
 */
function SidebarFilter({
  subjects = [
    { id: 1, title: "DAA (Theory)", code: "CS301", subtitle: "Design & Analysis of Algorithms", selected: true },
    { id: 2, title: "Operating Systems", code: "CS302", subtitle: "Process, Memory, File", selected: false },
    { id: 3, title: "Computer Networks Lab", code: "CS352", subtitle: "CN Experiments", selected: false },
    { id: 4, title: "Database Systems", code: "CS305", subtitle: "SQL & Transactions", selected: false },
  ],
  stats = { total: 50, submitted: 42, pending: 8 },
}) {
  return (
    <aside className="hidden md:flex md:flex-col w-80 lg:w-96 bg-transparent">
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        

        {/* Title */}
        <h3 className="text-sm font-semibold text-slate-800 mb-3">Select Subject Filter</h3>

        {/* Subject list */}
        <div className="space-y-3">
          {subjects.map((s) => (
            <label key={s.id} className={`flex items-start gap-3 p-3 rounded-lg border ${s.selected ? "border-[#2b7df7] bg-[#f1f8ff]" : "border-slate-100 bg-white"}`}>
              <input
                type="radio"
                name="subject"
                defaultChecked={s.selected}
                className="mt-1 h-4 w-4 text-blue-600"
              />
              <div>
                <div className="text-sm font-medium text-slate-800">{s.title}</div>
                <div className="text-xs text-slate-400 mt-1">{s.code} • {s.subtitle}</div>
              </div>
            </label>
          ))}
        </div>

        {/* spacing */}
        <div className="mt-4" />

        {/* Stats cards */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="bg-[#eef6ff] rounded-lg p-3 text-center">
            <div className="text-lg font-semibold text-slate-800">{stats.total}</div>
            <div className="text-xs text-slate-500">Total<br />Students</div>
          </div>

          <div className="bg-[#eef6ff] rounded-lg p-3 text-center">
            <div className="text-lg font-semibold text-slate-800">{stats.submitted}</div>
            <div className="text-xs text-slate-500">Submitted</div>
          </div>

          <div className="bg-[#eef6ff] rounded-lg p-3 text-center">
            <div className="text-lg font-semibold text-slate-800">{stats.pending}</div>
            <div className="text-xs text-slate-500">Pending</div>
          </div>
        </div>

        {/* Tip */}
        <div className="mt-4 text-xs text-slate-400">
          Tip: Select a subject to update the list. Use the status column to mark submissions.
        </div>
      </div>
    </aside>
  );
}

// SubmissionsPanel.jsx
import { HiOutlineSearch } from "react-icons/hi";
import { FiCheck } from "react-icons/fi";
import Select from '../components/Select';

/**
 * SubmissionsPanel
 * - Right/main panel showing search, status filter, table of students and CTA.
 * - Strict Tailwind ONLY and responsive.
 * - Replace brand with image at /assets/logo.png is done in Sidebar; not needed here.
 *
 * Props:
 * - students: [{ id, name, subject, status }] status: 'submitted' | 'pending'
 */
function SubmissionsPanel({
  students = [
    { id: 1, roll: "CS301-01", name: "Ananya Gupta", division: "A", subject: "DAA (Theory)", status: "pending" },
    { id: 2, roll: "CS301-02", name: "Rohan Verma", division: "A", subject: "DAA (Theory)", status: "submitted" },
    { id: 3, roll: "CS301-03", name: "Meera Iyer", division: "B", subject: "DAA (Theory)", status: "submitted" },
    { id: 4, roll: "CS301-04", name: "Arjun Nair", division: "B", subject: "DAA (Theory)", status: "pending" },
    { id: 5, roll: "CS301-05", name: "Sana Khan", division: "C", subject: "DAA (Theory)", status: "submitted" },
  ],
}) {
  return (
    <div className="flex-1">
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
        {/* Top controls: search + filter */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <Select />
        </div>

        {/* Table header */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left text-xs text-slate-500">
                <th className="py-3 pl-1">Roll No</th>
                <th className="py-3">Student Name</th>
                <th className="py-3">Division</th>
                <th className="py-3">Subject Name</th>
                <th className="py-3 text-right pr-4">Select</th>
                <th className="py-3 text-right pr-6">Status</th>
              </tr>
            </thead>

            <tbody>
              {students.map((s, idx) => (
                <tr
                  key={s.id}
                  className={`${
                    idx % 2 === 0 ? "bg-white" : "bg-[#f6fbff]"
                  } border-t border-slate-100`}
                >
                  {/* Roll Number */}
                  <td className="py-4 pl-1 text-sm text-slate-700 font-medium">
                    {s.roll}
                  </td>

                  {/* Student Name */}
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden
                        >
                          <path
                            d="M12 12a5 5 0 100-10 5 5 0 000 10zM2 22c0-3.3 4-6 10-6s10 2.7 10 6"
                            stroke="#94a3b8"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="text-sm text-slate-800">{s.name}</div>
                    </div>
                  </td>

                  {/* Division */}
                  <td className="py-4 text-sm text-slate-700">{s.division}</td>

                  {/* Subject */}
                  <td className="py-4 text-sm text-slate-700">{s.subject}</td>

                  {/* Checkbox */}
                  <td className="py-4 text-right pr-4">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300"
                    />
                  </td>

                  {/* Status */}
                  <td className="py-4 text-right pr-6">
                    {s.status === "submitted" ? (
                      <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                        <FiCheck className="w-4 h-4" /> Submitted
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-sm">
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* End of list text */}
        <div className="text-center text-xs text-slate-400 mt-4">End of list</div>
      </div>
    </div>
  );
}

