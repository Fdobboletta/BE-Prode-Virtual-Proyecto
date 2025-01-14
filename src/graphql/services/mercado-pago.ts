import axios from 'axios';
import { NotFoundError, UnknownError } from '../../custom-errors';

import { CreatePreferencePayload } from 'mercadopago/models/preferences/create-payload.model';
import { dbModels } from '../../server';
import { buildMercadoPagoHeaders } from '../../config';
import { isAfter } from 'date-fns';

export const generateMercadoPagoPreferenceId = async ({
  playerUserId,
  roomId,
}: {
  playerUserId: string;
  roomId: string;
}): Promise<{ preferenceId: string; paymentLink: string }> => {
  try {
    const queriedRoom = await dbModels.RoomModel.findByPk(roomId);
    if (!queriedRoom) {
      throw new NotFoundError('Sala no encontrada.');
    }

    const room = queriedRoom.dataValues;

    if (isAfter(new Date(), room.dueDate)) {
      throw new Error('La fecha limite de la sala se ha excedido.');
    }

    const roomCreatorUser = await dbModels.UserModel.findByPk(room.creatorId);
    if (!roomCreatorUser) {
      throw new NotFoundError('Usuario no encontrado.');
    }

    const roomCreatorUserData = roomCreatorUser.dataValues;

    const urlPrefix =
      process.env.NODE_ENV === 'local'
        ? 'http://localhost:5173/'
        : 'https://comuniprode.netlify.app/';

    const createPreferencePayload: CreatePreferencePayload & {
      metadata: { player_id: string; room_id: string };
    } = {
      additional_info: playerUserId,
      external_reference: playerUserId,
      auto_return: 'approved',
      notification_url:
        'https://analysis-app-2023.onrender.com/mercado-pago-notification',
      items: [
        {
          id: room.id,
          title: room.name,
          unit_price: room.entryPrice,
          currency_id: 'ARS',
          quantity: 1,
        },
      ],
      back_urls: {
        success: `${urlPrefix}user/myrooms`,
      },
      metadata: { player_id: playerUserId, room_id: room.id },
    };

    const response = await axios.post(
      'https://api.mercadopago.com/checkout/preferences',
      createPreferencePayload,
      buildMercadoPagoHeaders(roomCreatorUserData.mercadoPagoAccessToken || ''),
    );

    return {
      preferenceId: response.data.id,
      paymentLink: response.data.init_point,
    };
  } catch (error: any) {
    throw new Error(
      `Error al generar la preferencia de MercadoPago: ${error.message}`,
    );
  }
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
      throw new NotFoundError('Usuario no encontrado');
    }

    const redirectUri = 'https://comuniprode.netlify.app/admin/integrations';
    const response = await axios.post(
      'https://api.mercadopago.com/oauth/token',
      {
        grant_type: 'authorization_code',
        client_id: process.env.TEST_MERCADO_PAGO_CLIENT_ID,
        client_secret: process.env.TEST_MERCADO_PAGO_CLIENT_SECRET,
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
