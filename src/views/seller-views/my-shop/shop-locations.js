import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button, Col, Image, Modal, Space, Table } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { fetchSellerShopLocations } from 'redux/slices/shop-locations';
import { DeleteOutlined } from '@ant-design/icons';
import LocationSelect from 'components/shop/location-select';
import shopLocationsService from 'services/seller/shop-locations';
import { toast } from 'react-toastify';
import CustomModal from 'components/modal';
import { Context } from 'context/context';

const ShopLocations = ({ next, prev }) => {
  const { t } = useTranslation();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const dispatch = useDispatch();
  const { locations, loading } = useSelector((state) => state.shopLocations);
  const [ids, setIds] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [isLocationSelectModalOpen, setIsLocationSelectModalOpen] =
    useState(false);
  const { setIsModalVisible } = useContext(Context);

  const columns = [
    {
      title: t('location'),
      dataIndex: 'location',
      key: 'location',
      render: (_, row) => (
        <span>
          {row.country?.translation?.title}
          {row.city ? ',' : ''} {row.city?.translation?.title}
        </span>
      ),
    },
    {
      title: t('image'),
      dataIndex: 'country',
      key: 'image',
      render: (country) => (
        <Image
          src={country.img}
          alt={country?.translation?.title}
          width={60}
          height={40}
        />
      ),
    },

    {
      title: t('options'),
      dataIndex: 'options',
      key: 'options',
      render: (_, row) => (
        <Space>
          <Button
            onClick={() => {
              setIds([row.id]);
              setIsModalVisible(true);
            }}
            type='primary'
            danger
            icon={<DeleteOutlined />}
          />
        </Space>
      ),
    },
  ];

  const params = {
    shop_id: activeMenu?.data?.id,
  };
  const locationDelete = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...ids.map((item, index) => ({
          [`ids[${index}]`]: item,
        }))
      ),
    };
    shopLocationsService
      .delete(params)
      .then(() => {
        dispatch(fetchSellerShopLocations(params));
        toast.success(t('successfully.deleted'));
      })
      .finally(() => {
        setLoadingBtn(false);
        setIds(null);
        setIsModalVisible(false);
      });
  };

  const handleAddLocation = (values) => {
    const country = values.country.value.split(',')[0];
    const region = values.country.value.split(',')[1];
    const body = {
      country_id: country,
      region_id: region,
    };
    if (values.city.value !== 'all') {
      body.city_id = values.city?.value;
    }
    setLoadingBtn(true);
    shopLocationsService
      .create(body)
      .then(() => {
        toast.success(t('successfully.added'));
        dispatch(fetchSellerShopLocations(params));
        setIsLocationSelectModalOpen(false);
      })
      .finally(() => {
        setLoadingBtn(false);
      });
  };

  useEffect(() => {
    if (activeMenu?.data?.id) {
      dispatch(fetchSellerShopLocations(params));
    }
  }, [activeMenu?.data?.id]);

  return (
    <>
      <Space className='justify-content-end w-100'>
        <Button
          onClick={() => setIsLocationSelectModalOpen(true)}
          type='primary'
        >
          {t('add')}
        </Button>
      </Space>
      <Table loading={loading} dataSource={locations} columns={columns} />
      <Modal
        footer={null}
        visible={isLocationSelectModalOpen}
        destroyOnClose
        onCancel={() => setIsLocationSelectModalOpen(false)}
      >
        <LocationSelect
          onSubmit={handleAddLocation}
          onClose={() => setIsLocationSelectModalOpen(false)}
          isButtonLoading={loadingBtn} 
        />
      </Modal>
      <CustomModal
        click={locationDelete}
        text={t('delete.location')}
        setText={setIds}
        loading={loadingBtn}
      />
      <Col span={24}>
        <Space>
          <Button type='primary' htmlType='button' onClick={() => next()}>
            {t('next')}
          </Button>
          <Button htmlType='button' onClick={() => prev()}>
            {t('prev')}
          </Button>
        </Space>
      </Col>
    </>
  );
};

export default ShopLocations;
