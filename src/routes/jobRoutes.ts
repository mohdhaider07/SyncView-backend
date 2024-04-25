// test routes
import { Router } from "express";
import { getJobs } from "../controllers/job/getJobs";
const router = Router();

router.get("/", getJobs);

export default router;
