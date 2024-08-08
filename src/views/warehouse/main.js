import React, { useState } from 'react';
import { Card, Col, Row, Steps } from 'antd';
import AddWarehouse from './warehouse-add';
import { t } from 'i18next';
import WorkingDate from './working-date';
import { useParams } from 'react-router-dom';
import EditWarehouse from './warehouse-edit-new';
const { Step } = Steps;

export const steps = [
  {
    title: 'warehouse',
    content: 'Warehouse',
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
        {/* {steps[current]?.content === 'Warehouse' && !id && (
          <AddWarehouse next={next} />
        )} */}
        {/* {steps[current]?.content === 'Warehouse' && id && (
          <EditWarehouse next={next} />
        )} */}
        {steps[current]?.content === 'Warehouse' && (
          <EditWarehouse next={next} />
        )}
        {steps[current]?.content === 'Working days' && (
          <WorkingDate next={next} prev={prev} />
        )}
      </Col>
    </Row>
  );
};

export default Main;
