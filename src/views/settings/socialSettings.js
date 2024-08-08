import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import settingService from '../../services/settings';
import { toast } from 'react-toastify';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { disableRefetch, setMenuData } from '../../redux/slices/menu';
import { fetchSettings as getSettings } from '../../redux/slices/globalSettings';
import Loading from '../../components/loading';

export default function SocialSettings() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);

  useEffect(() => {
    return () => {
      const data = form.getFieldsValue(true);
      dispatch(setMenuData({ activeMenu, data }));
    };
  }, []);

  const createSettings = (list) => {
    const result = list.map((item) => ({
      [item.key]: item.value,
    }));
    return Object.assign({}, ...result);
  };

  function fetchSettings() {
    setLoading(true);
    settingService
      .get()
      .then((res) => {
        const data = createSettings(res.data);
        form.setFieldsValue(data);
      })
      .finally(() => {
        setLoading(false);
        dispatch(disableRefetch(activeMenu));
      });
  }

  useEffect(() => {
    if (activeMenu.refetch) {
      fetchSettings();
    }
  }, [activeMenu.refetch]);

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

  const onFinish = (values) => {
    updateSettings(values);
  };

  return (
    <Form
      layout='vertical'
      form={form}
      name='global-settings'
      onFinish={onFinish}
      initialValues={{ ...activeMenu.data }}
    >
      {!loading ? (
        <Card
          title={t('social.settings')}
          extra={
            <Button
              type='primary'
              onClick={() => form.submit()}
              loading={loadingBtn}
            >
              {t('save')}
            </Button>
          }
        >
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                label={'Instagram'}
                name='instagram'
                rules={[
                  {
                    required: true,
                    message: t('required'),
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={'Facebook'}
                name='facebook'
                rules={[
                  {
                    required: true,
                    message: t('required'),
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={'Twitter'}
                name='twitter'
                rules={[
                  {
                    required: true,
                    message: t('required'),
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      ) : (
        <Loading />
      )}
    </Form>
  );
}
