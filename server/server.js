var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/Todo');
var {User} = require('./models/User');

const port = process.env.PORT || 9000;

var app = express();

app.use(bodyParser.json());

app.listen(port, ()=>{
    console.log(`Server is up and listening @ ${port}`);
});

module.exports = {app};

app.post('/todos', (req, res) => {
    var todo = new Todo({
        todotext: req.body.todotext
    });

    todo.save().then((result) => {
        res.status(200).send({result});
    }, (e) => {
        res.status(400).send(e);
    });

});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
       res.status(200).send({todos});
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;

    if(ObjectID.isValid(id)) {
        Todo.findById(id).then((todo) => {
            if (!todo) {
                res.status(404).send();
            } else {
                res.status(200).send({todo});
            }
        }).catch((e) => {
            res.status(400).send();
        });
    } else {
        res.status(404).send();
    }
});

// var newTodo = new Todo({
//     item: "Need to park bike @ garage",
//     completed: false,
//     tobeCompletedBy: Number(new Date("22-Aug-2018 5:00 PM"))
// });
//
// newTodo.save().then((res) => {
//     console.log(`Todo saved: ${res}`);
// }, (e) => {
//     console.log(`Error while saving Todo: ${e}`);
// });

// var usr = new User({
//     username: 'abcde',
//     email: '123@aa.com'
// });
//
// usr.save().then((res) => {
//     console.log(`User created: ${res}`);
// }, (e) => {
//     console.log(`User creating failed: ${e}`);
// });

