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
            console.log(users,"users");
            let historyData = gethistory(users);

            return res.status(200).send({
              'status':200,
              'messageId' : 200,
              'history':historyData
            });
          }
        });
      }
    }

// function to find the Latest followers
function gethistory(users){
  var latest_followers = [];
  let earliest_followers = [];
  let lost_followers =[];
  let users_unfollowed =[];
  users.forEach(function(user){
    let filteredFollowers = {
      'name' : user.full_name, 
      'url' : user.profile_picture
    }
    latest_followers.push(filteredFollowers);
  });
  earliest_followers=latest_followers.slice().reverse();
  return history={
    'latest_followers':latest_followers,
    'earliest_followers' : earliest_followers,
    'All_lost_followers' : lost_followers,
    'users_unfollowed' : users_unfollowed
  }
}


// function to find the earliest followers 
// function getErliestFollowers(latest_followers) {
//   let earliest_followers = [];
//   earliest_followers=latest_followers.reverse();
//   return earliest_followers;
// }
