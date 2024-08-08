import { useState } from 'react';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Modal, Form, Button, Row, Col, InputNumber } from 'antd';
import categoryService from '../../services/category';
import { disableRefetch } from 'redux/slices/menu';
import { fetchShopCategories } from 'redux/slices/shopCategory';

export default function ShopCategoryPositionModal({
  paramsData,
  handleCancel,
  data,
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    const params = { ...values };
    categoryService
      .updatePosition(data.uuid, params)
      .then(() => {
        handleCancel();
        dispatch(fetchShopCategories(paramsData));
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
        initialValues={{ input: data.input }}
        onFinish={onFinish}
      >
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              label={t('position')}
              name='input'
              rules={[
                { required: true, message: t('required') },
                {
                  type: 'number',
                  min: 0,
                  max: 32767,
                  message: t('must.be.between.0.and.32767'),
                },
              ]}
            >
              <InputNumber className='w-100' />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
