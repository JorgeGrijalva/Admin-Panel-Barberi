import React, { useEffect, useState } from 'react';
import { steps } from './steps';
import { Card, Spin, Steps } from 'antd';
import ProductProperty from './product-property';
import ProductFinish from './product-finish';
import ProductStock from './product-stock';
import ProductExtras from './product-extras';
import ProductsIndex from './products-index';
import LanguageList from '../../../components/language-list';
import { useParams } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  removeFromMenu,
  disableRefetch,
  setMenuData,
} from '../../../redux/slices/menu';
import { useTranslation } from 'react-i18next';
import { useQueryParams } from '../../../helpers/useQueryParams';
import requestModelsService from 'services/seller/request-models';

const { Step } = Steps;

const SellerProductRequestEdit = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const queryParams = useQueryParams();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const dispatch = useDispatch();

  const current = Number(queryParams.values?.step || 0);
  const [loading, setLoading] = useState(activeMenu.refetch);
  const next = () => {
    const step = current + 1;
    queryParams.set('step', step);
  };
  const prev = () => {
    const step = current - 1;
    queryParams.set('step', step);
  };

  function fetchProductRequest(alias) {
    setLoading(true);
    requestModelsService
      .getById(alias)
      .then((res) => {
        let request = res.data.data;

        dispatch(
          setMenuData({
            activeMenu,
            data: {
              ...request,
              request_id: res.data.id,
              actualStocks: res.data.model?.stocks,
              model_id: res.data.model?.id,
              model: res.data.model
            },
          })
        );
      })
      .finally(() => {
        setLoading(false);
        dispatch(disableRefetch(activeMenu));
      });
  }

  useEffect(() => {
    if (activeMenu.refetch) {
      fetchProductRequest(id);
    }
  }, [activeMenu.refetch]);

  const onChange = (step) => {
    dispatch(setMenuData({ activeMenu, data: { ...activeMenu.data, step } }));
    queryParams.set('step', step);
  };

  useEffect(() => {
    return () => {
      const nextUrl = 'seller/products';
      dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
    };
  }, []);

  return (
    <>
      <Card title={t('edit.food')} extra={<LanguageList />}>
        <Steps current={current} onChange={onChange}>
          {steps.map((item) => (
            <Step title={t(item.title)} key={item.title} />
          ))}
        </Steps>
      </Card>
      {!loading ? (
        <div className=''>
          {steps[current].content === 'First-content' && (
            <ProductsIndex isRequest next={next} action_type={'edit'} />
          )}

          {steps[current].content === 'Second-content' && (
            <ProductExtras isRequest next={next} prev={prev} />
          )}

          {steps[current].content === 'Third-content' && (
            <ProductStock isRequest next={next} prev={prev} />
          )}

          {steps[current].content === 'Fourth-content' && (
            <ProductProperty isRequest next={next} prev={prev} />
          )}

          {steps[current].content === 'Finish-content' && (
            <ProductFinish isRequest prev={prev} />
          )}
        </div>
      ) : (
        <div className='d-flex justify-content-center align-items-center'>
          <Spin size='large' className='py-5' />
        </div>
      )}
    </>
  );
};
export default SellerProductRequestEdit;
