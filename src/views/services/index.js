import React, { useState, useEffect, useContext } from 'react';
import { Card, Space, Table, Tag, Button, Image } from 'antd';
import { useTranslation } from 'react-i18next';
import servicesService from 'services/services';
import { shallowEqual, useSelector, useDispatch, batch } from 'react-redux';
import useDidUpdate from 'helpers/useDidUpdate';
import { useNavigate } from 'react-router-dom';
import { fetchServices } from 'redux/slices/services';
import { addMenu, disableRefetch } from 'redux/slices/menu';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Filter from './filter';
import StatusChangeModal from './status-change-modal';
import { Context } from 'context/context';
import CustomModal from 'components/modal';
import { toast } from 'react-toastify';
import { statuses } from './statuses';
import { IMG_URL } from 'configs/app-global';

const colors = ['blue', 'red', 'gold', 'volcano', 'cyan', 'lime'];

const Services = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { services, loading, meta, params } = useSelector(
    (state) => state.servicesSlice,
    shallowEqual,
  );
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);

  const { setIsModalVisible } = useContext(Context);

  const debounceTimeout = 400;
  const [id, setId] = useState(null);
  const [text, setText] = useState(null);
  const [itemData, setItemData] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: {},
  });
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const [loadingBtn, setLoadingBtn] = useState(false);

  const paramsData = {
    ...params,
    search: filters?.search,
    category_id: filters?.category?.value,
    shop_id: filters?.shop?.value,
  };

  if (!filters?.search?.length) delete paramsData?.search;

  const rowSelection = {
    selectedRowKeys: id,
    onChange: (key) => {
      setId(key);
    },
  };

  const columns = [
    { title: t('id'), dataIndex: 'id', is_show: true, key: 'id' },
    {
      title: t('image'),
      dataIndex: 'img',
      is_show: false,
      render: (img) => {
        return (
          <Image
            width={100}
            src={img ? IMG_URL + img : 'https://via.placeholder.com/150'}
            placeholder
            style={{ borderRadius: 4 }}
          />
        );
      },
    },
    {
      title: t('title'),
      dataIndex: 'slug',
      is_show: true,
      key: 'translation',
      render: (_, row) => row?.translation?.title,
    },
    {
      title: t('translations'),
      dataIndex: 'translations',
      is_show: true,
      key: 'translations',
      render: (_, row) => (
        <Space>
          {row.locales?.map((item, index) => (
            <Tag className='text-uppercase' color={[colors[index]]}>
              {item}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: t('shop'),
      dataIndex: 'shop',
      is_show: true,
      key: 'shop',
      render: (shop) => shop?.translation?.title || '--',
    },
    {
      title: t('status'),
      dataIndex: 'status',
      key: 'status',
      is_show: true,
      render: (status, row) => (
        <Space wrap>
          {status === 'new' ? (
            <Tag color='blue'>{t(status)}</Tag>
          ) : status === 'canceled' ? (
            <Tag color='error'>{t(status)}</Tag>
          ) : (
            <Tag color='cyan'>{t(status)}</Tag>
          )}
          <EditOutlined onClick={() => setItemData(row)} />
        </Space>
      ),
    },
    {
      title: t('interval'),
      dataIndex: 'interval',
      key: 'interval',
      is_show: true,
    },
    {
      title: t('type'),
      dataIndex: 'type',
      key: 'type',
      is_show: true,
    },
    {
      title: t('category'),
      dataIndex: 'category',
      key: 'category',
      is_show: true,
      render: (_, row) => row?.category?.translation?.title,
    },
    {
      title: t('options'),
      is_show: true,
      key: 'options',
      render: (_, row) => (
        <Space wrap>
          <Button
            type={'primary'}
            icon={<EditOutlined />}
            onClick={() => goToEdit(row?.id)}
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => {
              setId([row?.id]);
              setIsModalVisible(true);
              setText(true);
            }}
          />
        </Space>
      ),
    },
  ];

  useEffect(() => {
    if (activeMenu.refetch) {
      batch(() => {
        dispatch(fetchServices(paramsData));
        dispatch(disableRefetch(activeMenu));
      });
    }
  }, [activeMenu.refetch]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, debounceTimeout);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [filters, debounceTimeout]);

  useDidUpdate(() => {
    dispatch(fetchServices(paramsData));
  }, [debouncedFilters]);

  const onChangePagination = (pageNumber) => {
    const { pageSize, current } = pageNumber;

    const params = {
      ...paramsData,
      perPage: pageSize,
      page: current,
    };

    dispatch(fetchServices(params));
  };

  const deleteSelected = () => {
    if (id === null || id.length === 0) {
      toast.warning(t('select.the.product'));
    } else {
      setIsModalVisible(true);
      setText(false);
    }
  };

  const handleDelete = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        })),
      ),
    };

    servicesService
      .delete(params)
      .then(() => {
        toast.success(t('successfully.deleted'));
        setId(null);
        setIsModalVisible(false);
        setText(false);
        dispatch(fetchServices(paramsData));
      })
      .finally(() => setLoadingBtn(false));
  };

  const handleChangeStatus = (values) => {
    const body = {
      category_id: values?.category?.id,
      status: values?.status,
      status_note: values?.status_note,
    };

    return servicesService
      .statusChange(values?.id, body)
      .then(() => dispatch(fetchServices(paramsData)));
  };

  const goToAdd = () => {
    const url = 'services/add';
    dispatch(
      addMenu({
        id: 'create.service',
        url,
        name: t('add.service'),
      }),
    );
    navigate(`/${url}`, { state: { params: paramsData } });
  };

  const goToEdit = (id) => {
    const url = `services/${id}`;
    dispatch(
      addMenu({
        id: 'edit.service',
        url,
        name: t('edit.service'),
      }),
    );
    navigate(`/${url}`, { state: { params: paramsData } });
  };

  return (
    <>
      <Card>
        <Space wrap>
          <Filter filters={filters} setFilters={setFilters} />
          <Button onClick={deleteSelected}>{t('delete.selected')}</Button>
          <Button type={'primary'} onClick={goToAdd}>
            {t('add.service')}
          </Button>
        </Space>
      </Card>
      <Card>
        <Table
          scroll={{ x: true }}
          rowSelection={rowSelection}
          columns={columns?.filter((item) => item.is_show)}
          rowKey={(record) => record?.id}
          dataSource={services}
          loading={loading}
          pagination={{
            pageSize: meta?.per_page || 10,
            // page: meta?.current_page,
            total: meta.total || 0,
            current: meta?.current_page || 1,
          }}
          onChange={onChangePagination}
        />
      </Card>
      {itemData && (
        <StatusChangeModal
          statuses={statuses}
          data={itemData}
          visible={itemData}
          handleSubmit={handleChangeStatus}
          handleCancel={() => setItemData(null)}
        />
      )}
      <CustomModal
        click={handleDelete}
        text={text ? t('delete') : t('all.delete')}
        setText={setId}
        loading={loadingBtn}
      />
    </>
  );
};

export default Services;
