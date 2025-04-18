import Certification from "../models/employee/Certification.js";
import Cv from "../models/employee/Cv.js";
import Education from "../models/employee/Education.js";
import Experience from "../models/employee/Experience.js";
import Information from "../models/employee/Information.js";
import Language from "../models/employee/Language.js";
import User from "../models/employee/User.js";
import fs from 'fs';
import Role from "../models/Role.js";
import path from 'path';
import Subscription from "../models/employee/subscription.js";
import Plan from "../models/Plan.js";
import SavedJob from "../models/employee/SaveJob.js";
import ApplyJob from "../models/employee/ApplyJob.js";
import Job from "../models/Job.js";
import mongoose from "mongoose";
import Report from "../models/Report.js";

async function createProfileController(req, res) {
    console.log(req.body)

    const { first_name, last_name, current_salary, cs_currency, expected_salary, es_currency, email, phone, marital_status, gender, dob, user_id } = req.body;
    try {
        const findProfile = await User.find({ _id: user_id })
        if (findProfile) {
            const verifyProfile = await User.findByIdAndUpdate({ _id: user_id }, { isVerify: true }, { new: true })
            const newProfile = await Information.create({
                first_name, last_name, current_salary, cs_currency, expected_salary, es_currency, email, phone, marital_status, gender, dob, user_id
            })

            if (!newProfile) {
                return res.status(500).json({ message: "profile creation failed", success: false })
            }
            return res.status(200).json({ profile: newProfile, message: "profile creation success", success: true })
        }
        return res.status(500).json({ message: "please do signup first", success: false })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message, success: false })
    }

}


async function getEmployeedataController(req, res) {
    const id = req.params.id;
  
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "No user found", success: false });
      }
  
      const user_id = user._id;
  
      // Check & update subscription status
      const subscription = await Subscription.findOne({ user_id });
      if (subscription) {
        const currentDate = new Date();
        if (subscription.end_date < currentDate && subscription.status !== 'expired') {
          subscription.status = 'expired';
          await subscription.save();
        }
      }
  
      // Fetch user info
      const personal = await Information.findOne({ user_id });
      const education = await Education.find({ user_id });
      const experience = await Experience.find({ user_id });
      const certification = await Certification.find({ user_id });
      const language = await Language.find({ user_id });
      const cvCount = await Cv.countDocuments({ user_id });
      const favouriteJobCount = await SavedJob.countDocuments({ user_id });
      const appliedJobCount = await ApplyJob.countDocuments({ user_id });
      const totalJobCount = await Job.countDocuments();
      const planData = await Subscription.find({ user_id });
  
      // Fetch saved jobs
      let favouriteJobDetails = await SavedJob.aggregate([
        { $match: { user_id: new mongoose.Types.ObjectId(user_id) } },
        {
          $lookup: {
            from: "jobs",
            localField: "job_id",
            foreignField: "_id",
            as: "jobDetails"
          }
        },
        { $unwind: "$jobDetails" }
      ]);
  
      // Fetch applied jobs
      let applyJobDetails = await ApplyJob.aggregate([
        { $match: { user_id: new mongoose.Types.ObjectId(user_id) } },
        {
          $lookup: {
            from: "jobs",
            localField: "job_id",
            foreignField: "_id",
            as: "jobDetails"
          }
        },
        { $unwind: "$jobDetails" }
      ]);
  
      // If personal info and experience exist, calculate matching scores dynamically
      if (personal && experience.length > 0) {
        const userSkills = personal.skill || [];
        const totalUserExperience = calculateTotalExperience(experience);
  
        // For Saved Jobs
        favouriteJobDetails = favouriteJobDetails.map(favJob => {
          const jobSkills = favJob.jobDetails.skills || [];
          const jobExp = favJob.jobDetails.experience || 0;
  
          const matchedSkills = userSkills.filter(skill =>
            jobSkills.some(jobSkill => jobSkill.toLowerCase() === skill.toLowerCase())
          );
  
          const skillMatch = jobSkills.length > 0
            ? (matchedSkills.length / jobSkills.length) * 100
            : 0;
  
          const experienceMatch = jobExp > 0
            ? Math.min((totalUserExperience / jobExp) * 100, 100)
            : 100;
  
          const overallMatch = (skillMatch * 0.7 + experienceMatch * 0.3);
  
          return {
            ...favJob,
            overallMatch: Math.round(overallMatch),
            skillMatch: Math.round(skillMatch),
            experienceMatch: Math.round(experienceMatch)
          };
        });
  
        // For Applied Jobs
        applyJobDetails = applyJobDetails.map(appliedJob => {
          const jobSkills = appliedJob.jobDetails.skills || [];
          const jobExp = appliedJob.jobDetails.experience || 0;
  
          const matchedSkills = userSkills.filter(skill =>
            jobSkills.some(jobSkill => jobSkill.toLowerCase() === skill.toLowerCase())
          );
  
          const skillMatch = jobSkills.length > 0
            ? (matchedSkills.length / jobSkills.length) * 100
            : 0;
  
          const experienceMatch = jobExp > 0
            ? Math.min((totalUserExperience / jobExp) * 100, 100)
            : 100;
  
          const overallMatch = (skillMatch * 0.7 + experienceMatch * 0.3);
  
          return {
            ...appliedJob,
            overallMatch: Math.round(overallMatch),
            skillMatch: Math.round(skillMatch),
            experienceMatch: Math.round(experienceMatch)
          };
        });
      }
  
      // Final response
      return res.status(200).json({
        user,
        personal,
        favouriteJobDetails,
        applyJobDetails,
        planData,
        education,
        totalJobCount,
        experience,
        certification,
        language,
        cvCount,
        favouriteJobCount,
        appliedJobCount,
        message: "User data fetched",
        success: true
      });
  
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message, success: false });
    }
  }
  
