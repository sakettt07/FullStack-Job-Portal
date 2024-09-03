import { Router } from "express";
import { postJob } from "../controllers/job.controller.js";
import { isAuthorized, verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();
router.route("/postjob").post(verifyJWT, isAuthorized("Employer"), postJob);
export default router;