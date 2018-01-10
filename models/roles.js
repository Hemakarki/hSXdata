var mongoose = require('mongoose');
var RolesSchema = new mongoose.Schema({
    name: {
        type: String
    },
    description: { 
        type: String
    },
    permission: {
        type:Object
    },
    isDeleted: {
        type: 'boolean'
    } 
})

var Roles = mongoose.model('Roles', RolesSchema);
module.exports = Roles;


