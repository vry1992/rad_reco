import { Form, Input, InputNumber, type UploadFile } from 'antd';

import { Button, Col, Row, Typography } from 'antd';
import 'dayjs/locale/uk';
import { Fragment, useCallback, useEffect, useState, type FC } from 'react';
import { useParams } from 'react-router';
import { AircraftService } from '../../../../services/aircraft-service';
import {
  AbonentDirectionEnum,
  type IAbonent,
  type IAircraft,
  type IDetection,
  type IShip,
  type ITransmitionTypes,
  type IUnit,
} from '../../../../types/types';
import { InputWrapper } from '../../../../ui/InputWrapper';
import { FIELD_NAME_MAP } from '../../../CreateNetwork/constants';
import { DetectionsService } from '../../../Detection/services/detections-service';
import { NetworkService } from '../../../Network/services/network-service';
import { AddDetectionService } from '../../services/add-detection.service';
import { TransmissionTypesService } from '../../services/transmission-type.service';
import { AbonentBlock } from './AbonentBlock';
import { FrequenciesTagList } from './FrequenciesTagList';
import { TimeOfDetectionField } from './TimeOfDetectionField';
import { TransmisionTypeField } from './TransmissionTypeField';

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
  abonentFromPelengImage?: File;
  abonentToPelengImage?: File;
};

export type DetectionFormFieldName = keyof DetectionFormValues;

export type BaseFieldProps = {
  name: DetectionFormFieldName;
  label: string;
  required?: boolean;
  placeholder?: string;
};

export const fieldLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
};

