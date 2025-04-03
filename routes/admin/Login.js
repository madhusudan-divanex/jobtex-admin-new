import express from 'express'
import { adminLoginController, getEmployeeAllController } from '../../controller/adminController.js'
import verify from '../../middleware/verify.js'

const adminLogin=express.Router()
adminLogin.post('/admin-login',adminLoginController)

const getEmployeeAll=express.Router()
getEmployeeAll.get('/get-all-employee',verify,getEmployeeAllController)

export {adminLogin,getEmployeeAll}