import { mutationField, nonNull, nullable, objectType, stringArg } from 'nexus';
import * as services from '../services/mercado-pago';
import { UserInputError } from 'apollo-server-express';

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

export const authorizeMercadoPago = mutationField('authorizeMercadoPago', {
  type: MercadoPagoAccessToken,
  args: {
    mercadoPagoCode: nonNull(stringArg()),
  },
  resolve: async (_, args, ctx) => {
    if (!ctx.userId) {
      throw new UserInputError('Authentication required');
    }
    return await services.getMercadoPagoAccessToken(
      args.mercadoPagoCode,
      ctx.userId || '',
    );
  },
});

export const disconnectMercadoPagoIntegration = mutationField(
  'disconnectMercadoPagoIntegration',
  {
    type: nullable('String'),
    resolve: async (_, args, ctx) => {
      if (!ctx.userId) {
        throw new UserInputError('Authentication required');
      }
      await services.disconnectMercadoPagoIntegration(ctx.userId || '');
      return null;
    },
  },
);

export const generateMercadoPagoPreference = mutationField(
  'generateMercadoPagoPreferenceId',
  {
    type: nonNull(MercadoPagoPreferenceObject),
    args: {
      roomId: nonNull(stringArg()),
    },
    resolve: async (_, args, ctx) => {
      if (!ctx.userId) {
        throw new UserInputError('Authentication required');
      }
      const mpPreferenceId = await services.generateMercadoPagoPreferenceId({
        playerUserId: ctx.userId,
        roomId: args.roomId,
      });
      return { preferenceId: mpPreferenceId };
    },
  },
);
