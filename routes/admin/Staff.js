import express from 'express'
import verify from '../../middleware/verify.js'
import { createStaffController, deleteStaffController, getStaffByIdController, getStaffController, updateStaffController } from '../../controller/adminController.js'

const createStaff=express.Router()
createStaff.post('/create-new-staff',verify,createStaffController)

const getStaff=express.Router()
getStaff.get('/get-staff',verify,getStaffController)

const updateStaff=express.Router()
updateStaff.put('/update-staff/:id',verify,updateStaffController)

const deleteStaff=express.Router()
deleteStaff.delete('/delete-staff/:id',verify,deleteStaffController)

const getStaffById=express.Router()
getStaffById.get('/get-staff-by-id/:id',verify,getStaffByIdController)

export {createStaff,getStaff,updateStaff,deleteStaff,getStaffById}