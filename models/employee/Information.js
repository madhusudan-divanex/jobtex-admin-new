import mongoose, { Schema } from 'mongoose';


const informationSchema = new Schema({
    profile_url:String,
    phone:String,
    first_name:String,
    last_name:String,
    current_salary:Number,
    cs_currency:String,
    expected_salary:Number,
    es_currency:String,
    dob:Date,
    gender:String,
    marital_status:String,
    about_me:String,
    location:[String],
    job_title:[String],
    skill:[String],
    employeer_skill:[String],
    user_id: {
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'user',
        required: true
    }
},{ timestamps: true });

informationSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    const user_id = this.user_id;  


    await mongoose.model('information').deleteMany({ user_id: user_id });

    next();
});
 const Information = mongoose.model('information', informationSchema);

export default Information;
