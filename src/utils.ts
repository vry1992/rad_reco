import type { DataNode } from 'rc-tree-select/lib/interface';
import type { IShip, IUnit } from './types/types';

export const groupToShipsTreeSelect = <K extends keyof IShip>({
  data,
  groupBy,
  mainPrefix = '',
  mainSufix = '',
}: {
  data: IShip[];
  groupBy: K;
  mainPrefix?: string;
  mainSufix?: string;
}) => {
  const grouped = data.reduce<Record<string, DataNode>>((acc, curr) => {
    const key = `${mainPrefix} ${String(curr[groupBy])} ${mainSufix}`.trim();
    const prev = acc[key];

    if (prev) {
      prev.children?.push({
        title: `${curr.abbreviatedType} пр. ${curr.project} ${curr.name}`,
        value: curr.id,
        key: curr.id,
      });
    } else {
      acc[key] = {
        key,
        title: key,
        value: key,
        selectable: false,
        checkable: false,
        children: [
          {
            title: `${curr.abbreviatedType} пр. ${curr.project} ${curr.name}`,
            value: curr.id,
            key: curr.id,
          },
        ],
      };
    }
    return acc;
  }, {});

  return Object.values(grouped);
};

export const groupToUnitsTreeSelect = ({ data }: { data: IUnit[] }) => {
  const map = new Map<string, DataNode>();

  // Створюємо точки для кожного елемента
  for (const u of data) {
    map.set(u.id, {
      title: u.abbreviatedName || u.name,
      value: u.id,
      children: [],
    });
  }

  const roots: DataNode[] = [];

  // Прив’язуємо дітей до батьків
  for (const u of data) {
    const node = map.get(u.id)!;

    if (u.parent && map.has(u.parent.id)) {
      // прив’язуємо до parent
      const parentNode = map.get(u.parent.id)!;
      parentNode.children!.push(node);
    } else {
      // root
      roots.push(node);
    }
  }

  return roots;
};

export const buildShipLabel = (ship: IShip) => {
  return `${ship.abbreviatedType} пр.${ship.project} ${ship.name}`;
};
