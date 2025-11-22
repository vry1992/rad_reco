import { Card, Form, Input, InputNumber } from 'antd';

import { Button, Col, Row, Typography } from 'antd';
import 'dayjs/locale/uk';
import { Fragment, useCallback, useEffect, useState, type FC } from 'react';
import { useParams } from 'react-router';
import {
  AbonentDirectionEnum,
  type IDetection,
  type IShip,
  type ITransmitionTypes,
  type IUnit,
} from '../../../../types/types';
import { TMP_FIELD_NAME_MAP } from '../../constants';
import { AddDetectionService } from '../../services/add-detection.service';
import { AdditionalInfoField } from './AdditionalInfoField';
import { FrequencyField } from './FrequencyField';
import { TimeOfDetectionField } from './TimeOfDetectionField';
import { TransmisionTypeField } from './TransmissionTypeField';
import { WhoField } from './WhoField';

type Props = {
  name?: string;
  fields: string[];
  requiredFields: string[];
  prevDetectionState?: IDetection;
};

export type AbonentFormValueType = Array<IShip | IUnit>;

export type DetectionFormValues = {
  timeOfDetection?: string;
  timeFrom?: string;
  timeTo?: string;
  abonentsFrom: Array<IShip | IUnit>;
  pelengFrom: string;
  callsignFrom: string;
  abonentsTo: Array<IShip | IUnit>;
  pelengTo: string;
  callsignTo: string;
  frequency: string;
  transmissionType?: string;
  additionalInformation?: string;
};

export type DetectionFormFieldName = keyof DetectionFormValues;

export type BaseFieldProps = {
  name: DetectionFormFieldName;
  label: string;
  required?: boolean;
  placeholder?: string;
};

