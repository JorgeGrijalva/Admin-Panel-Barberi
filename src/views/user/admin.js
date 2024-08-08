import React, { useEffect, useState, useContext } from 'react';
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  ExpandOutlined,
  EyeOutlined,
  LoginOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { Button, Card, Space, Table, Tabs } from 'antd';
import { useNavigate } from 'react-router-dom';
import { batch, shallowEqual, useDispatch, useSelector } from 'react-redux';
import { data as menuData } from 'configs/menu-config';
import { fetchUsers } from 'redux/slices/user';
import formatSortType from 'helpers/formatSortType';
import {
  addMenu,
  clearMenu,
  disableRefetch,
  setMenuData,
} from 'redux/slices/menu';
import useDidUpdate from 'helpers/useDidUpdate';
import UserShowModal from './userShowModal';
import { useTranslation } from 'react-i18next';
import UserRoleModal from './userRoleModal';
import SearchInput from 'components/search-input';
import FilterColumns from 'components/filter-column';
import DeleteButton from 'components/delete-button';
import { Context } from 'context/context';
import { toast } from 'react-toastify';
import deliveryService from 'services/delivery';
import CustomModal from 'components/modal';
import useDemo from 'helpers/useDemo';
import userService from 'services/user';
import { setUserData, updateUser } from 'redux/slices/auth';
import { setCurrentChat } from 'redux/slices/chat';
import { fetchRestSettings } from 'redux/slices/globalSettings';
import { fetchMyShop } from 'redux/slices/myShop';
import hideEmail from 'components/hideEmail';
import serviceMasterService from 'services/master/serviceMaster';

const { TabPane } = Tabs;
const ReactAppIsDemo = process.env.REACT_APP_IS_DEMO;

const modalType = {
  SELLER_LOGIN: 'seller_login',
  MASTER_LOGIN: 'master_login',
  DELIVERYMAN_LOGIN: 'deliveryman_login',
  MODERATOR_LOGIN: 'moderator_login',
  MANAGER_LOGIN: 'manager_login',
  DELETE: 'delete',
};

