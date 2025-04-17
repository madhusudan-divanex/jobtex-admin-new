import Job from "../models/Job.js"

async function newJobController(req,res) {
   
    const {title,description,role,category,company_photo,location,min_salary,max_salary,type,skills,experience,company_name,company_detail,job_post_date,job_expiry_date}=req.body;
    try {
        const path = req.files["company_photo"] ? req.files["company_photo"][0].path : null;
        
            const createJob = await Job.create(                
                {
                    title,
                    description,
                    company_photo:path,
                    min_salary,max_salary,
                    type,
                    location,
                    role,
                    experience,
                    company_name,
                    category,
                    company_detail,
                    skills,
                    job_post_date,
                    job_expiry_date
                } 
            );
            if (!createJob) {
                return res.status(400).json({ message: "Job creation failed", success: false });
            }
    
            return res.status(200).json({message:"job created",job:createJob,success:true})
       
    } catch (error) {
        console.log(error)
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message, success: false });
        }
        return res.status(500).json({message:error,success:false})
    }
}
async function editJobController(req, res) {
    const {
      title,
      role,
      category,
      description,
      location,
      salary,
      type,
      experience,
      company_name,
      company_detail,
      job_post_date,
      job_expiry_date,
      id,
    } = req.body;
  
    try {
      const findJob = await Job.findById(id);
      if (!findJob) {
        return res.status(404).json({ message: "Job not found", success: false });
      }
  
      let newFilePath = findJob.company_photo; // Default to existing photo
  
      // If a new file was uploaded
      if (req.files && req.files["company_photo"] && req.files["company_photo"][0]) {
        const file = req.files["company_photo"][0];
        newFilePath = file.path;
  
        // Delete old photo if it exists
        if (findJob.company_photo && fs.existsSync(findJob.company_photo)) {
          fs.unlinkSync(findJob.company_photo);
        }
      }
  
      const updatedJob = await Job.findByIdAndUpdate(
        id,
        {
          title,
          description,
          category,
          salary,
          role,
          type,
          experience,
          location,
          company_name,
          company_detail,
          job_post_date,
          job_expiry_date,
          company_photo: newFilePath, // Set photo path here
        },
        { new: true }
      );
  
      return res.status(200).json({ message: "Job updated", job: updatedJob, success: true });
  
    } catch (error) {
      console.error("Edit job error:", error);
      return res.status(500).json({ message: "Server error", success: false });
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