import React, { useContext, useEffect, useState } from 'react';
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { Button, Card, Image, Space, Table, Tabs, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IMG_URL } from '../../configs/app-global';
import { Context } from '../../context/context';
import CustomModal from '../../components/modal';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addMenu, disableRefetch, setMenuData } from '../../redux/slices/menu';
import restaurantService from '../../services/restaurant';
import { fetchRestourant } from '../../redux/slices/restourant';
import { useTranslation } from 'react-i18next';
import RestaurantStatusModal from './restaurant-status-modal';
import DeleteButton from '../../components/delete-button';
import CustomDrower from '../../components/CustomDrower';
import SearchInput from '../../components/search-input';
import useDidUpdate from '../../helpers/useDidUpdate';
import i18n from '../../configs/i18next';
import { BiFilterAlt } from 'react-icons/bi';
import FilterColumns from '../../components/filter-column';
import formatSortType from '../../helpers/formatSortType';

const { TabPane } = Tabs;
const colors = ['blue', 'red', 'gold', 'volcano', 'cyan', 'lime'];
const roles = ['all', 'new', 'approved', 'rejected'];

const Restaurants = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [restourantStatus, setRestourantStatus] = useState(null);
  const { user } = useSelector((state) => state.auth, shallowEqual);
  const [openDrower, setOpenDrower] = useState(false);
  const [text, setText] = useState(null);

  const goToEdit = (row) => {
    dispatch(
      addMenu({
        id: 'edit-restaurant',
        url: `restaurant/${row.uuid}`,
        name: t('edit.restaurant'),
      })
    );
    navigate(`/restaurant/${row.uuid}`);
  };

  const goToClone = (row) => {
    dispatch(
      addMenu({
        id: 'restaurant-clone',
        url: `restaurant-clone/${row.uuid}`,
        name: t('restaurant.clone'),
      })
    );
    navigate(`/restaurant-clone/${row.uuid}`);
  };

  const [columns, setColumns] = useState([
    {
      title: t('id'),
      dataIndex: 'id',
      is_show: true,
      sorter: true,
    },
    {
      title: t('title'),
      dataIndex: 'name',
      is_show: true,
    },
    {
      title: t('translations'),
      dataIndex: 'locales',
      is_show: true,
      render: (_, row) => {
        return (
          <Space>
            {row.locales?.map((item, index) => (
              <Tag className='text-uppercase' color={[colors[index]]}>
                {item}
              </Tag>
            ))}
          </Space>
        );
      },
    },
    {
      title: t('logo'),
      dataIndex: 'logo_img',
      is_show: true,
      render: (img, row) => {
        return (
          <Image
            alt='images'
            className='img rounded'
            src={img || 'https://via.placeholder.com/150'}
            effect='blur'
            width={50}
            height={50}
            preview
            placeholder
          />
        );
      },
    },
    {
      title: t('background'),
      dataIndex: 'back',
      is_show: true,
      render: (img) => {
        return (
          <Image
            alt={'images background'}
            className='img rounded'
            src={img ? IMG_URL + img : 'https://via.placeholder.com/150'}
            effect='blur'
            width={50}
            height={50}
            preview
            placeholder
          />
        );
      },
    },
    {
      title: t('seller'),
      dataIndex: 'seller',
      is_show: true,
    },
    {
      title: t('open.time'),
      dataIndex: 'open',
      is_show: true,
      render: (_, row) => {
        return row.open ? (
          <Tag color='blue'> {t('open')} </Tag>
        ) : (
          <Tag color='red'> {t('closed')} </Tag>
        );
      },
    },
    {
      title: t('tax'),
      is_show: true,
      dataIndex: 'tax',
      render: (tax) => `${tax} %`,
    },
    {
      title: t('status'),
      dataIndex: 'status',
      is_show: true,
      render: (status, row) => (
        <div>
          {status === 'new' ? (
            <Tag color='blue'>{t(status)}</Tag>
          ) : status === 'rejected' ? (
            <Tag color='error'>{t(status)}</Tag>
          ) : (
            <Tag color='cyan'>{t(status)}</Tag>
          )}
          <EditOutlined onClick={() => setRestourantStatus(row)} />
        </div>
      ),
    },
    {
      title: t('options'),
      dataIndex: 'options',
      is_show: true,
      render: (_, row) => {
        return (
          <Space>
            <Button
              type='primary'
              icon={<EditOutlined />}
              onClick={() => goToEdit(row)}
            />
            <Button icon={<CopyOutlined />} onClick={() => goToClone(row)} />
            {user?.role !== 'manager' ? (
              <DeleteButton
                icon={<DeleteOutlined />}
                onClick={() => {
                  setId([row.id]);
                  setIsModalVisible(true);
                  setText(true);
                }}
              />
            ) : (
              ''
            )}
          </Space>
        );
      },
    },
  ]);

  const { setIsModalVisible } = useContext(Context);
  const [id, setId] = useState(null);
  const [role, setRole] = useState('all');
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { restourants, meta, loading, params } = useSelector(
    (state) => state.restourant,
    shallowEqual
  );
  const immutable = activeMenu.data?.role || role;
  const data = activeMenu?.data;
  const paramsData = {
    search: data?.search,
    lang: data?.filter?.equal === 'equal' ? data?.filter?.lang : i18n.language,
    not_lang: data?.filter?.equal === 'not_equal' ? data?.filter?.lang : null,
    status: immutable === 'all' ? undefined : immutable || undefined,
    page: data?.page,
    perPage: data?.perPage,
    sort: data?.sort,
    column: data?.column,
  };

  const restaurantDelete = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        }))
      ),
    };
    restaurantService
      .delete(params)
      .then(() => {
        toast.success(t('successfully.deleted'));
        setIsModalVisible(false);
        dispatch(fetchRestourant(paramsData));
        setText(null);
      })
      .finally(() => setLoadingBtn(false));
  };

  function onChangePagination(pagination, filter, sorter) {
    const { pageSize: perPage, current: page } = pagination;
    const { field: column, order } = sorter;
    const sort = formatSortType(order);
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...activeMenu.data, perPage, page, column, sort },
      })
    );
  }

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchRestourant(paramsData));
      dispatch(disableRefetch(activeMenu));
      setRole('all');
    }
  }, [activeMenu.refetch]);

  const goToAdd = () => {
    dispatch(
      addMenu({
        id: 'add-restaurant',
        url: `restaurant/add`,
        name: t('add.restaurant'),
      })
    );
    navigate(`/restaurant/add`);
  };

  const handleFilter = (items) => {
    const data = activeMenu.data;
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...data, ...items },
      })
    );
  };

  useDidUpdate(() => {
    dispatch(fetchRestourant(paramsData));
  }, [activeMenu.data]);

  const rowSelection = {
    selectedRowKeys: id,
    onChange: (key) => {
      setId(key);
    },
  };

  const allDelete = () => {
    if (id === null || id.length === 0) {
      toast.warning(t('select.the.product'));
    } else {
      setIsModalVisible(true);
      setText(false);
    }
  };

  return (
    <Card
      title={t('restaurants')}
      extra={
        <Space wrap>
          <Button
            icon={<PlusCircleOutlined />}
            type='primary'
            onClick={goToAdd}
          >
            {t('add.restaurant')}
          </Button>
          <DeleteButton size='' onClick={allDelete}>
            {t('delete.selected')}
          </DeleteButton>
          <Button
            className='settings-button'
            onClick={() => setOpenDrower(true)}
          >
            <BiFilterAlt className='icon' />
          </Button>
          <FilterColumns columns={columns} setColumns={setColumns} />
        </Space>
      }
    >
      <div className='d-flex justify-content-between'>
        <SearchInput
          placeholder={t('search')}
          handleChange={(e) => handleFilter({ search: e })}
          defaultValue={activeMenu.data?.search}
          resetSearch={!activeMenu.data?.search}
          className={'w-25'}
        />
      </div>
      <Tabs
        className='mt-3'
        activeKey={immutable}
        onChange={(key) => {
          handleFilter({ role: key, page: 1 });
          setRole(key);
        }}
        type='card'
      >
        {roles.map((item) => (
          <TabPane tab={t(item)} key={item} />
        ))}
      </Tabs>
      <Table
        scroll={{ x: true }}
        rowSelection={rowSelection}
        columns={columns?.filter((item) => item.is_show)}
        dataSource={restourants}
        loading={loading}
        pagination={{
          pageSize: params.perPage,
          page: activeMenu.data?.page || 1,
          total: meta.total,
          defaultCurrent: activeMenu.data?.page,
          current: activeMenu.data?.page,
        }}
        rowKey={(record) => record.id}
        onChange={onChangePagination}
      />
      {restourantStatus && (
        <RestaurantStatusModal
          data={restourantStatus}
          handleCancel={() => setRestourantStatus(null)}
          paramsData={paramsData}
        />
      )}
      <CustomModal
        click={restaurantDelete}
        text={text ? t('delete') : t('all.delete')}
        setText={setId}
        loading={loadingBtn}
      />
      {openDrower && (
        <CustomDrower
          handleClose={() => setOpenDrower(false)}
          openDrower={openDrower}
          setMenuData={setMenuData}
        />
      )}
    </Card>
  );
};

export default Restaurants;
