import { Radio, Tabs, type RadioChangeEvent } from 'antd';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { ShipTypesTable } from '../components/ShipTypesTable';
import { TransmissionTypesTable } from '../components/TransmissionTypesTable';
import { DataStoreService } from '../services/DataStore.service';

const DataSourceKeys: Record<string, string> = {
  SHIP_TYPES: 'ship-types',
  TRANSMISSION_TYPES: 'transmission-types',
};

type TabPosition = 'left' | 'top';

export const DataStore = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleModeChange = (e: RadioChangeEvent) => {
    setSearchParams((prev) => {
      prev.set('mode', e.target.value);

      return prev;
    });
  };

  useEffect(() => {
    const initActiveKey = searchParams.get('activeKey');
    const initMode = searchParams.get('mode');
    setSearchParams({
      mode: initMode || 'left',
      activeKey: initActiveKey || DataSourceKeys.SHIP_TYPES,
    });
  }, []);

  return (
    <div>
      <Radio.Group
        onChange={handleModeChange}
        value={searchParams.get('mode') as string}
        style={{ marginBottom: 8 }}>
        <Radio.Button value="top">Горизонтально</Radio.Button>
        <Radio.Button value="left">Вертикально</Radio.Button>
      </Radio.Group>
      <Tabs
        onChange={(activeKey) => {
          setSearchParams((prev) => {
            prev.set('activeKey', activeKey);

            return prev;
          });
        }}
        tabPosition={searchParams.get('mode') as TabPosition}
        activeKey={searchParams.get('activeKey') as string}
        items={[
          {
            key: DataSourceKeys.SHIP_TYPES,
            label: 'Типи кораблів',
            children: (
              <ShipTypesTable action={DataStoreService.shipTypes.getAll} />
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
