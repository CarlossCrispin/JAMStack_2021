const express = require('express');

const mongoose = require('mongoose');
const { ApolloServer, gql } = require('apollo-server-express');

const { merge } = require('lodash');

const courseTypedefs = require('./types/course.types');
const userTypedefs = require('./types/user.types');

const courseResolvers = require('./resolvers/course.resolvers');
const userResolvers = require('./resolvers/user.resolvers');

const authFunc = require('./libs/auth');
// console.log(authFunc);
const paramsDB = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost/graphql_db_course', paramsDB, () => {
  console.log('Connecting DB');
});

async function startApolloServer() {
  // Construct a schema, using GraphQL schema language
  const typeDefs = gql`
    type Query {
      hello: String
    }
  `;
  const resolver = {
      Query: {
        hello: () => 'Hello world!',
      },
      
    }
  
  const server = new ApolloServer({
    typeDefs: [typeDefs, courseTypedefs, userTypedefs],
    resolvers: merge(resolver, courseResolvers, userResolvers),
    context: authFunc,
  });
  await server.start();

  const app = express();
  server.applyMiddleware({ app });

  await new Promise((resolve) => app.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  return { server, app };
}

startApolloServer();
