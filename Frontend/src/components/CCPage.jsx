import React, { useEffect, useState } from "react"; 
import { HiOutlineSearch } from "react-icons/hi";
import { FiCheck, FiClock, FiX } from "react-icons/fi";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {
  DUAL_SUBJECT_TYPE,
  ElectiveSub,
  AllSubject,
} from "../assets/roleRoute";
import { Toaster } from "../../Toaster";
// import { Toaster } from "../Toaster"; // <-- make sure this import is correct if you use Toaster()

const CCPage = () => {
  const { user } = useAuth();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [columnName, setcolumnName] = useState([]);
  const [confirming, setConfirming] = useState(null);
  const [query, setQuery] = useState("");
  const [selectedStudent, setselectedStudent] = useState(null);

  const totalStudents = students.length;
  const submittedStudents = students.filter((s) => s.HodVerified);

  const settingupSubjects = () => {
    if (!user?.className) return;
    const dualsubjecttype = DUAL_SUBJECT_TYPE[user.className] || [];
    const allsubjects = AllSubject[user.className] || [];
    const electivesubj = ElectiveSub[user.className] || [];

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
    allsubjects.forEach((sub) => {
      if (electiveFlat.includes(sub)) return;

      if (dualsubjecttype.includes(sub)) {
        addSubjectColumn(sub, "Theory");
        addSubjectColumn(sub, "Practical");
      } else {
        addSubjectColumn(sub, "single");
      }
    });

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

  const getData = async () => {
    if (!user?.className || !user?.division) return;
    try {
      setLoading(true);
      const Data = { className: user.className, division: user.division };
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/students/by-class`,
        Data,
        { withCredentials: true }
      );
      setStudents(res?.data?.data || []);
      settingupSubjects();
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.className && user?.division) getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.className, user?.division]);

  const updateVerificationStatus = async (studentId) => {
    try {
      setLoading(true);
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/v1/students/update/${studentId}`;

      const res = await axios.post(
        url,
        {},
        { withCredentials: true }
      );
      console.log(res.data);
      if (res.status === 200) {
        Toaster(res.data.message, "success");
        await getData();
      } else if (res.status === 400) {
        Toaster("All subjects are not marked as Completed", "error");
      }else if(res.status === 401){
        Toaster("No submissions found for this student","error")
      }
    } catch (error) {
      console.log(error.response?.data);

      let message = "Something went wrong";

      const data = error.response?.data;

      if (typeof data === "string") {
        // try to extract `Error: ...<br`
        const match = data.match(/Error:\s*(.*?)<br/);
        if (match && match[1]) {
          message = match[1]; // "No submissions found for this student"
        }
      } else if (data?.message) {
        // if your backend ever returns JSON
        message = data.message;
      }

      console.log("Final message:", message);
      Toaster(message, "error");
    } finally {
      setLoading(false);
      setConfirming(null);
    }
  };

  const openConfirm = (student) => {
    setselectedStudent(student);
    setConfirming(true);
  };

  const findSubmission = (student, subject, subType) => {
    if (!student.submission || !Array.isArray(student.submission)) return null;
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
    const isEnrolled = student.subjects.includes(subject);
    if (!isEnrolled) {
      return <span title="Not enrolled">✗</span>;
    }

    const submission = findSubmission(student, subject, subType);
    if (!submission)
      return (
        <span
          title="Submission not found"
          className="border py-1 px-2 rounded-full bg-yellow-200"
        >
          Pending
        </span>
      );

    if (submission.status && submission.status.toLowerCase() === "completed") {
      return (
        <span
          title="Completed"
          className="border py-1 px-2 rounded-full bg-green-200"
        >
          Done
        </span>
      );
    }

    return (
      <span title={submission.status || "Pending"}>
        ⏳ {submission.status || "Pending"}
      </span>
    );
  };

  const getStatusText = (student, subject, subType) => {
    const isEnrolled = student.subjects?.includes(subject);
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
    if (/[",\n]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const filteredStudents = React.useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = !q
      ? [...students]
      : students.filter((s) => {
          const name = (s.name || "").toLowerCase();
          const roll = (s.rollNo || "").toLowerCase();
          return name.includes(q) || roll.includes(q);
        });

    list.sort((a, b) => {
      const an = (a.name || "").toLowerCase();
      const bn = (b.name || "").toLowerCase();
      if (an && bn && an !== bn) return an.localeCompare(bn);

      const ar = (a.rollNo || "").toString().toLowerCase();
      const br = (b.rollNo || "").toString().toLowerCase();
      return ar.localeCompare(br);
    });

    return list;
  }, [students, query]);

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

  const handleDownloadCsv = () => {
    const header = [
      "Student Name",
      "Roll No",
      ...columnName.map((c) => c.label),
      "Final Verification",
      "Verfication Time",
      "HOD Verification",
    ];

    const rows = filteredStudents.map((student) => {
      const subjectStatuses = columnName.map((col) => {
        const { subject, subjectType } = getSubjectAndType(col);
        return getStatusText(student, subject, subjectType);
      });

      const finalText = student.finalVerification ? "Done" : "Pending";

      // 🔥 Make verification time human-readable
      const rawTime =
        student.finalVerification?.verifiedTime ||
        student.finalVerification?.verifiedAt;
      let verificationTimeText = "";
      if (rawTime) {
        const d = new Date(rawTime);
        if (!isNaN(d.getTime())) {
          verificationTimeText = d.toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
        }
      }

      const hodText = student.HodVerified ? "Done" : "Pending";

      return [
        student.name || "",
        student.rollNo || "",
        ...subjectStatuses,
        finalText,
        verificationTimeText,
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

    const link = document.createElement("a");
    const fileClass = user?.className || "Class";
    const fileDiv = user?.division || "Div";
    link.href = url;
    link.download = `CC_${fileClass}_${fileDiv}_students.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="w-screen min-h-screen bg-slate-50">
        <div className="w-full mx-auto space-y-6 px-[5vw] py-8">
          {/* Summary Cards */}
          <div className="flex flex-wrap justify-between gap-4">
            {/* Class card */}
            <div className="w-full sm:w-1/3 lg:w-1/6 bg-white p-4 rounded-2xl shadow-sm">
              <div className="text-sm text-slate-500">Class</div>
              <div className="mt-2 font-semibold text-slate-800">
                {user?.className} - {user?.division}
              </div>
            </div>

            {/* Total students */}
            <div className="w-full sm:w-1/3 lg:w-1/6 bg-white p-4 rounded-2xl shadow-sm">
              <div className="text-sm text-slate-500">Total Students</div>
              <div className="mt-2 text-xl font-semibold text-slate-800">
                {totalStudents}
              </div>
            </div>

            {/* Subjects count */}
            <div className="w-full sm:w-1/3 lg:w-1/6 bg-white p-4 rounded-2xl shadow-sm">
              <div className="text-sm text-slate-500">Subjects</div>
              <div className="mt-2 text-xl font-semibold text-slate-800">
                {columnName.length}
              </div>
            </div>

            {/* Submitted */}
            <div className="w-full sm:w-1/3 lg:w-1/6 bg-white p-4 rounded-2xl shadow-sm">
              <div className="text-sm text-slate-500">Submitted</div>
              <div className="mt-2 text-xl font-semibold text-slate-800">
                {submittedStudents.length}
              </div>
              <div className="mt-2">
                <span className="inline-flex items-center gap-2 bg-emerald-600/10 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                  <FiCheck className="w-4 h-4 text-emerald-700" />
                  On track
                </span>
              </div>
            </div>

            {/* Pending */}
            <div className="w-full sm:w-1/3 lg:w-1/6 bg-white p-4 rounded-2xl shadow-sm">
              <div className="text-sm text-slate-500">Pending</div>
              <div className="mt-2 text-xl font-semibold text-slate-800">
                {students.length - submittedStudents.length}
              </div>
            </div>
          </div>

          {/* Progress & Search */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-slate-700">
                Overall Progress
              </div>
              <div className="text-xs text-slate-400">
                {submittedStudents.length} of {totalStudents} students submitted
              </div>
            </div>

            <div className="w-full bg-slate-100 h-3 rounded-full">
              <div
                className="h-3 bg-blue-600 rounded-full"
                style={{
                  width: `${
                    students.length
                      ? Math.round(
                          (submittedStudents.length / students.length) * 100
                        )
                      : 0
                  }%`,
                }}
              />
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
                  className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-400 text-sm placeholder:text-slate-400"
                />
              </div>

              <button
                onClick={handleDownloadCsv}
                className="inline-flex items-center gap-2 rounded-lg bg-[#2563eb] px-4 py-2 text-sm text-white shadow-sm hover:opacity-95"
              >
                <IoCloudDownloadOutline className="w-5 h-5" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4">
              <div className="text-xs text-slate-400">
                Showing Students : {filteredStudents.length}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] table-auto">
                <thead>
                  <tr className="text-xs text-slate-500 bg-white text-center">
                    <th className="py-4 px-6 text-nowrap text-center">
                      Students Name
                    </th>
                    <th className="py-4 px-6 text-nowrap text-center">
                      Roll No
                    </th>
                    {columnName.map((col) => (
                      <th
                        key={col.key}
                        className="py-4 px-6 text-nowrap text-center"
                      >
                        {col.label}
                      </th>
                    ))}
                    <th className="py-4 px-6 text-nowrap text-center">
                      Final Verification
                    </th>
                    <th className="py-4 px-6 text-nowrap text-center">
                      HOD Verification
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents?.map((row, index) => (
                    <tr
                      key={row._id || row.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-[#f6fbff]"}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="font-medium text-slate-800 text-center">
                            {row.name}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">{row.rollNo || "-"}</td>

                      {columnName?.map((status, idx) => {
                        const { subject, subjectType } =
                          getSubjectAndType(status);
                        return (
                          <td
                            key={idx}
                            className="py-4 px-6 whitespace-nowrap text-center"
                          >
                            {renderStatusCell(row, subject, subjectType)}
                          </td>
                        );
                      })}

                      <td className="py-4 pr-4 text-center">
                        <button
                          type="button"
                          className="inline-flex items-center justify-center h-6 w-6 rounded border border-slate-300 bg-white hover:bg-slate-50"
                          title={
                            row.finalVerification
                              ? "Already verified"
                              : "Verify"
                          }
                          onClick={() => !row.finalVerification && openConfirm(row)}
                        >
                          {row.finalVerification ? (
                            <FiCheck className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <div className="w-3 h-3 rounded bg-transparent" />
                          )}
                        </button>
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

                  <tr>
                    <td
                      className="py-8 px-6 text-center text-slate-400"
                      colSpan={5}
                    >
                      {loading ? "Loading..." : "No students found."}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-center text-xs text-slate-400 py-6">
            Terms • Privacy
          </div>
        </div>
      </div>

      {confirming && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => !loading && setConfirming(null)}
          />
          <div className="relative z-10 w-full max-w-md mx-4">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Confirm Verification
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                Mark {selectedStudent.name} ({selectedStudent.rollNo}) as
                submitted for{" "}
                <span className="font-medium">
                  Class Coordination Verification
                </span>
                ?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirming(null)}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => updateVerificationStatus(selectedStudent._id)}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-[#2563eb] text-white text-sm shadow-sm disabled:opacity-60 inline-flex items-center gap-2"
                >
                  {loading ? (
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeOpacity="0.25"
                        fill="none"
                      />
                      <path
                        d="M22 12a10 10 0 00-10-10"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : (
                    <FiCheck className="w-4 h-4" />
                  )}
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CCPage;

/* ---------- Pill component (UI only) ---------- */
function Pill({ status, children }) {
  if (status === "done") {
    return (
      <span className="inline-flex items-center gap-2 bg-emerald-600/10 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
        <FiCheck className="w-4 h-4 text-emerald-700" />
        {children}
      </span>
    );
  }

  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-2 bg-amber-400/10 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
        <FiClock className="w-3 h-3 text-amber-700" aria-hidden="true" />
        {children}
      </span>
    );
  }

  return (
    <span
      title="Not assigned for this student"
      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-500"
      aria-hidden="true"
    >
      <FiX className="w-4 h-4" />
    </span>
  );
}
