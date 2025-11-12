import React, { useEffect, useState } from "react";
import SidebarFilter from "../components/SidebarFilter";
import SubmissionPanel from "../components/SubmissionPanel";

const FacultyDashbaord = () => {
  const [subjects, setsubjects] = useState([])
  const [selectedsubject, setselectedsubject] = useState(null)
  return (
    <div className="w-screen relative overflow-x-hidden h-screen flex px-[5vw] gap-[1vw] pt-[2vw]">
      <SidebarFilter subjects={subjects} setsubjects={setsubjects} selectedsubject={selectedsubject} setselectedsubject={setselectedsubject}/>
      <SubmissionPanel subjects={subjects} setsubjects={setsubjects} selectedsubject={selectedsubject} setselectedsubject={setselectedsubject}/>
    </div>
  );
};

export default FacultyDashbaord;

