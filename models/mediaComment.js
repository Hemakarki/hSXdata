var mongoose = require('mongoose');
var mediaCommentSchema = new mongoose.Schema({
    commented_by : [{
        media_id : {
            type: Object, 
            ref : 'user_media', 
            require : true
        },
        full_name:{
            type : String,
            require : true
        },
        url: {
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

var mediaComment = mongoose.model('media_comment', mediaCommentSchema);
module.exports = mediaComment;