import mongoose,{ Schema } from "mongoose";

const promoSchema = new Schema({
    name: {
        type: String,
        required: [true, 'promo name is required'], 
        minlength: [3, 'promo name must be at least 3 characters long'], 
        maxlength: [100, 'promo name must not exceed 100 characters'] 
    },
    description: {
        type: String,
        required: [true, 'promo description is required'], 
        minlength: [3, 'promo description must be at least 3 characters long'], 
        maxlength: [20, 'promo description must not exceed 100 characters'] 
    },
    type: {
        type: String,
        required: [true, 'promo type is required'], 
        minlength: [3, 'promo type must be at least 3 characters long'], 
        maxlength: [20, 'promo type must not exceed 100 characters'] 
    },
    status: {
        type: String,
        required: [true, 'promo staus is required'], 
        minlength: [3, 'promo staus must be at least 3 characters long'], 
        maxlength: [20, 'promo staus must not exceed 100 characters'] 
    },
    limit: {
        type: Number,
        required: [true, 'promo limit is required'], 
        minlength: [1, 'promo limit must be at least 3 characters long'], 
        maxlength: [100, 'promo limit must not exceed 100 characters'] 
    },
    value: {
        type: Number,
        required: [true, 'Promo amount is required'], 
        min: [1, 'Promo amount must be at least 1'],  // Min amount is 1
        max: [100000, 'Promo amount must not exceed 100,000']  // Max amount is 100,000
    },
    
    start_date: {
        type: Date,
        default: Date.now
    },
    end_date: {
        type: Date,
        required: [true, 'Promo expiry date is required'],
        validate: {
            validator: function(v) {
                return v > this.start_date;
            },
            message: 'Promo expiry date must be later than the Promo post date'
        }
    }
},{timestamps:true});

const Promo=mongoose.model('promo code', promoSchema)

export default Promo;
