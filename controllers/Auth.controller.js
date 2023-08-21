const createError = require('http-errors');
const { STATUS_CODE } = require('../helpers/helpers');

const User = require('../models/User.model');
const { userValidate } = require('../helpers/validation');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require('../helpers/jwt_service');
const client = require('../connections/connections_redis');

const register = async (req, res, next) => {
  try {
    const { error } = userValidate(req.body);

    if (error) {
      throw createError(STATUS_CODE.BAD_REQUEST, error);
    }

    const { email, password } = req.body;

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
};

const login = async (req, res, next) => {
  try {
    const { error } = userValidate(req.body);

    if (error) {
      throw createError(STATUS_CODE.BAD_REQUEST, error);
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

    const accessToken = await signAccessToken(user._id);
    const refreshToken = await signRefreshToken(user._id);
    res.json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw createError.BadRequest();
    }

    const { userId } = await verifyRefreshToken(refreshToken);
    const accessToken = await signAccessToken(userId);
    const newRefreshToken = await signRefreshToken(userId);

    res.json({
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw createError.BadRequest();
    }

    const { userId } = await verifyRefreshToken(refreshToken);
    client
      .del(userId.toString())
      .then(() => {
        res.json({
          message: 'Logout successful!',
        });
      })
      .catch((err) => {
        if (err) throw createError.InternalServerError();
      });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
};
