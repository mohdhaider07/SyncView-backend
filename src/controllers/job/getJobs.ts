// get all the jobs from db
import { Request, Response } from "express";
import Job from "../../models/jobModel";
export const getJobs = async (req: Request, res: Response) => {
	console.log("getting the jobs");
	console.log(req.query.location);
	const disability: string | undefined = req.query.disability as
		| string
		| undefined;

	const location: string | undefined = req.query.location as
		| string
		| undefined;

	// city and company
	// get all the jobs from the db
	const city: string | undefined = req.query.city as string | undefined;
	const company: string | undefined = req.query.company as string | undefined;

	try {
		let filter = {};
		if (disability) {
			filter = {
				disabilityTypes: {
					$regex: new RegExp(`\\b${disability || "Pwd"}\\b`, "i"),
				}, // Match whole word, case-insensitive
			};
		}

		if (location && location == "Remote") {
			filter = {
				...filter,
				location: {
					$regex: new RegExp(`\\b${location || "India"}\\b`, "i"),
				}, // Match whole word, case-insensitive
			};
		}

		if (city) {
			filter = {
				...filter,
				location: {
					$regex: new RegExp(`\\b${city || "India"}\\b`, "i"),
				}, // Match whole word, case-insensitive
			};
		}

		if (company) {
			filter = {
				...filter,
				company: {
					$regex: new RegExp(`\\b${company || "India"}\\b`, "i"),
				}, // Match whole word, case-insensitive
			};
		}

		const jobs = await Job.find(filter).limit(10);
		console.log(jobs.length);
		// from the jobs get all the unique locations, and company names
		const locations = jobs.map((job) => job.location);
		const companies = jobs.map((job) => job.company);

		// Filter out duplicates manually
		const uniqueLocations: string[] = [];
		const uniqueCompanies: string[] = [];

		locations.forEach((location) => {
			if (
				typeof location === "string" &&
				!uniqueLocations.includes(location)
			) {
				uniqueLocations.push(location);
			}
		});

		companies.forEach((company) => {
			if (
				typeof company === "string" &&
				!uniqueCompanies.includes(company)
			) {
				uniqueCompanies.push(company);
			}
		});

		res.json({
			jobs: jobs,
			locations: uniqueLocations,
			companies: uniqueCompanies,
		});
	} catch (err) {
		console.log(err);
		res.status(500).send("Internal server error");
	}
};
