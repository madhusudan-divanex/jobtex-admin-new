import mongoose, { Schema } from 'mongoose';


const appToastSchema = new Schema({
   
    name:{
        type: String,
        required: [true, 'Name is required'],  
        minlength: [5, 'Name must be at least 5 characters long'],  
        maxlength: [20, 'Name cannot exceed 20 characters']  
    },
    type: {
        type: String,  
        
        required: [true, 'Type is required'],  
        minlength: [5, 'Type must be at least 5 characters long'],  
        maxlength: [30, 'Type cannot exceed 30 characters']  
    },
    content: {
        type: String,  
       
        required: [true, 'Content is required'],  
        minlength: [20, 'Content must be at least 20 characters long'],  
        maxlength: [200, 'Content cannot exceed 200 characters']  
    },
    target_by:{
         type:String,
        default:'All'
    },
    status: {
        type:String,
        default:'active'
       
    }
},{ timestamps: true });

 const AppToast = mongoose.model('app toast', appToastSchema);

export default AppToast;
