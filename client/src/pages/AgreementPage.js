// components/agreement/AgreementPage.jsx
import React, {useEffect, useContext, useState} from 'react';
import { observer } from 'mobx-react-lite';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDate } from '../utils/helpers';
import {Context} from "../index";
import BookingCard from "../components/BookingCard";

const AgreementPage = observer(() => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const { bookingStore, agreementStore, userStore } = useContext(Context);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [owner, setOwner] = useState(null)

    // Функция для преобразования статуса в текст
    const getStatusText = (status) => {
        const statusMap = {
            pending: 'Ожидает подтверждения',
            processing: 'В обработке',
            confirmed: 'Подтверждено',
            rejected: 'Отклонено',
            canceled: 'Отменено',
            completed: 'Завершено'
        };
        return statusMap[status] || status;
    };

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Загружаем данные бронирования

                await bookingStore.fetchBookingById(bookingId);

                // Проверяем доступ пользователя к бронированию
                const booking = bookingStore.selectedBooking;
                const isOwner = userStore.user?.id === booking?.Property?.ownerId;
                const isClient = userStore.user?.id === booking?.userId;
                await userStore.getAllUsers().then(res => setOwner(res.find(u => u.id === booking?.Property?.ownerId)))

                if (!isOwner && !isClient) {
                    throw new Error('У вас нет доступа к этому договору');
                }

                // Загружаем договор, если он существует
                await agreementStore.fetchAgreementByBooking(bookingId);
            } catch (e) {
                setError(e.message || 'Ошибка загрузки данных');
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };

        if (bookingId) {
            loadData();
        }

        return () => {
            bookingStore.clearSelected();
            agreementStore.clear();
        };
    }, [bookingId]);

    const handleCreateAgreement = async () => {
        try {
            await agreementStore.createAgreement(bookingId);
        } catch (e) {
            setError(e.message || 'Ошибка создания договора');
        }
    };

    const handleDownloadAgreement = async () => {
        try {
            await agreementStore.downloadAgreement();
        } catch (e) {
            setError(e.message || 'Ошибка скачивания договора');
        }
    };

    const booking = bookingStore.selectedBooking;
    const agreement = agreementStore.agreement;
    const isOwner = userStore.user?.id === booking?.Property?.ownerId;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Назад
                </button>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="text-center py-10">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Бронирование не найдено</h3>
                    <p className="mt-1 text-sm text-gray-500">Запрошенное бронирование не существует или было удалено</p>
                    <div className="mt-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Назад
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Договор аренды</h1>

            <BookingCard
                booking={booking}
                isOwner={isOwner}
                getStatusText={getStatusText}
            />

            <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Договор аренды #{agreement?.id || 'не создан'}
                        </h2>
                        <p className="text-gray-500 mt-1">
                            Для бронирования #{booking.id}
                        </p>
                    </div>

                    {agreement && (
                        <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Создан
                        </div>
                    )}
                </div>

                {agreement ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Дата создания договора</p>
                                <p className="font-medium">{formatDate(agreement.createdAt)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Статус договора</p>
                                <p className="font-medium">Действителен</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-500 mb-2">Участники договора</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <p className="font-medium text-gray-900">Арендодатель</p>
                                    <p className="mt-1">{owner?.name || 'Не указано'}</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {owner?.phone || 'Телефон не указан'}
                                    </p>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <p className="font-medium text-gray-900">Арендатор</p>
                                    <p className="mt-1">{booking.client?.name || 'Не указано'}</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {booking.client?.phone || 'Телефон не указан'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                onClick={handleDownloadAgreement}
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                disabled={agreementStore.isLoading}
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Скачать договор
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">Договор не создан</h3>
                        <p className="mt-2 text-sm text-gray-500">
                            Для этого бронирования еще не был создан договор аренды.
                        </p>
                        <div className="mt-6">
                            <button
                                onClick={handleCreateAgreement}
                                disabled={agreementStore.isLoading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center mx-auto"
                            >
                                {agreementStore.isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                                        Создание...
                                    </>
                                ) : (
                                    'Создать договор'
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-6 flex justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                    Назад
                </button>

                {agreement && (
                    <button
                        onClick={() => window.print()}
                        className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Печать
                    </button>
                )}
            </div>
        </div>
    );
});

export default AgreementPage;