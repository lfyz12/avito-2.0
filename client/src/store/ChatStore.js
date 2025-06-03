import {makeAutoObservable, runInAction} from "mobx";
import ChatService from "../service/ChatService";

class ChatStore {
    chats = [];
    activeChat = null;
    messages = [];
    socket = null;
    loading = false;
    error = null;

    constructor() {
        makeAutoObservable(this);
    }


    // Создать или получить чат
    async createChat(user1Id, user2Id, propertyId)  {
        this.loading = true;
        try {

            runInAction(() => {
                this.error = null;
            });

            // Отправка на сервер
            const { data } = await ChatService.createChat(user1Id, user2Id, propertyId);

            // Замена временного объекта на реальный
            runInAction(() => {
                this.setActiveChat(data)

            });

            return data;
        } catch (err) {
            runInAction(() => {
                this.error = err.response?.data?.message || "Ошибка при создании чата";
            });
            throw err;
        } finally {
            runInAction(() => this.loading = false);
        }
    }

    async fetchMessages(chatId) {
        this.loading = true;
        this.error = null;
        try {
            const data = await ChatService.getMessages(chatId);
            runInAction(() => {
                this.messages = data;
                this.loading = false;
            });
        } catch (e) {
            runInAction(() => {
                this.error = e.response?.data?.message || 'Ошибка при загрузке избранного';
                this.loading = false;
            });
        }
    }
    async fetchChatById(chatId) {
        this.loading = true;
        this.error = null;
        try {
            const data = await ChatService.getChatyId(chatId);
            runInAction(() => {
                console.log(data)
                this.setActiveChat(data);
                this.loading = false;
            });
            await this.fetchMessages(chatId)
        } catch (e) {
            runInAction(() => {
                this.error = e.response?.data?.message || 'Ошибка при загрузке избранного';
                this.loading = false;
            });
        }
    }


    async fetchChats(userId) {
        this.loading = true;
        this.error = null;
        try {
            const data = await ChatService.getChats(userId);
            runInAction(() => {
                this.chats = data;
                console.log(data)
                this.loading = false;
            });
        } catch (e) {
            runInAction(() => {
                this.error = e.response?.data?.message || 'Ошибка при загрузке избранного';
                this.loading = false;
            });
        }
    }

    // Выбрать активный чат
    setActiveChat = async (chat) => {
        if (!this.socket) this.initWebSocket();
        this.activeChat = chat;
    };

    initWebSocket() {
        if (this.socket) return;

        this.socket = new WebSocket(process.env.REACT_APP_WS_URL);

        this.socket.onopen = () => {
            console.log('WebSocket connected');
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === 'newMessage') {
                runInAction(() => {
                    // ФИКС: сравнение ID как чисел
                    const messageChatId = Number(data.message.chatId);
                    const activeChatId = this.activeChat?.id;

                    // ФИКС: добавляем сообщение в активный чат
                    if (this.activeChat && activeChatId === messageChatId) {
                        // Оптимистичное обновление
                        this.messages = [...this.messages, data.message];
                    }

                    // ФИКС: обновляем lastMessage в списке чатов
                    const chatIndex = this.chats.findIndex(c => c.id === messageChatId);
                    if (chatIndex !== -1) {
                        // Создаем обновленный чат с новым сообщением
                        const updatedChat = {
                            ...this.chats[chatIndex],
                            lastMessage: data.message // или другое поле, в зависимости от вашей структуры
                        };

                        // Обновляем массив чатов
                        this.chats = [
                            ...this.chats.slice(0, chatIndex),
                            updatedChat,
                            ...this.chats.slice(chatIndex + 1)
                        ];
                    }
                });
            }
        };

        this.socket.onclose = () => {
            console.log('WebSocket disconnected');
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    // Отправка сообщения
    sendMessage(chatId, senderId, text) {
        if (!this.socket) this.initWebSocket();

        // Оптимистичное обновление UI
        runInAction(() => {
            const newMessage = {
                id: Date.now(), // временный ID
                chatId,
                senderId,
                content: text,
                type: 'text',
                createdAt: new Date().toISOString(),
                isOptimistic: true // флаг для идентификации
            };

            this.messages = [...this.messages, newMessage];
        });

        // Отправка через WebSocket
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({
                chatId,
                senderId,
                content: text,
                type: 'text'
            }));
        } else {
            console.error('WebSocket not ready');
        }
    }

    // Загрузка файла
    async uploadFile(chatId, senderId, file) {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('chatId', chatId);
            formData.append('senderId', senderId);

            await ChatService.uploadFile(formData);
        } catch (error) {
            console.error('File upload error:', error);
        }
    }

}

export default ChatStore;