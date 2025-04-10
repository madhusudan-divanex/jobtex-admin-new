import Subscription from "../models/employee/subscription.js";
import User from "../models/employee/User.js";

async function manualUpDownController(req,res) {
    const {user_id,plan_id}=req.body;
    try {
        const findUser=await User.findOne({_id:id})
        if(findUser){
            const updateUserPlan=await Subscription.findOneAndUpdate({user_id},{plan_id},{new:true})
            if(!updateUserPlan){
                return res.status(500).json({ message: "User plan not updated", success: false });
            }
            return res.status(200).json({ message: "Plan of User is updated", success: true });
        }
        return res.status(500).json({ message: "user not found", success: false });

    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
    
}

async function grantCustomPlanController(req,res) {
    const {user_id,customPlan_id}=req.body;
    try {
        const findUser=await User.findOne({_id:id})
        if(findUser){
            const updateUserPlan=await Subscription.findOneAndUpdate({user_id},{ customPlan_id},{new:true})
            if(!updateUserPlan){
                return res.status(500).json({ message: "User plan not updated", success: false });
            }
            return res.status(200).json({ message: "Plan of User is updated", success: true });
        }
        return res.status(500).json({ message: "user not found", success: false });

    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
    
}
export {manualUpDownController,grantCustomPlanController}