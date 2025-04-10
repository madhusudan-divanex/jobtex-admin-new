import mongoose,{ Schema } from "mongoose";

const customPlanSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Custom Plan name is required'], 
        minlength: [3, 'Custom Plan name must be at least 3 characters long'], 
        maxlength: [100, 'Custom Plan name must not exceed 100 characters'] 
    },
   status:{
    type:String,
    required:[true,'Custom Plan Status']
   },
    feature: {
        type: [String],
        required: [true, 'Custom Plan features are required'],
        validate: {
            validator: function (arr) {
                return arr.length > 0; 
            },
            message: 'At least one feature is required for the custom'
        }
    }
});

const CustomPlan=mongoose.model('custom_plan', customPlanSchema)

export default CustomPlan;
