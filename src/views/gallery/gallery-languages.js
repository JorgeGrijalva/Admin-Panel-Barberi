import React, { useContext, useEffect, useState } from 'react';
import {
  Card,
  Col,
  Image,
  Row,
  Pagination,
  Checkbox,
  Space,
  Button,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { BsFolder2Open } from 'react-icons/bs';
import { Context } from '../../context/context';
import CustomModal from '../../components/modal';
import galleryService from '../../services/gallery';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import getImage from '../../helpers/getImage';
import Loading from '../../components/loading';
import DeleteButton from '../../components/delete-button';
import RiveResult from '../../components/rive-result';

const GalleryLanguages = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { type } = useParams();
  const [gallaryList, setGallaryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { setIsModalVisible } = useContext(Context);
  const [gallary, setGallary] = useState([]);
  const [pageSize, setPageSize] = useState(15);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({});

  const imageDelete = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...gallary.map((item, index) => ({
          [`ids[${index}]`]: item,
        }))
      ),
    };
    galleryService
      .delete(params)
      .then(() => {
        toast.success(t('successfully.deleted'));
        fetchGallery();
        setIsModalVisible(false);
        setGallary([]);
      })
      .finally(() => setLoadingBtn(false));
  };

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
        setGallaryList(res.data.data);
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

  const allDelete = () => {
    if (gallary === null || gallary.length === 0) {
      toast.warning(t('select.the.product'));
    } else {
      setIsModalVisible(true);
    }
  };

  const handleSelect = (e) =>
    setGallary(gallaryList.map((gallary) => gallary.id));

  const handleClear = (e) => setGallary([]);

  const handleCheck = (e, data) => {
    if (e.target.checked) {
      setGallary([...gallary, parseInt(data)]);
    } else {
      setGallary(gallary.filter((item) => item !== data));
    }
  };

  return (
    <div className='gallery-item'>
      <Card
        title={
          <div className='d-flex align-items-center justify-content-between'>
            <span className='d-flex align-items-center'>
              <span className='mr-3' onClick={() => navigate(-1)}>
                <ArrowLeftOutlined />
              </span>
              <BsFolder2Open style={{ fontSize: '25px' }} />
              <span className='ml-2'>{t(type)}</span>
            </span>
            <Space>
              <DeleteButton onClick={allDelete} type='danger'>
                {t('delete.all')}
              </DeleteButton>
              <Button
                onClick={() =>
                  gallary.length === gallaryList.length
                    ? handleClear()
                    : handleSelect()
                }
              >
                {gallary.length === gallaryList.length
                  ? t('clear.all')
                  : t('select.all')}
                {}
              </Button>
            </Space>
          </div>
        }
      >
        {!loading ? (
          <>
            <Row gutter={[24, 24]} className='mt-2'>
              {gallaryList.length === 0 ? (
                <Col span={24}>
                  <RiveResult id='nosell' />
                </Col>
              ) : (
                gallaryList?.map((item, index) => (
                  <Col key={index}>
                    <Card
                      className={`mb-0 ${
                        item.isset ? 'card-noActive' : 'card-active'
                      } card-image`}
                    >
                      <Image
                        src={getImage(item.path)}
                        className='images'
                        alt={'images'}
                      />
                      {!item.isset && (
                        <Checkbox
                          checked={gallary?.includes(item.id)}
                          className='icon-center-delete'
                          onChange={(e) => handleCheck(e, item.id)}
                        />
                      )}
                    </Card>
                  </Col>
                ))
              )}
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
        <CustomModal
          click={imageDelete}
          text={t('all.delete')}
          loading={loadingBtn}
          setText={setGallary}
        />
      </Card>
    </div>
  );
};

export default GalleryLanguages;
