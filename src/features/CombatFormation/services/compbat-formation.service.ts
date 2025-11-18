import { api } from '../../../services/api';

const changeUnitNesting = async (sourceId: string, targetId: string | null) => {
  return api.put('units/nesting', { sourceId, targetId });
};

const changeShipNesting = async (sourceId: string, targetId: string | null) => {
  return api.put('ships/nesting', { sourceId, targetId });
};

export const CombatFormationService = {
  changeUnitNesting,
  changeShipNesting,
};
