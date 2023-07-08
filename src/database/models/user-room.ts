import { DataTypes, Model, ModelStatic, Optional } from 'sequelize';
import { Sequelize as SequelizeInstance } from 'sequelize/types/sequelize';
import { RoomCreationType, RoomType } from './room';
import { UserCreationType, UserType } from './user';

export interface UserRoomType {
  id: string;
}

interface UserRoomCreationType extends Optional<UserRoomType, 'id'> {}

export const defineUserRoomModel = (
  sequelizeInstance: SequelizeInstance,
  UserModel: ModelStatic<Model<UserType, UserCreationType>>,
  RoomModel: ModelStatic<Model<RoomType, RoomCreationType>>,
) => {
  const UserRoomModel = sequelizeInstance.define<
    Model<UserRoomType, UserRoomCreationType>
  >('UserRoom', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
  });

  UserModel.belongsToMany(RoomModel, {
    through: UserRoomModel,
    foreignKey: 'userId',
  });
  RoomModel.belongsToMany(UserModel, {
    through: UserRoomModel,
    foreignKey: 'roomId',
  });

  return UserRoomModel;
};
