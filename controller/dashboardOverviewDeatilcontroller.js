import ApplyJob from "../models/employee/ApplyJob.js";
import SavedJob from "../models/employee/SaveJob.js";

async function getAllAppliedJobController(req,res) {
    try {
        const getApplyJob=await ApplyJob.find().populate('job_id').populate('user_id');
        if(getApplyJob.length > 0){
            return res.status(200).json({ message: "apply job fetched", applidJob:getApplyJob,success: true });
        }
        return res.status(500).json({ message: "No apply job found", success: false });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}

async function getAllSavedJobController(req, res) {
    try {
        const savedJobs = await SavedJob.find()
            .populate('job_id')    // Populate job details
            .populate('user_id');  // Populate user details

        if (savedJobs.length > 0) {
            return res.status(200).json({
                message: "Saved jobs fetched",
                savedJob: savedJobs,
                success: true
            });
        }

        return res.status(404).json({ message: "No saved jobs found", success: false });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}

async function getCvStatsController(req, res) {
    try {
      const data = await Cv.aggregate([
        {
          $lookup: {
            from: 'user', // the MongoDB collection name (not model name)
            localField: 'user_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: '$user'
        },
        {
          $group: {
            _id: '$user_id',
            name: { $first: '$user.first_name' },
            email: { $first: '$user.email' },
            total_cv_files: {
              $sum: {
                $cond: [{ $ifNull: ['$cv_file', false] }, 1, 0]
              }
            },
            total_cover_files: {
              $sum: {
                $cond: [{ $ifNull: ['$cover_file', false] }, 1, 0]
              }
            },
            total_uploads: { $sum: 1 }
          }
        },
        {
          $sort: { total_uploads: -1 } // optional: sort by most uploads
        }
      ]);
  
      res.status(200).json({
        message: 'CV stats fetched successfully',
        success: true,
        data
      });
    } catch (error) {
      res.status(500).json({ message: error.message, success: false });
    }
  }
  

export {getAllAppliedJobController,getAllSavedJobController,getCvStatsController}