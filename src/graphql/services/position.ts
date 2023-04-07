import {
  PositionCreationType,
  PositionType,
} from '../../database/models/positionModel';
import { dbModels } from '../../server';

export const createPosition = async (
  args: PositionCreationType,
): Promise<PositionType> => {
  const position = await dbModels.PositionModel.create(args);
  return position.toJSON();
};

export const getAllPositions = async (): Promise<PositionType[]> => {
  const positions = await dbModels.PositionModel.findAll();
  return positions.map((position) => position.toJSON());
};
