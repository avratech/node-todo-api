var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
    todotext: {
        type: String,
        required: true,
        minLength: 2,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    },
    tobeCompletedBy: {
        type: Number,
        default: (new Date()).setDate(new Date().getDate()+1)
    }
});

module.exports = {Todo};
