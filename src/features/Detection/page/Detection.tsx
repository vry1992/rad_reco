import { Col, List, Row, Typography } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import type { IDetection } from '../../../types/types';
import { useLoginSelectors } from '../../Login/store/slice';
import { LastNetworkDetectionPreview } from '../components/LastNetworkDetectionPreview';
import { DetectionsService } from '../services/detections-service';
import type { MyNetworksResponse } from '../types';
import classes from './style.module.scss';

export const Detection = () => {
  const [myNetworks, setMyNetworks] = useState<MyNetworksResponse>([]);
  const navigate = useNavigate();
  const {
    me: { id },
  } = useLoginSelectors();

  const lastDetections = myNetworks.map(({ detections }) => detections).flat();

  const getMyNetworks = async () => {
    try {
      const data = await DetectionsService.getMyNetworks(id!);
      setMyNetworks(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    id && getMyNetworks();
  }, [id]);

  const onPreviewClick = useCallback((detection: IDetection) => {
    navigate(detection.network.id, { state: detection });
  }, []);

  return (
    <Row justify="space-between" style={{ height: '100%' }} gutter={[10, 10]}>
      <Col xs={24} sm={10}>
        <List
          size="large"
          header={
            <Typography.Title className={classes.title} level={3}>
              Мої мережі
            </Typography.Title>
          }
          bordered
          dataSource={myNetworks}
          renderItem={({ id, name }) => (
            <List.Item
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(id)}>
              {name}
            </List.Item>
          )}
        />
      </Col>

      <Col xs={24} sm={14}>
        <List
          size="large"
          header={
            <Typography.Title className={classes.title} level={3}>
              Останні виявлені
            </Typography.Title>
          }
          bordered
          dataSource={lastDetections}
          renderItem={(detection) => {
            return (
              <List.Item
                key={detection.id}
                className={classes.listItem}
                onClick={() => onPreviewClick(detection)}>
                <LastNetworkDetectionPreview detection={detection} />
              </List.Item>
            );
          }}
        />
      </Col>
    </Row>
  );
};
