import { Form } from 'antd';

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

type AbonentFormValueType = {
  ship: IShip[];
  unit: IUnit[];
};

export type DetectionFormValues = {
  timeOfDetection?: string;
  timeFrom?: string;
  timeTo?: string;
  abonentFrom?: {
    abonents: AbonentFormValueType;
    peleng?: string;
    callsign?: string;
  };
  abonentTo?: {
    abonents: AbonentFormValueType;
    peleng?: string;
    callsign?: string;
  };
  frequency: string | null;
  transmissionType?: string;
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
      const fromAbonentsInfo = prevDetectionState.abonents.filter(
        ({ role }) => role === AbonentDirectionEnum.FROM
      );

      const toAbonentsInfo = prevDetectionState.abonents.filter(
        ({ role }) => role === AbonentDirectionEnum.TO
      );

      form.setFieldValue('abonentFrom', {
        abonents: fromAbonentsInfo.reduce(
          (acc, curr) => {
            if (curr.ship) {
              acc.ship.push(curr.ship);
            }
            if (curr.unit) {
              acc.unit.push(curr.unit);
            }
            return acc;
          },
          { ship: [], unit: [] } as AbonentFormValueType
        ),
        peleng: fromAbonentsInfo?.[0].peleng,
        callsign: fromAbonentsInfo?.[0].peleng,
      });

      form.setFieldValue('abonentTo', {
        abonents: toAbonentsInfo.reduce(
          (acc, curr) => {
            if (curr.ship) {
              acc.ship.push(curr.ship);
            }
            if (curr.unit) {
              acc.unit.push(curr.unit);
            }
            return acc;
          },
          { ship: [], unit: [] } as AbonentFormValueType
        ),
        peleng: toAbonentsInfo?.[0].peleng,
        callsign: toAbonentsInfo?.[0].callsign,
      });

      form.setFieldValue('frequency', prevDetectionState.frequency);
      form.setFieldValue(
        'transmissionType',
        prevDetectionState.transmissionType.id
      );
    }
  }, [prevDetectionState, form]);

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

  const onSimpleInputChange = useCallback(
    <Name extends keyof DetectionFormValues>(
      value: DetectionFormValues[Name],
      name: Name
    ) => {
      form.setFieldValue(name, value);
    },
    []
  );

  const onFrequencyChange = (value: string | null) => {
    onSimpleInputChange<'frequency'>(value, 'frequency');
  };

  const onAbonentFromCallsignChange = (value: string) => {
    form.setFieldValue('abonentFrom', {
      ...form.getFieldValue('abonentFrom'),
      callsign: value,
    });
  };

  const onAbonentToCallsignChange = (value: string) => {
    form.setFieldValue('abonentTo', {
      ...form.getFieldValue('abonentTo'),
      callsign: value,
    });
  };

  const onAbonentFromPelengChange = (value: string | null) => {
    form.setFieldValue('abonentFrom', {
      ...form.getFieldValue('abonentFrom'),
      peleng: value,
    });
  };

  const onAbonentToPelengChange = (value: string | null) => {
    form.setFieldValue('abonentTo', {
      ...form.getFieldValue('abonentTo'),
      peleng: value,
    });
  };

  const onAbonentToChange = (value: { ship: IShip[]; unit: IUnit[] }) => {
    form.setFieldValue('abonentTo', {
      ...form.getFieldValue('abonentTo'),
      abonents: value,
    });
  };

  const onAbonentFromChange = (value: { ship: IShip[]; unit: IUnit[] }) => {
    form.setFieldValue('abonentFrom', {
      ...form.getFieldValue('abonentFrom'),
      abonents: value,
    });
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
          name: field as DetectionFormFieldName,
          required: requiredFields.includes(field),
          defaultValue: prevDetectionState
            ? form.getFieldValue(field as keyof DetectionFormValues)
            : null,
        };

        return (
          <Fragment key={field}>
            {field === 'timeOfDetection' && (
              <Col xs={24}>
                <TimeOfDetectionField
                  label={'Час виявлення'}
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
                  showHelpButtons={false}
                  {...commonProps}
                  onChange={onTimeOfDetectionChange}
                />
              </Col>
            )}
            {field === 'timeTo' && (
              <Col xs={24} sm={arr.includes('timeFrom') ? 12 : 24}>
                <TimeOfDetectionField
                  label={'Відмічався по'}
                  showHelpButtons={false}
                  {...commonProps}
                  onChange={onTimeOfDetectionChange}
                />
              </Col>
            )}
            {field === 'abonentFrom' && (
              <Col xs={24} sm={arr.includes('abonentTo') ? 12 : 24}>
                <WhoField
                  label={'Хто'}
                  {...commonProps}
                  onCallsignChange={onAbonentFromCallsignChange}
                  onPelengChange={onAbonentFromPelengChange}
                  onAbonentChange={onAbonentFromChange}
                  defaultValue={form.getFieldValue('abonentFrom')}
                  ships={ships}
                  units={units}
                />
              </Col>
            )}
            {field === 'abonentTo' && (
              <Col xs={24} sm={arr.includes('abonentFrom') ? 12 : 24}>
                <WhoField
                  label={'Кого'}
                  {...commonProps}
                  onCallsignChange={onAbonentToCallsignChange}
                  onPelengChange={onAbonentToPelengChange}
                  onAbonentChange={onAbonentToChange}
                  defaultValue={form.getFieldValue('abonentTo')}
                  ships={ships}
                  units={units}
                />
              </Col>
            )}
            {field === 'frequency' && (
              <Col xs={24} sm={8}>
                <FrequencyField
                  label={'Частота'}
                  {...commonProps}
                  onChange={onFrequencyChange}
                  defaultValue={form.getFieldValue('frequency') || null}
                />
              </Col>
            )}
            {field === 'transmissionType' && (
              <Col xs={24} sm={8}>
                <TransmisionTypeField
                  types={transmitionTypes}
                  label={'Вид передачі'}
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
          timeOfDetection: values.timeOfDetection,
          frequency: values.frequency,
          transmissionType: values.transmissionType,
          abonentFrom: values.abonentFrom
            ? {
                abonents: values.abonentFrom.abonents,
                peleng: values.abonentFrom.peleng,
                callsign: values.abonentFrom.callsign,
              }
            : {
                abonents: {
                  ships: [],
                  units: [],
                },
              },
          abonentTo: values.abonentTo
            ? {
                abonents: values.abonentTo.abonents,
                peleng: values.abonentTo.peleng,
                callsign: values.abonentTo.callsign,
              }
            : {
                abonents: {
                  ships: [],
                  units: [],
                },
              },
        };

        await AddDetectionService.createDetection(payload);
      }}>
      <Typography.Title editable level={3} style={{ margin: 0 }}>
        {name}
      </Typography.Title>
      <Row gutter={[4, 4]}>{renderFields()}</Row>

      <Button type="primary" htmlType="submit">
        Зберегти
      </Button>
    </Form>
  );
};