async function favouriteJobController(req, res) {

    const { job_title, location, user_id } = req.body;
    console.log(req.body)
    try {
        const findUser = await User.find({ _id: user_id })
        if (findUser.length > 0) {
            const updateFavourite = await Information.findOneAndUpdate({ user_id }, { job_title, location }, { new: true })



            if (!updateFavourite) {
                return res.status(500).json({ message: "job and location added failed", success: false })
            }
            return res.status(200).json({ message: "job and location added", success: true })
        }
        return res.status(500).json({ message: "please do signup first", success: false })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message, success: false })
    }

}

async function createDetailController(req, res) {
    console.log(req.body);

    const { educationForm, workExperienceForm, certificationForm, languageForm, skillForm } = req.body;
    const user_id = educationForm[0]?.user_id; // Assuming that user_id is in the first element of educationForm

    try {
        const findUser = await User.findOne({ _id: user_id });
        if (!findUser) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        let isEducation = false;
        let isExperience = false;
        let isCertification = false;
        let isLanguage = false;
        let isSkill = false;

        // Check if there is any data in the form arrays
        if (educationForm.length > 0) isEducation = true;
        if (workExperienceForm.length > 0) isExperience = true;
        if (certificationForm.length > 0) isCertification = true;
        if (languageForm.length > 0) isLanguage = true;
        if (skillForm.skill.length > 0) isSkill = true; // Corrected here to check skillForm.skill.length

        // Handle education entries
        if (isEducation) {
            const educationEntries = educationForm.map(edu => ({
                ...edu,
                user_id,
            }));
            await Education.insertMany(educationEntries);
        }

        // Handle work experience entries
        if (isExperience) {
            const experienceEntries = workExperienceForm.map(exp => ({
                ...exp,
                user_id,
            }));
            await Experience.insertMany(experienceEntries);
        }

        // Handle certification entries
        if (isCertification) {
            const certificationEntries = certificationForm.map(cer => ({
                ...cer,
                user_id,
            }));
            await Certification.insertMany(certificationEntries);
        }

        // Handle language entries
        if (isLanguage) {
            const languageEntries = languageForm.map(lan => ({
                ...lan,
                user_id,
            }));
            await Language.insertMany(languageEntries);
        }

        // Handle skill updates
        if (isSkill) {
            await User.findByIdAndUpdate(
                { _id: user_id },
                { $set: { skill: skillForm.skill } }, // Update the skills array
                { new: true }
            );
        }

        return res.status(200).json({ message: "All added successfully", success: true });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message, success: false });
    }
}


