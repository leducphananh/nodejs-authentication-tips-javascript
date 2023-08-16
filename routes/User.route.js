const express = require('express');
const route = express.Router();

route.post('/register', (req, res, next) => {
  res.send('register function');
});

route.post('/refresh-token', (req, res, next) => {
  res.send('refresh-token function');
});

route.post('/login', (req, res, next) => {
  res.send('login function');
});

route.post('/logout', (req, res, next) => {
  res.send('logout function');
});

module.exports = route;
