import { Router } from "express";
import { isAuthorized, verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteApplication, EmployerGetApplications, JobSeekerGetApplications, postApplication } from "../controllers/application.controller.js";
const router=Router();

router.route("/postapplication/:id").post(verifyJWT,isAuthorized("Job Seeker"),postApplication);
router.route("/employer/getapplication").get(verifyJWT,isAuthorized("Employer"),EmployerGetApplications);
router.route("/jobseeker/getapplication").get(verifyJWT,isAuthorized("Job Seeker"),JobSeekerGetApplications);
router.route("deleteapplication").get(verifyJWT,deleteApplication);

export default router;