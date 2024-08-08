import React, { useState } from 'react';
import { Card, Col, Row, Steps } from 'antd';
import AddDeliveryPoint from './point-add';
import { t } from 'i18next';
import WorkingDate from './working-date';
import { useParams } from 'react-router-dom';
import EditDeliveryPoint from './point-edit';
const { Step } = Steps;

export const steps = [
  {
    title: 'delivery.point',
    content: 'Delivery point',
  },
  {
    title: 'working days',
    content: 'Working days',
  },
];

const Main = () => {
  const [current, setCurrent] = useState(0);
  const { id } = useParams();

  const next = () => {
    const step = current + 1;
    setCurrent(step);
  };
  const prev = () => {
    const step = current - 1;
    setCurrent(step);
  };

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Card className='mb-0'>
          <Steps current={current}>
            {steps.map((item) => (
              <Step title={t(item.title)} key={item.title} />
            ))}
          </Steps>
        </Card>
      </Col>
      <Col span={24}>
        {steps[current]?.content === 'Delivery point' && !id && (
          <AddDeliveryPoint next={next} />
        )}
        {steps[current]?.content === 'Delivery point' && id && (
          <EditDeliveryPoint next={next} />
        )}
        {steps[current]?.content === 'Working days' && (
          <WorkingDate next={next} prev={prev} />
        )}
      </Col>
    </Row>
  );
};

export default Main;
