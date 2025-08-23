import express, { Router } from "express";
import dotenv from "dotenv";
import { sequelize } from "./config/database.js";
import { router as authRouter } from "./routes/auth.route.js";
import { router as profileRouter } from "./routes/profile.route.js";
import { router as attendanceRouter } from "./routes/attendance.route.js";
import { router as adminRouter } from "./routes/admin.route.js";
import cors from 'cors';
import path from "path";
import { connectRabbit } from "./services/rabbit.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routing
const baseApi = Router();
baseApi.use("/auth", authRouter);
baseApi.use("/profile", profileRouter);
baseApi.use("/attendance", attendanceRouter);
baseApi.use("/admin", adminRouter);

app.use("/api/v1", baseApi);

// Server
const PORT = process.env.PORT || 3000;
sequelize.sync().then(async () => {
  await connectRabbit();
  app.listen(PORT, () => console.log(`Server running in: http://localhost:${PORT}`));
});
