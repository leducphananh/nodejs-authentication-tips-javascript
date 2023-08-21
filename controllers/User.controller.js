const User = require('../models/User.model');

const getUsers = async (req, res, next) => {
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
};

module.exports = {
  getUsers,
};
