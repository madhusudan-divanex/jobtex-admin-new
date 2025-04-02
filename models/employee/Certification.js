import mongoose, { Schema } from 'mongoose';


const certificationSchema = new Schema({
    certification_name:String,
    certification_url :String,
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
certificationSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    const userId = this.userId;  


    await mongoose.model('certification').deleteMany({ userId: userId });

    next();
});

const Certification = mongoose.model('certification', certificationSchema);

export default Certification;
