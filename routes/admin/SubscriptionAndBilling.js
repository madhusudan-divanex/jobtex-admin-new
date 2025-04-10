import express from 'express'

import { grantCustomPlanController, manualUpDownController } from '../../controller/SubscriptionAndBillingController.js'
import verify from '../../middleware/verify.js'

const manualUpDown=express.Router()
manualUpDown.post('/manual-up-down',verify,manualUpDownController)

const grantCustomPlan=express.Router()
grantCustomPlan.post('/grant-custom-plan',verify,grantCustomPlanController)

export {manualUpDown,grantCustomPlan}