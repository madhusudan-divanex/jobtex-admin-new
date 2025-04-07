import User from "../models/employee/User.js"
import Cv from "../models/employee/Cv.js"
import Job from "../models/Job.js"
import SavedJob from "../models/employee/SaveJob.js"
import ApplyJob from "../models/employee/ApplyJob.js"
import Inofrmation from "../models/employee/Information.js"
import LoginUser from "../models/employee/ActiveUser.js"

async function systemHealthController(req, res) {

    const { fromDate, toDate } = req.body;
    try {

        // Prepare a date range filter (if provided), otherwise no filter
        let dateFilter = {};
        if (fromDate) {
            dateFilter.createdAt = { $gte: new Date(fromDate) };
        }
        if (toDate) {
            dateFilter.createdAt = {
                ...dateFilter.createdAt,
                $lte: new Date(toDate),
            };
        }


        const totalUser = await User.countDocuments(dateFilter);
        const totalJobs = await Job.countDocuments(dateFilter);
        const totalCvGen = await Cv.countDocuments({
            ...dateFilter,
            cv_file: { $exists: true, $ne: null },
        });
        const totalCoverGen = await Cv.countDocuments({
            ...dateFilter,
            cover_file: { $exists: true, $ne: null },
        });
        const totalSavedJob = await SavedJob.countDocuments(dateFilter);
        const totalAppliedJob = await ApplyJob.countDocuments(dateFilter);

        const totalJobRole = await Job.distinct("role", dateFilter).then(roles => roles.length);
        const totalJobLocation = await Job.distinct("location", dateFilter).then(locations => locations.length);


        const users = totalUser;
        const jobs = totalJobs;
        const cvs = totalCvGen;
        const covers = totalCoverGen;
        const saves = totalSavedJob;
        const applies = totalAppliedJob;
        const jobRoles = totalJobRole;
        const jobLocation = totalJobLocation;


        return res.status(200).json({
            message: "Data fetched",
            users,
            jobs,
            cvs,
            covers,
            saves,
            applies,
            jobRoles,
            jobLocation,
            success: true
        });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}

async function userInsightController(req, res) {
    try {
        const freeUser = await User.countDocuments({ plan: 'Free' });
        const proUser = await User.countDocuments({ plan: 'Pro' });
        const expiredProUser = await User.countDocuments({ isPro: true, plan: 'Free' });
        const allUser = await User.find();
        const maleUser = await Inofrmation.countDocuments({ plan: 'male' });
        const femaleUser = await Inofrmation.countDocuments({ gender: 'female' });
        const malePercentage = allUser > 0 ? (maleUser / allUser) * 100 : 0;
        const femalePercentage = allUser > 0 ? (femaleUser / allUser) * 100 : 0;
        const profileData = await Inofrmation.countDocuments()
        const profileComplete = allUser > 0 ? (profileData / allUser) * 100 : 0;

        // daily weekly signup
        const today = new Date();
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(today.getDate() - 7);
        const yesterdayStart = new Date(today);
        yesterdayStart.setDate(today.getDate() - 1);
        yesterdayStart.setHours(0, 0, 0, 0);
        const yesterdayEnd = new Date(today);
        yesterdayEnd.setDate(today.getDate() - 1);
        yesterdayEnd.setHours(23, 59, 59, 999);
        const weeklySignup = await User.find({
            createdAt: { $gte: oneWeekAgo }
        });
        const dailySignup = await User.find({
            createdAt: { $gte: yesterdayStart, $lte: yesterdayEnd }
        });

        // daily active user
        // daily active users
        const dailyActiveUser = await LoginUser.countDocuments({
            createdAt: { $gte: yesterdayStart, $lte: yesterdayEnd }
        });

        // profile completion rate

        const data = { freeUser, proUser, dailyActiveUser, profileComplete, dailySignup, weeklySignup, malePercentage, femalePercentage, expiredProUser }
        return res.status(200).json({ message: 'user insight fetch', data, success: true })
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}

async function applicationFunnelController(req, res) {
    try {
        const topCategory = await Job.aggregate([
            {
                $group: {
                    _id: "$category",  // Group by job category
                    count: { $sum: 1 }  // Count the number of jobs per category
                }
            },
            {
                $sort: { count: -1 }  // Sort by count in descending order
            },
            {
                $limit: 10  // Get the top 10 categories
            },
            {
                $project: {
                    category: "$category",  // Rename _id to category
                    count: 1,
                    _id: 0  // Exclude the _id field from the result
                }
            }
        ]);
        const topJobRoleLocationCombo = await Job.aggregate([
            {
                $group: {
                    _id: {
                        role: "$role",  // Group by job role
                        location: "$location" // Group by location
                    },
                    userCount: { $sum: 1 }  // Count the number of jobs per combination
                }
            },
            {
                $sort: { userCount: -1 }  // Sort by the user count in descending order
            },
            {
                $limit: 10  // Get the top 10 combinations
            },
            {
                $project: {
                    role: "$_id.role",  // Extract jobRole from _id
                    location: "$_id.location",  // Extract location from _id
                    userCount: 1,
                    _id: 0
                }
            }
        ]);
        return res.status(200).json({ message: "total job and role fetched", topCategory, topJobRoleLocationCombo, success: true })
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}



export { systemHealthController, userInsightController, applicationFunnelController };
