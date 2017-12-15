let constantObj = require("../constants.js");
let instagramCredentials = constantObj.configInstagram;

let ig = require('instagram-node').instagram();
ig.use(instagramCredentials);

exports.getHistory = function(req, res, next) { 
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

        let earliest_followers = [];
        let latest_followers = [];
        let lost_followers = [];
        let unfollowed_users =[];

        ig.user_followers(userId, function(err, users, pagination, remaining, limit) {
          if(err) {
            return res.status(401).send({
               'status': 401,
               'messageId': 401,
               'message': err
           });
          }else{
            //get earliest followers
            getErliestFollowers(users, function(error, followers){
              if (error) {
                  return res.status(401).send({
                      'status': 401,
                      'messageId': 401,
                      'message': err
                    });
              }else{
                earliest_followers = followers;
              }
          });
            return res.send({
              'users':users,
              'earliest_followers':earliest_followers
            });
          }
        });
      }
    }

// function to find the earliest followers 

function getErliestFollowers(users, followers) {
  console.log(users,"users from the function");
  // share followers 
}
