import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Space,
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { disableRefetch, setMenuData } from '../../redux/slices/menu';
import referralService from '../../services/referral';
import { fetchSettings as getSettings } from '../../redux/slices/globalSettings';
import LanguageList from '../../components/language-list';
import MediaUpload from '../../components/upload';

const ReferalSetting = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const dispatch = useDispatch();

  const { settings } = useSelector((state) => state.globalSettings);
  const referral = Number(settings.referral_active);
  const [loading, setLoading] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { defaultLang, languages } = useSelector(
    (state) => state.formLang,
    shallowEqual
  );
  const [image, setImage] = useState(
    activeMenu.data?.logo_img ? [activeMenu.data?.logo_img] : []
  );

  useEffect(() => {
    return () => {
      const data = form.getFieldsValue(true);
      data.expired_at = JSON.stringify(data?.expired_at);
      dispatch(setMenuData({ activeMenu, data: data }));
    };
  }, []);

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
      [`faq[${item.locale}]`]: translations.find(
        (el) => el.locale === item.locale
      )?.faq,
    }));
    return Object.assign({}, ...result);
  }

  function fetchSettings() {
    setLoading(true);
    referralService
      .get()
      .then((res) => {
        const data = res.data[0];
        const result = {
          ...getLanguageFields(data),
          price_from: data.price_from,
          price_to: data.price_to,
          expired_at: data.expired_at ? moment(data.expired_at) : undefined,
          active: data.active,
          image: [createImages(data.img)],
        };
        form.setFieldsValue(result);
        setImage([createImages(data.img)]);
      })
      .finally(() => {
        setLoading(false);
        dispatch(disableRefetch(activeMenu));
      });
  }

  const createImages = (items) => {
    return {
      items,
      uid: items,
      url: items,
      name: items,
    };
  };

  const onFinish = (values) => {
    const data = {
      ...values,
      expired_at: moment(values.expired_at).format('YYYY-MM-DD'),
      img: image[0].name,
    };
    setLoadingBtn(true);

    referralService
      .update(data)
      .then(() => {
        toast.success(t('successfully.updated'));
        dispatch(getSettings());
      })
      .finally(() => setLoadingBtn(false));
  };

  const getInitialTimes = () => {
    if (!activeMenu.data?.expired_at) {
      return {};
    }
    const data = JSON.parse(activeMenu.data?.expired_at);
    return {
      expired_at: moment(data, 'HH:mm:ss'),
    };
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      fetchSettings();
    }
  }, [activeMenu.refetch]);

  return (
    <Card
      title={t('referral.settings')}
      loading={loading}
      extra={
        <Space>
          <LanguageList />
          <Button
            type='primary'
            onClick={() => form.submit()}
            loading={loadingBtn}
            disabled={referral !== 1}
          >
            {t('save')}
          </Button>
        </Space>
      }
    >
      <Form
        layout='vertical'
        initialValues={{
          ...activeMenu.data,
          active: true,
          ...getInitialTimes(),
        }}
        form={form}
        onFinish={onFinish}
        name='referral-settings'
      >
        <Row gutter={24}>
          <Col span={24}>
            {referral !== 1 ? (
              <h3 className='text-center mt-2 mb-4'>
                {t('no.active.referral')}
              </h3>
            ) : null}
          </Col>
          <Col span={12}>
            {languages.map((item, idx) => (
              <Form.Item
                key={'title' + idx}
                label={t('title')}
                name={`title[${item.locale}]`}
                rules={[
                  {
                    validator(_, value) {
                      if (!value && item?.locale === defaultLang) {
                        return Promise.reject(new Error(t('required')));
                      } else if (value && value?.trim() === '') {
                        return Promise.reject(new Error(t('no.empty.space')));
                      } else if (value && value?.trim().length < 2) {
                        return Promise.reject(
                          new Error(t('must.be.at.least.2'))
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
                hidden={item.locale !== defaultLang}
              >
                <Input disabled={referral !== 1} />
              </Form.Item>
            ))}
          </Col>
          <Col span={12}>
            {languages.map((item, idx) => (
              <Form.Item
                key={'description' + idx}
                label={t('description')}
                name={`description[${item.locale}]`}
                rules={[
                  {
                    validator(_, value) {
                      if (!value && item?.locale === defaultLang) {
                        return Promise.reject(new Error(t('required')));
                      } else if (value && value?.trim() === '') {
                        return Promise.reject(new Error(t('no.empty.space')));
                      } else if (value && value?.trim().length < 5) {
                        return Promise.reject(
                          new Error(t('must.be.at.least.5'))
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
                hidden={item.locale !== defaultLang}
              >
                <TextArea rows={3} disabled={referral !== 1} />
              </Form.Item>
            ))}
          </Col>

          <Col span={12}>
            <Form.Item
              name='price_from'
              label={t('sender.price')}
              rules={[
                { required: true, message: t('required') },
                { type: 'number', min: 0, message: t('must.be.positive') },
              ]}
            >
              <InputNumber className='w-100' disabled={referral !== 1} />
            </Form.Item>
          </Col>
          <Col span={12}>
            {languages.map((item, idx) => (
              <Form.Item
                key={'terms' + idx}
                label={t('terms')}
                name={`faq[${item.locale}]`}
                rules={[
                  {
                    validator(_, value) {
                      if (!value && item?.locale === defaultLang) {
                        return Promise.reject(new Error(t('required')));
                      } else if (value && value?.trim() === '') {
                        return Promise.reject(new Error(t('no.empty.space')));
                      } else if (value && value?.trim().length < 2) {
                        return Promise.reject(
                          new Error(t('must.be.at.least.2'))
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
                hidden={item.locale !== defaultLang}
              >
                <TextArea rows={3} disabled={referral !== 1} />
              </Form.Item>
            ))}
          </Col>
          <Col span={12}>
            <Form.Item
              name='price_to'
              label={t('distribution.price')}
              rules={[
                { required: true, message: t('required') },
                { type: 'number', min: 0, message: t('must.be.positive') },
              ]}
            >
              <InputNumber className='w-100' disabled={referral !== 1} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name='expired_at'
              label={t('expired.at')}
              rules={[{ required: true, message: t('required') }]}
            >
              <DatePicker
                className='w-100'
                disabledDate={(current) => moment().add(-1, 'days') >= current}
                disabled={referral !== 1}
              />
            </Form.Item>
          </Col>
          <Col span={12} disabled={referral !== 1}>
            <Form.Item
              label={t('image')}
              disabled={referral !== 1}
              name='images'
              rules={[
                {
                  required: image.length === 0,
                  message: t('required'),
                },
              ]}
            >
              <MediaUpload
                type='referral'
                imageList={image}
                setImageList={setImage}
                form={form}
                multiple={false}
                name='referral'
                disabled={referral !== 1}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default ReferalSetting;
