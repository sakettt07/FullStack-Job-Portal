import { User } from "../models/user.model.js";
import { catchAsyncErrors } from "../middlewares/catchAsync.middleware.js";
import ErrorHandler from "../middlewares/error.middleware.js";
import { v2 as cloudinary } from "cloudinary";
import { sendToken } from "../utils/jwtToken.js";
import {Job} from "../models/job.model.js";

const postJob=catchAsyncErrors(async(req,res,next)=>{
try {
    const {}=req.body;
} catch (error) {
    
}
})


export{postJob};