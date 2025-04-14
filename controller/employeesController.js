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

async function createProfileController(req, res) {
    // console.log("called",req.body)
    const { first_name, last_name, current_salary,cs_currency, expected_salary,es_currency, email, phone, marital_status, gender, dob, user_id } = req.body;
    try {
        const findProfile = await User.find({_id:user_id})
        if (findProfile.length > 0) {
            const verifyProfile=await User.findByIdAndUpdate({_id:user_id},{isVerify:true},{new:true})
            const newProfile = await Information.create({
                first_name, last_name, current_salary,cs_currency, expected_salary,es_currency,email, phone, marital_status, gender, dob, user_id
            })

            if (!newProfile) {
                return res.status(500).json({ message: "profile creation failed", success: false })
            }
            return res.status(200).json({ profile: newProfile, message: "profile creation success", success: true })
        }
        return res.status(500).json({ message: "please do signup first", success: false })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error, success: false })
    }

}

async function getEmployeedataController(req, res) {
  const id=req.params.id
    try {
        const user=await User.findById(id);
        const user_id=user._id
        if (!user) {
            return res.status(404).json({ message: "no user found", success: false });
           
           
        } else {
            const subscription = await Subscription.findOne({ user_id });
            if (subscription) {
              const currentDate = new Date();
              if (subscription.end_date < currentDate && subscription.status !== 'expired') {
                // Update status to 'expired' if expired
                subscription.status = 'expired';
                await subscription.save();
              }
            }
            const personal=await Information.findOne({user_id})
            const education=await Education.find({user_id})
            const experience=await Experience.find({user_id})
            const certification=await Certification.find({user_id})
            const language=await Language.find({user_id})
            const cv=await Cv.find({user_id})
            return res.status(200).json({user, personal,education,experience,certification,language,cv, message: "user Fetched", success: true });
            
        }
    } catch (error) {
        
        return res.status(500).json({ message: error.message, success: false });
    }
}
async function favouriteJobController(req, res) {
   
    const { job_title,location, user_id } = req.body;
    console.log(req.body)
    try {
        const findUser = await User.find({_id:user_id})
        if (findUser.length > 0) {
            const updateFavourite=await Information.findOneAndUpdate({user_id},{job_title,location},{new:true})

           

            if (!updateFavourite) {
                return res.status(500).json({ message: "job and location added failed", success: false })
            }
            return res.status(200).json({  message: "job and location added", success: true })
        }
        return res.status(500).json({ message: "please do signup first", success: false })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error, success: false })
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
    const { educationForm, experienceForm, certificationForm, languageForm, skillForm } = req.body;

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

      
        if (educationForm && educationForm.length > 0) {
            isEducationUpdated = true;
          
            await Education.deleteMany({ user_id });
            const educationEntries = educationForm.map(edu => ({
                ...edu,
                user_id,
            }));
            await Education.insertMany(educationEntries);
        }

      
        if (experienceForm && experienceForm.length > 0) {
            isExperienceUpdated = true;
          
            await Experience.deleteMany({ user_id });
            const experienceEntries = experienceForm.map(exp => ({
                ...exp,
                user_id,
            }));
            await Experience.insertMany(experienceEntries);
        }

      
        if (certificationForm && certificationForm.length > 0) {
            isCertificationUpdated = true;
           
            await Certification.deleteMany({ user_id });
            const certificationEntries = certificationForm.map(cer => ({
                ...cer,
                user_id,
            }));
            await Certification.insertMany(certificationEntries);
        }

      
        if (languageForm && languageForm.length > 0) {
            isLanguageUpdated = true;
           
            await Language.deleteMany({ user_id });
            const languageEntries = languageForm.map(lan => ({
                ...lan,
                user_id,
            }));
            await Language.insertMany(languageEntries);
        }

     
        if (skillForm && skillForm.length > 0) {
            isSkillUpdated = true;
           
            await User.findByIdAndUpdate({ _id: user_id }, { skill: skillForm }, { new: true });
        }

        return res.status(200).json({ message: "Profile updated successfully", success: true });

    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}

async function buyPlanController(req, res) {
   
    const { subscription_id,start_date,end_date,status,user_id } = req.body;
   
    try {
        const findUser = await Subscription.find({user_id:user_id})
        const planData = await Plan.find({_id:subscription_id});

        const planName=planData[0].name
       
        if (findUser.length > 0) {
            await Subscription.deleteOne({user_id:user_id})
        }
        const newSubscription = await Subscription.create({
            plan_id:subscription_id,start_date,end_date,status,user_id
        })

        if (!newSubscription) {
            return res.status(500).json({ message: "subscription creation failed", success: false })
        }
        if(planData.price_of_month !==0){
            const updateUserPlan=await User.findByIdAndUpdate({_id:user_id},{plan:planName,isPro:true},{new:true})
           
        }
        else{

            const updateUserPlan=await User.findByIdAndUpdate({_id:user_id},{plan:planName},{new:true})
           
        }
        return res.status(200).json({ subscription: newSubscription, message: "subscription creation success", success: true })
        //return res.status(500).json({ message: "please do signup first", success: false })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error, success: false })
    }

}

async function uploadCvController(req,res) {
    console.log(req.body)
    const {user_id,cv_file,cover_file}=req.body;
    try {
        const path = req.files["cv_file"] ? req.files["cv_file"][0].path : null;
        const coverPath = req.files["over_file"] ? req.files["cover_file"][0].path : null;
        const newCv=await Cv.create({
            user_id,
            
            cv_file:path,
            cover_file:coverPath
        })
        if(!newCv){
            return res.status(500).json({message:"cv not uploaded ",success:false})
        }
        return res.status(200).json({message:"cv uploaded",success:true})
    } catch (error) {
        return res.status(500).json({ message: error,success:false });
    }
}

async function updateCvController(req, res) {
    const { cv_file,cover_file,cv_id } = req.body;  
  
    try {
      
      const existingCv = await Cv.findById(cv_id);
      if (!existingCv) {
        return res.status(404).json({ message: "CV not found", success: false });
      }   
      if(cv_file){
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
      if(cover_file){

      
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

export { createProfileController,getEmployeedataController,favouriteJobController,createDetailController,buyPlanController,uploadCvController,updateCvController,deleteCvController }