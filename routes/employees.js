import express from 'express'
import { applyJobController, buyPlanController, createDetailController, createProfileController, deleteCvController, favouriteJobController, getEmployeedataController, removeSaveJobController, saveJobController, updateCvController, updateDetailController, uploadCvController } from '../controller/employeesController.js'
import { CV } from '../middleware/cv.js'
import { userPhoto } from '../middleware/user_photo.js'

const createProfile=express.Router()
createProfile.post('/create-profile',createProfileController)

const getEmployeeData=express.Router()
getEmployeeData.get('/get-employee-data/:id',getEmployeedataController)

const favouriteJob=express.Router() // here user or employee add there favourite job  and location
favouriteJob.post('/favourite-job-location',favouriteJobController) 

const createDetail=express.Router() // store education , experince , skill ,language ,certification
createDetail.post('/create-detail',createDetailController)

const editDetail=express.Router()
editDetail.put('/edit-detail',userPhoto,updateDetailController)

const buyPlan=express.Router()
buyPlan.post('/buy-plan',buyPlanController)

const uploadCv=express.Router()
uploadCv.post('/upload-cv',CV,uploadCvController)

const updateCv=express.Router()
updateCv.put('/update-cv',CV,updateCvController)

const deleteCv=express.Router()
deleteCv.delete('/delete-cv',CV,deleteCvController)

//       Job
const saveJob=express.Router()
saveJob.post('/save-job',saveJobController)

const removeSaveJob=express.Router()
removeSaveJob.delete('/remove-save-job/:id',removeSaveJobController)

const applyJob=express.Router()
applyJob.post('/apply-job',applyJobController)

export {createProfile,getEmployeeData,favouriteJob,createDetail,editDetail,buyPlan,uploadCv,updateCv,deleteCv,saveJob,removeSaveJob,applyJob}
