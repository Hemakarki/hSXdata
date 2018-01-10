var mongoose = require('mongoose');
var SubscriptionSchema = new mongoose.Schema({
    title: {
        type: String
    },
    description: { 
        type: String
    },
    package_validity: {
        type:Number
    },
    amount : {
        type:Number
    },
    created_at: {
        type : Date,
        default : Date.now
    },
    isDeleted: {
        type: 'boolean',
        default : false
    } 
})

var Subscription = mongoose.model('Subscription', SubscriptionSchema);
module.exports = Subscription;


