import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Space, Table, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import formatSortType from '../../../helpers/formatSortType';
import {
  addMenu,
  disableRefetch,
  setMenuData,
} from '../../../redux/slices/menu';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import DeleteButton from '../../../components/delete-button';
import { Context } from '../../../context/context';
import useDidUpdate from '../../../helpers/useDidUpdate';
import { fetchMasterServiceMaster } from '../../../redux/slices/serviceMaster';
import { useNavigate } from 'react-router-dom';
import CustomModal from '../../../components/modal';
import { toast } from 'react-toastify';
import serviceMasterService from '../../../services/master/serviceMaster';
import numberToPrice from '../../../helpers/numberToPrice';

const genders = { 1: 'male', 2: 'female', 3: 'all' };

function ServiceMaster() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state) => state.menu);
  const { setIsModalVisible } = useContext(Context);

  const { serviceMaster, meta, loading, params } = useSelector(
    (state) => state.serviceMaster,
    shallowEqual,
  );
  const navigate = useNavigate();

  const [id, setId] = useState(null);
  const [text, setText] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [statusPayload, setStatusPayload] = useState({
    id: null,
    active: false,
  });

  const rowSelection = {
    selectedRowKeys: id,
    onChange: (key) => {
      setId(key);
    },
  };

  const [columns] = useState([
    {
      title: t('id'),
      dataIndex: 'id',
      is_show: true,
      sorter: true,
      key: 'id',
    },
    {
      title: t('service.name'),
      dataIndex: 'serviceName',
      is_show: true,
      key: 'service.name',
      render: (_, row) => row.service?.translation?.title,
    },
    {
      title: t('commission.fee'),
      dataIndex: 'commission_fee',
      is_show: true,
      key: 'commission.fee',
      render: (commission_fee) => numberToPrice(commission_fee),
    },
    {
      title: t('discount'),
      dataIndex: 'discount',
      is_show: true,
      key: 'discount',
      render: (discount) => numberToPrice(discount),
    },
    {
      title: t('gender'),
      dataIndex: 'gender',
      is_show: true,
      key: 'gender',
      render: (genderId) => t(genders[genderId]),
    },
    {
      title: t('pause'),
      dataIndex: 'pause',
      is_show: true,
    },
    {
      title: t('interval'),
      dataIndex: 'interval',
      is_show: true,
      key: 'interval',
      render: (interval) => <Tag>{interval}</Tag>,
    },
    {
      title: t('type'),
      is_show: true,
      dataIndex: 'type',
      key: 'type',
      render: (type) => <Tag>{t(type)}</Tag>,
    },
    {
      title: t('options'),
      dataIndex: 'options',
      key: 'options',
      is_show: true,
      render: (_, row) => {
        return (
          <Space>
            <Button
              type='primary'
              icon={<EditOutlined />}
              onClick={() => {
                goToEdit(row.id);
              }}
            />

            <DeleteButton
              icon={<DeleteOutlined />}
              onClick={() => {
                setId([row.id]);
                setIsModalVisible(true);
                setText('delete');
              }}
            />
          </Space>
        );
      },
    },
  ]);

  const clearData = () => {
    dispatch(
      setMenuData({
        activeMenu,
        data: null,
      }),
    );
  };

  // const handleFilter = (items) => {
  //   console.log('han', items);
  //   const data = activeMenu.data;
  //   dispatch(
  //     setMenuData({
  //       activeMenu,
  //       data: { ...data, ...items },
  //     }),
  //   );
  // };
  const goToEdit = (id) => {
    const url = `master/service-master/${id}`;
    dispatch(
      addMenu({
        id: 'master-service-edit',
        url,
        name: t('edit.service.master'),
      }),
    );

    navigate('/' + url);
  };
  const goToAdd = () => {
    dispatch(
      addMenu({
        id: 'service-master-add',
        url: `master/service-master/add`,
        name: t('add.service.master'),
      }),
    );
    clearData();
    navigate(`/master/service-master/add`);
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

    serviceMasterService
      .delete(params)
      .then(() => {
        toast.success(t('successfully.deleted'));
        setId(null);
        setIsModalVisible(false);
        setText('');
        dispatch(fetchMasterServiceMaster(paramsData));
      })
      .finally(() => setLoadingBtn(false));
  };

  const deleteSelected = () => {
    if (id === null || id.length === 0) {
      toast.warning(t('select.the.product'));
    } else {
      setIsModalVisible(true);
      setText('all.delete');
    }
  };

  const changeActiveStatus = () => {
    setLoadingBtn(true);

    serviceMasterService
      .update(statusPayload.id, { active: Number(statusPayload.active) })
      .then(() => {
        setStatusPayload({ id: null, active: false });
        setIsModalVisible(false);
        setText('');
        dispatch(fetchMasterServiceMaster(paramsData));
      })
      .finally(() => setLoadingBtn(false));
  };

  const handleModalAction = () => {
    if (text === 'delete' || text === 'all.delete') {
      handleDelete();
    } else if (text === 'set.active.order.status') {
      changeActiveStatus();
    }
  };

  function onChangePagination(pagination, filter, sorter) {
    const { pageSize: perPage, current: page } = pagination;
    const { field: column, order } = sorter;
    const sort = formatSortType(order);
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...activeMenu.data, perPage, page, column, sort },
      }),
    );
  }

  const data = activeMenu?.data;

  const paramsData = {
    ...params,
    search: data?.search,
    sort: data?.sort,
    column: data?.column,
    page: data?.page,
    perPage: data?.perPage,
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchMasterServiceMaster(paramsData));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  useDidUpdate(() => {
    dispatch(fetchMasterServiceMaster(paramsData));
  }, [data]);

  return (
    <>
      <Card title={t('service.master')}>
        <div className='d-flex justify-content-between mb-4'>
          <Button
            icon={<PlusCircleOutlined />}
            type='primary'
            onClick={goToAdd}
          >
            {t('add.service.master')}
          </Button>
          <Button onClick={deleteSelected} icon={<DeleteOutlined />}>
            {t('delete.selected')}
          </Button>
        </div>

        <Table
          scroll={{ x: true }}
          rowSelection={rowSelection}
          columns={columns?.filter((item) => item.is_show)}
          dataSource={serviceMaster}
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
      </Card>
      <CustomModal
        click={handleModalAction}
        text={text}
        setText={setId}
        loading={loadingBtn}
      />
    </>
  );
}

export default ServiceMaster;
