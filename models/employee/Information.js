import mongoose, { Schema } from 'mongoose';


const informationSchema = new Schema({
    profile_url:String,
    phone:Number,
    currect_salary:Number,
    expected_salary:Number,
    dob:Date,
    gender:String,
    material_status:String,
    about_me:String,
    location:String,
    job_title:[String],
    skill:[String],
    employeer_skill:[String],
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

informationSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    const userId = this.userId;  


    await mongoose.model('information').deleteMany({ userId: userId });

    next();
});
 const Inofrmation = mongoose.model('information', InofrmationSchema);

export default Inofrmation;
