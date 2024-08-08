import React, { useState } from 'react';
import { steps } from './steps';
import { Card, Steps } from 'antd';
import AddonFinish from './addons-finish';
import AddonStock from './addons-stock';
import AddonIndex from './addons-index';
import LanguageList from '../../../components/language-list';
import { shallowEqual, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const { Step } = Steps;

const SellerAddonAdd = () => {
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
    <Card title={t('addon.add')} extra={<LanguageList />}>
      <Steps current={current}>
        {steps.map((item) => (
          <Step title={t(item.title)} key={item.title} />
        ))}
      </Steps>
      <div className='steps-content'>
        {steps[current].content === 'First-content' && (
          <AddonIndex next={next} />
        )}

        {steps[current].content === 'Third-content' && (
          <AddonStock next={next} prev={prev} />
        )}

        {steps[current].content === 'Finish-content' && (
          <AddonFinish prev={prev} />
        )}
      </div>
    </Card>
  );
};
export default SellerAddonAdd;
