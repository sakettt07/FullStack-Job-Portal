import { application } from "express";
import { catchAsyncErrors } from "../middlewares/catchAsync.middleware.js";
import ErrorHandler, {
  errorMiddleware,
} from "../middlewares/error.middleware.js";
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { v2 as cloudinary } from "cloudinary";

// when the user registered into an application then the application is posted.
const postApplication = catchAsyncErrors(async (req, res, next) => {
  // TODO: Job seeekr will post a application when applied
  // so we need the id of the job he has selected.
  // then all his details about the job

  // The Flow
  try {
    const { id } = req.params; //this will be the job id
    const { name, email, phone, address, coverLetter } = req.body;
    if (!name || !email || !phone || !address || !coverLetter) {
      return next(new ErrorHandler("All fields are required", 400));
    }

    const jobSeekerInfo = {
      id: req.user._id,
      name,
      email,
      phone,
      address,
      coverLetter,
      role: "Job Seeker",
    };

    const jobDetails = await Job.findById(id);
    if (!jobDetails) {
      return next(new ErrorHandler("job not found", 404));
    }
    // if the job seeker has already applied for this job then throw error
    const isApplied = await Application.findOne({
      "jobInfo.id": id,
      "jobSeekerInfo.id": req.user._id,
    });

    if (isApplied) {
      return next(new ErrorHandler("U have Already applied for this job", 400));
    }

    // handling the files at the time of thre application

    if (req.files && req.files.resume) {
      // if user has sent the resume them
      const { resume } = req.files;
      try {
        const cloudinaryResponse = await cloudinary.uploader.upload(
          resume.tempFilePath,
          { folder: "JobPortal" }
        );
        if (!cloudinaryResponse || cloudinaryResponse.error) {
          return next(new ErrorHandler("Failed to upload resume", 500));
        }
        jobSeekerInfo.resume = {
          public_id: cloudinaryResponse.public_id,
          url: cloudinaryResponse.url,
        };
      } catch (error) {
        return next(new ErrorHandler("Resume not uploaded", 400));
      }
    }

    // if user has not uploaded the resume and if user has saved it at the time of registering.
    else {
      if (req.user && !req.user.resume.url) {
        return next(new ErrorHandler("Please upload your resume", 400));
      }
      jobSeekerInfo.resume = {
        public_id: req.user && req.user.resume.public_id,
        url: req.user && req.user.resume.url,
      };
    }

    //  now saving the employer info

    const employerInfo = {
      id: jobDetails.postedBy,
      role: "Employer",
    };
    const jobInfo = {
      jobId: id,
      jobTitle: jobDetails.title,
    };

    const application = await Application.create({
      jobSeekerInfo,
      employerInfo,
      jobInfo,
    });
    res.status(200).json({
      success: true,
      message: "Application Submitted",
      application,
    });
  } catch (error) {
    next(error);
  }
});

// to get all the applications which he have applied in .
const JobSeekerGetApplications = catchAsyncErrors(async (req, res, next) => {
  try {
    const { _id } = req.user;
    const application = await Application.find({
      "jobSeekerInfo.id": _id,
      "deletedBy.jobSeeker": false,
    });
    res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    next(error);
  }
});

// anyone can delete the appplication.
const deleteApplication = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id)
    console.log(req.user.role);
    const application = await Application.findById(id);
    if (!application) {
      return next(new ErrorHandler("Application not found.", 404));
    }

    // we will be checking for the role
    const { role } = req.user;
    switch (role) {      // if job seeker deleted its application then case:1
      case "Job Seeker":
        application.deletedBy.jobSeeker = true;
        await application.save();
        break;
      case "Employer":       // if employer deleted its application then case:2
        application.deletedBy.employer = true;
        await application.save();
        break;

      default:
        console.log("Default case for application delete function.");
        break;
    }

    // if both of them deleted the application then remove it from the database completely.
    if (
      application.deletedBy.employer === true &&
      application.deletedBy.jobSeeker === true
    ) {
      await application.deleteOne();
    }
    res.status(200).json({
      success: true,
      message: "Application Deleted.",
    });
  } catch (error) {
    next(error);
  }
});
// to get all the applicants who have applied for this job.
const EmployerGetApplications = catchAsyncErrors(async (req, res, next) => {
  try {
    const { _id } = req.user;
    const application = await Application.find({
      "employerInfo.id": _id,
      "deletedBy.employer": false,
    });
    res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    next(error);
  }
});

export {
  postApplication,
  deleteApplication,
  EmployerGetApplications,
  JobSeekerGetApplications,
};
