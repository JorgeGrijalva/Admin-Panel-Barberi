import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Modal, Row, Select } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import shopAdsService from 'services/shop-ads';
import { disableRefetch } from '../../redux/slices/menu';
import { fetchShopAds } from 'redux/slices/shop-ads';
import { toast } from 'react-toastify';

const allStatuses = ['new', 'approved', 'canceled'];

export default function ShopAdsStatusModal({ data, handleCancel, paramsData }) {
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [shopAdData, setShopAdData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingShopAds, setFetchingShopAds] = useState(false);

  useEffect(() => {
    setFetchingShopAds(true);
    shopAdsService
      .getById(data?.id)
      .then((res) => {
        let shopAd = res.data;

        const data = {
          ads_package_id: shopAd?.ads_package_id,
          banner_id: shopAd?.banner_id,
          active: shopAd?.active,
          position_page: shopAd?.position_page,
        };

        setShopAdData(data);
      })
      .catch((error) => toast.error(error.message))
      .finally(() => setFetchingShopAds(false));
  }, [data?.id]);

  const onFinish = (values) => {
    setLoading(true);

    const params = { ...values };

    console.log('shopAdData => ', shopAdData);

    !fetchingShopAds &&
      shopAdsService
        .update(data.id, { ...shopAdData, status: params?.status })
        .then(() => {
          handleCancel();
          dispatch(fetchShopAds(paramsData));
          dispatch(disableRefetch(activeMenu));
        })
        .finally(() => setLoading(false));
  };

  return (
    <Modal
      visible={!!data}
      title={data.title}
      onCancel={handleCancel}
      footer={[
        <Button type='primary' onClick={() => form.submit()} loading={loading}>
          {t('save')}
        </Button>,
        <Button type='default' onClick={handleCancel}>
          {t('cancel')}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={onFinish}
        initialValues={{ status: data.status }}
      >
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              label={t('status')}
              name={'status'}
              rules={[{ required: true, message: t('required') }]}
            >
              <Select>
                {allStatuses.map((item) => (
                  <Select.Option key={item}>{t(item)}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
