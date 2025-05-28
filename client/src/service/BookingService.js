import { $authHost } from "../http/http";

const BookingService = {
    // Создание бронирования
    async create(bookingData) {
        return await $authHost.post('/api/booking', bookingData);
    },

    // Получение всех бронирований (для админа/аналитика)
    async getAll() {
        return await $authHost.get('/api/booking');
    },

    // Получение бронирования по ID
    async getById(id) {
        return await $authHost.get(`/api/booking/${id}`);
    },

    // Получение бронирований текущего пользователя (как клиент)
    async getMyBookings() {
        return await $authHost.get('/api/booking/my/bookings');
    },

    // Получение бронирований на объекты пользователя (как владелец)
    async getBookingsForMyProperties() {
        return await $authHost.get('/api/booking/owner/bookings');
    },

    // Обновление статуса бронирования (владелец объекта)
    async updateStatus(id, status) {
        return await $authHost.put(`/api/booking/${id}/status`, { status });
    },

    // Удаление бронирования (только если статус — 'new')
    async delete(id) {
        return await $authHost.delete(`/api/booking/${id}`);
    }
};

export default BookingService;
