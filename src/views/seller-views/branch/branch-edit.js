import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  disableRefetch,
  removeFromMenu,
  setMenuData,
} from '../../../redux/slices/menu';
import { useTranslation } from 'react-i18next';
import LanguageList from '../../../components/language-list';
import getTranslationFields from '../../../helpers/getTranslationFields';
import Map from '../../../components/map';
import branchService from '../../../services/seller/branch';
import { fetchBranch } from '../../../redux/slices/branch';
import getDefaultLocation from '../../../helpers/getDefaultLocation';
import { usePlacesWidget } from 'react-google-autocomplete';
import { MAP_API_KEY } from '../../../configs/app-global';

const SellerBranchEdit = () => {
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const { settings } = useSelector(
    (state) => state.globalSettings,
    shallowEqual
  );
  const { google_map_key } = useSelector(
    (state) => state.globalSettings.settings,
    shallowEqual
  );
  const [location, setLocation] = useState(getDefaultLocation(settings));
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const { languages, defaultLang } = useSelector(
    (state) => state.formLang,
    shallowEqual
  );

  useEffect(() => {
    return () => {
      const data = form.getFieldsValue(true);
      data.open_time = JSON.stringify(data?.open_time);
      data.close_time = JSON.stringify(data?.close_time);
      dispatch(setMenuData({ activeMenu, data }));
    };
  }, []);

  function getLanguageFields(data) {
    if (!data) {
      return {};
    }
    const { translations } = data;
    const result = languages.map((item) => ({
      [`title[${item.locale}]`]: translations.find(
        (el) => el.locale === item.locale
      )?.title,
    }));
    return Object.assign({}, ...result);
  }

  const getBranch = (id) => {
    setLoading(true);
    branchService
      .getById(id)
      .then((res) => {
        let branch = res.data;
        setLocation({
          lat: Number(branch?.location.latitude),
          lng: Number(branch?.location.longitude),
        });
        form.setFieldsValue({
          ...branch,
          ...getLanguageFields(branch),
          address: branch.address?.address,
        });
      })
      .finally(() => {
        dispatch(disableRefetch(activeMenu));
        setLoading(false);
      });
  };

  const onFinish = (values) => {
    const body = {
      title: getTranslationFields(languages, values, 'title'),
      address: {
        address: values.address,
        office: null,
        house: null,
        floor: null,
      },
      location: {
        longitude: location.lng,
        latitude: location.lat,
      },
    };
    setLoadingBtn(true);
    const nextUrl = 'seller/branch';
    branchService
      .update(id, body)
      .then(() => {
        toast.success(t('successfully.created'));
        dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
        navigate(`/${nextUrl}`);
        dispatch(fetchBranch());
      })
      .finally(() => setLoadingBtn(false));
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      getBranch(id);
    }
  }, [activeMenu.refetch]);

  const { ref } = usePlacesWidget({
    apiKey: google_map_key || MAP_API_KEY,
    onPlaceSelected: (place) => {
      const location = {
        lat: place?.geometry.location.lat(),
        lng: place?.geometry.location.lng(),
      };
      setLocation(location);
      form.setFieldsValue({
        [`address[${defaultLang}]`]: place?.formatted_address,
      });
    },
  });

  return (
    <Card
      loading={loading}
      title={t('edit.branch')}
      className='h-100'
      extra={<LanguageList />}
    >
      <Form
        name='branch-add'
        layout='vertical'
        onFinish={onFinish}
        form={form}
        initialValues={{ ...activeMenu.data }}
        className='d-flex flex-column h-100'
      >
        <Row gutter={12}>
          <Col span={12}>
            {languages.map((item, idx) => (
              <Form.Item
                key={'title' + idx}
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
              label={t('address')}
              name={`address`}
              rules={[
                {
                  required: true,
                  message: t('required'),
                },
              ]}
            >
              <input className='address-input' ref={ref} placeholder={''} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Map
              location={location}
              setLocation={setLocation}
              setAddress={(value) => form.setFieldsValue({ address: value })}
            />
          </Col>
        </Row>
        <div className='flex-grow-1 d-flex flex-column justify-content-end'>
          <div className='pb-5'>
            <Button type='primary' htmlType='submit' loading={loadingBtn}>
              {t('submit')}
            </Button>
          </div>
        </div>
      </Form>
    </Card>
  );
};

export default SellerBranchEdit;
