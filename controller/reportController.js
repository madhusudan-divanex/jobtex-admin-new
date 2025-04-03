import Report from "../models/Report.js"

async function createReportController(req,res) {
    const {subject,message,attachement}=req.body;
    try {
        const path = req.files["attachment"] ? req.files["attachment"][0].path : null;
        const newReport=await Report.create({
            subject,
            message,
            attachment:path
        })
        if(!newReport){
            return res.status(500).json({message:"report not sent ",success:false})
        }
        return res.status(200).json({message:"report sent",success:true})
    } catch (error) {
        return res.status(200).json({message:error,success:false})
    }
}

async function getAllReportController(req,res) {
    try {
        const findReport=await Report.find()
        if(findReport.length >0){
            return res.status(200).json({message:"report Fetched",report:findReport,success:true})
        }
        return res.status(401).json({message:"no report found",success:true})
    } catch (error) {
        return res.status(200).json({message:error,success:false})
    }
}

async function getReportByIdController(req,res) {
    const id=req.params.id
  
    try {
        const findReport=await Report.findOne({_id:id})
    
        if(findReport){
            return res.status(200).json({message:"report Fetched",report:findReport,success:true})
        }
        return res.status(401).json({message:"no report found",success:false})
    } catch (error) {
        console.log(error)
        return res.status(200).json({message:error,success:false})
    }
}

export {createReportController,getAllReportController,getReportByIdController}