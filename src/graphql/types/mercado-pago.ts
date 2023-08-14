import axios from 'axios';
import {
  mutationField,
  nonNull,
  nullable,
  objectType,
  queryField,
  stringArg,
} from 'nexus';
import * as services from '../services/mercado-pago';

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
    resolve: async () => services.getMercadoPagoPreferenceId(),
  },
);

export const authorizeMercadoPago = mutationField('authorizeMercadoPago', {
  type: MercadoPagoAccessToken,
  args: {
    mercadoPagoCode: nonNull(stringArg()),
  },
  resolve: async (_, args, ctx) =>
    await services.getMercadoPagoAccessToken(
      args.mercadoPagoCode,
      ctx.userId || '',
    ),
});

export const disconnectMercadoPagoIntegration = mutationField(
  'disconnectMercadoPagoIntegration',
  {
    type: nullable('String'),
    resolve: async (_, args, ctx) => {
      await services.disconnectMercadoPagoIntegration(ctx.userId || '');
      return null;
    },
  },
);
