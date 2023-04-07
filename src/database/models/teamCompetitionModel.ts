import { Sequelize as SequelizeInstance } from 'sequelize/types/sequelize';
import { DataTypes, Model, ModelStatic, Optional } from 'sequelize';
import { TeamCreationType, TeamType } from './teamModel';
import { CompetitionCreationType, CompetitionType } from './competitionModel';

export interface TeamCompetitionType {
  id: string;
  startDate: Date;
  endDate: Date | null;
}

interface TeamCompetitionCreationType
  extends Optional<TeamCompetitionType, 'id'> {
  teamId: string;
  competitionId: string;
}

export const defineTeamCompetitionModel = (
  sequelizeInstance: SequelizeInstance,
  TeamModel: ModelStatic<Model<TeamType, TeamCreationType>>,
  CompetitionModel: ModelStatic<
    Model<CompetitionType, CompetitionCreationType>
  >,
) => {
  const TeamCompetitionModel = sequelizeInstance.define<
    Model<TeamCompetitionType, TeamCompetitionCreationType>
  >('TeamCompetition', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  TeamModel.belongsToMany(CompetitionModel, {
    through: TeamCompetitionModel,
    foreignKey: 'teamId',
  });
  CompetitionModel.belongsToMany(TeamModel, {
    through: TeamCompetitionModel,
    foreignKey: 'competitionId',
  });

  return TeamCompetitionModel;
};
