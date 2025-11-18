import {
  ConfigProvider,
  DatePicker,
  Form,
  Radio,
  type DatePickerProps,
  type RadioChangeEvent,
} from 'antd';
import ukUA from 'antd/es/locale/uk_UA';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/uk';
import { useEffect, useState } from 'react';
import type { BaseFieldProps } from './DetectionForm';

type TimeOfDetectionInputProps = BaseFieldProps & {
  defaultValue?: string | null;
  showHelpButtons?: boolean;
  onChange: (value: string) => void;
};

const defaultNow = dayjs().set('second', 0).set('millisecond', 0);

export const TimeOfDetectionField = (props: TimeOfDetectionInputProps) => {
  const [now] = useState<Dayjs>(defaultNow);
  const defaultValue =
    props.defaultValue ||
    dayjs().set('second', 0).set('millisecond', 0).toISOString();
  const [value, setValue] = useState<string>(defaultValue);
  const defaultButtonsCount = 5;
  const buttonsConfig = {
    label: (minusMinutes: number) => now.add(minusMinutes * -1, 'minute'),
  };
  const onChange: DatePickerProps['onChange'] = (_, dateStr) => {
    if (typeof dateStr === 'string') {
      setValue(
        dayjs(dateStr).set('second', 0).set('millisecond', 0).toISOString()
      );
    }
  };

  const onSelectTime = (e: RadioChangeEvent) => {
    setValue(
      dayjs(e.target.value).set('second', 0).set('millisecond', 0).toISOString()
    );
  };

  useEffect(() => {
    props.onChange(value);
  }, [value]);

  return (
    <Form.Item
      layout="vertical"
      label={props.label}
      name={props.name}
      rules={[{ required: props.required }]}>
      {props.showHelpButtons && (
        <Radio.Group block onChange={onSelectTime} value={value}>
          <Radio.Button
            value={now.toISOString()}
            checked={now.toISOString() === value}>
            Щойно
          </Radio.Button>
          {new Array(defaultButtonsCount).fill(buttonsConfig).map((b, idx) => {
            const time = b.label(idx);
            return (
              <Radio.Button key={time.toISOString()} value={time.toISOString()}>
                {time.format('HH:mm')}
              </Radio.Button>
            );
          })}
        </Radio.Group>
      )}

      <ConfigProvider locale={ukUA}>
        <DatePicker
          size="large"
          value={value === null ? null : dayjs(value)}
          showTime
          showSecond={false}
          needConfirm={false}
          showNow={false}
          onChange={onChange}
          maxDate={now}
          format="DD.MM.YYYY HH:mm"
          style={{ width: '100%' }}
        />
      </ConfigProvider>
    </Form.Item>
  );
};
