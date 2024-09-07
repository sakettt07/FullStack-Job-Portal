import { User } from "../models/user.model.js";
import { catchAsyncErrors } from "../middlewares/catchAsync.middleware.js";
import ErrorHandler from "../middlewares/error.middleware.js";
import { v2 as cloudinary } from "cloudinary";
import { Job } from "../models/job.model.js";

// the employer can create a new job
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
      !salary ||
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

// the employer can delete the job he has posted

const deleteJob = catchAsyncErrors(async (req, res, next) => {
  // TODO: Firstly get the user from the userLoggedIn cookie if employee then only he can access this route.
  // then get the job id from the params and find it in the DB and get it delete
  try {
    const { id } = req.params;
    const job = await Job.findByIdAndDelete(id);
    if (!job) {
      return next(new ErrorHandler("Oops! Job not found.", 404));
    }
    res.status(200).json({
      success: true,
      message: "Job deleted.",
    });
  } catch (error) {
    next(error);
  }
});

// To get all the job on the frontend. with proper searching technique using the query method.
const getAllJobs = catchAsyncErrors(async (req, res, next) => {
  try {
    const { city, niche, searchKeyword } = req.query;
    const query = {};
    if (city) {
      query.location = city;
    }
    if (niche) {
      query.jobNiche = niche;
    }
    if (searchKeyword) {
      query.$or = [
        { title: { $regex: searchKeyword, $options: "i" } },
        { companyName: { $regex: searchKeyword, $options: "i" } },
        { introduction: { $regex: searchKeyword, $options: "i" } },
      ];
    }
    const jobs = await Job.find(query);
    res.status(200).json({
      success: true,
      jobs,
      count: jobs.length,
    });
  } catch (error) {
    next(error);
  }
});
// To get a single job
const getASingleJob = catchAsyncErrors(async (req, res, next) => {
  // TODO:

  try {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) {
      return next(new ErrorHandler("Job not found.", 404));
    }
    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    next(error);
  }
});

// Employer can get all his jobs
const getMyJobs = catchAsyncErrors(async (req, res, next) => {
  try {
    const myJobs = await Job.find({ postedBy: req.user._id });
    res.status(200).json({
      success: true,
      myJobs,
    });
  } catch (error) {
    next(error);
  }
});

export { postJob, deleteJob, getASingleJob, getMyJobs, getAllJobs };
