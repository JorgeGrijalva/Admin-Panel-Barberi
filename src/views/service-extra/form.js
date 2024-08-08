import { Button, Col, Form, Input, InputNumber, Row, Switch } from 'antd';
import { DebounceSelect } from 'components/search';
import React, { useState } from 'react';
import servicesService from 'services/services';
import { useTranslation } from 'react-i18next';
import { batch, shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { removeFromMenu } from 'redux/slices/menu';
import { fetchServiceExtra } from 'redux/slices/service-extra';
import getTranslationFields from 'helpers/getTranslationFields';
import MediaUpload from 'components/upload';

function ServiceExtraForm({ form, onSubmit }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { defaultLang, languages } = useSelector(
    (state) => state.formLang,
    shallowEqual,
  );
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { state } = useLocation();
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [image, setImage] = useState(
    activeMenu.data?.serviceExtrasForm?.img || [],
  );

  const fetchServices = (search = '') => {
    const params = {
      search: !!search?.length ? search : undefined,
      perPage: 10,
      page: 1,
    };

    return servicesService.getAll(params).then((res) =>
      res?.data?.map((item) => ({
        label: item?.translation?.title || t('N/A'),
        value: item?.id,
        key: item?.id,
      })),
    );
  };

  const onFinish = (values) => {
    const body = {
      active: values.active ? 1 : 0,
      service_id: values.service.value,
      title: getTranslationFields(languages, values, 'title'),
      price: values.price || 0,
      img: image?.[0]?.url,
    };
    setLoadingBtn(true);
    onSubmit(body)
      .then(() => {
        const nextUrl = 'service-extra';

        toast.success(t('successfully.created'));
        form.resetFields();

        batch(() => {
          dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
          dispatch(fetchServiceExtra(state?.params));
        });

        navigate(`/${nextUrl}`);
      })
      .finally(() => setLoadingBtn(false));
  };

  return (
    <Form
      form={form}
      layout='vertical'
      onFinish={onFinish}
      initialValues={{ active: true }}
    >
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item
            label={t('service')}
            name='service'
            rules={[{ required: true, message: 'required' }]}
          >
            <DebounceSelect
              fetchOptions={fetchServices}
              refetchOptions={true}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={t('price')}
            name='price'
            rules={[{ required: true }]}
          >
            <InputNumber
              className='w-100'
              addonAfter={
                defaultCurrency?.position === 'after' && defaultCurrency?.symbol
              }
              addonBefore={
                defaultCurrency?.position === 'before' &&
                defaultCurrency?.symbol
              }
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          {languages.map((item, idx) => (
            <Form.Item
              key={'title' + idx}
              label={t('title')}
              name={`title[${item.locale}]`}
              rules={[
                {
                  required: item.locale === defaultLang,
                  message: t('required'),
                },
              ]}
              hidden={item.locale !== defaultLang}
            >
              <Input />
            </Form.Item>
          ))}
        </Col>
        <Col span={6}>
          <Form.Item label={t('image')} name='image'>
            <MediaUpload
              type='service_extras'
              imageList={image}
              setImageList={setImage}
              form={form}
              multiple={false}
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label={t('active')} name='active' valuePropName='checked'>
            <Switch />
          </Form.Item>
        </Col>
      </Row>
      <Button type='primary' htmlType='submit' loading={loadingBtn}>
        {t('submit')}
      </Button>
    </Form>
  );
}

export default ServiceExtraForm;
