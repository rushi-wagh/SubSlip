import React from "react";
import axios from "axios";
import { useEffect } from "react";
import { MDM } from "../assets/roleRoute";

const SidebarFilter = ({
  subjects = [],
  setsubjects = () => {},
  selectedsubject = null,
  setselectedsubject = () => {},
}) => {
  useEffect(() => {
    const GetData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/teachers/get-subject-teacher`,
          { withCredentials: true }
        );
        // only call setter if it's a function
        if (typeof setsubjects === "function") setsubjects(res.data?.data ?? []);
      } catch (error) {
        console.error(error);
      }
    };
    GetData();
  }, [setsubjects]);

  // helper to normalize id fields (_id or id)
  const selectedId = selectedsubject ? String(selectedsubject._id) : "";

  return (
    <aside className="hidden md:flex md:flex-col w-80 lg:w-96 bg-transparent">
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-800 mb-3">
          Select Subject Filter
        </h3>

        <div className="space-y-3">
          {(Array.isArray(subjects) ? subjects : []).map((s) => {
            const sId = String(s._id);
            const isSelected = selectedId !== "" && selectedId === sId;
            return (
              <label
                key={sId || Math.random()}
                onClick={() => typeof setselectedsubject === "function" && setselectedsubject(s)}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer ${
                  isSelected ? "border-[#2b7df7] bg-[#f1f8ff]" : "border-slate-100 bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="subject"
                  checked={isSelected}
                  readOnly
                  className="mt-1 h-4 w-4 text-blue-600"
                />
                <div>
                  <div className="text-sm font-medium text-slate-800">
                    {/* {s.subject} {s.subjectType ? `(${s.subjectType})` : ""} */}
                    {MDM.includes(s.subject) ? `${s.subject} (Theory + Practical)`: `${s.subject} (${s.subjectType})`}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {s.className ?? "—"} {s.division ? `- ${s.batch ? s.batch : s.division}` : ""}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default SidebarFilter;
