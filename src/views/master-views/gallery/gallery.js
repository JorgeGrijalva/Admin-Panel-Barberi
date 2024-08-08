import { Button, Card, Col, Divider, Form, Row, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useQueryParams } from '../../../helpers/useQueryParams';
import React, { useEffect, useState } from 'react';
import shopGalleryService from '../../../services/shop-gallery';
import { disableRefetch } from '../../../redux/slices/menu';
import MediaUpload from '../../../components/upload';
import VideoUploaderWithModal from '../../../components/video-uploader';
import masterGalleryService from '../../../services/master/serviceGallery';
import { toast } from 'react-toastify';

function GalleryView() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const queryParams = useQueryParams();

  //

  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);

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

    masterGalleryService
      .getAll()
      .then((res) => {
        const galleries = res?.data?.flatMap((item) => item) || [];

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
    };

    masterGalleryService
      .create(body)
      .then(() => {
        toast.success(t('successfully.created'));
      })
      .finally(() => {
        setLoading(false);
        setLoadingBtn(false);
      });
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
                type='master-galleries'
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
                name='master-galleries'
              />
            </Form.Item>
          </Col>
        </Row>
        <Space className='mt-4'>
          <Button type='primary' htmlType='submit' loading={loadingBtn}>
            {t('submit')}
          </Button>
        </Space>
      </Form>
    </Card>
  );
}

export default GalleryView;
