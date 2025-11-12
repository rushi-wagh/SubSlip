import mongoose from "mongoose";
const { Schema, model } = mongoose;

const submissionSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    subject: { type: String, required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
    status: { type: String, enum: ["Completed", "Not Completed"], default: "Not Completed" },
    markedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Submission = model("Submission", submissionSchema);
export default Submission;