// ChatWindow.jsx
import React, {useEffect, useRef, useState} from 'react';
import Message from './Message';
import MessageInput from './MessageInput';
import { Spin, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';

const ChatWindow = ({
                        activeChat,
                        messages,
                        currentUserId,
                        onSendMessage,
                        onFileUpload,
                        loading
                    }) => {
    const messagesEndRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(false);
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        // messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSend = text => {
        onSendMessage(activeChat.id, text);
    };

    const handleFileUpload = e => {
        if (e.target.files[0]) {
            onFileUpload(activeChat.id, e.target.files[0]);
            setSelectedFile(true)
            e.target.value = null;
        }
    };

    if (!activeChat) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center mb-4">
                    <HomeOutlined className="text-2xl text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-1">Выберите диалог</h3>
                <p className="text-center text-gray-500 max-w-md">
                    Начните общение по выбранному объявлению, чтобы видеть сообщения здесь
                </p>
            </div>
        );
    }

    const interlocutor = activeChat.user1.id === currentUserId
        ? activeChat.user2
        : activeChat.user1;

    const property = activeChat.Property;

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
                <div className="flex items-center">
                    <Avatar
                        src={process.env.REACT_APP_API_URL + 'static/' + interlocutor.avatar}
                        className="mr-3"
                    />
                    <div>
                        <div className="font-semibold text-gray-900">{interlocutor.name}</div>
                        <div className="text-xs text-gray-500">
                            {interlocutor.role === 'owner' ? 'Собственник' : 'Потенциальный арендатор'}
                        </div>
                    </div>
                </div>

                <div className="flex items-center">
                    <div className="text-right mr-3 max-w-xs">
                        <div className="font-medium text-sm text-gray-900 truncate">
                            {property?.title || 'Объявление удалено'}
                        </div>
                        {property && (
                            <div className="text-xs text-gray-500 truncate">
                                {property.location}
                            </div>
                        )}
                    </div>

                    {property ? (
                        <Link
                            to={`/property/${property.id}`}
                            target="_blank"
                            className="flex-shrink-0"
                        >
                            <Avatar
                                src={process.env.REACT_APP_API_URL + 'static/' + property.photos?.[0]}
                                shape="square"
                                className="!w-12 !h-12 !rounded-lg"
                            />
                        </Link>
                    ) : (
                        <div className="bg-gray-200 border-2 border-dashed rounded-lg w-12 h-12 flex items-center justify-center">
                            <HomeOutlined className="text-xl text-gray-400" />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-grow overflow-y-auto flex flex-col justify-end p-4 bg-gray-50">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <Spin size="large" />
                    </div>
                ) : (
                    <>
                        {messages.length > 0 ? (
                            messages.map(message => (
                                <Message
                                    key={message.id}
                                    message={message}
                                    currentUserId={currentUserId}
                                />
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                                <h3 className="text-lg font-medium mb-1">Нет сообщений</h3>
                                <p className="text-center max-w-md">
                                    Начните общение — отправьте первое сообщение
                                </p>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            <MessageInput
                onSend={handleSend}
                onFileUpload={handleFileUpload}
                isSelectedFile={selectedFile}
                resetFile={() => setSelectedFile(false)}
            />
        </div>
    );
};

export default ChatWindow;