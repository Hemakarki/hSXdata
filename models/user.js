
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = Schema({
    user_id : {
	    type: String
	  },
    username : {
       type : String
    },
    full_name : {
      type : String
    },
    profile_picture : {
       type : String},
    media_count : {
       type: Number
    },
    follower_count : {
       type: Number
    },
    followed_by_count : {
       type: Number
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

let userObj = mongoose.model('user', userSchema);
module.exports = userObj;
