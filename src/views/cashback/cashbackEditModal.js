import React, { useEffect, useState } from 'react';
import { Button, Col, Form, InputNumber, Modal, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import pointService from '../../services/points';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { setRefetch } from '../../redux/slices/menu';
import Loading from '../../components/loading';
import shopService from '../../services/restaurant';
import { DebounceSelect } from '../../components/search';

export default function CashbackEditModal({ visibility: id, handleCancel }) {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);

  useEffect(() => {
    setLoading(true);
    pointService
      .getById(id)
      .then(({ data }) => {
        const body = {
          ...data,
          shop_id: {
            label: data?.shop?.translation?.title,
            value: data?.shop?.id,
          },
        };
        form.setFieldsValue(body);
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function fetchShops(search) {
    const params = { search, status: 'approved' };
    return shopService.getAll(params).then(({ data }) =>
      data.map((item) => ({
        label: item.translation?.title,
        value: item.id,
      }))
    );
  }

  const onFinish = (values) => {
    setLoadingBtn(true);
    const payload = {
      ...values,
      type: 'percent',
      shop_id: values.shop_id.value,
    };
    pointService
      .update(id, payload)
      .then(() => {
        handleCancel();
        dispatch(setRefetch(activeMenu));
      })
      .finally(() => setLoadingBtn(false));
  };

  return (
    <Modal
      visible={!!id}
      title={t('edit.cashback')}
      onCancel={handleCancel}
      footer={[
        <Button
          key='save-cashback'
          type='primary'
          onClick={() => form.submit()}
          loading={loadingBtn}
        >
          {t('save')}
        </Button>,
        <Button key='cancel-cashback' type='default' onClick={handleCancel}>
          {t('cancel')}
        </Button>,
      ]}
    >
      {!loading ? (
        <Form form={form} layout='vertical' onFinish={onFinish}>
          <Row gutter={12}>
            <Col span={24}>
              <Form.Item
                label={t('shop/restaurant')}
                name='shop_id'
                rules={[
                  {
                    required: true,
                    message: t('required'),
                  },
                ]}
              >
                <DebounceSelect
                  placeholder={t('select.shop')}
                  fetchOptions={fetchShops}
                  style={{ minWidth: 150 }}
                  allowClear={false}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={t('cashback')}
                name='price'
                rules={[
                  {
                    required: true,
                    message: t('required'),
                  },
                ]}
              >
                <InputNumber min={0} className='w-100' addonAfter='%' />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={t('min.amount')}
                name='value'
                rules={[
                  {
                    required: true,
                    message: t('required'),
                  },
                ]}
              >
                <InputNumber min={0} className='w-100' />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      ) : (
        <Loading />
      )}
    </Modal>
  );
}
