import { $authHost } from '../http/http';

const LikeService = {
    // Получить все избранные объекты текущего пользователя
    async getLikedProperties() {
        const { data } = await $authHost.get('/api/like');
        return data;
    },

    // Добавить объект в избранное
    async add(propertyId) {
        const { data } = await $authHost.post('/api/like', { propertyId });
        return data;
    },

    // Удалить объект из избранного
    async remove(propertyId) {
        const { data } = await $authHost.delete(`/api/like/${propertyId}`);
        return data;
    },
};

export default LikeService;
