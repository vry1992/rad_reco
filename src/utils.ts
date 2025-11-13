import type { DataNode } from 'rc-tree-select/lib/interface';
import type { TShip } from './types/types';

export const groupToShipsTreeSelect = <K extends keyof TShip>({
  data,
  groupBy,
  mainPrefix = '',
  mainSufix = '',
}: {
  data: TShip[];
  groupBy: K;
  mainPrefix?: string;
  mainSufix?: string;
}) => {
  const grouped = data.reduce<Record<string, DataNode>>((acc, curr) => {
    const key = `${mainPrefix} ${String(curr[groupBy])} ${mainSufix}`.trim();
    const prev = acc[key];

    if (prev) {
      prev.children?.push({
        title: `${curr.shotType} пр. ${curr.project} ${curr.name}`,
        value: curr.id,
        key: curr.id,
      });
    } else {
      acc[key] = {
        key,
        title: key,
        value: key,
        // selectable: false,
        children: [
          {
            title: `${curr.shotType} пр. ${curr.project} ${curr.name}`,
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
