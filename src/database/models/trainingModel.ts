import { Sequelize as SequelizeInstance } from 'sequelize/types/sequelize';
import { DataTypes, Model, ModelStatic, Optional } from 'sequelize';
import { TeamCreationType, TeamType } from './teamModel';

export interface TrainingType {
  id: string;
  date: Date;
  warmUp: string | null;
  firstExercise: string | null;
  mainExercise: string;
  postExercise: string | null;
  teamId: string;
  intensityLevel: number;
  videoUrl: string | null;
  notes: string | null;
}

export interface TrainingCreationType extends Optional<TrainingType, 'id'> {}

export const defineTrainingModel = (
  sequelizeInstance: SequelizeInstance,
  TeamModel: ModelStatic<Model<TeamType, TeamCreationType>>,
) => {
  const TrainingModel = sequelizeInstance.define<
    Model<TrainingType, TrainingCreationType>
  >('Position', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      unique: true,
    },
    warmUp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    firstExercise: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mainExercise: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postExercise: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    intensityLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 10,
      },
    },
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    teamId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: TeamModel,
        key: 'id',
      },
    },
  });

  TrainingModel.belongsTo(TeamModel, { foreignKey: 'teamId' });
  TeamModel.hasMany(TrainingModel, { foreignKey: 'teamId' });

  return TrainingModel;
};
