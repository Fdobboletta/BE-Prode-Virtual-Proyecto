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
import { MercadoPagoPayment } from './types';

import { createPayment, updatePayment } from './graphql/services/payment';
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
    if (req.body.type === 'payment') {
      const paymentId = req.body.data.id as string;
      const paymentsResponse = await axios.get<MercadoPagoPayment>(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        buildMercadoPagoHeaders(
          process.env.APP_MERCADO_PAGO_ACCESS_TOKEN || '',
        ),
      );

      console.log('payment response', paymentsResponse.data);

      const {
        id,
        date_approved,
        money_release_date,
        transaction_details: { total_paid_amount, net_received_amount },
        status,
        status_detail,
        payment_type_id,
        payment_method_id,
        operation_type,
        metadata: { player_id, room_id },
      } = paymentsResponse.data;

      const filteredPayment: MercadoPagoPayment = {
        id,
        date_approved,
        money_release_date,
        status,
        status_detail,
        payment_type_id,
        payment_method_id,
        operation_type,
        transaction_details: { total_paid_amount, net_received_amount },
        metadata: {
          player_id,
          room_id,
        },
      };

      if (req.body.action === 'payment.created') {
        await createPayment(filteredPayment);
      }
      if (req.body.action === 'payment.updated') {
        await updatePayment(filteredPayment.id, filteredPayment);
      }
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