export const DetectionForm: FC<Props> = ({
  name,
  fields,
  requiredFields,
  prevDetectionState,
}) => {
  const params = useParams<{ id: string }>();
  const [form] = Form.useForm<DetectionFormValues>();
  const [ships, setShips] = useState<IShip[]>([]);
  const [units, setUnits] = useState<IUnit[]>([]);
  const [transmitionTypes, setTransmitionsTypes] = useState<
    ITransmitionTypes[]
  >([]);

  useEffect(() => {
    if (prevDetectionState) {
      const { abonents, network, id, ...rest } = prevDetectionState;
      const fromAbonentsInfo = abonents.filter(
        ({ role }) => role === AbonentDirectionEnum.FROM
      );

      const abonentsFrom = fromAbonentsInfo.reduce<AbonentFormValueType>(
        (acc, curr) => {
          const item: AbonentFormValueType = [];
          if (curr.ship) {
            item.push(curr.ship);
          }
          if (curr.unit) {
            item.push(curr.unit);
          }

          return [...acc, ...item];
        },
        []
      );

      const toAbonentsInfo = abonents.filter(
        ({ role }) => role === AbonentDirectionEnum.TO
      );

      const abonentsTo = toAbonentsInfo.reduce<AbonentFormValueType>(
        (acc, curr) => {
          const item: AbonentFormValueType = [];
          if (curr.ship) {
            item.push(curr.ship);
          }
          if (curr.unit) {
            item.push(curr.unit);
          }

          return [...acc, ...item];
        },
        []
      );
      form.setFieldsValue({
        ...rest,
        abonentsFrom,
        abonentsTo,
        transmissionType: prevDetectionState.transmissionType.id,
        pelengFrom: fromAbonentsInfo?.[0]?.peleng,
        callsignFrom: fromAbonentsInfo?.[0]?.callsign,
        pelengTo: toAbonentsInfo?.[0]?.peleng,
        callsignTo: toAbonentsInfo?.[0]?.callsign,
      });
    }
  }, [prevDetectionState]);

  useEffect(() => {
    const fetchDataForWhoFields = async () => {
      const [rawShips, rawUnits, rawTt] = await Promise.all([
        AddDetectionService.getAllShips(),
        AddDetectionService.getAllUnits(),
        AddDetectionService.getTransmitionTypes(),
      ]);
      setShips(rawShips);
      setUnits(rawUnits);
      setTransmitionsTypes(rawTt);
    };

    fetchDataForWhoFields();
  }, []);

  const onAbonentToChange = (value: AbonentFormValueType) => {
    form.setFieldValue('abonentsTo', value);
  };

  const onAbonentFromChange = (value: AbonentFormValueType) => {
    form.setFieldValue('abonentsFrom', value);
  };

  const onTimeOfDetectionChange = (value: string) => {
    form.setFieldValue('timeOfDetection', value);
  };

  const renderFields = useCallback(() => {
    return [...requiredFields, ...fields]
      .sort((fieldA, fieldB) => {
        return (
          TMP_FIELD_NAME_MAP[fieldA].groupOrder -
          TMP_FIELD_NAME_MAP[fieldB].groupOrder
        );
      })
      .map((field, _, arr) => {
        const commonProps = {
          value: form.getFieldValue(field as DetectionFormFieldName),
          required: requiredFields.includes(field),
        };

        return (
          <Fragment key={field}>
            {field === 'timeOfDetection' && (
              <Col xs={24}>
                <TimeOfDetectionField
                  label={'Час виявлення'}
                  name="timeOfDetection"
                  showHelpButtons={true}
                  onChange={onTimeOfDetectionChange}
                  {...commonProps}
                />
              </Col>
            )}
            {field === 'timeFrom' && (
              <Col xs={24} sm={arr.includes('timeTo') ? 12 : 24}>
                <TimeOfDetectionField
                  label={'Відмічався із'}
                  name="timeFrom"
                  showHelpButtons={false}
                  {...commonProps}
                  onChange={onTimeOfDetectionChange}
                />
              </Col>
            )}
            {field === 'timeTo' && (
              <Col xs={24} sm={arr.includes('timeFrom') ? 12 : 24}>
                <TimeOfDetectionField
                  name="timeTo"
                  label={'Відмічався по'}
                  showHelpButtons={false}
                  {...commonProps}
                  onChange={onTimeOfDetectionChange}
                />
              </Col>
            )}
            {field === 'abonentsFrom' && (
              <Col xs={24} sm={arr.includes('abonentsTo') ? 12 : 24}>
                <Card title="Абонент 'Хто'" style={{ width: '100%' }}>
                  <WhoField
                    label={'Хто'}
                    name="abonentsFrom"
                    {...commonProps}
                    onAbonentChange={onAbonentFromChange}
                    defaultValue={form.getFieldValue('abonentsFrom')}
                    ships={ships}
                    units={units}
                  />
                  <Form.Item
                    layout="vertical"
                    label={'Позивний'}
                    name={'callsignFrom'}>
                    <Input
                      {...commonProps}
                      style={{
                        marginTop: 5,
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    layout="vertical"
                    label={'Пеленг'}
                    name={'pelengFrom'}>
                    <InputNumber<string>
                      {...commonProps}
                      min="0"
                      max="360"
                      step="0.5"
                      stringMode
                      style={{ width: '100%', marginTop: 5 }}
                    />
                  </Form.Item>
                </Card>
              </Col>
            )}
            {field === 'abonentsTo' && (
              <Col xs={24} sm={arr.includes('abonentsFrom') ? 12 : 24}>
                <Card title="Абонент 'Кого'" style={{ width: '100%' }}>
                  <WhoField
                    label={'Кого'}
                    {...commonProps}
                    name="abonentsTo"
                    onAbonentChange={onAbonentToChange}
                    defaultValue={form.getFieldValue('abonentsTo')}
                    ships={ships}
                    units={units}
                  />
                  <Form.Item
                    layout="vertical"
                    label={'Позивний'}
                    name={'callsignTo'}>
                    <Input
                      {...commonProps}
                      style={{
                        marginTop: 5,
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    layout="vertical"
                    label={'Пеленг'}
                    name={'pelengTo'}>
                    <InputNumber<string>
                      {...commonProps}
                      min="0"
                      max="360"
                      step="0.5"
                      stringMode
                      style={{ width: '100%', marginTop: 5 }}
                    />
                  </Form.Item>
                </Card>
              </Col>
            )}
            {field === 'frequency' && (
              <Col xs={24} sm={12}>
                <FrequencyField
                  label={'Частота'}
                  name="frequency"
                  {...commonProps}
                />
              </Col>
            )}
            {field === 'transmissionType' && (
              <Col xs={24} sm={12}>
                <TransmisionTypeField
                  name="transmissionType"
                  types={transmitionTypes}
                  label={'Вид передачі'}
                  {...commonProps}
                />
              </Col>
            )}
            {field === 'additionalInformation' && (
              <Col xs={24} sm={24}>
                <AdditionalInfoField
                  name="additionalInformation"
                  label={'Додаткова інформація'}
                  {...commonProps}
                />
              </Col>
            )}
          </Fragment>
        );
      });
  }, [requiredFields, fields]);

  return (
    <Form
      form={form}
      labelAlign="left"
      onFinish={async (values) => {
        const payload = {
          networkId: params.id,
          ...values,
        };
        await AddDetectionService.createDetection(payload);
      }}>
      <Typography.Title
        level={3}
        style={{ margin: 0, textAlign: 'left', marginBottom: '20px' }}>
        Виявлено мережу: {name}
      </Typography.Title>
      <Row gutter={[4, 4]}>{renderFields()}</Row>

      <Button type="primary" htmlType="submit">
        Зберегти
      </Button>
    </Form>
  );
};
