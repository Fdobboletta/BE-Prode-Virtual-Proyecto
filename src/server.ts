import express from 'express';
import fs from 'fs';
import https from 'https';
import 'dotenv/config';
import { ApolloServer } from 'apollo-server-express';
import { schema } from './graphql/schema';
import { createContext } from './graphql/context';
import { connectDatabase, sequelizeInstance } from './database';
import { defineModels } from './database/models/utils';
import axios from 'axios';
import { buildMercadoPagoHeaders } from './config';

const app = express();
const PORT = process.env.PORT || 4000;

// Define the ApolloServer
const server = new ApolloServer({
  schema,
  context: (ctx) => createContext(ctx),
  introspection: true,
});

app.use(express.json());

// New endpoint for Mercado Pago notifications
app.post('/mercado-pago-notification', async (req, res) => {
  console.log('MERCADO PAGOOO DATA: ', req.body);
  if (req.body.topic === 'payment') {
    const paymentsResponse = await axios.get(
      req.body.resource,
      buildMercadoPagoHeaders(process.env.APP_MERCADO_PAGO_ACCESS_TOKEN || ''),
    );
    console.log('PAYMENT RESPONSE', paymentsResponse.data);
  }
  if (req.body.topic === 'merchant_order') {
    const merchantOrdersResponse = await axios.get(
      req.body.resource,
      buildMercadoPagoHeaders(process.env.APP_MERCADO_PAGO_ACCESS_TOKEN || ''),
    );

    console.log('MERCHANT ORDER RESPONSE:', merchantOrdersResponse.data);
  }

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
