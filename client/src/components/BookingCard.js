// components/booking/BookingCard.jsx
import React, {useState, useContext, useEffect} from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { formatDate, formatPrice } from '../utils/helpers';
import { PROPERTYROUTER } from '../utils/consts';
import {Context} from "../index";

const BookingCard = observer(({ booking, isOwner, getStatusText }) => {
    const { bookingStore, userStore } = useContext(Context);
    const navigate = useNavigate();
    const [isUpdating, setIsUpdating] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(booking.status);
    const [owner, setOwner] = useState({});
    useEffect(() => {
        userStore.getAllUsers().then(res => {
            setOwner(res.find(u => u.id === booking.Property.ownerId))
        })
    }, []);

    const handleStatusChange = async (e) => {
        e.stopPropagation();
        const newStatus = e.target.value;
        setSelectedStatus(newStatus);

        if (newStatus !== booking.status) {
            setIsUpdating(true);
            try {
                await bookingStore.updateBookingStatus(booking.id, newStatus);
            } catch (e) {
                console.error('Ошибка при обновлении статуса:', e);
                setSelectedStatus(booking.status); // Возвращаем предыдущий статус при ошибке
            } finally {
                setIsUpdating(false);
            }
        }
    };

    const getStatusColor = () => {
        switch (booking.status) {
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'rejected':
            case 'canceled':
                return 'bg-red-100 text-red-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            case 'processing':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    const navigateToProperty = (e) => {
        e.stopPropagation();
        navigate(`${PROPERTYROUTER}/${booking.Property.id}`);
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-shadow hover:shadow-md">
            <div className="p-5">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Изображение объекта */}
                    <div
                        className="w-full md:w-1/3 h-48 rounded-lg overflow-hidden cursor-pointer"
                        onClick={navigateToProperty}
                    >
                        {booking.Property.photos?.length > 0 ? (
                            <img
                                src={`${process.env.REACT_APP_API_URL}static/${booking.Property.photos[0]}`}
                                alt={booking.Property.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center">
                                <span className="text-gray-500">Нет изображения</span>
                            </div>
                        )}
                    </div>

                    {/* Информация о бронировании */}
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3
                                    className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer"
                                    onClick={navigateToProperty}
                                >
                                    {booking.Property.title}
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    {booking.Property.location}
                                </p>
                            </div>

                            <div className="flex flex-col items-end">
                                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
                                    {getStatusText(booking.status)}
                                </div>
                                <div className="text-xl font-bold mt-2">
                                    {formatPrice(booking.totalPrice)}
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Период бронирования</p>
                                <p className="font-medium">
                                    {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24))} ночей
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    {isOwner ? 'Гость' : 'Владелец'}
                                </p>
                                <p className="font-medium">
                                    {isOwner ? booking.client?.name || 'Неизвестно' : owner?.name || 'Неизвестно'}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {isOwner ? booking.client?.phone || 'Телефон не указан' : owner?.phone || 'Телефон не указан'}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <p className="text-sm text-gray-500">Дата создания</p>
                            <p className="font-medium">
                                {formatDate(booking.createdAt)}
                            </p>
                        </div>

                        {isOwner && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-500 mb-2">Изменить статус</p>
                                <div className="flex flex-wrap gap-2">
                                    <select
                                        value={selectedStatus}
                                        onChange={handleStatusChange}
                                        disabled={isUpdating}
                                        className={`px-3 py-2 rounded-lg border ${
                                            isUpdating ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                                        }`}
                                    >
                                        <option value="pending">Новый</option>
                                        <option value="processing">В обработке</option>
                                        <option value="confirmed">Подтвержден</option>
                                        <option value="rejected">Отклонен</option>
                                    </select>

                                    {isUpdating && (
                                        <div className="flex items-center text-gray-500">
                                            <div className="w-4 h-4 border-t-2 border-blue-500 rounded-full animate-spin mr-2"></div>
                                            Сохранение...
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {!isOwner && (booking.status === 'pending' || booking.status === 'processing') && (
                            <div className="mt-4">
                                <button
                                    onClick={() => handleStatusChange({ target: { value: 'canceled' } })}
                                    disabled={isUpdating}
                                    className={`px-4 py-2 rounded-lg font-medium transition ${
                                        isUpdating
                                            ? 'bg-gray-300 cursor-not-allowed'
                                            : 'bg-red-600 hover:bg-red-700 text-white'
                                    }`}
                                >
                                    {isUpdating ? 'Обработка...' : 'Отменить бронирование'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {booking.status === 'confirmed' && (
                <div className="bg-blue-50 px-5 py-3">
                    <p className="text-sm text-blue-700">
                        {isOwner
                            ? `Бронирование подтверждено. Ожидайте гостя с ${formatDate(booking.startDate)}`
                            : `Бронирование подтверждено. Заезд ${formatDate(booking.startDate)}`
                        }
                    </p>
                </div>
            )}
        </div>
    );
});

export default BookingCard;