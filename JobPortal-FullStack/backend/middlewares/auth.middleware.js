import { catchAsyncErrors } from "./catchAsync.middleware.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "./error.middleware.js";
import { User } from "../models/user.model.js";

export const verifyJWT =catchAsyncErrors(async(req,res,next)=>{
    try {
        const {token}=req.cookies;
        if(!token){
            return next(new ErrorHandler("Unauthorized request",400));
        }
        //  ab hume token mil chuka h toh jwt s use decode karana h nad verify
        const decodedToken=jwt.verify(token,process.env.JWT_SECRET_KEY);
        const user=await User.findById(decodedToken.id);
        if(!user){
            console.error("User not found for decoded token:", decodedToken);
        return next(new ErrorHandler("Invalid or expired token", 401));

        }
        req.user=user;
        next();
    } catch (error) {
        console.error("Error in token verification:", error);
    next(new ErrorHandler("Unauthorized request", 401));
        
    }
})