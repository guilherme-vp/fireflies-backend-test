import express from "express";
import { meetingRoutes } from "./modules/meetings";
import { taskRoutes } from "./modules/tasks";
import { dashboardRoutes } from "./modules/dashboards";
import { authMiddleware } from "./middlewares";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
	res.json({ message: "Welcome to the MeetingBot API" });
});

app.use("/api/meetings", authMiddleware, meetingRoutes);
app.use("/api/tasks", authMiddleware, taskRoutes);
app.use("/api/dashboard", authMiddleware, dashboardRoutes);

await import("./database/mongo.database");

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
