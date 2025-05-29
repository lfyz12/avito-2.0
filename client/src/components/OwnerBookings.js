// components/booking/OwnerBookings.jsx
import React, { useEffect, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import BookingCard from './BookingCard';
import { formatDate, formatPrice } from '../utils/helpers';
import {Context} from "../index";

const OwnerBookings = observer(() => {
    const { bookingStore } = useContext(Context);

    useEffect(() => {
        bookingStore.fetchBookingsForMyProperties();
    }, []);

    const getStatusText = (status) => {
        const statusMap = {
            'pending': 'Новый',
            'processing': 'В обработке',
            'confirmed': 'Подтвержден',
            'rejected': 'Отклонен',
            'completed': 'Завершен',
            'canceled': 'Отменен'
        };
        return statusMap[status] || status;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Бронирования моих объектов</h1>

            {bookingStore.loading ? (
                <div className="flex justify-center items-center min-h-[300px]">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : bookingStore.error ? (
                <div className="bg-red-50 rounded-xl p-4 mb-6">
                    <p className="text-red-700">{bookingStore.error}</p>
                </div>
            ) : bookingStore.ownerBookings.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-200">
                    <svg className="mx-auto h-16 w-16 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">Бронирований нет</h3>
                    <p className="mt-1 text-gray-500">На ваши объекты еще не бронировали</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {bookingStore.ownerBookings.map(booking => (
                        <BookingCard
                            key={booking.id}
                            booking={booking}
                            isOwner={true}
                            getStatusText={getStatusText}
                        />
                    ))}
                </div>
            )}
        </div>
    );
});

export default OwnerBookings;