import mongoose, { Schema } from 'mongoose';


const applyJobSchema = new Schema({
   job_id:{
    type: mongoose.Schema.Types.ObjectId,  
    ref: 'Job',
    required: true
   },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'user',
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});


applyJobSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    const user_id = this.user_id;  


    await mongoose.model('apply job').deleteMany({ user_id: user_id });

    next();
});
applyJobSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    const job_id = this.job_id;  


    await mongoose.model('apply job').deleteMany({ job_id: job_id });

    next();
});
 const ApplyJob = mongoose.model('apply job', applyJobSchema);

export default ApplyJob;
