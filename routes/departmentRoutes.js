import express from "express";
import Department from "../models/department.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const department = new Department(req.body);
  await department.save();
  res.json(department);
});

router.get("/", async (_, res) => {
  const departments = await Department.find();
  res.json(departments);
});

const departmentRoutes = router
export default departmentRoutes; 
