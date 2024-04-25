// setup express server
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";

// import testRoutes from "./routes/testRoutes";
import { saveData } from "./services/saveData";

import jobRoutes from "./routes/jobRoutes";

// import { main } from "./config/script";

dotenv.config();
const app = express();
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
connectDB().catch((err) => {
	console.error(err.stack || err);
	process.exit(1);
});
// saveData();
// app.use("/test", testRoutes);
app.use("/job", jobRoutes);

// listern
const PORT = process.env.PORT;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
