// components/property/PriceBox.jsx
import React, { useContext, useState } from 'react';
import { FaHeart, FaPhone, FaShareAlt, FaCalendarAlt } from "react-icons/fa";
import { Context } from "../../index";
import { observer } from "mobx-react-lite";
import BookingModal from "../BookingModal";

const PriceBox = ({ property, formatPrice, showPhone, onShow, toggleLike, openChatModal }) => {
    const { likeStore, userStore, chatStore } = useContext(Context);
    const [showBookingModal, setShowBookingModal] = useState(false);

    const handleBooking = (e) => {
        e.stopPropagation();
        if (!userStore.isAuth) {
            alert('Для бронирования необходимо войти в систему');
            return;
        }
        setShowBookingModal(true);
    };

    const handleWrite = async () => {
        await chatStore.startChat(property.ownerId);
        openChatModal();
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                        {formatPrice(property.price)}
                    </div>
                    {property.type === 'apartment' && (
                        <div className="text-gray-600">
                            {Math.round(property.price / property.area)} ₽/м²
                        </div>
                    )}
                </div>

                <div className="flex space-x-3 mt-4 md:mt-0">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(e);
                        }}
                        className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition"
                    >
                        <FaHeart
                            className={`w-5 h-5 ${likeStore.isLiked(property.id) ? 'text-red-500' : 'text-gray-500'}`}
                            fill={'currentColor'}
                        />
                    </button>
                    <button
                        className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition"
                    >
                        <FaShareAlt className="text-gray-600"/>
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap gap-3">
                <button
                    onClick={onShow}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition flex items-center justify-center"
                >
                    <FaPhone className="mr-2"/>
                    {showPhone ? property.owner?.phone || 'Нет телефона' : 'Показать телефон'}
                </button>
                <button onClick={handleWrite}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition"
                >
                    Написать сообщение
                </button>

                <button
                    onClick={handleBooking}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-4 rounded-lg font-medium transition flex items-center justify-center"
                >
                    <FaCalendarAlt className="mr-2"/>
                    Забронировать
                </button>
            </div>

            {showBookingModal && (
                <BookingModal
                    property={property}
                    onClose={() => setShowBookingModal(false)}
                />
            )}
        </div>
    );
};

export default observer(PriceBox);