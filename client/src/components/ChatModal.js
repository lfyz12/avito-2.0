import React, {useContext, useEffect, useState} from 'react';
import { observer } from 'mobx-react-lite';
import {Context} from "../index";

const ChatModal = observer(({ open, onClose, targetUserId }) => {
    const [message, setMessage] = useState('');
    const {chatStore, userStore} = useContext(Context)

    // Инициализация чата при открытии
    useEffect(() => {
        if (open && userStore.user) {
            chatStore.setUser(userStore.user.id);

            // Если передан targetUserId, открываем чат с этим пользователем
            if (targetUserId) {
                chatStore.startChat(targetUserId);
            }
        }
    }, [open, userStore.user, targetUserId]);

    // Отправка сообщения
    const handleSend = () => {
        if (message.trim() && chatStore.currentChatUserId) {
            chatStore.sendMessage(message);
            setMessage('');
        }
    };

    // Форматирование времени сообщения
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
                {/* Заголовок */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">Мои чаты</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        &times;
                    </button>
                </div>

                {/* Основной контент */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Список чатов */}
                    <div className="w-1/3 border-r overflow-y-auto">
                        {chatStore.chats.map(chat => {
                            // Определяем собеседника
                            const otherUser = chat.user1.id === userStore.user.id ? chat.user2 : chat.user1;
                            const isActive = otherUser.id === chatStore.currentChatUserId;

                            return (
                                <div
                                    key={chat.id}
                                    className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 ${
                                        isActive ? 'bg-blue-50' : ''
                                    }`}
                                    onClick={() => chatStore.selectChat(chat)}
                                >
                                    {/* Аватар */}
                                    <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-3">
                                        {otherUser.name.charAt(0)}
                                    </div>

                                    {/* Информация о чате */}
                                    <div className="min-w-0">
                                        <div className="font-medium truncate">{otherUser.name}</div>
                                        <div className="text-gray-500 text-sm truncate">
                                            {chat.lastMessage?.text || 'Нет сообщений'}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Область сообщений */}
                    <div className="flex-1 flex flex-col">
                        {chatStore.currentChatUserId ? (
                            <>
                                {/* Заголовок чата */}
                                <div className="p-3 border-b">
                                    <h3 className="font-semibold">
                                        Чат с {chatStore.currentChatUser?.name}
                                    </h3>
                                </div>

                                {/* Сообщения */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                    {chatStore.messages.map(msg => (
                                        <div
                                            key={msg.id}
                                            className={`flex ${
                                                msg.fromUserId === userStore.user.id ? 'justify-end' : 'justify-start'
                                            }`}
                                        >
                                            <div
                                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                                                    msg.fromUserId === userStore.user.id
                                                        ? 'bg-blue-500 text-white rounded-br-none'
                                                        : 'bg-gray-200 rounded-bl-none'
                                                }`}
                                            >
                                                <div>{msg.text}</div>
                                                <div
                                                    className={`text-xs mt-1 ${
                                                        msg.fromUserId === userStore.user.id ? 'text-blue-100' : 'text-gray-500'
                                                    }`}
                                                >
                                                    {formatTime(msg.timestamp)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Поле ввода */}
                                <div className="p-3 border-t flex">
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Введите сообщение..."
                                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                        className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        onClick={handleSend}
                                        className="ml-2 bg-blue-500 text-white rounded-full px-4 py-2 hover:bg-blue-600 transition-colors"
                                    >
                                        Отправить
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                                <div className="text-lg mb-1">Выберите чат для общения</div>
                                <div>или начните новый диалог</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default ChatModal;