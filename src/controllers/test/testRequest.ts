import { Request, Response } from "express";

export const testRequest = async (req: Request, res: Response) => {
	res.send("Test route");
};
