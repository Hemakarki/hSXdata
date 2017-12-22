let async = require('async');
var userObj = require('../models/user');
var constantObj = require("../constants.js");
var instagramCredentials = constantObj.configInstagram;

var ig = require('instagram-node').instagram();
ig.use(instagramCredentials);

exports.getUserDetail = function(req, res) { 
  if (!req.body.access_token) {
    return  res.status(400).send({
      'status': 401,
      'messageId': 401,
      'message': 'please enter access token.'
    });
  }else{ 
    var userData = {};
    var mediaData = [];
    var mediaComment = [];
    var total_images = 0;
    var total_videos = 0;
    var total_likes = 0;
    var total_comments = 0;
    var like_per_photo = 0;
    var like_per_video = 0;
    var comment_per_photo = 0;
    var comment_per_video = 0;
    var stalker_count = {};
    var access_token = req.body.access_token;
    var userId = req.body.access_token.split('.')[0];
    var media_count = 7;
    var show_stalker_count = 3;
    var media_array_count = 0;
    var singleLikedArray = [];
    var singleCommentArray = [];
    var singleFollowArray = [];
    var singleUnfollowArray = [];
    var total_post = 0;
    var returnFollowerData = {};
    var responseMedias = [];
    var returnStalkerData = [];
    var singleStalkerArray = [];
    var user_blocking_me =  {};
    var user_not_followed =  {};
    var user_not_following =  {};
    ig.use({ access_token: access_token });
    
    ig.user(userId, function(err, result, remaining, limit) {
      if(err) {
          return res.status(401).send({
            'status': 401,
            'messageId': 401,
            'message': err
          });
      }else{
        ig.user_self_media_recent( function(err, medias, pagination, remaining, limit,userData) {
          if (err) {
            return res.status(401).send({
              'status': 401,
              'messageId': 401,
              'message': err
            });
          }else {
            //get User Most Liked Media
            getUserMediaData(0, medias, singleLikedArray, function(error, likedArray){
                if (error) {
                    return res.status(401).send({
                        'status': 401,
                        'messageId': 401,
                        'message': err
                      });
                }else{
                    mediaData = likedArray;
                    //get User Most Commented Media
                    getUserCommentedMediaData(0, medias, singleCommentArray, function(error, commentArray){
                        if (error) {
                            return res.status(401).send({
                                'status': 401,
                                'messageId': 401,
                                'message': err
                              });
                        }else{
                            mediaComment = commentArray;
                            var fetchedMediaAnalytics  = {'totalImageCount' : 0, 'totalVideoCount' : 0, 'totalImageLike' :0, 'totalVideoLike' : 0, 'totalVideoComment' : 0, 'totalImageComment' : 0}
                            getUserMediaAnalytics(0, medias, fetchedMediaAnalytics,   function(error, mediaAnalytics){
                                if (error) {
                                    return res.status(401).send({
                                        'status': 401,
                                        'messageId': 401,
                                        'message': err
                                      });
                                }else{
                                    //let likePerVideo = (mediaAnalytics.totalVideoLike/mediaAnalytics.totalVideoCount).toFixed(1);
                                    mediaAnalytics = mediaAnalytics;
                                    like_per_photo = (mediaAnalytics.totalImageLike/mediaAnalytics.totalImageCount).toFixed(1);
                                    like_per_video = 0
                                    //console.log('hh', typeof (like_per_video), like_per_video);
                                    comment_per_photo = (mediaAnalytics.totalImageComment/mediaAnalytics.totalImageCount).toFixed(1);
                                    comment_per_video = 0;
                                    total_likes =  mediaAnalytics.totalImageLike + mediaAnalytics.totalVideoLike;
                                    total_comments =  mediaAnalytics.totalImageComment + mediaAnalytics.totalVideoComment;
                                    total_images = mediaAnalytics.totalImageCount;
                                    total_videos = mediaAnalytics.totalVideoCount;
                                    total_post = mediaAnalytics.totalImageCount + mediaAnalytics.totalVideoCount;
                                }
                                ig.user_follows(userId, function(err, users, remaining, limit) {
                                    if (err) { 
                                      return res.status(401).send({
                                        'status': 401,
                                        'messageId': 401,
                                        'message': err
                                      });
                                    }else {
                                        // find profile stalkers
                                        getUserStalkerData(0, users, show_stalker_count, singleStalkerArray, function(error, stalkerData){
                                            if (error) { 
                                                return res.status(401).send({
                                                    'status': 401,
                                                    'messageId': 401,
                                                    'message': error
                                                  });
                                            }else{
                                                returnStalkerData = stalkerData;
                                                 // find user_blocking_me, user_not_followed, user_not_following, stalker_count and array
                                                getUserFollowData(0, users, singleFollowArray, singleUnfollowArray, function(error, followerData){
                                                    if (error) {
                                                        return res.status(401).send({
                                                            'status': 401,
                                                            'messageId': 401,
                                                            'message': error
                                                          });
                                                    }else{
                                                        var user_blocking_me =  {'count':followerData[1].length, 'userArray':followerData[1]};
                                                        var user_not_followed =  {'count':followerData[0].length, 'userArray':followerData[0]};
                                                        var user_not_following =  {'count':followerData[1].length, 'userArray':followerData[1]};
                                                    
                                                      userData = {
                                                            username: result.username,
                                                            profile_picture: result.profile_picture,
                                                            follows: result.counts.follows,
                                                            followed_by: result.counts.followed_by,
                                                            total_post : total_post,
                                                            total_images : total_images,
                                                            total_videos : total_videos,
                                                            total_likes : total_likes,
                                                            total_comments : total_comments,
                                                            like_per_photo : like_per_photo,
                                                            like_per_video : like_per_video,
                                                            comment_per_photo : comment_per_photo,
                                                            comment_per_video : comment_per_video,
                                                            stalker_count : returnStalkerData,
                                                            user_blocking_me : user_blocking_me,
                                                            user_not_followed : user_not_followed,
                                                            user_not_following:user_not_following,
                                                            mediaData : mediaData,
                                                            mediaComment : mediaComment,
                                                        }
                                                        return res.status(200).send({
                                                          'status': 200,
                                                          'messageId': 200,
                                                          'message': 'successfully accessed  user information with provided access token.',
                                                          'userData' : userData
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                                
                            });
                        }
                    });
                }
            });
          }
        });
      }
    })
  }
}
/*
 * Description : function to return most liked data i.e desc sort by likes, fetch media array  and count.
 
*/
function getUserMediaData(count, mediaArray, likedArray, cb) {
    var mediaCount = 7;
    var imageArray = [];
    var singleSortedArray = [];
    var len = mediaArray.length - 1;
    var calculatedLikeObject = {};
    var remainingPostCount = 0;
    if (count == len) {
        likedArray.sort(function (a, b) {
            return b.pulledCount - a.pulledCount;
        });
        getSortedMediaArray(0,likedArray, mediaCount, imageArray,function(err, imageData){
            if (err) {
                   return err;
               }else{
                if (mediaArray.length > mediaCount) {
                   remainingPostCount = mediaArray.length - mediaCount;
                }
                calculatedLikeObject = {'remainingCount': remainingPostCount, 'imageArray':imageData}
                return cb(null,calculatedLikeObject);
            }
        })    
    }else {
        var extractedItem = 
        { pulledCount: mediaArray[count].likes.count,
          url : mediaArray[count].images.standard_resolution.url 
        }
        likedArray.push(extractedItem);
        count ++;
        getUserMediaData(count, mediaArray,likedArray, cb);
    }
}
/* Description : common function to return only media array equal to mediaCount.  Suppose we have 20 sorted media, we need to return only 7 media
 
*/
function getSortedMediaArray(sortCount, sortArray, mediaCount, imageArray, cb) {
    if (sortCount == mediaCount) { 
        return cb(null,imageArray)
    }else { 
        if (typeof sortArray[sortCount] !== 'undefined') {
            var url = sortArray[sortCount].url;
           imageArray.push(url);
           sortCount++;
           getSortedMediaArray(sortCount, sortArray, mediaCount,imageArray, cb);  
        }else {
            return cb(null,imageArray)
        }
    }
    
}
/* Description : function to return most commented data i.e desc sort by comments, fetch media array  and count.
 
*/
function getUserCommentedMediaData(count, mediaArray, commentArray, cb) {
    var mediaCount = 7;
    var imageArray = [];
    var singleSortedArray = [];
    var len = mediaArray.length - 1;
    var calculatedLikeObject = {};
    var remainingPostCount = 0;
    if (count == len) {
        commentArray.sort(function (a, b) {
            return b.pulledCount - a.pulledCount;
        });
        getSortedMediaArray(0,commentArray, mediaCount, imageArray,function(err,imageData){
            if (err) {
                return err;
                   
               }else{
                if (mediaArray.length > mediaCount) {
                   remainingPostCount = mediaArray.length - mediaCount;
                }
                calculatedLikeObject = {'remainingCount': remainingPostCount, 'imageArray':imageData}
                return cb(null,calculatedLikeObject);
            }
        })    
    }else {
        var extractedItem = 
        { pulledCount: mediaArray[count].comments.count,
          url : mediaArray[count].images.standard_resolution.url 
        }
        commentArray.push(extractedItem);
        count ++;
        getUserMediaData(count, mediaArray,commentArray, cb);
    }
}
/*
 * Description : function to calculate total number of videos, total number of Post, total number of images with image array .
 
*/
function getUserMediaAnalytics(count, mediaArray, fetchedMediaAnalytics, cb) {
    var len = mediaArray.length - 1;
    if (count == len) {
        return cb(null,fetchedMediaAnalytics);
    }else {
        if(mediaArray[count].type =='image'){
            fetchedMediaAnalytics.totalImageCount ++;
            if(mediaArray[count].likes.count!= '0'){
                fetchedMediaAnalytics.totalImageLike ++ ;
            }
            if(mediaArray[count].comments.count!= '0'){
                fetchedMediaAnalytics.totalImageComment ++ ;
            }
        }else if(mediaArray[count].type == 'video'){
            fetchedMediaAnalytics.totalVideoCount ++ ;
            if(mediaArray[count].likes.count!= '0'){
                fetchedMediaAnalytics.totalVideoLike ++ ;
            }
            if(mediaArray[count].comments.count!= '0'){
                fetchedMediaAnalytics.totalVideoComment ++ ;
            }
        }
        count ++;
        getUserMediaAnalytics(count, mediaArray, fetchedMediaAnalytics, cb);
    }
}
/*
 * Description : function to calculate user_blocking_me, user_not_followed, user_not_following, stalker_count and array .
 
*/
function getUserFollowData(count, userArray, unfollowArray, unfollowingArray, cb) {
    var len = userArray.length;
    var outgoingStatus = '';
    var incomingStatus = '';
    if (count == len) { 
        var singleFollowArray = [];
        singleFollowArray.push(unfollowingArray);
        singleFollowArray.push(unfollowArray);
        return cb(null, singleFollowArray);
    }else {
        var userId = userArray[count].id;
        // fetch user relationship owner with access token owner
        ig.user_relationship(userId, function(err, relationshipResult, remaining, limit) {
            if (err) {
                return err;
            }else {
                if(typeof relationshipResult.incoming_status === 'string' || relationshipResult.incoming_status === '') {
                    incomingStatus = relationshipResult.incoming_status;
                }
                if(typeof relationshipResult.outgoing_status === 'string' || relationshipResult.outgoing_status === '') {
                   outgoingStatus = relationshipResult.outgoing_status;
                }
                if (incomingStatus == 'none') {
                    unfollowingArray.push(userArray[count].profile_picture);
                }
                if (outgoingStatus  == 'none') {
                    unfollowArray.push(userArray[count].profile_picture);
                }
                count ++;
                getUserFollowData(count, userArray, unfollowArray, unfollowingArray, cb);
            }
        });
    }
}
function getUserStalkerData(count, userArray, showStalkerCount, fetchedUserStalker, cb) {
    var len = userArray.length;
    var stalkerResponse = {};
    var stalkerCount = showStalkerCount;
    if (len < showStalkerCount) {
       stalkerCount = len;
    }
   if (count == showStalkerCount) { 
        stalkerResponse = {'count':stalkerCount, stalkerArray: fetchedUserStalker};
        return cb(null,stalkerResponse);
    }else {  
        if (typeof userArray[count] !== 'undefined') {
           var userPicture = userArray[count].profile_picture;
            fetchedUserStalker.push(userPicture);
            count ++;
            getUserStalkerData(count, userArray, stalkerCount, fetchedUserStalker, cb);
        }else {
            stalkerResponse = {'count':stalkerCount, stalkerArray: fetchedUserStalker};
            return cb(null,stalkerResponse);
        }
    }
}
exports.getFollowerDetail = function(req, res) {   
}

exports.UserDetail = function(req, res) { 
    if (!req.body.access_token) {
      return  res.status(400).send({
        'status': 401,
        'messageId': 400,
        'message': 'please enter access token.'
      });
    }else{ 
        var access_token = req.body.access_token;
        var userId = req.body.access_token.split('.')[0];
        ig.use({ access_token: access_token });
        ig.user(userId, function(err, result) {
            if(err) {
                var outputJSON = {
                    "status": 401,
                    "messageId": 401,
                    "message": err
                }
                return res.status(401).jsonp(outputJSON)
            }else{
                var obj = {
                    'user_id':result.id,
                    'username': result.username, 
                    'full_name': result.full_name, 
                    'profile_picture' : result.profile_picture, 
                    'media_count' :result.counts.media, 
                    'follows_count': result.counts.follows, 
                    'followed_by_count' : result.counts.follows
                };
                userObj.findOne({
                    'user_id': result.id}, function(err, data) {
                        if (err) {
                            var outputJSON = {
                              "status": 401,
                              "messageId": 401,
                              "message": "Something went wrong."
                            }
                            return res.status(401).jsonp(outputJSON)
                        }else if(data == null){
                            console.log("should not be heere")
                            userObj.remove({'_id': obj.user_id },function(err) {
                                let saveduser= saveUser(obj);
                                console.log(saveduser,"result")
                                if (saveduser == 'undefined'){
                                    var outputJSON = {
                                        "status": 401,
                                        "messageId": 401,
                                        "message": "User Not saved.",
                                        "err": err
                                    }
                                    return res.status(200).jsonp(outputJSON)
                                  }else{
                                    var outputJSON = {
                                        "status": 200,
                                        "messageId": 200,
                                        "message": "User successfully saved.",
                                        "data": saveduser
                                    }
                                    return res.status(200).jsonp(outputJSON)
                                  }
                            })
                        }else{
                            console.log("should be here")
                                userObj.update(
                                    { _id: userObj._id},{ $set: {$set: obj}},function(err, data) {
                                    if (err) {
                                        var outputJSON = {
                                            "status": 401,
                                            "messageId": 401,
                                            "message": "User Not updated.",
                                            "err": err
                                        }
                                        return res.status(200).jsonp(outputJSON)
                                    }else{
                                        var outputJSON = {
                                            "status": 200,
                                            "messageId": 200,
                                            "message": "User successfully updated.",
                                            "data": data
                                        }
                                        return res.status(200).jsonp(outputJSON)
                                    }
                                })
                            }
                        })
                    }
                })
            }
        }

let saveUser = function(obj) {
  userObj(obj).save(obj, function(err, result) {
    if (err) {
        return err;
    }
  })
}