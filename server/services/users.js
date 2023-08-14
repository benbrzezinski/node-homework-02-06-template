import User from "./models/users.js";

const getUser = async query => {
  try {
    return await User.findOne(query).lean();
  } catch (err) {
    console.error(err.message);
  }
};

const createUser = async body => {
  try {
    return new User(body);
  } catch (err) {
    console.error(err.message);
  }
};

const updateUser = async (query, body) => {
  try {
    return User.findOneAndUpdate(query, body, {
      runValidators: true,
      new: true,
    });
  } catch (err) {
    console.error(err.message);
  }
};

const service = {
  getUser,
  createUser,
  updateUser,
};

export default service;
