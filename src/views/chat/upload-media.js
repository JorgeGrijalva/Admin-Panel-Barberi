import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Modal } from 'antd';
import galleryService from '../../services/gallery';
import Loading from '../../components/loading';

const UploadMedia = ({
  modal,
  url,
  setModal,
  setPercent = () => {},
  file,
  handleOnSubmit,
}) => {
  const toggle = () => setModal(!modal);
  const [loading, setLoading] = useState(false);
  const handleUpload = () => {
    setLoading(true);
    if (!file) {
      return toast.error('Please upload an image first!');
    }
    let formData = new FormData();
    formData.append('image', file);
    formData.append('type', 'users');

    galleryService
      .upload(formData)
      .then((res) => {
        handleOnSubmit({ type: 'image', message: res.data.title });
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setLoading(false);
        setModal(false);
      });
  };
  return (
    <Modal visible={modal} footer={false} onOk={toggle} onCancel={toggle}>
      <div className='upload-form position-relative'>
        {loading && (
          <div className='position-absolute h-100 w-100 d-flex justify-content-center align-items-center bg-transparent'>
            <Loading />
          </div>
        )}
        <img src={url} />
        <div className='footer-btns'>
          <Button disabled={loading} onClick={toggle}>
            Cancel
          </Button>
          <Button disabled={loading} onClick={handleUpload}>
            Send
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UploadMedia;
