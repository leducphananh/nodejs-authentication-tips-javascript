const express = require('express');
const route = express.Router();
const createError = require('http-errors');
const { STATUS_CODE } = require('../helpers/helpers');

const User = require('../models/User.model');
const { userValidate } = require('../helpers/validation');

route.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { error } = userValidate(req.body);

    if (error) {
      throw createError(STATUS_CODE.BAD_REQUEST, error);
    }

    const isEmailExisted = await User.findOne({
      username: email,
    });
    if (isEmailExisted) {
      throw createError(
        STATUS_CODE.BAD_REQUEST,
        `${email} is already been registered`
      );
    }

    const createdUser = await User.create({
      username: email,
      password,
    });

    return res.status(STATUS_CODE.CREATED).json({
      user: createdUser,
    });
  } catch (error) {
    next(error);
  }
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
