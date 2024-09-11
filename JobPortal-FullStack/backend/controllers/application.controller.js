import { catchAsyncErrors } from "../middlewares/catchAsync.middleware.js";
import ErrorHandler, { errorMiddleware } from "../middlewares/error.middleware.js";
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import {v2 as cloudinary} from "cloudinary";


// when the user registered into an application then the application is posted.
const postApplication=catchAsyncErrors(async(req,res,next)=>{
    // TODO: Job seeekr will post a application when applied
    // so we need the id of the job he has selected.
    // then all his details about the job

   try {
    const {id}=req.params;
    const {name,email,phone,address,coverletter}=req.body;
    if(!name || !email ||!phone || !address || !coverletter){
        return next(new ErrorHandler("All fields are required",400))
    }

    const jobseekerInfo={
        id:req.user._id,name,email,phone,address,coverletter,role:"Job Seeker"
    };

    const jobDetails=await Job.findById(id);
    if(!jobDetails){
        return next(new ErrorHandler("job not found",404));
    }

    // handling the files at the time of thre application

    if(req.files && req.files.resume){
        // if user has sent the resume them
        const {resume}=req.files;
        try {
            const cloudinaryResponse = await cloudinary.uploader.upload(
                resume.tempFilePath,
                { folder: "JobPortal" }
              );
              if (!cloudinaryResponse || cloudinaryResponse.error) {
                return next(new ErrorHandler("Failed to upload resume", 500));
              }
              jobseekerInfo.resume={
                public_id:cloudinaryResponse.public_id,
                url:cloudinaryResponse.url
              }
        } catch (error) {
            
        }
    }
   } catch (error) {
    next(error);
   }
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