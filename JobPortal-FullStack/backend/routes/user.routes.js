import { Router } from "express";
import { registerUser,loginUser, logoutUser,getUser, updateUserDetails, updatePassword } from "../controllers/userController.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";

const router=Router();
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get( verifyJWT,logoutUser);
router.route("/me").get(verifyJWT,getUser);
router.put("/update/profile",verifyJWT,updateUserDetails)
router.put("/update/password",verifyJWT,updatePassword)
export default router