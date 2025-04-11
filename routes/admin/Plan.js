import express from 'express'
import { createCustomPlanController, createPlanController, deleteCustomPlanController, deletePlanController, getCustomPlanController, getPlanController, updateCustomPlanController, updatePlanController } from '../../controller/planController.js';
import verify from '../../middleware/verify.js';

const createPlan=express.Router();
createPlan.post('/create-plan',verify,createPlanController)

const getPlan=express.Router();
getPlan.get('/get-plan',getPlanController)

const updatePlan=express.Router();
updatePlan.put('/update-plan',verify,updatePlanController)

const deletePlan=express.Router();
deletePlan.delete('/delete-plan/:id',verify,deletePlanController)


//      custom plan
const createCustomPlan=express.Router();
createCustomPlan.post('/create-custom-plan',verify,createCustomPlanController)

const getCustomPlan=express.Router();
getCustomPlan.get('/get-custom-plan',verify,getCustomPlanController)

const updateCustomPlan=express.Router();
updateCustomPlan.put('/update-custom-plan',verify,updateCustomPlanController)

const deleteCustomPlan=express.Router();
deleteCustomPlan.delete('/delete-custom-plan/:id',verify,deleteCustomPlanController)

export {createPlan,getPlan,updatePlan,deletePlan,createCustomPlan,getCustomPlan,updateCustomPlan,deleteCustomPlan}