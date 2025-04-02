import express from 'express'
import { report } from '../middleware/report.js'
import { createReportController, getAllReportController, getReportByIdController } from '../controller/reportController.js'

const createReport=express.Router()
createReport.post('/create-report',report,createReportController)

const getAllReport=express.Router()
getAllReport.get('/get-all-report',getAllReportController)

const getReportById=express.Router()
getReportById.get('/get-report-by-id/:id',getReportByIdController)

export {createReport,getAllReport,getReportById}