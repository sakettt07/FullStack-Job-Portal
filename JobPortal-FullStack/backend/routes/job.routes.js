import { Router } from "express";
import { postJob,getAllJobs,getMyJobs,deleteJob,getASingleJob } from "../controllers/job.controller.js";
import { isAuthorized, verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();
router.route("/postjob").post(verifyJWT, isAuthorized("Employer"), postJob);

router.get("/getall", getAllJobs);
router.get("/getmyjobs", verifyJWT, isAuthorized("Employer"), getMyJobs);
router.delete("/delete/:id", verifyJWT, isAuthorized("Employer"), deleteJob);
router.get("/get/:id", getASingleJob)





export default router;