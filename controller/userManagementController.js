import LoginUser from "../models/employee/ActiveUser.js"
import ApplyJob from "../models/employee/ApplyJob.js"
import Generated from "../models/employee/GeneratedCv.js"
import Inofrmation from "../models/employee/Information.js"
import SavedJob from "../models/employee/SaveJob.js"
import User from "../models/employee/User.js"

async function userListController(req, res) {
    try {
        // const generalDetail=await User.find()
        // const informationDetail=await Inofrmation.find()
        const mergeData = await User.aggregate([
            {
                $lookup: {
                    from: "login_users", 
                    let: { userId: "$_id" }, 
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$user_id", "$$userId"] } 
                            }
                        }
                    ],
                    as: "lastActive"  // This will contain the matched data
                }
            },
            {
                $lookup: {
                    from: "information",  // The name of the information collection
                    localField: "_id",    // The field to join from the User collection (ObjectId)
                    foreignField: "user_id",  // The field in the information collection to join (ObjectId)
                    as: "userInformation"  // Alias for the user information
                }
            },
            {
                $unwind: {
                    path: "$userInformation",  // Unwind the userInformation array
                    preserveNullAndEmptyArrays: true  // Keep the array even if there are no matches
                }
            },
            {
                $unwind: {
                    path: "$lastActive",  // Unwind the lastActive array
                    preserveNullAndEmptyArrays: true  // Keep the array even if there are no matches
                }
            }
        ]);
     
        return res.status(200).json({ message: 'data fetched',data:mergeData, success: true })
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }

}

async function userDetailController(req,res) {
    const id=req.params.id
    try {
        const generalDetail=await User.findOne(id)
        const informationDetail=await Inofrmation.findOne(id)
        const lastActive=await LoginUser.findOne({_id:id}).select('createdAt')
        const appliedJob=await ApplyJob.find(id)
        const savedJob=await SavedJob.find(id)
        const generateCv=await Generated.find(id)
        const data={generalDetail,informationDetail,lastActive,generateCv,appliedJob,savedJob}
        return res.status(200).json({ message: 'user detail fetched',data, success: true })
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}

async function grantProController(req,res) {
    const id=req.params.id
    try {
        const grantpro=await User.findByIdAndUpdate(id,{plan:'Pro'},{new:true})
        if(grantpro){
            return res.status(500).json({ message: "pro not granted", success: false })
        }
        return res.status(200).json({ message: "pro granted", success: true })
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}

async function userActionController(req, res) {
    const id=req.params.id
    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        const newStatus = user.account_status === 'suspend' ? 'active' : 'suspend';
        const changeStatus = await User.findByIdAndUpdate(id, { account_status: newStatus }, { new: true })

        if(!changeStatus){
            return res.status(500).json({ message: "An error occurred ", success: false })
        }

        return res.status(200).json({ message: 'action success', success:true })
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }

}

export { userListController,userDetailController,userActionController, grantProController, }