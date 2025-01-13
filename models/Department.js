import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  name: String,
});

const Department = mongoose.model("Department", departmentSchema);
export default Department;
