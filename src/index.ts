// setup express server
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";

import testRoutes from "./routes/testRoutes";

dotenv.config();
const app = express();
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
// database connection
// connectDB();
// routes
app.use("/test", testRoutes);
// listern
const port = process.env.PORT;

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
