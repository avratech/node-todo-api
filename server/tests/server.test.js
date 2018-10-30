const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/Todo');

const seedTodos = [{
    _id: new ObjectID(),
    todotext: 'Buy Snacks'
}, {
    _id: new ObjectID(),
    todotext: 'Complete test cases',
    completed: true
}];

beforeEach((done) => {
   Todo.deleteMany({}).then(() => {
       //insert seed data
       Todo.insertMany(seedTodos);
       }).then((res) => done());
});

describe('POST /todos', () => {

    it('should not create any todos due to bad data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((result) => {
                    expect(result.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should create a todo successfully', (done) => {
        var todotext = 'Need to clean the garage';

        request(app)
            .post('/todos')
            .send({todotext})
            .expect(200)
            .expect((res) => {
                // expect(res.body.todotext).toBe(todotext);
                expect(res.body.result.todotext).toBe(todotext);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({todotext}).then((results) => {
                    expect(results.length).toBe(1);
                    expect(results[0].todotext).toBe(todotext);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('GET /todos', () => {

    it('should GET all todos', (done) => {

        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });

    it('should get by ID', (done) => {
        // var todoId = seedTodos[1]._id.toHexString();
        var todoId = seedTodos[1]._id.toString();
        request(app)
            .get(`/todos/${todoId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(todoId);
            })
            .end(done);
    });

    it('should return 404 if not found by ID', (done) => {
        var todoId = new ObjectID();
        request(app)
            .get(`/todos/${todoId}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-object ID', (done) => {
        var todoId = '123545654';
        request(app)
            .get(`/todos/${todoId}`)
            .expect(404)
            .end(done);
    });

});

describe('DELETE /todos', () => {

    it('should Delete all todos', (done) => {

        request(app)
            .delete('/todos')
            .expect(200)
            .end(done);
    });

    it('should delete by ID', (done) => {
        // var todoId = seedTodos[1]._id.toHexString();
        var todoId = seedTodos[1]._id.toString();
        request(app)
            .delete(`/todos/${todoId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(todoId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(todoId).then((results) => {
                    expect(results).toBe(null);
                    expect(results).toNotExist();
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return 404 if not found by ID', (done) => {
        var todoId = new ObjectID();
        request(app)
            .delete(`/todos/${todoId}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-object ID', (done) => {
        var todoId = '123545654';
        request(app)
            .delete(`/todos/${todoId}`)
            .expect(404)
            .end(done);
    });


});

describe('PATCH /todos/:id', () => {

    it('should update completedAt with valid date when its true', (done) => {
        var todoId = seedTodos[0]._id.toString();

        request(app)
            .patch(`/todos/${todoId}`)
            .send({'completed': true})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toNotBe(null);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.findById(todoId).then((results) => {
                    expect(results.completed).toBe(true);
                    expect(results.completedAt).toNotBe(null);
                    done();
                }) .catch((e) => done(e));
            });
    });

    it('should return 404 if not found by ID', (done) => {
        var todoId = new ObjectID();
        request(app)
            .patch(`/todos/${todoId}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-object ID', (done) => {
        var todoId = '123545654';
        request(app)
            .patch(`/todos/${todoId}`)
            .expect(404)
            .end(done);
    });

    it('should have completedAt as null when completed is false', (done) => {
        var todoId = seedTodos[1]._id.toString();
        var newTodoText = 'Buy More Snacks';

        request(app)
            .patch(`/todos/${todoId}`)
            .send({'todotext': newTodoText, 'completed': false})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBe(null);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.findById(todoId).then((results) => {
                    expect(results.completed).toBe(false);
                    expect(results.completedAt).toBe(null);
                    expect(results.completedAt).toNotExist();
                    expect(results.todotext).toBe(newTodoText);
                    done();
                }) .catch((e) => done(e));
            });
    });

});