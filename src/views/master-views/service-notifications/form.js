import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { batch, shallowEqual, useDispatch, useSelector } from 'react-redux';
import React, { useState } from 'react';
import { DebounceSelect } from '../../../components/search';
import serviceMasterService from '../../../services/master/serviceMaster';
import { toast } from 'react-toastify';
import { removeFromMenu } from '../../../redux/slices/menu';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { fetchMasterServiceNotifications } from '../../../redux/slices/service-notifications';

const notificationTest = ['day', 'week'];

function ServiceNotificationsForm({ form, onSubmit }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { languages, defaultLang } = useSelector(
    (state) => state.formLang,
    shallowEqual,
  );
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const [loadingBtn, setLoadingBtn] = useState(false);

  function getTranslationFields(values, field = 'title') {
    const list = languages.map((item) => ({
      [item.locale]: values[`${field}[${item.locale}]`],
    }));
    return Object.assign({}, ...list);
  }

  async function fetchServiceMasters(search) {
    const params = {
      search: search.length === 0 ? null : search,
    };
    return serviceMasterService.get(params).then(({ data }) =>
      data.map((item) => ({
        label: item.service?.translation?.title,
        value: item.id,
      })),
    );
  }

  function onFinish(values) {
    setLoadingBtn(true);
    const payload = {
      service_master_id: values.service_master?.value,
      notification_time: values.notification_time,
      notification_type: values.notification_type,
      last_sent_at: moment(values.last_sent_at).format('YYYY-MM-DD HH:mm'),
      title: getTranslationFields(values, 'title'),
    };

    delete payload.service_master;

    const nextUrl = 'master/service-notifications';

    onSubmit(payload)
      .then(() => {
        toast.success('successfully.added');
        batch(() => {
          dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
          dispatch(fetchMasterServiceNotifications({}));
          navigate('/' + nextUrl);
        });
      })
      .finally(() => setLoadingBtn(false));
  }

  return (
    <Form form={form} layout='vertical' onFinish={onFinish}>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            name='service_master'
            label={t('service.master')}
            rules={[{ required: true, message: 'required' }]}
          >
            <DebounceSelect fetchOptions={fetchServiceMasters} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name='notification_type'
            label={t('notification.type')}
            rules={[{ required: true, message: t('required') }]}
          >
            <Select>
              {notificationTest.map((item) => (
                <Select.Option key={item}>{t(item)}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name='notification_time'
            label={t('notification.time')}
            rules={[{ required: true, message: t('required') }]}
          >
            <InputNumber className='w-100' />
          </Form.Item>
        </Col>
        <Col span={12}>
          {languages.map((item) => (
            <Form.Item
              key={'title' + item.locale}
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
        <Col span={12}>
          <Form.Item
            name='last_sent_at'
            label={t('last.sent.at')}
            rules={[{ required: true, message: t('required') }]}
          >
            <DatePicker
              format='YYYY-MM-DD HH:mm'
              className='w-100'
              showTime
              placeholder=''
            />
          </Form.Item>
        </Col>
      </Row>
      <Button loading={loadingBtn} type='primary' htmlType='submit'>
        {t('submit')}
      </Button>
    </Form>
  );
}

export default ServiceNotificationsForm;
