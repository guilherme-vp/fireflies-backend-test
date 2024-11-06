import mongoose, { type Document, Schema } from "mongoose";

export interface ITask {
	_id: string;
	meetingId: mongoose.Types.ObjectId;
	userId: string;
	title: string;
	description: string;
	status: "pending" | "in-progress" | "completed";
	dueDate: Date;
}

const taskSchema = new Schema<ITask & Document>({
	meetingId: { type: Schema.Types.ObjectId, ref: "Meeting", required: true },
	userId: { type: String, required: true },
	title: { type: String, required: true },
	description: { type: String, required: true },
	status: {
		type: String,
		enum: ["pending", "in-progress", "completed"],
		default: "pending",
	},
	dueDate: Date,
});

taskSchema.index({ meetingId: 1 });
taskSchema.index({ userId: 1 });
taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ dueDate: 1 });

export const Task = mongoose.model<ITask>("Task", taskSchema);
