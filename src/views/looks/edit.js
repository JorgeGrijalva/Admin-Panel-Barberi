import React, { Fragment, useEffect, useState } from 'react';
import { Form } from 'antd';
import LooksForm from './form';
import getTranslationFields from 'helpers/getTranslationFields';
import looksService from 'services/banner';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import banner from 'services/banner';
import Loading from 'components/loading';
import { disableRefetch, setMenuData } from 'redux/slices/menu';
export default function EditLook() {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { languages } = useSelector((state) => state.formLang, shallowEqual);
  const { id } = useParams();

  const [loading, setLoading] = useState(false);

  const fetchLook = (id) => {
    setLoading(true);

    const params = {
      type: 'look',
    };

    banner
      .getById(id, params)
      .then((res) => {
        const data = res?.data;
        const body = {
          [`title[${data?.translation?.locale}]`]: data?.translation?.title,
          [`description[${data?.translation?.locale}]`]:
            data?.translation?.description,
          shop: {
            label: data?.shop?.translation?.title,
            value: data?.shop?.id,
            key: data?.shop?.id,
          },
          products: data?.products?.map((product) => ({
            label: product?.translation?.title,
            value: product?.id,
            key: product?.id,
          })),
          image: data?.galleries?.map((img) => ({
            uid: img.id,
            name: img.path,
            url: img.path,
          })),
          active: Boolean(data?.active),
        };

        form.setFieldsValue(body);
        dispatch(setMenuData({ activeMenu, data: body }));
      })
      .finally(() => {
        setLoading(false);
        dispatch(disableRefetch(activeMenu));
      });
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      fetchLook(id);
    }
  }, [activeMenu.refetch]);

  const handleSubmit = (values, image) => {
    const body = {
      type: 'look',
      active: Number(values.active),
      shop_id: values.shop.value,
      title: getTranslationFields(languages, values, 'title'),
      description: getTranslationFields(languages, values, 'description'),
      products: values.products.map((i) => i.value),
      images: image.map((image) => image.name),
    };

    return looksService.update(id, body);
  };

  return (
    <Fragment>
      {!loading ? (
        <LooksForm form={form} handleSubmit={handleSubmit} />
      ) : (
        <Loading />
      )}
    </Fragment>
  );
}
