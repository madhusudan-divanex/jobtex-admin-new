import express from 'express'
import verify from '../../middleware/verify.js'
import { applicationFunnelController, expireProController, getActiveUserController, systemHealthController, userInsightController } from '../../controller/dashboardOverviewController.js'
import { getCvStatsController } from '../../controller/dashboardOverviewDeatilcontroller.js'

const systemHealth=express.Router()
systemHealth.post('/system-health',verify,systemHealthController)

const userInsight=express.Router()
userInsight.get('/user-insight',verify,userInsightController)

const applicationFunnel=express.Router()
applicationFunnel.get('/application-funnel',verify,applicationFunnelController)

const getAllCoverAndCv=express.Router()
getAllCoverAndCv.get('/get-cv-and-cover',getCvStatsController)

const getActiveUser=express.Router()
getActiveUser.get('/get-active-user',getActiveUserController)

const allExpirePro=express.Router()
allExpirePro.get('/get-expire-pro-user',verify,expireProController)

export {systemHealth,userInsight,applicationFunnel,getAllCoverAndCv,getActiveUser,allExpirePro}

