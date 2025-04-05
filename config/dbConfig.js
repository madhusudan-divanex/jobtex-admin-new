import mongoose from "mongoose";

async function ConnectToDb(){
    try {
       // mongodb+srv://madhusudan:madhusudan@123@jobtex.5qbet8z.mongodb.net/?retryWrites=true&w=majority&appName=jobtex
        await mongoose.connect('mongodb+srv://madhusudan:madhusudan123@jobtex.5qbet8z.mongodb.net/jobtex',{ serverSelectionTimeoutMS: 10000,  // 10 seconds timeout for connecting
            socketTimeoutMS: 45000,           // Optional: How long to keep socket open
            bufferCommands: true,             // Enable command buffering
            bufferTimeoutMS: 10000,    });
       
        console.log("connected successfully ✅")
    } catch (error) {
        console.log(error)
    }
}
export default ConnectToDb