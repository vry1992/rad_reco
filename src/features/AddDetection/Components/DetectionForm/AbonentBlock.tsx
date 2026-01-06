import {
  Collapse,
  Form,
  Input,
  InputNumber,
  Tree,
  Typography,
  type UploadFile,
} from 'antd';
import type { DataNode, EventDataNode } from 'antd/es/tree';
import { type CheckInfo } from 'rc-tree/lib/Tree';
import { useCallback, useEffect, useState, type FC, type Key } from 'react';
import { CALLSIGN_PREFIX } from '../../../../constants';
import type {
  IAbonent,
  IAircraft,
  IShip,
  IUnit,
} from '../../../../types/types';
import { HorizontalScroll } from '../../../../ui/HorizontalScroll';
import { InputWrapper } from '../../../../ui/InputWrapper';
import { buildShipLabel, buildUnitsLabel } from '../../../../utils';
import { DetectionsService } from '../../../Detection/services/detections-service';
import type {
  AbonentFormValueType,
  DetectionFormFieldName,
} from './DetectionForm';
import { PasteImageField } from './PasteImageField';
import { WhoField } from './WhoField';

type Props = {
  networkId?: string;
  label: string;
  whoFieldName: DetectionFormFieldName;
  whoFieldLabel: string;
  callsignFieldName: DetectionFormFieldName;
  callsignFieldLabel?: string;
  pelengFieldName: DetectionFormFieldName;
  pelengFieldLabel?: string;
  ships: IShip[];
  units: IUnit[];
  aircrafts: IAircraft[];
  callsigns: Pick<IAbonent, 'callsign'>[];
  selectedObjetcIds: string[];
  onChangeCallsign: (objects: Array<IShip | IUnit>, callsign?: string) => void;
  onWhoChange: (value: AbonentFormValueType) => void;
  onScreenshotChange: (file: UploadFile[]) => void;
};

