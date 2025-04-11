import mongoose, { Schema } from 'mongoose';

// Define the user schema with validation
const loginSchema = new Schema({
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
loginSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    const user_id = this.user_id;  


    await mongoose.model('login_users').deleteMany({ user_id: user_id });

    next();
});

const LoginUser = mongoose.model('login_users', loginSchema);

export default LoginUser;
