import express from 'express'
import verify from '../../middleware/verify.js';
import { grantProController, userActionController, userDetailController, userListController } from '../../controller/userManagementController.js';

const userList=express.Router();
userList.get('/user-list',verify,userListController)

const userDetail=express.Router();
userDetail.get('/user-detail/:id',verify,userDetailController)

const userAction=express.Router();
userAction.get('/user-account-action/:id',verify,userActionController)

const grantPro=express.Router();
grantPro.get('/grant-pro/:id',verify,grantProController)

export {userList,userAction,userDetail,grantPro}