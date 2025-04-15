import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import ConnectToDb from './config/dbConfig.js';
import { forgotPass, login, profileVeirfy, resetPass, signup } from './routes/loginandsignup.js';
import { deleteJob, editJob, getAllAppliedJob, getAllJob, getAllSavedJob, getJobByCompany, getJobById, newJob } from './routes/jobs.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createReport, getAllReport, getReportById } from './routes/report.js';
import { adminLogin, getEmployeeAll, planEmployee } from './routes/admin/Login.js';
import { buyPlan, createDetail, createProfile, deleteCv, editDetail, favouriteJob, getEmployeeData, updateCv, uploadCv } from './routes/employees.js';
import { verifyToken } from './routes/verify-route.js';
import { createCustomPlan, createPlan, deleteCustomPlan, deletePlan, getCustomPlan, getPlan, updateCustomPlan, updatePlan } from './routes/admin/Plan.js';
import { createStaff, deleteStaff, getStaff, getStaffById, updateStaff } from './routes/admin/Staff.js';
import { allExpirePro, applicationFunnel, getActiveUser, getAllCoverAndCv, getNewSignUp, systemHealth, userInsight } from './routes/admin/dashboardOverview.js';
import { grantPro, userAction, userDetail, userList } from './routes/admin/userManagement.js';
import { perUserActivity, systemWiseLog } from './routes/admin/userActivityLogs.js';
import { appToast, deleteToast, editToast, getToast, planExpiry, usesReminder, weeklyDigest } from './routes/admin/notificationsManager.js';
import { createPromo, deletePromo, editPromo, getPromo } from './routes/admin/promoTrials.js';
import { grantCustomPlan, manualUpDown } from './routes/admin/SubscriptionAndBilling.js';

const app=express()
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
await ConnectToDb();
app.use(cors())
app.use(express.json())


//      employeer login and signup
app.use('/',login)
app.use('/',signup)
app.use('/',profileVeirfy)
app.use('/',resetPass)
app.use('/',forgotPass)

//      employeer detail
app.use('/',createProfile)
app.use('/',getEmployeeData)
app.use('/',favouriteJob)
app.use('/',createDetail)
app.use('/',editDetail)
app.use('/',buyPlan)
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
app.use('/',createCustomPlan)
app.use('/',getCustomPlan)
app.use('/',updateCustomPlan)
app.use('/',deleteCustomPlan)

//      Staff
app.use('/',createStaff)
app.use('/',getStaff)
app.use('/',getStaffById)
app.use('/',updateStaff)
app.use('/',deleteStaff)

//      Tailored Job Docs

//      🧭 1. Dashboard Overview
app.use('/',systemHealth)
app.use('/',getAllAppliedJob)
app.use('/',allExpirePro)
app.use('/',getNewSignUp)
app.use('/',getAllCoverAndCv)
app.use('/',getActiveUser)
app.use('/',getAllSavedJob)
app.use('/',userInsight)
app.use('/',applicationFunnel)

//      👥 2. User Management
app.use('/',userList)
app.use('/',userDetail)
app.use('/',userAction)
app.use('/',grantPro)

//      🕵️‍♀️ 3. User Activity Logs
app.use('/',perUserActivity)
app.use('/',systemWiseLog)

//      💳 5. Subscription & Billing Control
app.use('/',manualUpDown)
app.use('/',grantCustomPlan)

//       🎟 6. Promotional Offers & Trials
app.use('/',createPromo)
app.use('/',getPromo)
app.use('/',editPromo)
app.use('/',deletePromo)

//      🔔 7. Notifications Manager
app.use('/',appToast)
app.use('/',getToast)
app.use('/',editToast)
app.use('/',deleteToast)
app.use('/',weeklyDigest)
app.use('/',planExpiry)
app.use('/',usesReminder)


app.listen(process.env.PORT,()=>{
    console.log("server start")
})



