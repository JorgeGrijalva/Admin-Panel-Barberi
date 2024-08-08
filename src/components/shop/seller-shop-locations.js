import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button, Col, Image, Modal, Space, Table } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { fetchSellerShopLocations } from 'redux/slices/shop-locations';
import { DeleteOutlined } from '@ant-design/icons';
import LocationSelect from './location-select';
import shopLocationsService from 'services/seller/shop-locations';
import { toast } from 'react-toastify';
import CustomModal from 'components/modal';
import { Context } from 'context/context';
import { disableRefetch } from 'redux/slices/menu';
import { useQueryParams } from 'helpers/useQueryParams';

const ShopLocations = ({ next, prev, locationType }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const queryParams = useQueryParams();

  const { locations, loading } = useSelector((state) => state.shopLocations);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);

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
          {row?.country?.translation?.title}
          {row?.city ? ',' : ''} {row?.city?.translation?.title}
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
    type: locationType?.value,
  };
  const locationDelete = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...ids.map((item, index) => ({
          [`ids[${index}]`]: item,
        })),
      ),
      type: locationType?.value,
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
      shop_id: activeMenu?.data?.id,
      type: locationType?.value,
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
    dispatch(fetchSellerShopLocations(params));
    dispatch(disableRefetch(activeMenu));
  }, [queryParams.values?.step]);

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchSellerShopLocations(params));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

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
          onClose={() => setIsLocationSelectModalOpen(false)}
          onSubmit={handleAddLocation}
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
