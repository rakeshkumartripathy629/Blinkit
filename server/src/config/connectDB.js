// import mongoose from "mongoose";

// const MONGO_URI = "mongodb+srv://rtripathy723:2llnJ31vZ7iT8zwN@cluster0.vc6btby.mongodb.net/";
// // Or a cloud URI example:
// // const MONGO_URI = "mongodb+srv://username:password@cluster0.mongodb.net/your_db_name?retryWrites=true&w=majority";

// async function connectDB() {
//   try {
//     await mongoose.connect(MONGO_URI);
//     console.log("Connected to DB");
//   } catch (error) {
//     console.error("MongoDB connect error:", error);
//     process.exit(1);
//   }
// }

// export default connectDB;


import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

if(!process.env.MONGO_URI){
    throw new Error(
        "Please provide MONGODB_URI in the .env file" 
    )
}

async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("connect DB")
    } catch (error) {
        console.log("Mongodb connect error",error)
        process.exit(1)
    }
}

export default connectDB