import { DoubleLeftOutlined } from '@ant-design/icons';
import { Button, Col, Drawer, Row } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import type { Network } from '../../Detection/types';
import { NetworkService } from '../../Network/services/network-service';
import { AddFieldsToDetectionForm } from '../Components/AddFieldsToDetectionForm/AddFieldsToDetectionForm';
import { FieldsEnum } from '../Components/AddFieldsToDetectionForm/types';
import { DetectionForm } from '../Components/DetectionForm/DetectionForm';
import type { TFieldsSetupMap } from '../types/detection.types';

export const AddDetection = () => {
  const params = useParams<{ id?: string }>();

  const navigate = useNavigate();
  const [networkTemplate, setNetworkTemplate] = useState<Network | null>(null);
  const [isNetworkConfiguratorOpen, setNetworkConfigurator] = useState(false);

  const [fieldsSetupMap, setFieldsSetupMap] = useState<TFieldsSetupMap>({
    [FieldsEnum.OFF]: [],
    [FieldsEnum.ON]: [],
    [FieldsEnum.REQUIRED]: [],
  });

  useEffect(() => {
    if (!networkTemplate) return;

    const { id, ...rest } = networkTemplate;
    const { id: templateId, ...template } = rest.template;

    const rawFieldsSetup = Object.entries(template).reduce<TFieldsSetupMap>(
      (acc: TFieldsSetupMap, [fieldName, value]) => {
        const prev = acc[value] || [];

        return { ...acc, [value]: [...prev, fieldName] };
      },
      fieldsSetupMap
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

  useEffect(() => {
    if (params.id) {
      const fetchNetwork = async () => {
        try {
          const data = await NetworkService.getNetwork(params.id!);
          setNetworkTemplate(data);
        } catch (error) {
          console.log(error);
        }
      };

      fetchNetwork();
    }
  }, [params.id]);

  return (
    <>
      <Button type="primary" onClick={() => navigate(-1)}>{`<= Назад`}</Button>
      <Row justify="space-between" style={{ height: '100%' }}>
        <Col xs={22} sm={22}>
          <DetectionForm
            name={networkTemplate?.name}
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
