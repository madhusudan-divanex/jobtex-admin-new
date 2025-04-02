import mongoose, { Schema } from 'mongoose';

const reportSchema = new Schema({
    subject:String,
    message:String,
    attachment:String,
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

reportSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    const userId = this.userId;  


    await mongoose.model('report').deleteMany({ userId: userId });

    next();
});

 const Report = mongoose.model('report', reportSchema);

export default Report;
