import mongoose, { model, Schema } from "mongoose";

const CourseSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
});

const Course = model("Course", CourseSchema);
export default Course;
