import mongoose, { Schema } from 'mongoose';


const subscriptionSchema = new Schema({
   
    subscription_id:{
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'Plan',
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'user',
        required: true
    },

    start_date: {
        type: Date,
        default: Date.now
    },
    end_date: {
        type: Date
       
    }
});

subscriptionSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    const user_id = this.user_id;  


    await mongoose.model('subscription').deleteMany({ user_id: user_id });

    next();
});

subscriptionSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    const plan_id = this.plan_id;  


    await mongoose.model('subscription').deleteMany({ plan_id: plan_id });

    next();
});
 const Subscription = mongoose.model('subscription', subscriptionSchema);

export default Subscription;
