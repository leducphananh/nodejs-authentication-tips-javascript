const express = require('express');
const route = express.Router();

const User = require('../models/User.model');
const { verifyAccessToken } = require('../helpers/jwt_service');

route.get('/', verifyAccessToken, async (req, res, next) => {
  const users = await User.find(
    {},
    {
      _id: 0,
      password: 0,
      __v: 0,
    }
  );

  return res.json({
    users,
  });
});

module.exports = route;
