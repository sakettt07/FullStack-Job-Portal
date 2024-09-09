import express,{urlencoded} from "express";
import  {config} from "dotenv";
import cors from "cors";
import cookie_parser from "cookie-parser";
import { connectDB } from "./database/db.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import fileUpload from "express-fileupload";
import userRouter from "./routes/user.routes.js";
import jobRouter from "./routes/job.routes.js";
import applicationRouter from "./routes/application.routes.js";

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

app.use("/api/v1/user",userRouter);
app.use("/api/v1/job/",jobRouter);
app.use("/api/v1/application/",applicationRouter);

connectDB();


app.use(errorMiddleware);

export {app};