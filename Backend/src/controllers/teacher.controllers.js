import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import User from "../models/users.models.js";
import Teacher from "../models/teacher.models.js";

// for frontend display all teachers
export const getTeachers = asyncHandler(async (req, res) => {
  const userRole = req.user.role;
  console.log(userRole);

  if (userRole !== "ClassCoordinator" && userRole !== "HOD") {
    throw new ApiError(403, "Access denied");
  }

  const teachers = await await User.find({ role: "Teacher" });

  if (!teachers || teachers.length === 0) {
    throw new ApiError(404, "No teachers found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, teachers, "Teachers fetched successfully"));
});

export const allocateTeacher = asyncHandler(async (req, res) => {
  const userRole = req.user.role;

  if (userRole !== "ClassCoordinator") {
    throw new ApiError(403, "Access denied");
  }
  const coordinator = req.user;
  const { teacherId } = req.params;

  const { subject, className, division, subjectType, batch } = req.body;

  console.log(req.body);

  if (!subject || !className || !division || !subjectType || !batch) {
    throw new ApiError(400, "All fields are required");
  }

  if (
    coordinator.className !== className ||
    coordinator.division !== division
  ) {
    throw new ApiError(
      401,
      "You can only allocate teachers to your own class and division"
    );
  }

  const allocation = await Teacher.create({
    teacherId,
    subject,
    className,
    division,
    subjectType,
    batch,
  });

  if (!allocation) {
    throw new ApiError(500, "Failed to allocate teacher");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, allocation, "Teacher allocated successfully"));
});

//all teachers allocated to particular class and division

export const teacherForClass = asyncHandler(async (req, res) => {
  const userRole = req.user.role;

  if (userRole !== "ClassCoordinator" && userRole !== "HOD") {
    throw new ApiError(403, "Access denied");
  }
  const teachers = await Teacher.find({
    className: req.user.className,
    division: req.user.division,
  });
  if (!teachers) {
    throw new ApiError(400, "No teacher found for class");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, teachers, "All teachers fetched Succesfully"));
});

export const teacherForSubjects = asyncHandler(async(req,res) => {
  const user = req.user;
  // Fetch all allocations for the logged-in teacher
  const allocations = await Teacher.find({ teacherId: user._id }).lean(); 
  return res.status(200).json(new ApiResponse(200, allocations, "Allocations fetched successfully"));
})
