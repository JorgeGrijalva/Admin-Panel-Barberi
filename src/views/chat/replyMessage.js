function ReplyMessage({replyMessage}) {
    return <div className='reply-message'>
        {replyMessage.type !== 'image' ? <p className='reply-message__text'>{replyMessage.message}</p> :
            <img className="reply-message__image" src={replyMessage.message} alt={replyMessage.message}/>}
    </div>
}

export default ReplyMessage