import express from 'express'
import { deleteJobController, editJobController, getAllJobController, getJobByIdJobController, newJobController } from '../controller/jobController.js'
import verify from '../middleware/verify.js'

const newJob=express.Router()
newJob.post('/create-new-job',verify,newJobController)

const editJob=express.Router()
editJob.post('/edit-job',verify,editJobController)

const deleteJob=express.Router();
deleteJob.delete('/delete-job/:id',verify,deleteJobController)

const getAllJob=express.Router();
getAllJob.get('/get-all-job',getAllJobController)

const getJobByCompany=express.Router()
getJobByCompany.get('/get-job-by-company',getJobByIdJobController)

const getJobById=express.Router()
getJobById.get('/get-job-by-id/:id',getJobByIdJobController)

export {newJob,editJob,deleteJob,getAllJob,getJobById,getJobByCompany}
