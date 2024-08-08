import {IoCloseCircle} from "react-icons/io5";
function MessageActionIndicator({actionMessage, cancelMessageAction}) {
    return <div style={{top: `calc(100% - ${actionMessage.message.type === 'image' ? 88 : 53}px)`}} className='message-actions-wrapper'>
        <div className="message-actions__content">
            <span className="message-actions__type">{actionMessage.actionType}</span>
            {actionMessage.message.type === 'image' ?
                <img className='message-actions__image' alt={actionMessage.message.message} src={actionMessage.message.message}/> :
                <p className="message-actions__message">
                    {actionMessage.message.message}
                </p>
            }
        </div>
        <button className='message-actions__close-btn' onClick={cancelMessageAction}>
            <IoCloseCircle size={20}/>
        </button>
    </div>
}

export default MessageActionIndicator;