import { dbModels } from '../../server';
import { TeamCreationType, TeamType } from '../../database/models/teamModel';

export const createTeam = async (args: TeamCreationType): Promise<TeamType> => {
  // Check if team with same name already exists
  const existingTeam = await dbModels.TeamModel.findOne({
    where: { name: args.name },
  });

  if (existingTeam) {
    throw new Error('A team with this name already exists.');
  }

  // Create new team
  const newTeam = await dbModels.TeamModel.create({
    name: args.name,
    logoUrl: args.logoUrl,
    mainColor: args.mainColor,
    secondColor: args.secondColor,
    thirdColor: args.thirdColor,
    city: args.city,
    description: args.description,
  });

  return newTeam.toJSON();
};
