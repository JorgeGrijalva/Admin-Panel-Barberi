import React, { useState } from 'react';
import { Upload, Modal, Row, Col, Space, Button, Image, Form } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import MediaUpload from './upload';
import galleryService from 'services/gallery';
import { useTranslation } from 'react-i18next';

const VideoUploaderWithModal = ({
  // form,
  mediaList,
  setMediaList,
  name = 'products',
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [videoPreview, setVideoPreview] = useState(null);
  const [imgPreview, setImgPreview] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [imgPreviewModal, setImgPreviewModal] = useState(false);

  const handlePreview = async ({ file, type }) => {
    if (file.name) {
      if (type === 'video')
        setVideoPreview(
          <video controls src={file.name} width={450} height={450}></video>,
        );
      else
        setVideoPreview(
          <Image src={file.name} width='100%' height={450} alt='preview-img' />,
        );

      setModalVisible(true);
    } else {
      setVideoPreview(null);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const createImage = (file) => {
    return {
      uid: file.title,
      name: file.title,
      status: 'done', // done, uploading, error
      url: file.title,
      created: true,
    };
  };

  const handleUpload = ({ file, onSuccess }) => {
    setImgPreviewModal(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', name);
    galleryService.upload(formData).then(({ data }) => {
      setMediaList((prev) => ({
        ...prev,
        images: [...prev.images, { ...createImage(data), isVideo: true }],
      }));
      onSuccess('ok');
    });
  };

  const handleSave = () => {
    setMediaList((prev) => ({
      ...prev,
      previews: [...prev.previews, ...imgPreview],
    }));
    setImgPreview([]);
    setImgPreviewModal(false);
  };

  const removeImg = (initialIndex) => {
    const nextImages = mediaList.images.filter((item, index) => {
      if (index !== initialIndex) {
        return item;
      }
    });
    const nextPreviews = mediaList.previews.filter((item, index) => {
      if (index !== initialIndex) {
        return item;
      }
    });
    setMediaList({ images: nextImages, previews: nextPreviews });
  };

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Space className='align-items-start'>
          <Upload
            customRequest={handleUpload}
            accept='video/*'
            listType='text'
            className='video-upload'
            multiple={false}
            fileList={[]}
          >
            <div className='media-upload'>
              <PlusOutlined /> <span>{t('upload.video')}</span>
            </div>
          </Upload>
        </Space>
      </Col>
      <Col span={24}>
        {mediaList?.previews?.map((item, index) => {
          return (
            <Space className='uploaded-file' wrap>
              <span
                className='media-item'
                onClick={() =>
                  handlePreview({
                    type: 'img',
                    file: mediaList?.previews[index],
                  })
                }
              >
                {mediaList?.previews[index]?.name}
              </span>
              <span
                className='media-item'
                onClick={() =>
                  handlePreview({
                    type: 'video',
                    file: mediaList?.images[index],
                  })
                }
              >
                {mediaList?.images[index]?.name}
              </span>
              <DeleteOutlined
                className='delete-media-item'
                onClick={() => removeImg(index)}
              />
            </Space>
          );
        })}
      </Col>
      <Modal
        title='Video Preview'
        visible={modalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        {videoPreview}
      </Modal>
      <Modal title='Preview image' visible={imgPreviewModal} footer={null}>
        <Form form={form} onFinish={handleSave} layout='vertical'>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Form.Item
                label={t('preview.image')}
                name='preview-image'
                rules={[
                  {
                    required: !imgPreview?.length,
                    message: t('required'),
                  },
                ]}
              >
                <MediaUpload
                  type={name}
                  imageList={imgPreview}
                  setImageList={setImgPreview}
                  multiple={false}
                  text='upload.image'
                  form={form}
                />
              </Form.Item>
            </Col>
            <Col span={24} className='d-flex justify-content-end'>
              <Button type='primary' onClick={() => form.submit()}>
                {t('save')}
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Row>
  );
};

export default VideoUploaderWithModal;
