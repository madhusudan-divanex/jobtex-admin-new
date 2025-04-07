import express from 'express'
import verify from '../../middleware/verify.js'
import { perUserActivityController, systemWiseLogController } from '../../controller/userActivityLogsController.js'

const perUserActivity=express.Router()
perUserActivity.get('/get-per-user-activity-logs',verify,perUserActivityController)

const systemWiseLog=express.Router()
systemWiseLog.get('/system-wise-log',verify,systemWiseLogController)

export {perUserActivity,systemWiseLog}