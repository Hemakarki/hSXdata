var mongoose = require('mongoose');
var CoinsPackageSchema = new mongoose.Schema({
    title: {
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

var CoinsPackage = mongoose.model('CoinsPackage', CoinsPackageSchema);
module.exports = CoinsPackage;


