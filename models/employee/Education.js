import mongoose, { Schema } from 'mongoose';


const educationSchema = new Schema({
    education_name:String,
    university_name :String,
    degree_type :String,
    field_of_study:String,
    gpa:Number,
    start_date:Date,
    end_date:Date,
    description:String,
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

educationSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    const userId = this.userId;  


    await mongoose.model('education').deleteMany({ userId: userId });

    next();
});
 const Education = mongoose.model('education', educationSchema);

export default Education;
