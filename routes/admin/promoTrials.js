import express from 'express'
import verify from '../../middleware/verify.js';
import { createPromoController, deletePromoController, editPromoController, getPromoController } from '../../controller/promoTrialsContorller.js';

const createPromo=express.Router();
createPromo.post('/create-promo',verify,createPromoController)

const getPromo=express.Router();
getPromo.get('/get-promo',verify,getPromoController)

const editPromo=express.Router();
editPromo.post('/update-promo',verify,editPromoController)

const deletePromo=express.Router();
deletePromo.delete('/delete-promo/:id',verify,deletePromoController)

export {createPromo,getPromo,editPromo,deletePromo}