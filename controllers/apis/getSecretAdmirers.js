let constantObj = require("../../constants.js");
let instagramCredentials = constantObj.configInstagram;

let ig = require('instagram-node').instagram();
ig.use(instagramCredentials);

exports.getSecretAdmirers = function(req, res, next) { 
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

        ig.user_followers(userId, function(err, users, pagination, remaining, limit) {
          if(err) {
            return res.status(401).send({
               'status': 401,
               'messageId': 401,
               'message': err
           });
          }else{
            let secretUsers = getsecretUsers(users);
            
            return res.status(200).send({
              'status':200,
              'messageId' : 200,
              'secret_admirers':secretUsers
            });
          }
        });
      }
    }

function getsecretUsers(users){
  let secretUsers = [];
  /* The user who has liked and commented my media posts most but don’t follow me
  don't  have live data
  */
  return secretUsers ;
}