export const AbonentBlock: FC<Props> = ({
  networkId,
  whoFieldName,
  whoFieldLabel,
  callsignFieldName,
  callsignFieldLabel = 'Позивний',
  pelengFieldName,
  pelengFieldLabel = 'Пеленг',
  label,
  ships,
  units,
  aircrafts,
  callsigns,
  selectedObjetcIds,
  onChangeCallsign,
  onWhoChange,
  onScreenshotChange,
}) => {
  const [treeData, setTreeData] = useState<DataNode[]>([] as DataNode[]);

  useEffect(() => {
    const rawTreeData = callsigns.map(({ callsign }) => {
      return {
        title: `${CALLSIGN_PREFIX} ${callsign}`,
        key: callsign,
        selectable: true,
        checkable: true,
        className: 'head',
      } as DataNode;
    });

    setTreeData(rawTreeData);
  }, [callsigns]);

  const getObjectCallsignCheckbox = ({
    ship,
    unit,
  }: {
    ship?: IShip;
    unit?: IUnit;
  }) => {
    if (ship) {
      return {
        title: buildShipLabel(ship),
        key: ship.id,
      };
    } else if (unit) {
      return {
        title: buildUnitsLabel(unit),
        key: unit.id,
      };
    }

    return {
      title: '',
      key: '',
    };
  };

  const getMainNodeKey = (info: CheckInfo): string => {
    const checkedNode = info.checkedNodes.find(
      ({ className }) => className === 'head'
    );
    return (
      (checkedNode?.key as string) ||
      (info.halfCheckedKeys?.[0] as string) ||
      (info.node.key as string)
    );
  };

  const checkIsMainNode = (node: EventDataNode<DataNode>): boolean => {
    const isHead = node.className === 'head';
    return isHead;
  };

  const onCheckCallsigns = useCallback(
    async (
      checked: Key[] | { checked: Key[]; halfChecked: Key[] },
      info: CheckInfo
    ) => {
      const allChecked = Array.isArray(checked) ? checked : checked.checked;
      if (!allChecked.length) {
        onChangeCallsign([], '');
        return;
      }
      const mainNodeKey = getMainNodeKey(info);
      const isMainNode = checkIsMainNode(info.node);

      const abonents = await fetchChildren(mainNodeKey);
      const selectedObjects: Array<IShip | IUnit> = abonents
        .filter((item) => item.ship || item.unit)
        .map(({ ship, unit }) => {
          return ship || unit;
        }) as Array<IShip | IUnit>;

      if (isMainNode) {
        const hasChildren = treeData.find(({ key }) => key === info.node.key)
          ?.children?.length;

        if (!hasChildren) {
          const children = prepareTreeDataFromChildren(abonents);
          setTreeData((prev) => {
            return prev.map((prevTree) => {
              if (prevTree.key === info.node.key) {
                prevTree.children = children;
              }
              return prevTree;
            });
          });
        }

        onChangeCallsign(selectedObjects, mainNodeKey);
      } else {
        const objects = selectedObjects.filter(({ id }) => {
          return allChecked.includes(id);
        });
        onChangeCallsign(objects, mainNodeKey);
      }
    },
    [callsigns, treeData]
  );

  const fetchChildren = useCallback(
    async (callsign: string): Promise<IAbonent[]> => {
      return DetectionsService.getCallsignAbonents(networkId!, callsign);
    },
    []
  );

  const prepareTreeDataFromChildren = (abonents: IAbonent[]) => {
    return abonents.map(({ ship, unit }) => {
      return {
        ...getObjectCallsignCheckbox({
          ship,
          unit,
        }),
        isLeaf: true,
        selectable: true,
        checkable: true,
      };
    });
  };

  const loadData = useCallback(
    async (e: EventDataNode<DataNode>) => {
      const callsign = e.key as string;
      const abonents = await fetchChildren(callsign);
      const children = prepareTreeDataFromChildren(abonents);

      setTreeData((prev) => {
        return prev.map((prevTree) => {
          if (prevTree.key === callsign) {
            prevTree.children = children;
          }
          return prevTree;
        });
      });
    },
    [networkId, fetchChildren]
  );

  return (
    <Collapse
      items={[
        {
          key: '1',
          label: <Typography.Title level={4}>{label}</Typography.Title>,
          children: (
            <>
              <Form.Item
                noStyle
                shouldUpdate={(prev, curr) => {
                  return (
                    prev[whoFieldName]?.join() !== curr[whoFieldName]?.join()
                  );
                }}>
                {({ getFieldValue }) => {
                  const defaultValue =
                    getFieldValue(whoFieldName)?.filter(Boolean);

                  return (
                    <WhoField
                      label={whoFieldLabel}
                      name={whoFieldName}
                      onAbonentChange={onWhoChange}
                      defaultValue={defaultValue}
                      ships={ships}
                      units={units}
                      aircrafts={aircrafts}
                      selectedIds={selectedObjetcIds}
                    />
                  );
                }}
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prev, curr) => {
                  return (
                    prev[callsignFieldName] !== curr[callsignFieldName] ||
                    prev[whoFieldName]?.join() !== curr[whoFieldName]?.join()
                  );
                }}>
                {({ getFieldValue }) => {
                  const selectedChildren: Array<IShip | IUnit> =
                    getFieldValue(whoFieldName);

                  return (
                    <>
                      <InputWrapper label={callsignFieldLabel}>
                        <Form.Item name={callsignFieldName}>
                          <Input placeholder=" " />
                        </Form.Item>
                      </InputWrapper>
                      <HorizontalScroll>
                        <div
                          style={{
                            display: 'flex',
                          }}>
                          {treeData
                            .sort((a) => {
                              const checked = getFieldValue(callsignFieldName);
                              return checked === a.key ? -1 : 1;
                            })
                            .map((item) => {
                              const checked = getFieldValue(callsignFieldName);
                              let checkedKeys =
                                checked && selectedChildren.length
                                  ? [checked]
                                  : [];
                              if (checked === item.key && !!item.children) {
                                checkedKeys = selectedChildren
                                  .filter(Boolean)
                                  .map(({ id }) => id);
                              }

                              return (
                                <Tree
                                  key={`${callsignFieldName}_${item.key}`}
                                  selectable
                                  checkable
                                  treeData={[item]}
                                  onCheck={onCheckCallsigns}
                                  checkedKeys={checkedKeys}
                                  loadData={loadData}
                                />
                              );
                            })}
                        </div>
                      </HorizontalScroll>
                    </>
                  );
                }}
              </Form.Item>

              <InputWrapper label={pelengFieldLabel}>
                <Form.Item name={pelengFieldName}>
                  <InputNumber<string>
                    min="0"
                    max="360"
                    step="0.5"
                    stringMode
                    style={{ width: '100%', marginTop: 5 }}
                    placeholder=" "
                    size="large"
                  />
                </Form.Item>
              </InputWrapper>
              <PasteImageField
                onChange={onScreenshotChange}
                title="Вставте скрин з пеленгами"
              />
            </>
          ),
        },
      ]}
      defaultActiveKey={['1']}
    />
  );
};
