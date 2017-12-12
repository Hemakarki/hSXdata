//var userModel = require('./../../models/user');
//console.log(userModel)
var constantObj = require("./../../constants.js");
var instagramCredentials = constantObj.configInstagram;

var ig = require('instagram-node').instagram();
ig.use(instagramCredentials);

exports.getUserDetail = function(req, res) {
  if (!req.body.access_token) {
    return  res.status(400).send({
      'status': 'error',
      'messageId': 400,
      'message': 'please enter access token.'
    });
  }else{
    var userData = {};
    var mediaData = [];
    var total_images = 0;
    var total_videos = 0;
    var total_likes = 0;
    var total_comments = 0;
    var access_token = req.body.access_token;
    var userId = req.body.access_token.split('.')[0];
    ig.use({ access_token: access_token });

    ig.user(userId, function(err, result, remaining, limit) {
      if(err) {
          return res.status(401).send({
            'status': 'error',
            'messageId': 401,
            'message': err
          });
      }else{
        ig.user_self_media_recent( function(err, medias, pagination, remaining, limit,userData) {
          if (err) {
            return res.status(401).send({
              'status': 'error',
              'messageId': 401,
              'message': err
            });
          }else {
            for(var i=0; i<medias.length; i++){
              if(medias[i].type =='image'){
                total_images ++ ;
              }if(medias[i].type == 'video'){
                total_videos ++ ;
              }if(medias[i].likes.count!= '0'){
                total_likes ++ ;
              }if(medias[i].comments.count!= '0'){
                total_comments ++ ;
              }
              var extractedData = 
              { likes: medias[i].likes.count,
                comments: medias[i].comments.count,
                url : medias[i].images.standard_resolution.url 
              }
              mediaData[i]= extractedData;
            }
            userData = {
              username: result.username,
              profile_picture: result.profile_picture,
              follows: result.counts.follows,
              followed_by: result.counts.followed_by,
              total_post : result.counts.media,
              total_images : total_images,
              total_videos : total_videos,
              total_likes : total_likes,
              total_comments : total_comments,
              mediaData : mediaData
            }
            return res.status(200).send({
              'status': 'success',
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
