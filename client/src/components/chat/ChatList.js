// ChatList.jsx
import React from 'react';
import ChatItem from './ChatItem';

const ChatList = ({ chats, currentUserId, onSelectChat }) => {
    return (
        <div className="h-full overflow-y-auto">
            {chats.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-4 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p>У вас пока нет диалогов</p>
                </div>
            ) : (
                chats.map(chat => (
                    <ChatItem
                        key={chat.id}
                        chat={chat}
                        currentUserId={currentUserId}
                        onClick={onSelectChat}
                    />
                ))
            )}
        </div>
    );
};

export default ChatList;