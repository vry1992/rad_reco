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
import { groupToShipsTreeSelect } from '../../../../utils';
import { buildUnitsNesting } from '../../../CombatFormation/utils';
import type { BaseFieldProps } from './DetectionForm';

type WhoFieldInputProps = BaseFieldProps & {
  defaultValue: {
    abonents: {
      ship: IShip[];
      unit: IUnit[];
    };
    peleng?: string;
    callsign?: string;
  };
  onCallsignChange: (value: string) => void;
  onPelengChange: (value: string | null) => void;
  onAbonentChange: (value: { ship: IShip[]; unit: IUnit[] }) => void;
  ships: IShip[];
  units: IUnit[];
};

export const WhoField = (props: WhoFieldInputProps) => {
  const defaultValue: string[] = props.defaultValue
    ? [
        ...props.defaultValue.abonents.ship,
        ...props.defaultValue.abonents.unit,
      ].map(({ id }) => id)
    : [];

  const [value, setValue] = useState<string[]>(defaultValue);
  const [callsign, setCallsign] = useState<string>(
    props.defaultValue?.callsign || ''
  );
  const [peleng, setPeleng] = useState<string>(
    props.defaultValue?.peleng || '0'
  );

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

  const callsignName = `${props.name}Callsign`;
  const pelengName = `${props.name}Peleng`;

  const onPelengChange = (value: string | null) => {
    if (value) {
      setPeleng(value);
      props.onPelengChange(value);
    }
  };

  const onCallsignChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCallsign(e.target.value);
    props.onCallsignChange(e.target.value);
  };

  const onAbonentChange = (newValue: string[]) => {
    setValue(newValue);

    const selectedShips = props.ships.filter(({ id }) => newValue.includes(id));
    const selectedUnits = props.units.filter(({ id }) => newValue.includes(id));

    props.onAbonentChange({
      ship: selectedShips,
      unit: selectedUnits,
    });
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
          value={callsign}
          name={callsignName}
          onChange={onCallsignChange}
          placeholder="Позивний"
          style={{
            marginTop: 5,
          }}
        />
        <InputNumber<string>
          value={peleng}
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
