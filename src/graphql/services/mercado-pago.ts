import axios from 'axios';
import { NotFoundError, UnknownError } from '../../custom-errors';
import mercadopago from 'mercadopago';
import { CreatePreferencePayload } from 'mercadopago/models/preferences/create-payload.model';
import { dbModels } from '../../server';

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

export const getMercadoPagoAccessToken = async (
  mercadoPagoCode: string,
  userId: string,
): Promise<{
  accessToken: string;
}> => {
  try {
    const user = await dbModels.UserModel.findByPk(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const redirectUri = 'https://comuniprode.netlify.app/admin/integrations';
    const response = await axios.post(
      'https://api.mercadopago.com/oauth/token',
      {
        grant_type: 'authorization_code',
        client_id: process.env.MERCADO_PAGO_CLIENT_ID,
        client_secret: process.env.MERCADO_PAGO_CLIENT_SECRET,
        code: mercadoPagoCode,
        redirect_uri: redirectUri,
      },
    );

    if (!response.data) {
      throw new UnknownError('Error al solicitar el codigo a Mercado Pago');
    }
    await user.update({ mercadoPagoAccessToken: response.data.access_token });
    return { accessToken: response.data.access_token };
  } catch (error) {
    console.error(error);
    throw new Error('Error al obtener el token de acceso');
  }
};

export const disconnectMercadoPagoIntegration = async (
  userId: string,
): Promise<void> => {
  try {
    const user = await dbModels.UserModel.findByPk(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }
    await user.update({ mercadoPagoAccessToken: null });
  } catch (error) {
    console.log(error);
    throw new Error('Error al desconectar la integracion con Mercado Pago');
  }
};
