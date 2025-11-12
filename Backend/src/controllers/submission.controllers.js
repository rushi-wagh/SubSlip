import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import Student from "../models/student.models.js";
import Teacher from "../models/teacher.models.js";
import Submission from "../models/submission.models.js";

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
  const user = req.user;
  const { subject, subjectType, className, division, batch, status } = req.body;
  const teacher = await Teacher.findOne({
    teacherId: user._id,
  });
  if (!teacher) {
    throw new ApiError(
      401,
      "Teacher not authorized for this subject/class/division/batch."
    );
  }
  if (
    teacher.subject !== subject ||
    teacher.className !== className ||
    teacher.division !== division ||
    (teacher.subjectType === "Practical" && teacher.batch !== batch)
  ) {
    throw new ApiError(
      401,
      "Teacher not authorized for this subject/class/division/batch."
    );
  }
  const submission = await Submission.findOneAndUpdate(
    { studentId, subject }, // filter condition
    {
      subjectType,
      className,
      division,
      batch,
      teacherId: user._id,
      status,
      markedAt: new Date(),
    },
    { new: true, upsert: true } // new = return updated doc, upsert = create if missing
  );
  return res
    .status(201)
    .json(new ApiResponse(201, submission, "Submission created successfully"));
});
