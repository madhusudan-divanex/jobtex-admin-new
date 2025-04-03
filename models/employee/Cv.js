import mongoose, { Schema } from 'mongoose';


const cvSchema = new Schema({
    
    cv_file :String,
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
cvSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    const user_id = this.user_id;  


    await mongoose.model('cv').deleteMany({ user_id: user_id });

    next();
});

const Cv = mongoose.model('cv', cvSchema);

export default Cv;
