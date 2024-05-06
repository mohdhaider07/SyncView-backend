import mongoose, { InferSchemaType } from "mongoose";

const Schema = mongoose.Schema;

const jobSchema = new Schema(
	{
		// role,
		// company,
		// location,
		// applyLink: link,
		// disabilityTypes,
		// description: descriptionHtml,
		role: {
			type: String,
			required: true,
		},
		company: {
			type: String,
			required: true,
		},
		location: {
			type: String,
		},
		applyLink: {
			type: String,
			required: true,
		},
		disabilityTypes: {
			type: String,
		},
		description: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

export type JobType = InferSchemaType<typeof jobSchema> & { _id: string };

export default mongoose.model("Job", jobSchema);
