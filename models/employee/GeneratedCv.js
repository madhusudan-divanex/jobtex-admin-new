import mongoose, { Schema } from 'mongoose';


const generatedCvSchema = new Schema({
    
    cv_file :String,
    cover_file :String,
    user_id: {
            type: mongoose.Schema.Types.ObjectId,  
            ref: 'user',
            required: true
        },
    
    subcription_id:{
        type: mongoose.Schema.Types.ObjectId,  
            ref: 'subscription',
            required: true
    }
},{ timestamps: true });
generatedCvSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    const user_id = this.user_id;  


    await mongoose.model('generated').deleteMany({ user_id: user_id });

    next();
});

const Generated = mongoose.model('generate', generatedCvSchema);

export default Generated;
