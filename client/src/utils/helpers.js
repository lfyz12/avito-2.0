// utils/helpers.js
// Форматирование даты в "1 января 2023"
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    };
    return date.toLocaleDateString('ru-RU', options);
};

// Форматирование цены с разделителями
export const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
};

// Форматирование даты в "01.01.2023"
export const formatDateShort = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
};