let constantObj = require("../constants.js");
let instagramCredentials = constantObj.configInstagram;

let ig = require('instagram-node').instagram();
ig.use(instagramCredentials);

exports.getMediaDetails = function(req, res, next) { 
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
                let data = {};
                let commondata = [];
                
                // get popular upload
                let popularData =getMostpopulardmedia(medias,function(err,data){
                    if(err) {
                        return res.status(401).send({
                            'status': 401,
                            'messageId': 401,
                            'message': err
                          });
                    }else{
                        commondata = data;
                    }
                    
                })
                return res.status(200).send({
                    'status': '200',
                    'messageId': 200,
                    'message': 'successfully accessed.',
                    'Media Insights' : popularData
                });
            }
        });
    }
}
       
 // Description : common function to return getMostlikedmedia. 

    function getMostpopulardmedia(medias,data) {
        let popular_media = {};
        let most_liked_data = [];
        let liked_media = [];
        let most_commented_data = [];
        let commented_media = [];
        if (medias == 'undefined'){
            return res.status(401).send({
                'status': 401,
                'messageId': 401,
                'message': 'No media data found.'
            });
        }else{
            let Count = countMax(medias);
            for(let i=0; i<medias.length; i++){
                if(medias[i].likes.count == Count.likecount){
                    most_liked_data.push(medias[i])
                }
                if(medias[i].comments.count == Count.commentcount){
                    most_commented_data.push(medias[i])
                }
            }
            for(i=0; i<most_liked_data.length; i++){
                most_liked_media = {
                count : most_liked_data[i].likes.count,
                url : most_liked_data[i].images.standard_resolution
                }
                liked_media[i]= most_liked_media;
            }
            for(i=0; i<most_commented_data.length; i++){
                most_commented_media = {
                comments : most_commented_data[i].comments.count,
                url : most_commented_data[i].images.standard_resolution
                }
                commented_media[i]= most_commented_media;
            }
            popular_media = {
                'most_liked_media' : liked_media,
                'most_commented_media' : commented_media
            }
            return data={
                'most_popular_media' : popular_media,
                'most_liked_media' : liked_media,
                'most_commented_media' : commented_media
            };
        }
    }
  
// to count maximum count of like and
    function countMax(medias){
        var highestValuelike = 0;
        var highestValuecomment = 0;
        for (var i=0, len = medias.length; i<len; i++) {
          var likeValue = Number(medias[i].likes.count);
          var commentValue = Number(medias[i].comments.count);
          if (likeValue > highestValuelike) {
            highestValuelike = likeValue;
          }
          if (commentValue > highestValuecomment) {
            highestValuecomment = commentValue;
        }
        } return highestValue={
            "likecount" : highestValuelike,
            "commentcount" : highestValuecomment
        };
    } 
// end of countMax function

