import mongoose, { Schema } from 'mongoose';

// Define the user schema with validation
const experienceSchema = new Schema({
    experience_name:String,
    company_name :String,
    job_title :String,
    employment_type :String,
    
    start_date:Date,
    end_date:Date,
    description:String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'user',
        required: true
    },
    
    createdAt: {
        type: Date,
        default: Date.now
    }
});

experienceSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    const userId = this.userId;  


    await mongoose.model('experience').deleteMany({ userId: userId });

    next();
});
const Experience = mongoose.model('experience', experienceSchema);

export default Experience;
