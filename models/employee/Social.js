import mongoose, { Schema } from 'mongoose';

const socialSchema = new Schema({
    social_name:String,
    social_url :String,
    
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

socialSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    const user_id = this.user_id;  


    await mongoose.model('social').deleteMany({ user_id: user_id });

    next();
});
 const Social = mongoose.model('social', socialSchema);

export default Social;
