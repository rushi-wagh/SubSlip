import mongoose from "mongoose";
const { Schema, model } = mongoose;

const verificationSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    coordinatorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    verificationStatus: { type: String, enum: ["Pending", "Verified", "Rejected"], default: "Pending" },
   
    verifiedAt: { type: Date,default: null },
    verifiedTime :{type: Date, default: Date.now}
  },
  { timestamps: true }
);

const Verification = model("Verification", verificationSchema);
export default Verification;