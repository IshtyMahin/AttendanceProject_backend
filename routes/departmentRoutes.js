import express from "express";
import Department from "../models/Department.js"; 

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const department = new Department(req.body);
    await department.save();
    res.json(department);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (_, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const departmentRoutes = router;
export default departmentRoutes;
