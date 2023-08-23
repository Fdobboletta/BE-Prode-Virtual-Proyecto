import { Sequelize as SequelizeInstance } from 'sequelize/types/sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface MerchantOrderType {
  id: string;
  playerId: string;
  roomId: string;
  merchantOrderMpId: string;
  orderStatus: string;
  detailedOrderStatus: string;
  totalAmount: number;
  paidAmount: number;
}

export interface MerchantOrderCreationType
  extends Optional<MerchantOrderType, 'id'> {}

export const defineMerchantOrderModel = (
  sequelizeInstance: SequelizeInstance,
) => {
  const MerchantOrderModel = sequelizeInstance.define<
    Model<MerchantOrderType, MerchantOrderCreationType>
  >('MerchantOrder', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    merchantOrderMpId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    orderStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    detailedOrderStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    paidAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    playerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    roomId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Rooms',
        key: 'id',
      },
    },
  });

  return MerchantOrderModel;
};