async function updateDetailController(req, res) {

    const { user_id } = req.body;
    const { educationForm, detailForm, experienceForm, certificationForm, languageForm, skillForm, userForm } = req.body;

    try {

        const findUser = await User.findOne({ _id: user_id });
        if (!findUser) {
            return res.status(404).json({ message: "User not found", success: false });
        }


        let isEducationUpdated = false;
        let isExperienceUpdated = false;
        let isCertificationUpdated = false;
        let isLanguageUpdated = false;
        let isSkillUpdated = false;
        let isDetailUpdated = false


        if (educationForm) {
            isEducationUpdated = true;
            const eduForm = JSON.parse(educationForm)
            await Education.deleteMany({ user_id });
            const educationEntries = eduForm.map(edu => ({
                ...edu,
                user_id,
            }));
            await Education.insertMany(educationEntries);
        }


        if (experienceForm) {
            isExperienceUpdated = true;
            const expForm = JSON.parse(experienceForm)
            await Experience.deleteMany({ user_id });
            const experienceEntries = expForm.map(exp => ({
                ...exp,
                user_id,
            }));
            await Experience.insertMany(experienceEntries);
        }


        if (certificationForm) {
            isCertificationUpdated = true;
            const cerForm = JSON.parse(certificationForm)
            await Certification.deleteMany({ user_id });
            const certificationEntries = cerForm.map(cer => ({
                ...cer,
                user_id,
            }));
            await Certification.insertMany(certificationEntries);
        }


        if (languageForm) {
            isLanguageUpdated = true;
            const lanForm = JSON.parse(languageForm)
            await Language.deleteMany({ user_id });
            const languageEntries = lanForm.map(lan => ({
                ...lan,
                user_id,
            }));
            await Language.insertMany(languageEntries);
        }


        if (skillForm) {
            isSkillUpdated = true;
            const skForm = JSON.parse(skillForm)

            await User.findByIdAndUpdate({ _id: user_id }, { skill: skForm }, { new: true });
        }

        if (detailForm) {
            isDetailUpdated = true;
            const detForm = JSON.parse(detailForm)
            const findPhoto = await Information.find({ user_id })

            let newFilePath = findPhoto.company_photo; // Default to existing photo

            // If a new file was uploaded
            if (req.files && req.files["profile_url"] && req.files["profile_url"][0]) {
                const file = req.files["profile_url"][0];
                newFilePath = file.path;

                // Delete old photo if it exists
                if (findPhoto[0].profile_url && fs.existsSync(findPhoto[0].profile_url)) {
                    console.log("calling")
                    fs.unlinkSync(findPhoto[0].profile_url);
                }
            }

            await Information.findOneAndUpdate({ user_id },
                {
                    profile_url: newFilePath, about_me: detForm.about_me, first_name: detForm.first_name, last_name: detForm.last_name, phone: detForm.phone, current_salary: detForm.current_salary, cs_currency: detForm.cs_currency, expected_salary: detForm.expected_salary
                    , es_currency: detForm.es_currency, marital_status: detForm.marital_status, gender: detForm.gender, dob: detForm.dob, job_title: detForm.job_title, skill: detForm.skill, employeer_skill: detForm.employeer_skill, location: detForm.location
                }, { new: true });
            await User.findByIdAndUpdate({ _id: user_id }, { first_name: detForm.first_name, last_name: detForm.last_name }, { new: true })

        }
        const usForm = JSON.parse(userForm)
        const checkEmail = await User.findByIdAndUpdate({ _id: user_id }, { email: usForm.email }, { new: true })


        return res.status(200).json({ message: "Profile updated successfully", success: true });

    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}

async function buyPlanController(req, res) {

    const { subscription_id, start_date, end_date, status, user_id } = req.body;

    try {
        const findUser = await Subscription.find({ user_id: user_id })
        const planData = await Plan.find({ _id: subscription_id });

        const planName = planData[0].name

        if (findUser.length > 0) {
            await Subscription.deleteOne({ user_id: user_id })
        }
        const newSubscription = await Subscription.create({
            plan_id: subscription_id, start_date, end_date, status, user_id
        })

        if (!newSubscription) {
            return res.status(500).json({ message: "subscription creation failed", success: false })
        }
        if (planData.price_of_month !== 0) {
            const updateUserPlan = await User.findByIdAndUpdate({ _id: user_id }, { plan: planName, isPro: true }, { new: true })

        }
        else {

            const updateUserPlan = await User.findByIdAndUpdate({ _id: user_id }, { plan: planName }, { new: true })

        }
        return res.status(200).json({ subscription: newSubscription, message: "subscription creation success", success: true })
        //return res.status(500).json({ message: "please do signup first", success: false })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message, success: false })
    }

}

async function uploadCvController(req, res) {
    console.log(req.body)
    const { user_id, cv_file, cover_file } = req.body;
    try {
        const path = req.files["cv_file"] ? req.files["cv_file"][0].path : null;
        const coverPath = req.files["over_file"] ? req.files["cover_file"][0].path : null;
        const newCv = await Cv.create({
            user_id,

            cv_file: path,
            cover_file: coverPath
        })
        if (!newCv) {
            return res.status(500).json({ message: "cv not uploaded ", success: false })
        }
        return res.status(200).json({ message: "cv uploaded", success: true })
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}

async function updateCvController(req, res) {
    const { cv_file, cover_file, cv_id } = req.body;

    try {

        const existingCv = await Cv.findById(cv_id);
        if (!existingCv) {
            return res.status(404).json({ message: "CV not found", success: false });
        }
        if (cv_file) {
            const oldFilePath = existingCv.cv_file;
            if (!req.files || !req.files["cv_file"]) {
                return res.status(400).json({ message: "No file uploaded", success: false });
            }
            const newFilePath = req.files["cv_file"][0].path;
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
            existingCv.cv_file = newFilePath;
            await existingCv.save();
            return res.status(200).json({ message: "CV updated successfully", success: true, file: newFilePath });
        }
        if (cover_file) {


            const oldFilePath = existingCv.cv_file;
            if (!req.files || !req.files["cover_file"]) {
                return res.status(400).json({ message: "No file uploaded", success: false });
            }
            const newFilePath = req.files["cover_file"][0].path;
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
            existingCv.cover_file = newFilePath;
            await existingCv.save();
            return res.status(200).json({ message: "Cover updated successfully", success: true, file: newFilePath });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message, success: false });
    }
}

async function deleteCvController(req, res) {
    const { cv_id } = req.body;

    try {

        const cv = await Cv.findById(cv_id);

        if (!cv) {
            return res.status(404).json({ message: "CV not found", success: false });
        }

        const filePath = cv.cv_file;


        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        } else {
            console.log("File not found, skipping file deletion.");
        }
        await Cv.findByIdAndDelete(cv_id);

        return res.status(200).json({ message: "CV deleted successfully", success: true });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message, success: false });
    }
}

