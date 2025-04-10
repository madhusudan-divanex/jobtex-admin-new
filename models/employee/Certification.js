import mongoose, { Schema } from 'mongoose';


const certificationSchema = new Schema({
    certification_name:String,
    // certification_url :String,
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
certificationSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    const user_id = this.user_id;  


    await mongoose.model('certification').deleteMany({ user_id: user_id });

    next();
});

const Certification = mongoose.model('certification', certificationSchema);

export default Certification;
