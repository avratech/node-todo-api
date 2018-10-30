var env = process.env.NODE_ENV || 'dev';

if (env === 'dev') {
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
    process.env.PORT = 9000;
} else if (env === 'test') {
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
    process.env.PORT = 9000;
}

// console.log(`****************************** ${env} Environment ******************************`);
