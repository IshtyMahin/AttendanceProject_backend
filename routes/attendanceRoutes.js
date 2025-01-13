import Attendance from "../models/Attendance.js";
import express from "express";
import Session from "../models/Session.js";
import Student from "../models/Student.js";
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    // console.log(req.body);

    if (Array.isArray(req.body)) {
      const savedAttendances = await Promise.all(
        req.body.map(async (attendanceData) => {
          const attendance = new Attendance(attendanceData);
          return await attendance.save();
        })
      );

      res.status(201).json(savedAttendances);
    } else {
      res.status(400).json({
        error:
          "Invalid request format, expected an array of attendance records.",
      });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find()
      .populate("student", "studentId name")
      .populate("course", "name code");
    res.status(200).json(attendanceRecords);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/student/:id", async (req, res) => {
  try {
    const studentId = req.params.id;

    const attendanceRecords = await Attendance.find({
      student: studentId,
    }).populate("course");
    const attendanceSummary = attendanceRecords.reduce((summary, record) => {
      const course = record.course.name;
      if (!summary[course]) summary[course] = { total: 0, present: 0 };
      summary[course].total++;
      if (record.status === "Present") summary[course].present++;
      return summary;
    }, {});

    const details = Object.entries(attendanceSummary).map(
      ([course, { total, present }]) => ({
        course,
        totalClasses: total,
        attendedClasses: present,
        percentage: ((present / total) * 100).toFixed(2),
      })
    );

    const overallAverage = (
      details.reduce((sum, item) => sum + parseFloat(item.percentage), 0) /
      details.length
    ).toFixed(2);

    res.json({ studentId, details, overallAverage });
  } catch (err) {
    res.status(404).json({ error: "No attendance records found" });
  }
});

router.get("/all-students", async (req, res) => {
  try {
    const { departmentId, sessionId, semesterNumber } = req.query;
    // console.log(departmentId, semesterNumber, sessionId);

    const session = await Session.findOne({
      _id: sessionId,
      department: departmentId,
    }).populate("semesters.courses");

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    const semester = session.semesters.find(
      (sem) => sem.semesterNumber === parseInt(semesterNumber)
    );

    if (!semester) {
      return res.status(404).json({ error: "Semester not found" });
    }

    const students = await Student.find({
      department: departmentId,
      session: sessionId,
    });

    const result = [];

    for (let student of students) {
      const attendanceRecords = await Attendance.find({
        student: student._id,
        course: { $in: semester.courses },
      }).populate("course");

      const attendanceSummary = attendanceRecords.reduce((summary, record) => {
        const course = record.course.name;
        if (!summary[course]) summary[course] = { total: 0, present: 0 };
        summary[course].total++;
        if (record.status === "Present") summary[course].present++;
        return summary;
      }, {});

      const details = Object.entries(attendanceSummary).map(
        ([course, { total, present }]) => ({
          course,
          totalClasses: total,
          attendedClasses: present,
          percentage: ((present / total) * 100).toFixed(2),
        })
      );

      const overallAverage = (
        details.reduce((sum, item) => sum + parseFloat(item.percentage), 0) /
        details.length
      ).toFixed(2);

      result.push({
        studentId: student.studentId,
        details,
        overallAverage,
      });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const attendanceRoutes = router;
export default attendanceRoutes;
