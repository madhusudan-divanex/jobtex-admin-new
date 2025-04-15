import express from 'express'
import { deleteJobController, editJobController, getAllJobController, getJobByIdJobController, newJobController } from '../controller/jobController.js'
import verify from '../middleware/verify.js'
import { companyPhoto } from '../middleware/company_photo.js'
import { getAllAppliedJobController, getAllSavedJobController } from '../controller/dashboardOverviewDeatilcontroller.js'

const newJob=express.Router()
newJob.post('/create-new-job',verify,companyPhoto,newJobController)

const editJob=express.Router()
editJob.post('/edit-job',verify,companyPhoto,editJobController)

const deleteJob=express.Router();
deleteJob.delete('/delete-job/:id',verify,deleteJobController)

const getAllJob=express.Router();
getAllJob.get('/get-all-job',getAllJobController)

const getAllAppliedJob=express.Router()
getAllAppliedJob.get('/get-apply-job',getAllAppliedJobController)

const getAllSavedJob=express.Router()
getAllSavedJob.get('/get-saved-job',getAllSavedJobController)

const getJobByCompany=express.Router()
getJobByCompany.get('/get-job-by-company',getJobByIdJobController)

const getJobById=express.Router()
getJobById.get('/get-job-by-id/:id',getJobByIdJobController)


//      Reserve For employee
// const appliedJob=express.Router()
// appliedJob.get('/apply-job/:id',)

// const savedJob=express.Router()
// savedJob.get('/save-job/:id',)




export {newJob,editJob,deleteJob,getAllJob,getAllAppliedJob,getAllSavedJob,getJobById,getJobByCompany}
