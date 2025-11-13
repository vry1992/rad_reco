import { DoubleLeftOutlined } from '@ant-design/icons';
import { Button, Col, Drawer, Row } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { AddFieldsToDetectionForm } from '../Components/AddFieldsToDetectionForm/AddFieldsToDetectionForm';
import { FieldsEnum } from '../Components/AddFieldsToDetectionForm/types';
import { DetectionForm } from '../Components/DetectionForm/DetectionForm';
import { network_A_DetectionTemplate_MOCK } from '../Components/mocks/mocksDetections';
import type { TFieldsSetupMap } from '../types/detection.types';

export const AddDetection = () => {
  const navigate = useNavigate();
  const networkTemplate = network_A_DetectionTemplate_MOCK;
  const [isNetworkConfiguratorOpen, setNetworkConfigurator] = useState(false);

  const [fieldsSetupMap, setFieldsSetupMap] = useState<TFieldsSetupMap>({
    [FieldsEnum.OFF]: [],
    [FieldsEnum.ON]: [],
    [FieldsEnum.REQUIRED]: [],
  });

  useEffect(() => {
    const { id, networkId, ...rest } = networkTemplate;
    const rawFieldsSetup = Object.entries(rest).reduce(
      (acc: TFieldsSetupMap, [fieldName, value]) => {
        const prev = acc[value] || [];

        return { ...acc, [value]: [...prev, fieldName] };
      },
      {} as TFieldsSetupMap
    );

    setFieldsSetupMap(rawFieldsSetup);
  }, [networkTemplate]);

  const onConfirmAddField = useCallback(
    (field: string, type: FieldsEnum.ON | FieldsEnum.REQUIRED) => {
      setFieldsSetupMap((prev) => {
        const prevOff = prev[FieldsEnum.OFF];
        const newOff = prevOff.filter((item) => item !== field);

        const withNewField = [...prev[type], field];

        return {
          ...prev,
          [FieldsEnum.OFF]: newOff,
          [type]: withNewField,
        };
      });
    },
    [fieldsSetupMap]
  );

  return (
    <>
      <Button type="primary" onClick={() => navigate(-1)}>{`<= Назад`}</Button>
      <Row justify="space-between" style={{ height: '100%' }}>
        <Col xs={22} sm={22}>
          <DetectionForm
            fields={fieldsSetupMap[FieldsEnum.ON]}
            requiredFields={fieldsSetupMap[FieldsEnum.REQUIRED]}
          />
        </Col>

        <Col xs={2} sm={2}>
          <Button
            type="primary"
            onClick={() => setNetworkConfigurator(!isNetworkConfiguratorOpen)}>
            <DoubleLeftOutlined />
          </Button>
        </Col>

        <Drawer
          title="Конфігуратор мережі"
          closable={true}
          onClose={() => setNetworkConfigurator(!isNetworkConfiguratorOpen)}
          open={isNetworkConfiguratorOpen}>
          <AddFieldsToDetectionForm
            fields={fieldsSetupMap[FieldsEnum.OFF]}
            onConfirm={onConfirmAddField}
          />
        </Drawer>
      </Row>
    </>
  );
};
