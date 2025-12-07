import type { IUnit } from '../../types/types';

export const buildUnitsNesting = (units: IUnit[]) => {
  const map = new Map<string, IUnit>(
    units.map((u) => [u.id, { ...u, children: [] }])
  );

  for (const unit of map.values()) {
    if (unit.parent) {
      map.get(unit.parent.id)!.children.push(unit);
    }
  }

  const roots = [...map.values()].filter((u) => !u.parent);

  return roots;
};
