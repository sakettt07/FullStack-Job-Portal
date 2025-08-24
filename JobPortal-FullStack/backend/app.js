import express from "express";
import  {config} from "dotenv";
import cors from "cors";
import cookie_parser from "cookie-parser";
import { connectDB } from "./database/db.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import fileUpload from "express-fileupload";
import userRouter from "./routes/user.routes.js";
import jobRouter from "./routes/job.routes.js";
import applicationRouter from "./routes/application.routes.js";
import { newsLetterCron } from "./auto/newsLetterCron.js";
import { aj } from "./lib/arcjet.js";

const app=express();
config({path:"./config/config.env"});

app.use(cors({
    origin:[process.env.FRONTEND_URL],
    methods:["GET","POST","PUT","DELETE"],
    credentials:true,
}))

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookie_parser());

app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/",
}));

// applying rate limiting for all the routes
app.use(async(req,res,next)=>{
    try {
        const decision=await aj.protect(req,{
            requested:1,
        });
        if(decision.isDenied()){
            if(decision.reason.isRateLimit()){
                res.status(429).json({
                    error:"Too many requests"
                });
            }
            else if(decision.reason.isBot()){
                res.status(403).json({
                    error:"Bot access denied"
                });
            }
            else{
                res.status(403).json({
                    error:"Forbidden"
                });
            }
            return;
        }
        if(decision.results.some((result)=>result.reason.isBot()&& result.reason.isSpoofed())){
            res.status(403).json({
                error:"Spoofed bot detected"
            })
        }
        next(); 
    } catch (error) {
        console.log("ArcJet Error",error);
        next(error);
    }
})

app.use("/api/v1/user",userRouter);
app.use("/api/v1/job",jobRouter);
app.use("/api/v1/application",applicationRouter);

newsLetterCron();

connectDB();


app.use(errorMiddleware);

export {app};