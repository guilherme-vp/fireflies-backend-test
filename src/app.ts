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

app.use(authMiddleware);
app.use("/api/meetings", meetingRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(moduleExceptionsMiddleware);
app.use(unhandledExceptionsMiddleware);

export default app;
