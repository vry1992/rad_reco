import {
  Form,
  Input,
  InputNumber,
  TreeSelect,
  type TreeSelectProps,
} from 'antd';

import type { DataNode } from 'rc-tree-select/lib/interface';
import { useState, type ChangeEvent } from 'react';
import type { IShip, IUnit } from '../../../../types/types';
import {
  groupToShipsTreeSelect,
  groupToUnitsTreeSelect,
} from '../../../../utils';
import type { BaseFieldProps } from './DetectionForm';

type WhoFieldInputProps = BaseFieldProps & {
  defaultValue: {
    abonents: IShip[];
    peleng?: string;
    callsign?: string;
  };
  onCallsignChange: (value: string) => void;
  onPelengChange: (value: string | null) => void;
  onAbonentChange: (value: IShip[]) => void;
  ships: IShip[];
  units: IUnit[];
};

export const WhoField = (props: WhoFieldInputProps) => {
  const defaultValue = props.defaultValue
    ? props.defaultValue.abonents.map(({ id }) => id)
    : [];

  const [value, setValue] = useState<string[]>(defaultValue);

  const groupedShips = groupToShipsTreeSelect({
    data: props.ships,
    groupBy: 'project',
    mainPrefix: 'проект: ',
  });

  const groupedUnits = groupToUnitsTreeSelect({
    data: props.units,
  });

  const options: TreeSelectProps['treeData'] = [
    {
      title: 'Кораблі',
      key: 'ships',
      value: 'ships',
      selectable: false,
      children: groupedShips,
    },
    {
      title: 'підрозділи',
      key: 'units',
      value: 'units',
      selectable: false,
      children: groupedUnits,
    },
  ];

  const callsignName = `${props.name}Callsign`;
  const pelengName = `${props.name}Peleng`;

  const onPelengChange = (value: string | null) => {
    props.onPelengChange(value);
  };

  const onCallsignChange = (e: ChangeEvent<HTMLInputElement>) => {
    props.onCallsignChange(e.target.value);
  };

  const onAbonentChange = (newValue: string[]) => {
    setValue(newValue);

    const selected = props.ships.filter(({ id }) => newValue.includes(id));

    props.onAbonentChange(selected);
  };

  return (
    <div>
      <Form.Item
        layout="vertical"
        label={props.label}
        name={props.name}
        rules={[{ required: props.required }]}>
        <TreeSelect
          treeLine={true}
          treeExpandAction="click"
          size="large"
          treeData={options}
          value={value}
          onChange={onAbonentChange}
          multiple
          showCheckedStrategy={TreeSelect.SHOW_CHILD}
          filterTreeNode={(input: string, treeNode: DataNode) => {
            const has = treeNode.children?.some(({ title }) => {
              return title
                ?.toString()
                .toLowerCase()
                .includes(input.toLowerCase());
            });
            return !!has;
          }}
        />
        <Input
          value={props.defaultValue?.callsign || ''}
          name={callsignName}
          onChange={onCallsignChange}
          placeholder="Позивний"
          style={{
            marginTop: 5,
          }}
        />
        <InputNumber<string>
          value={props.defaultValue?.peleng || null}
          placeholder="Пеленг"
          min="0"
          max="360"
          step="0.5"
          stringMode
          name={pelengName}
          style={{ width: '100%', marginTop: 5 }}
          onChange={onPelengChange}
        />
      </Form.Item>
    </div>
  );
};
