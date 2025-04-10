import express from 'express'
import { forgotController, loginController, profileVerifyController, resetController, signUpController } from '../controller/loginandsignupController.js';

const signup=express.Router();
signup.post('/create-account',signUpController)

const login=express.Router()
login.post('/user-login',loginController)

const profileVeirfy=express.Router()
profileVeirfy.post('/user-profile-verify/:id',profileVerifyController)

const forgotPass=express.Router()
forgotPass.post('/forgot-password',forgotController)

const resetPass=express.Router()
resetPass.post('/reset-password',resetController)

export {signup,login,profileVeirfy,forgotPass,resetPass}