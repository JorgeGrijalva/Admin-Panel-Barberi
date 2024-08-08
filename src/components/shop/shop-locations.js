import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button, Col, Image, Modal, Space, Table } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { fetchShopLocations } from 'redux/slices/shop-locations';
import { DeleteOutlined } from '@ant-design/icons';
import shopLocationsService from 'services/shop-locations';
import { toast } from 'react-toastify';
import CustomModal from 'components/modal';
import { Context } from 'context/context';
import LocationSelect from './location-select';

const ShopLocations = ({ next, prev, locationType }) => {
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
          src={country?.img}
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
              setIds([row?.id]);
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
    type: locationType?.value,
    shop_id: activeMenu?.data?.id,
  };
  const locationDelete = () => {
    setLoadingBtn(true);
    const paramsData = {
      ...Object.assign(
        {},
        ...ids.map((item, index) => ({
          [`ids[${index}]`]: item,
        })),
      ),
      type: locationType?.value,
    };
    shopLocationsService
      .delete(paramsData)
      .then(() => {
        dispatch(fetchShopLocations(params));
        toast.success(t('successfully.deleted'));
      })
      .finally(() => {
        setIds(null);
        setLoadingBtn(false);
        setIsModalVisible(false);
      });
  };

  const handleAddLocation = (values) => {
    const country = values?.country?.value?.split(',')?.[0];
    const region = values?.country?.value?.split(',')?.[1];
    const body = {
      type: locationType?.value,
      country_id: country,
      region_id: region,
      shop_id: activeMenu?.data?.id,
    };
    if (values.city.value !== 'all') {
      body.city_id = values.city?.value;
    }
    setLoadingBtn(true);
    shopLocationsService
      .create(body)
      .then(() => {
        toast.success(t('successfully.added'));
        dispatch(fetchShopLocations(params));
        setIsLocationSelectModalOpen(false);
      })
      .finally(() => {
        setLoadingBtn(false);
      });
  };

  useEffect(() => {
    if (activeMenu.data?.id) {
      dispatch(fetchShopLocations(params));
    }
  }, [activeMenu.data?.id]);

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
        <Space style={{ marginTop: '50px' }}>
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
