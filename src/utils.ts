import type { DataNode } from 'rc-tree-select/lib/interface';
import type { IAircraft, IShip, IUnit } from './types/types';

export const groupToShipsTreeSelect = <K extends keyof IShip>({
  data,
  groupBy,
  mainPrefix = '',
  mainSufix = '',
  selectedIds,
}: {
  data: IShip[];
  groupBy: K;
  mainPrefix?: string;
  mainSufix?: string;
  selectedIds: string[];
}) => {
  const grouped = data.reduce<Record<string, DataNode>>((acc, curr) => {
    const key = `${mainPrefix} ${String(curr[groupBy])} ${mainSufix}`.trim();
    const prev = acc[key];

    if (prev) {
      prev.children?.push({
        title: buildShipLabel(curr),
        value: curr.id,
        key: curr.id,
        disabled: selectedIds.includes(curr.id),
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
            title: buildShipLabel(curr),
            value: curr.id,
            key: curr.id,
            disabled: selectedIds.includes(curr.id),
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

export const groupToAircraftsTreeSelect = ({
  data,
  selectedIds,
}: {
  data: IAircraft[];
  selectedIds: string[];
}) => {
  const grouped = data.reduce<Record<string, DataNode>>((acc, curr) => {
    const key = curr.family;
    const prev = acc[key];

    if (prev) {
      prev.children?.push({
        title: curr.name,
        value: curr.id,
        key: curr.id,
        disabled: selectedIds.includes(curr.id),
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
            title: curr.name,
            value: curr.id,
            key: curr.id,
            disabled: selectedIds.includes(curr.id),
          },
        ],
      };
    }
    return acc;
  }, {});

  return Object.values(grouped);
};

export const buildShipLabel = (ship: IShip) => {
  return `${ship.type.abbreviatedType} пр.${ship.project} ${ship.name}`;
};

export const buildUnitsLabel = (unit: IUnit) => {
  return unit.abbreviatedName;
};

export function isObject(value: unknown): value is object {
  return typeof value === 'object' && value !== null;
}

// eslint-disable-next-line
export function isInstanceOf<T extends Function>(
  value: unknown,
  host: T
): value is T {
  if (!isObject(value)) {
    return false;
  }
  if (value instanceof host) {
    return true;
  }
  if (
    'name' in value &&
    typeof value.name === 'string' &&
    value.name === host.name
  ) {
    return true;
  }
  return false;
}

let _timeout: number | null = null;

export const debounce = (cb: () => void, ms: number = 300) => {
  if (_timeout) {
    clearTimeout(_timeout);
  }

  _timeout = setTimeout(cb, ms);
};

import type { UploadFile } from 'antd/es/upload/interface';

export function fileToUploadFile(file: File): UploadFile {
  return {
    uid: file.name + Date.now(),
    name: file.name,
    status: 'done',
    originFileObj: file,
    url: URL.createObjectURL(file),
  };
}
