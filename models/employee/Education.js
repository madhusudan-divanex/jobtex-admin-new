import mongoose, { Schema } from 'mongoose';


const educationSchema = new Schema({
    
    university_name :String,
    degree_type :String,
    field_of_study:String,
    gpa:Number,
    start_date:Date,
    end_date:Date,
    description:String,
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

educationSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    const user_id = this.user_id;  


    await mongoose.model('education').deleteMany({ user_id: user_id });

    next();
});
 const Education = mongoose.model('education', educationSchema);

export default Education;
