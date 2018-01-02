var mongoose = require('mongoose');
var userMediaSchema = new mongoose.Schema({
    media_id : {
        type: String,
        require : true
    },
    user_id : {
        type: Object, 
        ref : 'user', 
        require : true
    },
    type : {
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

var userMedia = mongoose.model('user_medias', userMediaSchema);
module.exports = userMedia;