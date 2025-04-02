import express from 'express'
import { forgotController, loginController, resetController, signUpController } from '../controller/loginandsignupController.js';

const signup=express.Router();
signup.post('/create-account',signUpController)

const login=express.Router()
login.post('/login',loginController)

const forgotPass=express.Router()
forgotPass.post('/forgot-password',forgotController)

const resetPass=express.Router()
resetPass.put('/reset-password',resetController)

export {signup,login,forgotPass,resetPass}