const { User, Thought } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    users: async () => {
      return User.find().populate('thoughts');
    },
    user: async (parent, { username }) => {
      return User.findOne({ username }).populate('thoughts');
    },
    thoughts: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Thought.find(params).sort({ createdAt: -1 });
    },
    thought: async (parent, { thoughtId }) => {
      return Thought.findOne({ _id: thoughtId });
    },
  },

  Mutation: {
    // TODO: Add comments to each line of code below to describe the functionality below
    // addUser is a mutation that takes in a parent and args parameter and creates a new user with the args passed in as the user's data (username, email, password)
    // and returns a token and the user data as an object with the token and user key-value pairs respectively.
    addUser: async (parent, args) => { // parent is not used in this function and args is the parameter passed in.
      const user = await User.create(args); // create a new user with the args passed in as the user's data (username, email, password and return it as a user variable).
      const token = signToken(user); // sign a token with the user data and return it as a token variable.

      return { token, user };
    },
    // TODO: Add comments to each line of code below to describe the functionality below
    // login is a mutation that takes in a parent and args parameter and finds a user with the email passed in as the email parameter.
    // If the user is not found, an AuthenticationError is thrown. If the user is found, the password is checked to see if it is correct.
    // If the password is incorrect, an AuthenticationError is thrown. If the password is correct, a token is signed and returned with the user data 
    // as an object with the token and user key-value pairs respectively.

    login: async (parent, { email, password }) => { // parent is not used in this function and email and password are the parameters passed in.
      const user = await User.findOne({ email }); // find a user with the email passed in as the email parameter and return it as a user variable.

      if (!user) {
        throw AuthenticationError // if the user is not found, throw an AuthenticationError.
      }

      const correctPw = await user.isCorrectPassword(password); // check if the password passed in is correct and return it as a correctPw variable.

      if (!correctPw) {
        throw AuthenticationError // if the password is incorrect, throw an AuthenticationError.
      }

      const token = signToken(user); // sign a token with the user data and return it as a token variable.
      return { token, user }; // return the token and user data as an object with the token and user key-value pairs respectively.
    },
    addThought: async (parent, { thoughtText, thoughtAuthor }) => { // parent is not used in this function and thoughtText and thoughtAuthor are the parameters passed in.
      const thought = await Thought.create({ thoughtText, thoughtAuthor }); // create a new thought with the thoughtText and thoughtAuthor passed in as the thought's data and return it as a thought variable.

      await User.findOneAndUpdate( // find a user with the thoughtAuthor passed in as the thoughtAuthor parameter and update the user's thoughts with the thought's id.
        { username: thoughtAuthor }, // find a user with the thoughtAuthor passed in as the thoughtAuthor parameter.
        { $addToSet: { thoughts: thought._id } } // update the user's thoughts with the thought's id.
      );

      return thought; // return the thought variable.
    },
    addComment: async (parent, { thoughtId, commentText, commentAuthor }) => { // parent is not used in this function and thoughtId, commentText, and commentAuthor are the parameters passed in.
      return Thought.findOneAndUpdate( // find a thought with the thoughtId passed in as the thoughtId parameter and update the thought's comments with the comment's data.
        { _id: thoughtId }, // find a thought with the thoughtId passed in as the thoughtId parameter.
        {
          $addToSet: { comments: { commentText, commentAuthor } }, // update the thought's comments with the comment's data.
        },
        {
          new: true, // return the updated thought.
          runValidators: true, // run validators on the updated thought.
        }
      );
    },
    removeThought: async (parent, { thoughtId }) => { // parent is not used in this function and thoughtId is the parameter passed in.
      return Thought.findOneAndDelete({ _id: thoughtId }); // find a thought with the thoughtId passed in as the thoughtId parameter and delete it.
    },
    removeComment: async (parent, { thoughtId, commentId }) => { // parent is not used in this function and thoughtId and commentId are the parameters passed in.
      return Thought.findOneAndUpdate( // find a thought with the thoughtId passed in as the thoughtId parameter and pull the comment with the commentId passed in as the commentId parameter.
        { _id: thoughtId }, // find a thought with the thoughtId passed in as the thoughtId parameter.
        { $pull: { comments: { _id: commentId } } }, // pull the comment with the commentId passed in as the commentId parameter.
        { new: true } // return the updated thought.
      );
    },
  },
};

module.exports = resolvers; // export the resolvers object.
