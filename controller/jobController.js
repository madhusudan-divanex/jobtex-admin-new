import Job from "../models/Job.js"

async function newJobController(req,res) {
    console.log(req.body)
    const {title,description,location,salary,type,experience,company_name,company_detail,job_post_date,job_expiry_date}=req.body;
    try {
        
            const createJob = await Job.create(                
                {
                    title,
                    description,
                    salary,
                    type,
                    location,
                    experience,
                    company_name,
                    company_detail,
                    job_post_date,
                    job_expiry_date
                } 
            );
            if (!createJob) {
                return res.status(400).json({ message: "Job creation failed", success: false });
            }
    
            return res.status(200).json({message:"job created",job:createJob,success:true})
       
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message, success: false });
        }
        return res.status(500).json({message:error,success:false})
    }
}
async function editJobController(req,res) {
    const {title,description,location,salary,type,experience,company_name,company_detail,job_post_date,job_expiry_date,id}=req.body.jobData;
    try {
        const findJob=await Job.findOne({_id:id})
        if(findJob){
            const updatedJob = await Job.findByIdAndUpdate(
                id, 
                {
                    title,
                    description,
                    salary,
                    type,
                    experience,
                    location,
                    company_name,
                    company_detail,
                    job_post_date,
                    job_expiry_date
                },
                { new: true } 
            );
    
            return res.status(200).json({message:"job updated",job:updatedJob,success:true})
        }
        return res.status(404).json({message:"job not found",success:false})
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message, success: false });
        }
        return res.status(500).json({message:error,success:false})
    }
}
async function deleteJobController(req,res) {
    const id=req.params.id
    try {
        const findJob=await Job.findByIdAndDelete(id)
        if(findJob){
            return res.status(200).json({message:"job deleted",success:true})
        }
        return res.status(404).json({message:"job not found",success:false})
    } catch (error) {
        return res.status(500).json({message:error,success:false})
    }
}
async function getAllJobController(req,res) {
    try {
        const findJob=await Job.find()
        if(findJob.length >0){
            return res.status(200).json({message:"job find",job:findJob,success:true})
        }
        return res.status(404).json({message:"no jobs found",success:false})
    } catch (error) {
        return res.status(500).json({message:error,success:false})
    }
}
async function getJobByCompanyJobController(req,res) {
    const {company_name}=req.body
    try {
        const findJob=await Job.find({company_name})
        if(findJob){
            return res.status(200).json({message:"job fetch",job:findJob,success:true})
        }
        return res.status(404).json({message:"job not found",success:false})
    } catch (error) {
        return res.status(500).json({message:error,success:false})
    }
}
async function getJobByIdJobController(req,res) {
    
    const id=req.params.id
    try {
        const findJob=await Job.findOne({_id:id})
        if(findJob){
            return res.status(200).json({message:"job find",job:findJob,success:true})
        }
        return res.status(404).json({message:"job not found",success:false})
    } catch (error) {
        return res.status(500).json({message:error,success:false})
    }
}

export {newJobController,editJobController,deleteJobController,getAllJobController,getJobByIdJobController,getJobByCompanyJobController}