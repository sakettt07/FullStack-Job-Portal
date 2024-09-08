// when the job seeker will submit the applicationit will contain some necessary details.
import mongoose from "mongoose";
import validator from "validator";

const applicationSchema=new mongoose.Schema({
    jobSeekerInfo:{

    },
    employerInfo:{

    }
})