import Student from "../models/student.models.js";
import mongoose from "mongoose"
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import Submission from "../models/submission.models.js";
import Verification from "../models/verified.models.js";
import Teacher from "../models/teacher.models.js";

export const postStudents = asyncHandler(async (req, res) => {
  const { name, rollNo, className, division, subjects, batch } = req.body;
  if (!name || !rollNo || !className || !division || !subjects || !batch) {
    throw new ApiError(400, "All fields are required");
  }

  if (req.user.role !== "ClassCoordinator") {
    throw new ApiError(403, "Only Class Coordinator can create student");
  }

  if (!name || !rollNo || !className || !division || !subjects) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const student = await Student.findOne({
    rollNo,
  });
  if (student) {
    throw new ApiError(400, "Student already exists with this roll no");
  }
  const newStudent = await  Student.create({
    name,
    rollNo,
    className,
    division,
    subjects,
    batch,
  });
  if (!newStudent) {
    throw new ApiError(500, "Unable to create student");
  }

  const verifiedDb = await Verification.create({
    studentId: newStudent._id,
    coordinatorId: null,
    verificationStatus: "Pending",
  });
  newStudent.finalVerification = verifiedDb._id;
  await newStudent.save({ validateBeforeSave: false });
  return res
    .status(201)
    .json(new ApiResponse(201, newStudent, "Student created successfully"));
});

