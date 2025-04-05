import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import ConnectToDb from './config/dbConfig.js';
import { forgotPass, login, resetPass, signup } from './routes/loginandsignup.js';
import { deleteJob, editJob, getAllJob, getJobByCompany, getJobById, newJob } from './routes/jobs.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createReport, getAllReport, getReportById } from './routes/report.js';
import { adminLogin, getEmployeeAll, planEmployee } from './routes/admin/Login.js';
import { createDetail, createProfile, deleteCv, getEmployeeData, updateCv, uploadCv } from './routes/employees.js';
import { verifyToken } from './routes/verify-route.js';
import { createPlan, deletePlan, getPlan, updatePlan } from './routes/admin/Plan.js';

const app=express()
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
await ConnectToDb();
const allowedOrigins = [
    'http://localhost:7000',      
    'https://apijobtex.divanex.in',      
    'https://jobtex-server.onrender.com'
  ];
  

  app.use(cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  }));
app.use(express.json())


//      employeer login and signup
app.use('/',login)
app.use('/',signup)
app.use('/',resetPass)
app.use('/',forgotPass)

//      employeer detail
app.use('/',createProfile)
app.use('/',getEmployeeData)
app.use('/',createDetail)
app.use('/',uploadCv)
app.use('/',updateCv)
app.use('/',deleteCv)

//     jobs api
app.use('/',newJob)
app.use('/',editJob)
app.use('/',deleteJob)
app.use('/',getAllJob)
app.use('/',getJobById)
app.use('/',getJobByCompany)

//      Reports
app.use('/',createReport)
app.use('/',getAllReport)
app.use('/',getReportById)


//      Admin
app.use('/',adminLogin)
app.use('/',getEmployeeAll)
app.use('/',planEmployee)
app.use('/',verifyToken)

//      Plan
app.use('/',createPlan)
app.use('/',getPlan)
app.use('/',updatePlan)
app.use('/',deletePlan)

app.listen(process.env.PORT,()=>{
    console.log("server start")
})



