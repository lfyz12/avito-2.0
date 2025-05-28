import { $authHost, $host } from "../http/http";

const PropertyService = {
    // Создание объекта недвижимости
    async create(propertyData) {
        return await $authHost.post('/api/property', propertyData);
    },

    // Получение всех объектов недвижимости
    async getAll() {
        return await $host.get('/api/property');
    },

    // Получение объекта недвижимости по ID
    async getById(id) {
        return await $host.get(`/api/property/${id}`);
    },

    // Обновление объекта (только владелец)
    async update(id, propertyData) {
        return await $authHost.put(`/api/property/${id}`, propertyData);
    },

    // Удаление объекта (только владелец)
    async delete(id) {
        return await $authHost.delete(`/api/property/${id}`);
    },

    // Получение объектов текущего пользователя
    async getMyProperties() {
        return await $authHost.get('/api/property/my/properties');
    }
};

export default PropertyService;
