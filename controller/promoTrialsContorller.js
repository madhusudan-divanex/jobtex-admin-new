import Promo from "../models/PromoCode.js";

async function createPromoController(req,res) {
    
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

async function getPromoController(req,res) {
    
   
    try {
        const getPromo=await Promo.find()
        if(!getPromo){
            return res.status(500).json({ message: "promo fetch faild", success: false });
        }
        return res.status(200).json({ message: "Promo fetched", promo:getPromo,success:true });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}

async function editPromoController(req,res) {
    const {id,name,description,type,status,limit,value,start_date,end_date}=req.body;
    console.log(req.body)
    try {
        const editPromo=await Promo.findByIdAndUpdate(id,{
            name,description,type,status,limit,value,start_date,end_date
        },{new:true})
        if(!editPromo){
            return res.status(500).json({ message: "promo creation faild", success: false });
        }
        return res.status(200).json({ message: "Promo Created", success:true });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}

async function deletePromoController(req,res) {
   const id=req.params.id
    try {
        const deletePromo=await Promo.findByIdAndDelete({_id:id})
        if(!deletePromo){
            return res.status(500).json({ message: "promo not delete", success: false });
        }
       
        return res.status(200).json({ message: "Promo Deleted", success:true });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}

export {createPromoController,getPromoController,editPromoController,deletePromoController}