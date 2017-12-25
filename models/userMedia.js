var mongoose = require('mongoose');
var userMediaSchema = new mongoose.Schema({
    media_id : {
        type: String
    },
    user_id : {
        type: Object, 
        ref : 'user', 
        require : true
    },
    type : {
        type : String
    },
    caption : {
        type : String
    },
    tags : {
        type : String
    },
    filter : {
        type : String
    },
    location : {
        typr : String
    },
    attribution : {
        type : String
    },
    users_in_photo : {
        type : Array
    },
    likes : {
        type : Number
    },
    comments : {
        type : Number
    },
    low_resolution_url : { 
        type : String
    },
    thumbnail_url : { 
        type : String
    },
    standard_resolution_url : {
         type : String
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

var userMedia = mongoose.model('user_medias', userMediaSchema);
module.exports = userMedia;