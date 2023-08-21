const express = require('express');
const route = express.Router();

const { verifyAccessToken } = require('../helpers/jwt_service');
const { getUsers } = require('../controllers/User.controller');

route.get('/', verifyAccessToken, getUsers);

module.exports = route;
