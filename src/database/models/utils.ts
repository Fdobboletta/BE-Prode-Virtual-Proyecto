import { Sequelize as SequelizeInstance } from 'sequelize/types/sequelize';
import { defineCompetitionModel } from './competitionModel';
import { definePositionModel } from './positionModel';
import { defineTeamCompetitionModel } from './teamCompetitionModel';
import { defineTeamModel } from './teamModel';
import { defineTrainingModel } from './trainingModel';
import { defineUserModel } from './userModel';

export type DbModels = {
  TeamModel: ReturnType<typeof defineTeamModel>;
  UserModel: ReturnType<typeof defineUserModel>;
  PositionModel: ReturnType<typeof definePositionModel>;
  CompetitionModel: ReturnType<typeof defineCompetitionModel>;
  TeamCompetitionModel: ReturnType<typeof defineTeamCompetitionModel>;
  TrainingModel: ReturnType<typeof defineTrainingModel>;
};

export const defineModels = (sequelizeInstance: SequelizeInstance) => {
  const TeamModel = defineTeamModel(sequelizeInstance);
  const UserModel = defineUserModel(sequelizeInstance, TeamModel);
  const PositionModel = definePositionModel(sequelizeInstance);
  const CompetitionModel = defineCompetitionModel(sequelizeInstance);
  const TeamCompetitionModel = defineTeamCompetitionModel(
    sequelizeInstance,
    TeamModel,
    CompetitionModel,
  );
  const TrainingModel = defineTrainingModel(sequelizeInstance, TeamModel);

  const allModels = {
    TeamModel,
    UserModel,
    PositionModel,
    CompetitionModel,
    TeamCompetitionModel,
    TrainingModel,
  };

  return allModels;
};
