import { $host, $authHost } from '../http/http';

const UserService = {
    // Регистрация
    async registration(email, password, name, role) {
        const { data } = await $host.post('/api/user/registration', { email, password, name, role });
        return data;
    },

    // Логин
    async login(email, password) {
        const { data } = await $authHost.post('/api/user/login', { email, password });
        return data;
    },

    // Логаут
    async logout() {
        const { data } = await $authHost.post('/api/user/logout');
        return data;
    },

    // Обновление access и refresh токенов
    async refresh() {
        const { data } = await $authHost.get('/api/user/refresh');
        return data;
    },

    // Обновление профиля (имя и/или аватар)
    async updateProfile({ name, avatar }) {
        const { data } = await $authHost.put('/api/user/profile', { name, avatar });
        return data;
    },

    // Получение всех пользователей (например, для админки)
    async getAllUsers() {
        const { data } = await $authHost.get('/api/user');
        return data;
    },
};

export default UserService;
