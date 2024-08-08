import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { disableRefetch } from 'redux/slices/menu';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Button, Card, Col, Descriptions, Row, Space, Spin, Alert } from 'antd';
import { IMG_URL } from '../../configs/app-global';
import { removeFromMenu } from '../../redux/slices/menu';
import { fetchRequestModels } from 'redux/slices/request-models';
import requestAdminModelsService from 'services/request-models';
import ProductRequestModal from './product-request-modal';

const body = {
  type: 'product',
};

const ProductRequestDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { id } = useParams();
  const { activeMenu } = useSelector((state) => state.menu);
  const { defaultLang } = useSelector((state) => state.formLang, shallowEqual);

  const [loading, setLoading] = useState(false);
  const [isButtonLoading, setButtonLoading] = useState(false);
  const [data, setData] = useState({});
  const [model, setModel] = useState({});
  const [statusNote, setStatusNote] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  function fetchProductRequest(alias) {
    setLoading(true);
    requestAdminModelsService
      .getById(alias)
      .then((res) => {
        setData(res.data.data);
        setModel(res.data.model);
        setStatusNote(res.data?.status_note);
      })
      .finally(() => {
        setLoading(false);
        dispatch(disableRefetch(activeMenu));
      });
  }

  function handleStatusUpdate(params) {
    setButtonLoading(true);

    const nextUrl = 'catalog/products';

    requestAdminModelsService
      .changeStatus(id, params)
      .then(() => {
        navigate(`/${nextUrl}`, { state: { tab: 'request' } });
        dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
        toast.success(t('successfully.changed'));
        dispatch(fetchRequestModels(body));
      })
      .finally(() => {
        setModalVisible(false);
        setButtonLoading(false);
      });
  }

  useEffect(() => {
    fetchProductRequest(id);
  }, [id]);

  const changedInfo = data;
  const originalInfo = model;

  return !loading ? (
    <>
      <Card>
        <Descriptions bordered title={t('changed.info')}>
          <Descriptions.Item label={`${t('title')} (${defaultLang})`} span={3}>
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
              {changedInfo?.images?.map((item, idx) => (
                <Col key={'image' + idx}>
                  <img width={80} alt='product' src={item.url} />
                </Col>
              ))}
            </Row>
          </Descriptions.Item>
          <Descriptions.Item label={t('tax')}>
            {changedInfo?.tax}
          </Descriptions.Item>
          <Descriptions.Item label={t('min.quantity')}>
            {changedInfo?.min_qty}
          </Descriptions.Item>
          <Descriptions.Item label={t('max.quantity')}>
            {changedInfo?.max_qty}
          </Descriptions.Item>
        </Descriptions>

        {changedInfo?.stocks?.map((item, idx) => {
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

        <Descriptions bordered className='mt-4' title={t('original.info')}>
          <Descriptions.Item
            label={`${t('title')} (${defaultLang})`}
            span={3}
            column={3}
          >
            {originalInfo?.translation?.title}
          </Descriptions.Item>
          <Descriptions.Item
            label={`${t('description')} (${defaultLang})`}
            span={3}
            column={3}
          >
            {originalInfo?.translation?.description}
          </Descriptions.Item>
          <Descriptions.Item label={t('shop')} span={1.5} column={1.5}>
            {originalInfo?.shop?.translation.title}
          </Descriptions.Item>
          <Descriptions.Item label={t('category')} span={1.5} column={1.5}>
            {originalInfo?.category?.translation.title}
          </Descriptions.Item>
          <Descriptions.Item label={t('brand')} span={1.5} column={1.5}>
            {originalInfo?.brand?.title}
          </Descriptions.Item>
          <Descriptions.Item label={t('unit')} span={1.5} column={1.5}>
            {originalInfo?.unit?.translation.title}
          </Descriptions.Item>
          <Descriptions.Item label={t('images')} span={3} column={3}>
            <Row gutter={12}>
              {originalInfo?.galleries?.map((item, idx) => (
                <Col key={'image' + idx}>
                  <img width={80} alt='product' src={IMG_URL + item.path} />
                </Col>
              ))}
            </Row>
          </Descriptions.Item>
          <Descriptions.Item span={3} column={3} label={t('tax')}>
            {originalInfo?.tax}
          </Descriptions.Item>
          <Descriptions.Item span={3} column={3} label={t('min.quantity')}>
            {originalInfo?.min_qty}
          </Descriptions.Item>
          <Descriptions.Item span={3} column={3} label={t('max.quantity')}>
            {originalInfo?.max_qty}
          </Descriptions.Item>
        </Descriptions>
        {originalInfo?.stocks?.map((item, idx) => {
          if (!item) {
            return '';
          }
          return (
            <Descriptions key={'desc' + idx} bordered className='mt-4'>
              <Descriptions.Item label={t('price')} span={2} column={2}>
                {item?.price}
              </Descriptions.Item>
              <Descriptions.Item label={t('quantity')} span={2} column={2}>
                {item?.quantity}
              </Descriptions.Item>
              {item?.extras?.map((extra, idx) => (
                <Descriptions.Item
                  key={'extra' + idx}
                  label={extra?.group?.translation?.title}
                  span={2}
                  column={2}
                >
                  {extra?.value}
                </Descriptions.Item>
              ))}
            </Descriptions>
          );
        })}
        {statusNote && (
          <Alert
            className='mt-4'
            message={t('status.note')}
            description={statusNote}
            type='error'
          />
        )}

        <div className='d-flex justify-content-end mt-4'>
          <Space>
            <Button
              type='primary'
              onClick={() => {
                handleStatusUpdate({ status: 'approved' });
              }}
            >
              {t('accept')}
            </Button>
            <Button
              type='primary'
              danger
              onClick={() => {
                setModalVisible(true);
              }}
            >
              {t('decline')}
            </Button>
          </Space>
        </div>
      </Card>

      <ProductRequestModal
        data={{ title: 'decline' }}
        visible={modalVisible}
        handleCancel={() => setModalVisible(false)}
        handleOk={handleStatusUpdate}
        laoding={isButtonLoading}
      />
    </>
  ) : (
    <div className='d-flex justify-content-center align-items-center'>
      <Spin size='large' className='py-5' />
    </div>
  );
};

export default ProductRequestDetail;
