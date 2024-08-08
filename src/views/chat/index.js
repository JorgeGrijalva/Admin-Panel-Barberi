import React, { useContext, useEffect, useRef, useState } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  Sidebar,
  MainContainer,
  ChatContainer,
  MessageList,
  MessageInput,
  Avatar,
  ConversationList,
  Conversation,
  ConversationHeader,
} from '@chatscope/chat-ui-kit-react';
import Channel from './channel';
import {
  deleteChat,
  deleteMessage,
  editMessage,
  fetchMessages,
  getChat,
  sendMessage,
} from '../../firebase';
import { batch, shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  removeCurrentChat,
  setAuthUserId,
  setChatInitialized,
  setChats,
  setCurrentChat,
  setMessages,
  setMessagesLoading,
  setUnsubscriber,
} from '../../redux/slices/chat';
import { getMessages } from '../../redux/selectors/chatSelector';
import { scrollTo } from '../../helpers/scrollTo';
import { useTranslation } from 'react-i18next';
// import {DeleteOutlined, MoreOutlined} from '@ant-design/icons';
// import {Dropdown, Menu} from 'antd';
import CustomModal from '../../components/modal';
import { Context } from '../../context/context';
import getAvatar from '../../helpers/getAvatar';
import UploadMedia from './upload-media';
import { toast } from 'react-toastify';
import { SUPPORTED_FORMATS } from '../../configs/app-global';
import MessageActionIndicator from './message-action-indicator';

let chatUnsubscribe;

