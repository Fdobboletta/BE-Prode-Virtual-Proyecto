import { nonNull, objectType, queryField } from 'nexus';
import { getMercadoPagoPreferenceId } from '../services/mercado-pago';

export const MercadoPagoPreferenceObject = objectType({
  name: 'MercadoPagoPreference',
  description: 'Informacion de link de pago de MercadoPago',
  definition: (t) => {
    t.nonNull.id('preferenceId');
  },
});

export const getLastMercadoPagoPreference = queryField(
  'getLastMercadoPagoPreference',
  {
    type: nonNull(MercadoPagoPreferenceObject),
    resolve: async () => getMercadoPagoPreferenceId(),
  },
);
