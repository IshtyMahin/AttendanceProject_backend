import express from "express";
import Course from "../models/Course.js";
import Session from "../models/Session.js";
import mongoose from "mongoose";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const course = new Course(req.body);
    const savedCourse = await course.save();
    res.status(201).json(savedCourse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { year, departmentId, semesterNumber } = req.query;

    console.log("Received Params:", { year, departmentId, semesterNumber });

    if (!year || !departmentId || !semesterNumber) {
      return res
        .status(400)
        .json({ error: "Missing required query parameters" });
    }

    const semesterNum = parseInt(semesterNumber, 10);
    if (isNaN(semesterNum)) {
      return res.status(400).json({ error: "Invalid semester number" });
    }

    const session = await Session.findById(year).populate("semesters.courses", "name code department");

    // console.log("Session Found:", session);

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    const semester = session.semesters.find(
      (sem) => Number(sem.semesterNumber) === semesterNum
    );

    // console.log("Semester Found:", semester);

    if (!semester || !Array.isArray(semester.courses)) {
      return res.status(404).json({ error: "Semester or courses not found" });
    }
    console.log(semester.courses);
    
    res.status(200).json(semester.courses);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

const courseRoutes = router;
export default courseRoutes;
