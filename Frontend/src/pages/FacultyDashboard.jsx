import React, { useEffect, useState } from "react";
import SidebarFilter from "../components/SidebarFilter";
import SubmissionPanel from "../components/SubmissionPanel";
import { useAuth } from "../context/AuthContext";
const FacultyDashbaord = () => {
  const [subjects, setsubjects] = useState([]);
  const [selectedsubject, setselectedsubject] = useState(null);
  const { user } = useAuth();
  return (
    <>
      <div className="px-[5vw]">
        <p
          className="w-fit px-[1.4vw] py-[0.5vw] rounded-xl border border-blue-300/80 
                bg-white/60 backdrop-blur-sm shadow-md text-blue-700 font-medium"
        >
          <span className="font-semibold text-blue-800">Faculty Name:</span>{" "}
          {user.name || "Unknown"}
        </p>
      </div>

      <div className="w-screen relative overflow-x-hidden h-screen flex px-[5vw] gap-[1vw] pt-[2vw]">
        <SidebarFilter
          subjects={subjects}
          setsubjects={setsubjects}
          selectedsubject={selectedsubject}
          setselectedsubject={setselectedsubject}
        />
        <SubmissionPanel
          subjects={subjects}
          setsubjects={setsubjects}
          selectedsubject={selectedsubject}
          setselectedsubject={setselectedsubject}
        />
      </div>
    </>
  );
};

export default FacultyDashbaord;
