import { HomeOutlined } from '@ant-design/icons';
import { Tree, type TreeDataNode, type TreeProps } from 'antd';
import { useEffect, useState } from 'react';
import type { IUnit } from '../../../types/types';
import { AddDetectionService } from '../../AddDetection/services/add-detection.service';
import {
  ALLOW_NESTING_NODE_TYPE,
  NOT_ALLOW_NESTING_NODE_TYPE,
} from '../constants';
import { CombatFormationService } from '../services/compbat-formation.service';
import { buildUnitsNesting } from '../utils';
interface TreeNodeData {
  nodeType: string;
  parentUnit: IUnit;
}
export interface ExtendedTreeDataNode extends TreeDataNode {
  data?: TreeNodeData;
  children?: ExtendedTreeDataNode[];
}

export const CombatFormation = () => {
  const [gData, setGData] = useState<TreeDataNode[]>([]);

  useEffect(() => {
    const fetchDataForWhoFields = async () => {
      const rawUnits = await AddDetectionService.getAllUnits();
      setGData(buildUnitsNesting({ units: rawUnits }));
    };

    fetchDataForWhoFields();
  }, []);

  const onDrop: TreeProps['onDrop'] = async (info) => {
    const dragData = info.dragNode.data;
    const dropData = info.node.data;

    const dragIsShip = dragData?.nodeType === NOT_ALLOW_NESTING_NODE_TYPE;
    const dropIsShip = dropData?.nodeType === NOT_ALLOW_NESTING_NODE_TYPE;

    const dragIsUnit = dragData?.nodeType === ALLOW_NESTING_NODE_TYPE;

    if (dragIsShip && dropIsShip && !info.dropToGap) {
      return;
    }

    const isSameUnit =
      dragData?.parentUnit?.id === dropData?.parentUnit?.id &&
      dragData?.parentUnit?.id &&
      dropData?.parentUnit?.id;
    const sourceId = info.dragNode.key as string;
    if (!isSameUnit && dragIsShip) {
      let targetId: string | null = null;
      const nodeType = dropData?.nodeType;
      if (nodeType === NOT_ALLOW_NESTING_NODE_TYPE) {
        targetId = dropData.parentUnit?.id;
      } else {
        targetId = info.node.key as string;
      }
      await CombatFormationService.changeShipNesting(sourceId, targetId);
    } else if (!isSameUnit && dragIsUnit) {
      let targetId: string | null = null;
      const nodeType = dropData?.nodeType;
      if (nodeType === NOT_ALLOW_NESTING_NODE_TYPE) {
        targetId = dropData.parentUnit?.id;
      } else if (info.dropPosition === -1) {
        targetId = null;
      }

      if (sourceId) {
        await CombatFormationService.changeUnitNesting(sourceId, targetId);
      }
    }

    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;

    const dropPos = info.node.pos.split('-');
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (
      data: TreeDataNode[],
      key: React.Key,
      callback: (node: TreeDataNode, i: number, data: TreeDataNode[]) => void
    ) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children!, key, callback);
        }
      }
    };

    const data = [...gData];

    let dragObj: TreeDataNode;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        item.children.unshift(dragObj);
      });
    } else {
      let ar: TreeDataNode[] = [];
      let i: number;
      loop(data, dropKey, (_item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i!, 0, dragObj!);
      } else {
        ar.splice(i! + 1, 0, dragObj!);
      }
    }

    setGData(data);
  };

  return (
    <Tree
      className="draggable-tree"
      draggable
      blockNode
      onDrop={onDrop}
      allowDrop={({ dropNode, dragNode, dropPosition }) => {
        const dragIsShip =
          dragNode.data?.nodeType === NOT_ALLOW_NESTING_NODE_TYPE;
        const dropIsShip =
          dropNode.data?.nodeType === NOT_ALLOW_NESTING_NODE_TYPE;

        if (dragIsShip && dropIsShip && dropPosition === 0) {
          return false;
        }

        return true;
      }}
      treeData={gData}
      titleRender={(node: TreeDataNode) => {
        return (
          <div
            style={{
              textAlign: 'left',
              padding: '10px',
              background:
                node?.data.nodeType === ALLOW_NESTING_NODE_TYPE
                  ? '#00000030'
                  : '#00000005',
            }}>
            {node.title}
            {node?.data.nodeType === ALLOW_NESTING_NODE_TYPE ? (
              <span
                style={{
                  paddingLeft: '10px',
                }}>
                <HomeOutlined />
              </span>
            ) : null}
          </div>
        );
      }}
    />
  );
};
