let ig = require('instagram-node').instagram();

exports.getMediaDetails = function(req, res, next) { 
    let most_liked_data = [];
    let liked_media = [];
    let most_commented_data = [];
    let commented_media = [];
    if (!req.body.access_token) {
        return  res.status(400).send({
          'status': 'error',
          'messageId': 400,
          'message': 'please enter access token.'
        });
      }else{
        let access_token = req.body.access_token;
        ig.use({ access_token: access_token });
        let userId = req.body.access_token.split('.')[0];
        let hemadata = getFollowers(userId);

        // get list of users who liked recent upload
        ig.user_media_recent(userId, [], function(err, medias, pagination, remaining, limit) {
            if(err) {
                console.log(err);
                return res.send(err)
            }else{
                ig.likes(medias[0].id, function(err, result, remaining, limit) {
                    if(medias.length == 0 ){
                        return  res.status(412).send({
                            'status': 'error',
                            'messageId': 412,
                            'message': 'no data available.'
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
                            likes : most_liked_data[i].likes.count,
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
                        return res.status(200).send({
                            'status': 'success',
                            'messageId': 200,
                            'message': 'successfully accessed.',
                            'most_liked_media' : liked_media,
                            'most_commented_media' : commented_media
                        });
                    }
                });
            }
        });
      
        // get the follower list of the user
        function getFollowers(userId){
            let data=[] ;
            ig.user_follows(userId, function(err, users, pagination, remaining, limit) {
                if(err) {
                    console.log(err);
                    return err ;
                }else{
                    data= users;
                }
                return usersdata={
                    'user' : data
                };
            });
            return usersdata={
                'user' : data
            };
        }
    }
    console.log("hema ;)")
}