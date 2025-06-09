import { $authHost } from '../http/http';

const ChatService = {
    // Получить все избранные объекты текущего пользователя
    async createChat(user1Id, user2Id, propertyId) {
        const { data } = await $authHost.post('/api/chat', {user1Id, user2Id, propertyId});
        return data;
    },

    // Добавить объект в избранное
    async getChats(userId) {
        const { data } = await $authHost.get('/api/chat/' + userId);
        return data;
    },

    // Удалить объект из избранного
    async getMessages(chatId) {
        const { data } = await $authHost.get(`/api/chat/messages/` + chatId);
        return data;
    },

    async getChatyId(chatId) {
        const { data } = await $authHost.get(`/api/chat/user/` + chatId);
        return data;
    },

    async uploadFile(formData) {
        const { data } = await $authHost.post('/api/chat/file', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return data;
    }
};

export default ChatService;
