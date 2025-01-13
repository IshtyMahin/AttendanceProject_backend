import express from "express";
import mongoose from "mongoose";
import Session from "../models/Session.js";
import Course from "../models/Course.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { department, year } = req.body;

    // console.log(department, year);

    const defaultSemesters = Array.from({ length: 8 }, (_, i) => ({
      semesterNumber: i + 1,
      courses: [],
    }));

    const session = new Session({
      department,
      year,
      semesters: defaultSemesters,
    });
    console.log(session);

    const savedSession = await session.save();

    res.status(201).json(savedSession);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

router.put(
  "/:sessionId/semesters/:semesterNumber/courses",
  async (req, res) => {
    try {
      const { sessionId, semesterNumber } = req.params;
      const { name, code, department } = req.body;

      let course = await Course.findOne({ code: code });

      if (!course) {
        course = new Course({
          name,
          code,
          department,
        });

        await course.save();
      }

      const session = await Session.findById(sessionId);
      if (!session) return res.status(404).json({ error: "Session not found" });

      const semester = session.semesters.find(
        (sem) => sem.semesterNumber === parseInt(semesterNumber)
      );

      if (!semester)
        return res.status(404).json({ error: "Semester not found" });

      if (!semester.courses.includes(course._id)) {
        semester.courses.push(course._id);
        await session.save();
        return res
          .status(200)
          .json({ message: "Course added successfully", session });
      } else {
        return res
          .status(400)
          .json({ error: "Course already exists in this semester" });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.get("/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ error: "Session not found" });
    res.status(200).json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { departmentId } = req.query;
    // console.log("Department ID:", departmentId);

    if (!departmentId) {
      return res.status(400).json({ error: "Department ID is required" });
    }

    const sessions = await Session.find({ department: departmentId })
      .populate("year department semesters.courses")
      .exec();

    if (sessions.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(sessions);
  } catch (err) {
    console.error("Error fetching sessions:", err);
    res.status(500).json({ error: err.message });
  }
});

const sessionRoutes = router;
export default sessionRoutes;
