const express = require('express');
const app = express();
const createError = require('http-errors');
const UserRoute = require('./routes/User.route');
require('dotenv').config();

app.get('/', (req, res, next) => {
  res.send('Home page');
});

app.use('/user', UserRoute);

app.use((req, res, next) => {
  next(createError.NotFound('This route does not exist.'));
});

app.use((err, req, res, next) => {
  res.json({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
