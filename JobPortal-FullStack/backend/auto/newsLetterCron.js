import cron from "node-cron";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import { sendEmail } from "../utils/sendEmail.js";


// used chatGPT / npmjs for understanding the cron package.
export const newsLetterCron=()=>{
    cron.schedule('*/1 * * * *',async()=>{    // the expression is space sensitive so...
        console.log("Chal raha h Cron Automation");
        const jobs=await Job.find({newsLettersSent:false});
        for(const job of jobs){
            try{
                const filteredUsers=await User.find({
                    $or:[
                        {"niches.firstNiche":job.jobNiche},
                        {"niches.secondNiche":job.jobNiche},
                        {"niches.thirdNiche":job.jobNiche},
                    ]
                })
                for(const user of filteredUsers){
                    const subject=`Hot Job Alert: ${job.title} in ${job.jobNiche} Available Now`;
                    const message=`Hi ${user.name},\n\nGreat news! A new job that fits your niche has just been posted. The position is for a ${job.title} with ${job.companyName}, and they are looking to hire immediately.\n\nJob Details:\n- **Position:** ${job.title}\n- **Company:** ${job.companyName}\n- **Location:** ${job.location}\n- **Salary:** ${job.salary}\n\nDon’t wait too long! Job openings like these are filled quickly. \n\nWe’re here to support you in your job search. Best of luck!\n\nBest Regards,\nNicheNest Team`;
                    sendEmail({
                        email:user.email,
                        subject,
                        message
                    });
                }
                job.newsLettersSent=true;
                await job.save();
            }
            catch(error){
                console.log("ERROR in the node cron");
                return next(console.log(error ||`Some error in cron`));
            }
        }
    })
}