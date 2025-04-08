import express from 'express'
import verify from '../../middleware/verify.js';
import { createPromoController, editPromoController } from '../../controller/promoTrialsContorller.js';

const createPromo=express.Router();
createPromo.post('/create-promo',verify,createPromoController)

const editPromo=express.Router();
editPromo.post('/edit-promo',verify,editPromoController)

export {createPromo,editPromo}