import { FileProtectOutlined, FileUnknownOutlined } from '@ant-design/icons';
import { Button, List, Popconfirm } from 'antd';
import type { FC } from 'react';
import { FIELD_NAME_MAP } from '../../../CreateNetwork/constants';
import classes from './style.module.scss';
import { FieldsEnum } from './types';

type Props = {
  fields: string[];
  onConfirm: (field: string, type: FieldsEnum.REQUIRED | FieldsEnum.ON) => void;
};

export const AddFieldsToDetectionForm: FC<Props> = ({
  fields,
  onConfirm,
}: Props) => {
  return (
    <List
      size="small"
      dataSource={fields}
      renderItem={(item) => {
        return (
          <List.Item>
            <div className={classes.listItem}>
              <b>{FIELD_NAME_MAP[item].label}</b>
              <div className={classes.listButtons}>
                <Popconfirm
                  title={
                    <p>
                      Додати поле як <b>ОБОВ`ЯЗКОВЕ?</b>
                    </p>
                  }
                  onConfirm={() => onConfirm(item, FieldsEnum.REQUIRED)}
                  onCancel={() => {}}
                  okText="Так"
                  cancelText="Ні">
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<FileProtectOutlined />}
                  />
                </Popconfirm>
                <Popconfirm
                  title={
                    <p>
                      Додати як <b>НЕ ОБОВ`ЯЗКОВЕ</b>
                      поле?
                    </p>
                  }
                  onConfirm={() => onConfirm(item, FieldsEnum.ON)}
                  onCancel={() => {}}
                  okText="Так"
                  cancelText="Ні">
                  <Button shape="circle" icon={<FileUnknownOutlined />} />
                </Popconfirm>
              </div>
            </div>
          </List.Item>
        );
      }}
    />
  );
};
