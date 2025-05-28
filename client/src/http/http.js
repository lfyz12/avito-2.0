import axios from "axios";

const $host = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

const $authHost = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true // Для работы с cookie
});

// Добавляем токен в заголовки авторизованных запросов
$authHost.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Перехватчик ответов для автоматического обновления токена при 401 ошибке
$authHost.interceptors.response.use(
    (config) => config, // Успешные ответы пропускаем как есть
    async (error) => {
        const originalRequest = error.config;

        // Если ошибка 401 и это не повторный запрос
        if (error.response.status == 401 && !originalRequest._isRetry) {
            originalRequest._isRetry = true;
            try {
                // Запрашиваем новый accessToken через refreshToken (из кук)
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}api/user/refresh`,
                    { withCredentials: true }
                );

                // Сохраняем новый токен и повторяем исходный запрос
                localStorage.setItem('accessToken', response.data.tokens.accessToken);
                return $authHost.request(originalRequest);
            } catch (e) {
                console.log('Пользователь не авторизован');
            }
        }
        throw error; // Пробрасываем другие ошибки
    }
);

export {
    $host,    // Для публичных запросов
    $authHost // Для авторизованных запросов
};