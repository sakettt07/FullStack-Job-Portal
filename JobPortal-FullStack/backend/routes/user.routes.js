import { Router } from "express";
import { registerUser,loginUser, logoutUser,getUser } from "../controllers/userController.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";

const router=Router();
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(verifyJWT,logoutUser);
router.route("/me").get(verifyJWT,getUser);
export default router