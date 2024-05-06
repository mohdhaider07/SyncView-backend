// create funtion that will get the data from main funtion and save it to the database
// }
import Job from "../models/jobModel";
import { website1, website2 } from "../config/script";

//
export async function saveData() {
	const data1 = await website1().catch((err) => {
		console.error(err.stack || err);
		process.exit(1);
	});
	const data2 = await website2().catch((err) => {
		console.error(err.stack || err);
		process.exit(1);
	});
	const newData = [...data1, ...data2];
	const jobs = await Job.find();
	const jobTitles = jobs.map((job) => job.role);
	const newDataFiltered = newData.filter(
		(job) => !jobTitles.includes(job.role)
	);
	console.log(newDataFiltered);
	await Job.insertMany([...newDataFiltered]);

	console.log("Data saved successfully");
}
