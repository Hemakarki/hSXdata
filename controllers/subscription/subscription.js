
let Subscription = require('../../models/subscription');

exports.getAllSubscriptions =  function (req, res, next){
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
            title: {
                'like': '%' + search + '%'
            }
        }, {
            description: {
                'like': '%' + search + '%'
            }
        }, {
            package_validity: {
                'like': '%' + search + '%'
            }
        }, {
            amount: {
                'like': '%' + search + '%'
            }
        }
        ]
    }
    Subscription.count(query).exec(function (err, total) {
        if (err) {
            return res.status(400).send({
                success: false,
                error: err
            });
        } else if(total == 0){
            return res.status(204).send({
                success: false,
                msg:'No records found.'
            })
        } else {
            Subscription.find(query).sort(sortBy).skip(skipNo).limit(count).exec(function (err, subscriptions) {
                if (err) {
                    return res.status(400).send({
                        success: false,
                        error: err
                    });
                } else if(subscriptions || subscriptions.count) {
                    return res.send({
                        success: true,
                        data: {
                            subscriptions: subscriptions,
                            total: total
                        },
                    });
                } else{
                    return res.status(204).send({
                        success: false,
                        msg:'No subscription records found.'
                    })
                }
            })
        }
    })
}

exports.getSubscriptionById = function(req, res, next){
    let subscriptionId = req.params.id;
    Subscription.findById(subscriptionId).exec(function (err, data) {
        if (err) {
            return res.status(400).send({
                success: false,
                error: err
            });
        } else if(data || data.count) {
            return res.send({
                success: true,
                data: data
            });
        }else {
            return res.status(204).send({
                success: false,
                msg:'No subscription records found.'
            })
        }
    });
}

exports.addSubscription = function (req, res, next) {
    let data = req.body;
    let query = {
        'title':data.title
    }
    Subscription.find(query,function(err, resultdata){
        if (err) {
            return res.status(400).send({
                success: false,
                error: err
            });
        } else if(resultdata.length!= 0 ){
            return res.status(401).send({
                success: false,
                msg:'Subscription package with same title already exists.'
            }) 
        }else{
                Subscription(data).save(data , function(err, result) {
                    if (err) {
                        return res.status(400).send({
                            success: false,
                            error: err
                        });
                    } else {
                        return res.send({
                            success: true,
                            msg: 'Subscription successfully saved.'
                        });
                    }  
                });
            }
        })
    }

exports.updateSubscription = function (req, res, next){
    let subscriptionId = req.params.id;
    Subscription.findById(subscriptionId).exec(function (err, data) {
        if (err) {
            return res.status(400).send({
                success: false,
                error: err
            });
        } else if(data){
            Subscription.update({'_id': subscriptionId}, {
                $set: {
                  "title": req.body.title,
                  "description": req.body.description,
                  "package_validity": req.body.package_validity,
                  "amount": req.body.amount,
                  "is_deleted": false
                }
              }).exec(function(err, result) {
                if (err) {
                    return res.status(400).send({
                        success: false,
                        error: err
                    });
                } else {
                    return res.send({
                        success: true,
                        msg: 'Subscription successfully saved.'
                    });
                }  
            });
        }else{
            return res.status(204).send({
                success: false,
                msg: 'no record found.'
            });
        }
    });
}

exports.removeSubscription =  function(req, res, next){
    let subscriptionId = req.params.id;
    Subscription.remove({'_id': subscriptionId}, function(err, result){
        if(err) {
            return res.status(400).send({
                success: false,
                error: err
            });
        }else{
            return res.status(200).send({
                success: true,
                msg: 'Successfully deleted.'
            });
        }
    })
}