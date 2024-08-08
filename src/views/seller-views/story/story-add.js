import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Card, Col, Form, Row } from 'antd';
import { batch, shallowEqual, useDispatch, useSelector } from 'react-redux';
import { removeFromMenu, setMenuData } from 'redux/slices/menu';
import productService from 'services/seller/product';
import { DebounceSelect } from 'components/search';
import { useTranslation } from 'react-i18next';
import storeisService from 'services/seller/storeis';
import { fetchStoreis } from 'redux/slices/storeis';
import MediaUpload from 'components/upload';

const StoresAdd = () => {
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { myShop: shop } = useSelector((state) => state.myShop, shallowEqual);

  const [image, setImage] = useState(
    activeMenu.data?.images ? [activeMenu.data?.images[0]] : [],
  );
  const [loadingBtn, setLoadingBtn] = useState(false);

  useEffect(() => {
    return () => {
      const data = form.getFieldsValue(true);
      dispatch(setMenuData({ activeMenu, data }));
    };
  }, []);

  const onFinish = (values) => {
    const body = {
      ...Object.assign(
        {},
        ...image.map((item, index) => ({
          [`file_urls[${index}]`]: item.name,
        })),
      ),
      product_id: values.products.value,
    };

    setLoadingBtn(true);
    const nextUrl = 'seller/stories';
    storeisService
      .create(body)
      .then(() => {
        const data = {
          shop_id: shop.id,
        };
        toast.success(t('successfully.created'));
        batch(() => {
          dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
          dispatch(fetchStoreis(data));
        });
        navigate(`/${nextUrl}`);
      })
      .finally(() => setLoadingBtn(false));
  };

  function fetchProductsStock(search) {
    const data = {
      search,
      shop_id: shop.id,
      status: 'published',
      active: 1,
      rest: 1,
    };
    return productService.getAll(data).then((res) =>
      res.data.map((product) => ({
        label: product.translation.title,
        value: product.id,
      })),
    );
  }

  return (
    <Card title={t('add.story')} className='h-100'>
      <Form
        name='story-add'
        layout='vertical'
        onFinish={onFinish}
        form={form}
        initialValues={{ active: true, ...activeMenu.data }}
        className='d-flex flex-column h-100'
      >
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              label={t('products')}
              name={'products'}
              rules={[
                {
                  required: false,
                  message: t('required'),
                },
              ]}
            >
              <DebounceSelect
                fetchOptions={fetchProductsStock}
                debounceTimeout={200}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('image')}
              name={'image'}
              rules={[
                {
                  required: image.length === 0,
                  message: t('required'),
                },
              ]}
            >
              <MediaUpload
                type='banners'
                imageList={image}
                setImageList={setImage}
                form={form}
                multiple={false}
              />
            </Form.Item>
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

export default StoresAdd;
