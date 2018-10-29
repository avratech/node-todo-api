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
    todotext: 'Complete test cases'
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