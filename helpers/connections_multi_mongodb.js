const mongoose = require('mongoose');

const newConnection = (uri) => {
  const connection = mongoose.createConnection(uri);

  connection.on('connected', function () {
    console.log(`Mongodb::: connected:::${this.name}`);
  });

  connection.on('disconnected', function () {
    console.log(`Mongodb::: disconnected:::${this.name}`);
  });

  connection.on('error', function (error) {
    console.log(`Mongodb::: error:::${JSON.stringify(error)}`);
  });

  return connection;
};

// make connection to DB test
const testConnection = newConnection('mongodb://127.0.0.1:27017/test');
const test01Connection = newConnection('mongodb://127.0.0.1:27017/test01');

module.exports = {
  testConnection,
  test01Connection,
};
