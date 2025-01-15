import mongoose, { model, Schema } from "mongoose";

const SemesterSchema = new Schema(
  {
    semesterNumber: { type: Number, required: true },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  },
  {
    timestamps: true,
  }
);

const SessionSchema = new Schema(
  {
    year: { type: String, required: true },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    semesters: [SemesterSchema],
  },
  {
    timestamps: true,
  }
);
SessionSchema.index({ year: 1, department: 1 }, { unique: true });

const Session = model("Session", SessionSchema);
export default Session;
