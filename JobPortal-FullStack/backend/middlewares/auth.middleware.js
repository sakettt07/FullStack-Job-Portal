import { catchAsyncErrors } from "./catchAsync.middleware.js";
import ErrorHandler from "./error.middleware.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("User is not authenticated.", 400));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.user = await User.findById(decoded.id);

  next();
});

// the below is the authorized route for the
export const isAuthorized=(...roles)=>{
  return (req,res,next)=>{
    if(!roles.includes(req.user.role)){
      return next(
        new ErrorHandler(`${req.user.role} not allowed to access this resource`)
      )
    }
    next();

  }
}