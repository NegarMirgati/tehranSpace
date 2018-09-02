var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required : true
    },

    university: {
        type: String,
        required : false
    },

    bday: {
        type: Date,
        required : false
    }
});

//authenticate input against database
UserSchema.statics.authenticate = function (email, password) {
    return new Promise(function (resolve, reject) {
        User.findOne({ email: email })
        .exec()
        .then(user => {
            if (!user) {
                var err = new Error('User not found.')
                err.status = 401;
                reject(err);
            }

            bcrypt.compare(password, user.password)
            .then((result) => {
                if (result === true) {
                    resolve(user)
                } else {
                    var err = new Error('User name or password is incorrect')
                    reject(err)
                }
            })
        })
        .catch(err => {
            reject(err)
        })
    })
}

//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
    var user = this;
    console.log(user)
    bcrypt.hash(user.password, 10)
    .then(hash => {
        user.password = hash
        next()
    })
    .catch(err => {
        next(err)
    })
});


var User = mongoose.model('User', UserSchema)
module.exports = User
