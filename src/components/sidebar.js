import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Divider, Menu, Space, Layout, Modal, Input } from 'antd';
import { shallowEqual, useDispatch, useSelector, batch } from 'react-redux';
import { addMenu, clearMenu, setMenu } from '../redux/slices/menu';
import { useTranslation } from 'react-i18next';
import LangModal from './lang-modal';
import getSystemIcons from '../helpers/getSystemIcons';
import NotificationBar from './notificationBar';
import { navCollapseTrigger } from 'redux/slices/theme';
import ThemeConfigurator from './theme-configurator';
import i18n from 'configs/i18next';
import { RiArrowDownSFill } from 'react-icons/ri';
import Scrollbars from 'react-custom-scrollbars';
import SubMenu from 'antd/lib/menu/SubMenu';
import NavProfile from './nav-profile';
import { clearUser } from 'redux/slices/auth';
import { setCurrentChat } from 'redux/slices/chat';
import { data as allRoutes } from 'configs/menu-config';
import useDidUpdate from 'helpers/useDidUpdate';
import { clearCart, clearCartShops } from 'redux/slices/cart';
import { clearServicesState } from 'redux/slices/services';
const { Sider } = Layout;

const Sidebar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useSelector((state) => state.auth, shallowEqual);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { system_refund, payment_type } = useSelector(
    (state) => state.globalSettings.settings,
    shallowEqual,
  );
  const { navCollapsed } = useSelector(
    (state) => state.theme.theme,
    shallowEqual,
  );
  const { languages } = useSelector((state) => state.formLang, shallowEqual);
  const dispatch = useDispatch();
  const [langModal, setLangModal] = useState(false);
  const { myShop } = useSelector((state) => state.myShop, shallowEqual);
  const { theme } = useSelector((state) => state.theme, shallowEqual);
  const parcelMode = useMemo(
    () => !!theme.parcelMode && user?.role === 'admin',
    [theme, user],
  );
  const routes = useMemo(() => filterUserRoutes(user.urls), [user]);
  const active = routes?.find((item) => pathname.includes(item.url));
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState(parcelMode ? allRoutes.parcel : routes);

  useDidUpdate(() => {
    if (parcelMode) {
      setData(allRoutes.parcel);
    } else {
      setData(routes);
    }
  }, [theme, user]);

  const addNewItem = (item) => {
    if (typeof item.url === 'undefined') return;
    if (item.name === 'logout') {
      setIsModalVisible(true);
      return;
    }
    const data = {
      ...item,
      icon: undefined,
      children: undefined,
      refetch: true,
    };
    dispatch(setMenu(data));
    navigate(`/${item.url}`);
  };

  function filterUserRoutes(routes) {
    let list = routes;
    if (myShop.type === 'shop') {
      list = routes?.filter((item) => item?.name !== 'brands');
    }
    if (payment_type === 'admin') {
      list = routes?.filter((item) => item?.name !== 'payments');
    }
    if (system_refund === '0') {
      list = routes?.filter((item) => item?.name !== 'refunds');
    }
    return list;
  }

  const menuTrigger = (event) => {
    event.stopPropagation();
    dispatch(navCollapseTrigger());
  };

  const addMenuItem = (payload) => {
    const data = { ...payload, icon: undefined };
    dispatch(addMenu(data));
  };

  const handleOk = () => {
    batch(() => {
      dispatch(clearUser());
      dispatch(clearMenu());
      dispatch(setCurrentChat(null));
      dispatch(clearCart());
      dispatch(clearCartShops());
      dispatch(clearServicesState());
    });
    setIsModalVisible(false);
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleCancel = () => setIsModalVisible(false);

  function getOptionList(routes) {
    const optionTree = [];
    routes?.map((item) => {
      optionTree.push(item);
      item?.submenu?.map((sub) => {
        optionTree.push(sub);
        sub?.children?.map((child) => {
          optionTree.push(child);
        });
      });
    });
    return optionTree;
  }

  const optionList = getOptionList(data);

  const menuList =
    searchTerm.length > 0
      ? optionList.filter((input) =>
          t(input?.name ?? '')
            .toUpperCase()
            .includes(searchTerm.toUpperCase()),
        )
      : data;

  return (
    <>
      <Sider
        className='navbar-nav side-nav'
        width={250}
        collapsed={navCollapsed}
        style={{ height: '100vh', top: 0 }}
      >
        <NavProfile user={user} />
        <div className='menu-collapse' onClick={menuTrigger}>
          <MenuFoldOutlined />
        </div>
        {navCollapsed && (
          <div className='flex justify-content-center'>
            <ThemeConfigurator />
          </div>
        )}

        {!navCollapsed ? (
          <Space className='mx-4 mt-2 d-flex justify-content-between'>
            <span className='icon-button' onClick={() => setLangModal(true)}>
              <img
                className='globalOutlined'
                src={
                  languages.find((item) => item.locale === i18n.language)?.img
                }
                alt={user.fullName}
              />
              <span className='default-lang'>{i18n.language}</span>
              <RiArrowDownSFill size={15} />
            </span>
            <span className='d-flex'>
              <ThemeConfigurator />
              <NotificationBar />
            </span>
          </Space>
        ) : (
          <div className='menu-unfold' onClick={menuTrigger}>
            <MenuUnfoldOutlined />
          </div>
        )}
        <Divider style={{ margin: '10px 0' }} />

        {!navCollapsed && (
          <span className='mt-2 mb-2 d-flex justify-content-center'>
            <Input
              placeholder='search'
              style={{ width: '90%' }}
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
              prefix={<SearchOutlined />}
            />
          </span>
        )}

        <Scrollbars
          autoHeight
          autoHeightMin={window.innerHeight > 969 ? '80vh' : '77vh'}
          autoHeightMax={window.innerHeight > 969 ? '80vh' : '77vh'}
          autoHide
        >
          <Menu
            theme='light'
            mode='inline'
            defaultSelectedKeys={[String(active?.id)]}
            defaultOpenKeys={
              !navCollapsed ? data?.map((i, idx) => i.id + '_' + idx) : []
            }
          >
            {menuList?.map((item, idx) =>
              item.submenu?.length > 0 ? (
                <SubMenu
                  key={item.id + '_' + idx}
                  title={t(item.name)}
                  icon={getSystemIcons(item.icon)}
                >
                  {item.submenu.map((submenu, idy) =>
                    submenu.children?.length > 0 ? (
                      <SubMenu
                        defaultOpen={true}
                        key={submenu.id + '_' + idy}
                        title={t(submenu.name)}
                        icon={getSystemIcons(submenu.icon)}
                        onTitleClick={() => addNewItem(submenu)}
                      >
                        {submenu.children?.map((sub, idk) => (
                          <Menu.Item
                            key={'child' + idk + sub.id}
                            icon={getSystemIcons(sub.icon)}
                          >
                            <Link
                              to={'/' + sub.url}
                              onClick={() => addMenuItem(sub)}
                            >
                              <span>{t(sub.name)}</span>
                            </Link>
                          </Menu.Item>
                        ))}
                      </SubMenu>
                    ) : (
                      <Menu.Item
                        key={submenu.id}
                        icon={getSystemIcons(submenu.icon)}
                      >
                        <Link
                          to={'/' + submenu.url}
                          onClick={() => addNewItem(submenu)}
                        >
                          <span>{t(submenu.name)}</span>
                        </Link>
                      </Menu.Item>
                    ),
                  )}
                </SubMenu>
              ) : (
                <Menu.Item key={item.id} icon={getSystemIcons(item.icon)}>
                  <Link to={'/' + item.url} onClick={() => addNewItem(item)}>
                    <span>{t(item.name)}</span>
                  </Link>
                </Menu.Item>
              ),
            )}
          </Menu>
        </Scrollbars>
      </Sider>

      {langModal && (
        <LangModal
          visible={langModal}
          handleCancel={() => setLangModal(false)}
        />
      )}

      <Modal
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
      >
        <LogoutOutlined
          style={{ fontSize: '25px', color: '#08c' }}
          theme='primary'
        />
        <span className='ml-2'>{t('leave.site')}</span>
      </Modal>
    </>
  );
};
export default Sidebar;
