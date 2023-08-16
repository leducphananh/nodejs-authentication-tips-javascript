const mongoose = require('mongoose');

mongoose.connect(process.env.DB, { useNewUrlParser: true });

mongoose.connection.on('connected', function () {
  console.log(`Mongodb::: connected:::${this.name}`);
});

mongoose.connection.on('disconnected', function () {
  console.log(`Mongodb::: disconnected:::${this.name}`);
});

mongoose.connection.on('error', function (error) {
  console.log(`Mongodb::: error:::${JSON.stringify(error)}`);
});
