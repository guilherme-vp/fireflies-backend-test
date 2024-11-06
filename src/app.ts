import express from "express";
import { meetingRoutes } from "./modules/meetings";
import { taskRoutes } from "./modules/tasks";
import { dashboardRoutes } from "./modules/dashboards";
import {
	authMiddleware,
	loggerMiddleware,
	bodyParserMiddleware,
	limiterMiddleware,
	urlEncodedMiddleware,
	helmetMiddleware,
	compressionMiddleware,
	unhandledExceptionsMiddleware,
	moduleExceptionsMiddleware,
} from "./middlewares";

const app = express();

app.use(bodyParserMiddleware);
app.use(urlEncodedMiddleware);
app.use(compressionMiddleware);
app.use(helmetMiddleware);
app.use(loggerMiddleware);
app.use(limiterMiddleware);

app.get("/", (_req, res) => {
	res.json({ message: "Welcome to the MeetingBot API" });
});

app.use("/api/meetings", authMiddleware, meetingRoutes);
app.use("/api/tasks", authMiddleware, taskRoutes);
app.use("/api/dashboard", authMiddleware, dashboardRoutes);

app.use(moduleExceptionsMiddleware);
app.use(unhandledExceptionsMiddleware);

export default app;