export default function Chat() {
  const { t } = useTranslation();
  const inputRef = useRef();
  const nextRef = useRef();
  const dispatch = useDispatch();
  const messageEndRef = useRef();
  const { setIsModalVisible } = useContext(Context);
  const [file, setFile] = useState('');
  const [url, setUrl] = useState('');
  const [modal, setModal] = useState(false);
  const currentUserId = useSelector((state) => state.auth.user.id);
  const { chats, currentChat, messagesLoading, chatInitialized, authUserId } =
    useSelector((state) => state.chat, shallowEqual);
  const groupMessages = useSelector(
    (state) => getMessages(state.chat.messages),
    shallowEqual,
  );
  const [newMessage, setNewMessage] = useState('');
  const [actionMessage, setActionMessage] = useState({
    actionType: null,
    message: null,
  });

  const messageUnsubscribeRef = useRef();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef, currentChat]);

  useEffect(() => {
    if (!chatInitialized) {
      chatUnsubscribe?.();
      chatUnsubscribe = getChat(currentUserId);
      batch(() => {
        dispatch(setAuthUserId(currentUserId));
        dispatch(setChatInitialized(true));
      });
    } else if (currentUserId !== authUserId) {
      chatUnsubscribe?.();
      batch(() => {
        dispatch(removeCurrentChat());
        dispatch(setChats([]));
        dispatch(setMessages([]));
        dispatch(setAuthUserId(currentUserId));
      });
      chatUnsubscribe = getChat(currentUserId);
    }
  }, [currentUserId]);

  const handleOnChange = (value) => {
    setNewMessage(value);
  };

  const scrollToBottom = () => {
    const topPosition = messageEndRef.current.offsetTop;
    const container = document.querySelector(
      '.message-list .scrollbar-container',
    );
    scrollTo(container, topPosition - 30, 600);
  };

  const handleOnSubmit = async (data) => {
    setNewMessage('');
    if (actionMessage.actionType === 'reply')
      data.replyDocId = actionMessage.message.id;
    if (actionMessage.actionType === 'edit') {
      await editMessage(currentUserId, currentChat.chatId, data, actionMessage);
    } else {
      scrollToBottom();
      await sendMessage(currentUserId, currentChat.chatId, data);
    }
    clearActionMessage();
  };

  const handleChatClick = (chat) => {
    if (messageUnsubscribeRef.current) messageUnsubscribeRef.current();
    batch(() => {
      dispatch(setMessagesLoading(true));
      dispatch(setCurrentChat(chat));
    });
    messageUnsubscribeRef.current = fetchMessages(chat.chatId, currentUserId);
    clearActionMessage();
  };

  const deleteCurrentChat = async () => {
    await deleteChat(currentChat.chatId);
    groupMessages.forEach((group) => {
      group.messages.forEach((item) =>
        deleteMessage(currentChat.chatId, item.id),
      );
    });
    messageUnsubscribeRef.current?.();
    batch(() => {
      dispatch(removeCurrentChat());
      dispatch(setMessages([]));
    });
    setIsModalVisible(false);
    clearActionMessage();
  };

  function handleFile(event) {
    if (!SUPPORTED_FORMATS.includes(event.target.files[0].type)) {
      toast.error('Supported only image formats!');
    } else {
      setFile(event.target.files[0]);
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setUrl(reader.result);
          setModal(true);
        }
      };
      reader?.readAsDataURL(event.target.files[0]);
    }
  }

  const onAttachClick = () => {
    nextRef.current.click();
  };

  const clearActionMessage = () => {
    setActionMessage({ actionType: null, message: null });
    if (newMessage) setNewMessage('');
    inputRef.current?.focus();
  };

  const handleActionMessage = (actionType, message) => {
    setActionMessage({ actionType, message });
    if (actionType === 'edit') {
      setNewMessage(message.message);
    }
    inputRef.current?.focus();
  };

  const handleDelete = (message) => {
    const messageBeforeLastMessage =
      groupMessages?.at(-1)?.messages?.at(-2) ||
      groupMessages?.at(-2)?.messages?.at(-1);
    deleteMessage(currentChat.chatId, message, messageBeforeLastMessage).then();
  };

  return (
    <div style={{ height: '80vh' }}>
      <input
        type='file'
        ref={nextRef}
        onChange={handleFile}
        accept='image/jpg, image/jpeg, image/png, image/svg+xml, image/svg'
        className='d-none'
      />
      <MainContainer responsive className='chat-container rounded'>
        <Sidebar position='left' scrollable={false} className='chat-sidebar'>
          <ConversationList>
            {chats
              .filter((item) => item.user.id !== undefined)
              .map((chat, idx) => {
                return (
                  <Conversation
                    onClick={() => {
                      handleChatClick(chat);
                    }}
                    key={idx}
                    name={
                      chat.user.firstname + ' ' + (chat.user.lastname || '')
                    }
                    info={chat.lastMessage}
                  >
                    <Avatar
                      src={getAvatar(chat.user?.img)}
                      name={chat.user?.firstname}
                    />
                  </Conversation>
                );
              })}
          </ConversationList>
        </Sidebar>

        <ChatContainer className='chat-container'>
          {currentChat ? (
            <ConversationHeader className='chat-header'>
              <ConversationHeader.Back />
              <Avatar
                src={getAvatar(currentChat?.user?.img)}
                name={currentChat?.user?.firstname}
              />
              <ConversationHeader.Content
                userName={`${currentChat?.user?.firstname} ${
                  currentChat?.user?.lastname || ''
                }`}
              />
              {/*  <ConversationHeader.Actions>*/}
              {/*      <Dropdown*/}
              {/*          overlay={<Menu*/}
              {/*              items={[{*/}
              {/*                  key: '1',*/}
              {/*                  label: <div>{t('delete.chat')}</div>,*/}
              {/*                  icon: <DeleteOutlined/>,*/}
              {/*                  onClick: () => setIsModalVisible(true),*/}
              {/*              },]}*/}
              {/*          />}*/}
              {/*      >*/}
              {/*<span className='more-btn'>*/}
              {/*  <MoreOutlined style={{fontSize: 22}}/>*/}
              {/*</span>*/}
              {/*      </Dropdown>*/}
              {/*  </ConversationHeader.Actions>*/}
            </ConversationHeader>
          ) : (
            ''
          )}
          <MessageList loading={messagesLoading} className='message-list'>
            <Channel
              groupMessages={groupMessages}
              messageEndRef={messageEndRef}
              handleActionMessage={handleActionMessage}
              handleDelete={handleDelete}
            />
            {actionMessage.message && (
              <MessageActionIndicator
                actionMessage={actionMessage}
                cancelMessageAction={clearActionMessage}
              />
            )}
          </MessageList>
          {groupMessages.length ? (
            <MessageInput
              ref={inputRef}
              value={newMessage}
              onChange={handleOnChange}
              onSend={(inputVal) =>
                handleOnSubmit({
                  message: inputVal
                    .replace(/\&nbsp;/g, '')
                    .replace(/<[^>]+>/g, '')
                    .trim(),
                })
              }
              placeholder='Message'
              className='chat-input'
              onAttachClick={onAttachClick}
            />
          ) : null}
        </ChatContainer>
      </MainContainer>
      <UploadMedia
        modal={modal}
        url={url}
        setModal={setModal}
        file={file}
        handleOnSubmit={handleOnSubmit}
      />
      <CustomModal click={deleteCurrentChat} text={t('delete.chat')} />
    </div>
  );
}
