const express = require('express');
const route = express.Router();
const createError = require('http-errors');

const User = require('../models/User.model');

route.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw createError.BadRequest();
    }

    const isEmailExisted = await User.findOne({
      username: email,
    });
    if (isEmailExisted) {
      throw createError.Conflict(`${email} is already been registered`);
    }

    const createdUser = await User.create({
      username: email,
      password,
    });

    return res.status(201).json({
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
