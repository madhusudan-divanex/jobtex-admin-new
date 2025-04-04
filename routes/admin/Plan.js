import express from 'express'
import { createPlanController, deletePlanController, getPlanController, updatePlanController } from '../../controller/planController.js';
import verify from '../../middleware/verify.js';

const createPlan=express.Router();
createPlan.post('/create-plan',verify,createPlanController)

const getPlan=express.Router();
getPlan.get('/get-plan',verify,getPlanController)

const updatePlan=express.Router();
updatePlan.put('/update-plan',verify,updatePlanController)

const deletePlan=express.Router();
deletePlan.delete('/delete-plan/:id',verify,deletePlanController)

export {createPlan,getPlan,updatePlan,deletePlan}