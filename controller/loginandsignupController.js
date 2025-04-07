import User from "../models/employee/User.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { verificationMail } from "../mail/Verification.js";
import { forgotMail } from "../mail/Forgot.js";
import LoginUser from "../models/employee/ActiveUser.js";
async function loginController(req,res) {
    const {email,password}=req.body;
    try {
        const existUser=await User.findOne({email})
        if(existUser){
            if(bcrypt.compare(password,existUser.password)){
                jwt.sign({existUser},process.env.SECRET_KEY,{expiresIn:'1d'},async(err,token)=>{
                    if(err){
                        return res.status(200).json({message:'error in token genertaion',success:false})
                    }
                    const findLogin=await LoginUser.find({_id:existUser._id})
                    if(findLogin){
                        await LoginUser.deleteOne(existUser._id)
                    }
                    const addLogin=await LoginUser.create({
                        user_id:existUser._id
                    })
                    return res.json({token,message:"login success",user:existUser,success:true})
                })   
            }
        }
        
    } catch (error) {
        return res.status(500).json({message:error,success:false})
    }
}
async function signUpController(req,res) {
    const {first_name,last_name,email,signup_location,password}=req.body;
    try {
        const existUser=await User.findOne({email})
        if(existUser){            
            return res.status(200).json({message:'user already exist',success:false})
        }
        const hashpassword=await bcrypt.hash(password,10)
        const newUser=await User.create({
            first_name,
            last_name,
            email,
            signup_location,
            password:hashpassword
        })
        if (!newUser) {
            return res.status(400).json({ message: "Signup failed", success: false });
        }
        await verificationMail(email)
        return res.status(200).json({token,message:"account created",user:newUser,success:true})
        
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message, success: false });
        }
        return res.status(500).json({message:error,success:false})
    }
}
async function resetController(req,res) {
    const {email,password}=req.body;
    try {
        const existUser=await User.findOne({email})
        if(existUser){
            const hashpassword=bcrypt.hash(password,10)
            existUser.password=hashpassword
            existUser.save()
            return res.json({token,message:"password rest",success:true})
        }
    } catch (error) {
        return res.status(500).json({message:error,success:false})
    }
}
async function forgotController(req,res) {
    const {email}=req.body;
    try {
       await forgotMail(email)
        return res.json({message:"mail sent",success:true})      
    } catch (error) {
        return res.status(500).json({message:error,success:false})
    }
}

export {loginController,signUpController,forgotController,resetController}