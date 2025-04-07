import mongoose, { Schema } from "mongoose";


const jobSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],  
        minlength: [5, 'Title must be at least 5 characters long'],  
        maxlength: [50, 'Title cannot exceed 100 characters']  
    },
    role: {
        type: String,
        required: [true, 'Role is required'],  
        minlength: [5, 'Role must be at least 5 characters long'],  
        maxlength: [50, 'Role cannot exceed 100 characters']  
    },
    type: {
        type: [String],
        required: [true, 'Job Type is required'],  
       
    },
    category: {
        type: String,
        required: [true, 'Job Category is required'],  
       
    },
    skills: {
        type: [String],
        required: [true, 'Job Skill is required'],  
       
    },
    description: {
        type: String,
        required: [true, 'Description is required'],  
        minlength: [10, 'Description must be at least 10 characters long']  
    },
    location: {
        type: String,
        required: [true, 'location is required']
    },
    min_salary: {
        type: Number,
        required: [true, 'Minimum Salary is required']
    },
    max_salary: {
        type: Number,
        required: [true, 'MaximumSalary is required']
    },
    experience: {
        type: Number,
        required: [true, 'Experience is required'],  
        min: [0, 'Experience cannot be negative'],  
        max: [30, 'Experience cannot exceed 30 years']  
    },
    company_name: {
        type: String,
        required: [true, 'Company name is required'], 
        minlength: [3, 'Company name must be at least 3 characters long'],  
        maxlength: [50, 'Company name cannot exceed 100 characters']  
    },
    company_detail: {
        type: String,
        required: [true, 'Company detail is required'],  
        minlength: [20, 'Company detail must be at least 20 characters long']  
    },
    job_post_date: {
        type: Date,
        default: Date.now
    },
    job_expiry_date: {
        type: Date,
        required: [true, 'Job expiry date is required'],
        validate: {
            validator: function(v) {
                return v > this.job_post_date;
            },
            message: 'Job expiry date must be later than the job post date'
        }
    }
});

const Job = mongoose.model('Job', jobSchema);

export default Job;
