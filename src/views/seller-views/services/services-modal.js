import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Form, Row, Col, Button } from 'antd';
import { DebounceSelect } from 'components/search';
import servicesService from 'services/seller/services';
import { shallowEqual, useSelector } from 'react-redux';
import createImage from 'helpers/createImage';

const ServicesModal = ({ visible, handleClose, handleSubmit }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [servicesData, setServicesData] = useState([]);

  const { languages } = useSelector((state) => state.formLang, shallowEqual);

  const fetchServices = async (search) => {
    const params = {
      search,
      perPage: 10,
      page: 1,
      empty_shop: 1,
    };

    if (!search?.trim().length) delete params.search;

    return await servicesService.getAll(params).then(({ data }) => {
      setServicesData(data);
      return data?.map((item) => ({
        label: item?.translation?.title,
        value: item?.id,
        key: item?.id,
      }));
    });
  };

  function getLanguageFields(data) {
    if (!data) {
      return {};
    }
    const { translations } = data;
    const result = languages.map((item) => ({
      [`title[${item.locale}]`]: translations?.find(
        (el) => el.locale === item.locale,
      )?.title,
      [`description[${item.locale}]`]: translations?.find(
        (el) => el.locale === item.locale,
      )?.description,
    }));
    return Object.assign({}, ...result);
  }

  const onFinish = (values) => {
    if (!values?.service) return handleSubmit();

    const serviceId = values?.service?.value;

    const data = servicesData?.filter((item) => item?.id === serviceId)?.[0];

    const body = {
      ...data,
      ...getLanguageFields(data),
      image: [createImage(data.img)],
      category: {
        label: data?.category?.translation?.title,
        value: data?.category?.id,
        key: data?.category?.id,
      },
    };

    handleSubmit(body);
  };

  return (
    <Modal
      visible={visible}
      title={t('all.services')}
      onCancel={handleClose}
      footer={[
        <Button type='primary' onClick={() => form.submit()}>
          {t('next')}
        </Button>,
        <Button type='default' onClick={handleClose}>
          {t('cancel')}
        </Button>,
      ]}
    >
      <Form form={form} onFinish={onFinish} layout='vertical'>
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item name='service' label={t('services')}>
              <DebounceSelect fetchOptions={fetchServices} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ServicesModal;
