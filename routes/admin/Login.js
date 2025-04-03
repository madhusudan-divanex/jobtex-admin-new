import express from 'express'
import { adminLoginController, getEmployeeAllController, getEmployeePlanController } from '../../controller/adminController.js'
import verify from '../../middleware/verify.js'

const adminLogin=express.Router()
adminLogin.post('/admin-login',adminLoginController)

const getEmployeeAll=express.Router()
getEmployeeAll.get('/get-all-employee',verify,getEmployeeAllController)

const planEmployee=express.Router() // send employee  plan vise like free,standard, ultra
planEmployee.get('/get-plan-employee',verify,getEmployeePlanController)

export {adminLogin,getEmployeeAll,planEmployee}