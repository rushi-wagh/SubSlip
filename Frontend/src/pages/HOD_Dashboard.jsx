import React, { useEffect, useState } from "react";
import {
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi";
import { FiCheck } from "react-icons/fi";
import { IoCloudDownloadOutline } from "react-icons/io5";
import SelectBox from "../components/SelectBox";
import { Division } from "../assets/roleRoute.jsx";
import {
  DUAL_SUBJECT_TYPE,
  ElectiveSub,
  AllSubject,
} from "../assets/roleRoute.jsx";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";

const HOD_Dashboard = () => {
  // ---------- STATE ----------
  const [students, setStudents] = useState([]); // full data from API
  const [columnName, setcolumnName] = useState([]); // subject columns
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    className: "",
    division: "",
  });
  const [page, setPage] = useState(1);

  // ---------- FILTER + PAGINATION ----------
  const filteredStudents = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;

    return students.filter((s) => {
      const name = (s.name || "").toLowerCase();
      const roll = (s.rollNo || "").toLowerCase();

      const subjectsStr = Array.isArray(s.subjects)
        ? s.subjects.join(" ").toLowerCase()
        : "";

      const submissionMatch =
        Array.isArray(s.submissions) &&
        s.submissions.some((sub) =>
          (sub?.subject || "").toString().toLowerCase().includes(q)
        );

      return (
        name.includes(q) ||
        roll.includes(q) ||
        subjectsStr.includes(q) ||
        submissionMatch
      );
    });
  }, [students, query]);

  const perPage = 10;
  const total = filteredStudents.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pageRows = filteredStudents.slice(
    (page - 1) * perPage,
    page * perPage
  );

  const startIndex = total === 0 ? 0 : (page - 1) * perPage + 1;
  const endIndex = Math.min(page * perPage, total);

  const onChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPage(1);
  };

  // ---------- DATA FETCH ----------
  const getData = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/students/by-class`,
        formData,
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        setStudents(res.data.data || []);
        settingupSubjects();
      }
    } catch (error) {
      console.log(error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formData.className !== "" || formData.division !== "") {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  // ---------- SUBJECT COLUMN SETUP ----------
  const settingupSubjects = () => {
    const dualsubjecttype = DUAL_SUBJECT_TYPE[formData.className] || [];
    const allsubjects = AllSubject[formData.className] || [];
    const electivesubj = ElectiveSub[formData.className] || [];
    let columns = [];

    const addSubjectColumn = (subject, subjectType = "single") => {
      const key =
        subjectType === "single" ? `${subject}` : `${subject}_${subjectType}`;
      const label =
        subjectType === "single"
          ? `${subject}`
          : `${subject} (${subjectType === "Theory" ? "Theory" : "Practical"})`;
      columns.push({ key, label });
    };

    const electiveFlat = electivesubj.flat();

    // Normal subjects (excluding ones present in elective groups)
    allsubjects.forEach((sub) => {
      if (electiveFlat.includes(sub)) return;

      if (dualsubjecttype.includes(sub)) {
        addSubjectColumn(sub, "Theory");
        addSubjectColumn(sub, "Practical");
      } else {
        addSubjectColumn(sub, "single");
      }
    });

    // Elective subjects
    electivesubj.forEach((group) => {
      group.forEach((sub) => {
        if (dualsubjecttype.includes(sub)) {
          addSubjectColumn(sub, "Theory");
          addSubjectColumn(sub, "Practical");
        } else {
          addSubjectColumn(sub, "single");
        }
      });
    });

    setcolumnName(columns);
  };

  const getSubjectAndType = (col) => {
    const key = typeof col === "string" ? col : col.key;

    if (!key) {
      return { subject: "", subjectType: "single" };
    }

    const parts = key.split("_");

    if (parts.length === 2) {
      const [subject, type] = parts;
      const normalizedType =
        type.toLowerCase() === "theory"
          ? "Theory"
          : type.toLowerCase() === "practical"
          ? "Practical"
          : type;

      return { subject, subjectType: normalizedType };
    }

    return { subject: key, subjectType: "single" };
  };

  const findSubmission = (student, subject, subType) => {
    if (!student.submission || !Array.isArray(student.submission))
      return null;
    return student.submission.find((s) => {
      const matchesSubject = s.subject === subject;
      if (subType === "single") return matchesSubject;
      if (subType === "Theory")
        return (
          matchesSubject &&
          (s.subjectType?.toLowerCase() === "theory" ||
            s.subjectType?.toLowerCase() === "th")
        );
      if (subType === "Practical")
        return (
          matchesSubject &&
          (s.subjectType?.toLowerCase() === "practical" ||
            s.subjectType?.toLowerCase() === "pr")
        );
      return false;
    });
  };

  const renderStatusCell = (student, subject, subType) => {
    const isEnrolled =
      Array.isArray(student.subjects) && student.subjects.includes(subject);
    if (!isEnrolled) {
      return <span title="Not enrolled">✗</span>;
    }

    const submission = findSubmission(student, subject, subType);
    if (!submission) return <span title="Submission not found"> Pending</span>;

    if (submission.status && submission.status.toLowerCase() === "completed") {
      return <span title="Completed"> Done</span>;
    }

    return (
      <span title={submission.status || "Pending"}>
        ⏳ {submission.status || "Pending"}
      </span>
    );
  };

  // ---------- CSV HELPERS ----------
  const getStatusText = (student, subject, subType) => {
    const isEnrolled =
      Array.isArray(student.subjects) && student.subjects.includes(subject);
    if (!isEnrolled) return "Not Enrolled";

    const submission = findSubmission(student, subject, subType);
    if (!submission) return "Pending";

    if (submission.status && submission.status.toLowerCase() === "completed") {
      return "Done";
    }

    return submission.status || "Pending";
  };

  const escapeCsv = (value) => {
    if (value === null || value === undefined) return "";
    const str = String(value);
    if (/[",\n\r]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const handleDownloadCsv = () => {
    if (!filteredStudents || filteredStudents.length === 0) {
      alert("No data to export");
      return;
    }

    const header = [
      "Student Name",
      "Roll No",
      ...columnName.map((c) => c.label),
      "Final Verification",
      "HOD Verification",
    ];

    const rows = filteredStudents.map((student) => {
      const subjectStatuses = columnName.map((col) => {
        const { subject, subjectType } = getSubjectAndType(col);
        return getStatusText(student, subject, subjectType);
      });

      const finalText = student.finalVerification ? "Done" : "Pending";
      const hodText = student.HodVerified ? "Done" : "Pending";

      return [
        student.name || "",
        student.rollNo || "",
        ...subjectStatuses,
        finalText,
        hodText,
      ];
    });

    const csvString =
      header.map(escapeCsv).join(",") +
      "\n" +
      rows.map((row) => row.map(escapeCsv).join(",")).join("\n");

    const blob = new Blob([csvString], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    const classNameLabel = formData.className || "Class";
    const divisionLabel = formData.division || "Div";

    const link = document.createElement("a");
    link.href = url;
    link.download = `HOD_${classNameLabel}_${divisionLabel}_students.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="px-[5vw]">
        <p
          className="w-fit px-[1.4vw] py-[0.5vw] rounded-xl border border-blue-300/80 
                bg-white/60 backdrop-blur-sm shadow-md text-blue-700 font-medium"
        >
          <span className="font-semibold text-blue-800">{user.role} Name :</span>{" "}
          {user.name || "Unknown"}
        </p>
      </div>
      <div className="w-screen px-[5vw] pt-[2vw]">
        {/* Top controls */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Class Select */}
            <SelectBox
              id={"class-select"}
              name={"className"}
              placeholder={"Select the Class"}
              onChange={onChange}
              value={formData.className}
              options={["SY", "TY", "BTECH"]}
            />

            {/* Division Select */}
            <SelectBox
              id={"division-select"}
              name={"division"}
              placeholder={"Select the Division"}
              onChange={onChange}
              value={formData.division}
              options={Division[formData.className] || []}
            />

            {/* Search */}
            <div className="flex-1 min-w-[220px]">
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <HiOutlineSearch className="w-5 h-5" />
                </span>
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                  type="search"
                  placeholder="Search by student, roll, or subject"
                  className="w-full rounded-full border border-slate-200 py-3 pl-12 pr-4 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#bfdbfe]"
                />
              </div>
            </div>
          </div>

          {/* Right controls */}
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => {
                setFormData({ className: "", division: "" });
                setQuery("");
                setPage(1);
                setStudents([]);
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              <HiOutlineFilter className="w-5 h-5" />
              Reset Filters
            </button>

            <button
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-2 rounded-lg bg-[#2563eb] px-4 py-2 text-sm text-white shadow-sm hover:opacity-95"
            >
              <IoCloudDownloadOutline className="w-5 h-5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Status pills legend */}
        <div className="flex items-center gap-3 mb-4">
          <Pill status="done">Done</Pill>
          <Pill status="pending">Pending</Pill>
        </div>

        {/* Table card */}
        <div className="bg-white rounded-2xl border border-slate-100 p-0 shadow-sm overflow-hidden">
          {/* Header row above table */}
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="text-xs text-slate-400">
                Showing {startIndex}–{endIndex} of {total}
              </div>
              <div className="text-xs text-slate-400">
                {formData.className || "—"} · Division {formData.division || "—"}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] table-auto">
              <thead>
                <tr className="text-xs text-slate-500 bg-white text-center">
                  <th className="py-4 px-6 text-nowrap text-center">
                    Students Name
                  </th>
                  <th className="py-4 px-6 text-nowrap text-center">Roll No</th>
                  {/* Subject columns */}
                  {columnName.map((col) => (
                    <th
                      key={col.key}
                      className="py-4 px-6 text-nowrap text-center"
                    >
                      {col.label}
                    </th>
                  ))}
                  <th className="py-4 px-6 text-nowrap text-center">
                    Final Verfication
                  </th>
                  <th className="py-4 px-6 text-nowrap text-center">
                    HOD Verification
                  </th>
                </tr>
              </thead>

              <tbody>
                {/* Rows */}
                {pageRows.map((row, index) => (
                  <tr
                    key={row.id || row._id || `${row.rollNo || index}-${index}`}
                    className={index % 2 === 0 ? "bg-white" : "bg-[#f6fbff]"}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="font-medium text-slate-800 text-center">
                          {row.name || "-"}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-center">
                      {row.rollNo || "-"}
                    </td>

                    {columnName.map((status, idx) => {
                      const { subject, subjectType } = getSubjectAndType(status);
                      console.log(row, subject, subjectType);
                      return (
                        <td
                          key={idx}
                          className="py-4 px-6 whitespace-nowrap text-center"
                        >
                          {renderStatusCell(row, subject, subjectType)}
                        </td>
                      );
                    })}

                    <td className="py-4 px-6 text-center text-nowrap">
                      {row.finalVerification ? (
                        <div className="inline-flex items-center gap-2 bg-emerald-600/10 text-emerald-700 px-4 py-2 rounded-full whitespace-nowrap">
                          <FiCheck className="w-4 h-4" /> Submission Done
                        </div>
                      ) : (
                        <button className="px-4 py-2 rounded-full bg-slate-100 text-sm text-slate-500">
                          Submission Pending
                        </button>
                      )}
                    </td>

                    <td className="py-4 px-6 text-center text-nowrap">
                      {row.HodVerified ? (
                        <div className="inline-flex items-center gap-2 bg-emerald-600/10 text-emerald-700 px-4 py-2 rounded-full whitespace-nowrap">
                          <FiCheck className="w-4 h-4" /> Submission Done
                        </div>
                      ) : (
                        <button className="px-4 py-2 rounded-full bg-slate-100 text-sm text-slate-500">
                          Submission Pending
                        </button>
                      )}
                    </td>
                  </tr>
                ))}

                {/* Empty state */}
                {pageRows.length === 0 && (
                  <tr>
                    <td
                      className="py-8 px-6 text-center text-slate-400"
                      colSpan={columnName.length + 4}
                    >
                      {loading ? "Loading..." : "No students found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination footer */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 text-slate-600"
              >
                <HiOutlineChevronLeft className="w-4 h-4" />
              </button>

              <div className="hidden sm:flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }).map((_, n) => {
                  const num = n + 1;
                  return (
                    <button
                      key={num}
                      onClick={() => setPage(num)}
                      className={`w-8 h-8 rounded-full text-sm ${
                        page === num
                          ? "bg-[#2563eb] text-white"
                          : "bg-white text-slate-600 border border-slate-100"
                      }`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 text-slate-600"
              >
                <HiOutlineChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-400">
              Page {page} of {totalPages}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HOD_Dashboard;

/* Pill component kept at bottom for readability */
const Pill = ({ status, children }) => {
  if (status === "done")
    return (
      <span className="inline-flex items-center gap-2 bg-emerald-600/10 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
        <FiCheck className="w-4 h-4 text-emerald-700" />
        {children}
      </span>
    );
  return (
    <span className="inline-flex items-center gap-2 bg-amber-400/10 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
      {children}
    </span>
  );
};
