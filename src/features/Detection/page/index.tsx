import { Col, List, Row, Typography } from 'antd';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';
import { MOCK_USER } from '../../../mocks';

export const Detection = () => {
  const navigate = useNavigate();
  const networksList = MOCK_USER.networkCommunication;
  return (
    <Row justify="space-between" style={{ height: '100%' }} gutter={[10, 10]}>
      <Col xs={12} sm={12}>
        <List
          size="large"
          header={<Typography.Title level={3}>Мої мережі</Typography.Title>}
          bordered
          dataSource={networksList}
          renderItem={({ id, name }) => (
            <List.Item
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(id)}>
              {name}
            </List.Item>
          )}
        />
      </Col>

      <Col xs={12} sm={12}>
        <List
          size="large"
          header={
            <Typography.Title level={3}>Останні виявлені</Typography.Title>
          }
          bordered
          dataSource={networksList}
          renderItem={({ detections, name, id }) => {
            return detections.map((detection) => {
              const abFrom = detection.abonentFrom
                ? detection.abonentFrom.objects.map(({ name }) => name)
                : 'н/в';

              const abTo = detection.abonentTo
                ? detection.abonentTo.objects.map(({ name }) => name)
                : 'н/в';

              return (
                <List.Item
                  onClick={() => navigate(id, { state: detection })}
                  style={{ cursor: 'pointer' }}>
                  <List.Item.Meta
                    title={name}
                    description={
                      <>
                        {abFrom} {` => `} {abTo}{' '}
                        {dayjs(detection.timeOfDetection).format(
                          'DD.MM.YYYY HH:mm'
                        )}
                      </>
                    }
                  />
                </List.Item>
              );
            });
          }}
        />
      </Col>
    </Row>
  );
};
