import express from 'express'
import verify from '../../middleware/verify.js'
import { applicationFunnelController, systemHealthController, userInsightController } from '../../controller/dashboardOverviewController.js'

const systemHealth=express.Router()
systemHealth.post('/system-health',verify,systemHealthController)

const userInsight=express.Router()
userInsight.get('/user-insight',verify,userInsightController)

const applicationFunnel=express.Router()
applicationFunnel.get('/application-funnel',verify,applicationFunnelController)

export {systemHealth,userInsight,applicationFunnel}

