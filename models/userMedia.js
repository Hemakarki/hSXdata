var mongoose = require('mongoose');
let user = require('../models/user');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
var userMediaSchema = new mongoose.Schema({
    media_id : {
        type: String,
        require : true
    },
    user_id : {
        type: String, 
        require : true
    },
    media_type : {
        type : String, 
        require : true
    },
    caption : {
        type : Object, 
        require : true
    },
    tags : {
        type : Array, 
        require : true
    },
    filter : {
        type : String, 
        require : true
    },
    location : {
        type : Object, 
        require : true
    },
    attribution : {
        type : Object, 
        require : true
    },
    users_in_photo : {
        type : Array, 
        require : true
    },
    likes : {
        type : Number, 
        require : true
    },
    comments : {
        type : Number, 
        require : true
    },
    low_resolution_url : { 
        type : String, 
        require : true
    },
    thumbnail_url : { 
        type : String, 
        require : true
    },
    standard_resolution_url : {
         type : String, 
         require : true
    },
    created_time : {
        type : Number
    },
    created_at : {
        type : Date, 
        default : Date.now
    },
    is_deleted : {
        type : Boolean , 
        default: false
    }
});

var userMedia = mongoose.model('user_media', userMediaSchema);
module.exports = userMedia;