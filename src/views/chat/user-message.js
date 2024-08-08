import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Message } from '@chatscope/chat-ui-kit-react';
import { fetchRepliedMessage } from '../../firebase';
import { useSelector } from 'react-redux';
import ReplyMessage from './replyMessage';
import { Dropdown, Menu } from 'antd';
import { FaReply } from 'react-icons/fa';

const UserMessage = ({ data, onActionMessage }) => {
  const { time, message, type, replyDocId } = data;
  const currentChatId = useSelector((state) => state.chat?.currentChat?.chatId);
  const [replyMessage, setReplyMessage] = useState(null);

  const handleMenuClick = ({ key }) => {
    onActionMessage(key);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key='reply' icon={<FaReply />}>
        <div className='w-100'>Reply</div>
      </Menu.Item>
    </Menu>
  );

  useEffect(() => {
    if (replyDocId) {
      return fetchRepliedMessage(replyDocId, currentChatId, setReplyMessage);
    }
  }, []);
  return (
    <div className='user-sms-wrapper'>
      <div className={`user-message ${type === 'image' && 'chat-image'}`}>
        <Dropdown overlay={menu} trigger={['contextMenu']}>
          <div>
            {replyMessage && <ReplyMessage replyMessage={replyMessage} />}
            {type === 'image' ? (
              <Message
                type='image'
                model={{
                  direction: 'incoming',
                  payload: {
                    src: message,
                    alt: 'Image',
                    width: '100%',
                    height: '100%',
                  },
                }}
              />
            ) : (
              <div className='text'>{message}</div>
            )}
          </div>
        </Dropdown>

        <div className='time'>{moment(new Date(time)).format('HH:mm')}</div>
      </div>
    </div>
  );
};

export default UserMessage;
