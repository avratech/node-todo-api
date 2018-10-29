var mongoose = require('mongoose');

var User = mongoose.model('User', {
    username: {
        type: String,
        required: true,
        minLength: 4,
        trim: true
    },
    email: {
        type: String,
        required: true,
        minLength: 4,
        trim: true
    },
});

module.exports = {User};