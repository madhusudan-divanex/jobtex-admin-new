import mongoose, { Schema } from 'mongoose';

// Define the user schema with validation
const loginSchema = new Schema({
    user_id: {
        type: String,
        required: [true, 'User id is required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


const LoginUser = mongoose.model('login user', loginSchema);

export default LoginUser;
