import React from 'react';
import { Button, Col, Form, Modal, Row } from 'antd';
import { DebounceSelect } from 'components/search';
import { useTranslation } from 'react-i18next';
import productService from 'services/seller/product';

const AssignProduct = ({ form, id, onClose, handlePurchase, loading }) => {
  const { t } = useTranslation();
  //functions
  function fetchProductsOptions(search) {
    const params = {
      search,
      perPage: 10,
      status: 'published',
    };
    return productService.getAll(params).then((res) => formatProduct(res.data));
  }

  //helper functions
  function formatProduct(data) {
    return data.map((item) => ({
      label: item?.translation?.title,
      value: item.id,
      key: item.id,
    }));
  }

  //submit form
  const onFinish = (values) => {
    const product_ids = values?.products?.map((item) => item.value);
    handlePurchase({ ads_package_id: id, product_ids });
  };

  return (
    <Modal
      visible={!!id}
      title={t('ad.detail')}
      onCancel={onClose}
      footer={[<Button onClick={onClose}>{t('close')}</Button>]}
    >
      <Form
        name='banner-form'
        layout='vertical'
        onFinish={onFinish}
        form={form}
        initialValues={{ clickable: true }}
        className='d-flex flex-column h-100'
      >
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              label={t('products')}
              name={'products'}
              rules={[{ required: true, message: t('required') }]}
            >
              <DebounceSelect
                mode='multiple'
                fetchOptions={fetchProductsOptions}
                debounceTimeout={200}
              />
            </Form.Item>
          </Col>
        </Row>
        <div className='flex-grow-1 d-flex flex-column justify-content-end'>
          <div className='pb-5'>
            <Button type='primary' htmlType='submit' loading={loading}>
              {t('submit')}
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default AssignProduct;
