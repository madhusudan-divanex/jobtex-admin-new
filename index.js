import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import ConnectToDb from './config/dbConfig.js';
import { forgotPass, login, resetPass, signup } from './routes/loginandsignup.js';
import { deleteJob, editJob, getAllJob, getJobByCompany, getJobById, newJob } from './routes/jobs.js';

const app=express()
dotenv.config();

await ConnectToDb();
app.use(cors())
app.use(express.json())
//      employeer login and signup
app.use('/',login)
app.use('/',signup)
app.use('/',resetPass)
app.use('/',forgotPass)

//     jobs api
app.use('/',newJob)
app.use('/',editJob)
app.use('/',deleteJob)
app.use('/',getAllJob)
app.use('/',getJobById)
app.use('/',getJobByCompany)

app.listen(process.env.PORT,()=>{
    console.log("server start")
})



