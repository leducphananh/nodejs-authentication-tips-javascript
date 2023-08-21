const express = require('express');
const route = express.Router();

const {
  register,
  login,
  refreshToken,
  logout,
} = require('../controllers/Auth.controller');

route.post('/register', register);

route.post('/login', login);

route.post('/refresh-token', refreshToken);

route.post('/logout', logout);

module.exports = route;
