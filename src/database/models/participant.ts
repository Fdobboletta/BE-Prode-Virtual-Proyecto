import { Sequelize as SequelizeInstance } from 'sequelize/types/sequelize';
import { DataTypes, Model, ModelStatic, Optional } from 'sequelize';
import { RoomCreationType, RoomType } from './room';

export interface ParticipantType {
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
  score?: number;
}

export interface ParticipantCreationType
  extends Optional<ParticipantType, 'id'> {}

export const defineParticipantModel = (
  sequelizeInstance: SequelizeInstance,
  RoomModel: ModelStatic<Model<RoomType, RoomCreationType>>,
) => {
  const ParticipantModel = sequelizeInstance.define<
    Model<ParticipantType, ParticipantCreationType>
  >(
    'Participant',
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
      score: {
        type: DataTypes.INTEGER,
      },
    },
    {
      indexes: [{ unique: true, fields: ['roomId', 'playerId'] }],
    },
  );

  ParticipantModel.belongsTo(RoomModel, {
    foreignKey: 'roomId',
    as: 'room',
  });

  return ParticipantModel;
};
