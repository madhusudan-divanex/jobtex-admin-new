import { planExpiryMail } from "../mail/PlanExpiry.js";
import { usesReminderMail } from "../mail/usesReminder.js";
import { weeklyDigestMail } from "../mail/WeeklyDigest.js";
import AppToast from "../models/AppToast.js";

async function appToastController(req,res) {
    const {name,type,content,status,target_by}=req.body
    try {
        const createToast=await AppToast.create({
            name,type,content,status,target_by
        })
        if(!createToast){
            return res.status(500).json({ message:'mail sent', success: false });
        }
        return res.status(200).json({ message: 'notification sent', success: true });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}

async function getToastController(req,res) {
  
    try {
        const getToast=await AppToast.find()
        if(getToast.length > 0){
            return res.status(200).json({ message: 'notification fetched',notificaton:getToast, success: true });
        }
        return res.status(500).json({ message:'mail sent', success: false });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}

async function editToastController(req,res) {
    const {id,name,type,status,content,target_by}=req.body
    try {
        const editToast=await AppToast.findByIdAndUpdate(id,{
            name,type,cotent,status,content,target_by
        },{new:true})
        if(!editToast){
            return res.status(500).json({ message:'mail sent', success: false });
        }
        return res.status(200).json({ message: 'notification sent', success: true });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}

async function weeklyDigestController(req,res) {
    const {email,content}=req.body;
    try {
        const sendMail=await weeklyDigestMail(email,content)
        if(sendMail){
            return res.status(200).json({ message:'mail sent', success: true });
        }
        return res.status(500).json({ message: error.message, success: false });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}


async function usesReminderController(req,res) {
    const {email}=req.body;
    try {
        const sendMail=await usesReminderMail(email)
        if(sendMail){
            return res.status(200).json({ message:'mail sent', success: true });
        }
        return res.status(500).json({ message: error.message, success: false });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}

async function planExpiryController(req,res) {
    const {email}=req.body;
    try {
        const sendMail=await planExpiryMail(email)
        if(sendMail){
            return res.status(200).json({ message:'mail sent', success: true });
        }
        return res.status(500).json({ message: error.message, success: false });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}

export {appToastController,getToastController,editToastController,weeklyDigestController,usesReminderController,planExpiryController}