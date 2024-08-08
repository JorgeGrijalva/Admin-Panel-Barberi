import React, { useState } from 'react';
import { Tabs, Modal, Image } from 'antd';
import UploadMedia from './upload-media';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import getImage from 'helpers/getImage';
import ImageGallery from '../image-gallery';
import { t } from 'i18next';

const MediaUpload = ({
  imageList = [],
  setImageList,
  form,
  type,
  multiple = true,
  name,
  disabled,
  text = 'upload',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [fileList, setFileList] = useState([]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setLoadingBtn(false);
    setFileList([]);
  };

  const removeImg = (path) => {
    const nextArray = imageList?.filter((item) => item !== path);
    form.setFieldsValue({
      images: nextArray,
    });
    setImageList(nextArray);
  };

  return (
    <>
      <div className='media-upload-wrapper'>
        {imageList
          ?.filter((item) => !item?.isVideo)
          .map((item, idx) => (
            <div
              key={idx}
              className='image-wrapper'
              onClick={() => (disabled ? undefined : removeImg(item))}
            >
              <Image
                preview={false}
                src={getImage(item?.name)}
                className='images'
                alt={'images'}
              />
              <DeleteOutlined color='white' hidden={disabled} />
            </div>
          ))}
        {(multiple || !imageList.length) && (
          <div className='media-upload' onClick={showModal}>
            <PlusOutlined /> <span>{t(text)}</span>
          </div>
        )}
      </div>
      <Modal
        onCancel={handleCancel}
        maskClosable={true}
        visible={isModalOpen}
        footer={false}
        width={'80%'}
      >
        <Tabs>
          <Tabs.TabPane tab='Media files' key='item-1'>
            <UploadMedia
              form={form}
              setImageList={setImageList}
              imageList={imageList}
              setIsModalOpen={setIsModalOpen}
              name={name}
            />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab='Upload media'
            key='item-2'
            className='upload-media'
          >
            <ImageGallery
              type={type}
              form={form}
              setFileList={setImageList}
              fileList={imageList}
              multiple={multiple}
              loadingBtn={loadingBtn}
              setLoadingBtn={setLoadingBtn}
              imageList={fileList}
              setImageList={setFileList}
              handleClose={handleCancel}
            />
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    </>
  );
};
export default MediaUpload;
