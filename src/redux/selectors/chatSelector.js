import moment from 'moment';
import {store} from "../store";


export function getMessages(messages) {
    const groups = messages
        .reduce((groups, item) => {
            const date = moment(item.time).format('DD-MM-YYYY');
            if (!groups[date]) {
                groups[date] = [];
            }
            const {auth} = store.getState();
            const messageData = {
                time: item.time,
                sender: auth?.user?.id !== item?.senderId,
                read: item.read,
                id: item.id,
                replyDocId: item.replyDocId,
                message: item.message,
                type: item.type,
                isLast: item.isLast
            }
            groups[date].push(messageData);
            return groups;
        }, {});
    const groupArrays = Object.keys(groups).map((date) => {
        return {
            date,
            messages: groups[date],
        };
    });
    return groupArrays;
}

export function getAllUnreadMessages(messages) {
    return messages.filter((item) => item.unread && Boolean(item.sender));
}

export function getChatDetails(chat, messages) {
    const chatMessages = messages.filter((item) => item.chat_id === chat.id);
    const lastMessage = chatMessages[chatMessages.length - 1];
    const unreadMessages = chatMessages.filter(
        (item) => item.unread && Boolean(item.sender)
    );

    return {lastMessage, unreadMessages};
}
