import mongoose from "mongoose";

beforeAll(async () => {
	const mongoUrl = process.env.MONGO_URL;
	if (!mongoUrl) {
		console.warn("No MONGO_URL env to connect");
		return;
	}
	await mongoose.connect(mongoUrl);
});

afterEach(async () => {
	const collections = mongoose.connection.collections;
	for (const key in collections) {
		const collection = collections[key];
		await collection.deleteMany();
	}
});

afterAll(async () => {
	await mongoose.connection.dropDatabase();
	await mongoose.connection.close();
});
