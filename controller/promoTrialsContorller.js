import Promo from "../models/PromoCode.js";

async function createPromoController(req,res) {
    console.log(req.body)
    const {name,description,type,status,limit,value,start_date,end_date}=req.body;
    try {
        const newPromo=await Promo.create({
            name,description,type,status,limit,value,start_date,end_date
        })
        if(!newPromo){
            return res.status(500).json({ message: "promo creation faild", success: false });
        }
        return res.status(200).json({ message: "Promo Created", success:true });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}

async function editPromoController(req,res) {
    const {id,name,description,type,status,limit,value,start_date,end_date}=req.body;
    try {
        const newPromo=await Promo.findByIdAndUpdate(id,{
            name,description,type,status,limit,value,start_date,end_date
        },{new:true})
        if(!newPromo){
            return res.status(500).json({ message: "promo creation faild", success: false });
        }
        return res.status(200).json({ message: "Promo Created", success:true });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}

export {createPromoController,editPromoController}