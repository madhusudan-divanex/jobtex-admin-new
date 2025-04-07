import mongoose, { Schema } from 'mongoose';


const savedJobSchema = new Schema({
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


savedJobSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    const user_id = this.user_id;  


    await mongoose.model('saved job').deleteMany({ user_id: user_id });

    next();
});
savedJobSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    const user_id = this.user_id;  


    await mongoose.model('saved job').deleteMany({ user_id: user_id });

    next();
});
 const SavedJob = mongoose.model('saved job', savedJobSchema);

export default SavedJob;
