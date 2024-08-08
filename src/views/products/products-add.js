import React, { useEffect, useMemo, useState } from 'react';
import { steps } from './steps';
import { Card, Steps } from 'antd';
import ProductProperty from './product-property';
import ProductFinish from './product-finish';
import ProductStock from './product-stock';
import ProductExtras from './product-extras';
import ProductsIndex from './products-index';
import LanguageList from 'components/language-list';
import { shallowEqual, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import ProductGallery from './product-gallery';
import ProductDigital from './product-digital';
import Wholesale from './wholesale';

const { Step } = Steps;

const ProductsAdd = () => {
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [current, setCurrent] = useState(activeMenu.data?.step || 0);
  const [newSteps, setNewSteps] = useState(steps);
  const { extras } = activeMenu?.data || {};
  const isDigital = activeMenu?.data?.digital;
  const isTypeColorExists = extras?.some(
    (extra) => extra?.group?.type === 'color',
  );

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

  useEffect(() => {
    if (isDigital) {
      setNewSteps(steps.filter((item) => item.title !== 'product.extras'));
    } else if (isDigital === false) {
      setNewSteps(steps.filter((item) => item.title !== 'product.digital'));
    }
    if (isTypeColorExists) {
      setNewSteps((prev) => prev);
    } else {
      setNewSteps((prev) => prev.filter((item) => item.title !== 'Gallery'));
    }
  }, [isTypeColorExists, isDigital]);

  return (
    <>
      <Card title={t('add.product')} extra={<LanguageList />}>
        <Steps current={current}>
          {newSteps.map((item) => (
            <Step title={t(item.title)} key={item.title} />
          ))}
        </Steps>
      </Card>
      <div className='steps-content'>
        {newSteps[current].content === 'First-content' && (
          <ProductsIndex next={next} />
        )}

        {activeMenu.data?.digital &&
          newSteps[current].content === 'Product-digital' && (
            <ProductDigital next={next} prev={prev} />
          )}

        {!activeMenu.data?.digital &&
          newSteps[current].content === 'Second-content' && (
            <ProductExtras next={next} prev={prev} />
          )}

        {newSteps[current].content === 'Third-content' && (
          <ProductStock next={next} prev={prev} />
        )}

        {newSteps[current].content === 'wholesale-content' && (
          <Wholesale next={next} prev={prev} />
        )}

        {colorItems?.length > 0 &&
          newSteps[current].content === 'Gallery-content' && (
            <ProductGallery next={next} prev={prev} />
          )}

        {newSteps[current].content === 'Fourth-content' && (
          <ProductProperty next={next} prev={prev} />
        )}

        {newSteps[current].content === 'Finish-content' && (
          <ProductFinish prev={prev} />
        )}
      </div>
    </>
  );
};
export default ProductsAdd;
