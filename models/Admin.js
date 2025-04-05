import mongoose, { Schema } from 'mongoose';

const adminSchema = new Schema({
    name:{
        type:String,
        required: [true, 'Name is required'],
    },
    access: {
        type: String,
        required: [true, 'Access is required'],
        minlength: [20, 'Access must be at least 20 characters long'], 
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,  
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'], 
    },
   
  
    
    createdAt: {
        type: Date,
        default: Date.now
    }
});



 const Admin = mongoose.model('admin', adminSchema);

export default Admin;
