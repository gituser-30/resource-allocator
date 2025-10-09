import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    department: { type: String, required: true },
    semester: { type: String, required: true },
    subject: { type: String, required: true },
    fileUrl: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Assignment", assignmentSchema);
