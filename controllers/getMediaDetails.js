let ig = require('instagram-node').instagram();

exports.getMediaDetails = function(req, res, next) { 
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
                        for(let i=0; i<medias.length; i++){
                            console.log(medias[i].user_has_liked,"tadaaa")
                        }
                    }
                    let dummyResult = {
                            "data": [{
                                "username": "jiyakarki",
                                "first_name": "Jiya",
                                "last_name": "karki",
                                "type": "user",
                                "id": "660033"
                            },
                            {
                                "username": "sammyjack",
                                "first_name": "Sammy",
                                "last_name": "Jack",
                                "type": "user",
                                "id": "29648"
                            }]
                        }
                        return res.status(200).send({
                            'status': 'success',
                            'messageId': 200,
                            'message': 'successfully accessed.',
                            'user' : dummyResult
                        });
                    console.log(dummyResult,"here you go!")
                });
            }
        });
        // ig.user_follows(userId, function(err, users, pagination, remaining, limit) {
        //     if(err) {
        //         console.log(err);
        //         return res.status(400).send({
        //             'status': 'failed',
        //             'messageId': 400,
        //             'message': 'error occured.',
        //             'error' : err
        //           });
        //     }else{
        //         let dummyUser = {
        //                 "data": [{
        //                     "username": "kevin",
        //                     "profile_picture": "http://images.ak.instagram.com/profiles/profile_3_75sq_1325536697.jpg",
        //                     "full_name": "Kevin Systrom",
        //                     "id": "3"
        //                 },
        //                 {
        //                     "username": "instagram",
        //                     "profile_picture": "http://images.ak.instagram.com/profiles/profile_25025320_75sq_1340929272.jpg",
        //                     "full_name": "Instagram",
        //                     "id": "25025320"
        //                 }]
        //             }
        //         return res.status(200).send({
        //             'status': 'success',
        //             'messageId': 200,
        //             'message': 'successfully accessed.',
        //             'user' : dummyUser
        //         });
        //     }
        // });
    }
    console.log("hema ;)")
}