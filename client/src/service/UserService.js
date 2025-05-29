import { $host, $authHost } from '../http/http';

const UserService = {
    // Регистрация
    async registration(email, password, name, role, phone) {
        const { data } = await $authHost.post('/api/user/registration', { email, password, name, role, phone });
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
    async updateProfile(userData) {
        const formData = new FormData();
        console.log(formData, userData, "PROVERKA111")
        formData.append('avatar', userData);
        console.log(formData.get('avatar'), userData, "PROVERKA222")
        const { data } = await $authHost.put('/api/user/profile', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return data;
    },

    // Получение всех пользователей (например, для админки)
    async getAllUsers() {
        const { data } = await $authHost.get('/api/user');
        return data;
    },
};

export default UserService;
