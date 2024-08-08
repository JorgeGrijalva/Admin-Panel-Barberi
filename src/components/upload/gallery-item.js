import React, { useEffect, useState } from 'react';
import { Card, Col, Image, Row, Pagination } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { FcOpenedFolder } from 'react-icons/fc';
import galleryService from '../../services/gallery';
import { useTranslation } from 'react-i18next';
import getImage from '../../helpers/getImage';
import Loading from '../../components/loading';
import { toast } from 'react-toastify';

const GalleryItem = ({
  type,
  setCurrentType,
  setImageList,
  imageList,
  setIsModalOpen,
  form,
  name: item_name,
}) => {
  const { t } = useTranslation();
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({});

  const fetchGallery = () => {
    const params = {
      type,
      perPage: pageSize,
      page: page,
    };
    setLoading(true);
    galleryService
      .getAll(params)
      .then((res) => {
        setLanguages(res.data.data);
        setMeta(res.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchGallery();
  }, [page, pageSize]);

  const onChangePagination = (pageNumber, e) => {
    setPage(pageNumber);
    setPageSize(e);
  };

  const createImage = (file) => {
    return {
      uid: file,
      name: file,
      status: 'done', // done, uploading, error
      url: file,
      created: true,
    };
  };

  const handleImage = (name) => {
    const include = imageList.includes(name);
    if (include) toast.warn('This image is already uploaded');
    else {
      setIsModalOpen(false);
      setImageList([...imageList, createImage(name)]);
      if (Boolean(item_name)) {
        form.setFieldsValue({
          [item_name]: createImage(name),
        });
      } else {
        form.setFieldsValue({
          images: [...imageList, createImage(name)],
        });
      }
    }
  };

  return (
    <div className='gallery-item '>
      <Card
        title={
          <div className='d-flex align-items-center'>
            <span className='mr-3' onClick={() => setCurrentType(null)}>
              <ArrowLeftOutlined />
            </span>
            <FcOpenedFolder style={{ fontSize: '25px' }} />
            <span className='ml-2'>{t('gallery')}</span>
          </div>
        }
      >
        {!loading ? (
          <>
            <Row gutter={[24, 24]}>
              {languages?.map((item, index) => (
                <Col key={item.id}>
                  <Card
                    className={`mb-0 ${
                      item.isset ? 'card-noActive' : 'card-active'
                    } card-image`}
                  >
                    <Image
                      preview={false}
                      src={getImage(item.path)}
                      className='images'
                      alt={'images'}
                      onClick={() => handleImage(item.path)}
                    />
                  </Card>
                </Col>
              ))}
            </Row>
            <div className='d-flex justify-content-end mt-5'>
              <Pagination
                total={meta.total}
                pageSize={pageSize}
                current={page}
                onChange={onChangePagination}
              />
            </div>
          </>
        ) : (
          <Loading />
        )}
      </Card>
    </div>
  );
};

export default GalleryItem;
