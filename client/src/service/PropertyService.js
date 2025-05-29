import { $authHost, $host } from "../http/http";

const PropertyService = {
    // Создание объекта недвижимости
    async create(propertyData) {
        return await $authHost.post('/api/property', propertyData);
    },

    // Получение всех объектов недвижимости с пагинацией и фильтрацией
    async getAll(params = {}) {
        // Преобразование массива удобств в формат, понятный серверу
        if (params.amenities && Array.isArray(params.amenities)) {
            params.amenities = params.amenities.join(',');
        }

        return await $host.get('/api/property', {
            params: {
                page: params.page || 1,
                limit: params.limit || 12,
                minPrice: params.minPrice,
                maxPrice: params.maxPrice,
                type: params.type,
                rooms: params.rooms,
                location: params.location,
                amenities: params.amenities,
                sortBy: params.sortBy,
                sortOrder: params.sortOrder,
            }
        });
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
    },

};

export default PropertyService;