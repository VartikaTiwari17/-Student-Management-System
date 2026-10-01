import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    course: { type: String, required: true, trim: true },
    year: { type: Number, required: true, min: 1, max: 4 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// Ek user ke andar same email dobara nahi
studentSchema.index({ createdBy: 1, email: 1 }, { unique: true });

export default mongoose.model("Student", studentSchema);