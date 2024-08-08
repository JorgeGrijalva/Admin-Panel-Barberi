import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {Message} from '@chatscope/chat-ui-kit-react';
import {IoCheckmarkOutline, IoCheckmarkDone} from "react-icons/io5";
import {FaReply} from "react-icons/fa";
import {MdOutlineModeEditOutline} from "react-icons/md";
import {RiDeleteBin6Fill} from "react-icons/ri";
import {Dropdown, Menu, Space} from "antd";
import {useSelector} from "react-redux";
import {fetchRepliedMessage} from "../../firebase";
import ReplyMessage from "./replyMessage";

const AdminMessage = ({data, onActionMessage, onDeleteMessage}) => {
    const {type, time, message, status = '', read, replyDocId} = data;
    const currentChatId = useSelector((state) => state.chat?.currentChat?.chatId)

    const [replyMessage, setReplyMessage] = useState(null);
    const handleMenuClick = ({key}) => {
       switch (key) {
           case 'delete':
               return onDeleteMessage();
           default:
               return onActionMessage(key)
       }
    }
    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="reply" icon={<FaReply/>}>Reply</Menu.Item>
            {type !== 'image' && <Menu.Item key="edit" icon={<MdOutlineModeEditOutline/>}>Edit</Menu.Item>}
            <Menu.Item key="delete" icon={<RiDeleteBin6Fill/>} danger>Delete</Menu.Item>
        </Menu>
    );
    useEffect(() => {
        if (replyDocId) {
            return fetchRepliedMessage(replyDocId, currentChatId, setReplyMessage)
        }
    }, []);
    return (
        <div className='admin-message-wrapper'>
            <div className={`admin-message ${type === 'image' && 'chat-image'}`}>
                <Dropdown
                    overlay={menu}
                    trigger={['contextMenu']}>
                    <div>
                        {replyMessage && <ReplyMessage replyMessage={replyMessage}/>}
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
                        ) : <div className='text'>{message}</div>}
                    </div>
                </Dropdown>

                <div className='time'>{moment(new Date(time)).format('HH:mm')}</div>
                <span className='double-check'>
          {read ? <IoCheckmarkDone size={16}/> : <IoCheckmarkOutline size={16}/>}
        </span>
            </div>
        </div>
    );
};

export default AdminMessage;
