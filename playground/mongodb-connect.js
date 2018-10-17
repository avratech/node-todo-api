// const mongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); //Object deconstruction - Same as above, additionally we are setting other vars

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('Unable to connect to the Mongodb server');
    }
    console.log('Successfully connected to Mongdb server');
    const db = client.db('TodoApp');

    // db.collection('Todos').insertOne({
    //     name: 'Vyj',
    //     age: 34,
    //     todo: 'Obtain OCP for Java',
    //     completed: false
    // },(err, result) => {
    //     if (err) {
    //         return console.log('Unable to write the data', err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 4));
    // });

    // db.collection('Users').insertOne({
    //     name: 'Chichu',
    //     age: 5,
    //     active: true
    // },(err, result) => {
    //     if (err) {
    //         return console.log('Unable to add user', err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    //// Finding/fetching records from DB - all and based on Query

    // db.collection('Users').find().toArray().then((result) => {
    //     console.log(JSON.stringify(result, undefined, 2));
    // }, (err) => {
    //         return console.log('Unable to add user', err);
    // });

    // db.collection('Users').find({adult: false}).toArray().then((result) => {
    //     console.log(JSON.stringify(result, undefined, 2));
    // }, (err) => {
    //     return console.log('Unable to add user', err);
    // });

    // db.collection('Users').find().count().then((result) => {
    //     console.log(`There are ${result} users in total`);
    // }, (err) => {
    //     return console.log('Unable to add user', err);
    // });

    // db.collection('Users').find({adult: true}).count().then((result) => {
    //     console.log(`There are ${result} adult users in total`);
    // }, (err) => {
    //     return console.log('Unable to add user', err);
    // });

    db.collection('Users').find({adult: true, _id: new ObjectID('5bc794d454d214e9cc5581ab')}).toArray().then((result) => {
        // console.log(`There are ${result} adult users in total`);
        console.log(JSON.stringify(result, undefined, 2));
    }, (err) => {
        return console.log('Unable to add user', err);
    });

    // client.close();

});
