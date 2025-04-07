import express from 'express'
import verify from '../../middleware/verify.js'
import { perUserActivityController } from '../../controller/userActivityLogsController.js'

const perUserActivity=express.Router()
perUserActivity.get('/get-per-user-activity-logs',verify,perUserActivityController)

const systemWiseLog=express.Router()
systemWiseLog.post('/system-wise-log',verify,perUserActivityController)

export {perUserActivity,systemWiseLog}