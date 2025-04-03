import Certification from "../models/employee/Certification.js";
import Cv from "../models/employee/Cv.js";
import Education from "../models/employee/Education.js";
import Experience from "../models/employee/Experience.js";
import Inofrmation from "../models/employee/Information.js";
import Language from "../models/employee/Language.js";
import User from "../models/employee/User.js";
import fs from 'fs';
import path from 'path';

async function createProfileController(req, res) {
    const { fist_name, last_name, current_salary, expected_salary, email, phone, marital_status, gender, dob, user_id } = req.body;
    try {
        const findProfile = await Inofrmation.find(email)
        if (findProfile.length > 0) {
            const newProfile = await Inofrmation.create({
                fist_name, last_name, current_salary, expected_salary, email, phone, marital_status, gender, dob, user_id
            })

            if (!newProfile) {
                return res.status(500).json({ message: "profile creation failed", success: false })
            }
            return res.status(200).json({ profile: newProfile, message: "profile creation success", success: false })
        }
    } catch (error) {
        return res.status(500).json({ message: error, success: false })
    }

}

async function getEmployeedataController(req, res) {
  const id=req.params.id
    try {
        const employee=await User.findById(id);
        const user_id=employee._id
        if (!employee) {
            return res.status(401).json({ message: "no Employee found", success: false });
           
           
        } else {
            const personal=await Inofrmation.findOne({user_id})
            const education=await Education.find({user_id})
            const experience=await Experience.find({user_id})
            const certification=await Certification.find({user_id})
            const language=await Language.find({user_id})
            const cv=await Cv.find({user_id})
            return res.status(200).json({ personal,education,experience,certification,language,cv, message: "Employee Fetched", success: true });
            
        }
    } catch (error) {
        
        return res.status(500).json({ message: error.message, success: false });
    }
}
async function createDetailController(req, res) {
    const { user_id } = req.body;
    const { educationForm, experienceForm, certificationForm, languageForm ,skillForm} = req.body;
    try {

        const findUser = await User.findOne({ _id: user_id })
        if (!findUser) {
            return res.status(400).json({ message: "user not found", success: false });
        }
        let isEducation = false;
        let isExperience = false;
        let isCertification = false;
        let isLanguage = false;
        let isSkill=false;

        if (educationForm.length > 0) {
            isEducation = true;
        }
        if (experienceForm.length > 0) {
            isExperience = true
        }
        if (certificationForm.length > 0) {
            isCertification = true;
        }
        if (languageForm.length > 0) {
            isLanguage = true
        }
        if(skillForm.length>0){
            isSkill=true
        }

        if (isEducation) {

            const educationEntries = educationForm.map(edu => ({
                ...edu,
                user_id,
            }));

            const savedEducation = await Education.insertMany(educationEntries);
        }
        if (isExperience) {

            const experienceEntries = experienceForm.map(exp => ({
                ...exp,
                user_id,
            }));

            const savedExperience = await Experience.insertMany(experienceEntries);
        }
        if (isCertification) {

            const certificationEntries = certificationForm.map(cer => ({
                ...cer,
                user_id,
            }));

            const savedCertification = await Certification.insertMany(certificationEntries);
        }
        if (isLanguage) {

            const languageEntries = languageForm.map(lan => ({
                ...lan,
                user_id,
            }));

            const savedlanguage = await Language.insertMany(languageEntries);
        }
        if(isSkill){
            const addSkill=await User.findByIdAndUpdate({_id:user_id},{skill:skillForm},{new:true})
        }

        return res.status(201).json({ message: "all added successfully", success: true });

    } catch (error) {
        return res.status(500).json({ message: error, success: false })
    }

}

async function uploadCvController(req,res) {
    const {user_id,cv_file}=req.body;
    try {
        const path = req.files["cv_file"] ? req.files["cv_file"][0].path : null;
        const newCv=await Cv.create({
            user_id,
            
            cv_file:path
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
    const { cv_id } = req.body;  
  
    try {
      
      const existingCv = await Cv.findById(cv_id);
      if (!existingCv) {
        return res.status(404).json({ message: "CV not found", success: false });
      }      
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

export { createProfileController,getEmployeedataController,createDetailController,uploadCvController,updateCvController,deleteCvController }