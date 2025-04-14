import User from "../models/employee/User.js"
import Cv from "../models/employee/Cv.js"
import Job from "../models/Job.js"
import SavedJob from "../models/employee/SaveJob.js"
import ApplyJob from "../models/employee/ApplyJob.js"
import Information from "../models/employee/Information.js"
import LoginUser from "../models/employee/ActiveUser.js"
import Subscription from "../models/employee/subscription.js"
import moment from "moment"
import Education from "../models/employee/Education.js"

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

        const data = { users, jobs, cvs, covers, saves, applies, jobRoles, jobLocation, }
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
        const expiredProUser = await Subscription.countDocuments({ status: 'expired' });
        const allUser = await User.find();
        const totalUser = allUser.length;
        const maleUser = await Information.countDocuments({ gender: 'male' });
        const femaleUser = await Information.countDocuments({ gender: 'female' });

        const totalWithGender = maleUser + femaleUser;

        const malePercentage = totalWithGender > 0 ? (maleUser / totalWithGender) * 100 : 0;
        const femalePercentage = totalWithGender > 0 ? (femaleUser / totalWithGender) * 100 : 0;

        // const profileData = await Information.countDocuments()
        // const profileComplete = totalUser > 0 ? parseFloat(((profileData / totalUser) * 100).toFixed(2)) : 0;
        const profileComplete = await profileData()

        const lastSixMonths = [];
        for (let i = 0; i < 6; i++) {
            const month = new Date();
            month.setMonth(month.getMonth() - i);
            month.setDate(1);  // Ensure we're at the start of the month
            lastSixMonths.push(month);
        }
        const lastSixMonthsExpire = [];
        for (let i = 0; i < 6; i++) {
            const month = new Date();
            month.setMonth(month.getMonth() - i);
            month.setDate(1);  // Ensure we're at the start of the month
            // lastSixMonths.push(month);
            lastSixMonthsExpire.push({
                year: month.getFullYear(),
                month: month.getMonth() + 1, // month is 0-indexed, so we add 1 to it
            });
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
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const expiredProUserByMonth = await Subscription.aggregate([
            {
                $match: {
                    status: 'expired',
                    end_date: { $gte: lastSixMonths[5] }
                }
            },
            {
                $group: {
                    _id: { year: { $year: "$end_date" }, month: { $month: "$end_date" } },
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
        const expireResult = lastSixMonthsExpire.map((month) => {
            const found = expiredProUserByMonth.find(
                (data) => data.year === month.year && data.month === month.month
            );
            return found ? { ...found, month: monthNames[found.month - 1] } : { year: month.year, month: monthNames[month.month - 1], count: 0 };
        });

        let profileCompleteData = [];

        for (let i = 5; i >= 0; i--) {
            const start = moment().subtract(i, 'months').startOf('month').toDate();
            const end = moment().subtract(i, 'months').endOf('month').toDate();

            // Step 1: Get all users created in this month
            const users = await User.find({ createdAt: { $gte: start, $lte: end } }).select('_id');
            const userIds = users.map(user => user._id);
            const totalUsers = userIds.length;

            // Step 2: Get which users have Information and Education
            const infoUsers = await Information.find({ user_id: { $in: userIds } }, 'user_id');
            const eduUsers = await Education.find({ user_id: { $in: userIds } }, 'user_id');

            const infoUserIds = new Set(infoUsers.map(u => u.user_id.toString()));
            const eduUserIds = new Set(eduUsers.map(u => u.user_id.toString()));

            // Step 3: Score each user and calculate completion
            let completedUsers = 0;
            let totalScore = 0;

            userIds.forEach(id => {
                const idStr = id.toString();
                const hasInfo = infoUserIds.has(idStr);
                const hasEdu = eduUserIds.has(idStr);

                if (hasInfo && hasEdu) {
                    totalScore += 100;
                    completedUsers++;
                } else if (hasInfo || hasEdu) {
                    totalScore += 50;
                    completedUsers++;
                }
            });

            const percentage = totalUsers > 0 ? parseFloat((totalScore / totalUsers).toFixed(2)) : 0;

            // Step 4: Push into result array
            profileCompleteData.push({
                month: moment(start).format('MMM YYYY'),
                totalUsers,
                completedProfiles: completedUsers, // users with at least partial profile
                percentage
            });
        }




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

        // daily active user
        const result = [];


        for (let i = 0; i < 7; i++) {
            const startOfDay = new Date(today);
            startOfDay.setDate(today.getDate() - i);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(today);
            endOfDay.setDate(today.getDate() - i);
            endOfDay.setHours(23, 59, 59, 999);


            const activeUserCount = await LoginUser.countDocuments({
                createdAt: { $gte: startOfDay, $lte: endOfDay }
            });


            const dayLabel = i === 0 ? "Today" : (i === 1 ? "Yesterday" : `Day ${i} ago`);
            result.push({ day: dayLabel, activeUsers: activeUserCount });
        }




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
        const dailyActiveUser = result

        const data = { freeUser, proUser, dailyActiveUser, daywiseSignup, weekwiseSignup, profileCompleteData, freeUsersByMonth, proUsersByMonth, profileComplete, expireResult, malePercentage, femalePercentage, expiredProUser }
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
            // {
            //     $limit: 10  // Get the top 10 combinations
            // },
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

async function expireProController(req, res) {
    try {
      const getAllExpiredUser = await Subscription.find({
       
        status: 'expired'
      })
        .populate('user_id', 'first_name email')  // Populate user fields
         //.populate('plan_id', 'name');  // Populate the plan name based on plan_id
  
      return res.status(200).json({
        message: "Users fetched",
        success: true,
        data: getAllExpiredUser
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: error.message,
        success: false
      });
    }
  }
  
async function getActiveUserController(req,res) {
    try {
        const getActiveUser=await LoginUser.find().populate('user_id','first_name email')
        return res.status(200).json({ message:"active user fetched", success: true,data:getActiveUser });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}

async function profileData() {
    // Step 1: Get all user IDs
    const allUser = await User.find({}, '_id');
    const userIds = allUser.map(user => user._id);

    // Step 2: Get users with Information
    const infoUsers = await Information.find({ user_id: { $in: userIds } }, 'user_id');
    const infoUserIds = new Set(infoUsers.map(i => i.user_id.toString()));

    // Step 3: Get users with Education
    const eduUsers = await Education.find({ user_id: { $in: userIds } }, 'user_id');
    const eduUserIds = new Set(eduUsers.map(e => e.user_id.toString()));

    // Step 4: Calculate average profile completion
    let totalCompletionScore = 0;

    userIds.forEach(id => {
        const idStr = id.toString();
        const hasInfo = infoUserIds.has(idStr);
        const hasEdu = eduUserIds.has(idStr);

        if (hasInfo && hasEdu) {
            totalCompletionScore += 100;
        } else if (hasInfo || hasEdu) {
            totalCompletionScore += 50;
        }
    });
    const totalUser = userIds.length;

    const result = totalUser > 0 ? parseFloat((totalCompletionScore / totalUser).toFixed(2)) : 0;
    return result
}

export { systemHealthController, userInsightController, applicationFunnelController ,getActiveUserController,expireProController};
