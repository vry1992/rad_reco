import {
  Form,
  Input,
  InputNumber,
  TreeSelect,
  type TreeSelectProps,
} from 'antd';

import type { DataNode } from 'rc-tree-select/lib/interface';
import { useState, type ChangeEvent } from 'react';
import type { TShip } from '../../../../types/types';
import { groupToShipsTreeSelect } from '../../../../utils';
import { ships_MOCK } from '../mocks/mocksDetections';
import type { BaseFieldProps } from './DetectionForm';

type WhoFieldInputProps = BaseFieldProps & {
  defaultValue: {
    abonents: TShip[];
    peleng?: string;
    callsign?: string;
  };
  onCallsignChange: (value: string) => void;
  onPelengChange: (value: string | null) => void;
  onAbonentChange: (value: TShip[]) => void;
};

export const WhoField = (props: WhoFieldInputProps) => {
  const defaultValue = props.defaultValue
    ? props.defaultValue.abonents.map(({ id }) => id)
    : [];

  const [value, setValue] = useState<string[]>(defaultValue);

  console.log('VAL => ', value);

  const ships = ships_MOCK;
  const groupedShips = groupToShipsTreeSelect({
    data: ships,
    groupBy: 'project',
    mainPrefix: 'проект: ',
  });

  const options: TreeSelectProps['treeData'] = [
    {
      title: 'Кораблі',
      key: 'ships',
      value: 'ships',
      selectable: false,
      children: groupedShips,
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

    const selected = ships.filter(({ id }) => newValue.includes(id));

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
