let ig = require('instagram-node').instagram();

exports.getUser = function(req, res, next) {
  if (!req.body.access_token) {
    return  res.status(400).send({
      'status': 'error',
      'messageId': 400,
      'message': 'please enter access token.'
    });
  }else{
    let userData = {};
    let mediaData = [];
    let total_images = 0;
    let total_videos = 0;
    let total_likes = 0;
    let total_comments = 0;
    let maxlikes = [];
    let maxcomments = [];
    let access_token = req.body.access_token;
    let userId = req.body.access_token.split('.')[0];
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
            for(let i=0; i<medias.length; i++){
              if(medias[i].likes.count && medias[i].comments.count > maxlikes) {
                 maxlikes = medias[i].likes.count ;
                 maxcomments = medias[i].comments.count;
                // let average += medias[i];
              }if(medias[i].type =='image'){
                total_images ++ ;
              }if(medias[i].type == 'video'){
                total_videos ++ ;
              }if(medias[i].likes.count!= '0'){
                total_likes ++ ;
              }if(medias[i].comments.count!= '0'){
                total_comments ++ ;
              }
              console.log(maxlikes,'%%%%%%', maxcomments);
              let extractedData = 
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
exports.getMessage =  function (req,res, next) {
  return res.send({
    'message' : ' nothing found'
  })
}
