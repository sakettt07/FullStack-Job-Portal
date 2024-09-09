import { catchAsyncErrors } from "../middlewares/catchAsync.middleware.js";
import ErrorHandler from "../middlewares/error.middleware.js";
import { Application } from "../models/application.model.js";


// when the user registered into an application then the application is posted.
const postApplication=catchAsyncErrors(async(req,res,next)=>{

})

// to get all the applications which he have applied in .
const JobSeekerGetApplications=catchAsyncErrors(async(req,res,next)=>{

})

// anyone can delete the appplication.
const deleteApplication=catchAsyncErrors(async(req,res,next)=>{

})
// 
const EmployergetApplications=catchAsyncErrors(async(req,res,next)=>{

})
export {postApplication,deleteApplication,EmployergetApplications,JobSeekerGetApplications};