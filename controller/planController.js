import Plan from "../models/Plan.js";

async function createPlanController(req,res) {
   
    const {name,price_of_month,price_of_year,feature}=req.body;
    try {
        const newPlan=await Plan.create({
            name,price_of_month,price_of_year,feature
        })
        if(!newPlan){
            return res.status(500).json({message:"plan not created",success:false})
        }
        return res.status(200).json({message:"Plan created",success:true})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:error.message,success:false})
    }
}

async function getPlanController(req,res) {
 
    try {
        const allPlan=await Plan.find()
        if(allPlan.length >0 ){
            return res.status(200).json({message:"Plan fetched",plans:allPlan,success:true})
        }
        return res.status(400).json({message:"plan not found",success:false})
    } catch (error) {
        return res.status(500).json({message:error.message,success:false})
    }
}

async function updatePlanController(req,res) {
    const {name,price_of_month,price_of_year,feature,id}=req.body;
    try {
        const newPlan=await Plan.findByIdAndUpdate(
            id, {
            name,price_of_month,price_of_year,feature
            },
            {new:true}
        )
        if(!newPlan){
            return res.status(500).json({message:"plan not updated",success:false})
        }
        return res.status(200).json({message:"Plan updatedeated",success:true})
    } catch (error) {
        return res.status(500).json({message:error.message,success:false})
    }
}

async function deletePlanController(req,res) {
    const id=req.params.id
    try {
        const deletePlan=await Plan.findByIdAndDelete(id)
        if(deletePlan ){
            return res.status(200).json({message:"Plan deleted",success:true})
        }
        return res.status(500).json({message:"plan not delete",success:false})
    } catch (error) {
        return res.status(500).json({message:error.message,success:false})
    }
}




export {createPlanController,getPlanController,updatePlanController,deletePlanController}