import { Button, Card, Space, Table } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Context } from '../../../context/context';
import DeleteButton from '../../../components/delete-button';
import {
  addMenu,
  disableRefetch,
  setMenuData,
} from '../../../redux/slices/menu';
import formatSortType from '../../../helpers/formatSortType';
import { fetchMasterDisabledTimes } from '../../../redux/slices/disabledTimes';
import CustomModal from '../../../components/modal';
import { toast } from 'react-toastify';
import disabledTimesService from '../../../services/master/serviceDisabledTimes';

function DisabledTimes() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setIsModalVisible } = useContext(Context);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { disabledTimes, params, meta, loading } = useSelector(
    (state) => state.disabledTimes,
    shallowEqual,
  );

  const [loadingBtn, setLoadingBtn] = useState(false);
  const [id, setId] = useState();
  const [text, setText] = useState(null);
  // const [loading, setLoading] = useState(false);

  const data = activeMenu?.data;
  const paramsData = {
    search: data?.search,
    sort: data?.sort,
    column: data?.column,
    ...params,
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
      title: t('title'),
      dataIndex: 'title',
      is_show: true,
      key: 'title',
    },
    {
      title: t('repeats'),
      is_show: true,
      dataIndex: 'repeats',
      key: 'repeats',
      render: (repeats) => t(repeats),
    },
    {
      title: t('date'),
      dataIndex: 'date',
      key: 'date',
      is_show: true,
    },
    {
      title: t('from'),
      dataIndex: 'from',
      key: 'from',
      is_show: true,
    },
    {
      title: t('to'),
      dataIndex: 'to',
      key: 'to',
      is_show: true,
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

  const rowSelection = {
    selectedRowKeys: id,
    onChange: (key) => {
      setId(key);
    },
  };

  const goToEdit = (id) => {
    const url = `master/disabled-time/${id}`;
    dispatch(
      addMenu({
        id: 'master-service-edit2',
        url,
        name: t('edit.service.master'),
      }),
    );

    navigate('/' + url);
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

    disabledTimesService
      .delete(params)
      .then(() => {
        toast.success(t('successfully.deleted'));
        setId(null);
        setIsModalVisible(false);
        setText('');
        dispatch(fetchMasterDisabledTimes(paramsData));
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

  useEffect(() => {
    if (activeMenu.refetch) {
      // setLoading(true);
      dispatch(fetchMasterDisabledTimes(paramsData));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

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

  const goToAdd = () => {
    dispatch(
      addMenu({
        id: 'disabled-time-add',
        url: `master/disabled-time/add`,
        name: t('add.disabled.time'),
      }),
    );
    clearData();
    navigate(`/master/disabled-time/add`);
  };
  return (
    <>
      <Card title={t('disabled.times')}>
        <div className='flex align-items-center justify-content-between mb-4'>
          <Button
            type='primary'
            icon={<PlusCircleOutlined />}
            onClick={goToAdd}
          >
            {t('add.disabled.time')}
          </Button>
          <Button onClick={deleteSelected} icon={<DeleteOutlined />}>
            {t('delete.selected')}
          </Button>
        </div>
        <Table
          scroll={{ x: true }}
          rowSelection={rowSelection}
          columns={columns?.filter((item) => item.is_show)}
          dataSource={disabledTimes}
          loading={loading}
          pagination={{
            pageSize: params?.perPage,
            page: activeMenu.data?.page || 1,
            total: meta?.total,
            defaultCurrent: activeMenu?.data?.page,
            current: activeMenu.data?.page,
          }}
          rowKey={(record) => record.id}
          onChange={onChangePagination}
        />
      </Card>
      <CustomModal
        click={handleDelete}
        text={text}
        setText={setId}
        loading={loadingBtn}
      />
    </>
  );
}

export default DisabledTimes;