export const DetectionForm: FC<Props> = ({
  name,
  fields,
  requiredFields,
  prevDetectionState,
}) => {
  const { networkId } = useParams<{ networkId: string }>();
  const [form] = Form.useForm<DetectionFormValues>();
  const [ships, setShips] = useState<IShip[]>([]);
  const [units, setUnits] = useState<IUnit[]>([]);
  const [aircrafts, setAircrafts] = useState<IAircraft[]>([]);
  const [frequencies, setFrequencies] = useState<
    Pick<IDetection, 'frequency'>[]
  >([]);
  const [callsigns, setCallsigns] = useState<Pick<IAbonent, 'callsign'>[]>([]);
  const [transmitionTypes, setTransmitionsTypes] = useState<
    ITransmitionTypes[]
  >([]);
  const allFields = [...requiredFields, ...fields];
  const [selectedObjetcIds, setSelectedObjectIds] = useState<string[]>([]);

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

      setSelectedObjectIds((prev) => {
        const fromIds = abonentsFrom.map(({ id }) => id);
        const toIds = abonentsTo.map(({ id }) => id);
        return [...prev, ...fromIds, ...toIds];
      });

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
    if (!networkId) return;
    if (
      allFields.includes('abonentsFrom') ||
      allFields.includes('abonentsTo')
    ) {
      const fetchNetworkMetadata = async () => {
        const [rawCallsigns, rawFrequencies] = await Promise.all([
          DetectionsService.getCallsigns(networkId),
          NetworkService.getNetworkFrequencies(networkId),
        ]);

        setCallsigns(rawCallsigns);
        setFrequencies(rawFrequencies.filter(({ frequency }) => !!frequency));
      };

      fetchNetworkMetadata();
    }
  }, [fields, requiredFields, networkId]);

  useEffect(() => {
    const fetchDataForWhoFields = async () => {
      const [rawShips, rawUnits, [rawTt], [rawAircrafts]] = await Promise.all([
        AddDetectionService.getAllShips(),
        AddDetectionService.getAllUnits(),
        TransmissionTypesService.getTransmitionTypes(),
        AircraftService.getAll(),
      ]);
      setShips(rawShips);
      setUnits(rawUnits);
      setTransmitionsTypes(rawTt);
      setAircrafts(rawAircrafts);
    };

    fetchDataForWhoFields();
  }, []);

  const onAbonentToChange = (value: AbonentFormValueType) => {
    form.setFieldValue('abonentsTo', value);
    updateSelectedIds();
  };

  const onAbonentFromChange = (value: AbonentFormValueType) => {
    form.setFieldValue('abonentsFrom', value);
    updateSelectedIds();
  };

  const updateSelectedIds = () => {
    const from = form.getFieldValue('abonentsFrom') || [];
    const to = form.getFieldValue('abonentsTo') || [];

    setSelectedObjectIds([...to, ...from].map(({ id }) => id));
  };

  const onTimeOfDetectionChange = (value: string) => {
    form.setFieldValue('timeOfDetection', value);
  };

  const onFromImage = (value: UploadFile[]) => {
    if (value?.[0]) {
      form.setFieldValue('abonentFromPelengImage', value[0].originFileObj);
    }
  };

  const onToImage = (value: UploadFile[]) => {
    if (value?.[0]) {
      form.setFieldValue('abonentToPelengImage', value[0].originFileObj);
    }
  };

  const onTransmissionTypeChange = (value: string) => {
    form.setFieldValue('transmissionType', value);
  };

  const onChangeCallsignFrom = (
    objects: Array<IShip | IUnit>,
    callsign?: string
  ) => {
    console.log('1 =>', callsign, '<=');
    form.setFieldValue('callsignFrom', callsign);
    form.setFieldValue('abonentsFrom', objects);
  };

  const onChangeCallsignTo = (
    objects: Array<IShip | IUnit>,
    callsign?: string
  ) => {
    form.setFieldValue('callsignTo', callsign);
    form.setFieldValue('abonentsTo', objects);
  };

  const renderFields = useCallback(() => {
    return allFields
      .sort((fieldA, fieldB) => {
        return (
          FIELD_NAME_MAP[fieldA].groupOrder - FIELD_NAME_MAP[fieldB].groupOrder
        );
      })
      .map((field, _, arr) => {
        return (
          <Fragment key={field}>
            {field === 'timeOfDetection' && (
              <Col xs={24}>
                <TimeOfDetectionField
                  label={'Час виявлення'}
                  name="timeOfDetection"
                  showHelpButtons={true}
                  onChange={onTimeOfDetectionChange}
                />
              </Col>
            )}
            {field === 'timeFrom' && (
              <Col xs={24} sm={arr.includes('timeTo') ? 12 : 24}>
                <TimeOfDetectionField
                  label={'Відмічався із'}
                  name="timeFrom"
                  showHelpButtons={false}
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
                  onChange={onTimeOfDetectionChange}
                />
              </Col>
            )}

            {field === 'abonentsFrom' && (
              <Col xs={24} xl={arr.includes('abonentsTo') ? 12 : 24}>
                <AbonentBlock
                  networkId={networkId}
                  label="Абонент 'Хто'"
                  whoFieldName="abonentsFrom"
                  whoFieldLabel="Хто"
                  callsignFieldName="callsignFrom"
                  callsignFieldLabel="Позивний"
                  pelengFieldName="pelengFrom"
                  pelengFieldLabel="Пеленг"
                  ships={ships}
                  units={units}
                  aircrafts={aircrafts}
                  callsigns={callsigns}
                  selectedObjetcIds={selectedObjetcIds}
                  onChangeCallsign={onChangeCallsignFrom}
                  onWhoChange={onAbonentFromChange}
                  onScreenshotChange={onFromImage}
                />
              </Col>
            )}
            {field === 'abonentsTo' && (
              <Col xs={24} xl={arr.includes('abonentsFrom') ? 12 : 24}>
                <AbonentBlock
                  networkId={networkId}
                  label="Абонент 'Кого'"
                  whoFieldName="abonentsTo"
                  whoFieldLabel="Кого"
                  callsignFieldName="callsignTo"
                  callsignFieldLabel="Позивний"
                  pelengFieldName="pelengTo"
                  pelengFieldLabel="Пеленг"
                  ships={ships}
                  units={units}
                  aircrafts={aircrafts}
                  callsigns={callsigns}
                  selectedObjetcIds={selectedObjetcIds}
                  onChangeCallsign={onChangeCallsignTo}
                  onWhoChange={onAbonentToChange}
                  onScreenshotChange={onToImage}
                />
              </Col>
            )}

            {field === 'frequency' && (
              <Col
                xs={24}
                sm={12}
                style={{
                  marginTop: 10,
                }}>
                <Form.Item
                  noStyle
                  shouldUpdate={(prev, curr) =>
                    prev.frequency !== curr.frequency
                  }>
                  {({ getFieldValue, setFieldValue }) => {
                    return (
                      <>
                        <InputWrapper label="Частота">
                          <Form.Item
                            name={'frequency'}
                            rules={[
                              {
                                required: requiredFields.includes('frequency'),
                                message: 'Вкажіть частоту',
                              },
                            ]}>
                            <InputNumber<string>
                              min="1000"
                              step="0.5"
                              stringMode
                              style={{ width: '100%' }}
                              suffix={'кГц'}
                              size="large"
                              placeholder=" "
                              value={getFieldValue('frequency')}
                              defaultValue={getFieldValue('frequency')}
                            />
                          </Form.Item>
                        </InputWrapper>

                        {frequencies?.length ? (
                          <FrequenciesTagList
                            frequencies={frequencies}
                            value={getFieldValue('frequency')}
                            onChange={(frequency) => {
                              setFieldValue('frequency', frequency);
                            }}
                          />
                        ) : null}
                      </>
                    );
                  }}
                </Form.Item>
              </Col>
            )}

            {field === 'transmissionType' && (
              <Col
                xs={24}
                sm={12}
                style={{
                  marginTop: 10,
                }}>
                <InputWrapper label="Вид передачі">
                  <Form.Item
                    name={'transmissionType'}
                    rules={[
                      {
                        required: requiredFields.includes(field),
                        message: 'Оберіть вид передачі',
                      },
                    ]}>
                    <TransmisionTypeField
                      types={transmitionTypes}
                      onChange={onTransmissionTypeChange}
                      defaultValue={form.getFieldValue('transmissionType')}
                    />
                  </Form.Item>
                </InputWrapper>
              </Col>
            )}
            {field === 'additionalInformation' && (
              <Col xs={24} sm={24}>
                <InputWrapper label="Додаткова інформація">
                  <Form.Item name={'additionalInformation'}>
                    <Input.TextArea rows={5} />
                  </Form.Item>
                </InputWrapper>
              </Col>
            )}
          </Fragment>
        );
      });
  }, [
    requiredFields,
    fields,
    frequencies,
    transmitionTypes,
    form,
    selectedObjetcIds,
    callsigns,
    ships,
    units,
  ]);

  return (
    <Form
      form={form}
      labelAlign="left"
      onFinish={async (values) => {
        const abonentFromPelengImage = form.getFieldValue(
          'abonentFromPelengImage'
        );
        const abonentToPelengImage = form.getFieldValue('abonentToPelengImage');
        const jsonPayload = {
          networkId,
          ...values,
          abonentsFrom: (values.abonentsFrom || []).filter(Boolean),
          abonentsTo: (values.abonentsTo || []).filter(Boolean),
        };

        const formData = new FormData();

        formData.append('payload', JSON.stringify(jsonPayload));

        if (abonentFromPelengImage instanceof File) {
          formData.append('abonentFromPelengImage', abonentFromPelengImage);
        }

        if (abonentToPelengImage instanceof File) {
          formData.append('abonentToPelengImage', abonentToPelengImage);
        }

        await AddDetectionService.createDetection(formData);
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
