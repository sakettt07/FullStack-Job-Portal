import {User} from "../models/user.model.js";
import {catchAsyncErrors} from "../middlewares/catchAsync.middleware.js";
import ErrorHandler, { errorMiddleware } from "../middlewares/error.middleware.js";
import {v2 as cloudinary} from "cloudinary";
import {sendToken} from "../utils/JwtToken.js"

const registerUser=catchAsyncErrors(async(req,res,next)=>{
    // TODO:
    // getting all the data from the body
    // validate the data and check for the empty fields
    // Potential check for the existing user if present then return it.
    // Upload the document resume on the cloudinary then save its url into the database.
    // generate the cookiee
    try {
        const {name,email,phone,address,password,role,firstNiche,secondNiche,thirdNiche,coverLetter}=req.body;
        if ([name, email, password ,phone,address,role].some((field) => field?.trim() === "")
          ) {
            return next(new ErrorHandler("All fields are required",400));
          }
        if(role==="Job Seeker" &&(!firstNiche ||!secondNiche ||!thirdNiche)){
            return next(
                new ErrorHandler("Please provide your preffered job niches",400)
            );
        } 
        // check for the existing user done
        const existingUser=await User.findOne({email,phone});
        if(existingUser){
            return next(new ErrorHandler("Email is alrerady registered. || Phone number already exist",400));
        }

        // uploading the data into the DB
        const UserData={
            name,email,phone,address,password,role,niches:{
                firstNiche,secondNiche,thirdNiche,
            },
            coverLetter,
        };

        // upload doc on cloudinary

        if(req.files && req.files.resume){
            const {resume}=req.files;
            if(resume){
                try {
                    const cloudinaryResponse=await cloudinary.uploader.upload(
                        resume.tempFilePath,
                        {folder:"JobPortal"}
                    );
                    if(!cloudinaryResponse || cloudinaryResponse.error){
                        return next(new ErrorHandler("Failed to upload resume",500));
                    }

                    UserData.resume={
                        public_id:cloudinaryResponse.public_id,
                        url:cloudinaryResponse.secure_url,
                    }
                } catch (error) {
                    return next(new ErrorHandler("Failed to upload resume",500))
                }
            }
        }
        const user=await User.create(UserData);
        sendToken(user,201,res,"user Registered");
    } catch (error) {
        next(error);
        
    }
})

const loginUser=catchAsyncErrors(async(req,res,next)=>{
    
})
export {registerUser};