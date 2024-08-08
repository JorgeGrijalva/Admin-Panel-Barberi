import React, { useEffect, useState, useContext } from 'react';
import {
  DeleteOutlined,
  EditOutlined,
  ExpandOutlined,
  EyeOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { Button, Card, Space, Table, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FaUserCog } from 'react-icons/fa';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addMenu, disableRefetch, setMenuData } from 'redux/slices/menu';
import { useTranslation } from 'react-i18next';
import formatSortType from 'helpers/formatSortType';
import useDidUpdate from 'helpers/useDidUpdate';
import UserShowModal from './userShowModal';
import UserRoleModal from './userRoleModal';
import { fetchClients } from 'redux/slices/client';
import SearchInput from 'components/search-input';
import FilterColumns from 'components/filter-column';
import DeleteButton from 'components/delete-button';
import { toast } from 'react-toastify';
import { Context } from 'context/context';
import CustomModal from 'components/modal';
import deliveryService from 'services/delivery';
import useDemo from 'helpers/useDemo';

const User = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [id, setId] = useState(null);
  const { setIsModalVisible } = useContext(Context);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { clients, loading, meta, params } = useSelector(
    (state) => state.client,
    shallowEqual,
  );
  const { isDemo } = useDemo();
  const [uuid, setUuid] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const data = activeMenu.data;
  const paramsData = {
    sort: data?.sort,
    column: data?.column,
    perPage: data?.perPage,
    page: data?.page,
    search: data?.search,
    status: 'published',
  };

  const goToEdit = (row) => {
    dispatch(
      addMenu({
        url: `user/${row.uuid}`,
        id: 'user_edit',
        name: 'User edit',
      }),
    );
    navigate(`/user/${row.uuid}`, { state: 'user' });
  };

  const goToDetail = (row) => {
    dispatch(
      addMenu({
        url: `users/user/${row.uuid}`,
        id: 'user_info',
        name: t('user.info'),
      }),
    );
    navigate(`/users/user/${row.uuid}`, { state: { user_id: row.id } });
  };

  const [columns, setColumns] = useState([
    {
      title: t('id'),
      dataIndex: 'id',
      key: 'id',
      sorter: true,
      is_show: true,
    },
    {
      title: t('firstname'),
      dataIndex: 'firstname',
      key: 'firstname',
      is_show: true,
    },
    {
      title: t('lastname'),
      dataIndex: 'lastname',
      key: 'lastname',
      is_show: true,
    },
    {
      title: t('email'),
      dataIndex: 'email',
      key: 'email',
      is_show: true,
      render: (email) => <div>{isDemo ? '' : email}</div>,
    },
    {
      title: t('role'),
      dataIndex: 'role',
      key: 'role',
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
            <Button icon={<EyeOutlined />} onClick={() => goToDetail(row)} />
            <Button
              icon={<ExpandOutlined />}
              onClick={() => setUuid(row.uuid)}
            />
            <Button
              type='primary'
              icon={<EditOutlined />}
              onClick={() => goToEdit(row)}
            />
            <Tooltip title={t('change.user.role')}>
              <Button onClick={() => setUserRole(row)} icon={<FaUserCog />} />
            </Tooltip>
            <DeleteButton
              icon={<DeleteOutlined />}
              onClick={() => {
                setId([row.id]);
                setIsModalVisible(true);
              }}
            />
          </Space>
        );
      },
    },
  ]);

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

  const userDelete = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        })),
      ),
    };

    deliveryService
      .delete(params)
      .then(() => {
        toast.success(t('successfully.deleted'));
        dispatch(fetchClients(paramsData));
        setIsModalVisible(false);
      })
      .finally(() => {
        setId(null);
        setLoadingBtn(false);
      });
  };

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchClients(paramsData));
      dispatch(disableRefetch(activeMenu));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMenu.refetch]);

  useDidUpdate(() => {
    dispatch(fetchClients(paramsData));
  }, [activeMenu.data]);

  const goToAddClient = () => {
    dispatch(
      addMenu({
        id: 'user-add',
        url: 'user/add',
        name: t('add.client'),
      }),
    );
    navigate('/user/add');
  };

  const handleFilter = (items) => {
    const data = activeMenu.data;
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...data, ...items },
      }),
    );
  };

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
    }
  };

  return (
    <Card
      title={t('clients')}
      extra={
        <Space wrap>
          <Space>
            <Button
              type='primary'
              icon={<PlusCircleOutlined />}
              onClick={goToAddClient}
            >
              {t('add.client')}
            </Button>
            <DeleteButton size='' onClick={allDelete}>
              {t('delete.selected')}
            </DeleteButton>
          </Space>
          <FilterColumns columns={columns} setColumns={setColumns} />
        </Space>
      }
    >
      <div className='d-flex justify-content-between'>
        <SearchInput
          placeholder={t('search')}
          className='w-25'
          handleChange={(e) => handleFilter({ search: e })}
          defaultValue={activeMenu.data?.search}
          resetSearch={!activeMenu.data?.search}
        />
      </div>

      <Table
        scroll={{ x: true }}
        rowSelection={rowSelection}
        columns={columns?.filter((item) => item.is_show)}
        dataSource={clients}
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
      <CustomModal
        click={userDelete}
        text={t('delete')}
        loading={loadingBtn}
        setText={setId}
      />
      {uuid && <UserShowModal uuid={uuid} handleCancel={() => setUuid(null)} />}
      {userRole && (
        <UserRoleModal data={userRole} handleCancel={() => setUserRole(null)} />
      )}
    </Card>
  );
};

export default User;
