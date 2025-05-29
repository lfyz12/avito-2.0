// components/property/BookingModal.jsx
import React, {useState, useEffect, useContext} from 'react';
import { observer } from 'mobx-react-lite';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {Context} from "../index";

const BookingModal = observer(({ property, onClose }) => {
    const { bookingStore, userStore } = useContext(Context);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Расчет стоимости бронирования
    useEffect(() => {
        if (startDate && endDate) {
            const diffTime = Math.abs(endDate - startDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setTotalPrice(diffDays * property.price);
        }
    }, [startDate, endDate, property.price]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userStore.isAuth) {
            setError('Для бронирования необходимо войти в систему');
            return;
        }

        if (!startDate || !endDate) {
            setError('Выберите даты бронирования');
            return;
        }

        if (startDate >= endDate) {
            setError('Дата выезда должна быть позже даты заезда');
            return;
        }

        setIsLoading(true);
        try {
            await bookingStore.createBooking(
                property.id,
                startDate.toISOString(),
                endDate.toISOString(),
                totalPrice
            );
            onClose();
            alert('Бронирование успешно создано!');
        } catch (err) {
            setError(err.message || 'Ошибка при бронировании');
        } finally {
            setIsLoading(false);
        }
    };

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div
                className="bg-white rounded-xl w-full max-w-md p-6"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Бронирование</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Дата заезда
                        </label>
                        <DatePicker
                            selected={startDate}
                            onChange={date => setStartDate(date)}
                            minDate={today}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            placeholderText="Выберите дату"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Дата выезда
                        </label>
                        <DatePicker
                            selected={endDate}
                            onChange={date => setEndDate(date)}
                            minDate={startDate || tomorrow}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            placeholderText="Выберите дату"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Стоимость бронирования
                        </label>
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <p className="text-lg font-bold">
                                {totalPrice.toLocaleString('ru-RU')} ₽
                            </p>
                            {startDate && endDate && (
                                <p className="text-sm text-gray-500 mt-1">
                                    {Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))} дней ×
                                    {property.price.toLocaleString('ru-RU')} ₽/сутки
                                </p>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 text-red-500 text-sm">{error}</div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 px-4 rounded-lg font-medium transition ${
                            isLoading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                        }`}
                    >
                        {isLoading ? 'Обработка...' : 'Подтвердить бронирование'}
                    </button>
                </form>
            </div>
        </div>
    );
});

export default BookingModal;