import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import departmentRoutes from "./routes/departmentRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";

dotenv.config();

const app = express();

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("DATABASE_URL is not defined in the environment variables");
  process.exit(1);
}

mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/departments", departmentRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
