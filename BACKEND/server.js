import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import { authRoute } from "./APIS/AuthAPI.js";
import { complaintRoute } from "./APIS/ComplaintAPI.js";

//loading enviormnet variables
dotenv.config();
//create express application    
const app = express();
//ADDING BODY PARSER MIDDLEWARE
app.use(express.json());

// connect routes
app.use("/api/auth", authRoute);
app.use("/api/complaints", complaintRoute);


// DB connection
const connectDB = async()=>
{   try{
    await mongoose.connect(process.env.DB_URL)//access from .env file
    console.log("DB Connection succesful")
    //start http server
    app.listen(process.env.PORT,()=>console.log("Serevr started"))
   }catch(err)
   {
    console.log("Eror in DB Connection",err)
   }
}
connectDB()


//dealing with invalid-path----keep it always on top of the error handling (To handle any inavlid urls in req.http)
app.use((req,res,next)=>
{
    console.log(req.url)
    res.json({message:`${req.url} is invalid path`})
})

//error handling
app.use((err,req,res,next)=>
{
    console.log("ERROR",err)
    res.json({message:"Error",reason:err.message})
})