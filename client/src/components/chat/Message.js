// Message.jsx
import React from 'react';
import { Avatar } from 'antd';
import moment from 'moment';
import 'moment/locale/ru';

moment.locale('ru');

const Message = ({ message, currentUserId }) => {
    const isCurrentUser = message.senderId === currentUserId;
    console.log(message)

    return (
        <div className={`flex mb-5 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
            {!isCurrentUser && (
                <Avatar
                    src={process.env.REACT_APP_API_URL + 'static/' + message.sender?.avatar}
                    className="mr-3 self-start mt-1"
                />
            )}

            <div className={`max-w-[80%] flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-3 rounded-2xl ${
                    isCurrentUser
                        ? 'bg-blue-50 rounded-br-none'
                        : 'bg-gray-100 rounded-bl-none'
                }`}>
                    {message.messageType === 'file' || message.type === 'file' ? (
                        <a
                            href={`${process.env.REACT_APP_API_URL}/api/chat/files/${message.textOrPathToFile}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700 flex items-center"
                        >
                            <span className="mr-2">📎</span>
                            <span>Файл</span>
                        </a>
                    ) :  (
                        <p className="text-gray-800">{message.textOrPathToFile}</p>
                    ) }
                </div>

                <p className={`text-xs text-gray-400 mt-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                    {moment(message.createdAt).format('HH:mm')}
                </p>
            </div>

            {isCurrentUser && (
                <Avatar
                    src={process.env.REACT_APP_API_URL + 'static/' + message.sender?.avatar}
                    className="ml-3 self-start mt-1"
                />
            )}
        </div>
    );
};

export default Message;