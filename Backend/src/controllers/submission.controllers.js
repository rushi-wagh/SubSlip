import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import Student from "../models/student.models.js";
import Teacher from "../models/teacher.models.js";
import Submission from "../models/submission.models.js";
import {autoVerifyIfCompleted} from "../controllers/students.controllers.js"

// get all student for submission display

export const getAllStudentsForSubmission = asyncHandler(async (req, res) => {
  const user = req.user; // logged-in teacher (from JWT middleware)

  // 1️⃣ Fetch teacher’s allocation details
  const allocations = await Teacher.find({ teacherId: user._id });
  if (!allocations || allocations.length === 0) {
    throw new ApiError(404, "No students found for the teacher's allocations.");
  }

  // 2️⃣ Prepare array to hold students for all subjects (optional multi-subject support)
  let studentList = [];

  // 3️⃣ Loop through allocations (in case teacher has multiple subjects)
  for (const alloc of allocations) {
    const filter = {
      className: alloc.className,
      division: alloc.division,
    };

    // 🔹 If practical subject → filter by batch
    if (alloc.subjectType === "Practical" && alloc.batch) {
      filter.batch = alloc.batch;
    }

    // 🔹 Fetch students of that subject
    const students = await Student.find(filter)
      .select("name rollNo className division batch subjects")
      .lean();

    // Optionally filter students actually enrolled in this subject
    const subjectStudents = students.filter((s) =>
      s.subjects.includes(alloc.subject)
    );

    // Add to combined list
    studentList.push({
      subject: alloc.subject,
      subjectType: alloc.subjectType,
      className: alloc.className,
      division: alloc.division,
      batch: alloc.batch || "All",
      students: subjectStudents,
    });
  }
  const teacher = user.name;
  const totalSubjects = allocations.length;
  const assignedClasses = studentList;
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { teacher, totalSubjects, assignedClasses },
        "Students fetched successfully"
      )
    );
});

export const postSubmission = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const MDM = ["ECE", "CED", "PPE", "MED", "AED", "EED"];
  const student = await Student.findById(studentId);
  if (!student) throw new ApiError(404, "Student not found");

  const studentSubjects = student.subjects;
  const { subject, subjectType, className, division, batch, status } = req.body;
  console.log(req.body, "hello");
  const user = req.user;

  if (!subject || !studentSubjects.includes(subject)) {
    throw new ApiError(400, "Invalid or missing subject for this student");
  }

  // ✅ MDM SUBJECTS: create 2 submissions (Theory + Practical)
  if (MDM.includes(subject)) {
    const baseData = {
      studentId,
      subject,
      className: student.className,
      division: student.division,
      batch: student.batch,
      teacherId: user._id,
      status,
      markedAt: new Date(),
    };

    // Create THEORY submission
    const submissionTheory = await Submission.create({
      ...baseData,
      subjectType: "Theory",
    });

    // Create PRACTICAL submission
    const submissionPractical = await Submission.create({
      ...baseData,
      subjectType: "Practical",
    });

    console.log(
      "MDM created:",
      submissionTheory.subjectType,
      submissionPractical.subjectType
    );

    await Student.findByIdAndUpdate(studentId, {
      $addToSet: {
        submission: { $each: [submissionTheory._id, submissionPractical._id] },
      },
    });
    // await autoVerifyIfCompleted(studentId)

    return res.status(201).json(
      new ApiResponse(
        201,
        {
          submissionTheory,
          submissionPractical,
        },
        "MDM submission created successfully"
      )
    );
  }

  // 🔹 TGS SUBJECT (unchanged)
  if (subject === "TGS") {
    const submission = await Submission.create({
      studentId,
      subject,
      subjectType: "Theory",
      className: student.className,
      division: student.division,
      batch: student.batch,
      teacherId: user._id,
      status,
      markedAt: new Date(),
    });

    await Student.findByIdAndUpdate(studentId, {
      $addToSet: { submission: submission._id },
    });
    await autoVerifyIfCompleted(studentId)

    return res
      .status(201)
      .json(new ApiResponse(201, submission, "TGS submission created successfully"));
  }

  // 🔹 NORMAL SUBJECT FLOW (unchanged)
  const teacher = await Teacher.findOne({
    teacherId: user._id,
    subject,
    subjectType,
    className,
    division,
    ...(subjectType === "Practical" ? { batch } : {}),
  });

  if (!teacher) {
    throw new ApiError(
      401,
      "Teacher not authorized for this subject/class/division/batch."
    );
  }

  const submission = await Submission.create({
    studentId,
    subject,
    subjectType,
    className,
    division,
    batch,
    teacherId: user._id,
    status,
    markedAt: new Date(),
  });
  console.log(submission);

  await Student.findByIdAndUpdate(studentId, {
    $addToSet: { submission: submission._id },
  });
  await autoVerifyIfCompleted(studentId)

  return res
    .status(201)
    .json(new ApiResponse(201, submission, "Submission created successfully"));
});



export const getAllStudents = asyncHandler(async(req,res) => {
  const{ className, division, batch} = req.body;
  const students = await Student.find().select("name rollNo className division batch subjects submission").lean().populate("submission");
  return res
    .status(200)
    .json(new ApiResponse(200, students, "Students fetched successfully"));
})