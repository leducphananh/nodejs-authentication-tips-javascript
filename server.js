const express = require('express');
const app = express();
const createError = require('http-errors');
const UserRoute = require('./routes/User.route');
require('dotenv').config();
require('./connections/connections_mongodb');
const { STATUS_CODE } = require('./helpers/helpers');

app.get('/', (req, res, next) => {
  res.send('Home page');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/user', UserRoute);

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
