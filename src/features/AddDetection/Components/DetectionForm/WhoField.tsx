import { Button, Form, TreeSelect, type TreeSelectProps } from 'antd';

import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { DataNode } from 'rc-tree-select/lib/interface';
import { useEffect, useState } from 'react';
import type { IShip, IUnit } from '../../../../types/types';
import { groupToShipsTreeSelect } from '../../../../utils';
import { buildUnitsNesting } from '../../../CombatFormation/utils';
import type { AbonentFormValueType, BaseFieldProps } from './DetectionForm';

type WhoFieldInputProps = BaseFieldProps & {
  defaultValue: AbonentFormValueType;
  onAbonentChange: (value: AbonentFormValueType) => void;
  ships: IShip[];
  units: IUnit[];
  name: string;
};

export const WhoField = (props: WhoFieldInputProps) => {
  const defaultValue: string[] = props.defaultValue
    ? props.defaultValue.map(({ id }) => id)
    : [];
  const [addCount, setAddCount] = useState<number>(defaultValue.length);

  const [value, setValue] = useState<string[]>(defaultValue);

  const groupedShips = groupToShipsTreeSelect({
    data: props.ships,
    groupBy: 'project',
    mainPrefix: 'проект: ',
  });

  const groupedUnits = buildUnitsNesting({
    units: props.units,
    hideShips: true,
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

  const onAbonentChange = (newValue: string) => {
    setValue((prev) => {
      return [...prev, newValue];
    });
  };

  const onRemove = (cb: (name: number) => void, name: number) => {
    setValue((prev) => prev.filter((_, idx) => idx !== name));
    setAddCount((prev) => prev - 1);
    cb(name);
  };

  useEffect(() => {
    const selectedShips = props.ships.filter(({ id }) => value.includes(id));
    const selectedUnits = props.units.filter(({ id }) => value.includes(id));

    props.onAbonentChange([...selectedShips, ...selectedUnits]);
  }, [value]);

  return (
    <Form.List name={props.name} initialValue={defaultValue}>
      {(fields, { add, remove }, { errors }) => (
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
                    onClick={() => onRemove(remove, field.name)}
                  />
                ) : null}
              </Form.Item>
            );
          })}
          <Form.Item>
            <Button
              disabled={addCount > value.length}
              onClick={() => {
                setAddCount((prev) => prev + 1);
                add();
              }}
              icon={<PlusOutlined />}>
              {addCount === 0 ? 'Додати абонента' : `Додати варіант "АБО"`}
            </Button>
            <Form.ErrorList errors={errors} />
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};
