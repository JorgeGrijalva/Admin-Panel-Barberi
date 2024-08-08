import { Button, Col, Form, Input, Row } from 'antd';
import { useTranslation } from 'react-i18next';

export const TrackingInfo = ({ onSubmit, initialData, isSubmitting }) => {
  const { t } = useTranslation();
  return (
    <Form layout='vertical' initialValues={initialData} onFinish={onSubmit}>
      <Row>
        <Col span={24}>
          <Form.Item
            label={t('tracking.name')}
            name='track_name'
            rules={[{ required: true, message: t('required') }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label={t('tracking.id')}
            name='track_id'
            rules={[{ required: true, message: t('required') }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label={t('tracking.url')}
            name='track_url'
            rules={[{ type: 'url', message: t('should.be.url') }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={7}>
          <Button type='primary' loading={isSubmitting} htmlType='submit'>
            {t('submit')}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
