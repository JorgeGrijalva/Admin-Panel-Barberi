import { Button, Card, Space, Table } from 'antd';
import { useTranslation } from 'react-i18next';
import Filter from './filter';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { addMenu, disableRefetch } from 'redux/slices/menu';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import React, { useContext, useEffect, useState } from 'react';
import { fetchServiceExtra } from 'redux/slices/service-extra';
import numberToPrice from 'helpers/numberToPrice';
import { Context } from 'context/context';
import { fetchServices } from 'redux/slices/services';
import { toast } from 'react-toastify';
import CustomModal from 'components/modal';
import serviceExtraService from 'services/service-extra';

function ServiceExtra() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setIsModalVisible } = useContext(Context);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { serviceExtra, loading, params, meta } = useSelector(
    (state) => state.serviceExtra,
    shallowEqual,
  );
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );

  const [id, setId] = useState(null);
  const [text, setText] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: {},
  });

  const paramsData = {
    ...params,
    search: !!filters?.search?.length ? filters.search : undefined,
    shop_id: filters.shop?.value,
  };

  const columns = [
    { title: t('id'), dataIndex: 'id', is_show: true, key: 'id' },
    {
      title: t('title'),
      dataIndex: 'title',
      is_show: true,
      key: 'translation',
    },

    {
      title: t('service'),
      dataIndex: 'service',
      key: 'service',
      is_show: true,
    },
    {
      title: t('shop'),
      dataIndex: 'shop',
      key: 'shop',
      is_show: true,
    },
    {
      title: t('price'),
      dataIndex: 'price',
      key: 'price',
      is_show: true,
      render: (price) =>
        numberToPrice(
          price || 0,
          defaultCurrency?.symbol,
          defaultCurrency?.position,
        ),
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

    serviceExtraService
      .delete(params)
      .then(() => {
        toast.success(t('successfully.deleted'));
        setId(null);
        setIsModalVisible(false);
        setText(false);
        dispatch(fetchServiceExtra(paramsData));
      })
      .finally(() => setLoadingBtn(false));
  };

  const goToAdd = () => {
    const url = 'service-extra/add';
    dispatch(
      addMenu({
        id: 'create.service.extra',
        url,
        name: t('add.service.extra'),
      }),
    );
    navigate(`/${url}`, { state: { params: paramsData } });
  };

  const goToEdit = (id) => {
    const url = `service-extra/${id}`;
    dispatch(
      addMenu({
        id: 'edit.service.extra',
        url,
        name: t('edit.service.extra'),
      }),
    );
    navigate(`/${url}`, { state: { params: paramsData } });
  };

  const deleteSelected = () => {
    if (id === null || id.length === 0) {
      toast.warning(t('select.the.service.extra'));
    } else {
      setIsModalVisible(true);
      setText(false);
    }
  };

  const onChangePagination = (pageNumber) => {
    const { pageSize, current } = pageNumber;

    const params = {
      ...paramsData,
      perPage: pageSize,
      page: current,
    };

    dispatch(fetchServices(params));
  };

  const rowSelection = {
    selectedRowKeys: id,
    onChange: (key) => {
      setId(key);
    },
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(disableRefetch(activeMenu));
      dispatch(fetchServiceExtra(paramsData));
    }
  }, [activeMenu.refetch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(fetchServiceExtra(paramsData));
    }, 400);
    return () => clearTimeout(timer);
  }, [filters]);

  return (
    <>
      <Card>
        <Space className='justify-content-end align-items-end'>
          <Filter filters={filters} setFilters={setFilters} />
          <Button icon={<DeleteOutlined />} onClick={deleteSelected}>
            {t('delete.selected')}
          </Button>
          <Button
            icon={<PlusCircleOutlined />}
            type='primary'
            onClick={goToAdd}
          >
            {t('add.service.extra')}
          </Button>
        </Space>
      </Card>
      <Card title={t('service.extra')}>
        <Table
          scroll={{ x: true }}
          rowSelection={rowSelection}
          columns={columns?.filter((item) => item.is_show)}
          rowKey={(record) => record?.id}
          dataSource={serviceExtra}
          loading={loading}
          pagination={{
            pageSize: meta?.per_page || 10,
            page: meta?.current_page,
            total: meta.total || 0,
            current: meta?.current_page || 1,
          }}
          onChange={onChangePagination}
        />
      </Card>
      <CustomModal
        click={handleDelete}
        text={text ? t('delete') : t('all.delete')}
        setText={setId}
        loading={loadingBtn}
      />
    </>
  );
}

export default ServiceExtra;
