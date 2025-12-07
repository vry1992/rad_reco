import { Radio, Tabs, type RadioChangeEvent } from 'antd';
import { useState } from 'react';
import { ShipTypesTable } from '../components/ShipTypesTable';
import { TransmissionTypesTable } from '../components/TransmissionTypesTable';
import { DataStoreService } from '../services/DataStore.service';

const DataSourceKeys: Record<string, string> = {
  SHIP_TYPES: 'ship-types',
  TRANSMISSION_TYPES: 'transmission-types',
};

type TabPosition = 'left' | 'top';

export const DataStore = () => {
  const [mode, setMode] = useState<TabPosition>('top');

  const handleModeChange = (e: RadioChangeEvent) => {
    setMode(e.target.value);
  };

  return (
    <div>
      <Radio.Group
        onChange={handleModeChange}
        value={mode}
        style={{ marginBottom: 8 }}>
        <Radio.Button value="top">Горизонтально</Radio.Button>
        <Radio.Button value="left">Вертикально</Radio.Button>
      </Radio.Group>
      <Tabs
        tabPosition={mode}
        items={[
          {
            key: DataSourceKeys.SHIP_TYPES,
            label: 'Типи кораблів',
            children: (
              <ShipTypesTable action={DataStoreService.shipTypes.get} />
            ),
          },
          {
            key: DataSourceKeys.TRANSMISSION_TYPES,
            label: 'Види передач',
            children: (
              <TransmissionTypesTable
                action={DataStoreService.transmisionTypes.get}
              />
            ),
          },
        ]}
      />
    </div>
  );
};
