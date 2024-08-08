import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'antd';
import { colLg } from '../card-responsive';
import { useTranslation } from 'react-i18next';
import GalleryItem from './gallery-item';
import { BsFolder } from 'react-icons/bs';
import Meta from 'antd/lib/card/Meta';
import { shallowEqual, useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { fetchGalleryTypes } from 'redux/slices/gallery';
import Loading from 'components/loading';

const UploadMedia = ({
  setImageList,
  imageList,
  setIsModalOpen,
  form,
  name,
}) => {
  const { t } = useTranslation();
  const [currentType, setCurrentType] = useState(null);
  const dispatch = useDispatch();
  const { types, loading } = useSelector(
    (state) => state.gallery,
    shallowEqual,
  );
  useEffect(() => {
    dispatch(fetchGalleryTypes({}));
  }, []);
  return (
    <>
      {currentType ? (
        <GalleryItem
          type={currentType}
          setCurrentType={setCurrentType}
          setImageList={setImageList}
          imageList={imageList}
          setIsModalOpen={setIsModalOpen}
          form={form}
          name={name}
        />
      ) : (
        <Card className='media-upload-gallery-container'>
          {loading ? (
            <Loading />
          ) : (
            <Row gutter={[24, 24]}>
              {Object.values(types).map((item, index) => {
                return (
                  <Col {...colLg} key={index}>
                    <Card
                      cover={<BsFolder className='icon-folder' />}
                      className='folder'
                      onClick={() => setCurrentType(item)}
                    >
                      <Meta title={t(`${item}`)} />
                    </Card>
                  </Col>
                );
              })}
            </Row>
          )}
        </Card>
      )}
    </>
  );
};

export default UploadMedia;
