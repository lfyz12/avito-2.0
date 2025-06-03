// src/components/ChatSelector.js
import React from 'react';

const ChatSelector = ({ chats, onSelectChat }) => {
    return (
        <div className="chat-selector">
            <h2>Выберите чат</h2>
            <div className="chats-list">
                {chats.map(chatId => (
                    <div
                        key={chatId}
                        className="chat-item"
                        onClick={() => onSelectChat(chatId)}
                    >
                        Чат #{chatId}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatSelector;