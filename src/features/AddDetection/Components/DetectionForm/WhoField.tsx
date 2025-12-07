import { Button, Form, TreeSelect, type TreeSelectProps } from 'antd';

import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { DataNode } from 'rc-tree-select/lib/interface';
import { useEffect, useState } from 'react';
import type { IShip, IUnit } from '../../../../types/types';
import { groupToShipsTreeSelect } from '../../../../utils';
import { buildUnitsNestingForTree } from '../../../CombatFormation/utils';
import { buildUnitsNesting } from '../../utils';
import type { AbonentFormValueType, BaseFieldProps } from './DetectionForm';

type WhoFieldInputProps = BaseFieldProps & {
  defaultValue: AbonentFormValueType;
  onAbonentChange: (value: AbonentFormValueType) => void;
  ships: IShip[];
  units: IUnit[];
  name: string;
  selectedIds: string[];
};

export const WhoField = (props: WhoFieldInputProps) => {
  const [addCount, setAddCount] = useState<number>(0);

  const [value, setValue] = useState<string[]>([]);

  useEffect(() => {
    if (props.defaultValue) {
      const ids = props.defaultValue.map(({ id }) => id);
      setValue(ids);
      setAddCount(ids.length);
    }
  }, [props.defaultValue]);

  const groupedShips = groupToShipsTreeSelect({
    data: props.ships,
    groupBy: 'project',
    mainPrefix: 'проект: ',
    selectedIds: props.selectedIds,
  });

  const groupedUnits = buildUnitsNestingForTree({
    units: buildUnitsNesting(props.units),
    hideShips: true,
    selectedIds: props.selectedIds,
  });

  const options: TreeSelectProps['treeData'] = [
    {
      title: 'Кораблі',
      key: 'ship',
      value: 'ship',
      selectable: false,
      children: groupedShips,
    },
    {
      title: 'Підрозділи',
      key: 'unit',
      value: 'unit',
      selectable: false,
      checkable: false,
      children: groupedUnits,
    },
  ];

  const changeReaction = (ids: string[]) => {
    const selectedShips = props.ships.filter(({ id }) => ids.includes(id));
    const selectedUnits = props.units.filter(({ id }) => ids.includes(id));
    props.onAbonentChange([...selectedShips, ...selectedUnits]);
  };

  const onAbonentChange = (added: string) => {
    const newValue = [...value, added];
    setValue(newValue);
    setAddCount((prev) => prev + 1);
    changeReaction(newValue);
  };

  const onRemove = (name: number) => {
    const newValue = value.filter((_, idx) => idx !== name);
    setValue(newValue);
    setAddCount((prev) => prev - 1);
    changeReaction(newValue);
  };

  return (
    <Form.List name={props.name}>
      {(fields, { add }, { errors }) => (
        <>
          {fields.map((field, index) => {
            return (
              <Form.Item
                {...field}
                layout="vertical"
                label={index === 0 ? props.label : ''}
                key={field.key}>
                <TreeSelect
                  style={{
                    width: '90%',
                  }}
                  showSearch
                  treeLine={true}
                  treeExpandAction="click"
                  size="large"
                  treeData={options}
                  value={value[field.name]}
                  onChange={onAbonentChange}
                  showCheckedStrategy={TreeSelect.SHOW_CHILD}
                  filterTreeNode={(input: string, treeNode: DataNode) => {
                    const inputLower = input.toLowerCase();

                    const titleMatch = treeNode.title
                      ?.toString()
                      .toLowerCase()
                      .includes(inputLower);

                    const childMatch = treeNode.children?.some((child) =>
                      child.title?.toString().toLowerCase().includes(inputLower)
                    );

                    return !!titleMatch || !!childMatch;
                  }}
                />
                {fields.length >= 1 ? (
                  <DeleteOutlined
                    style={{
                      color: 'red',
                      marginLeft: '10px',
                    }}
                    onClick={() => onRemove(field.name)}
                  />
                ) : null}
              </Form.Item>
            );
          })}
          <Form.Item>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
              }}>
              {addCount === 0 ? (
                <Button
                  disabled={addCount > value.length}
                  onClick={() => {
                    setAddCount((prev) => prev + 1);
                    add();
                  }}
                  icon={<PlusOutlined />}>
                  Додати абонента
                </Button>
              ) : (
                <Button
                  disabled={addCount > value.length}
                  onClick={() => {
                    setAddCount((prev) => prev + 1);
                    add();
                  }}
                  icon={<PlusOutlined />}>
                  Додати варіант "АБО"
                </Button>
              )}
            </div>

            <Form.ErrorList errors={errors} />
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};
