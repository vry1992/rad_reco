import type { TreeDataNode } from 'antd';
import type { IShip, IUnit } from '../../types/types';
import { buildShipLabel } from '../../utils';
import {
  ALLOW_NESTING_NODE_TYPE,
  NOT_ALLOW_NESTING_NODE_TYPE,
} from './constants';

export const goShips = (ships: IShip[], parentUnit: IUnit): TreeDataNode[] => {
  return ships.map((ship) => {
    return {
      key: ship.id,
      title: buildShipLabel(ship),
      children: [],
      checkable: false,
      allowDrop: false,
      selectable: false,
      data: {
        nodeType: NOT_ALLOW_NESTING_NODE_TYPE,
        parentUnit,
        self: ship,
      },
    };
  });
};

export type BuildNestingProps = {
  units: IUnit[];
  parentUnit?: IUnit;
  hideShips?: boolean;
};

export const buildUnitsNesting = ({
  units,
  parentUnit,
  hideShips,
}: BuildNestingProps) => {
  const res = units.reduce<Record<string, TreeDataNode>>((acc, curr) => {
    const item = {} as TreeDataNode;
    const key = curr.id;
    const title = curr.name;
    const children: TreeDataNode[] = [];
    item.key = key;
    item.value = key;
    item.title = title;
    item.children = children;
    item.data = {
      nodeType: ALLOW_NESTING_NODE_TYPE,
      parentUnit,
      self: curr,
    };
    if (curr.children?.length) {
      item.children.push(
        ...buildUnitsNesting({ units: curr.children, parentUnit, hideShips })
      );
      acc[key] = item;
    }
    if (curr.ships?.length && !hideShips) {
      item.children.push(...goShips(curr.ships, curr));
      acc[key] = item;
    } else {
      acc[key] = item;
    }
    return acc;
  }, {});

  return Object.values(res);
};
