import { Sequelize as SequelizeInstance } from 'sequelize/types/sequelize';
import { DataTypes, Model, ModelStatic, Optional } from 'sequelize';
import { UserCreationType, UserType } from './user';

export interface RoomType {
  id: string;
  name: string;
  dueDate: Date;
  prizeMoney: number;
  entryPrice: number;
  paymentLink: string;
  isActive: boolean;
  isClosed: boolean;
  creatorId: string;
}

export interface RoomCreationType
  extends Optional<RoomType, 'id' | 'paymentLink' | 'creatorId'> {}

export const defineRoomModel = (
  sequelizeInstance: SequelizeInstance,
  UserModel: ModelStatic<Model<UserType, UserCreationType>>,
) => {
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
        allowNull: false,
      },
      isClosed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      creatorId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
    },
  );

  RoomModel.belongsTo(UserModel, { foreignKey: 'creatorId', as: 'user' });

  return RoomModel;
};
