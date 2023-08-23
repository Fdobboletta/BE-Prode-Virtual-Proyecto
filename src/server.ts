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
import { MercadoPagoMerchantOrder, MercadoPagoPayment } from './types';
import { createOrUpdateMerchantOrder } from './graphql/services/merchant-order';

import { createPayment } from './graphql/services/payment';
import { UnknownError } from './custom-errors';

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
  try {
    if (req.body.topic === 'merchant_order') {
      const merchantOrdersResponse = await axios.get<MercadoPagoMerchantOrder>(
        req.body.resource,
        buildMercadoPagoHeaders(
          process.env.APP_MERCADO_PAGO_ACCESS_TOKEN || '',
        ),
      );

      const {
        id,
        status,
        order_status,
        external_reference,
        total_amount,
        paid_amount,
        items,
      } = merchantOrdersResponse.data;

      const filteredMerchantOrder: MercadoPagoMerchantOrder = {
        id,
        status,
        order_status,
        external_reference,
        total_amount,
        paid_amount,
        items,
      };

      await createOrUpdateMerchantOrder(filteredMerchantOrder);
    }

    if (req.body.topic === 'payment') {
      const paymentsResponse = await axios.get<MercadoPagoPayment>(
        req.body.resource,
        buildMercadoPagoHeaders(
          process.env.APP_MERCADO_PAGO_ACCESS_TOKEN || '',
        ),
      );

      const {
        collection: {
          id,
          date_approved,
          money_release_date,
          merchant_order_id,
          total_paid_amount,
          net_received_amount,
          status,
          status_detail,
          payment_type,
          payment_method_id,
          operation_type,
        },
      } = paymentsResponse.data;

      const filteredPayment: MercadoPagoPayment = {
        collection: {
          id,
          date_approved,
          money_release_date,
          merchant_order_id,
          total_paid_amount,
          net_received_amount,
          status,
          status_detail,
          payment_type,
          payment_method_id,
          operation_type,
        },
      };

      await createPayment(filteredPayment);
    }

    res.sendStatus(200);
  } catch (error: any) {
    res.sendStatus(500);
    throw new UnknownError(
      `Error al recibir datos de mercado pago: ${error.message}`,
    );
  }
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
