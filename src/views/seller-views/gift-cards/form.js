import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Switch,
} from 'antd';
import { batch, shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { removeFromMenu } from '../../../redux/slices/menu';
import { sellerFetchLooks } from '../../../redux/slices/looks';
import { useNavigate } from 'react-router-dom';
import { fetchSellerGiftCards } from '../../../redux/slices/gift-cards';

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

function GiftCardForm({ handleSubmit, form }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { defaultLang, languages } = useSelector(
    (state) => state.formLang,
    shallowEqual,
  );
  const { activeMenu } = useSelector((state) => state.menu);

  const [loadingBtn, setLoadingBtn] = useState();

  function handleValidation(value, item = null, length = 2) {
    const condition = !!item ? !value && item?.locale === defaultLang : !value;

    if (condition) {
      return Promise.reject(new Error(t('required')));
    } else if (value && value?.trim() === '') {
      return Promise.reject(new Error(t('no.empty.space')));
    } else if (value && value?.trim().length < length) {
      return Promise.reject(new Error(t(`must.be.at.least.${length}`)));
    }
    return Promise.resolve();
  }

  const onFinish = (values) => {
    setLoadingBtn(true);

    const nextUrl = 'seller/gift-cards';

    handleSubmit(values)
      .then(() => {
        toast.success(t('successfully.added'));
        batch(() => {
          dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
          dispatch(fetchSellerGiftCards());
        });
        navigate(`/${nextUrl}`);
      })
      .finally(() => setLoadingBtn(false));
  };

  return (
    <Form layout='vertical' form={form} onFinish={onFinish}>
      <Row gutter={12}>
        <Col span={12}>
          {languages.map((item) => (
            <Form.Item
              key={'title' + item.id}
              label={t('title')}
              name={`title[${item.locale}]`}
              hidden={item.locale !== defaultLang}
              rules={[
                { validator: (_, value) => handleValidation(value, item) },
              ]}
            >
              <Input />
            </Form.Item>
          ))}
        </Col>
        <Col span={12}>
          <Form.Item
            name='price'
            label={t('price')}
            rules={[{ required: true, message: t('required') }]}
          >
            <InputNumber min={0} className='w-100' />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name='time' label={t('time')} rules={[{ required: true }]}>
            <Select>
              {timeOptions.map((item) => (
                <Select.Option value={item} key={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name='active' valuePropName='checked' label={t('active')}>
            <Switch defaultChecked={true} />
          </Form.Item>
        </Col>
      </Row>
      <Button type='primary' htmlType='submit' loading={loadingBtn}>
        {t('submit')}
      </Button>
    </Form>
  );
}

export default GiftCardForm;
