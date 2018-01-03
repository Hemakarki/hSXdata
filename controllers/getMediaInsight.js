
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
                let popularData =getMostpopulardmedia(medias);
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
        if (medias == 'undefined'){
            return res.status(401).send({
                'status': 401,
                'messageId': 401,
                'message': 'No media data found.'
            });
        }else{
            let most_liked_data = getmostlikedmedia(medias);
            let most_commented_data = getmostcommentedmedia(medias);
            let popular_data = most_liked_data.sort(function(a, b){return b.likes.count - a.comments.count});
            return data={
                'most_popular_media' : popular_data,
                'most_liked_media' : most_liked_data,
                'most_commented_media' : most_commented_data
            };
        }
    }
    function getmostlikedmedia(medias){
        let liked_media = [];
        medias.sort(function(a, b){return b.likes.count - a.likes.count}); 
        for(i=0; i<medias.length; i++){
            most_liked_media = {
            likes : medias[i].likes.count,
            comments:medias[i].comments.count,
            url : medias[i].images.standard_resolution.url
            }
            liked_media[i]= most_liked_media;
        }
        return liked_media;
    }
    function getmostcommentedmedia(medias){
        let commented_media = [];
        medias.sort(function(a, b){return b.comments.count - a.comments.count});             
        for(i=0; i<medias.length; i++){
            most_commented_media = {
            likes : medias[i].likes.count,
            comments : medias[i].comments.count,
            url : medias[i].images.standard_resolution.url
            }
            commented_media[i]= most_commented_media;
        }
        return commented_media;     
    }

