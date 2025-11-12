import axios from "axios";
import { useEffect } from "react";

const SidebarFilter = ({ subjects, setsubjects, selectedsubject, setselectedsubject }) => {
  useEffect(() => {
    const GetData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/teachers/get-subject-teacher`,
          { withCredentials: true }
        );
        setsubjects(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    GetData();
  }, [setsubjects]);

  return (
    <aside className="hidden md:flex md:flex-col w-80 lg:w-96 bg-transparent">
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-800 mb-3">
          Select Subject Filter
        </h3>

        <div className="space-y-3">
          {subjects.map((s) => {
            const isSelected =
              selectedsubject && String(selectedsubject.id) === String(s.id);
            return (
              <label
                key={s.id}
                onClick={() => setselectedsubject(s)}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer ${
                  isSelected
                    ? "border-[#2b7df7] bg-[#f1f8ff]"
                    : "border-slate-100 bg-white"
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
                    {s.subject} ({s.subjectType})
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {s.className} - {s.division}
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