//          Job Controller
async function saveJobController(req, res) {
    const { user_id, job_id } = req.body
    try {
        const findJob = await Job.findById(job_id)
        if (findJob) {
            const addSaveJob = await SavedJob.create({ user_id, job_id })
            return res.status(200).json({ message: "save successfully", success: true });
        }
        return res.status(400).json({ message: "job not found", success: false });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}

async function removeSaveJobController(req, res) {
    const job_id = req.params.id

    try {
        const findJob = await SavedJob.findOne({ job_id: job_id })
        if (findJob) {
            const removeSaveJob = await SavedJob.findOneAndDelete({ job_id })
            return res.status(200).json({ message: "remove save successfully", success: true });
        }
        return res.status(400).json({ message: "job not found", success: false });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message, success: false });
    }
}

async function applyJobController(req, res) {
    const { user_id, job_id } = req.body
    try {
        const findJob = await Job.findById(job_id)
        if (findJob) {
            const addSaveJob = await ApplyJob.create({ user_id, job_id })
            return res.status(200).json({ message: "applied successfully", success: true });
        }
        return res.status(400).json({ message: "job not found", success: false });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}

async function createReportController(req, res) {
    const { user_id, subject, message, attachment } = req.body
    console.log(req.body)
    try {
        const findUser = await User.findOne({ _id: user_id })
        if (findUser) {
            const path = req.files["attachment"] ? req.files["attachment"][0].path : null;
            const addReport = await Report.create({ user_id, subject, message, attachment: path })
            return res.status(200).json({ message: "contact successfully", success: true });
        }
        return res.status(400).json({ message: "user not found", success: false });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}


async function getAllJobDataController(req, res) {
    const user_id = req.params.id;
    try {
        const userInfo = await Information.findOne({ user_id });
        const userSkills = userInfo?.skill || [];

        const userExpData = await Experience.find({ user_id });
        const userExperienceList = userExpData || [];

        const allJobs = await Job.find();

        if (allJobs.length === 0) {
            return res.status(404).json({ message: "No jobs found", success: false });
        }

        const totalUserExperience = calculateTotalExperience(userExperienceList);

        // Loop through jobs, enhance with matches and applied count
        const enhancedJobs = await Promise.all(allJobs.map(async (job) => {
            const jobSkills = job.skills || [];
            const jobExp = job.experience || 0;

            const matchedSkills = userSkills.filter(skill =>
                jobSkills.some(jobSkill => jobSkill.toLowerCase() === skill.toLowerCase())
            );

            const skillMatch = jobSkills.length > 0
                ? (matchedSkills.length / jobSkills.length) * 100
                : 0;

            const experienceMatch = jobExp > 0
                ? Math.min((totalUserExperience / jobExp) * 100, 100)
                : 100;

            const overallMatch = (skillMatch * 0.7 + experienceMatch * 0.3);

            // ✅ Fetch applied count for this job
            const appliedCount = await ApplyJob.countDocuments({ job_id: job._id });

            return {
                ...job._doc,
                skillMatch: Math.round(skillMatch),
                experienceMatch: Math.round(experienceMatch),
                overallMatch: Math.round(overallMatch),
                appliedCount // ✅ include it here
            };
        }));

        return res.status(200).json({
            message: "Jobs found",
            success: true,
            job: enhancedJobs
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
}

function calculateTotalExperience(experiences) {
    
    let totalMonths = 0;

    experiences.forEach(exp => {
        if (exp.start_date && exp.end_date) {
            const start = new Date(exp.start_date);
            const end = new Date(exp.end_date);
            const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
            totalMonths += months;
        }
    });

    return totalMonths / 12; // Convert months to years
}


export { createProfileController, getEmployeedataController, favouriteJobController, createDetailController, updateDetailController, buyPlanController, uploadCvController, updateCvController, deleteCvController, saveJobController, removeSaveJobController, applyJobController, createReportController, getAllJobDataController }