export default function Admin() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [id, setId] = useState(null);
  const [text, setText] = useState(null);
  const { setIsModalVisible } = useContext(Context);
  const [tabsLoading, setTabsLoading] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { users, loading, meta, params } = useSelector(
    (state) => state.user,
    shallowEqual,
  );
  const [uuid, setUuid] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [roles, setRoles] = useState([]);
  const [role, setRole] = useState('admin');
  const [modalTypeState, setModalTypeState] = useState(modalType.DELETE);
  const immutable = activeMenu.data?.role || role;
  const { user } = useSelector((state) => state.auth, shallowEqual);

  const {
    isDemo,
    demoDeliveryman,
    demoSeller,
    demoAdmin,
    demoModerator,
    demoMeneger,
  } = useDemo();

  const data = activeMenu.data;
  const roleData = { role: immutable };

  const paramsData = {
    sort: data?.sort,
    column: data?.column,
    ...roleData,
    perPage: data?.perPage,
    page: data?.page,
    search: data?.search,
  };

  const goToEdit = (row) => {
    dispatch(
      addMenu({
        url: `user/${row.uuid}`,
        id: 'user_edit',
        name: 'User edit',
      }),
    );
    navigate(`/user/${row.uuid}`);
  };

  const goToClone = (row) => {
    dispatch(
      addMenu({
        url: `user-clone/${row.uuid}`,
        id: 'user-clone',
        name: 'user.clone',
      }),
    );
    navigate(`/user-clone/${row.uuid}`);
  };

  const goToDetail = (row) => {
    dispatch(
      addMenu({
        url: `/users/user/${row.uuid}`,
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
      sorter: true,
      is_show: true,
    },
    {
      title: t('firstname'),
      dataIndex: 'firstname',
      is_show: true,
    },
    {
      title: t('lastname'),
      dataIndex: 'lastname',
      is_show: true,
    },
    {
      title: t('email'),
      dataIndex: 'email',
      is_show: true,
      render: (email) => <div>{ReactAppIsDemo ? hideEmail(email) : email}</div>,
    },
    {
      title: t('role'),
      dataIndex: 'role',
      is_show: true,
    },
    {
      title: t('options'),
      dataIndex: 'options',
      is_show: true,
      render: (_, row) => {
        return (
          <Space>
            <Button
              icon={<ExpandOutlined />}
              onClick={() => setUuid(row.uuid)}
            />
            {user.role === 'manager' && row.role === 'admin' ? undefined : (
              <>
                <Button
                  icon={<EyeOutlined />}
                  onClick={() => goToDetail(row)}
                />
                <Button
                  type='primary'
                  icon={<EditOutlined />}
                  onClick={() => goToEdit(row)}
                  disabled={
                    /*eslint-disable eqeqeq*/
                    (isDemo && row?.id == demoDeliveryman) ||
                    (isDemo && row?.id == demoModerator) ||
                    (isDemo && row?.id == demoMeneger) ||
                    (isDemo && row?.id == demoSeller) ||
                    (isDemo && row?.id == demoAdmin)
                  }
                />
              </>
            )}

            {row?.role !== 'admin' && (
              <Space>
                <Button
                  icon={<CopyOutlined />}
                  onClick={() => goToClone(row)}
                />
                <DeleteButton
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    setModalTypeState(modalType.DELETE);
                    setId([row.id]);
                    setIsModalVisible(true);
                    setText(true);
                  }}
                />
              </Space>
            )}
            {row?.role !== 'admin' && row?.role !== 'user' && (
              <Button
                icon={<LoginOutlined />}
                onClick={() => {
                  const typeState =
                    row?.role === 'seller'
                      ? modalType.SELLER_LOGIN
                      : row?.role === 'master'
                      ? modalType.MASTER_LOGIN
                      : row?.role === 'deliveryman'
                      ? modalType.DELIVERYMAN_LOGIN
                      : row?.role === 'moderator'
                      ? modalType.MODERATOR_LOGIN
                      : row?.role === 'manager'
                      ? modalType.MANAGER_LOGIN
                      : modalType.DELETE;
                  setModalTypeState(typeState);
                  setIsModalVisible(true);
                  setId(row.uuid);
                }}
              />
            )}
          </Space>
        );
      },
    },
  ]);

  const goToAdduser = (e) => {
    dispatch(
      addMenu({
        id: 'user-add-role',
        url: `user/add/${e}`,
        name: t(`add.${e}`),
      }),
    );
    navigate(`/user/add/${e}`);
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
        dispatch(fetchUsers(paramsData));
        setIsModalVisible(false);
        setText([]);
      })
      .finally(() => {
        setId(null);
        setLoadingBtn(false);
      });
  };

  const handleClear = (user) => {
    if (!user) return;
    batch(() => {
      dispatch(clearMenu());
      dispatch(setCurrentChat(null));
      dispatch(setUserData(user));
      dispatch(fetchRestSettings({}));
      dispatch(disableRefetch(activeMenu));
    });
  };

  const loginAsSeller = () => {
    setLoadingBtn(true);
    userService
      .loginAs(id)
      .then((res) => {
        const user = {
          fullName: res.data.user.firstname + ' ' + res.data.user.lastname,
          role: 'seller',
          urls: menuData.seller,
          img: res.data.user.img,
          token: res.data.access_token,
          email: res.data.user.email,
          id: res.data.user.id,
          shop_id: res.data.user?.shop?.id,
          walledId: res.data?.user?.wallet?.id,
        };

        handleClear(user);
        localStorage.setItem('token', res.data.access_token);
        dispatch(fetchMyShop({}));
        navigate('/dashboard');
      })
      .finally(() => setIsModalVisible(false));
  };

  const loginAsModerator = () => {
    setLoadingBtn(true);
    userService
      .loginAs(id)
      .then((res) => {
        const user = {
          fullName: res.data.user.firstname + ' ' + res.data.user.lastname,
          role: 'moderator',
          urls: menuData.moderator,
          img: res.data.user.img,
          token: res.data.access_token,
          email: res.data.user.email,
          id: res.data.user.id,
          shop_id: res.data.user?.shop?.id,
          walledId: res.data?.user?.wallet?.id,
        };

        handleClear(user);
        localStorage.setItem('token', res.data.access_token);
        navigate('/dashboard');
      })
      .finally(() => setIsModalVisible(false));
  };

  const loginAsManager = () => {
    setLoadingBtn(true);
    userService
      .loginAs(id)
      .then((res) => {
        const user = {
          fullName: res.data.user.firstname + ' ' + res.data.user.lastname,
          role: 'manager',
          urls: menuData.manager,
          img: res.data.user.img,
          token: res.data.access_token,
          email: res.data.user.email,
          id: res.data.user.id,
          shop_id: res.data.user?.shop?.id,
          walledId: res.data?.user?.wallet?.id,
        };

        handleClear(user);
        localStorage.setItem('token', res.data.access_token);
        navigate('/dashboard');
      })
      .finally(() => setIsModalVisible(false));
  };

  const loginAsDeliveryman = () => {
    setLoadingBtn(true);
    userService
      .loginAs(id)
      .then((res) => {
        const user = {
          fullName:
            res.data?.user?.firstname ||
            '' + ' ' + res.data?.user?.lastname ||
            '',
          role: 'deliveryman',
          urls: menuData.deliveryman,
          img: res.data?.user?.img,
          token: res.data?.access_token,
          email: res.data?.user.email,
          id: res.data?.user?.id,
          shop_id: res.data?.user?.shop?.id,
          walledId: res.data?.user?.wallet?.id,
        };

        handleClear(user);
        localStorage.setItem('token', res.data.access_token);
        navigate('/dashboard');
      })
      .finally(() => {
        setIsModalVisible(false);
        setLoadingBtn(false);
      });
  };

  const loginAsMaster = () => {
    setLoadingBtn(true);
    userService
      .loginAs(id)
      .then((res) => {
        const user = {
          fullName:
            res.data?.user?.firstname ||
            '' + ' ' + res.data?.user?.lastname ||
            '',
          role: 'master',
          urls: menuData.master,
          img: res.data?.user?.img,
          token: res.data?.access_token,
          email: res.data?.user.email,
          id: res.data?.user?.id,
          shop_id: res.data?.user?.shop?.id,
          walledId: res.data?.user?.wallet?.id,
        };

        handleClear(user);
        serviceMasterService
          .show(user.id)
          .then((res) => {
            dispatch(updateUser(res.data));
            dispatch(disableRefetch(activeMenu));
          })
          .catch((err) => {
            throw err;
          });
        localStorage.setItem('token', res.data.access_token);
        navigate('/dashboard');
      })
      .finally(() => {
        setLoadingBtn(false);
        setIsModalVisible(false);
      });
  };

  const fetchAllRoles = () => {
    setTabsLoading(true);
    userService
      .getRoles()
      .then(({ data }) => {
        setRoles(data?.map((role) => role?.name));
      })
      .finally(() => setTabsLoading(false));
  };

  useEffect(() => {
    if (activeMenu.refetch && !loadingBtn) {
      batch(() => {
        dispatch(fetchUsers(paramsData));
        dispatch(disableRefetch(activeMenu));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMenu.refetch]);

  useDidUpdate(() => {
    if (!loadingBtn) {
      dispatch(fetchUsers(paramsData));
    }
  }, [activeMenu.data]);

  useEffect(() => {
    if (!loadingBtn) {
      fetchAllRoles();
    }
  }, []);

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
      setModalTypeState(modalType.DELETE);
      setIsModalVisible(true);
      setText(false);
    }
  };

  return (
    <Card
      title={t('users')}
      extra={
        <Space wrap>
          <DeleteButton size='' onClick={allDelete}>
            {t('delete.selected')}
          </DeleteButton>
          <FilterColumns columns={columns} setColumns={setColumns} />
        </Space>
      }
      loading={tabsLoading}
    >
      <div className='d-flex justify-content-between mb-3'>
        <SearchInput
          placeholder={t('search')}
          className='w-25'
          handleChange={(e) => {
            handleFilter({ search: e });
          }}
          defaultValue={activeMenu.data?.search}
          resetSearch={!activeMenu.data?.search}
        />
      </div>
      <Tabs
        scroll={{ x: true }}
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
      {immutable !== 'admin' && immutable !== 'seller' ? (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type='primary'
            icon={<PlusCircleOutlined />}
            onClick={() => goToAdduser(immutable)}
            className='mr-2'
          >
            {t(`add.${immutable}`)}
          </Button>
        </div>
      ) : null}
      <Table
        scroll={{ x: true }}
        rowSelection={rowSelection}
        columns={columns?.filter((item) => item.is_show)}
        dataSource={users}
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
        click={
          modalTypeState === modalType.SELLER_LOGIN
            ? loginAsSeller
            : modalTypeState === modalType.MASTER_LOGIN
            ? loginAsMaster
            : modalTypeState === modalType.DELIVERYMAN_LOGIN
            ? loginAsDeliveryman
            : modalTypeState === modalType.MODERATOR_LOGIN
            ? loginAsModerator
            : modalTypeState === modalType.MANAGER_LOGIN
            ? loginAsManager
            : userDelete
        }
        text={
          modalTypeState === modalType.SELLER_LOGIN
            ? t('do.you.want.login.as.this.seller')
            : modalTypeState === modalType.MASTER_LOGIN
            ? t('do.you.want.login.as.this.master')
            : modalTypeState === modalType.DELIVERYMAN_LOGIN
            ? t('do.you.want.login.as.this.deliveryman')
            : modalTypeState === modalType.MODERATOR_LOGIN
            ? t('do.you.want.login.as.this.moderator')
            : modalTypeState === modalType.MANAGER_LOGIN
            ? t('do.you.want.login.as.this.manager')
            : text
            ? t('delete')
            : t('all.delete')
        }
        loading={loadingBtn}
        setText={setId}
      />
      {uuid && <UserShowModal uuid={uuid} handleCancel={() => setUuid(null)} />}
      {userRole && (
        <UserRoleModal data={userRole} handleCancel={() => setUserRole(null)} />
      )}
    </Card>
  );
}
