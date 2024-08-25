import app from "./app.js";
app.listen(process.env.PORT,()=>{
    console.log(`Server listining on PORT ${process.env.PORT}`)
})