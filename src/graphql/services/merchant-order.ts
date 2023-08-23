import { MercadoPagoMerchantOrder } from '../../types';

import { MerchantOrderType } from '../../database/models/merchant-order';

import { dbModels } from '../../server';

export const createOrUpdateMerchantOrder = async (
  merchantOrder: MercadoPagoMerchantOrder,
): Promise<MerchantOrderType> => {
  try {
    const existingMerchantOrder = await dbModels.MerchantOrderModel.findOne({
      where: { merchantOrderMpId: merchantOrder.id },
    });

    if (existingMerchantOrder) {
      await existingMerchantOrder.update({
        orderStatus: merchantOrder.status,
        detailedOrderStatus: merchantOrder.order_status,
        totalAmount: merchantOrder.total_amount,
        paidAmount: merchantOrder.paid_amount,
      });
      return existingMerchantOrder.dataValues;
    } else {
      const merchantOrderRoomId = merchantOrder.items[0]
        ? merchantOrder.items[0].id
        : '';
      // If the merchant order doesn't exist, create a new one
      const newMerchantOrder = await dbModels.MerchantOrderModel.create({
        merchantOrderMpId: merchantOrder.id,
        orderStatus: merchantOrder.status,
        detailedOrderStatus: merchantOrder.order_status,
        totalAmount: merchantOrder.total_amount,
        paidAmount: merchantOrder.paid_amount,
        playerId: merchantOrder.external_reference,
        roomId: merchantOrderRoomId,
      });
      return newMerchantOrder.dataValues;
    }
  } catch (error: any) {
    throw new Error(`Error creating/updating merchant order: ${error.message}`);
  }
};
