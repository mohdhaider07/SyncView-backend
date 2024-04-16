// test routes
import { Router } from "express";
import { testRequest } from "../controllers/test/testRequest";
const router = Router();

router.get("/", testRequest);

export default router;
