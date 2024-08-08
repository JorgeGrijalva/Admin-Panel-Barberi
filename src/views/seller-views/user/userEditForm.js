import React, { useState } from 'react';
import { Button, Col, DatePicker, Form, Input, Row, Select } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import userService from '../../services/user';
import { toast } from 'react-toastify';
import { removeFromMenu } from '../../redux/slices/menu';
import { fetchUsers } from '../../redux/slices/user';
import moment from 'moment';
import ImageUploadSingle from '../../components/image-upload-single';

export default function UserEditForm({ form, data, image, setImage }) {
  const activeMenu = useSelector((list) => list.menu.activeMenu, shallowEqual);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { uuid } = useParams();
  const [date, setDate] = useState();
  const [error, setError] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const changeData = (data, dataText) => setDate(dataText);

  const onFinish = async (values) => {
    setLoadingBtn(true);
    const body = {
      firstname: values.firstname,
      lastname: values.lastname,
      email: values.email,
      phone: values.phone,
      birthday: date,
      gender: values.gender,
      password_confirmation: values.password_confirmation,
      password: values.password,
      images: [image?.name],
    };
    const nextUrl = 'users/user';
    userService
      .update(uuid, body)
      .then(() => {
        toast.success('User updated successfully');
        dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
        navigate(`/${nextUrl}`);
        dispatch(fetchUsers());
      })
      .finally(() => setLoadingBtn(false));
  };

  return (
    <Form
      form={form}
      layout='vertical'
      initialValues={{
        gender: 'male',
        role: 'admin',
        ...data,
        birthday: data?.birthday ? moment(data.birthday) : null,
      }}
      onFinish={onFinish}
      className='px-2'
    >
      <Row gutter={12}>
        <Col span={24}>
          <Form.Item label={'Avatar'}>
            <ImageUploadSingle
              type='users'
              image={image}
              setImage={setImage}
              form={form}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={'firstname'}
            name='firstname'
            help={error?.firstname ? error.firstname[0] : null}
            validateStatus={error?.firstname ? 'error' : 'success'}
            rules={[{ required: true, message: 'Missing user firstname' }]}
            tooltip={'enter_user_firstname'}
          >
            <Input placeholder={'firstname'} className='w-100' />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label={'lastname'}
            name='lastname'
            help={error?.lastname ? error.lastname[0] : null}
            validateStatus={error?.lastname ? 'error' : 'success'}
            rules={[{ required: true, message: 'Missing user lastname' }]}
            tooltip={'enter_user_lastname'}
          >
            <Input placeholder='lastname' className='w-100' />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label='phone'
            name='phone'
            help={error?.phone ? error.phone[0] : null}
            validateStatus={error?.phone ? 'error' : 'success'}
            rules={[{ required: true, message: 'Missing user phone' }]}
            tooltip={'enter_user_phone'}
          >
            <Input placeholder={'phone'} className='w-100' />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label={'birthday'}
            name='birthday'
            rules={[{ required: true, message: 'Missing user birthday' }]}
            tooltip={'enter_user_birthday'}
          >
            <DatePicker onChange={changeData} className='w-100' />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label={'gender'}
            name='gender'
            rules={[{ required: true, message: 'Missing user gender' }]}
            tooltip={'enter_user_gender'}
          >
            <Select picker='dayTime' className='w-100'>
              <Select.Option value='male'>male</Select.Option>
              <Select.Option value='female'>female</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label='email'
            name='email'
            help={error?.email ? error.email[0] : null}
            validateStatus={error?.email ? 'error' : 'success'}
            rules={[{ required: true, message: 'Missing user email' }]}
            tooltip={'enter_user_email'}
          >
            <Input placeholder='email' type='email' className='w-100' />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label='password'
            name='password'
            help={error?.password ? error.password[0] : null}
            validateStatus={error?.password ? 'error' : 'success'}
            rules={[{ required: true, message: 'Missing user email' }]}
            tooltip={'enter_user_password'}
          >
            <Input placeholder='password' type='password' className='w-100' />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label='password confirmation'
            help={
              error?.password_confirmation
                ? error.password_confirmation[0]
                : null
            }
            validateStatus={error?.password_confirmation ? 'error' : 'success'}
            name='password_confirmation'
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    'The two passwords that you entered do not match!',
                  );
                },
              }),
            ]}
            tooltip={'enter_password_confirmation'}
          >
            <Input
              placeholder='password_confirmation'
              type='password'
              className='w-100'
            />
          </Form.Item>
        </Col>

        <Button type='primary' htmlType='submit' loading={loadingBtn}>
          Save
        </Button>
      </Row>
    </Form>
  );
}
