import { CheckCircleOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import type { FC } from 'react';
import type { IDetection } from '../../../../types/types';
import { HorizontalScroll } from '../../../../ui/HorizontalScroll';
import classes from './styles.module.scss';

export const FrequenciesTagList: FC<{
  frequencies: Pick<IDetection, 'frequency'>[];
  value: string;
  onChange: (fr: string) => void;
}> = ({ frequencies, value, onChange }) => {
  return (
    <HorizontalScroll>
      {frequencies.map(({ frequency }) => {
        const selected = value === frequency;

        return (
          <Tag.CheckableTag
            className={classes.checkableTag}
            key={frequency}
            checked={selected}
            onChange={(checked) => {
              if (checked) {
                onChange(frequency);
              }
            }}
            icon={selected ? <CheckCircleOutlined /> : null}>
            {frequency} кГц
          </Tag.CheckableTag>
        );
      })}
    </HorizontalScroll>
  );
};
