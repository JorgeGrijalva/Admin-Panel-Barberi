import React, { useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import LanguageList from '../../components/language-list';
import { useTranslation } from 'react-i18next';
import { Card, Steps } from 'antd';
import RestaurantMain from './main';
import RestaurantDelivery from './restaurantDelivery';
import Map from '../../components/shop/map';

const { Step } = Steps;

export const steps = [
  {
    title: 'restaurant',
    content: 'First-content',
  },
  {
    title: 'map',
    content: 'Second-content',
  },
  {
    title: 'delivery',
    content: 'Third-content',
  },
];

const RestaurantAdd = () => {
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [current, setCurrent] = useState(activeMenu.data?.step || 0);

  const next = () => {
    const step = current + 1;
    setCurrent(step);
  };
  const prev = () => {
    const step = current - 1;
    setCurrent(step);
  };

  return (
    <Card title={t('add.restaurant')} extra={<LanguageList />}>
      <Steps current={current}>
        {steps.map((item) => (
          <Step title={t(item.title)} key={item.title} />
        ))}
      </Steps>

      <div className='steps-content'>
        {steps[current].content === 'First-content' && (
          <RestaurantMain next={next} user={false} />
        )}

        {steps[current].content === 'Second-content' && (
          <Map next={next} prev={prev} />
        )}

        {steps[current].content === 'Third-content' && (
          <RestaurantDelivery next={next} prev={prev} />
        )}
      </div>
    </Card>
  );
};
export default RestaurantAdd;
