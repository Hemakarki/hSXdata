let constantObj = require("../constants.js");
let instagramCredentials = constantObj.configInstagram;

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
        ig.user_media_recent(userId, [], function(err, medias, pagination, remaining, limit) {          
            if(err) {
                return res.status(401).send({
                   'status': 401,
                   'messageId': 401,
                   'message': err
               });
            }else{
                let media_id = [];
                medias.forEach(function(media){
                 media_id.push(media.id);
                });
                let userdata = getUserslist(media_id,function(err,data){
                    if(err) {
                        return res.status(401).send({
                            'status': 401,
                            'messageId': 401,
                            'message': err
                          });
                    }else{
                        console.log(data);
                    }
                });
                console.log(userdata,"userdata")
                return res.send({
                    'msg':'thanks',
                    'userdata': userdata
                }) //final response from the api
            }
        });
    }
}

function getUserslist(media_id,data){
    let returndata= [];
    for(let i=0; i<media_id.length; i++){
        ig.likes(media_id[i], function(err, result, remaining, limit) {
            if(err){
                 return res.status(401).send({
                     'status': 401,
                     'messageId': 401,
                     'message': err
                 });
             }else{
                let commondata = {
                    'media_id' : media_id[i],
                    'user_likes' : result
                }
                returndata.push(commondata);
            }
        });
    } console.log(returndata,'reutr')   
    return data= {
        'commondata' : returndata
    };
}

