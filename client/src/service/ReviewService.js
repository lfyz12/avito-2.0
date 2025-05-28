import { $authHost } from "../http/http";

const ReviewService = {
    // Создание отзыва
    async create({ propertyId, rating, text }) {
        return await $authHost.post('/api/review', {
            propertyId,
            rating,
            text
        });
    },

    // Получение всех отзывов для конкретного объекта
    async getForProperty(propertyId) {
        return await $authHost.get(`/api/review/property/${propertyId}`);
    },

    // Получение всех отзывов текущего пользователя
    async getMyReviews() {
        return await $authHost.get('/api/review/my');
    },

    // Удаление отзыва по ID
    async delete(id) {
        return await $authHost.delete(`/api/review/${id}`);
    }
};

export default ReviewService;
