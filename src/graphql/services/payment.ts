import { MercadoPagoPayment } from '../../types';

import { dbModels } from '../../server';
import { NotFoundError } from '../../custom-errors';
import { PaymentType } from '../../database/models/payment';

export const createPayment = async (
  payment: MercadoPagoPayment,
): Promise<PaymentType> => {
  try {
    const newPayment = await dbModels.PaymentModel.create({
      mercadoPagoPaymentId: payment.id,
      paymentType: payment.payment_type,
      paymentMethod: payment.payment_method_id,
      paymentStatus: payment.status,
      paymentStatusDetail: payment.status_detail,
      operationType: payment.operation_type,
      totalPaid: payment.total_paid_amount,
      netReceived: payment.net_received_amount,
      dateApproved: new Date(payment.date_approved),
      moneyReleaseDate: new Date(payment.money_release_date),
      roomId: payment.metadata.room_id,
      playerId: payment.metadata.player_id,
    });

    return newPayment.dataValues;
  } catch (error: any) {
    throw new Error(`Error saving payment : ${error.message}`);
  }
};

export const updatePayment = async (
  paymentId: string,
  updatedPaymentData: Partial<MercadoPagoPayment>,
): Promise<PaymentType | null> => {
  try {
    const existingPayment = await dbModels.PaymentModel.findOne({
      where: { mercadoPagoPaymentId: paymentId },
    });

    if (!existingPayment) {
      throw new NotFoundError(`Payment with ID ${paymentId} not found`);
    }

    await existingPayment.update({
      paymentType: updatedPaymentData.payment_type,
      paymentMethod: updatedPaymentData.payment_method_id,
      paymentStatus: updatedPaymentData.status,
      paymentStatusDetail: updatedPaymentData.status_detail,
      operationType: updatedPaymentData.operation_type,
      totalPaid: updatedPaymentData.total_paid_amount,
      netReceived: updatedPaymentData.net_received_amount,
      dateApproved: updatedPaymentData.date_approved
        ? new Date(updatedPaymentData.date_approved)
        : existingPayment.dataValues.dateApproved,
      moneyReleaseDate: updatedPaymentData.money_release_date
        ? new Date(updatedPaymentData.money_release_date)
        : existingPayment.dataValues.moneyReleaseDate,
    });

    return existingPayment.dataValues;
  } catch (error: any) {
    throw new Error(`Error updating payment: ${error.message}`);
  }
};
