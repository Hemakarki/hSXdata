var mongoose = require('mongoose');
var mediaLikeSchema = new mongoose.Schema({
    media_id : {
        type: Number, 
        ref : 'user_medias', 
        require : true
    },
    liked_by : {
        type : Number, 
        ref : 'user'
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

var mediaLike = mongoose.model('media_like', mediaLikeSchema);
module.exports = mediaLike;