import { Sequelize as SequelizeInstance } from 'sequelize/types/sequelize';
import { DataTypes, Model, ModelCtor, ModelStatic, Optional } from 'sequelize';
import { TeamCreationType, TeamType } from './teamModel';

export interface UserType {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  teamId: string | null;
}

interface UserCreationType extends Optional<UserType, 'id'> {}

export const defineUserModel = (
  sequelizeInstance: SequelizeInstance,
  TeamModel: ModelStatic<Model<TeamType, TeamCreationType>>,
) => {
  const UserModel = sequelizeInstance.define<Model<UserType, UserCreationType>>(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      teamId: {
        type: DataTypes.UUID,
        allowNull: true,
        unique: true,
        references: {
          model: TeamModel,
          key: 'id',
        },
      },
    },
  );

  UserModel.belongsTo(TeamModel, { foreignKey: 'teamId' });
  TeamModel.hasMany(UserModel, { foreignKey: 'teamId' });

  return UserModel;
};
