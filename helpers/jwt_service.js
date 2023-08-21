const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const client = require('../connections/connections_redis');

const signAccessToken = async (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {
      userId,
    };

    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: '1m',
    };

    jwt.sign(payload, secret, options, (err, token) => {
      if (err) reject(err);

      resolve(token);
    });
  });
};

const verifyAccessToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return next(createError.Unauthorized());
  }

  const authHeader = req.headers.authorization;
  const bearerToken = authHeader.split(' ');
  const token = bearerToken[1];

  // verify token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      return next(createError.Unauthorized(err));
    }

    req.payload = payload;
    next();
  });
};

const signRefreshToken = async (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {
      userId,
    };

    const secret = process.env.REFRESH_TOKEN_SECRET;
    const options = {
      expiresIn: '1y',
    };

    jwt.sign(payload, secret, options, (err, token) => {
      if (err) reject(err);

      client.set(
        userId.toString(),
        token,
        {
          EX: 365 * 24 * 60 * 60,
        },
        (err, reply) => {
          if (err) reject(createError.InternalServerError());
          resolve(token);
        }
      );

      resolve(token);
    });
  });
};

const verifyRefreshToken = async (refreshToken) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, payload) => {
        if (err) return reject(err);

        client
          .get(payload.userId)
          .then((reply) => {
            if (refreshToken === reply) {
              return resolve(payload);
            }
            return reject(createError.Unauthorized());
          })
          .catch((err) => {
            return reject(createError.InternalServerError());
          });
      }
    );
  });
};

module.exports = {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
};
