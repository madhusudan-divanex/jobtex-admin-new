import express from 'express'
import verify from '../../middleware/verify.js'
import { appToastController, editToastController, getToastController, planExpiryController, usesReminderController, weeklyDigestController } from '../../controller/notificationManagerController.js';

const appToast=express.Router();
appToast.post('/create-toast',verify,appToastController)

const getToast=express.Router();
getToast.get('/get-toast',verify,getToastController)

const editToast=express.Router();
editToast.post('/edit-toast',verify,editToastController)

//    emailNotification

const weeklyDigest=express.Router();
weeklyDigest.post('/weekly-digest',verify,weeklyDigestController)


const usesReminder=express.Router();
usesReminder.post('/uses-reminder',verify,usesReminderController)


const planExpiry=express.Router();
planExpiry.post('/plan-expiry',verify,planExpiryController)

export {appToast,getToast,editToast,weeklyDigest,usesReminder,planExpiry}