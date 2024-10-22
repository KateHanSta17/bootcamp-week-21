const express = require('express');
// TODO: Add a comment describing the functionality of this expression
// the expression is importing the ApolloServer class from the apollo-server package and the 
// expressMiddleware function from the apollo-server/express4 package.
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');

// TODO: Add a comment describing the functionality of this expression
// the expression is importing the typeDefs and resolvers objects from the schemas file
// the typeDefs object contains the schema for the graphql server and the resolvers object contains the functions that will be called when the server receives a query or mutation.
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers
});

const app = express();

// TODO: Add a comment describing the functionality of this async function
// the function is starting the Apollo server and setting up the express server to use the middleware function from the 
// Apollo server package to handle the graphql endpoint and then starting the express server on the specified port and logging a message to the console.
const startApolloServer = async () => {
  await server.start();
  
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  
  app.use('/graphql', expressMiddleware(server));

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    })
  })
};

// TODO: Add a comment describing this functionality
// the function is calling the startApolloServer function to start the server and set up the express server.
startApolloServer();
