import { Row } from 'antd';
import { useLoginSelectors } from '../../Login/store/slice';
import { CreateNetworkForm } from '../components/CreateNetworkForm';

export const CreateNetwork = () => {
  const {
    me: { id },
  } = useLoginSelectors();
  return (
    <Row justify="space-between" style={{ height: '100%' }} gutter={[10, 10]}>
      <CreateNetworkForm userId={id!} />
      {/* <Col xs={24} sm={24}>
      </Col> */}
    </Row>
  );
};
