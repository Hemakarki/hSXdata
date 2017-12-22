


















let constantObj = require("../constants.js");
let instagramCredentials = constantObj.configInstagram;
let Promise         = require('bluebird');

let ig = require('instagram-node').instagram();
ig.use(instagramCredentials);


exports.getBestFollower = function(req, res, next) {
    console.log('here')
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
        ig.user_media_recent(userId, [], function(err, medias) {
            if(err) {
                return res.status(401).send({
                   'status': 401,
                   'messageId': 401,
                   'message': err
               });
            }else{
                let mediaObj = [];  
                
                 getUsersLiked(medias)
                    .then((userLiked) =>{
                        return userLiked;
                    } )
                    .then((likedata) => {
                        getUserCommented(medias)
                        .then((commentdata) => { 
                            let collectivedata ={
                                'likedata': likedata,
                                'commentdata': commentdata
                            }
                            return collectivedata; 
                        })
                        .then((data) =>{
                            let commentdata = data.commentdata;
                            let likedata= data.likedata;
                            let  commondata = coommonUsers(likedata, commentdata);
                            let best_followers ={
                                'most_likes_to_me' : data.likedata,
                                'most_comment_to_me' : commentdata,
                                'most_likes_&_comments' : commondata
                            }
                            return res.status(200).send({
                                'status':200,
                                'messageId' : 200,
                                'best_followers' : best_followers
                           })
                        }) 
                    })
                    .catch((err) => {
                        return err;
                        console.log('err', err);
                    })
                }
            });
        }
    }

function coommonUsers(likeuser, commentuser){
    let  commondata = likeuser.slice();
    for (var i = 0 ; i < commondata.length ; i++){
      for (var j = 0; j < commentuser.length ; j++){
        if (commondata[i].username == commentuser[j].username){
            commondata[i].likes = likeuser[j].likes;
            commondata[i].comments = commentuser[j].comments;
            commondata[i].url = commentuser[j].url;
        }
      };  
    };
    return commondata;
}

function getUsersLiked(medias){
  let newMediaCount =[]
  let Users = [];
  let likeddata=[];
  let media_id =[];
  medias.forEach(function(media){
      media_id.push(media.id);
  });
  let len = media_id.length;
    return  new Promise((resolve, reject) => {
        for(let i=0; i<len; i++){
            ig.likes(media_id[i], function(err, result) {
                if(err){
                    resolve(err);
                }else{                   
                    result.filter(function(el){
                        let avilableIndex = likeddata.indexOf(el.id);
                        if(avilableIndex == -1){
                           likeddata.push(el.id)
                           newMediaCount.push({"userId": el.id,"count":1,"userData":el})
                        }
                        else if(avilableIndex == 0 || avilableIndex == 1){
                            newMediaCount.forEach(function(item){
                                if(item.userId == el.id ){
                                  item.count = item.count +1 ;
                                }
                            })
                        }
                    })
                    if( i == len-1){
                        newMediaCount.sort(function(a, b){return b.count - a.count});
                        for(let j=0; j<newMediaCount.length; j++){
                            most_liked_users = {
                                'full_name' : newMediaCount[j].userData.full_name,
                                'url' : newMediaCount[j].userData.profile_picture,
                                'likes' : newMediaCount[j].count
                            }
                            Users[j]= most_liked_users;
                            if( j == newMediaCount.length-1){
                                resolve(Users);
                            }
                        }
                    }
                }
            });
        }
    })
}
function getUserCommented(medias){
    let commentedData =[];
    let newMediaCount =[]
    let media_id =[];
    let Users = [];
    medias.forEach(function(media){
      media_id.push(media.id);
     });
    let len = media_id.length;
    return  new Promise((resolve, reject) => {
        for(let i=0; i<len; i++){
            ig.comments(media_id[i], function(err, result, remaining, limit) {
                if(err){
                    reject (err);
                  }else{
                      result.filter(function(el){
                          let avilableIndex = commentedData.indexOf(el.from.id);
                          if(avilableIndex == -1){
                            commentedData.push(el.from.id)
                             newMediaCount.push({"userId": el.from.id,"count":1,"userData":el})
                          }
                          else if(avilableIndex == 0 || avilableIndex == 1){
                              newMediaCount.forEach(function(item){
                                  if(item.userId == el.from.id ){
                                    item.count = item.count +1 ;
                                  }
                              })
                          }
                      })
                      if(i == len-1){
                        newMediaCount.sort(function(a, b){return b.count - a.count});
                        for(i=0; i<newMediaCount.length; i++){
                            most_commented_users = {
                                'full_name' : newMediaCount[i].userData.from.full_name,
                                'url' : newMediaCount[i].userData.from.profile_picture,
                                'comments' : newMediaCount[i].count
                            }
                            Users[i]= most_commented_users;
                        }
                        resolve(Users);
                      }
                  }
            });
        }
    })
}
