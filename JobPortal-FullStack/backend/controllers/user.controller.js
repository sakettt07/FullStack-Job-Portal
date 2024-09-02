import { User } from "../models/user.model.js";
import { catchAsyncErrors } from "../middlewares/catchAsync.middleware.js";
import ErrorHandler from "../middlewares/error.middleware.js";
import { v2 as cloudinary } from "cloudinary";
import { sendToken } from "../utils/jwtToken.js";

const registerUser = catchAsyncErrors(async (req, res, next) => {
  // TODO:
  // getting all the data from the body
  // validate the data and check for the empty fields
  // Potential check for the existing user if present then return it.
  // Upload the document resume on the cloudinary then save its url into the database.
  // generate the cookiee
  try {
    const {
      name,
      email,
      phone,
      address,
      password,
      role,
      firstNiche,
      secondNiche,
      thirdNiche,
      coverLetter,
    } = req.body;
    if (
      [name, email, password, phone, address, role].some(
        (field) => field?.trim() === ""
      )
    ) {
      return next(new ErrorHandler("All fields are required", 400));
    }
    if (role === "Job Seeker" && (!firstNiche || !secondNiche || !thirdNiche)) {
      return next(
        new ErrorHandler("Please provide your preffered job niches", 400)
      );
    }
    // check for the existing user done
    const existingUser = await User.findOne({ email, phone });
    if (existingUser) {
      return next(
        new ErrorHandler(
          "Email is alrerady registered. || Phone number already exist",
          400
        )
      );
    }

    // uploading the data into the DB
    const UserData = {
      name,
      email,
      phone,
      address,
      password,
      role,
      niches: {
        firstNiche,
        secondNiche,
        thirdNiche,
      },
      coverLetter,
    };

    // upload doc on cloudinary

    if (req.files && req.files.resume) {
      const { resume } = req.files;
      if (resume) {
        try {
          const cloudinaryResponse = await cloudinary.uploader.upload(
            resume.tempFilePath,
            { folder: "JobPortal" }
          );
          if (!cloudinaryResponse || cloudinaryResponse.error) {
            return next(new ErrorHandler("Failed to upload resume", 500));
          }

          UserData.resume = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
          };
        } catch (error) {
          return next(new ErrorHandler("Failed to upload resume", 500));
        }
      }
    }
    const user = await User.create(UserData);
    sendToken(user, 201, res, "user Registered");
  } catch (error) {
    next(error);
  }
});

const loginUser = catchAsyncErrors(async (req, res, next) => {
  // TODO: get the essentials from the body
  // then find it in the Database.
  // convert the password and match
  // if the user is present then return logged in and change the page
  // saved his cookie for the seesion user accessing the site.
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return next(new ErrorHandler("Email, password ,role are required.", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 400));
    }
    const isPasswordMatch = await user.isPasswordCorrect(password);
    if (!isPasswordMatch) {
      return next(new ErrorHandler("Invalid password", 400));
    }
    if (user.role !== role) {
      return next(new ErrorHandler("Invalid User role", 400));
    }
    sendToken(user, 200, res, "User logged in successfully");
    // console.log(user)
  } catch (error) {
    console.log(error);
  }
});

const logoutUser = catchAsyncErrors(async (req, res) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged Out successfully.",
    });
});
const getUser = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});
const updateUserDetails = catchAsyncErrors(async (req, res, next) => {
  // TODO: get the user details that to be updated from the body.
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    coverLetter: req.body.coverLetter,
    niches: {
      firstNiche: req.body.firstNiche,
      secondNiche: req.body.secondNiche,
      thirdNiche: req.body.thirdNiche,
    },
  };
  const { firstNiche, secondNiche, thirdNiche } = newUserData.niches;

  if (
    req.user.role === "Job Seeker" &&
    (!firstNiche || !secondNiche || !thirdNiche)
  ) {
    return next(
      new ErrorHandler("Please provide your all preferred job niches.", 400)
    );
  }
  //   if he want to update the resume tooo then
  if (req.files) {
    // if old resume present get its id and destroy it in the cloudinary.
    const { resume } = req.files;
    if (resume) {
      const currResumeId = req.user.resume.public_id;
      if (currResumeId) {
        await cloudinary.uploader.destroy(currResumeId);
      }
      // upload the new id for the new resume.
      const newResume = await cloudinary.uploader.upload(resume.tempFilePath, {
        folder: "JobPortal",
      });
      newUserData.resume = {
        public_id: newResume.public_id,
        url: newResume.secure_url,
      };
    }
  }
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    user,
    message: "Profile Updated.",
  });
});
const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  const { newPassword, confirmPassword } = req.body;

  const isPasswordMatched = await user.isPasswordCorrect(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect.", 400));
  }

  if (newPassword !== confirmPassword) {
    return next(
      new ErrorHandler("New password & confirm password do not match.", 400)
    );
  }

  user.password = newPassword;
  await user.save();
  sendToken(user, 200, res, "Password updated successfully.");
});
export {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  updateUserDetails,
  updatePassword,
};
