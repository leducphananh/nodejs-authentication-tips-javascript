const express = require('express');
const app = express();
const createError = require('http-errors');

const UserRoute = require('./routes/User.route');
const AuthRoute = require('./routes/Auth.route');
const { STATUS_CODE } = require('./helpers/helpers');

require('dotenv').config();
require('./connections/connections_mongodb');
require('./connections/connections_redis');

app.get('/', (req, res, next) => {
  res.send('Home page');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/users', UserRoute);
app.use('/auth', AuthRoute);

app.use((req, res, next) => {
  next(createError.NotFound('This route does not exist.'));
});

app.use((err, req, res, next) => {
  res.status(err.status || STATUS_CODE.INTERNAL_SERVER_ERROR).json({
    status: err.status || STATUS_CODE.INTERNAL_SERVER_ERROR,
    message: err.message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
