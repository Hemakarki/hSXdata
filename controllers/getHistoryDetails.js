let constantObj = require("../constants.js");
let instagramCredentials = constantObj.configInstagram;

let ig = require('instagram-node').instagram();
ig.use(instagramCredentials);

exports.getHistoryDetails = function(req, res, next) { 
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
        let latest_followers = [];
        let lost_followers = [];
        ig.user_followers(userId, function(err, users, pagination, remaining, limit) {
          if(err) {
            return res.status(401).send({
               'status': 401,
               'messageId': 401,
               'message': err
           });
          }else{
            let earliest_followers = getErliestFollowers(users);
            return res.send({
              'earliest_followers':earliest_followers
            });
          }
        });
      }
    }

// function to find the earliest followers 
function getErliestFollowers(users, followers) {
  let earliest_followers = [];
  users.forEach(function(user){
    let filteredFollowers = {
      'full_name' : user.full_name, 
      'url' : user.profile_picture
    }
    earliest_followers.push(filteredFollowers);
  });
  return earliest_followers;
}
