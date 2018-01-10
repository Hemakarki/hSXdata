var mongoose = require('mongoose');
var mediaLikeSchema = new mongoose.Schema({
    media_id : {
        type: Object, 
        ref : 'user_media', 
        require : true
    },
    liked_by : [{
        full_name:{
            type : String,
            require : true
        },
        profile_picture: {
            type : String,
            require : true
        }
    }],
    created_at : {
        type : Date, 
        default : Date.now
    },
    is_deleted : {
        type : Boolean ,
        default: false
    }
});

var mediaLike = mongoose.model('media_like', mediaLikeSchema);
module.exports = mediaLike;