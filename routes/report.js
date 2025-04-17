import express from 'express'
import { report } from '../middleware/report.js'
import { createReportController, getAllReportController, getReportByIdController } from '../controller/reportController.js'
import verify from '../middleware/verify.js'

// const createReport=express.Router()
// createReport.post('/create-report',report,createReportController)

const getAllReport=express.Router()
getAllReport.get('/get-all-report',verify,getAllReportController)

const getReportById=express.Router()
getReportById.get('/get-report-by-id/:id',verify,getReportByIdController)

export {getAllReport,getReportById}