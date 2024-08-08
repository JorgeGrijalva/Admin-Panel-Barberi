import React, { useState } from 'react';
import {
  Row,
  Col,
  Form,
  Space,
  Button,
  Input,
  InputNumber,
  DatePicker,
  Select,
} from 'antd';
import { useSelector, shallowEqual, useDispatch, batch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import MediaUpload from 'components/upload';
import moment from 'moment/moment';
import { toast } from 'react-toastify';
import { removeFromMenu } from 'redux/slices/menu';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchSellerMasterInvitations } from 'redux/slices/invitations';
import { useParams } from 'react-router-dom';

const UserForm = ({ form, handleSubmit }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { uuid } = useParams();

  const { myShop } = useSelector((state) => state.myShop, shallowEqual);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);

  const [loadingBtn, setLoadingBtn] = useState(false);
  const [image, setImage] = useState(
    activeMenu.data?.img?.length ? [{ name: activeMenu.data?.img }] : [],
  );
  const [error, setError] = useState(null);

  const onFinish = (values) => {
    const body = {
      ...values,
      birthday: moment(values.birthday).format('YYYY-MM-DD'),
      images: [image?.[0]?.name],
      shop_id: [myShop?.id],
      role: 'master',
    };
    const nextUrl = 'seller/invitations/masters';

    setLoadingBtn(true);

    handleSubmit(body)
      .then(() => {
        toast.success(t('successfully.created'));
        batch(() => {
          dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
          dispatch(fetchSellerMasterInvitations(state?.paramsData));
        });
        navigate(`/${nextUrl}`);
      })
      .catch((err) => setError(err.response.data.params))
      .finally(() => setLoadingBtn(false));
  };

  return (
    <Form form={form} layout='vertical' onFinish={onFinish}>
      <Row gutter={12}>
        <Col span={24}>
          <Form.Item
            name='avatar'
            label={t('images')}
            rules={[
              {
                required: !image?.length,
                message: t('required'),
              },
            ]}
          >
            <MediaUpload
              type={'users'}
              imageList={image}
              setImageList={setImage}
              form={form}
              multiple={false}
              name='logo_img'
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={t('firstname')}
            name='firstname'
            help={error?.firstname?.[0]}
            validateStatus={error?.firstname ? 'error' : 'success'}
            rules={[
              {
                required: true,
                message: t('required'),
              },
            ]}
          >
            <Input className='w-100' maxLength={20} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={t('lastname')}
            name='lastname'
            help={error?.lastname?.[0]}
            validateStatus={error?.lastname ? 'error' : 'success'}
            rules={[
              {
                required: true,
                message: t('required'),
              },
            ]}
          >
            <Input className='w-100' maxLength={20} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={t('phone')}
            name='phone'
            help={error?.phone?.[0]}
            validateStatus={error?.phone ? 'error' : 'success'}
            rules={[{ required: true, message: t('required') }]}
          >
            <InputNumber min={0} className='w-100' />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={t('birthday')}
            name='birthday'
            rules={[{ required: true, message: t('required') }]}
          >
            <DatePicker
              className='w-100'
              disabledDate={(current) => moment().add(-18, 'years') <= current}
              defaultPickerValue={moment().add(-18, 'years')}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={t('gender')}
            name='gender'
            rules={[{ required: true, message: t('required') }]}
          >
            <Select picker='dayTime' className='w-100'>
              <Select.Option value='male' key='male'>
                {t('male')}
              </Select.Option>
              <Select.Option value='female' key='female'>
                {t('female')}
              </Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={t('email')}
            name='email'
            help={error?.email?.[0]}
            validateStatus={error?.email ? 'error' : 'success'}
            rules={[
              { required: true, message: t('required') },
              { type: 'email', message: t('invalid.email') },
            ]}
          >
            <Input type='email' className='w-100' />
          </Form.Item>
        </Col>
        {!uuid && (
          <>
            <Col span={12}>
              <Form.Item
                label={t('password')}
                name='password'
                help={error?.password ? error.password[0] : null}
                validateStatus={error?.password ? 'error' : 'success'}
                rules={[{ required: true, message: t('required') }]}
              >
                <Input.Password
                  type='password'
                  className='w-100'
                  placeholder='********'
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t('password.confirmation')}
                help={
                  error?.password_confirmation
                    ? error.password_confirmation[0]
                    : null
                }
                validateStatus={
                  error?.password_confirmation ? 'error' : 'success'
                }
                name='password_confirmation'
                dependencies={['password']}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: t('required'),
                  },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(t('two.passwords.dont.match'));
                    },
                  }),
                ]}
              >
                <Input.Password type='password' placeholder='********' />
              </Form.Item>
            </Col>
          </>
        )}
      </Row>
      <Space wrap>
        <Button type='primary' htmlType='submit' loading={loadingBtn}>
          {t('submit')}
        </Button>
      </Space>
    </Form>
  );
};

export default UserForm;
