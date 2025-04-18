import LoginUser from "../models/employee/ActiveUser.js"
import ApplyJob from "../models/employee/ApplyJob.js"
import Generated from "../models/employee/GeneratedCv.js"
import Information from "../models/employee/Information.js"
import SavedJob from "../models/employee/SaveJob.js"
import User from "../models/employee/User.js"

async function userListController(req, res) {
    try {
        // const generalDetail=await User.find()
        // const informationDetail=await Information.find()
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
                as: "lastActive"
              }
            },
            {
              $lookup: {
                from: "information",
                localField: "_id",
                foreignField: "user_id",
                as: "informationData"
              }
            },
            {
              $lookup: {
                from: "educations",
                localField: "_id",
                foreignField: "user_id",
                as: "educationData"
              }
            },
            {
              $addFields: {
                profileCompletion: {
                  $add: [
                    {
                      $cond: [
                        { $gt: [{ $size: "$informationData" }, 0] },
                        50,
                        0
                      ]
                    },
                    {
                      $cond: [
                        { $gt: [{ $size: "$educationData" }, 0] },
                        50,
                        0
                      ]
                    }
                  ]
                }
              }
            },
            {
              $unwind: {
                path: "$informationData",
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $unwind: {
                path: "$lastActive",
                preserveNullAndEmptyArrays: true
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
        const informationDetail=await Information.findOne(id)
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