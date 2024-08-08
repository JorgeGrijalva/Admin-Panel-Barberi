import React from 'react';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { NavLink } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addMenu } from '../../redux/slices/menu';
import { Badge } from 'antd';
import { useTranslation } from 'react-i18next';
import { getAllUnreadMessages } from '../../redux/selectors/chatSelector';

const ChatIcons = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const goToChat = () => {
    dispatch(
      addMenu({
        url: 'chat',
        id: 'chat',
        name: t('chat'),
      })
    );
  };
  const { user } = useSelector((state) => state.auth, shallowEqual);
  const { myShop } = useSelector((state) => state.myShop, shallowEqual);
  const unreadMessages = useSelector(
    (state) => getAllUnreadMessages(state.chat.messages),
    shallowEqual
  );
  return (
    <NavLink onClick={goToChat} to='/chat' className='chat'>
      <Badge
        count={
          unreadMessages.filter((item) =>
            user.role == 'admin'
              ? item.roleId == 'admin'
              : user.role == 'seller'
              ? item.roleId == myShop.id
              : item.roleId == user.id
          ).length
        }
      >
        <IoChatbubbleEllipsesOutline className='chat-icon' />
      </Badge>
    </NavLink>
  );
};

export default ChatIcons;
