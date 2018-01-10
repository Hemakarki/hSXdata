let crypto = require('crypto');
let bcrypt = require('bcrypt-nodejs');
let mongoose = require('mongoose');
let Roles = require ('../models/roles.js');
let Schema = mongoose.Schema;

let adminSchema = Schema({
    username : {
       type : String,
       required: true,
       minLength: 4
    },
    full_name : {
      type : String
    },
    email: {
      type: String,
      unique: true,
      required: 'Please enter valid email id.'
    },
    password: {
      type: String,
      required: true,
      minLength: 8
    },
    roles: {
        type: 'string',
        enum: ['SA', 'A'],
        defaultsTo: 'A'
    },
    role_id: {
        type: Schema.Types.ObjectId,
        ref: 'Roles'
    },
    created_at : {
       type : Date,
       default : Date.now
    },
    is_deleted : {
       type : Boolean , 
       default: false
    }
  });

adminSchema.pre('save', function (next) {
    let user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(user.password, salt, null, function (err, hash) {
            user.password = hash;
            next();
        });
    });
});

adminSchema.methods.comparePassword = function (password, cb) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        cb(err, isMatch);
    });
};

let adminObj = mongoose.model('admin', adminSchema);
module.exports = adminObj;
