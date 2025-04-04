import mongoose,{ Schema } from "mongoose";

const planSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Plan name is required'], 
        minlength: [3, 'Plan name must be at least 3 characters long'], 
        maxlength: [100, 'Plan name must not exceed 100 characters'] 
    },
    price_of_month: {
        type: Number,
        required: [true, 'Monthly plan price is required'],
        min: [0, 'Monthly plan price must be a positive number'],
        validate: {
            validator: Number.isInteger,
            message: 'Monthly plan price must be an integer'
        }
    },
    price_of_year: {
        type: Number,
        required: [true, 'Yearly plan price is required'], 
        min: [0, 'Yearly plan price must be a positive number'],
        validate: {
            validator: Number.isInteger,
            message: 'Yearly plan price must be an integer'
        }
    },
    feature: {
        type: [String],
        required: [true, 'Plan features are required'],
        validate: {
            validator: function (arr) {
                return arr.length > 0; 
            },
            message: 'At least one feature is required for the plan'
        }
    }
});

const Plan=mongoose.model('plan', planSchema)

export default Plan;
