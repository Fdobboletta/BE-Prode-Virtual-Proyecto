import express from 'express';
import fs from 'fs';
import https from 'https';
import 'dotenv/config';
import { ApolloServer } from 'apollo-server-express';
import { schema } from './graphql/schema';
import { createContext } from './graphql/context';
import { connectDatabase, sequelizeInstance } from './database';
import { defineModels } from './database/models/utils';

const app = express();
const PORT = process.env.PORT || 4000;

// Define the ApolloServer
const server = new ApolloServer({
  schema,
  context: (ctx) => createContext(ctx),
  introspection: true,
});

// New endpoint for Mercado Pago notifications
app.post('/mercado-pago-notification', (req, res) => {
  console.log('MERCADO PAGOOO DATA: ', req);
  res.sendStatus(200);
});

// Apply middleware to the server and start listening for incoming requests
const startServer = async () => {
  await server.start();
  server.applyMiddleware({ app });

  if (process.env.NODE_ENV === 'local') {
    const options = {
      key: fs.readFileSync('localhost.key'),
      cert: fs.readFileSync('localhost.crt'),
    };

    https.createServer(options, app).listen(PORT, () => {
      console.log(`🚀 -> HTTPS Server running on port ${PORT}...`);
    });
  } else if (process.env.NODE_ENV === 'production') {
    app.listen(PORT, () => {
      console.log(`🚀 -> Production Server running on port ${PORT}...`);
    });
  }
};

// Connect to the database, import models and start the server
connectDatabase();

export const dbModels = defineModels(sequelizeInstance);
if (sequelizeInstance) {
  sequelizeInstance
    .sync({ alter: true })
    .then(() => console.log('📊 -> Database schema synchronized successfully!'))
    .catch((error) => console.log('Error -> Db sync failed!!', error));
}

startServer();
