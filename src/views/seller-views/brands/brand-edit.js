import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Form, Input, Row, Spin, Switch } from 'antd';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  disableRefetch,
  removeFromMenu,
  setMenuData,
} from '../../../redux/slices/menu';
import { IMG_URL } from '../../../configs/app-global';
import { useTranslation } from 'react-i18next';
import brandService from '../../../services/seller/brands';
import { sellerfetchBrands } from '../../../redux/slices/brand';
import MediaUpload from '../../../components/upload';

const SellerBrandEdit = () => {
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { id } = useParams();
  const dispatch = useDispatch();
  const { params } = useSelector((state) => state.brand, shallowEqual);

  const [image, setImage] = useState(
    activeMenu.data?.image ? [activeMenu.data?.image] : [],
  );
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);

  useEffect(() => {
    return () => {
      const data = form.getFieldsValue(true);
      dispatch(setMenuData({ activeMenu, data }));
    };
  }, []);

  const createImage = (name) => {
    return {
      name,
      url: IMG_URL + name,
    };
  };

  const fetchBrand = (id) => {
    setLoading(true);
    brandService
      .getById(id)
      .then((res) => {
        let brand = res.data;
        form.setFieldsValue({
          ...brand,
          image: [createImage(brand.img)],
        });
        setImage([createImage(brand.img)]);
      })
      .finally(() => {
        setLoading(false);
        dispatch(disableRefetch(activeMenu));
      });
  };

  const onFinish = (values) => {
    const body = {
      ...values,
      active: values.active ? 1 : 0,
      'images[0]': image[0]?.name,
    };
    setLoadingBtn(true);
    const paramsData = {
      ...params,
    };
    const nextUrl = 'seller/brands';
    brandService
      .update(id, body)
      .then(() => {
        toast.success(t('successfully.updated'));
        dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
        navigate(`/${nextUrl}`);
        dispatch(sellerfetchBrands(paramsData));
      })
      .finally(() => setLoadingBtn(false));
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      fetchBrand(id);
    }
  }, [activeMenu.refetch]);

  return (
    <Card title={t('edit.brand')}>
      {!loading ? (
        <Form
          name='basic'
          layout='vertical'
          onFinish={onFinish}
          form={form}
          initialValues={{ ...activeMenu.data }}
        >
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                label={t('title')}
                name={'title'}
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

            <Col span={6}>
              <Form.Item
                label={t('image')}
                name='images'
                rules={[
                  {
                    validator() {
                      if (image.length === 0) {
                        return Promise.reject(new Error(t('required')));
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <MediaUpload
                  type='brands'
                  imageList={image}
                  setImageList={setImage}
                  form={form}
                  multiple={false}
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <div className='col-md-12 col-sm-6'>
                <Form.Item
                  label={t('active')}
                  name='active'
                  valuePropName='checked'
                >
                  <Switch />
                </Form.Item>
              </div>
            </Col>
          </Row>
          <Button type='primary' htmlType='submit' loading={loadingBtn}>
            {t('submit')}
          </Button>
        </Form>
      ) : (
        <div className='d-flex justify-content-center align-items-center'>
          <Spin size='large' className='py-5' />
        </div>
      )}
    </Card>
  );
};
export default SellerBrandEdit;
