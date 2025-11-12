import { FiCheck } from "react-icons/fi";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SubmissionsPanel({ selectedsubject }) {
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState("");
  const [confirming, setConfirming] = useState(null);
  const [loading, setLoading] = useState(false);

  // fetch students for selected subject (minimal)
  useEffect(() => {
    if (!selectedsubject) return;
    const fetchStudents = async () => {
      try {
        const { className, division, batch } = selectedsubject;
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/students/by-batch`,
          { className, division, batch },
          { withCredentials: true }
        );
        setStudents(res.data?.data || []);
      } catch {
        setStudents([]);
      }
    };
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

  const openConfirm = (student) => {
    if (student.hodVerified) return; // no-op if already verified
    setConfirming(student);
  };

  const confirm = async () => {
    if (!confirming) return;
    setLoading(true);
    try {
      const {className, division, batch, subject, subjectType} = selectedsubject;
      const Data = {className, division, batch, subject, subjectType, status: "Completed"}
      // Try parent API; adapt endpoint/payload as needed
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/submissions/post/${confirming._id}`,
        Data,
        { withCredentials: true }
      );
      console.log(res.data)
      setStudents((prev) =>
        prev.map((st) => (st._id === confirming._id ? { ...st, hodVerified: true } : st))
      );
      setConfirming(null);
    } catch(error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex-1">
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white shadow-sm text-sm font-medium text-slate-700">
              <span className="text-[#0f4fc1] font-semibold">Batch {selectedsubject?.batch ?? ""}</span>
            </div>

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
                  <th className="py-3">Division</th>
                  <th className="py-3">Subject Name</th>
                  <th className="py-3 text-right pr-4">Select</th>
                  <th className="py-3 text-right pr-6">Status</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-sm text-slate-400">No students found</td>
                  </tr>
                ) : (
                  filtered.map((s, i) => (
                    <tr key={s._id || s.rollNo || i} className={`${i % 2 === 0 ? "bg-white" : "bg-[#f6fbff]"} border-t border-slate-100`}>
                      <td className="py-4 pl-1 text-sm text-slate-700 font-medium">{s.rollNo}</td>

                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                              <path d="M12 12a5 5 0 100-10 5 5 0 000 10zM2 22c0-3.3 4-6 10-6s10 2.7 10 6" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <div className="text-sm text-slate-800">{s.name}</div>
                        </div>
                      </td>

                      <td className="py-4 text-sm text-slate-700">{selectedsubject.batch}</td>
                      <td className="py-4 text-sm text-slate-700">{selectedsubject.subject}</td>

                      <td className="py-4 text-right pr-4">
                        <button
                          type="button"
                          onClick={() => openConfirm(s)}
                          className="inline-flex items-center justify-center h-6 w-6 rounded border border-slate-300 bg-white hover:bg-slate-50"
                          title={s.hodVerified ? "Already verified" : "Verify"}
                        >
                          {s.hodVerified ? <FiCheck className="w-4 h-4 text-emerald-600" /> : <div className="w-3 h-3 rounded bg-transparent" />}
                        </button>
                      </td>

                      <td className="py-4 text-right pr-6">
                        {s.hodVerified ? (
                          <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium"><FiCheck className="w-4 h-4" /> Submitted</span>
                        ) : (
                          <span className="inline-flex items-center gap-2 bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-sm">Pending</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="text-center text-xs text-slate-400 mt-4">End of list</div>
        </div>
      </div>

      {confirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => !loading && setConfirming(null)} />
          <div className="relative z-10 w-full max-w-md mx-4">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Confirm Verification</h3>
              <p className="text-sm text-slate-600 mb-4">Mark {confirming.name} ({confirming.rollNo}) as submitted?</p>

              <div className="flex justify-end gap-3">
                <button onClick={() => setConfirming(null)} disabled={loading} className="px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50">Cancel</button>
                <button onClick={confirm} disabled={loading} className="px-4 py-2 rounded-lg bg-[#2563eb] text-white text-sm shadow-sm disabled:opacity-60 inline-flex items-center gap-2">
                  {loading ? <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" fill="none"/><path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg> : <FiCheck className="w-4 h-4" />}
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
