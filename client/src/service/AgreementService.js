import { $authHost } from "../http/http";

const AgreementService = {
    // Создание договора
    async create({ bookingId, document }) {
        return await $authHost.post('/api/agreement', {
            bookingId,
            document
        });
    },

    // Получить договор по ID
    async getOne(id) {
        return await $authHost.get(`/api/agreement/${id}`);
    },

    // Получить договор по ID бронирования
    async getByBooking(bookingId) {
        return await $authHost.get(`/api/agreement/booking/${bookingId}`);
    },

    // Удалить договор по ID (если используется)
    async delete(id) {
        return await $authHost.delete(`/api/agreement/${id}`);
    }
};

export default AgreementService;
