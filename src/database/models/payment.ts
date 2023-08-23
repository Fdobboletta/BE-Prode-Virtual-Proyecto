import { Sequelize as SequelizeInstance } from 'sequelize/types/sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface PaymentType {
  id: string;
  mercadoPagoPaymentId: string;
  paymentType: string;
  paymentMethod: string;
  operationType: string;
  totalPaid: number;
  netReceived: number;
  paymentStatus: string;
  paymentStatusDetail: string;
  dateApproved: Date;
  moneyReleaseDate: Date;
  roomId: string;
  playerId: string;
}

export interface PaymentCreationType extends Optional<PaymentType, 'id'> {}

export const definePaymentModel = (sequelizeInstance: SequelizeInstance) => {
  const PaymentModel = sequelizeInstance.define<
    Model<PaymentType, PaymentCreationType>
  >(
    'Payment',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      mercadoPagoPaymentId: {
        type: DataTypes.STRING,
        unique: true,
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
      paymentType: {
        type: DataTypes.STRING,
      },
      paymentMethod: {
        type: DataTypes.STRING,
      },
      operationType: {
        type: DataTypes.STRING,
      },
      totalPaid: {
        type: DataTypes.FLOAT,
      },
      netReceived: {
        type: DataTypes.FLOAT,
      },
      paymentStatus: {
        type: DataTypes.STRING,
      },
      paymentStatusDetail: {
        type: DataTypes.STRING,
      },
      dateApproved: {
        type: DataTypes.DATE,
      },
      moneyReleaseDate: {
        type: DataTypes.DATE,
      },
    },
    {
      indexes: [{ unique: true, fields: ['roomId', 'playerId'] }],
    },
  );

  return PaymentModel;
};
