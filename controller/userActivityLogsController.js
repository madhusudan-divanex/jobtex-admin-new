import Subscription from "../models/employee/subscription.js"
import User from "../models/employee/User.js"

async function perUserActivityController(req, res) {
    try {
        const mergedData = await User.aggregate([
            
            {
                $lookup: {
                    from: "cv",  // The name of the collection (make sure it matches the actual collection name)
                    localField: "_id",  // The field in the User collection (usually _id)
                    foreignField: "user_id",  // The field in the Cv collection that references User (assuming it's userId)
                    as: "userCv"  // Alias for the Cv data
                }
            },
          
            {
                $addFields: {
                    cvCount: { $size: "$userCv" }  
                }
            },
            
            {
                $lookup: {
                    from: "apply job",  
                    localField: "_id",  
                    foreignField: "user_id",  
                    as: "userAppliedJob"  
                }
            },
            {
                $addFields: {
                    applyCount: { $size: "$userAppliedJob" }  
                }
            },
           
            {
                $lookup: {
                    from: "information",  
                    localField: "_id",  
                    foreignField: "user_id",  
                    as: "userProfileEdit"  
                }
            },
           
            {
                $lookup: {
                    from: "subscription",  
                    localField: "_id",  
                    foreignField: "user_id",  
                    as: "userSubscription"  
                }
            },
            {
                $addFields: {
                    subscriptionCount: { $size: "$userSubscription" }  
                }
            },
            {
                $unwind: {
                    path: "$userSubscription",
                    preserveNullAndEmptyArrays: true  
                }
            },
            {
                $unwind: {
                    path: "$userAppliedJob",
                    preserveNullAndEmptyArrays: true 
                }
            },
            {
                $unwind: {
                    path: "$userProfileEdit",
                    preserveNullAndEmptyArrays: true 
                }
            }
        ]);

        const data = { mergedData };
        return res.status(200).json({ message: "Per user activity data fetched", data, success: true });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}


export {perUserActivityController}