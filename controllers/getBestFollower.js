let constantObj = require("../constants.js");
let instagramCredentials = constantObj.configInstagram;
let Promise         = require('bluebird');

let ig = require('instagram-node').instagram();
ig.use(instagramCredentials);

exports.getBestFollower = function(req, res, next) { 
    if (!req.body.access_token) {
        return  res.status(400).send({
          'status': '400',
          'messageId': 400,
          'message': 'please enter access token.'
        });
      }else{
        var access_token = req.body.access_token;
        ig.use({ access_token: access_token });
        let userId = req.body.access_token.split('.')[0];
        ig.user_media_recent(userId, [], function(err, medias, pagination, remaining, limit) {          
            if(err) {
                return res.status(401).send({
                   'status': 401,
                   'messageId': 401,
                   'message': err
               });
            }else{
                let media_id = [];
                medias.forEach(function(media){
                 media_id.push(media.id);
                });
                    getUsersLiked(media_id)
                    .then((data) => {
                        let most_liked_by = countMax(data);
                        console.log(most_liked_by,'max_liked_bymax_liked_by');
                        return res.status(200).send({
                            'status':200,
                            'messageId' : 200,
                            'most_likes_to_me': most_liked_by                        
                        })
                    })
                    .catch((err) => {
                        console.log('err', err);
                    })
            }
        });
    }
}

// to get the users list who likes the media 
 function getUsersLiked(media_id){
    let likeddata=[];
    let len = media_id.length;
    return  new Promise((resolve, reject) => {
        for(let i=0; i<len; i++){
            ig.likes(media_id[i], function(err, result, remaining, limit) { 
                if(err){
                    reject(err);
                 }else{
                    let commondata = {
                         'media_id' : media_id[i],
                         'user_likes' : result
                    }
                    likeddata.push(commondata);
                    if( i == len-1){
                    resolve(likeddata);
                    }
                }
            })
        }
    })
}

// end of getUsersLiked funciton
 
// to count maximum count of like and
function countMax(users){
    let highestValuelike = 0;
    let highestValuecomment = 0;
    let usersIDs= [];
    if(users.length == 0){
        return message ={
            'msg' :'No users liked the media'
        }
    }else{
        let count = 0;
        users.forEach(function(user){
            var id = user.user_likes;           
            usersIDs.push(id);
        });
       let usersoccuredmost= occurrence(usersIDs);
       console.log(usersIDs,"usersIDsusersIDs",users,"************")
       return usersoccuredmost;
    }
} 
// end of countMax function

var occurrence = function (array) {
    "use strict";
    var result = [];
    if (array instanceof Array) {
        array.forEach(function ( i) {
            if (!result) {
                result = [i];
            } else {
                result.push(i);
            }
        });
        Object.keys(result).forEach(function (v) {
            result = { "length": result.length};
        });
    }
    return result;
};