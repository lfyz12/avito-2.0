// ChatItem.jsx
import React from 'react';
import { Avatar } from 'antd';
import moment from 'moment';
import 'moment/locale/ru';

moment.locale('ru');

const ChatItem = ({ chat, currentUserId, onClick }) => {
    const lastMessage = chat.Messages?.[0];
    const property = chat.Property;

    return (
        <div
            className="flex items-center p-4 hover:bg-blue-50 transition-colors cursor-pointer border-b border-gray-100"
            onClick={() => onClick(chat)}
        >
            <div className="relative">
                <Avatar
                    src={process.env.REACT_APP_API_URL + 'static/' + property.photos?.[0]}
                    shape="square"
                    className="!w-14 !h-14 !rounded-lg"
                />
                <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {chat.Messages?.length || 0}
                </div>
            </div>

            <div className="ml-3 flex-grow min-w-0">
                <div className="flex justify-between items-start">
                    <div>
                        <span className="font-semibold text-gray-900 block truncate">
                            {property.title}
                        </span>
                        <span className="text-xs text-gray-500">
                            {property.location}
                        </span>
                    </div>

                    {lastMessage && (
                        <span className="text-xs text-gray-400 whitespace-nowrap mt-0.5">
                            {moment(lastMessage.createdAt).fromNow(true)}
                        </span>
                    )}
                </div>

                <div className="flex justify-between items-center mt-1">
                    <span className="font-bold text-gray-900">
                        {property.price.toLocaleString('ru-RU')} ₽
                    </span>

                    {lastMessage && (
                        <p className="text-sm text-gray-500 truncate max-w-[60%]">
                            {lastMessage.messageType === 'text'
                                ? (lastMessage.senderId === currentUserId
                                    ? `Вы: ${lastMessage.textOrPathToFile}`
                                    : lastMessage.textOrPathToFile)
                                : '📎 Файл'}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatItem;