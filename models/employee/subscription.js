import mongoose, { Schema } from 'mongoose';


const subscriptionSchema = new Schema({
   
    plan_id:{
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'Plan',
        required: true
    },
    customPlan_id:{
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'custom_plan',
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'user',
        required: true
    },
    status:String,
    start_date: {
        type: Date,
        default: Date.now
    },
    end_date: {
        type: Date
       
    }
},{ timestamps: true });

subscriptionSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    const user_id = this.user_id;  


    await mongoose.model('subscription').deleteMany({ user_id: user_id });

    next();
});

subscriptionSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    const customPlan_id = this.customPlan_id;  


    await mongoose.model('subscription').deleteMany({ customPlan_id: customPlan_id });

    next();
});

subscriptionSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    const plan_id = this.plan_id;  


    await mongoose.model('subscription').deleteMany({ plan_id: plan_id });

    next();
});
 const Subscription = mongoose.model('subscription', subscriptionSchema);

export default Subscription;
