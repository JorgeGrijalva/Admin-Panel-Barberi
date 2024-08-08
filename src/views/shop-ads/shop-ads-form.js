import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button, Card, Col, Form, Row, Select, Spin, Switch } from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import shopAdsService from 'services/shop-ads';
import { toast } from 'react-toastify';
import LanguageList from 'components/language-list';
import { DebounceSelect } from 'components/search';
import { setMenuData, removeFromMenu, disableRefetch } from 'redux/slices/menu';
import advertService from 'services/advert';

const ShopAdsForm = ({ id }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);

  const [loading, setLoading] = useState(false);
  const [isFetching, setFetching] = useState(false);
  const [ads_package_id, setAdsPackageId] = useState(null);

  const allStatuses = ['new', 'approved', 'canceled'];

  const onFinish = (values) => {
    const params = {
      ...values,
      banner_id: values?.banner_id?.value,
      active: Number(values?.active),
      ads_package_id: ads_package_id,
    };
    shopAdsUpdate(params);
  };

  const shopAdsUpdate = (params) => {
    setLoading(true);
    const nextUrl = 'catalog/shop-ads';
    shopAdsService
      .update(id, params)
      .then(() => {
        navigate(`/${nextUrl}`);
        toast.success(t('successfully.updated'));
        dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
      })
      .finally(() => setLoading(false));
  };

  async function fetchAdsPackage(search) {
    const params = {
      search,
      perPage: 10,
      active: 1,
    };
    return advertService
      .getAll(params)
      .then((res) => formatDataSelect(res.data));
  }

  function formatDataSelect(data) {
    return data.map((item) => ({
      label: item?.translation.title,
      value: item.id,
      self: item,
      key: item.id,
    }));
  }

  const getShopAds = (alias) => {
    setFetching(true);
    shopAdsService
      .getById(alias)
      .then((res) => {
        setFetching(false);
        const shopAd = res.data;
        const ads_package = shopAd?.ads_package;

        setAdsPackageId(shopAd.ads_package_id);

        const data = {
          ...shopAd,
          ads_package_id: {
            label: ads_package?.translation?.title,
            value: ads_package?.id,
            key: ads_package?.id,
          },
          status: shopAd?.status,
          active: shopAd?.active,
        };

        form.setFieldsValue(data);
        dispatch(setMenuData({ activeMenu, data }));
      })
      .finally(() => {});
  };

  useEffect(() => {
    if (!!id) {
      getShopAds(id);
    }
  }, [id]);

  useEffect(() => {
    if (activeMenu.refetch) {
      getShopAds(id);
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  if (isFetching) {
    return (
      <Card title={t('edit.ad')}>
        <div className='d-flex justify-content-center align-items-center'>
          <Spin size='large' className='py-5' />
        </div>
      </Card>
    );
  }

  return (
    <Form
      layout='vertical'
      form={form}
      initialValues={{ active: true, ...activeMenu?.data }}
      onFinish={onFinish}
    >
      <Card
        title={!!id ? t('edit.shop.ads') : t('add.shop.ads')}
        extra={<LanguageList />}
      >
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              label={t('ads.package')}
              name={'ads_package_id'}
              rules={[
                {
                  required: true,
                  message: t('required'),
                },
              ]}
            >
              <DebounceSelect
                fetchOptions={fetchAdsPackage}
                debounceTimeout={200}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('status')}
              name={'status'}
              rules={[{ required: true, message: t('required') }]}
            >
              <Select>
                {allStatuses.map((item) => (
                  <Select.Option key={item}>{t(item)}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={t('active')}
              name='active'
              valuePropName='checked'
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>
      </Card>
      <Button type='primary' htmlType='submit' loading={loading}>
        {t('submit')}
      </Button>
    </Form>
  );
};

export default ShopAdsForm;
