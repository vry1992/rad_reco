import { Button, Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import type { IDetection, ITemplate } from '../../../types/types';
import { NetworkService } from '../../Network/services/network-service';
import { FieldsEnum } from '../Components/AddFieldsToDetectionForm/types';
import { DetectionForm } from '../Components/DetectionForm/DetectionForm';
import type { TFieldsSetupMap } from '../types/detection.types';

export const AddDetection = () => {
  const params = useParams<{ networkId: string }>();
  const { state } = useLocation();
  const prevDetection = state as IDetection;
  const navigate = useNavigate();
  const [networkTemplate, setNetworkTemplate] = useState<ITemplate | null>(
    null
  );
  const [netName, setNetName] = useState<string>('');

  const [fieldsSetupMap, setFieldsSetupMap] = useState<TFieldsSetupMap>({
    [FieldsEnum.OFF]: [],
    [FieldsEnum.ON]: [],
    [FieldsEnum.REQUIRED]: [],
  });

  useEffect(() => {
    if (!networkTemplate) return;

    const { id, ...template } = networkTemplate;

    const rawFieldsSetup = Object.entries(template).reduce<TFieldsSetupMap>(
      (acc: TFieldsSetupMap, [fieldName, value]: [string, FieldsEnum]) => {
        const prev = acc[value] || [];

        return { ...acc, [value]: [...prev, fieldName] };
      },
      fieldsSetupMap
    );

    setFieldsSetupMap(rawFieldsSetup);
  }, [networkTemplate]);

  useEffect(() => {
    if (params.networkId) {
      const fetchNetwork = async () => {
        try {
          const data = await NetworkService.getNetworkTemplate(
            params.networkId!
          );
          setNetworkTemplate(data.template);
          setNetName(data.name);
        } catch (error) {
          console.log(error);
        }
      };

      fetchNetwork();
    }
  }, [params.networkId]);

  return (
    <>
      <Button type="primary" onClick={() => navigate(-1)}>{`Назад`}</Button>
      <Row justify="space-between">
        <Col md={{ span: 18, offset: 3 }} xs={{ span: 24, offset: 0 }}>
          <DetectionForm
            name={netName}
            fields={fieldsSetupMap[FieldsEnum.ON]}
            requiredFields={fieldsSetupMap[FieldsEnum.REQUIRED]}
            prevDetectionState={prevDetection}
          />
        </Col>
      </Row>
    </>
  );
};
