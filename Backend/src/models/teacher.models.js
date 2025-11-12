import mongoose from "mongoose";
const { Schema, model } = mongoose;

const teacherSchema = new Schema(
  {
    teacherId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true },
    className: { type: String, required: true },
    division: { type: String, required: true },
    subjectType: { type: String, enum: ["Theory", "Practical"], required: true },
    batch :{type:String, required: true},
    semester: { type: String },
    academicYear: { type: String },
  },
  { timestamps: true }
);

const Teacher = model("Teacher", teacherSchema);
export default Teacher;