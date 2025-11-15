import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import User from "../models/users.models.js";
import Teacher from "../models/teacher.models.js";
import mongoose from "mongoose";

// for frontend display all teachers
export const getTeachers = asyncHandler(async (req, res) => {
  const userRole = req.user.role;
  console.log(userRole);

  if (userRole !== "ClassCoordinator" && userRole !== "HOD") {
    throw new ApiError(403, "Access denied");
  }

  const teachers = await User.find({ role: "Teacher" });

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

  const { subject, className, division, subjectType,batch } = req.body;

  // console.log(req.body);

  if (!subject || !className || !division || !subjectType) {
    throw new ApiError(400, "All fields are required");
  }
  if (subjectType === "Practical" && !req.body.batch) {
    throw new ApiError(400, "Batch is required for practical subjects");
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

export const teacherForSubjects = asyncHandler(async (req, res) => {
  try {
    const user = req.user;
    // quick guard
    if (!user) {
      console.log("teacherForSubjects: req.user is falsy");
      return res
        .status(401)
        .json(new ApiResponse(401, null, "Unauthorized: no user"));
    }

    console.log("teacherForSubjects: req.user =", user);

    // prefer _id, fall back to id
    const rawId = user._id ?? user.id ?? user;
    if (!rawId) {
      console.log("teacherForSubjects: no id available on user");
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Bad request: missing user id"));
    }

    // Try to query using ObjectId if valid, otherwise try string match.
    let allocations = [];
    if (mongoose.Types.ObjectId.isValid(rawId)) {
      const oid = new mongoose.Types.ObjectId(rawId);
      console.log("teacherForSubjects: querying Teacher with ObjectId", oid);
      allocations = await Teacher.find({ teacherId: oid }).lean();
    }

    // If no result, try querying with string (some records may store teacherId as string)
    if (!allocations || allocations.length === 0) {
      console.log(
        "teacherForSubjects: no docs with ObjectId, trying string query:",
        String(rawId)
      );
      allocations = await Teacher.find({ teacherId: String(rawId) }).lean();
    }

    console.log(
      "teacherForSubjects: allocations found:",
      allocations?.length ?? 0
    );

    // optional: if still empty, try a broader search to help debug (uncomment if needed)
    // const any = await Teacher.find({}).limit(5).select("teacherId subject className division").lean();
    // console.log("teacherForSubjects: sample docs from collection:", any);

    return res.status(200).json(
      new ApiResponse(
        200,
        [
          ...allocations,
          {
            subject: "TGS",
            subjectType: "Theory", // TGS has no type, but setting something prevents bugs
            className: "ANY",
            division: "ANY",
            batch: null,
            teacherId: rawId,
          
          },
        ],
        "Allocations fetched successfully"
      )
    );
  } catch (err) {
    console.error("teacherForSubjects error:", err);
    return res.status(500).json(new ApiResponse(500, null, "Server error"));
  }
});