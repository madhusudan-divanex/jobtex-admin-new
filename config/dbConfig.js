import mongoose from "mongoose";

async function ConnectToDb(){
    try {
       // mongodb+srv://madhusudan:madhusudan@123@jobtex.5qbet8z.mongodb.net/?retryWrites=true&w=majority&appName=jobtex
        await mongoose.connect(process.env.MONGO_URL);
       
        console.log("connected successfully ✅")
    } catch (error) {
        console.log(error)
    }
}
export default ConnectToDb