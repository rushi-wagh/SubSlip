import Student from "../models/student.models.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import Submission from "../models/submission.models.js";
import Verification from "../models/verified.models.js";

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
  const students = await Student.find();

  if (!students) {
    throw new ApiError(404, "No students found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, students, "Students fetched successfully"));
});

//get students by class and division

export const getStudentsByClass = asyncHandler(async (req, res) => {
  const userRole = req.user.role;

  if (userRole !== "ClassCoordinator") {
    throw new ApiError(
      400,
      "Only Class Coordinator can view students by class and division"
    );
  }
  const { className, division } = req.body;
  if (!className || !division) {
    throw new ApiError(400, "Class and Division are required");
  }
  const students = await Student.find({ className, division });

  if (!students) {
    throw new ApiError(404, "No students found");
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
  const students = await Student.find({ className, division, batch });

  if (!students) {
    throw new ApiError(404, "No students found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, students, "Students fetched successfully"));
});

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
    throw new ApiError(400, "No submissions found for this student");
  }
  const allSubjectsDone =
    submissions.length === student.subjects.length &&
    submissions.every((s) => s.status === "Completed");
  if (!allSubjectsDone) {
    throw new ApiError(400, "All subjects are not marked as Completed");
  }
  const verification = await Verification.create({
    studentId: student._id,
    coordinatorId: coordinator._id,
    verificationStatus: "Verified",
    verifiedAt
  });
  if (!verification) {
    throw new ApiError(500, "Error while creating verification record");
  }
  student.finalVerification = verification._id;
  student.hodVerified = true;
  await student.save({ validateBeforeSave: false });
  const studentData = await Student.findById({
    _id: studentId,
  }).populate("finalVerification");
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
