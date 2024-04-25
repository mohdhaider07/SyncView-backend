// create funtion that will get the data from main funtion and save it to the database
// }
import jobModel from "../models/jobModel";
import { website1 } from "../config/script";

//
export async function saveData() {
	const data = await website1().catch((err) => {
		console.error(err.stack || err);
		process.exit(1);
	});
	// save the data into jobModel
	// this data is array of objects
	await jobModel.insertMany(data);

	console.log("Data saved successfully");
}
