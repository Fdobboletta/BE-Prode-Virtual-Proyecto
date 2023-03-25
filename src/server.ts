import express from 'express';
import 'dotenv/config';
import { ApolloServer } from 'apollo-server-express';
import { schema } from './graphql/schema';
import { createGQLContext } from './graphql/context';
import { connectDatabase } from './database';

const app = express();
const PORT = process.env.PORT || 4000;

// Define the ApolloServer
const server = new ApolloServer({
  schema,
  context: (ctx) => {
    createGQLContext(undefined);
  },
});

// Apply middleware to the server and start listening for incoming requests
const startServer = async () => {
  await server.start();
  server.applyMiddleware({ app });
  app.listen(PORT, () => {
    console.log(`🚀 -> Server running on port ${PORT}...`);
  });
};

// Connect to the database, import models and start the server
connectDatabase().then(() => {
  startServer();
});
