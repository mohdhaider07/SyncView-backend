// get all the jobs from db
import { Request, Response } from "express";
import Job from "../../models/jobModel";
export const getJobs = async (req: Request, res: Response) => {
	console.log("get all jobs from db");
	try {
		const jobs = await Job.find();
		console.log(jobs);
		res.json(jobs);
	} catch (err) {
		console.log(err);
		res.status(500).send("Internal server error");
	}
};
