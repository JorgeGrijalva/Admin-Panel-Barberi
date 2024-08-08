import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CloseOutlined, ReloadOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { setActiveMenu, removeFromMenu, setRefetch } from 'redux/slices/menu';
import { shallowEqual, useDispatch } from 'react-redux';
import { Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
const { TabPane } = Tabs;

const TabMenu = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const menu = useSelector((state) => state.menu, shallowEqual);

  const selectTab = (item) => {
    dispatch(setActiveMenu(item));
    navigate(`/${item.url}`);
  };

  const deleteTab = (event, item) => {
    event.preventDefault();
    event.stopPropagation();
    const index = menu.menuItems.indexOf(item);
    if (!index) {
      toast.warning('The menu tab does not close');
      return;
    }

    if (menu.activeMenu?.id !== item.id) {
      dispatch(removeFromMenu({ ...item, nextUrl: menu.activeMenu.url }));
      return;
    }
    const newPath = menu.menuItems.filter((el) => el.url !== item.url);
    const isHaveOtherTabs = newPath.length - 1 > index;
    let currentPath;
    if (isHaveOtherTabs) {
      currentPath = newPath[index];
    } else {
      currentPath = newPath[newPath.length - 1];
    }
    dispatch(removeFromMenu({ ...item, nextUrl: currentPath.url }));
    navigate(`/${currentPath.url}`);
  };

  const reloadPage = (event, item) => {
    event.preventDefault();
    event.stopPropagation();
    dispatch(setRefetch(item));
    if (item.id !== menu.activeMenu.id) {
      navigate(`/${item.url}`);
    }
  };

  useEffect(() => {
    console.log('menu mounting...');
    if (!pathname.includes(menu.activeMenu.url)) {
      window.location.replace(`/${menu.activeMenu.url}`);
    }
  }, []);

  return (
    <div className='navbar-default'>
      <Tabs activeKey={menu.activeMenu?.url} type='card'>
        {menu.menuItems.map((item) => (
          <TabPane
            tab={
              <div onClick={() => selectTab(item)} className='nav-link'>
                <ReloadOutlined
                  onClick={(event) => reloadPage(event, item)}
                  className='reload-button'
                />
                <span className='nav-text'> {t(item.name)}</span>
                <CloseOutlined
                  onClick={(event) => deleteTab(event, item)}
                  className='close-button'
                />
              </div>
            }
            key={item.url}
          />
        ))}
      </Tabs>
    </div>
  );
};

export default TabMenu;
