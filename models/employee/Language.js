import mongoose, { Schema } from 'mongoose';

const languageSchema = new Schema({
    language_name:String,
    language_profiency :String,
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

languageSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    const userId = this.userId;  


    await mongoose.model('language').deleteMany({ userId: userId });

    next();
});

 const Language = mongoose.model('language', languageSchema);

export default Language;
