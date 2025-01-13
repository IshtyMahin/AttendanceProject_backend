import express from "express";
import Student from "../models/Student.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const student = new Student(req.body);
    const savedStudent = await student.save();
    res.status(201).json(savedStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { sessionId, departmentId } = req.query;
   
    const students = await Student.find({
      session: sessionId,
      department: departmentId,
    }).sort('studentId');
    
    res.status(200).json(students);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const studentRoutes = router;
export default studentRoutes;