export const getStudents = asyncHandler(async (req, res) => {
  const students = await Student.find().populate('submission');

  if (!students) {
    throw new ApiError(404, "No students found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, students, "Students fetched successfully"));
});

//get students by class and division

export const getStudentsByClass = asyncHandler(async (req, res) => {
  const user = req.user;
  console.log("In class controller")

  // const allowedRoles = ["ClassCoordinator","HOD"]
  // if (!allowedRoles.includes(userRole)) {
  //   throw new ApiError(400, "Only Class Coordinator and HOD can view students by class and division");
  // }
  // if (userRole !== "ClassCoordinator") {
  //   throw new ApiError(
  //     400,
  //     "Only Class Coordinator can view students by class and division"
  //   );
  // }
  console.log(req.body)
  const { className, division,subject} = req.body;
  if (!className || !division) {
    throw new ApiError(400, "Class and Division are required");
  }
  // const students = await Student.find({ className, division ,subjects: { $elemMatch: { name: subject }}}).populate("finalVerification").populate("submission").select("name rollNo className division batch subjects finalVerification submission HodVerified");

  const students = await Student.find({ className, division}).populate("finalVerification").populate("submission").select("name rollNo className division batch subjects finalVerification submission HodVerified");
  

  if (!students) {
    throw new ApiError(404, "No students found");
  }
  for (const student of students) {
  await autoVerifyIfCompleted(student._id,user._id);
}

  return res
    .status(200)
    .json(new ApiResponse(200, students, "Students fetched successfully"));
});
//get students by batch
export const getStudentsByBatch = asyncHandler(async (req, res) => {
  const userRole = req.user.role;


  const { className, division, batch } = req.body;
  if (!className || !division) {
    throw new ApiError(400, "Class and Division are required");
  }
  const students = await Student.find({ className, division,batch }).populate("finalVerification").populate("submission").select("name rollNo className division batch subjects finalVerification submission HodVerified");


    // if(userRole !== 'ClassCoordinator'){
    //     throw new ApiError(400,"Only Class Coordinator can view students by class and division"  )
    // }
    

  if (!students) {
    throw new ApiError(404, "No students found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, students, "Students fetched successfully"));
});
const MDM_SUBJECTS = ["ECE", "CED", "PPE", "MED", "AED", "EED"];
// update verificationStatus
export const updateVerificationStatus = asyncHandler(async (req, res) => {
  const userRole = req.user.role;

  if (userRole !== "ClassCoordinator") {
    throw new ApiError(
      400,
      "Only Class Coordinator can update verification status"
    );
  }

  const { studentId } = req.params;

  if (!studentId) {
    throw new ApiError(400, "Student Id is required");
  }

  const coordinator = req.user;

  const student = await Student.findById(studentId);

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  if (
    coordinator.className !== student.className ||
    coordinator.division !== student.division
  ) {
    throw new ApiError(
      403,
      "You are not authorized to update verification status for this student"
    );
  }

  const submissions = await Submission.find({ studentId });
  if (submissions.length === 0) {
    throw new ApiError(401, "No submissions found for this student");
  }

  console.log("Number of submissions:", submissions.length);
  console.log("Number of subjects:", student.subjects.length);

  // 🔹 subjects which are dual (need Theory + Practical)
  const MDM = ["ECE", "CED", "PPE", "MED", "AED", "EED"];
  const pendingSubjects = [];

  for (const subject of student.subjects) {
    const required = MDM.includes(subject) ? 2 : 1;

    // all submissions for this subject
    const subjectSubs = submissions.filter((s) => s.subject === subject);

    // ❌ no submission at all
    if (subjectSubs.length === 0) {
      if (required === 1) {
        pendingSubjects.push(subject);
      } else {
        pendingSubjects.push(`${subject} (Theory)`);
        pendingSubjects.push(`${subject} (Practical)`);
      }
      continue;
    }

    // ✅ single-type subject (only one record needed)
    if (required === 1) {
      const isDone = subjectSubs.some((s) => s.status === "Completed");
      if (!isDone) {
        pendingSubjects.push(subject);
      }
      continue;
    }

    // ✅ dual (MDM) subject: Theory + Practical both must be Completed
    const theoryDone = subjectSubs.some(
      (s) =>
        (s.subjectType?.toLowerCase() === "theory" ||
          s.subjectType?.toLowerCase() === "th") &&
        s.status === "Completed"
    );

    const practicalDone = subjectSubs.some(
      (s) =>
        (s.subjectType?.toLowerCase() === "practical" ||
          s.subjectType?.toLowerCase() === "pr") &&
        s.status === "Completed"
    );

    if (!theoryDone) pendingSubjects.push(`${subject} (Theory)`);
    if (!practicalDone) pendingSubjects.push(`${subject} (Practical)`);
  }

  console.log("Pending subjects:", pendingSubjects);

  if (pendingSubjects.length > 0) {
    throw new ApiError(
      400,
      `All subjects are not marked as Completed. Pending: ${pendingSubjects.join(
        ", "
      )}`
    );
  }

  // ✅ if we reach here, EVERYTHING is done
  const verification = await Verification.create({
    studentId: student._id,
    coordinatorId: coordinator._id,
    verificationStatus: "Verified",
    verifiedAt: Date.now(),
  });

  if (!verification) {
    throw new ApiError(500, "Error while creating verification record");
  }

  student.finalVerification = verification._id;
  student.HodVerified = true;
  await student.save({ validateBeforeSave: false });

  const studentData = await Student.findById(studentId).populate(
    "finalVerification"
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        studentData,
        "Verification status updated successfully"
      )
    );
});



// 🔁 Auto-verify student if ALL required submissions are Completed
export const autoVerifyIfCompleted = async (studentId,coordinatorId) => {
  const student = await Student.findById(studentId);
  if (!student) return;

  // already verified? then skip
  if (student.HodVerified) return;

  const submissions = await Submission.find({ studentId });

  if (!submissions.length) return;

  // 1️⃣ If ANY submission is not Completed → don't verify
  const anyNotCompleted = submissions.some(
    (s) => s.status !== "Completed"
  );
  if (anyNotCompleted) return;

  // 2️⃣ Count completed submissions per subject
  const completedCountBySubject = {};
  for (const sub of submissions) {
    if (sub.status !== "Completed") continue;
    completedCountBySubject[sub.subject] =
      (completedCountBySubject[sub.subject] || 0) + 1;
  }

  // 3️⃣ Check required counts:
  //    - Normal subject: 1 Completed submission
  //    - MDM subject   : 2 Completed submissions (Theory + Practical)
  for (const subj of student.subjects) {
    const required = MDM_SUBJECTS.includes(subj) ? 2 : 1;
    const got = completedCountBySubject[subj] || 0;
    if (got < required) {
      // some subject not fully done → can't verify yet
      console.log('not completed')
      return;
    }
  }

  // 4️⃣ All good → create verification & update student
  const verification = await Verification.create({
    studentId: student._id,
    coordinatorId: coordinatorId, // or some system/auto user id if you want
    verificationStatus: "Verified",
    verifiedAt: Date.now(),
  });

  student.finalVerification = verification._id;
  student.HodVerified = true;
  await student.save({ validateBeforeSave: false });

  console.log(`Auto-verified student ${student._id}`);
  console.log(student)
};


export const getVerifiedStudents = asyncHandler(async (req, res) => {
  const verifiedRecords = await Verification.find({
    verificationStatus: "Verified",
  }).populate("studentId");
  const istTime = verifiedRecords.createdAt.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  });

  if (!verifiedRecords || verifiedRecords.length === 0) {
    throw new ApiError(404, "No verified students found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        verifiedRecords,
        "Verified students fetched successfully"
      )
    );
});


export const getStudentsBySubjectAndBatch = asyncHandler(async (req, res) => {
  const user = req.user; 
  const { subject, subjectType } = req.body;
  console.log(req.body,"req.body")
  // 1️⃣ Validate input
  if (!subject || !subjectType) {
    throw new ApiError(400, "Subject and Subject Type are required");
  }
  
  // 2️⃣ Find teacher's allocation
  const allocation = await Teacher.findOne({
    teacherId: user._id,
    subject,
    subjectType
  });
  console.log(allocation,"allocation");

  if (!allocation) {
    throw new ApiError(404, "No allocation found for this teacher");
  }

  // 3️⃣ Build student query filter
  const filter = {
    className: allocation.className,
    division: allocation.division,
    subjects: { $in: [subject] },  // FIXED: Best practice for array match
  };

  // 4️⃣ If Practical → batch must match both teacher & student
  if (subjectType === "Practical") {
    if (!allocation.batch) {
      throw new ApiError(400, "Practical subjects require teacher batch allocation");
    }
    filter.batch = allocation.batch;
  }

  // 5️⃣ Fetch students
  const students = await Student.find(filter)
    .populate("finalVerification")
    .populate("submission")
    .select("name rollNo className division batch subjects finalVerification submission");

  if (students.length === 0) {
    throw new ApiError(404, "No students found for this subject & type");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, students, "Students fetched successfully"));
});

