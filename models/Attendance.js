import mongoose, { model, Schema } from "mongoose";

const AttendanceSchema = new Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  date: { type: Date, required: true },
  status: { type: String, enum: ["Present", "Absent"], required: true },
},{
  timestamps:true
});

AttendanceSchema.index({ student: 1, course: 1, date: 1 }, { unique: true });


const Attendance = model("Attendance", AttendanceSchema);

export default Attendance;
