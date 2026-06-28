import mongoose from "mongoose";
import "dotenv/config";

export default async function connectDB(){
    try{

       await mongoose.connect(process.env.MONGODB_URI);
       console.log("DB connected successfully");

    }
    catch(err){
        console.log("DB not connected!", err.message)
    }
}