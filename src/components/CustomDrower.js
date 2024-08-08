import { Button, Col, Drawer, Form, Row, Select, Space } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { shallowEqual, useSelector } from 'react-redux';

const CustomDrower = ({ handleClose, openDrower, setMenuData }) => {
  const { t } = useTranslation();
  const { direction } = useSelector((state) => state.theme.theme, shallowEqual);
  const { languages } = useSelector((state) => state.formLang, shallowEqual);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);

  const onFinish = (values) => {
    const data = activeMenu.data;
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...data, filter: values },
      })
    );
    handleClose();
  };

  const handleClear = () => {
    const data = activeMenu.data;
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...data, filter: undefined },
      })
    );
    handleClose();
  };

  return (
    <Drawer
      title={t('filter')}
      placement={direction === 'rtl' ? 'left' : 'right'}
      closable={true}
      onClose={handleClose}
      visible={openDrower}
      key={'left'}
      footer={
        <Row gutter={12}>
          <Col span={12}>
            <Button
              className='w-100'
              type='primary'
              onClick={() => form.submit()}
            >
              {t('result')}
            </Button>
          </Col>
          <Col span={12}>
            <Button className='w-100' onClick={() => handleClear()}>
              {t('clear')}
            </Button>
          </Col>
        </Row>
      }
    >
      <Form
        form={form}
        name='basic'
        layout='vertical'
        onFinish={onFinish}
        initialValues={{
          ...activeMenu.data?.filter,
        }}
      >
        <Form.Item
          label={t('language')}
          rules={[{ required: true, message: t('required') }]}
          name='equal'
        >
          <Select>
            <Select.Option value={'equal'}>{t('equal')}</Select.Option>
            <Select.Option value={'not_equal'}>{t('not.equal')}</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label={t('locale')}
          rules={[{ required: true, message: t('required') }]}
          name='lang'
        >
          <Select>
            {languages.map((item, idx) => (
              <Select.Option key={item.locale + idx} value={item.locale}>
                {item.title}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default CustomDrower;
