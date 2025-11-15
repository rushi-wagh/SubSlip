import React from "react";

const arrayRoute = {
  HOD: "/HOD_Dashboard",
  Teacher: "/SubjectFacultyDashboard",
  ClassCoordinator: "/SubjectFacultyDashboard",
};
export const roleRoute = (role) => arrayRoute[role] || "/login";

export const Division = {
  SY: ["A", "B", "C", "D"],
  TY: ["A", "B", "C"],
  BTECH: ["A", "B"],
};

export const DUAL_SUBJECT_TYPE = {
  // SY: ["DECA", "DS", "UHV", "ECE", "CED", "PPE", "MED", "AED", "EED"],
  SY: ["DECA", "DS", "UHV"],
  // TY: ["DBMS", "DAA", "CN", "ECE", "CED", "PPE", "MED", "AED", "EED"],
  TY: ["DBMS", "DAA", "CN"],
  BTECH: [],
};
export const ElectiveSub = {
  SY: [
    [
      "EFSM",
      "PECSR",
      "ITS",
      "EI",
      "BPL",
      "COI",
      "ECE",
      "CED",
      "PPE",
      "MED",
      "AED",
      "EED",
    ],
  ],
  TY: [
    [
      "DIP",
      "DWV",
      "WN",
      "AIIME",
      "PWMCE",
      "RRT",
      "G1",
      "AIE",
      "AATPM",
      "ECE",
      "CED",
      "PPE",
      "MED",
      "AED",
      "EED",
    ],
  ],
  BTECH: [[
    "SR",
    "IOT",
    "DA",
    "CV",
    "EC",
    "DF"
  ]],
};

export const AllSubject = {
  SY: [
    "DECA",
    "DS",
    "UHV",
    "ECE",
    "CED",
    "PPE",
    "MED",
    "AED",
    "EED",
    "EFSM",
    "PECSR",
    "ITS",
    "EI",
    "BPL",
    "COI",
    "DMLA",
    "EEM",
    "TGS",
  ],
  TY: [
    "DBMS",
    "DAA",
    "CN",
    "ECE",
    "CED",
    "PPE",
    "MED",
    "AED",
    "EED",
    "DIP",
    "DWV",
    "WN",
    "AIIME",
    "PWMCE",
    "RRT",
    "G1",
    "AIE",
    "AATPM",
    "TGS",
  ],
  BTECH: [
    "SR",
    "IOT",
    "DA",
    "CV",
    "EC",
    "DF",
    "BA",
    "CP",
    "TGS"
  ],
};


export const MDM = ["MED","PPE","EED","CED","AED","ECE"];