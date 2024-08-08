import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Descriptions, Row, Space, Spin } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { removeFromMenu } from '../../redux/slices/menu';
import { fetchProducts } from '../../redux/slices/product';
import { useTranslation } from 'react-i18next';
import productService from '../../services/product';
import { IMG_URL } from '../../configs/app-global';
import { toast } from 'react-toastify';
import requestAdminModelsService from 'services/request-models';

const ProductFinish = ({ prev, isRequest }) => {
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { defaultLang, languages } = useSelector(
    (state) => state.formLang,
    shallowEqual
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(null);
  const { uuid } = useParams();
  const [isButtonLoading, setButtonLoading] = useState(false);

  function getLanguageFields(data) {
    if (!data?.translations) {
      return {};
    }
    const { translations } = data;
    const result = languages.map((item) => ({
      [`title[${item.locale}]`]: translations.find(
        (el) => el.locale === item.locale
      )?.title,
      [`description[${item.locale}]`]: translations.find(
        (el) => el.locale === item.locale
      )?.description,
    }));
    return Object.assign({}, ...result);
  }

  function fetchProduct(uuid) {
    setLoading(true);
    productService
      .getById(uuid)
      .then((res) => {
        const data = {
          ...res.data,
          ...getLanguageFields(res.data),
          properties: res.data.properties.map((item, index) => ({
            id: index,
            [`key[${item.locale}]`]: item.key,
            [`value[${item.locale}]`]: item.value,
          })),
          translation: undefined,
          translations: undefined,
        };
        setData(data);
      })
      .finally(() => setLoading(false));
  }

  function finish() {
    const body = {
      status: undefined,
    };
    const nextUrl = 'catalog/products';
    if (isRequest && activeMenu.data) {
      setButtonLoading(true);
      const requestBody = {
        id: activeMenu.data.model_id,
        type: 'product',
        data: activeMenu.data,
      };
      requestAdminModelsService
        .requestChangeUpdate(activeMenu.data.request_id, requestBody)
        .then(() => {
          navigate(`/${nextUrl}`, { state: { tab: 'request' } });
          toast.success(t('successfully.updated'));
          dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
        })
        .finally(() => {
          setButtonLoading(false);
        });
      return;
    }
    dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
    dispatch(fetchProducts(body));
    navigate(`/${nextUrl}`);
  }

  useEffect(() => {
    if (!isRequest) {
      fetchProduct(uuid);
    }
  }, [isRequest]);

  const changedInfo = activeMenu.data;
  const originalInfo = isRequest ? activeMenu.data.model : data;
  return !loading ? (
    <Card>
      {isRequest && (
        <>
          <Descriptions bordered title={t('changed.info')}>
            <Descriptions.Item
              label={`${t('title')} (${defaultLang})`}
              span={3}
            >
              {changedInfo[`title[${defaultLang}]`]}
            </Descriptions.Item>
            <Descriptions.Item
              label={`${t('description')} (${defaultLang})`}
              span={3}
            >
              {changedInfo[`description[${defaultLang}]`]}
            </Descriptions.Item>
            <Descriptions.Item label={t('shop')} span={1.5}>
              {changedInfo?.shop?.translation.title}
            </Descriptions.Item>
            <Descriptions.Item label={t('category')} span={1.5}>
              {changedInfo?.category?.label}
            </Descriptions.Item>
            <Descriptions.Item label={t('brand')} span={1.5}>
              {changedInfo?.brand?.label}
            </Descriptions.Item>
            <Descriptions.Item label={t('unit')} span={1.5}>
              {changedInfo?.unit?.label}
            </Descriptions.Item>
            <Descriptions.Item label={t('images')} span={3}>
              <Row gutter={12}>
                {changedInfo?.images
                  ?.filter((item) => !item.isVideo)
                  .map((item, idx) => (
                    <Col key={'image' + idx}>
                      <img width={80} alt='product' src={item.url} />
                    </Col>
                  ))}
              </Row>
            </Descriptions.Item>
            <Descriptions.Item label={t('tax')}>
              {changedInfo?.tax || 0}
            </Descriptions.Item>
            <Descriptions.Item label={t('min.quantity')}>
              {changedInfo?.min_qty}
            </Descriptions.Item>
            <Descriptions.Item label={t('max.quantity')}>
              {changedInfo?.max_qty}
            </Descriptions.Item>
          </Descriptions>
          {changedInfo?.stocks.map((item, idx) => {
            if (!item) {
              return '';
            }
            return (
              <Descriptions key={'desc' + idx} bordered className='mt-4'>
                <Descriptions.Item label={t('price')} span={2}>
                  {item.price}
                </Descriptions.Item>
                <Descriptions.Item label={t('quantity')} span={2}>
                  {item.quantity}
                </Descriptions.Item>
                {item?.ids?.map((extra, idx) => (
                  <Descriptions.Item
                    key={'extra' + idx}
                    label={changedInfo?.extras[idx].label}
                  >
                    {extra?.label}
                  </Descriptions.Item>
                ))}
              </Descriptions>
            );
          })}
        </>
      )}
      <Descriptions bordered className='mt-4' title={t('original.info')}>
        <Descriptions.Item
          label={`${t('title')} (${defaultLang})`}
          span={3}
          column={3}
        >
          {originalInfo.translation?.title ||
            originalInfo[`title[${defaultLang}]`]}
        </Descriptions.Item>
        <Descriptions.Item
          label={`${t('description')} (${defaultLang})`}
          span={3}
          column={3}
        >
          {originalInfo?.translation?.description ||
            originalInfo[`description[${defaultLang}]`]}
        </Descriptions.Item>
        <Descriptions.Item label={t('shop')} span={1.5} column={1.5}>
          {originalInfo.shop?.translation.title}
        </Descriptions.Item>
        <Descriptions.Item label={t('category')} span={1.5} column={1.5}>
          {originalInfo.category?.translation.title}
        </Descriptions.Item>
        <Descriptions.Item label={t('brand')} span={1.5} column={1.5}>
          {originalInfo.brand?.title}
        </Descriptions.Item>
        <Descriptions.Item label={t('unit')} span={1.5} column={1.5}>
          {originalInfo.unit?.translation.title}
        </Descriptions.Item>
        <Descriptions.Item label={t('images')} span={3} column={3}>
          <Row gutter={12}>
            {originalInfo?.galleries
              ?.filter((item) => !item.preview)
              .map((item, idx) => (
                <Col key={'image' + idx}>
                  <img width={80} alt='product' src={IMG_URL + item.path} />
                </Col>
              ))}
          </Row>
        </Descriptions.Item>
        <Descriptions.Item span={3} column={3} label={t('tax')}>
          {originalInfo.tax || 0}
        </Descriptions.Item>
        <Descriptions.Item span={3} column={3} label={t('min.quantity')}>
          {originalInfo.min_qty}
        </Descriptions.Item>
        <Descriptions.Item span={3} column={3} label={t('max.quantity')}>
          {originalInfo.max_qty}
        </Descriptions.Item>
      </Descriptions>
      {originalInfo.stocks?.map((item, idx) => {
        if (!item) {
          return '';
        }
        return (
          <Descriptions key={'desc' + idx} bordered className='mt-4'>
            <Descriptions.Item label={t('price')} span={2} column={2}>
              {item.price}
            </Descriptions.Item>
            <Descriptions.Item label={t('quantity')} span={2} column={2}>
              {item.quantity}
            </Descriptions.Item>
            {item.extras.map((extra, idx) => (
              <Descriptions.Item
                key={'extra' + idx}
                label={extra?.group?.translation?.title}
                span={2}
                column={2}
              >
                {extra?.value?.value}
              </Descriptions.Item>
            ))}
          </Descriptions>
        );
      })}
      <div className='d-flex justify-content-end mt-4'>
        <Space>
          <Button onClick={prev}>{t('prev')}</Button>
          <Button loading={isButtonLoading} type='primary' onClick={finish}>
            {t('finish')}
          </Button>
        </Space>
      </div>
    </Card>
  ) : (
    <div className='d-flex justify-content-center align-items-center'>
      <Spin size='large' className='py-5' />
    </div>
  );
};

export default ProductFinish;
