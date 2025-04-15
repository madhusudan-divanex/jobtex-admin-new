import mongoose, { Schema } from 'mongoose';

const languageSchema = new Schema({
    language_name:String,
    language_proficency :String,
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

languageSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    const user_id = this.user_id;  


    await mongoose.model('language').deleteMany({ user_id: user_id });

    next();
});

 const Language = mongoose.model('language', languageSchema);

export default Language;
