import User from "../models/employee/User.js"
import Cv from "../models/employee/Cv.js"
import Job from "../models/Job.js"
import SavedJob from "../models/employee/SaveJob.js"
import ApplyJob from "../models/employee/ApplyJob.js"
import Inofrmation from "../models/employee/Information.js"
import LoginUser from "../models/employee/ActiveUser.js"
import Subscription from "../models/employee/subscription.js"

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

        const data={ users,jobs,cvs,covers,saves,applies,jobRoles,jobLocation,}
        return res.status(200).json({
            message: "Data fetched",
           data,
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
        const expiredProUser = await Subscription.countDocuments({  plan: 'expired' });
        const allUser = await User.find();
        const totalUser=allUser.length;
        const maleUser = await Inofrmation.countDocuments({ gender: 'male' });
        const femaleUser = await Inofrmation.countDocuments({ gender: 'female' });
        const malePercentage = totalUser > 0 ? (maleUser / totalUser) * 100 : 0;
        const femalePercentage = totalUser > 0 ? (femaleUser / totalUser) * 100 : 0;
       
        const profileData = await Inofrmation.countDocuments()
        const profileComplete = allUser > 0 ? (profileData / allUser) * 100 : 0;
        const lastSixMonths = [];
        for (let i = 0; i < 6; i++) {
            const month = new Date();
            month.setMonth(month.getMonth() - i);
            lastSixMonths.push(month);
        }

       
        const freeUsersByMonth = await User.aggregate([
            {
                $match: {
                    plan: 'Free',
                    createdAt: { $gte: lastSixMonths[5] } // Start from 6 months ago
                }
            },
            {
                $group: {
                    _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": -1, "_id.month": -1 }
            },
            {
                $limit: 6
            },
            {
                $project: {
                    _id: 0,
                    year: "$_id.year",
                    month: "$_id.month",
                    count: 1
                }
            }
        ]);

        const proUsersByMonth = await User.aggregate([
            {
                $match: {
                    plan: 'Pro',
                    createdAt: { $gte: lastSixMonths[5] } // Start from 6 months ago
                }
            },
            {
                $group: {
                    _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": -1, "_id.month": -1 }
            },
            {
                $limit: 6
            },
            {
                $project: {
                    _id: 0,
                    year: "$_id.year",
                    month: "$_id.month",
                    count: 1
                }
            }
        ]);


        const expiredProUserByMonth = await Subscription.aggregate([
            {
                $match: {
                    status: 'expired',
                    createdAt: { $gte: lastSixMonths[5] } // Start from 6 months ago
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": -1, "_id.month": -1 }
            },
            {
                $limit: 6 
            },
            {
                $project: {
                    _id: 0,
                    year: "$_id.year",
                    month: "$_id.month",
                    count: 1
                }
            }
        ]);

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
        // Get day-wise signup counts for the last 6 days
        const daywiseSignup = [];
        for (let i = 5; i >= 0; i--) {
            const pastDate = new Date(today);
            pastDate.setDate(today.getDate() - i);
            const startOfDay = new Date(pastDate.setHours(0, 0, 0, 0));
            const endOfDay = new Date(pastDate.setHours(23, 59, 59, 999));
            const daySignups = await User.countDocuments({
                createdAt: { $gte: startOfDay, $lte: endOfDay }
            });
            daywiseSignup.push(daySignups);
        }

        // Get week-wise signup counts for the last 6 weeks
        const weekwiseSignup = [];
        for (let i = 5; i >= 0; i--) {
            const pastWeekStart = new Date(today);
            pastWeekStart.setDate(today.getDate() - (i * 7));  // Start of the week
            pastWeekStart.setHours(0, 0, 0, 0);
            const pastWeekEnd = new Date(today);
            pastWeekEnd.setDate(today.getDate() - ((i - 1) * 7));  // End of the week
            pastWeekEnd.setHours(23, 59, 59, 999);

            const weekSignups = await User.countDocuments({
                createdAt: { $gte: pastWeekStart, $lte: pastWeekEnd }
            });
            weekwiseSignup.push(weekSignups);
        }
        // profile completion rate

        const data = { freeUser, proUser, dailyActiveUser,daywiseSignup,weekwiseSignup,freeUsersByMonth,proUsersByMonth, profileComplete,expiredProUserByMonth, dailySignup, weeklySignup, malePercentage, femalePercentage, expiredProUser }
        return res.status(200).json({ message: 'user insight fetch', data, success: true })
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false })
    }
}

async function applicationFunnelController(req, res) {
    try {
        const jobData = await Job.aggregate([
            {
                $group: {
                    _id: {
                        category: "$category",  // Group by category
                        role: "$role",          // Group by role
                        location: "$location"   // Group by location
                    },
                    userCount: { $sum: 1 }  // Count the number of jobs for each category-role-location combination
                }
            },
            {
                $sort: { userCount: -1 }  // Sort by userCount in descending order
            },
            {
                $limit: 10  // Get the top 10 combinations
            },
            {
                $project: {
                    category: "$_id.category",  // Extract category from _id
                    role: "$_id.role",          // Extract role from _id
                    location: "$_id.location",  // Extract location from _id
                    userCount: 1,
                    _id: 0  // Exclude the _id field from the result
                }
            }
        ]);

        return res.status(200).json({ message: "Top job categories, roles, and locations fetched", jobData, success: true });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}




export { systemHealthController, userInsightController, applicationFunnelController };
