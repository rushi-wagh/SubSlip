import { FiCheck } from "react-icons/fi";
import { useEffect, useState } from "react";
import axios from "axios";
import { Toaster } from "../../Toaster";
import {MDM} from "../assets/roleRoute"

export default function SubmissionsPanel({ selectedsubject }) {
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState("");
  const [confirming, setConfirming] = useState(null); // { student, submission }
  const [loading, setLoading] = useState(false);
  const OE = [
    "EFSM",
    "PECSR",
    "ITS",
    "EI",
    "BPL",
    "COI",
    "AIIME",
    "AATPM",
    "PWMCE",
    "RRT",
    "G1",
    "AIE",
  ];
  
  const fetchStudents = async () => {
    try {
      const { className, division, batch, subjectType, subject } =
        selectedsubject;
        console.log(selectedsubject)
      let res;
      if (MDM.includes(subject)) {
        res = await axios.post(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/v1/students/get-class-subject`,
          {
            className , subject , subjectType , division
          },
          { withCredentials: true }
        );
        console.log(res.data);
      } else if (subject === "TGS") {
        res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/students/`,
          { withCredentials: true }
        );
        console.log(res.data);
      } else if (
        selectedsubject.className == "BTECH" &&
        selectedsubject.subjectType == "Theory"
      ) {
        console.log("first");
        console.log({ className, division, subjectType, subject });
        res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/students/get-subject`,
          { className, division, subjectType, subject },
          { withCredentials: true }
        );
        console.log(res.data);
      } else if (
        OE.includes(selectedsubject.subject)
      ) {
        console.log(`second`);
        res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/students/get-class-subject`,
          { className, division, subjectType, subject },
          { withCredentials: true }
        );
      } else if (subjectType === "Practical") {
        console.log("fourth");
        res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/students/by-batch`,
          { className, division, batch },
          { withCredentials: true }
        );
      } else {
        console.log("thrid");
        res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/students/by-class`,
          { className, division },
          { withCredentials: true }
        );
      }
      setStudents(res.data?.data || []);
    } catch (err) {
      console.error("fetch students error:", err.response.data);
      setStudents([]);
    }
  };
  // fetch students for selected subject (minimal)
  useEffect(() => {
    if (!selectedsubject) return;

    fetchStudents();
  }, [selectedsubject]);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? students.filter(
        (s) =>
          (s.rollNo && s.rollNo.toLowerCase().includes(q)) ||
          (s.name && s.name.toLowerCase().includes(q))
      )
    : students;

  // helper to find submission for current subject
  const getSubmissionFor = (student) => {
    if (student.name === "Arjun Uddhavrao Gadekar "){
    console.log(student)
    } 
    const sub =
      student.submission.find(
        (sub) => sub.subject === selectedsubject.subject && sub.subjectType === selectedsubject.subjectType
      ) || null;
    if (student.name === "Arjun Uddhavrao Gadekar "){
      console.log(sub);
    } 
    return sub;
  };

  // open confirm only if there is a submission for this subject and not already completed/verified
  const openConfirm = (student) => {
    const sub = getSubmissionFor(student);

    if (sub && sub.status === "Completed") return; // no-op if already verified/completed
    setConfirming({ student, submission: sub });
  };

  const confirm = async () => {
    if (!confirming) return;

    setLoading(true);
    try {
      const { className, division, batch, subject, subjectType } =
        selectedsubject;

      const Data = {
        className,
        division,
        batch,
        subject,
        subjectType,
        status: "Completed",
      };

      const endpoint = `${
        import.meta.env.VITE_BACKEND_URL
      }/api/v1/submissions/post/${confirming.student._id}`;

      const res = await axios.post(endpoint, Data, { withCredentials: true });

      if (res.status === 201 || res.status === 200) {
        Toaster(res.data.message, "success");
        fetchStudents();
        setConfirming(null);
      } else {
        Toaster(res.data.message || "Something went wrong", "error");
      }
    } catch (error) {
      console.log(error.response.data);
      Toaster("Server error", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex-1">
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
            {selectedsubject?.batch ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white shadow-sm text-sm font-medium text-slate-700">
                <span className="text-[#0f4fc1] font-semibold">
                  Batch {selectedsubject?.batch ?? ""}
                </span>
              </div>
            ) : (
              ""
            )}

            <div className="relative w-full max-w-xs">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="search"
                placeholder="Search by roll number or name"
                className="w-full rounded-lg border border-slate-200 py-3 pl-4 pr-4 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#bfdbfe]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left text-xs text-slate-500">
                  <th className="py-3 pl-1">Roll No</th>
                  <th className="py-3">Student Name</th>
                  <th className="py-3 text-center">Division</th>
                  <th className="py-3 text-center">Subject Name</th>
                  <th className="py-3 pr-4 text-center">Submission Status</th>
                  <th className="py-3 pr-6 text-center">Status</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-8 text-center text-sm text-slate-400"
                    >
                      No students found
                    </td>
                  </tr>
                ) : (
                  filtered.map((s, i) => {
                    const submission = getSubmissionFor(s);
                    const isSubmitted = Boolean(
                      submission && submission.status === "Completed"
                    );
                    const displayStatus = submission?.status || "Pending";

                    return (
                      <tr
                        key={s._id || s.rollNo || i}
                        className={` border-t border-slate-100`}
                      >
                        <td className="py-4 pl-1 text-sm text-slate-700 font-medium">
                          {s.rollNo}
                        </td>

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
                            <div className="text-sm text-slate-800">
                              {s.name}
                            </div>
                          </div>
                        </td>

                        <td className="py-4 text-sm text-slate-700 text-center">
                          {selectedsubject?.division ?? s.division}
                        </td>
                        <td className="py-4 text-sm text-slate-700 text-center">
                          {selectedsubject?.subject}
                        </td>

                        <td className="py-4 pr-4 text-center">
                          <button
                            type="button"
                            onClick={() => openConfirm(s)}
                            className="inline-flex items-center justify-center h-6 w-6 rounded border border-slate-300 bg-white hover:bg-slate-50"
                            title={isSubmitted ? "Already verified" : "Verify"}
                          >
                            {isSubmitted ? (
                              <FiCheck className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <div className="w-3 h-3 rounded bg-transparent" />
                            )}
                          </button>
                        </td>

                        <td className="py-4 text-center pr-6">
                          {isSubmitted ? (
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
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="text-center text-xs text-slate-400 mt-4">
            End of list
          </div>
        </div>
      </div>

      {confirming && (
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
                Mark {confirming.student.name} ({confirming.student.rollNo}) as
                submitted for{" "}
                <span className="font-medium">{selectedsubject?.subject}</span>?
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
                  onClick={confirm}
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
}
