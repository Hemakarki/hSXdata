let Admin = require('../../models/admin');
let Users = require('../../models/user');
let jwt = require('jsonwebtoken');
let crypto = require('crypto');
let constantObj = require("../../constants.js");
let moment = require('moment');

function generateToken(user) {
	let payload = {
		iss: 'my.domain.com',
		sub: user._id,
		iat: moment().unix(),
		exp: moment().add(2, 'days').unix()
    };
	return jwt.sign(payload, constantObj.TOKEN_SECRET);
}

exports.login = function(req, res, next) {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ message: 'Use credentials to login' });
    }else{
        Admin.findOne({
            username:req.body.username,
            roles:'SA'
        }).exec(function(err, user) {
            if (!user) {
                return res.status(401).send({
                    msg: 'The email address ' + req.body.email + ' is not associated with any account. ' + 'Double-check your email address and try again.'
                });
            }else{
            /*-- this condition is for check that this account is active or not---- */
            user.comparePassword(req.body.password, function(err, isMatch) {
                if (!isMatch) {
                    return res.status(401).send({
                        msg: 'Invalid password'
                    });
                } else {
                        res.status(200).send({
                        token: generateToken(user),
                        user: user.toJSON()
                    });
                }
            })
        }
        })
    }

};

exports.signup = function (req,res, next) {
    Admin.findOne({username:req.body.username}, function(err, user){
        if( err ){
            return res.send({'msg': err});            
        }else{
            Admin.create({
                username : req.body.username,
                password : req.body.password,
                email : req.body.email,
                roles : req.body.roles
            }, function(err, data) {
                if(err){
                    return res.status(400).send({
                        err: err
                    });
                }else{
                    return res.status(200).send({
                        user: data,
                        token: generateToken(data)
                    });
                }
            });
                                
        }
    });
   
}
exports.getUser = function(req, res, next){
    let userId = req.params.id;
    Users.findById(userId).exec(function (err, user) {
        if (err) {
            return res.status(400).send({
                success: false,
                error: err
            });
        } else {
            return res.send({
                success: true,
                userdata: user
            });
        }
    });
}

exports.getAllUsers = function(req, res, next){
        let search = req.params.search;
        let sortBy = req.param.sortBy;
        let page = req.param.page;
        let count = req.param.count;
        let skipNo = (page - 1) * count;
        let query = {};
        if (sortBy) {
            sortBy = sortBy.toString();
        } else {
            sortBy = 'created_at desc';
        }
        if (search) {
            query.$or = [{
                fullName: {
                    'like': '%' + search + '%'
                }
            }, {
                email: {
                    'like': '%' + search + '%'
                }
            }, {
                username: {
                    'like': '%' + search + '%'
                }
            }, {
                user_instagram_id: {
                    'like': '%' + search + '%'
                }
            }, {
                media_count : {
                    'like': '%' + search + '%'
                }
            },
            ]
        }
        Users.count(query).exec(function (err, total) {
            if (err) {
                return res.status(400).send({
                    success: false,
                    error: err
                });
            } else {
                Users.find(query).sort(sortBy).skip(skipNo).limit(count).exec(function (err, users) {
                    if (err) {
                        return res.status(400).send({
                            success: false,
                            error: err
                        });
                    } else {
                        return res.send({
                            success: true,
                            data: {
                                users: users,
                                total: total
                            },
                        });
                    }
                })
            }
        })
    }


