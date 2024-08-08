import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Divider, Space, Button, Card } from 'antd';
import { useTranslation } from 'react-i18next';
import MediaUpload from 'components/upload';
import VideoUploaderWithModal from 'components/video-uploader';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { disableRefetch } from 'redux/slices/menu';
import { useQueryParams } from 'helpers/useQueryParams';
import shopGalleryService from 'services/shop-gallery';

const ShopGallery = ({ next, prev }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const queryParams = useQueryParams();

  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);

  const shop_id = activeMenu.data?.id;

  const [loading, setLoading] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState({ images: [], previews: [] });

  const createImages = (items) => {
    return items
      ?.filter((item) => !item?.preview)
      ?.map((item) => ({
        uid: item.id,
        name: item.path,
        url: item.path,
      }));
  };

  const createMediaFile = (items) => {
    const mediaObject = { images: [], previews: [] };

    const previews = items
      ?.filter((item) => !!item?.preview)
      ?.map((item) => ({
        uid: item.id,
        name: item.preview,
        url: item.preview,
      }));

    const videos = items
      ?.filter((item) => !!item?.preview)
      ?.map((item) => ({
        uid: item.id,
        name: item.path,
        url: item.path,
      }));

    mediaObject.previews = previews;
    mediaObject.images = videos;

    return mediaObject;
  };

  const fetchShopGallery = () => {
    setLoading(true);

    shopGalleryService
      .getAll({ shop_id })
      .then((res) => {
        const galleries = res?.data?.flatMap((item) => item?.galleries) || [];

        setImages(createImages(galleries));
        setVideos(createMediaFile(galleries));
      })
      .finally(() => {
        setLoading(false);
        dispatch(disableRefetch(activeMenu));
      });
  };

  useEffect(() => {
    fetchShopGallery();
  }, [queryParams.values?.step]);

  useEffect(() => {
    if (activeMenu.refetch) {
      fetchShopGallery();
    }
  }, [activeMenu.refetch]);

  const onFinish = () => {
    setLoadingBtn(true);

    const body = {
      images: [...videos?.images, ...images].map((item) => item.name),
      previews: videos?.previews?.map((item) => item.name),
      active: 1,
      shop_id,
    };

    shopGalleryService
      .create(body)
      .then(() => next())
      .finally(() => setLoading(false));
  };

  return (
    <Card loading={loading}>
      <Form form={form} onFinish={onFinish} layout='vertical'>
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              label={t('images')}
              name='images'
              // rules={[
              //   {
              //     required: !images?.length,
              //     message: t('required'),
              //   },
              // ]}
            >
              <MediaUpload
                title={t('upload.image')}
                imageList={images}
                setImageList={setImages}
                form={form}
                multiple={true}
                type='shops'
              />
            </Form.Item>
          </Col>
        </Row>
        <Divider />
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              label={t('videos')}
              name='videos'
              // rules={[
              //   {
              //     required: !videos?.length,
              //     message: t('required'),
              //   },
              // ]}
            >
              <VideoUploaderWithModal
                mediaList={videos}
                setMediaList={setVideos}
              />
            </Form.Item>
          </Col>
        </Row>
        <Space className='mt-4'>
          <Button type='primary' htmlType='submit' loading={!!loadingBtn}>
            {t('next')}
          </Button>
          <Button onClick={prev}>{t('prev')}</Button>
        </Space>
      </Form>
    </Card>
  );
};

export default ShopGallery;
