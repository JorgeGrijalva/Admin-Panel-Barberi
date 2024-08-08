import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Card, Form } from 'antd';
import { batch, shallowEqual, useDispatch, useSelector } from 'react-redux';
import { removeFromMenu, setMenuData } from '../../redux/slices/menu';
import { fetchBanners } from '../../redux/slices/banner';
import bannerService from '../../services/banner';
import { useTranslation } from 'react-i18next';
import getTranslationFields from '../../helpers/getTranslationFields';
import LanguageList from '../../components/language-list';
import BannerForm from './banner-form';

const BannerAdd = () => {
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { languages } = useSelector((state) => state.formLang, shallowEqual);

  useEffect(() => {
    return () => {
      const data = form.getFieldsValue(true);
      dispatch(setMenuData({ activeMenu, data }));
    };
  }, []);

  const onFinish = (values, image, mediaList) => {
    const videos = mediaList.images.map((item) => item.name);
    const previews = mediaList.previews.map((item) => item.name);
    const body = {
      products: values.products?.map((i) => i.value),
      images: [...videos, ...image.map((image) => image.name)],
      previews,
      clickable: true,
      title: getTranslationFields(languages, values, 'title'),
      description: getTranslationFields(languages, values, 'description'),
    };
    const nextUrl = 'banners';

    return bannerService.create(body).then(() => {
      toast.success(t('successfully.created'));
      batch(() => {
        dispatch(removeFromMenu({ ...activeMenu, nextUrl }));
        dispatch(fetchBanners({}));
      });
      navigate(`/${nextUrl}`);
    });
  };

  return (
    <>
      <Card title={t('add.banner')} extra={<LanguageList />} />
      <BannerForm form={form} handleSubmit={onFinish} />
    </>
  );
};

export default BannerAdd;
