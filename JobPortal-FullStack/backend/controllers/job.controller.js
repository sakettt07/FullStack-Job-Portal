import { User } from "../models/user.model.js";
import { catchAsyncErrors } from "../middlewares/catchAsync.middleware.js";
import ErrorHandler from "../middlewares/error.middleware.js";
import { v2 as cloudinary } from "cloudinary";
import { sendToken } from "../utils/jwtToken.js";
import { Job } from "../models/job.model.js";

const postJob = catchAsyncErrors(async (req, res, next) => {
  try {
    const {
      title,
      jobType,
      location,
      companyName,
      introduction,
      qualifications,
      responsibilities,
      offers,
      salary,
      personalWebsiteUrl,
      personalWebsiteTitle,
      hiringMultipleCandidates,
      jobNiche,
    } = req.body;
    if (
      !title ||
      !jobType ||
      !location ||
      !companyName ||
      !introduction ||
      !qualifications ||
      !responsibilities ||
      !offers ||
      !salary ||
      !personalWebsite ||
      !hiringMultipleCandidates ||
      !newsLettersSent ||
      !jobNiche
    ) {
      return next(
        new ErrorHandler("Please enter all the neceessary details", 400)
      );
    }

    if (
      (personalWebsiteTitle && !personalWebsiteUrl) ||
      (!personalWebsiteTitle && personalWebsiteUrl)
    ) {
      return next(
        new ErrorHandler(
          "Please provide with both personal title and the website url",
          400
        )
      );
    }

    const postedBy = req.user._id;
    const jobData = {
      title,
      jobType,
      location,
      companyName,
      introduction,
      qualifications,
      responsibilities,
      offers,
      salary,
      personalWebsite: {
        title: personalWebsiteTitle,
        url: personalWebsiteUrl,
      },
      hiringMultipleCandidates,
      jobNiche,
      postedBy,
    };

    // now we will be looking for the company photo
    if (req.files.companyImage && req.files) {
      const { companyImage } = req.files;
      if (companyImage) {
        try {
          // uploading it to cloudinary
          const cloudinaryResponse = await cloudinary.uploader.upload(
            companyImage.tempFilePath,
            { folder: "CompanyImages" }
          );
          if (!cloudinaryResponse || cloudinaryResponse.error) {
            return next(
              new ErrorHandler("Failed to upload company Image", 500)
            );
          }
          jobData.companyImage = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.url,
          };
        } catch (error) {
          return next(new ErrorHandler("Failed to upload resume", 500));
        }
      }
    }
    // pushing all the job data in the main DB
    const jobPosted = await Job.create(jobData);
    res.status(201).json({
      success: true,
      message: "New job has been posted",
      jobPosted,
    });
  } catch (error) {
    next(error);
  }
});

export { postJob };
