import { MercadoPagoPayment } from '../../types';

import { dbModels } from '../../server';
import { NotFoundError } from '../../custom-errors';
import { PaymentType } from '../../database/models/payment';

export const createPayment = async (
  payment: MercadoPagoPayment,
): Promise<PaymentType> => {
  try {
    const existingMerchantOrder = await dbModels.MerchantOrderModel.findOne({
      where: { merchantOrderMpId: payment.collection.merchant_order_id },
    });

    if (!existingMerchantOrder) {
      throw new NotFoundError(
        'There is no existing merchant order associated with this payment',
      );
    }
    const newPayment = await dbModels.PaymentModel.create({
      merchantOrderId: existingMerchantOrder.dataValues.id,
      paymentType: payment.collection.payment_type,
      paymentMethod: payment.collection.payment_method_id,
      paymentStatus: payment.collection.status,
      paymentStatusDetail: payment.collection.status_detail,
      operationType: payment.collection.operation_type,
      totalPaid: payment.collection.total_paid_amount,
      netReceived: payment.collection.net_received_amount,
      dateApproved: new Date(payment.collection.date_approved),
      moneyReleaseDate: new Date(payment.collection.money_release_date),
    });

    return newPayment.dataValues;
  } catch (error: any) {
    throw new Error(`Error saving payment : ${error.message}`);
  }
};
