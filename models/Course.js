import mongoose, { model, Schema } from "mongoose";

const CourseSchema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

CourseSchema.index(
  { session: 1, department: 1, code: 1, name: 1 },
  { unique: true }
);

const Course = model("Course", CourseSchema);
export default Course;
