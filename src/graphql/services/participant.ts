import { MercadoPagoPayment } from '../../types';

import { dbModels } from '../../server';
import { NotFoundError, UnknownError } from '../../custom-errors';
import { ParticipantType } from '../../database/models/participant';

import { UserCreationType, UserType } from '../../database/models/user';
import { Model } from 'sequelize';

export const createParticipant = async (
  payment: MercadoPagoPayment,
): Promise<ParticipantType> => {
  try {
    const newParticipant = await dbModels.ParticipantModel.create({
      mercadoPagoPaymentId: payment.id,
      paymentType: payment.payment_type_id,
      paymentMethod: payment.payment_method_id,
      paymentStatus: payment.status,
      paymentStatusDetail: payment.status_detail,
      operationType: payment.operation_type,
      totalPaid: payment.transaction_details.total_paid_amount,
      netReceived: payment.transaction_details.net_received_amount,
      dateApproved: new Date(payment.date_approved),
      moneyReleaseDate: new Date(payment.money_release_date),
      roomId: payment.metadata.room_id,
      playerId: payment.metadata.player_id,
    });

    return newParticipant.dataValues;
  } catch (error: any) {
    throw new Error(`Error saving participant : ${error.message}`);
  }
};

export const updateParticipant = async (
  paymentId: string,
  updatedPaymentData: Partial<MercadoPagoPayment>,
): Promise<ParticipantType | null> => {
  try {
    const existingParticipant = await dbModels.ParticipantModel.findOne({
      where: { mercadoPagoPaymentId: paymentId },
    });

    if (!existingParticipant) {
      throw new NotFoundError(
        `Payment with mercadoPagoPaymentId ${paymentId} not found`,
      );
    }

    await existingParticipant.update({
      paymentType: updatedPaymentData.payment_type_id,
      paymentMethod: updatedPaymentData.payment_method_id,
      paymentStatus: updatedPaymentData.status,
      paymentStatusDetail: updatedPaymentData.status_detail,
      operationType: updatedPaymentData.operation_type,
      totalPaid: updatedPaymentData.transaction_details
        ? updatedPaymentData.transaction_details.total_paid_amount
        : existingParticipant.dataValues.totalPaid,
      netReceived: updatedPaymentData.transaction_details
        ? updatedPaymentData.transaction_details.net_received_amount
        : existingParticipant.dataValues.netReceived,
      dateApproved: updatedPaymentData.date_approved
        ? new Date(updatedPaymentData.date_approved)
        : existingParticipant.dataValues.dateApproved,
      moneyReleaseDate: updatedPaymentData.money_release_date
        ? new Date(updatedPaymentData.money_release_date)
        : existingParticipant.dataValues.moneyReleaseDate,
    });

    return existingParticipant.dataValues;
  } catch (error: any) {
    throw new Error(`Error updating participant: ${error.message}`);
  }
};

export const getParticipantsCount = async (roomId: string): Promise<number> => {
  try {
    const paymentsFromRoom = await dbModels.ParticipantModel.findAll({
      where: { roomId: roomId },
    });
    return paymentsFromRoom.length;
  } catch (error: any) {
    throw new UnknownError(`Error getting payments count: ${error.message}`);
  }
};

type ParticipantWithUser = ParticipantType & {
  user: Model<UserType, UserCreationType>;
};

export const getParticipantsByRoomId = async (
  roomId: string,
): Promise<
  {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    score: number | undefined;
  }[]
> => {
  try {
    const participantsFromRoom = await dbModels.ParticipantModel.findAll({
      where: { roomId: roomId },
      include: [
        {
          model: dbModels.UserModel,
          attributes: ['firstName', 'lastName', 'email'],
          as: 'user',
        },
      ],
    });
    const participantsWithUser = participantsFromRoom.map(
      (participant) => participant.dataValues as ParticipantWithUser,
    );
    return participantsWithUser.map((participant) => ({
      id: participant.id,
      email: participant.user.dataValues.email,
      firstName: participant.user.dataValues.firstName,
      lastName: participant.user.dataValues.lastName,
      score: participant.score,
    }));
  } catch (error: any) {
    throw new UnknownError(`Error getting payments count: ${error.message}`);
  }
};
