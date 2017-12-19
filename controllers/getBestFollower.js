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
                        return userLiked.userdata
                    } )
                    .then((data) => {
                        getUserCommented(medias)
                        .then((commentdata) => {
                            return res.status(200).send({
                                 'status':200,
                                 'messageId' : 200,
                                 'most_likes_to_me' : data,
                                 'most_comment_to_me' : commentdata
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

function getUsersLiked(medias){
  let likeddata=[];
  let newMediaCount =[]
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
                        resolve(countMax(newMediaCount));
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
                          let avilableIndex = commentedData.indexOf(el.id);
                          if(avilableIndex == -1){
                            commentedData.push(el.id)
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
                      if(i == len-1){
                        resolve(countMax(newMediaCount));
                      }
                  }
            });
        }
    })
}

function countMax(userInfo){
    let userdata= [];
    var highestValue = 0;
    for (var i=0, len = userInfo.length; i<len; i++) {
      var countValue = Number(userInfo[i].count);
      if (countValue > highestValue) {
        highestValue = countValue;
         userdata = userInfo[i];
      }
    } return maxValue={
        "userdata" : userdata
    };
}

// function countcommentMax(userInfo){
//     let userdata= [];
//     var highestValue = 0;
//     for (var i=0, len = userInfo.length; i<len; i++) {
//       var countValue = Number(userInfo[i].count);
//       if (countValue > highestValue) {
//         highestValue = countValue;
//          userdata = userInfo[i];
//       }
//     } return maxValue={
//         "userdata" : userdata
//     };
// }