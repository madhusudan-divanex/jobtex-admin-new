import mongoose, { Schema } from 'mongoose';

const socialSchema = new Schema({
    social_name:String,
    social_url :String,
    
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

socialSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    const userId = this.userId;  


    await mongoose.model('social').deleteMany({ userId: userId });

    next();
});
 const Social = mongoose.model('social', socialSchema);

export default Social;
