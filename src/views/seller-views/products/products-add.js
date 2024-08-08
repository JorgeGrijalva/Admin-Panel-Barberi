import React, { useMemo, useState } from 'react';
import LanguageList from 'components/language-list';
import { shallowEqual, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Card, Steps } from 'antd';
import { steps } from './steps';
import ProductProperty from './product-property';
import ProductFinish from './product-finish';
import ProductStock from './product-stock';
import ProductExtras from './product-extras';
import ProductsIndex from './products-index';
import ProductGallery from './product-gallery';

const { Step } = Steps;

const SellerProductAdd = () => {
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [current, setCurrent] = useState(activeMenu.data?.step || 0);
  const { extras } = activeMenu?.data || {};

  const filteredExtras = useMemo(
    () => extras?.find((item) => item?.group?.type === 'color'),
    [extras],
  );
  const uniqueData = Array.from(
    new Set(filteredExtras?.values?.map((item) => item.value)),
  ).map((value) => {
    return filteredExtras?.values?.find((item) => item.value === value);
  });
  const colorItems = uniqueData.filter((item) => item.group_type === 'color');

  const next = () => {
    const step = current + 1;
    setCurrent(step);
  };
  const prev = () => {
    const step = current - 1;
    setCurrent(step);
  };

  return (
    <>
      <Card title={t('add.product')} extra={<LanguageList />}>
        <Steps current={current}>
          {steps.map((item) => (
            <Step title={t(item.title)} key={item.title} />
          ))}
        </Steps>
      </Card>
      <div className=''>
        {steps[current].content === 'First-content' && (
          <ProductsIndex next={next} />
        )}

        {steps[current].content === 'Second-content' && (
          <ProductExtras next={next} prev={prev} />
        )}

        {steps[current].content === 'Third-content' && (
          <ProductStock next={next} prev={prev} />
        )}

        {steps[current].content === 'gallery-content' &&
          colorItems.length > 0 && <ProductGallery next={next} prev={prev} />}

        {steps[current].content === 'Fourth-content' && (
          <ProductProperty next={next} prev={prev} />
        )}

        {steps[current].content === 'Finish-content' && (
          <ProductFinish prev={prev} />
        )}
      </div>
    </>
  );
};
export default SellerProductAdd;
