const Course = require('../models/course');
const User = require('../models/user');

module.exports = {
  Query: {
    async getUsers() {
      return await User.find();
    },
    async getUser(obj, { id }) {
      return await User.findById(id);
    },
  },
  Mutation: {
    async singUp(obj, { input }) {
      const user = new User(input);
      await user.save();
      return user;
    },
    async logIn(obj, { input }) {
      try {
        const user = User.authenticate(input);
        return user;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
  },
  User: {
    async courses(u) {
      return await Course.find({ user: u.id });
    }
  },
};