import express from "express";

export const urlEncodedMiddleware = express.urlencoded({
	limit: "1mb",
	extended: true,
});
