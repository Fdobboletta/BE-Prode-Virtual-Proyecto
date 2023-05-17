import mercadopago from 'mercadopago';
import { CreatePreferencePayload } from 'mercadopago/models/preferences/create-payload.model';

export const getMercadoPagoPreferenceId = async (): Promise<{
  preferenceId: string;
}> => {
  mercadopago.configure({
    access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
  });

  const createPreferencePayload: CreatePreferencePayload = {
    items: [
      {
        title: 'PRODE',
        unit_price: 200,
        currency_id: 'ARS',
        quantity: 1,
      },
    ],
  };

  const preference = await mercadopago.preferences.create(
    createPreferencePayload,
  );

  return { preferenceId: preference.body.id };
};
