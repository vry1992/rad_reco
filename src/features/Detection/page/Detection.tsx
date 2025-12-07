import { Col, Divider, List, Row, Typography } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import type { IDetection, INetwork } from '../../../types/types';
import { debounce } from '../../../utils';
import { useLoginSelectors } from '../../Login/store/slice';
import { FilterForm } from '../components/FilterForm';
import { LastNetworkDetectionPreview } from '../components/LastNetworkDetectionPreview';
import { FILTER_SEARCH_KEY } from '../constants';
import { DetectionsService } from '../services/detections-service';
import classes from './style.module.scss';

export const Detection = () => {
  const [searchParams] = useSearchParams();

  const [myNetworks, setMyNetworks] = useState<INetwork[]>([]);
  const [lastDetecitions, setLastDetections] = useState<IDetection[]>([]);
  const navigate = useNavigate();
  const {
    me: { id },
  } = useLoginSelectors();

  const getMyNetworks = async (userId: string, filter: string = '') => {
    try {
      const { my } = await DetectionsService.getNetworksList(userId, filter);
      const rawLastDetections = await DetectionsService.getLastDetections({
        skip: 0,
        limit: 10,
        userId,
        filter,
      });
      setMyNetworks(my);
      setLastDetections(rawLastDetections);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const filter = searchParams.get(FILTER_SEARCH_KEY) || '';
    if (id) {
      debounce(() => {
        getMyNetworks(id, filter);
      });
    }
  }, [searchParams, id]);

  const onPreviewClick = useCallback((detection: IDetection) => {
    navigate(detection.network.id, { state: detection });
  }, []);

  return (
    <>
      <Row>
        <FilterForm />
      </Row>
      <Divider />
      <Row justify="space-between" gutter={[10, 10]}>
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
                style={{ cursor: 'pointer', textAlign: 'left' }}
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
            dataSource={lastDetecitions}
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
    </>
  );
};
