import { Col, Form, Input, Row, Select, Switch } from 'antd';
import { useTranslation } from 'react-i18next';
import MediaUpload from 'components/upload';
import Map from 'components/map';

const type_of_technique = [
  { label: 'Benzine', value: 'benzine' },
  { label: 'Diesel', value: 'diesel' },
  { label: 'Gas', value: 'gas' },
  { label: 'Motorbike', value: 'motorbike' },
  { label: 'Bike', value: 'bike' },
  { label: 'Foot', value: 'foot' },
  { label: 'Electric', value: 'electric' },
];

const DeliverySetting = ({ location, setLocation, form, image, setImage }) => {
  const { t } = useTranslation();

  return (
    <Row gutter={12}>
      <Col span={12}>
        <Form.Item
          label={t('brand')}
          name='brand'
          rules={[
            {
              required: true,
              message: t('required'),
            },
            {
              validator(_, value) {
                if (value && value?.trim()?.length < 2) {
                  return Promise.reject(new Error(t('must.be.at.least.2')));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder={t('type.here')} maxLength={20} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label={t('model')}
          name='model'
          rules={[
            {
              required: true,
              message: t('required'),
            },
            {
              validator(_, value) {
                if (value && value?.trim()?.length < 2) {
                  return Promise.reject(new Error(t('must.be.at.least.2')));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder={t('type.here')} maxLength={20} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label={t('type.of.technique')}
          name='type_of_technique'
          rules={[
            {
              required: true,
              message: t('required'),
            },
          ]}
        >
          <Select
            options={type_of_technique}
            placeholder={t('select.technique')}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label={t('car.number')}
          name='number'
          rules={[
            {
              required: true,
              message: t('required'),
            },
            {
              validator(_, value) {
                if (value && value?.trim()?.length < 2) {
                  return Promise.reject(new Error(t('must.be.at.least.2')));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder={t('type.here')} maxLength={20} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label={t('car.color')}
          name='color'
          rules={[
            {
              required: true,
              message: t('required'),
            },
            {
              validator(_, value) {
                if (value && value?.trim()?.length < 2) {
                  return Promise.reject(new Error(t('must.be.at.least.2')));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder={t('type.here')} maxLength={20} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label={t('image')}
          name='deliveryman-settings-images'
          rules={[
            {
              required: !image?.length,
              message: t('required'),
            },
          ]}
        >
          <MediaUpload
            type='deliveryman/settings'
            imageList={image}
            setImageList={setImage}
            form={form}
            length='1'
            multiple={true}
          />
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item
          label={t('online')}
          name='online'
          rules={[{ required: true, message: t('required') }]}
          valuePropName='checked'
        >
          <Switch />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item label={t('map')} name='location'>
          <Map location={location} setLocation={setLocation} />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default DeliverySetting;
