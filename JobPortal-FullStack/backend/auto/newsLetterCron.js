import cron from "node-cron";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";


export const newsLetterCron=()=>{
    cron.schedule('*/1 * * * *',()=>{    // the expression is space sensitive so...
        // console.log("Chal raha h Cron Automation");
    })
}