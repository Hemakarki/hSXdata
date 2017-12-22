let constantObj = require("../constants.js");
let instagramCredentials = constantObj.configInstagram;

let ig = require('instagram-node').instagram();
ig.use(instagramCredentials);

exports.discoverUsers = function(req, res, next) { 
    // if (!req.body.access_token) {
    //     return  res.status(400).send({
    //       'status': '400',
    //       'messageId': 400,
    //       'message': 'please enter access token.'
    //     });
    //   }else{
    //     var access_token = req.body.access_token;
    //     ig.use({ access_token: access_token });

    //     let userId = req.body.access_token.split('.')[0];
     
    //   }
    }