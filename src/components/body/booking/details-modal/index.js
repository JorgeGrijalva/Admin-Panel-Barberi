import { Row, Col } from 'antd';
import MasterDescriptions from './master';
import ClientDescriptions from './client';
import ShopDescription from './shop';
import TransactionDescriptions from './transaction';

const BookingDetailsBody = ({ data }) => {
  return (
    <Row
      gutter={24}
      style={{
        display: 'flex',
        rowGap: '24px',
        flexWrap: 'wrap',
      }}
    >
      <Col span={12}>
        <ClientDescriptions data={data?.user} />
      </Col>
      <Col span={12}>
        <MasterDescriptions data={data?.master} />
      </Col>
      <Col span={12}>
        <ShopDescription data={data?.shop} />
      </Col>
      <Col span={12}>
        <TransactionDescriptions data={data?.transaction} />
      </Col>
    </Row>
  );
};

export default BookingDetailsBody;
