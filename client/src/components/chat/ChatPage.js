// ChatPage.jsx
import React, {useContext, useEffect} from 'react';
import { observer } from 'mobx-react-lite';
import { Layout, Row, Col } from 'antd';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import {Context} from "../../index";

const { Header, Content } = Layout;

const ChatPage = observer(() => {
    const { chatStore, userStore } = useContext(Context);
    const currentUser = userStore.user;

    useEffect(() => {
        if (currentUser?.id) {
            chatStore.fetchChats(currentUser.id);
        }
    }, [currentUser]);

    useEffect(() => {
        if (!chatStore.socket) {
            chatStore.initWebSocket();
        }
    }, []);

    const handleSelectChat = async (chat) => {
        await chatStore.fetchChatById(chat.id);
    };

    const handleSendMessage = (chatId, text) => {
        chatStore.sendMessage(chatId, userStore.user.id, text);
    };

    const handleFileUpload = (chatId, file) => {
        chatStore.uploadFile(chatId, userStore.user.id, file);
    };

    return (
        <Layout className="min-h-[90vh]">
            <Content className="flex-grow flex bg-gray-50" style={{ height: 'calc(100vh - 64px)' }}>
                <Row className="w-full h-full">
                    <Col
                        span={8}
                        className="h-full flex flex-col bg-white border-r border-gray-200"
                        style={{ height: 'inherit' }}
                    >
                        <div className="p-4 border-b border-gray-200 bg-white">
                            <h2 className="text-lg font-semibold m-0 text-gray-900">Диалоги</h2>
                        </div>
                        <div className="flex-grow overflow-hidden">
                            <ChatList
                                chats={chatStore.chats}
                                currentUserId={currentUser?.id}
                                onSelectChat={handleSelectChat}
                            />
                        </div>
                    </Col>

                    <Col
                        span={16}
                        className="h-full bg-white"
                        style={{ height: 'inherit' }}
                    >
                        <ChatWindow
                            activeChat={chatStore.activeChat}
                            messages={chatStore.messages}
                            currentUserId={currentUser?.id}
                            onSendMessage={handleSendMessage}
                            onFileUpload={handleFileUpload}
                            loading={chatStore.loading}
                        />
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
});

export default ChatPage;