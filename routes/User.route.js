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
      email,
    });
    if (isEmailExisted) {
      throw createError(
        STATUS_CODE.BAD_REQUEST,
        `${email} is already been registered`
      );
    }

    const user = new User({
      email,
      password,
    });
    const savedUser = await user.save();

    return res.status(STATUS_CODE.CREATED).json({
      user: savedUser,
    });
  } catch (error) {
    next(error);
  }
});

route.post('/refresh-token', (req, res, next) => {
  res.send('refresh-token function');
});

route.post('/login', async (req, res, next) => {
  try {
    const { error } = userValidate(req.body);

    if (error) {
      throw createError.BadRequest(STATUS_CODE.BAD_REQUEST, error);
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw createError.NotFound('User not registered');
    }

    const isValidPassword = await user.checkPassword(password);
    if (!isValidPassword) {
      throw createError.Unauthorized();
    }

    res.send(user);
  } catch (error) {
    next(error);
  }
});

route.post('/logout', (req, res, next) => {
  res.send('logout function');
});

module.exports = route;