export const getStudentsBySubjectAndDivision = asyncHandler(async (req, res) => {
  const user = req.user; 
  const { subject, subjectType,className,division } = req.body;
  console.log(req.body,"req.body")
  // 1️⃣ Validate input
  if (!subject || !subjectType) {
    throw new ApiError(400, "Subject and Subject Type are required");
  }
  
  // 2️⃣ Find teacher's allocation
  const allocation = await Teacher.findOne({
    teacherId: user._id,
    subject,
    subjectType,
    className,
    division
  });
  console.log(allocation,"allocation");

  if (!allocation) {
    throw new ApiError(404, "No allocation found for this teacher");
  }

  // 3️⃣ Build student query filter
  const filter = {
    className: allocation.className,
    division: allocation.division,
    subjects: { $in: [subject] },  // FIXED: Best practice for array match
  };

  // 4️⃣ If Practical → batch must match both teacher & student
  if (subjectType === "Practical") {
    if (!allocation.batch) {
      throw new ApiError(400, "Practical subjects require teacher batch allocation");
    }
    filter.batch = allocation.batch;
  }

  // 5️⃣ Fetch students
  const students = await Student.find(filter)
    .populate("finalVerification")
    .populate("submission")
    .select("name rollNo className division batch subjects finalVerification submission");

  if (students.length === 0) {
    throw new ApiError(404, "No students found for this subject & type");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, students, "Students fetched successfully"));
});