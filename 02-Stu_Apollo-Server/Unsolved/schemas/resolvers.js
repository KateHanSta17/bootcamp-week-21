const { Class } = require('../models');

// TODO: Add a comment describing the functionality of this expression
// the expression is defining the resolvers object which contains the Query object with a classes field that returns an array of Class objects.
const resolvers = {
  Query: {
    classes: async () => {
      // TODO: Add a comment describing the functionality of this statement
      // the statement is returning all of the Class objects from the database.
      return await Class.find({});
    }
  }
};

module.exports = resolvers;
