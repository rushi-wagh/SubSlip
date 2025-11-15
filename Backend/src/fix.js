import mongoose from "mongoose";
import Student from "./models/student.models.js";
import Verification from "./models/verification.models.js";



mongoose.connect("mongodb+srv://mrinspiremind_db_user:GQlaJSajNUVwRu3V@cluster0.f5fbj0w.mongodb.net/Slip")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("Connection error:", err));;

async function fix() {
  const students = await Student.find({
    $or: [
      { finalVerification: { $exists: false } },
      { finalVerification: null }
    ]
  });

  console.log(`Found ${students.length} students missing verification`);

  for (const s of students) {
    const v = await Verification.create({
      studentId: s._id,
      coordinatorId: null,
      verificationStatus: "Pending"
    });

    await Student.findByIdAndUpdate(s._id, {
      finalVerification: v._id
    });
  }

  console.log("Verification added to missing students.");
  process.exit();
}

fix();
