import {
  Collapse,
  Form,
  Input,
  InputNumber,
  Tree,
  Typography,
  type FormInstance,
  type UploadFile,
} from 'antd';
import type { DataNode, EventDataNode } from 'antd/es/tree';
import { type CheckInfo } from 'rc-tree/lib/Tree';
import { useCallback, useEffect, useState, type FC, type Key } from 'react';
import { CALLSIGN_PREFIX } from '../../../../constants';
import type { IAbonent, IShip, IUnit } from '../../../../types/types';
import { HorizontalScroll } from '../../../../ui/HorizontalScroll';
import { InputWrapper } from '../../../../ui/InputWrapper';
import { buildShipLabel, buildUnitsLabel } from '../../../../utils';
import { DetectionsService } from '../../../Detection/services/detections-service';
import type {
  AbonentFormValueType,
  DetectionFormFieldName,
  DetectionFormValues,
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
  form: FormInstance<DetectionFormValues>;
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
  callsigns,
  selectedObjetcIds,
  form,
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

  const onCheckCallsigns = useCallback(
    async (
      checked: { checked: Key[]; halfChecked: Key[] } | Key[],
      info: CheckInfo
    ) => {
      const selectedIds = Array.isArray(checked) ? checked : checked.checked;

      const checkedCallsign =
        (info.halfCheckedKeys?.[0] as string) ||
        treeData.find(({ key }) => selectedIds.includes(key))?.key;

      if (checkedCallsign) {
        const hasChildren = treeData.find(({ key }) =>
          selectedIds.includes(key)
        )?.children?.length;

        const abonents = await fetchChildren(checkedCallsign as string);
        const children = prepareTreeDataFromChildren(abonents);

        if (!hasChildren) {
          setTreeData((prev) => {
            return prev.map((prevTree) => {
              if (prevTree.key === checkedCallsign) {
                prevTree.children = children;
              }
              return prevTree;
            });
          });
        }

        const selectedObjects: Array<IShip | IUnit> = abonents
          .filter((item) => item.ship || item.unit)
          .map(({ ship, unit }) => {
            if (ship) {
              return ship;
            }
            return unit;
          }) as Array<IShip | IUnit>;

        onChangeCallsign(
          selectedObjects,
          checkedCallsign as string | undefined
        );
      } else {
        onChangeCallsign([]);
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
                      selectedIds={selectedObjetcIds}
                    />
                  );
                }}
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prev, curr) => {
                  return prev[callsignFieldName] !== curr[callsignFieldName];
                }}>
                {({ getFieldValue }) => {
                  return (
                    <>
                      <InputWrapper
                        name={callsignFieldName}
                        label={callsignFieldLabel}>
                        <Input
                          placeholder=" "
                          value={getFieldValue(callsignFieldName)}
                          defaultValue={getFieldValue(callsignFieldName)}
                        />
                      </InputWrapper>
                      <HorizontalScroll>
                        <div
                          style={{
                            display: 'flex',
                          }}>
                          {treeData.map((item) => {
                            const checked = getFieldValue(callsignFieldName);
                            return (
                              <Tree
                                key={`${callsignFieldName}_${item.key}`}
                                selectable
                                checkable
                                treeData={[item]}
                                onCheck={onCheckCallsigns}
                                checkedKeys={checked ? [checked] : []}
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

              <InputWrapper name={pelengFieldName} label={pelengFieldLabel}>
                <InputNumber<string>
                  min="0"
                  max="360"
                  step="0.5"
                  stringMode
                  style={{ width: '100%', marginTop: 5 }}
                  placeholder=" "
                  size="large"
                  defaultValue={form.getFieldValue(pelengFieldName)}
                />
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
