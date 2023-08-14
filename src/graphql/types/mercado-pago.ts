import axios from 'axios';
import {
  mutationField,
  nonNull,
  objectType,
  queryField,
  stringArg,
} from 'nexus';
import { getMercadoPagoPreferenceId } from '../services/mercado-pago';

export const MercadoPagoPreferenceObject = objectType({
  name: 'MercadoPagoPreference',
  description: 'Informacion de link de pago de MercadoPago',
  definition: (t) => {
    t.nonNull.id('preferenceId');
  },
});

export const MercadoPagoAccessToken = objectType({
  name: 'MercadoPagoAccessToken',
  description: 'Token de acceso a Mercado Pago',
  definition: (t) => {
    t.nonNull.string('accessToken');
  },
});

export const getLastMercadoPagoPreference = queryField(
  'getLastMercadoPagoPreference',
  {
    type: nonNull(MercadoPagoPreferenceObject),
    resolve: async () => getMercadoPagoPreferenceId(),
  },
);

export const authorizeMercadoPago = mutationField('authorizeMercadoPago', {
  type: MercadoPagoAccessToken,
  args: {
    userId: nonNull(stringArg()),
    mercadoPagoCode: nonNull(stringArg()),
  },
  resolve: async (_, args) => {
    try {
      const redirectUri = 'https://comuniprode.netlify.app/admin/integrations';
      const response = await axios.post(
        'https://api.mercadopago.com/oauth/token',
        {
          grant_type: 'authorization_code',
          client_id: process.env.MERCADO_PAGO_CLIENT_ID,
          client_secret: process.env.MERCADO_PAGO_CLIENT_SECRET,
          code: args.mercadoPagoCode,
          redirect_uri: redirectUri, // Prueba
        },
      );

      console.log('respuesta API mercadoPago ', response.data);

      return { accessToken: '' };
    } catch (error) {
      console.error(error);
      throw new Error('Error al obtener el token de acceso');
    }
  },
});
