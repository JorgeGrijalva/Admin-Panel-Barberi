import { Space, Upload, Button, Row } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import galleryService from 'services/gallery';
import { useTranslation } from 'react-i18next';
// import { toast } from 'react-toastify';

const ImageGallery = ({
  fileList,
  setFileList,
  type,
  form,
  multiple,
  loadingBtn,
  setLoadingBtn,
  imageList,
  setImageList,
  handleClose,
}) => {
  const { t } = useTranslation();

  const createImage = (file) => {
    return {
      uid: file.title,
      name: file.title,
      status: 'done', // done, uploading, error
      url: file.title,
      created: true,
    };
  };

  const handleSave = () => {
    setLoadingBtn(true);
    const formData = new FormData();
    formData.append('type', type);
    imageList.forEach((item, index) => {
      formData.append(`images[${index}]`, item?.originFileObj);
    });
    galleryService
      .storeMany(formData)
      .then(({ data }) => {
        const images = data?.title?.map((item) => createImage({ title: item }));
        setFileList([...fileList, ...images]);
        form.setFieldsValue({
          images: [...fileList, ...images],
        });
        handleClose();
      })
      .finally(() => setLoadingBtn(false));
  };

  const handleChange = ({ fileList }) => {
    setImageList(fileList);
  };
  const handleRemove = (file) => {
    setImageList((prev) => prev.filter((item) => item.uid !== file.uid));
  };

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: 'none',
      }}
      type='button'
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  return (
    <>
      <Upload
        listType='picture-card'
        accept='.png,.jpg,.jpeg,.webp,.avif,jfif'
        onChange={handleChange}
        className='antdImgUpload'
        showUploadList={false}
        onRemove={handleRemove}
        fileList={imageList}
        // beforeUpload={(file) => {
        //   const isItAtLeast2MB = file.size / 1024 / 1024 < 2;
        //   if (!isItAtLeast2MB) {
        //     toast.error(t('max.2.mb'));
        //     return false;
        //   }
        //   return true;
        // }}
        customRequest={() => {}}
        disabled={!multiple && imageList.length > 0}
        multiple={multiple}
      >
        {uploadButton}
      </Upload>
      {imageList?.length > 0 && (
        <Row gutter={12} className='mt-4 media-container'>
          {imageList.map((item) => (
            <div className='item'>
              <span>{item?.name || ''}</span>
              <button
                className='delete-button'
                onClick={() => handleRemove(item)}
              >
                <DeleteOutlined />
              </button>
            </div>
          ))}
        </Row>
      )}
      <Space className='mt-4'>
        <Button
          type='primary'
          onClick={handleSave}
          loading={loadingBtn}
          disabled={!imageList?.length}
        >
          {t('save')}
        </Button>
        <Button onClick={handleClose}>{t('cancel')}</Button>
      </Space>
    </>
  );
};

export default ImageGallery;
