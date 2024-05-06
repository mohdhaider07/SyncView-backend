// setup mongoose connection
import mongoose from "mongoose";
//  connect it by creating funtion
const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URL!);
		console.log(`MongoDB connected`);
	} catch (error) {
		console.error(`Error: ${error}`);
		process.exit(1);
	}
};
export default connectDB;
