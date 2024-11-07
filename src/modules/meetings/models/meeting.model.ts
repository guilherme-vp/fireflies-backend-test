import mongoose, { type Document, Schema } from "mongoose";
import type { ITask } from "../../tasks";

export interface IMeeting {
	_id: string;
	userId: string;
	title: string;
	date: Date;
	participants: string[];
	transcript: string;
	summary?: string;
	actionItems?: string[];
	tasks: ITask[];
}

const meetingSchema = new Schema<IMeeting & Document>({
	userId: { type: String, required: true },
	title: { type: String, required: true },
	date: { type: Date, required: true },
	participants: { type: [String], required: true },
	transcript: { type: String, default: "" },
	summary: String,
	actionItems: { type: [String], default: [] },
});

meetingSchema.index({ userId: 1 });
meetingSchema.index({ userId: 1, date: -1 });
meetingSchema.index({ date: 1 });
meetingSchema.index({ title: 1 });

export const Meeting = mongoose.model<IMeeting>("Meeting", meetingSchema);
