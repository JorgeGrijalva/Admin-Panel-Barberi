import { Form, Row, Col, Button, Card, Select, Input, InputNumber } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useState } from 'react';
import { batch, shallowEqual, useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { DebounceSelect } from 'components/search';
import servicesService from 'services/services';
import shopService from 'services/shop';
import LanguageList from 'components/language-list';
import { SketchPicker } from 'react-color';
import getTranslationFields from 'helpers/getTranslationFields';
import { fetchMemberShip } from 'redux/slices/membership';
import { removeFromMenu } from 'redux/slices/menu';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const timeOptions = [
  '1 day',
  '3 days',
  '7 days',
  '14 days',
  '1 month',
  '2 month',
  '3 month',
  '4 month',
  '5 month',
  '6 month',
  '8 month',
  '18 months',
  '1 year',
  '2 years',
  '5 years',
];

const sessionsOptions = [
  {
    label: 'limited',
    value: 1,
    key: 1,
  },
  {
    label: 'unlimited',
    value: 2,
    key: 2,
  },
];

const MembershipForm = ({ form, handleSubmit }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { paramsData } = useLocation();
  const { id } = useParams();
  const { defaultLang, languages } = useSelector(
    (state) => state.formLang,
    shallowEqual,
  );
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [selectedShop, setSelectedShop] = useState(activeMenu.data?.shop || []);
  const [selectedSessions, setSelectedSessions] = useState(
    activeMenu.data?.sessions || sessionsOptions[1].value || 0,
  );
  const [color, setColor] = useState(activeMenu.data?.color || '');
  const [loadingBtn, setLoadingBtn] = useState(false);

  const fetchServices = (search) => {
    const paramsData = {
      page: 1,
      perPage: 20,
      shop_id: selectedShop?.value,
      search,
    };
    if (!search?.trim()?.length) delete paramsData.search;

    return servicesService.getAll(paramsData).then((res) =>
      res.data.map((item) => ({
        label: item?.translation?.title,
        value: item?.id,
        key: item?.id,
      })),
    );
  };

  const fetchShops = (search) => {
    const paramsData = {
      page: 1,
      perPage: 20,
      status: 'approved',
      search,
    };
    if (!search?.trim()?.length) delete paramsData.search;

    return shopService.getAll(paramsData).then((res) =>
      res.data.map((item) => ({
        label: item?.translation?.title,
        value: item?.id,
        key: item?.id,
      })),
    );
  };
  const onFinish = (values) => {
    const body = {
      shop_id: values?.shop?.value,
      // color: values?.color?.hex || values?.color,
      price: values?.price,
      time: values?.time,
      sessions: values?.sessions?.value || values?.sessions,
      sessions_count: values?.sessions_count,
      title: getTranslationFields(languages, values, 'title'),
      description: getTranslationFields(languages, values, 'description'),
      term: getTranslationFields(languages, values, 'term'),
      services: values?.services?.map((i) => ({ service_id: i.value })),
    };
    if (body?.sessions === 2) delete body?.sessions_count;

    handleSubmit(body)
      .then(() => {
        const nextUrl = 'membership';
        batch(() => {
          dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
          dispatch(fetchMemberShip(paramsData));
        });
        navigate(`/${nextUrl}`);
      })
      .final(() => setLoadingBtn(false));
  };

  return (
    <Card
      title={id ? t('edit.membership') : t('add.membership')}
      extra={<LanguageList />}
    >
      <Form
        form={form}
        onFinish={onFinish}
        layout='vertical'
        initialValues={{ sessions: sessionsOptions[1] }}
      >
        <Row gutter={12}>
          <Col span={24}>
            {languages.map((item) => (
              <Form.Item
                key={'title' + item?.id}
                label={t('title')}
                name={`title[${item?.locale}]`}
                hidden={item?.locale !== defaultLang}
                rules={[
                  {
                    required: item?.locale === defaultLang,
                    message: t('required'),
                  },
                  {
                    validator: (_, value) => {
                      if (value && value?.trim() === '') {
                        return Promise.reject(t('no.empty.space'));
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input maxLength={100} />
              </Form.Item>
            ))}
          </Col>
          <Col span={12}>
            {languages.map((item) => (
              <Form.Item
                key={'description' + item.id}
                label={t('description')}
                name={`description[${item?.locale}]`}
                hidden={item?.locale !== defaultLang}
                rules={[
                  {
                    required: item?.locale === defaultLang,
                    message: t('required'),
                  },
                  {
                    validator: (_, value) => {
                      if (value && value?.trim() === '') {
                        return Promise.reject(t('no.empty.space'));
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <TextArea rows={3} maxLength={300} />
              </Form.Item>
            ))}
          </Col>
          <Col span={12}>
            {languages.map((item) => (
              <Form.Item
                key={'term' + item.id}
                label={t('term')}
                name={`term[${item?.locale}]`}
                hidden={item?.locale !== defaultLang}
                rules={[
                  {
                    required: item?.locale === defaultLang,
                    message: t('required'),
                  },
                  {
                    validator: (_, value) => {
                      if (value && value?.trim() === '') {
                        return Promise.reject(t('no.empty.space'));
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <TextArea rows={3} maxLength={300} />
              </Form.Item>
            ))}
          </Col>
          <Col span={12}>
            <Form.Item
              key={'shop'}
              label={t('shop')}
              name={'shop'}
              rules={[
                {
                  required: true,
                  message: t('required'),
                },
              ]}
            >
              <DebounceSelect
                fetchOptions={fetchShops}
                onSelect={(value) => {
                  setSelectedShop(value);
                  form.setFieldsValue({ services: [] });
                }}
                onClear={() => {
                  setSelectedShop([]);
                  form.setFieldsValue({ services: [] });
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              key={'services'}
              label={t('services')}
              name='services'
              rules={[
                {
                  required: true,
                  message: t('required'),
                },
              ]}
            >
              <DebounceSelect
                allowClear={false}
                fetchOptions={fetchServices}
                mode='multiple'
                refetchOptions={true}
                disabled={!selectedShop?.value}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              key={'price'}
              label={t('price')}
              name='price'
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
          <Col span={12}>
            <Form.Item
              name='time'
              label={t('time')}
              rules={[{ required: true }]}
            >
              <Select>
                {timeOptions.map((item) => (
                  <Select.Option value={item} key={item}>
                    {t(item)}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='sessions'
              label={t('sessions')}
              rules={[
                {
                  required: true,
                  message: t('required'),
                },
              ]}
            >
              <Select onSelect={(value) => setSelectedSessions(value)}>
                {sessionsOptions.map((item) => (
                  <Select.Option value={item.value} key={item.key}>
                    {t(item.label)}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='sessions_count'
              label={t('sessions.count')}
              rules={[
                {
                  required: selectedSessions === sessionsOptions[0].value,
                  message: t('required'),
                },
              ]}
            >
              <InputNumber
                min={0}
                className='w-100'
                disabled={
                  selectedSessions?.value === sessionsOptions[1].value ||
                  selectedSessions === sessionsOptions[1].value
                }
              />
            </Form.Item>
          </Col>
        </Row>
        <Button type='primary' htmlType='submit' loading={loadingBtn}>
          {t('submit')}
        </Button>
      </Form>
    </Card>
  );
};

export default MembershipForm;
