// get all the jobs from db
import { Request, Response } from "express";
import Job from "../../models/jobModel";
export const getJobs = async (req: Request, res: Response) => {
	console.log(req.query.location);
	const disability: string | undefined = req.query.disability as
		| string
		| undefined;

	const location: string | undefined = req.query.location as
		| string
		| undefined;
	try {
		let filter = {};
		if (disability) {
			filter = {
				disabilityTypes: { $regex: new RegExp(`\\b${disability}\\b`, "i") }, // Match whole word, case-insensitive
			};
		}

		if (location) {
			filter = {
				...filter,
				location: { $regex: new RegExp(`\\b${location}\\b`, "i") }, // Match whole word, case-insensitive
			};
		}

		const jobs = await Job.find(filter);
		console.log(jobs.length);
		res.json(jobs);
	} catch (err) {
		console.log(err);
		res.status(500).send("Internal server error");
	}
};
