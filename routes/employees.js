import express from 'express'
import { buyPlanController, createDetailController, createProfileController, deleteCvController, favouriteJobController, getEmployeedataController, updateCvController, updateDetailController, uploadCvController } from '../controller/employeesController.js'
import { CV } from '../middleware/cv.js'

const createProfile=express.Router()
createProfile.post('/create-profile',createProfileController)

const getEmployeeData=express.Router()
getEmployeeData.get('/get-employee-data/:id',getEmployeedataController)

const favouriteJob=express.Router() // here user or employee add there favourite job  and location
favouriteJob.post('/favourite-job-location',favouriteJobController) 

const createDetail=express.Router() // store education , experince , skill ,language ,certification
createDetail.post('/create-detail',createDetailController)

const editDetail=express.Router()
editDetail.put('/edit-detail',updateDetailController)

const buyPlan=express.Router()
buyPlan.post('/buy-plan',buyPlanController)

const uploadCv=express.Router()
uploadCv.post('/upload-cv',CV,uploadCvController)

const updateCv=express.Router()
updateCv.put('/update-cv',CV,updateCvController)

const deleteCv=express.Router()
deleteCv.delete('/delete-cv',CV,deleteCvController)

export {createProfile,getEmployeeData,favouriteJob,createDetail,editDetail,buyPlan,uploadCv,updateCv,deleteCv}
