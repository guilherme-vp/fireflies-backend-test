import mongoose, { type Document, Schema } from "mongoose";

export interface IMeeting {
	_id: string;
	userId: string;
	title: string;
	date: Date;
	participants: string[];
	transcript: string;
	summary: string;
	actionItems: string[];
}

const meetingSchema = new Schema<IMeeting & Document>({
	userId: String,
	title: String,
	date: Date,
	participants: [String],
	transcript: String,
	summary: String,
	actionItems: [String],
});

export const Meeting = mongoose.model<IMeeting>("Meeting", meetingSchema);
