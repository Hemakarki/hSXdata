
let CoinsPackage = require('../../models/coins_package');

exports.getAllCoinsPackages =  function (req, res, next){
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
    CoinsPackage.count(query).exec(function (err, total) {
        if (err) {
            return res.status(400).send({
                success: false,
                error: err
            });
        } else {
            CoinsPackage.find(query).sort(sortBy).skip(skipNo).limit(count).exec(function (err, CoinsPackage) {
                if (err) {
                    return res.status(400).send({
                        success: false,
                        error: err
                    });
                }else if(CoinsPackage || CoinsPackage.count) {
                    return res.send({
                        success: true,
                        data: {
                            CoinsPackage: CoinsPackage,
                            total: total
                        },
                    });
                } else {
                    return res.status(204).send({
                        success: false,
                        msg:'No coin package records found.'
                    })
                }
            })
        }
    })
}

exports.getCoinsPackageById = function(req, res, next){
    let CoinsPackageId = req.params.id;
    CoinsPackage.findById(CoinsPackageId).exec(function (err, data) {
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
                msg:'No coin package records found.'
            })
        }
    });
}

exports.addCoinsPackage = function (req, res, next) {
    let data = req.body;
    let query = {
        'title':data.title
    }
    CoinsPackage.find(query,function(err, resultdata){
        if(err) {
            return res.status(400).send({
                success: false,
                error: err
            });
        } else if(resultdata.length!= 0 ){
                return res.status(401).send({
                    success: false,
                    msg:'CoinsPackage package with same title already exists.'
                }); 
        } else{
            CoinsPackage(data).save(data , function(err, result) {
                if (err) {
                    return res.status(400).send({
                        success: false,
                        error: err
                    });
                } else {
                    return res.send({
                        success: true,
                        msg: 'CoinsPackage successfully saved.'
                    });
                }  
            });
        }
    })
}

exports.updateCoinsPackage = function (req, res, next){
    let CoinsPackageId = req.params.id;
    CoinsPackage.findById(CoinsPackageId).exec(function (err, data) {
        if (err) {
            return res.status(400).send({
                success: false,
                error: err
            });
        } else if(data){
            CoinsPackage.update({'_id': CoinsPackageId}, {
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
                        msg: 'CoinsPackage successfully saved.'
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

exports.removeCoinsPackage =  function(req, res, next){
    let CoinsPackageId = req.params.id;
    CoinsPackage.remove({'_id': CoinsPackageId}, function(err, result){
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