import { Sequelize as SequelizeInstance } from 'sequelize/types/sequelize';
import { DataTypes, Model, ModelStatic, Optional } from 'sequelize';
import { TeamCreationType, TeamType } from './teamModel';

enum Foot {
  RIGHT = 'RIGHT',
  LEFT = 'LEFT',
  BOTH = 'BOTH',
}

export interface PlayerType {
  id: string;
  name: string;
  lastName: string;
  nationality: string;
  height: number;
  weight: number;
  birthDate: Date;
  currentTeamId: string | null;
  foot: Foot;
  notes: string;
  profilePicUrl: string | null;
}

export interface PlayerCreationType extends Optional<PlayerType, 'id'> {}

export const definePlayerModel = (
  sequelizeInstance: SequelizeInstance,
  TeamModel: ModelStatic<Model<TeamType, TeamCreationType>>,
) => {
  const PlayerModel = sequelizeInstance.define<
    Model<PlayerType, PlayerCreationType>
  >('Player', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nationality: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profilePicUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    birthDate: {
      type: DataTypes.DATE,
      allowNull: false,
      unique: true,
    },
    currentTeamId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: TeamModel,
        key: 'id',
      },
    },
    foot: {
      type: DataTypes.ENUM(Foot.RIGHT, Foot.LEFT, Foot.BOTH),
      allowNull: false,
    },
  });

  PlayerModel.belongsTo(TeamModel, { foreignKey: 'teamId' });
  TeamModel.hasMany(PlayerModel, { foreignKey: 'teamId' });

  return PlayerModel;
};
