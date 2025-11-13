import { Form } from 'antd';

import { Button, Col, Row, Typography } from 'antd';
import 'dayjs/locale/uk';
import { Fragment, useCallback, useEffect, type FC } from 'react';
import { useLocation } from 'react-router';
import type { TShip } from '../../../../types/types';
import { FIELD_NAME_MAP } from '../../constants';
import { FrequencyField } from './FrequencyField';
import { TimeOfDetectionField } from './TimeOfDetectionField';
import { TransmisionTypeField } from './TransmissionTypeField';
import { WhoField } from './WhoField';

type Props = {
  fields: string[];
  requiredFields: string[];
};

export type DetectionFormValues = {
  timeOfDetection?: string;
  timeFrom?: string;
  timeTo?: string;
  abonentFrom?: {
    abonents: TShip[];
    peleng?: string;
    callsign?: string;
  };
  abonentTo?: {
    abonents: TShip[];
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

export const DetectionForm: FC<Props> = ({ fields, requiredFields }) => {
  const { state } = useLocation();
  const [form] = Form.useForm<DetectionFormValues>();

  useEffect(() => {
    if (state) {
      const abFrom = state.abonentFrom;
      const abTo = state.abonentTo;

      form.setFieldValue('frequency', state.frequency);

      if (abFrom) {
        form.setFieldValue('abonentFrom', {
          abonents: abFrom.objects,
          peleng: abFrom.peleng,
          callsign: abFrom.callsign,
        });
      }
      if (abTo) {
        form.setFieldValue('abonentTo', {
          abonents: abTo.objects,
          peleng: abTo.peleng,
          callsign: abTo.callsign,
        });
      }
    }
  }, [state, form]);

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

  const onpelengChange = (value: string | null) => {
    form.setFieldValue('abonentFrom', {
      ...form.getFieldValue('abonentFrom'),
      callsign: value,
    });
  };

  const onAbonentToPelengChange = (value: string | null) => {
    form.setFieldValue('abonentTo', {
      ...form.getFieldValue('abonentTo'),
      callsign: value,
    });
  };

  const onAbonentToChange = (value: TShip[]) => {
    form.setFieldValue('abonentTo', {
      ...form.getFieldValue('abonentTo'),
      abonents: value,
    });
  };

  const onAbonentFromChange = (value: TShip[]) => {
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
          FIELD_NAME_MAP[fieldA].groupOrder - FIELD_NAME_MAP[fieldB].groupOrder
        );
      })
      .map((field, _, arr) => {
        const commonProps = {
          name: field as DetectionFormFieldName,
          required: requiredFields.includes(field),
          defaultValue: state
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
                  onPelengChange={onpelengChange}
                  onAbonentChange={onAbonentFromChange}
                  defaultValue={form.getFieldValue('abonentFrom')}
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
                <TransmisionTypeField label={'Вид передачі'} {...commonProps} />
              </Col>
            )}
          </Fragment>
        );
      });
  }, [requiredFields, fields]);

  return (
    <Form form={form} labelAlign="left">
      <Typography.Title editable level={3} style={{ margin: 0 }}>
        Назва радіомережі
      </Typography.Title>
      <Row gutter={[4, 4]}>{renderFields()}</Row>

      <Button
        type="primary"
        onClick={async () => {
          console.log(form.getFieldsValue());
        }}>
        Зберегти
      </Button>
    </Form>
  );
};
