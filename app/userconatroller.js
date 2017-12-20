//var userModel = require('./../../models/user');
//console.log(userModel)
var constantObj = require("./../../constants.js");
var instagramCredentials = constantObj.configInstagram;

var ig = require('instagram-node').instagram();
ig.use(instagramCredentials);

exports.getUser = function(req, res){
  
}

exports.getUserDetail = function(req, res) { 
  if (!req.body.access_token) {
    return  res.status(400).send({
      'status': 401,
      'messageId': 400,
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
    var stalker_count = 0;
    var user_blocking_me = 0;
    var user_not_followed = 0;
    var user_not_following = 0;
    var access_token = req.body.access_token;
    var userId = req.body.access_token.split('.')[0];
    var media_count = 7;
    var media_array_count = 0;
    var singleLikedArray = [];
    var singleCommentArray = [];
    var totalImageCount = 0; var totalVideoCount = 0; var totalLikeCount = 0; var totalCommentCount = 0;
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
            getUserMediaData(0,medias, singleLikedArray, function(error, likedArray){
                if (error) {
                    return res.status(401).send({
                        'status': 401,
                        'messageId': 401,
                        'message': err
                      });
                }else{
                    mediaData = likedArray;
                }
            });
            //get User Most Commented Media
            getUserCommentedMediaData(0,medias, singleCommentArray, function(error, commentArray){
                if (error) {
                    return res.status(401).send({
                        'status': 401,
                        'messageId': 401,
                        'message': err
                      });
                }else{
                    mediaComment = commentArray;
                }
            });
            // calculate total posts, video, images
            getUserMediaAnalytics(0,medias, totalImageCount, totalVideoCount, totalLikeCount, totalCommentCount,  function(error, mediaAnalytics){
                if (error) {
                    return res.status(401).send({
                        'status': 401,
                        'messageId': 401,
                        'message': err
                      });
                }else{
                    mediaAnalytics = mediaAnalytics;
                }
            }); 
            
            for(var i=0; i<media_array_count; i++){
              if(medias[i].type =='image'){
                total_images ++ ;
              }if(medias[i].type == 'video'){
                total_videos ++ ;
              }if(medias[i].likes.count!= '0'){
                total_likes ++ ;
              }if(medias[i].comments.count!= '0'){
                total_comments ++ ;
              }
            }
            userData = {
                username: result.username,
                profile_picture: result.profile_picture,
                follows: result.counts.follows,
                followed_by: result.counts.followed_by,
                total_post : result.counts.media,
                total_images : mediaAnalytics.total_images,
                total_videos : mediaAnalytics.total_videos,
                total_likes : mediaAnalytics.total_likes,
                total_comments : total_comments,
                like_per_photo : 0,
                like_per_video : 0,
                comment_per_photo : 0,
                comment_per_video : 0,
                stalker_count : stalker_count,
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
        getSortedMediaArray(0,likedArray, mediaCount, imageArray,function(err,imageData){
            if (err) {
                   return res.status(401).send({
                       'status': 401,
                       'messageId': 401,
                       'message': err
                     });
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
                   return res.status(401).send({
                       'status': 401,
                       'messageId': 401,
                       'message': err
                     });
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
function getUserMediaAnalytics(count, mediaArray, totalImageCount, totalVideoCount, totalLikeCount, totalCommentCount, cb) {
    var len = mediaArray.length - 1;
    if (count == len) {
        mediaAnalytics = {'totalImageCount': totalImageCount,'totalVideoCount' :totalVideoCount , 'totalLikeCount' : totalLikeCount, 'totalCommentCount' : totalCommentCount }
        //console.log('analytics = ', JSON.stringify(mediaAnalytics));
        return cb(null,mediaAnalytics);
    }else {
        if(mediaArray[count].type =='image'){
            totalImageCount ++ ;
        }else if(mediaArray[count].type == 'video'){
            totalVideoCount ++ ;
        }
        if(mediaArray[count].likes.count!= '0'){
            totalLikeCount ++ ;
        }
        if(mediaArray[count].comments.count!= '0'){
            totalCommentCount ++ ;
        }
        count ++;
        getUserMediaAnalytics(count, mediaArray, totalImageCount, totalVideoCount, totalLikeCount, totalCommentCount, cb);
    }
}

 
    