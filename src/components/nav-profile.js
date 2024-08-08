import React, { useState } from 'react';
import { Menu, Dropdown, Modal } from 'antd';
import { EditOutlined, LogoutOutlined } from '@ant-design/icons';
import getAvatar from 'helpers/getAvatar';
import { useTranslation } from 'react-i18next';
import UserModal from './user-modal';
import { batch, shallowEqual, useSelector, useDispatch } from 'react-redux';
import { clearUser } from 'redux/slices/auth';
import { clearMenu } from 'redux/slices/menu';
import { setCurrentChat } from 'redux/slices/chat';
import { useNavigate } from 'react-router-dom';
import authService from 'services/auth';
import { clearCart, clearCartShops } from 'redux/slices/cart';
import { clearServicesState } from 'redux/slices/services';

export default function NavProfile({ user }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userModal, setUserModal] = useState(false);

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  const { firebaseToken } = useSelector((state) => state.auth, shallowEqual);

  const handleOk = () => {
    authService.logout({ token: firebaseToken }).then((res) => {
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
    });
  };

  const profileMenu = (
    <Menu>
      <Menu.Item
        key='edit.profile'
        onClick={(e) => setUserModal(true)}
        icon={<EditOutlined />}
      >
        {t('edit.profile')}
      </Menu.Item>
      <Menu.Item
        key='logout'
        onClick={(e) => showModal()}
        icon={<LogoutOutlined />}
      >
        {t('logout')}
      </Menu.Item>
    </Menu>
  );
  return (
    <>
      <Dropdown placement='bottom' overlay={profileMenu} trigger={['click']}>
        <div className='sidebar-brand cursor-pointer'>
          <img
            className='sidebar-logo'
            src={getAvatar(user.img)}
            alt={user.fullName}
          />
          <div className='sidebar-brand-text'>
            <h5 className='user-name fw-bold'>{user.fullName}</h5>
            <h6 className='user-status'>{user.role}</h6>
          </div>
        </div>
      </Dropdown>
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
      {userModal && (
        <UserModal
          visible={userModal}
          handleCancel={() => setUserModal(false)}
        />
      )}
    </>
  );
}
