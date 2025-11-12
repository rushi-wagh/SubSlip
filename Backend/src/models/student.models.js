import mongoose from "mongoose";
const { Schema, model } = mongoose;

const studentSchema = new Schema(
  {
    name: { type: String, required: true },
    rollNo: { type: String, required: true,unique:true },
    className: { type: String, required: true },
    division: { type: String, required: true },
    batch: { type: String, required: true },
    subjects: [{ type: String, required: true }],
    finalVerification : {type: mongoose.Schema.Types.ObjectId, ref: 'Verification' },
    hodVerified: { type: Boolean, default: false }, 
    submission :[{ type: mongoose.Schema.Types.ObjectId, ref: 'Submission'}]
  },
  { timestamps: true }
);

const Student = model("Student", studentSchema);

export default Student;