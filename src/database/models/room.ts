import { Sequelize as SequelizeInstance } from 'sequelize/types/sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface RoomType {
  id: string;
  name: string;
  dueDate: string;
  prizeMoney: number;
  entryPrice: number;
  paymentLink: string;
  isActive: boolean;
}

export interface RoomCreationType
  extends Optional<RoomType, 'id' | 'paymentLink'> {}

export const defineRoomModel = (sequelizeInstance: SequelizeInstance) => {
  const RoomModel = sequelizeInstance.define<Model<RoomType, RoomCreationType>>(
    'Room',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      entryPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      prizeMoney: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      paymentLink: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
  );

  return RoomModel;
};
