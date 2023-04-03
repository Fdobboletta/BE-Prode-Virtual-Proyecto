import { sequelizeInstance } from '../index';
import { DataTypes, Model, Optional } from 'sequelize';
import { TeamModel } from './teamModel';
import { CompetitionModel } from './competitionModel';

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

export const TeamCompetitionModel = sequelizeInstance.define<
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
