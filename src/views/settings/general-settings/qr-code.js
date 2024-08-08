import { Button, Card, Col, Form, Input, Modal, Radio, Row } from 'antd';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { shallowEqual } from 'react-redux';
import { toast } from 'react-toastify';
import { setMenuData } from '../../../redux/slices/menu';
import settingService from '../../../services/settings';
import { fetchSettings as getSettings } from '../../../redux/slices/globalSettings';
import { QrCodeCard } from 'components/qr-code-card';
import '../../../assets/scss/components/radio-card.scss';
import { ExclamationCircleFilled } from '@ant-design/icons';

const { confirm } = Modal;
const qrCodeTypes = [
  {
    title: 'View 1',
    value: 'w1',
    img: '/img/qr-code-type1.png',
  },
  {
    title: 'View 2',
    value: 'w2',
    img: '/img/qr-code-type2.png',
  },
  {
    title: 'View 3',
    value: 'w3',
    img: '/img/qr-code-type3.png',
  },
];

const QrCode = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const dispatch = useDispatch();
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [value, setValue] = useState(
    activeMenu.data?.qrcode_type || qrCodeTypes[0].value
  );

  const showConfirm = (type) => {
    confirm({
      title: t('do_you_want_to_change_qrcode_type'),
      centered: true,
      icon: <ExclamationCircleFilled />,
      onOk() {
        setValue(type);
      },
    });
  };

  useEffect(() => {
    return () => {
      const data = form.getFieldsValue(true);
      dispatch(setMenuData({ activeMenu, data }));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateSettings(data) {
    setLoadingBtn(true);
    settingService
      .update(data)
      .then(() => {
        toast.success(t('successfully.updated'));
        dispatch(getSettings());
      })
      .finally(() => setLoadingBtn(false));
  }

  const onFinish = (values) =>
    updateSettings({ ...values, qrcode_type: value });

  return (
    <Form
      layout='vertical'
      form={form}
      name='global-settings'
      onFinish={onFinish}
      initialValues={{
        ...activeMenu.data,
      }}
    >
      <Card title={t('qrcode')}>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              label={t('qrcode.base.url')}
              name='qrcode_base_url'
              rules={[
                {
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject(new Error(t('required')));
                    } else if (value && value?.trim() === '') {
                      return Promise.reject(new Error(t('no.empty.space')));
                    } else if (value?.length < 2) {
                      return Promise.reject(new Error(t('must.be.at.least.2')));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24} style={{ marginBottom: '20px' }}>
            <Form.Item label={t('qrcode.type')}>
              <Radio.Group value={value} className='cards-container'>
                {qrCodeTypes.map((type) => (
                  <Radio
                    onClick={() => showConfirm(type.value)}
                    value={type.value}
                    className='qr-radio-input-card-container'
                  >
                    <QrCodeCard
                      title={type.title}
                      checked={value === type.value}
                      imgPath={type.img}
                    />
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Button
          type='primary'
          onClick={() => form.submit()}
          loading={loadingBtn}
        >
          {t('save')}
        </Button>
      </Card>
    </Form>
  );
};

export default QrCode;
