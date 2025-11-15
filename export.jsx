import React, { useEffect, useState } from "react";
import { HiOutlineSearch, HiOutlineFilter } from "react-icons/hi";
import { FiCheck } from "react-icons/fi";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

/**
 * CCPage.jsx
 *
 * - Exports Excel with Verified Date (from verifiedAt) and Verified Time (from verifiedTime)
 * - Shows Date / Time in UI under Submission Done
 * - If either field is null -> shows "-"
 */

const CCPage = () => {
  const [query, setQuery] = useState("");
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Derived values
  const submittedStudents = students.filter((s) => Boolean(s.finalVerification));
  const pendingStudents = students.filter((s) => !s.finalVerification);
  const totalStudents = students.length;
  const submittedCount = submittedStudents.length;
  const progressPercent =
    totalStudents > 0 ? Math.round((submittedCount / totalStudents) * 100) : 0;

  // Build unique subjects list
  const subjectsSet = new Set();
  students.forEach((s) => {
    if (Array.isArray(s.subjects)) s.subjects.forEach((sub) => sub && subjectsSet.add(sub));
    if (Array.isArray(s.submission)) s.submission.forEach((e) => e?.subject && subjectsSet.add(e.subject));
    if (Array.isArray(s.submissions)) s.submissions.forEach((e) => e?.subject && subjectsSet.add(e.subject));
  });
  const subjects = Array.from(subjectsSet);

  // Build subjectType map (first found)
  const subjectTypeMap = {};
  students.forEach((s) => {
    const entries = [...(s.submission || []), ...(s.submissions || [])];
    entries.forEach((entry) => {
      if (entry?.subject && !subjectTypeMap[entry.subject]) {
        const t = entry.subjectType || entry.subjecttype || entry.type || "";
        if (t) subjectTypeMap[entry.subject] = String(t).charAt(0).toUpperCase() + String(t).slice(1);
      }
    });
  });

  // Determine single subject status
  const getStatus = (student, subject) => {
    if (!student) return "not_started";

    const subs = Array.isArray(student.submission)
      ? student.submission
      : Array.isArray(student.submissions)
      ? student.submissions
      : [];

    const entry = subs.find((e) => e && String(e.subject) === String(subject));

    if (entry) {
      const st = (entry.status || entry.Status || "").toString().toLowerCase();
      if (["completed", "complete", "done", "submitted", "marked"].includes(st)) return "done";
      return "pending";
    }

    if (Array.isArray(student.subjects) && student.subjects.includes(subject)) {
      return student.finalVerification ? "done" : "pending";
    }

    return "not_started";
  };

  // Format helpers
  const formatDate = (val) => {
    if (!val) return "-";
    try {
      const d = new Date(val);
      return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    } catch {
      return "-";
    }
  };

  const formatTime = (val) => {
    if (!val) return "-";
    try {
      const d = new Date(val);
      return d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
    } catch {
      return "-";
    }
  };

  // Excel Download
  const downloadExcel = () => {
    if (!students || students.length === 0) {
      alert("No data to download");
      return;
    }

    const excelData = students.map((s) => {
      // Build per-subject status columns
      const subjectStatusEntries = subjects.map((sub) => {
        const st = getStatus(s, sub);
        return [`${sub} Status`, st === "done" ? "Done" : st === "pending" ? "Pending" : "Not Started"];
      });

      const obj = {
        Name: s.name || "-",
        RollNo: s.rollNo || "-",
        Class: s.className || "-",
        Division: s.division || "-",
        Batch: s.batch || "-",
        Subjects: Array.isArray(s.subjects) ? s.subjects.join(", ") : s.subjects || "-",
        FinalVerification: s.finalVerification ? "Submission Done" : "Pending",
        VerifiedDate: formatDate(s.finalVerification?.verifiedAt),
        VerifiedTime: formatTime(s.finalVerification?.verifiedTime),
      };

      // merge subject status entries
      subjectStatusEntries.forEach(([k, v]) => {
        obj[k] = v;
      });

      return obj;
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `Students-${user?.className || "class"}-${user?.division || "division"}.xlsx`);
  };

  // Search + filtered rows mapping
  const q = query.trim().toLowerCase();
  const filteredRows = students
    .filter((s) => {
      if (!q) return true;
      const nameMatch = (s.name || "").toLowerCase().includes(q);
      const rollMatch = (s.rollNo || "").toLowerCase().includes(q);
      const subjMatch = (s.subjects || []).some((sub) => (sub || "").toLowerCase().includes(q));
      const submissionMatch =
        (Array.isArray(s.submission) && s.submission.some((e) => (String(e.subject) || "").toLowerCase().includes(q))) ||
        (Array.isArray(s.submissions) && s.submissions.some((e) => (String(e.subject) || "").toLowerCase().includes(q)));
      return nameMatch || rollMatch || subjMatch || submissionMatch;
    })
    .map((s, index) => ({
      id: s._id || index,
      avatar: s.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name || s.rollNo || "Student")}&background=ddd`,
      name: s.name || "-",
      rollNo: s.rollNo || "-",
      statuses: subjects.map((sub) => getStatus(s, sub)),
      final: s.finalVerification ? "submission_done" : "not_done",
      // independent: Date from verifiedAt, Time from verifiedTime
      verifiedDate: s.finalVerification?.verifiedAt ? formatDate(s.finalVerification.verifiedAt) : "-",
      verifiedTime: s.finalVerification?.verifiedTime ? formatTime(s.finalVerification.verifiedTime) : "-",
    }));

  // Data fetch
  const getData = async () => {
    if (!user?.className || !user?.division) return;
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/students/by-class`,
        { className: user.className, division: user.division },
        { withCredentials: true }
      );
      setStudents(res?.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.className && user?.division) getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.className, user?.division]);

  // Pill component
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
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

  const renderSubjectHeader = (sub) => {
    const t = subjectTypeMap[sub];
    return t ? `${sub} (${t})` : sub;
  };

  // UI
  return (
    <div className="w-screen min-h-screen bg-slate-50">
      <div className="w-full mx-auto space-y-6 px-[5vw] py-8">
        {/* Summary Cards */}
        <div className="flex flex-wrap justify-between gap-4">
          <div className="w-full sm:w-1/3 lg:w-1/6 bg-white p-4 rounded-2xl shadow-sm">
            <div className="text-sm text-slate-500">Class</div>
            <div className="mt-2 font-semibold text-slate-800">
              {user?.className || "—"} - {user?.division || "—"} - {user?.batch || ""}
            </div>
          </div>

          <div className="w-full sm:w-1/3 lg:w-1/6 bg-white p-4 rounded-2xl shadow-sm">
            <div className="text-sm text-slate-500">Total Students</div>
            <div className="mt-2 text-xl font-semibold text-slate-800">{totalStudents}</div>
          </div>

          <div className="w-full sm:w-1/3 lg:w-1/6 bg-white p-4 rounded-2xl shadow-sm">
            <div className="text-sm text-slate-500">Subjects</div>
            <div className="mt-2 text-xl font-semibold text-slate-800">{subjects.length}</div>
          </div>

          <div className="w-full sm:w-1/3 lg:w-1/6 bg-white p-4 rounded-2xl shadow-sm">
            <div className="text-sm text-slate-500">Submitted</div>
            <div className="mt-2 text-xl font-semibold text-slate-800">{submittedCount}</div>
            <div className="mt-2">
              <span className="inline-flex items-center gap-2 bg-emerald-600/10 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                <FiCheck className="w-4 h-4 text-emerald-700" /> On track
              </span>
            </div>
          </div>

          <div className="w-full sm:w-1/3 lg:w-1/6 bg-white p-4 rounded-2xl shadow-sm">
            <div className="text-sm text-slate-500">Pending</div>
            <div className="mt-2 text-xl font-semibold text-slate-800">{pendingStudents.length}</div>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-slate-700">Overall Progress</div>
            <div className="text-xs text-slate-400">
              {submittedCount} of {totalStudents} students submitted
            </div>

            <button
              onClick={downloadExcel}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-blue-700 bg-slate-100"
            >
              Download Excel
            </button>
          </div>

          <div className="w-full bg-slate-100 h-3 rounded-full">
            <div className="h-3 bg-blue-600 rounded-full" style={{ width: `${progressPercent}%` }} />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 mt-4">
            <div className="relative w-full md:w-80">
              <span className="absolute inset-y-0 left-3 flex items-center">
                <HiOutlineSearch className="w-5 h-5 text-slate-400" />
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="search"
                placeholder="Search by student, roll, or subject"
                className="w-full pl-12 pr-4 py-3 rounded-full text-sm placeholder:text-slate-400"
              />
            </div>

            <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-700">
              <HiOutlineFilter className="w-5 h-5" /> Show: All
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 -b">
            <div className="text-xs text-slate-400">Showing 1–{Math.min(10, filteredRows.length)} of {totalStudents}</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] table-auto">
              <thead>
                <tr className="text-left text-xs text-slate-500 bg-white">
                  <th className="py-4 px-6">Student</th>
                  <th className="py-4 px-6">Roll No</th>
                  {subjects.map((sub) => (
                    <th key={sub} className="py-4 px-6">
                      {renderSubjectHeader(sub)}
                    </th>
                  ))}
                  <th className="py-4 px-6">Final Verification</th>
                </tr>
              </thead>

              <tbody>
                {filteredRows.map((r, i) => (
                  <tr key={r.id} className={i % 2 === 0 ? "bg-white" : "bg-[#f6fbff]"}>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img src={r.avatar} alt={r.name} className="w-9 h-9 rounded-full object-cover" />
                        <div className="font-medium text-slate-800">{r.name}</div>
                      </div>
                    </td>

                    <td className="py-4 px-6">{r.rollNo || "-"}</td>

                    {r.statuses.map((st, idx) => (
                      <td key={idx} className="py-4 px-6">
                        <Pill status={st}>
                          {st === "done" ? "Done" : st === "pending" ? "Pending" : "Not Started"}
                        </Pill>
                      </td>
                    ))}

                    <td className="py-4 px-6">
                      {r.final === "submission_done" ? (
                        <div className="flex flex-col">
                          <span className="inline-flex items-center gap-2 bg-emerald-600/10 text-emerald-700 px-4 py-2 rounded-full">
                            <FiCheck className="w-4 h-4" /> Submission Done
                          </span>

                          <span className="text-xs text-slate-500 mt-1">Date: {r.verifiedDate || "-"}</span>
                          <span className="text-xs text-slate-500 -mt-1">Time: {r.verifiedTime || "-"}</span>
                        </div>
                      ) : (
                        <button className="px-4 py-2 rounded-full text-sm text-slate-500">Finalize</button>
                      )}
                    </td>
                  </tr>
                ))}

                {filteredRows.length === 0 && (
                  <tr>
                    <td className="py-8 px-6 text-center text-slate-400" colSpan={subjects.length + 3}>
                      {loading ? "Loading..." : "No students found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="text-xs text-slate-400">Showing 1–{Math.min(10, filteredRows.length)} of {totalStudents}</div>

            <div className="flex items-center gap-2">
              <button className="inline-flex items-center justify-center w-8 h-8 rounded-full text-slate-600">Prev</button>

              <div className="flex items-center gap-2">
                <button className="w-8 h-8 rounded-full text-slate-600">1</button>
                <button className="w-8 h-8 rounded-full text-slate-600">2</button>
                <button className="w-8 h-8 rounded-full text-slate-600">3</button>
              </div>

              <button className="inline-flex items-center justify-center w-8 h-8 rounded-full text-slate-600">Next</button>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400 py-6">Terms • Privacy</div>
      </div>
    </div>
  );
};

export default CCPage;