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


const LoginUser = mongoose.model('login_users', loginSchema);

export default LoginUser;
